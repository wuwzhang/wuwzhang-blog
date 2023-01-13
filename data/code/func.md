---
title: 功能函数
date: '2023-01-08'
tags: ['function', 'es6']
draft: false
description: debounce、throttle、deepClone、shallowEqual、deepEqual、sum、sleep/delay、shuffle
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

## debounce

```js
const debounce = (func, delay = 500) => {
  let timer

  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    } else {
      timer = setTimeout(() => {
        fn(...args)
      }, delay)
    }
  }
}
```

## throttle

```js
const throttle = (func, delay = 500) => {
  let timer

  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn(...args)
        timer = null
      }, delay)
    }
  }
}
```

## deepClone

```js
const deepClone = (obj, map = new WeakMap()) => {
  if (obj === null || !(obj instanceof Object)) return obj
  if (obj instanceof Function) return (...args) => obj.call(this, ...args)
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
  if (map.has(obj)) return map.get(obj)

  const keys = Reflect.ownKeys(obj)
  // const desc = Object.getOwnPropertyDescriptor(obj);
  // const data = Object.create(Object.getPrototypeof(obj), desc);
  let data = new obj.constructor()
  // 处理Map对象
  if (obj instanceof Map) {
    const result = new Map()
    map.set(obj, result)
    obj.forEach((val, key) => {
      result.set(deepClone(key, map), deepClone(val, map))
    })
    return result
  }

  // 处理Set对象
  if (obj instanceof Set) {
    const result = new Set()
    map.set(obj, result)
    obj.forEach((val) => {
      result.set(deepClone(val, map))
    })
    return result
  }

  map.set(obj, data)

  keys.forEach((key) => {
    if (obj[key] instanceof Object) {
      data[key] = deepClone(obj[key])
    } else {
      data[key] = obj[key]
    }
  })

  return data
}
```

[How to Get a Perfect Deep Equal in JavaScript?](https://levelup.gitconnected.com/how-to-get-a-perfect-deep-equal-in-javascript-b849fe30e54f)

## shallowEqual

```js
function shallowEqual(objA, objB) {
  // P1
  if (Object.is(objA, objB)) {
    return true
  }

  // P2
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  // P3
  var keysA = Object.keys(objA)
  var keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (var i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false
    }
  }

  return true
}
```

## deepEqual

```js
const deepEqual = (objA, objB, map = new WeakMap()) => {
  // P1
  if (Object.is(objA, objB)) return true

  // P2
  if (objA instanceof Date && objB instanceof Date) {
    return objA.getTime() === objB.getTime()
  }
  if (objA instanceof RegExp && objB instanceof RegExp) {
    return objA.toString() === objB.toString()
  }

  // P3
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  // P4
  if (map.get(objA) === objB) return true
  map.set(objA, objB)

  // P5
  const keysA = Reflect.ownKeys(objA)
  const keysB = Reflect.ownKeys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!Reflect.has(objB, keysA[i]) || !deepEqual(objA[keysA[i]], objB[keysA[i]], map)) {
      return false
    }
  }

  return true
}
```

## sum

```js
const sum = (num1, num2) => {
  const s1 = (num1.toString().split('.').[1] ?? '').length
  const s2 = (num2.toString().split('.').[1] ?? '').length

  const base = Math.pow(10, Math.max(s1, s2))

  return (num1 * base + num2 * base) / base
}
```

## sleep/delay

```ts
const sleep = (t = 0) => new Promise((resolve) => setTimeout(resolve, t))

const delay = <T extends (...args: any[]) => any>(
  func: T,
  seconds: number,
  ...args: Parameters<T>
): Promise<ReturnType<T>> => sleep(seconds).then(() => func(...args))
```

## shuffle

```ts
const shuffle = (list) => list.sort((x, y) => Math.random() - 0.5)
```
