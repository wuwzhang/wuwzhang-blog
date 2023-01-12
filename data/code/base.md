---
title: JS基础
date: '2023-01-08'
tags: ['ES6', 'JS']
draft: false
description: extends、call/bind/apply、instaceOf、new...
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

## call

```js
Function.prototype.myCall = (ctx = window, ...args) => {
  // 判断调用对象是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const caller = Symbol()
  ctx[caller] = this

  const res = ctx[caller](...args)

  delete ctx[caller]

  return res
}
```

## apply

```js
Function.prototype.myApply = function (ctx = window, args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }

  const caller = Symbol()
  ctx[caller] = this

  const res = ctx[caller](...args)
  delete ctx[caller]

  return res
}
```

## bind

```js
Function.prototype.myBind = function (ctx = window, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }

  const caller = Symbol()
  ctx[caller] = this

  return (...arg) => {
    const res = ctx[caller](...args, ...arg)
    delete ctx[caller]
    return res
  }
}
```

## instanceOf

```js
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left)
  while (true) {
    if (proto === null) return false
    if (proto === right.prototype) return true

    proto = Object.getPrototypeOf(proto)
  }
}
```

## new

```js
const myNew = (fn, ...args) => {
  // const obj = {}
  // obj.__proto__ = fn.prototype
  const obj = Object.create(fn.prototype)

  const res = fn.call(obj, ...args)

  return res instanceof Object ? res : Object
}
```

## Object.create

```js
Object.create = (target, props) => {
  const Fn = new Function()
  Fn.prototype = target

  if (props) {
    Object.defineProperty(Fn, props)
  }

  return new Fn()
}
```

## 寄生组合继承

```js
function Parent() {
  this.name = 'par'
}

Parent.prototype.getName = function () {
  return this.name
}

function child() {
  Parent.call(this)
  this.name = 'child'
  this.friends = 'child5'
}

const clone = (child, parent) => {
  clone.prototype = Object.create(parent.prototype)
  clone.prototype.constructor = child
}

clone(Child, Parent)
```
