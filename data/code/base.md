---
title: JS基础
date: '2023-01-08'
tags: ['ES6', 'JS']
draft: false
description: call、bind、apply、instaceOf、new、Object.create、extends、enum
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

## 实现一个 Enum

```js
class Enum {
  constructor(...keys) {
    keys.forEach((key, i) => {
      this[key] = i
    })
    Object.freeze(this)
  }

  *[Symbol.iterator]() {
    for (let key of Object.keys(this)) yield key
  }
}

const daysEnum = new Enum(
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
)

const days = [...daysEnum] // Array of the enum values as strings
```

### 使任何 JavaScript 值可迭代

```js
const obj = { a: 1, b: 2, c: 3 }

obj[Symbol.iterator] = function* () {
  for (let key of Object.keys(obj)) yield { [key]: obj[key] }
}
;[...obj] // [ { a: 1 }, { b: 2 }, { c: 3 }]

class IterableNumber extends Number {
  *[Symbol.iterator]() {
    for (let digit of [...`${this}`].map((d) => Number.parseInt(d))) yield digit
  }
}

const num = new IterableNumber(1337)
;[...num] // [ 1, 3, 3, 7]
```

## 实现一个 struct

<details>
	<summary>代码</summary>

```js
const list = new DoublyLinkedList()

list.insertFirst(1)
list.insertFirst(2)
list.insertFirst(3)
list.insertLast(4)
list.insertAt(3, 5)

list.size // 5
list.head.value // 3
list.head.next.value // 2
list.tail.value // 4
list.tail.previous.value // 5
;[...list.map((e) => e.value)] // [3, 2, 1, 5, 4]

list.removeAt(1) // 2
list.getAt(1).value // 1
list.head.next.value // 1
;[...list.map((e) => e.value)] // [3, 1, 5, 4]

list.reverse()
;[...list.map((e) => e.value)] // [4, 5, 1, 3]

list.clear()
list.size // 0
```

### 参考实现

```js
class DoublyLinkedList {
  constructor() {
    this.nodes = []
  }

  get size() {
    return this.nodes.length
  }

  get head() {
    return this.size ? this.nodes[0] : null
  }

  get tail() {
    return this.size ? this.nodes[this.size - 1] : null
  }

  insertAt(index, value) {
    const previousNode = this.nodes[index - 1] || null
    const nextNode = this.nodes[index] || null
    const node = { value, next: nextNode, previous: previousNode }

    if (previousNode) previousNode.next = node
    if (nextNode) nextNode.previous = node
    this.nodes.splice(index, 0, node)
  }

  insertFirst(value) {
    this.insertAt(0, value)
  }

  insertLast(value) {
    this.insertAt(this.size, value)
  }

  getAt(index) {
    return this.nodes[index]
  }

  removeAt(index) {
    const previousNode = this.nodes[index - 1] || null
    const nextNode = this.nodes[index + 1] || null

    if (previousNode) previousNode.next = nextNode
    if (nextNode) nextNode.previous = previousNode

    return this.nodes.splice(index, 1)
  }

  clear() {
    this.nodes = []
  }

  reverse() {
    this.nodes = this.nodes.reduce((acc, { value }) => {
      const nextNode = acc[0] || null
      const node = { value, next: nextNode, previous: null }
      if (nextNode) nextNode.previous = node
      return [node, ...acc]
    }, [])
  }

  *[Symbol.iterator]() {
    yield* this.nodes
  }
}

const list = new DoublyLinkedList()

list.insertFirst(1)
list.insertFirst(2)
list.insertFirst(3)
list.insertLast(4)
list.insertAt(3, 5)

list.size // 5
list.head.value // 3
list.head.next.value // 2
list.tail.value // 4
list.tail.previous.value // 5
;[...list.map((e) => e.value)] // [3, 2, 1, 5, 4]

list.removeAt(1) // 2
list.getAt(1).value // 1
list.head.next.value // 1
;[...list.map((e) => e.value)] // [3, 1, 5, 4]

list.reverse()
;[...list.map((e) => e.value)] // [4, 5, 1, 3]

list.clear()
list.size // 0
```

</details>
