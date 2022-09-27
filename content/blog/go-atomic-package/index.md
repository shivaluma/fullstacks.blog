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

We won't be able to cover all of the functions here. So, let's take a look at the most commonly used function like `AddInt32` to get an idea.

```go
package main

import (
  "fmt"
	"sync"
	"sync/atomic"
)

func add(w *sync.WaitGroup, num *int32) {
	defer w.Done()
	atomic.AddInt32(num, 1)
}

func main() {
	var n int32 = 0
	var wg sync.WaitGroup

	wg.Add(1000)
	for i := 0; i < 1000; i = i + 1 {
		go add(&wg, &n)
	}

	wg.Wait()

	fmt.Println("Result:", n)
}
```

Here, `atomic.AddInt32` guarantees that the result of `n` will be 1000 as the instruction execution of atomic operations cannot be interrupted.

```bash
go run main.go
Result: 1000
```