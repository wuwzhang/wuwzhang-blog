---
title: JS基础
date: '2022-08-03'
tags: ['ES6', 'JS']
draft: true
description:
---

## generator 原理

```js
// 使用 * 表示这是一个 Generator 函数
// 内部可以通过 yield 暂停代码
// 通过调用 next 恢复执行
function* test() {
  let a = 1 + 2
  yield 2
  yield 3
}
let b = test()
console.log(b.next()) // >  { value: 2, done: false }
console.log(b.next()) // >  { value: 3, done: false }
console.log(b.next()) // >  { value: undefined, done: true }
```

### 编译后

```js
// cb 也就是编译过的 test 函数
function generator(cb) {
  return (function () {
    var object = {
      next: 0,
      stop: function () {},
    }

    return {
      next: function () {
        var ret = cb(object)
        if (ret === undefined) return { value: undefined, done: true }
        return {
          value: ret,
          done: false,
        }
      },
    }
  })()
}
// 如果你使用 babel 编译后可以发现 test 函数变成了这样
function test() {
  var a
  return generator(function (_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        // 可以发现通过 yield 将代码分割成几块
        // 每次执行 next 函数就执行一块代码
        // 并且表明下次需要执行哪块代码
        case 0:
          a = 1 + 2
          _context.next = 4
          return 2
        case 4:
          _context.next = 6
          return 3
        // 执行完毕
        case 6:
        case 'end':
          return _context.stop()
      }
    }
  })
}
```