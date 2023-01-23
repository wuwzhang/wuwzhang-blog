---
title: 功能函数
date: '2023-01-08'
tags: ['function', 'es6']
draft: false
description: debounce、throttle、deepClone、shallowEqual、deepEqual、sum、sleep/delay、shuffle、jsonp
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

## debounce

<details>
 <summary>代码</summary>

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

</details>

## throttle

<details>
 <summary>代码</summary>

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

</details>

## deepClone

<details>
 <summary>代码</summary>

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

</details>

[How to Get a Perfect Deep Equal in JavaScript?](https://levelup.gitconnected.com/how-to-get-a-perfect-deep-equal-in-javascript-b849fe30e54f)

[分别用深度优先思想和广度优先思想实现一个拷贝函数？](../blog/69.md#上期的答案)

## shallowEqual

<details>
 <summary>代码</summary>

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

</details>

## deepEqual

<details>
 <summary>代码</summary>

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

</details>

## sum

<details>
 <summary>代码</summary>

```js
const sum = (num1, num2) => {
  const s1 = (num1.toString().split('.').[1] ?? '').length
  const s2 = (num2.toString().split('.').[1] ?? '').length

  const base = Math.pow(10, Math.max(s1, s2))

  return (num1 * base + num2 * base) / base
}
```

</details>

## sleep/delay

<details>
 <summary>代码</summary>

```ts
const sleep = (t = 0) => new Promise((resolve) => setTimeout(resolve, t))

const delay = <T extends (...args: any[]) => any>(
  func: T,
  seconds: number,
  ...args: Parameters<T>
): Promise<ReturnType<T>> => sleep(seconds).then(() => func(...args))
```

</details>

## shuffle

<details>
 <summary>代码</summary>

```ts
const shuffle = (list) => list.sort((x, y) => Math.random() - 0.5)
```

</details>

## jsonp

JSONP 的原理很简单，就是利用 `<script>` 标签没有跨域限制的漏洞。通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据当需要通讯时。

JSONP 使用简单且兼容性不错，但是只限于 get 请求。

<details>
 <summary>代码</summary>

```js
function stringify(data) {
  const pairs = Object.entries(data)
  const qs = pairs
    .map(([k, v]) => {
      let noValue = false
      if (v === null || v === undefined || typeof v === 'object') {
        noValue = true
      }
      return `${encodeURIComponent(k)}=${noValue ? '' : encodeURIComponent(v)}`
    })
    .join('&')
  return qs
}

function jsonp({ url, onData, params }) {
  const script = document.createElement('script')

  // 一、为了避免全局污染，使用一个随机函数名
  const cbFnName = `JSONP_PADDING_${Math.random().toString().slice(2)}`
  // 二、默认 callback 函数为 cbFnName
  script.src = `${url}?${stringify({ callback: cbFnName, ...params })}`
  // 三、使用 onData 作为 cbFnName 回调函数，接收数据
  window[cbFnName] = onData

  document.body.appendChild(script)
}
```

</details>

## toPascalCase

<details>
 <summary>代码</summary>

```js
const toPascalCase = (str: string): string =>
  (str.match(/[a-zA-Z0-9]+/g) || [])
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join('')

toPascalCase('hello world') // 'HelloWorld'
toPascalCase('hello.world') // 'HelloWorld'
toPascalCase('foo_bar-baz') // FooBarBaz

//驼峰转短横线
function toKebabCase(str) {
  let res = str.replace(/([A-Z])/g, (all, i) => {
    return '-' + i.toLowerCase()
  })
  if (res.slice(0, 1) === '-') {
    res = res.slice(1) //去除开头的-
  }
  return res
}
//短横线转驼峰
function toCamelCase(str) {
  return str.replace(/-([a-zA-Z])/g, function (all, i) {
    return i.toUpperCase()
  })
}

console.log(toCamelCase('get-element-by-id'))
console.log(toKebabCase('GetElementById'))
```

</details>

## omit

剔除对象中指定数组中的键名

<details>
 <summary>代码</summary>

```js
const omit = (obj, arr) =>
  Object.keys(obj)
    .filter((k) => !arr.includes(k))
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {})

omit({ a: 1, b: '2', c: 3 }, ['b']) // { 'a': 1, 'c': 3 }
```

</details>

## chunk

按指定长度给数组组分

<details>
 <summary>代码</summary>

```js
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )

chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
```

</details>

## deepGet

<details>
 <summary>代码</summary>

```js
const deepGet = (obj, keys) =>
  keys.reduce((xs, x) => (xs && xs[x] !== null && xs[x] !== undefined ? xs[x] : null), obj)

let index = 2
const data = {
  foo: {
    foz: [1, 2, 3],
    bar: {
      baz: ['a', 'b', 'c'],
    },
  },
}
deepGet(data, ['foo', 'foz', index]) // get 3
deepGet(data, ['foo', 'bar', 'baz', 8, 'foz']) // null
```

</details>

## unzip

<details>
 <summary>代码</summary>

```js
const unzip = (arr) =>
  arr.reduce(
    (acc, c) => (c.forEach((v, i) => acc[i].push(v)), acc),
    Array.from({ length: Math.max(...arr.map((a) => a.length)) }, (_) => [])
  )

unzip([
  ['a', 1],
  ['b', 2],
  ['c', 3],
  ['d', 4],
  ['e', 5],
]) // [['a', 'b', 'c', 'd', 'e'], [1, 2, 3, 4, 5]]
```

</details>

## countBy

根据给定的函数对数组的元素进行分组，并返回每个组中元素的计数

<details>
 <summary>代码</summary>

```js
const countBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : (val) => val[fn]).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})

countBy([6.1, 4.2, 6.3], Math.floor) // {4: 1, 6: 2}
countBy(['one', 'two', 'three'], 'length') // {3: 2, 5: 1}
countBy([{ count: 5 }, { count: 10 }, { count: 5 }], (x) => x.count)
// {5: 2, 10: 1}
```

</details>

## isValidJSON

判断是否为合法的`json`数据

<details>
 <summary>代码</summary>

```js
const isValidJSON = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

isValidJSON('{"name":"Adam","age":20}') // true
isValidJSON('{"name":"Adam",age:"20"}') // false
isValidJSON(null) // true
```

</details>

## isEmpty

<details>
 <summary>代码</summary>

```js
isEmpty([]) // true
isEmpty({}) // true
isEmpty('') // true
isEmpty([1, 2]) // false
isEmpty({ a: 1, b: 2 }) // false
isEmpty('text') // false
isEmpty(123) // true - type is not considered a collection
isEmpty(true) // true - type is not considered a collection

const isEmpty = (val) => val == null || !(Object.keys(val) || val).length
```

</details>

## validateNumber

判断给到的值是否为数字

<details>
 <summary>代码</summary>

```js
const validateNumber = (n) => {
  const num = parseFloat(n)
  return !Number.isNaN(num) && Number.isFinite(num) && Number(n) == n
}

validateNumber('10') // true
validateNumber('a') // false
validateNumber(1 / 0) // false
```

</details>

## trim

<details>
 <summary>代码</summary>

```js
const trim = (str) => (typeof str === 'string' ? str?.replace(/(^\s*)|(\s*$)/g, '') : str)

trim(' abc  ') // =>'abc';
trim(' abc') // => 'abc';
trim('abc') // => 'abc';
trim('a bc') // => 'a bc';
```

</details>
