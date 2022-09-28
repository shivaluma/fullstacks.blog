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


What is changed here compared to the above example is that sync.Pool is used to get and put the event struct, and buf values are appended to event buf field which is set to zero without assignment.

1. Get and Put the event struct using sync.Pool
2. After setting length to zero without assigning to the buf field of event, append

First, define sync.Pool to pool the event instance. Here, in the New func definition, the initial capacity of the buf field is set to 500 bytes.

```go
var eventPool = &sync.Pool{
	New: func() interface{} {
		return &event{
			buf: make([]byte, 0, 500),
		}
	},
}
```

Get an event instance from sync.Pool with newEvent func, set the length of the acquired event.buf to 0, and then append the contents of buf.

```go
func newEvent(buf []byte, level Level, done func(b []byte)) *event {
	e := eventPool.Get().(*event)
	e.buf = e.buf[:0]
	e.buf = append(e.buf, buf...)
```


Execute eventPool.Put after executing write().

```go
func Info(msg string) {
	e := newEvent([]byte(msg), InfoLevel, nil)
	e.write()
	putEvent(e)     // Internally eventPool.Put(e)
```

So messages within 500 bytes can continue to output logs without being newly allocated.

If you run the same benchmark test as before, you can see that the allocation for each operation is zero.


```go
BenchmarkEvent-16   54997969   19.17 ns/op   0 B/op   0 allocs/op
```


Strictly speaking, allocation has occurred. Looking at the result of escape analysis, you can see the result of escaping to the heap area as shown below.


```go
$ go build -gcflags '-m' event.go
    :
./event.go:53:10: &event{...} escapes to heap
./event.go:54:13: make([]byte, 0, 500) escapes to heap
```


However, both of these refer to the processing in sync.Pool’s New func (event pointer generation and slice of byte generation). By being reused by sync.Pool, it can be seen in the benchmark test that it becomes almost zero in operation units.

## In zerolog and zap


The configuration of the interface for external access (various settings such as LogWriter and specification of writing of log events at each level) differs between the above logging library and zerolog, zap. Especially in zerolog, the logging event struct is used by the method chain. However, using sync.Pool for the logging event struct is the same to zerolog and zap.


zerolog

