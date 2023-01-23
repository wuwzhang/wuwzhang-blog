---
title: event loop
date: '2022/12/15'
tags: ['event loop']
draft: false
---

Event Loop ( 事件循环 )
浏览器的事件循环分为同步任务和异步任务；所有同步任务都在主线程上执行，形成一个函数调用栈（执行栈），而异步则先放到任务队列（task queue）里，任务队列又分为宏任务（macro-task）与微任务（micro-task）。下面的整个执行过程就是事件循环

- 宏任务大概包括：：script（整块代码）、setTimeout、setInterval、I/O、UI 交互事件、setImmediate（node 环境）、requestAnimationFrame (浏览器独有)
- 微任务大概包括：：new promise().then(回调)、MutationObserver(html5 新特新)、Object.observe(已废弃)、process.nextTick（node 环境）
  - 若同时存在 promise 和 nextTick，则先执行 nextTick

### 执行过程

先从 script(整块代码)开始第一次循环执行，接着对同步任务进行执行，直到调用栈被清空，然后去执行所有的微任务，当所有微任务执行完毕之后。再次从宏任务开始循环执行，直到执行完毕，然后再执行所有的微任务，就这样一直循环下去。如果在执行微队列任务的过程中，又产生了微任务，那么会加入整个队列的队尾，也会在当前的周期中执行。

## Node 中的 Event loop

Node 的事件循环是 libuv 实现的

```shell
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

大体的 task（宏任务）执行顺序是这样的：

- timers 定时器：本阶段执行已经安排的 setTimeout() 和 setInterval() 的回调函数。
- pending callbacks 待定回调：执行延迟到下一个循环迭代的 I/O 回调。
- idle, prepare：仅系统内部使用。
- poll 轮询：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，它们由计时器和 setImmediate() 排定的之外），其余情况 node 将在此处阻塞。
- check 检测：setImmediate() 回调函数在这里执行。
- close callbacks 关闭的回调函数：一些准备关闭的回调函数，如：socket.on('close', ...)。

### 微任务和宏任务在 Node 的执行顺序

Node 10 以前：

- 执行完一个阶段的所有任务
- 执行完 nextTick 队列里面的内容
- 然后执行完微任务队列的内容

Node 11 以后：

- 和浏览器的行为统一了，都是每执行一个宏任务就执行完微任务队列。

```js
setTimeout(() => {
  console.log('setTimeout')
}, 0)
setImmediate(() => {
  console.log('setImmediate')
})
// 这里可能会输出 setTimeout，setImmediate
// 可能也会相反的输出，这取决于性能
// 因为可能进入 event loop 用了不到 1 毫秒，这时候会执行 setImmediate
// 否则会执行 setTimeout
```

```js
var fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('immediate')
  })
})
// 因为 readFile 的回调在 poll 中执行
// 发现有 setImmediate ，所以会立即跳到 check 阶段执行回调
// 再去 timer 阶段执行 setTimeout
// 所以以上输出一定是 setImmediate，setTimeout
```

```js
setTimeout(() => {
  console.log('timer1')

  Promise.resolve().then(function () {
    console.log('promise1')
  })
}, 0)

setTimeout(() => {
  console.log('timer2')

  Promise.resolve().then(function () {
    console.log('promise2')
  })
}, 0)

// 以上代码在浏览器和 node 中打印情况是不同的
// 浏览器中一定打印 timer1, promise1, timer2, promise2
// node 中可能打印 timer1, timer2, promise1, promise2
// 也可能打印 timer1, promise1, timer2, promise2
```

```js
// Node 中的 process.nextTick 会先于其他 microtask 执行。
setTimeout(() => {
  console.log('timer1')

  Promise.resolve().then(function () {
    console.log('promise1')
  })
}, 0)

process.nextTick(() => {
  console.log('nextTick')
})
// nextTick, timer1, promise1
```

## 参考笔记

- [Event Loop 与 requestAnimationFrame](../blog/93.md#EventLoop与requestAnimationFrame)
- [JS 的异步机制一探](../blog/149.md#1.JS的异步机制一探)
- [学习一下 Event Loop](../blog/122.md#2.做一些动图，学习一下EventLoop)

## 来源

- [带你了解事件循环机制(Event Loop)](https://blog.csdn.net/weixin_52092151/article/details/119788483)
