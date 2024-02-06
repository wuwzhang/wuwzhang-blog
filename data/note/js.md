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

## 请求取消

### XHR

```js
const xhr = new XMLHttpRequest(),
  method = 'GET',
  url = 'https://developer.mozilla.org/'
xhr.open(method, url, true)

xhr.send()

// 取消发送请求
xhr.abort()
```

### fetch

```js
const controller = new AbortController()
const signal = controller.signal

const downloadBtn = document.querySelector('.download');
const abortBtn = document.querySelector('.abort');

downloadBtn.addEventListener('click', fetchVideo);

// 点击取消按钮时，取消请求的发送
abortBtn.addEventListener('click', function() {
  controller.abort();
  console.log('Download aborted');
});

function fetchVideo() {
  ...
  fetch(url, {signal}).then(function(response) {
    ...
  }).catch(function(e) {
   // 请求被取消之后将会得到一个 AbortError
    reports.textContent = 'Download error: ' + e.message;
  })
}
```

### axios

```js
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios
  .get('/user/12345', {
    cancelToken: source.token,
  })
  .catch(function (thrown) {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message)
    } else {
      // handle error
    }
  })

axios.post(
  '/user/12345',
  {
    name: 'new name',
  },
  {
    cancelToken: source.token,
  }
)

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.')
```

## setTimeout 为什么最小只能设置 4ms，如何实现一个 0ms 的 setTimeout?

![4ms](https://user-images.githubusercontent.com/46242125/128295969-fc674ccf-40b2-475c-8c32-6432dd7f7ff8.png)

```js
let timeouts = []
const messageName = 'zero-settimeout'

function setTimeoutZero(fn) {
  timeouts.push(fn)
  window.postMessage(messageName, '*')
}

function handleMessage(evt) {
  if (evt.source == window && evt.data === messageName) {
    if (timeouts.length > 0) {
      const f = timeouts.shift()
      f()
    }
  }
}

window.addEventListener('message', handleMessage)

window.zeroSettimeout = setTimeoutZero
```

## JS 中异步任务为何分为微任务与宏任务

为了减少锁的使用和锁的范围，Chromium 采用了一个比较巧妙的方法：简单来讲，MessageLoop 维护有两个队列，一个 work_queue，一个 incoming_queue。消息循环不断从 work_queue 取任务并执行，新加入任务放入 incoming_queue。当 work_queue 中的任务都执行完后，再把 incoming_queue 拷贝到 work_queue（需要加锁）。这样避免了每执行一个任务都要去加锁。

## 遍历一个对象

- for in
- Object.keys、Object.entries
- Reflect.ownKeys
- Symbol.iterator

```js
const obj = { a: 1, b: 2, c: 3 }

obj[Symbol.iterator] = function () {
  let i = 0
  const keys = Object.keys(this)
  return {
    next: () => {
      return i <= keys.length - 1
        ? { value: this[keys[i++]], done: false }
        : { value: undefined, done: true }
    },
  }
}
```

## 反码和补码

- 反码: 反码按位取反
- 补码: 正数和 0 的补码就是该数字本身，负数的补码则是反码

## ES6 代码转成 ES5

- 将代码字符串解析成抽象语法树，即所谓的 AST
- 对 AST 进行处理，在这个阶段可以对 ES6 代码进行相应转换，即转成 ES5 代码
- 根据处理后的 AST 再生成代码字符串

可以使用 `@babel/parser` 的 parse 方法，将代码字符串解析成 AST；使用 `@babel/core` 的 transformFromAstSync 方法，对 AST 进行处理，将其转成 ES5 并生成相应的代码字符串；过程中，可能还需要使用 `@babel/traverse` 来获取依赖文件等


- [JS阻塞渲染，这么多年我理解错啦？](https://segmentfault.com/a/1190000041729574)