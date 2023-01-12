---
title: 功能函数
date: '2023-01-08'
tags: ['function', 'es6']
draft: false
description: debounce、throttle、deepClone、sum...
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

## cloneDeep

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

## sum

```js
const sum = (num1, num2) => {
  const s1 = (num1.toString().split('.').[1] ?? '').length
  const s2 = (num2.toString().split('.').[1] ?? '').length

  const base = Math.pow(10, Math.max(s1, s2))

  return (num1 * base + num2 * base) / base
}
```
