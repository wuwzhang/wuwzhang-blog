---
title: event loop
date: '2022/12/15'
tags: ['note', 'event loop']
draft: false
---

Event Loop ( 事件循环 )
浏览器的事件循环分为同步任务和异步任务；所有同步任务都在主线程上执行，形成一个函数调用栈（执行栈），而异步则先放到任务队列（task queue）里，任务队列又分为宏任务（macro-task）与微任务（micro-task）。下面的整个执行过程就是事件循环

- 宏任务大概包括：：script（整块代码）、setTimeout、setInterval、I/O、UI 交互事件、setImmediate（node 环境）、requestAnimationFrame (浏览器独有)
- 微任务大概包括：：new promise().then(回调)、MutationObserver(html5 新特新)、Object.observe(已废弃)、process.nextTick（node 环境）
  - 若同时存在 promise 和 nextTick，则先执行 nextTick

### 执行过程

先从 script(整块代码)开始第一次循环执行，接着对同步任务进行执行，直到调用栈被清空，然后去执行所有的微任务，当所有微任务执行完毕之后。再次从宏任务开始循环执行，直到执行完毕，然后再执行所有的微任务，就这样一直循环下去。如果在执行微队列任务的过程中，又产生了微任务，那么会加入整个队列的队尾，也会在当前的周期中执行。

## 参考文章

- [带你了解事件循环机制(Event Loop)](https://blog.csdn.net/weixin_52092151/article/details/119788483)
