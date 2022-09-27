---
title: Go's Atomic package
date: "2022-09-27"
description: Introduction to golang atomic package.
tags: ["go", "golang"]
---

## Introduction

Package atomic provides low-level atomic memory primitives for integers and pointers that are useful for implementing synchronization algorithms.

### Usage

`atomic` package provides [several functions](https://pkg.go.dev/sync/atomic#pkg-functions) which do the following 5 operations for `int`, `uint`, and `uintptr` types:

- Add
- Load
- Store
- Swap
- Compare and Swap

### Example

We won't be able to cover all of the functions here. So, let's take a look at the most commonly used function like `AddInt32` to build a synchronous counter to get an idea. 

```go
package main

import (
    "fmt"
    "sync"
    "sync/atomic"
)

func main() {

    var ops uint64
    // We’ll use an unsigned integer to represent our (always-positive) counter.

    var wg sync.WaitGroup
    // A WaitGroup will help us wait for all goroutines to finish their work.


    // We’ll start 50 goroutines that each increment the counter exactly 1000 times.
    for i := 0; i < 50; i++ {
        wg.Add(1)

        go func() {
            for c := 0; c < 1000; c++ {

                // To atomically increment the counter we use AddUint64, 
                // giving it the memory address of our ops counter with the & syntax.
                atomic.AddUint64(&ops, 1)
            }
            wg.Done()
        }()
    }

    // Wait until all the goroutines are done.
    wg.Wait()


    // It’s safe to access ops now because we know no other goroutine is writing to it. 
    // Reading atomics safely while they are being updated is 
    // also possible, using functions like atomic.LoadUint64.
    fmt.Println("ops:", ops)

    
}
```

We expect to get exactly 50,000 operations. Had we used the non-atomic ops++ to increment the counter, we’d likely get a different number, changing between runs, because the goroutines would interfere with each other. Moreover, we’d get data race failures when running with the -race flag.

```bash
go run main.go
ops: 50000
```