- [event struct](https://github.com/rs/zerolog/blob/fc26014bd4e123b44e490619c6aa61238175e8fa/event.go#L22)
- [event pool](https://github.com/rs/zerolog/blob/fc26014bd4e123b44e490619c6aa61238175e8fa/event.go#L12)

zap

- [zapcore.Entry](https://github.com/uber-go/zap/blob/2e615d88d0eb88c94c15f196a538dea3fa181451/zapcore/entry.go#L145)
- [buffer Pool](https://github.com/uber-go/zap/blob/0746adf5414f2781eb05c41ab270857fa1082db6/buffer/pool.go)
- [Getting from sync.Pool and Casting](https://github.com/uber-go/zap/blob/56b4e2bfacf31ffeaa2d3ec7bee4fdb8485f81cc/zapcore/entry.go#L45)


## Other features of Go’s zero allocation
The above is a very simple example, but in reality, there may be cases where you want to have Time information or other information in the event struct field other than the output message.

However, note that using sync.Pool does not result in zero allocation for all programs.


## Do not use pointers
- The existence of new declarations for pointer variables can cause dynamic allocation
- Therefore, in this logging library example, the event pointer is targeted for sync.Pool and reused.
- event struct does not have a pointer field


## Using slice
- Dynamic allocation occurs at the timing of initializing slice
- When appending to slice, a new allocation will occur if capacity is exceeded.
- A new allocation will occur even if a new slice type variable is assigned to a slice type variable.
- Using array (fixed number of elements) is better, if possible.

When using slice repeatedly, it is better to set capacity with New func of sync.Pool as in the example of eventPool, get from sync.Pool, set the length of slice to 0, and then append.


## Use of anonymous functions also causes dynamic allocation
Dynamic allocation occurs when defining and using anonymous functions. I think it is better to avoid it in the process that you use each time.

In case an anonymous function in Fatal as shown below, func literal escapes to heap will appear in escape analysis.


```go
func Fatal(err error) {
	e := newEvent(
		[]byte(err.Error()), 
		FatalLevel, 
		func(b []byte) { os.Exit(1) },
	)
	e.write()
}
# result of go build -gcflags '-m'
./event.go:99:3: func literal escapes to heap
```


## time.Time uses pointers internally

Location (time zone information) has a pointer in the field.

A new dynamic allocation occurs when you define and use a new Location (other than UTC, Local) that has not been previously defined.

```go
tm = time.Time{} // no allocation
tm = time.Now().In(time.UTC) // no allocation
utc, _ := time.LoadLocation("UTC") // no allocation
tm = time.Now().In(utc) // no allocation
local, _ := time.LoadLocation("Local") // no allocation
tm = time.Now().In(local) // no allocation
tm = time.Now().In(time.Local) // no allocation
vnt, _ := time.LoadLocation("Asia/Ho_Chi_Minh") // allocation occurs
tm = time.Now().In(vnt)
```


It is recommended to define the Location for JST in advance and substitute it instead of executing `time.LoadLocation ("Asia / Ho_Chi_Minh ")` in the process that occurs each time. (It is even better to assign it to time.Local in advance)

There are other methods as below:
- Treat as a Unix Time integer
- Convert to []byte
- If you use func (Time) AppendFormat to convert to []byte, if the capacity of the argument is sufficient, write directly and new memory Avoid allocation
- [Usage on zerolog](https://github.com/rs/zerolog/blob/fc26014bd4e123b44e490619c6aa61238175e8fa/event.go#L660)


## interface

I would also like to mention the use of interface. It is not necessary as a log library, but I verified the case where the above code using sync.Pool was intentionally treated as an eventInterface interface as shown below.

```go
type eventInterface interface {
	write()
}
func newEventInterface(buf []byte, level Level, done func(b []byte)) eventInterface {
	return newEvent(buf, level, done) // sync.PoolGet
}
func putEventInterface(e eventInterface) {
	if _, ok := e.(*event); !ok {
		panic("invalid type")
	}
	eventPool.Put(e)
}
func Info(msg string) {
	e := newEventInterface([]byte(msg), InfoLevel, nil)
	e.write()
	putEventInterface(e)
}
```


This is the result of the benchmark test under go1.17, go1.18 environment. `BenchmarkEvent-16` is the one using only the event struct. `BenchmarkEventWithInterface-16` is the one using interface. As a result, no allocation was found.


```
BenchmarkEvent-16                63091771   17.45 ns/op   0 B/op   0 allocs/op
BenchmarkEventWithInterface-16   61353092   17.18 ns/op   0 B/op   0 allocs/op
```


Also, the result of `go build -gcflags'-m'` is also the allocation of the cast argument of panic, so I couldn't see any increase in the allocation of interface usage itself.
```
./interface.go:13:8: "invalid type" escapes to heap
```


## Memory allocation changes depending on Go version
Go allocation rules are not specified in the language specification. The allocation will change due to compiler modifications in Go version Up.

We compared the above interface example including the case where sync.Pool is not used.


![compareversion](https://miro.medium.com/max/1400/1*2fe3sGjJS4qZZeoKtXvE4w.png)


If you use interface without sync.Pool, you can see that the allocation is increased, but it is noteworthy that the allocation is further increased depending on the version of Go.

Also, if you look at the escape analysis when sync.Pool is not used, you can see that the result changes depending on the version of Go.


```go
# go 1.17
./interface.go:8:17: &event{...} escapes to heap
./interface.go:13:31: ([]byte)(msg) escapes to heap
# go 1.13
./interface.go:8:17: newEvent(buf, level, done) escapes to heap
./interface.go:8:17: &event literal escapes to heap
./interface.go:13:31: ([]byte)(msg) escapes to heap
./interface.go:13:24: newEvent(buf, level, done) escapes to heap
./interface.go:13:24: &event literal escapes to heap
```


## Summarize
1. Gather logging event information into a struct and Put/Get it in sync.Pool for use
2. When using the slice type, set a specific capacity and create it in the New func of sync.Pool. Set length to 0 after Get, then append and reuse
3. Do not use pointers except for storage in sync.Pool. Also, no pointer field is provided in the struct to be stored.
4. Avoid using anonymous functions in operations that occur each time
5. time.Time uses a pointer for timezone information. So you need one of the following:
When using a time zone other than UTC or Local, define it before using the log
Convert to UnixTime integer or []byte
6. The use of interface itself does not show dynamic allocation, but the implementation does sync.Pool
7. Memory allocation varies greatly depending on Go version
In addition to the usage of the logging library, I think that it can be used for another system which a large number of elements are created and destroyed during the process.

However, I think that it is difficult to write source code that avoids dynamic allocation just by recognizing features unless you understand the contents of the compiler. Whether or not dynamic allocation occurs when escape analysis is actually performed may vary very delicately depending on how the code is written.

Also, as noted above, Go’s allocation rules are not defined in the language specification.
This article is based on zap, zerolog and the results of [this](https://github.com/muroon/zero-alloc-log) implementation in go 1.17 and go 1.18 environments. I hope that you will refer to it as one of the achievements. The most important thing is to actually check the allocation on your application.