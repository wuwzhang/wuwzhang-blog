---
title: seche
date: '2022-01-08'
draft: false
description: 红绿灯;判断日期是否为双休日;生成数组元素的全排列
---

## 红绿灯

### callback

<details>
  <summary>代码</summary>

```js
function red() {
  console.log('red')
}

function green() {
  console.log('green')
}

function yellow() {
  console.log('yellow')
}

const task = (timer, light, callback) => {
  setTimout(() => {
    switch (light) {
      case 'red':
        red()
        break
      case 'green':
        green()
        break
      case 'yellow':
        yellow()
        break
    }
    callback()
  }, timer)
}

const work = () => {
  task(3000, 'red', () => {
    task(1000, 'green', () => {
      task(2000, 'yellow', work)
    })
  })
}
work()
```

</details>

### Promise

<details>
  <summary>代码</summary>

```js
const promiseLight = (timer, light) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (light) {
        case 'red':
          red()
          break
        case 'green':
          green()
          break
        case 'yellow':
          yellow()
          break
      }
      resolve()
    }, timer)
  })
}

const work = () => {
  promiseLight(3000, 'red')
    .then(() => promiseLight(1000, 'green'))
    .then(() => promiseLight(2000, 'yellow'))
    .then(work)
}
```

</details>

### generator

<details>
  <summary>代码</summary>

```js
const generator = function* () {
  yield promiseLight(3000, 'red')
  yield promiseLight(1000, 'green')
  yield promiseLight(2000, 'yellow')
  yield generator()
}

const generatorObj = generator()
generatorObj.next()
generatorObj.next()
generatorObj.next()
```

</details>

### async/awiat

<details>
  <summary>代码</summary>

```js
const generator = function* () {
  yield promiseLight(3000, 'red')
  yield promiseLight(1000, 'green')
  yield promiseLight(2000, 'yellow')
  yield generator()
}

const generatorObj = generator()
generatorObj.next()
generatorObj.next()
generatorObj.next()
```

</details>

## 判断日期是否为双休日

<details>
	<summary>代码</summary>

```ts
const isWeekend = (date = new Date()): boolean => date.getDay() % 6 === 0
```

</details>

## 生成数组元素的全排列

<details>
	<summary>代码</summary>

```js
const permutations = (arr) => {
  if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr
  return arr.reduce(
    (acc, item, i) =>
      acc.concat(
        permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((val) => [item, ...val])
      ),
    []
  )
}

permutations([1, 33, 5])
// [ [1, 33, 5], [1, 5, 33], [33, 1, 5], [33, 5, 1], [5, 1, 33], [5, 33, 1] ]
```

</details>

## 将'10000000000'形式的字符串，以每 3 位进行分隔展示'10.000.000.000',多种实现方式

```js
// 德国以 . 分割金钱, 转到德国当地格式化方案即可
;(10000000000).toLocaleString('de-DE')

// 寻找字符空隙加 .
'10000000000'.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

// 寻找数字并在其后面加 .
'10000000000'.replace(/(\d)(?=(\d{3})+\b)/g, '$1.')
```
