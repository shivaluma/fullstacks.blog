---
title: How to write a Golang Zero Allocation Logging Library
date: "2022-09-28"
description: Introduction to golang atomic package.
tags: ["go", "golang", "logging"]
---

## Introduction

Go’s logging libraries `zerolog` and `zap` have zero allocation (depending on usage). Therefore, I would like to describe how the zero allocation logging library is created, and how to make the Go source zero allocation.

## What is Zero Allocation?

(Memory) Allocation means the allocation of memory required for a program to operate, and there are those for the stack area (called static allocation) and those for the heap area (called dynamic allocation or heap allocation).
When allocating memory on stack area, the allocation size and the timing of allocation/release are statically determined when the program is written.
On the other hand, the allocation on heap area can be according to the situation when the program is executed without specifying the maximum memory allocation size at the time of declaration, and the memory is released by the garbage collector. Therefore, the performance is lower than the stack area.
Zero allocation here means that `allocs/op` in Go's benchmark test described later is zero. allocs/op is the amount of memory allocation per operation in the benchmark test, and to reduce this, it is important to reduce dynamic memory allocation onto the heap area.
Go uses a technique called [escape analysis](https://en.wikipedia.org/wiki/Escape_analysis) at compile time to choose between allocating to the stack area and allocating to the heap area.

## How to check memory allocation

There are three ways to check the memory allocation of your application with Go

![Check allocs](https://miro.medium.com/max/1400/1*ukCtQZtF-ZvcmYbiEu3ccg.png)

You can get the result of the benchmark test by `go test -bench`. 

`58056385` is the total number of executions for an operation, `ns/op` is the execution time per operation, `B/op` is the memory consumption per operation, and `allocs/op` is the amount of memory allocation per operation.

```bash
$ go test -bench .
BenchmarkEvent-16  58056385  21.30 ns/op  8 B/op  1 allocs/op
```

You can use `go build -gcflags'-m'` to get the result of escape analysis and see where the allocation occurs.

## Creating a zero allocation logging library
Let’s take a simple logging library as an example to see how to make Go without allocating memory to the heap area.


## Minimum specifications required by Go’s logging library
1. Operation by Level
    - Control output destination
    - For Fatal level, execute os.Exit(1) after output
2. Allows you to set the output method
    - Standard output
    - File output
    - Send to remote
3. Consider being executed by goroutine from the outside


## Design
1. Keep the interface that accepts data output from the outside as simple as possible.

    - For example, a method that outputs an Info log will complete writing when one func named Info is executed.

    - Make the initial settings of the logging library separately in advance.
    - Even if it is called by goroutine, if it is completed by one func, it will not be in race state and there is no problem

2. Collect logging event information such as output data in struct

Based on the above, it is often used to provide a struct that holds information related to the log output contents inside the logging library and pass it to the output process.


## Simple example
The following source as the simplest example based on the above.

```go
// LogWriter 
var LogWriter io.Writer
// event
type event struct {
	buf   []byte         // log message
	level Level          // log level
	done  func(b []byte) // after writing (for Panic, Fatal)
}
func (e event) write() {
	if e.done != nil {
		defer e.done(e.buf)
	}
	LogWriter.Write(e.buf)
}
func newEvent(buf []byte, level Level, done func(b []byte)) *event {
	return &event{
		buf:   buf,
		level: level,
		done:  done,
	}
}
// Info writes Info level log.
func Info(msg string) {
	e := newEvent([]byte(msg), InfoLevel, nil)
	e.write()
}
// Fatal writes Fatal level log.
func Fatal(err error) {
	e := newEvent([]byte(err.Error()), FatalLevel, fatalFunc)
	e.write()
}
func fatalFunc(b []byte) { os.Exit(1) }
```

Now let’s examine the memory allocation when using it in a benchmark test.

```go
func BenchmarkEvent(b *testing.B) {
	LogWriter = testWriter
	b.ReportAllocs()
	b.ResetTimer()
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			Info("test")
		}
	})
}
```

Memory allocation is occurring from the results of the benchmark test. Furthermore, if you build with `-gcflags'-m'`, you can see that newEvent func allocates it to the heap memory when the event instance is created.


```go
$ go test -bench .
BenchmarkEvent-16   58056385   21.30 ns/op   8 B/op   1 allocs/op
$ go build -gcflags '-m' event.go
    :
./event.go:42:9: &event{...} escapes to heap
```

## Use sync.Pool to reduce dynamic allocation
Use sync.Pool to reuse event.buf as much as possible.


```go
var eventPool = &sync.Pool{
	New: func() interface{} {
		return &event{
			buf: make([]byte, 0, 500),
		}
	},
}
func newEvent(buf []byte, level Level, done func(b []byte)) *event {
	e := eventPool.Get().(*event)
	e.buf = e.buf[:0]
	e.buf = append(e.buf, buf...)
	e.level = level
	e.done = nil
	if done != nil {
		e.done = done
	}
	return e
}
func putEvent(e *event) {
	eventPool.Put(e)
}
// Info writes Info level log.
func Info(msg string) {
	e := newEvent([]byte(msg), InfoLevel, nil)
	e.write()
	putEvent(e)
}
// Fatal writes Fatal level log.
func Fatal(msg string) {
	e := newEvent([]byte(err.Error()), FatalLevel, fatalFunc)
	e.write()
	putEvent(e)
}
```
