---
title: seche
date: '2023-01-08'
draft: false
description: 红绿灯
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
