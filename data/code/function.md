---
title: 函数式编程
date: '2023-01-08'
tags: ['function', 'es6']
draft: false
summary: 手撕函数式编程
---

## curry

```js
const curry = (fn, ...args) => {
  return fn.length <= args.length ? fn(...args) : (...arg) => curry(fn, ...args, ...arg)
}

const add = (x, y, z) => x + y + z
const curryAdd = curry(add)

curryAdd(1, 2)(3)
```

## compose

```js
const compose = (...fns) => {
  return (...args) =>
    fns.reverse().reduce((pre, func) => {
      const res = func(...pre)
      return Array.isArray(res) ? res : [res]
    }, args)
}

const toUpperCase = (x) => x.toUpperCase()
const exclaim = (x) => x + '!'
const shout = compose(toUpperCase, exclaim)
const str = shout('hello world')
console.log(str)
```

## pipe

```js
const compose = (...fns) => {
  return (...args) =>
    fns.reduce((pre, func) => {
      const res = func(...pre)
      return Array.isArray(res) ? res : [res]
    }, args)
}
```

## reduce

```js
Array.prototype.reduce = function (fn, initVal) {
  const arr = this // 箭头函数拿不到this
  let cur = initVal !== undefined ? initVal : arr[0]

  for (let i = initVal !== undefined ? 0 : 1, len = arr.length; i < len; i++) {
    cur = fn(cur, arr[i], i, arr)
  }

  return cur
}
```

## flat

```js
Array.prototype.flat = function (depth = 1) {
  const arr = this
  return depth > 0
    ? arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : pre), [])
    : arr
}
```

## 实现一个迭代函数

```js
// sum(1, 2, 3).valueOf(); //6
// sum(2, 3)(2).valueOf(); //7
// sum(1)(2)(3)(4).valueOf(); //10
// sum(2)(4, 1)(2).valueOf(); //9
// sum(1)(2)(3)(4)(5)(6).valueOf(); // 21

// 1. sum 返回一个函数，收集所有的累加项，使用递归实现
// 2. 返回函数带有 valueOf 属性，用于统一计算
const sum = (...args) => {
  const f = (...rest) => sum(...args, ...rest)

  f.valueOf = () => args.reduce((pre, cur) => pre + cur, 0)

  return f
}

// 进阶
const getVal = (fn, ...args) => {
  const myFn = (...arg) => {
    const f = (...rest) => myFn(...arg, ...rest)

    f.valueOf = () => arg.reduce(fn, 0)
    return f
  }

  return myFn(...args)
}
```
