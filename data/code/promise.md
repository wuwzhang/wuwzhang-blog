---
title: Promise
date: '2023-01-08'
tags: ['Promise', 'es6']
draft: false
description: Promise、Promise.map、Promise.all、Promise.race、Promise.allSettled、promisify、promisifyAll
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

## 实现一个简单的 Promise

- [BAT 前端经典面试问题：史上最最最详细的手写 Promise 教程](https://juejin.cn/post/6844903625769091079)
- [Promise A\*](https://www.ituring.com.cn/article/66566)

<details>
  <summary className="ml-4">代码展开</summary>

```js
function isObject(argument) {
  return argument && (typeof argument === 'function' || typeof argument === 'object')
}

function isFunction(argument) {
  return typeof argument === 'function'
}

class Promise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  static resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      // 如果 x 和 promise2 相当，代表是有循环
      reject(new TypeError('Circling Chain detected in resolve promise'))
    } else if (!isObject(x)) {
      // 如果 x 不是一个对象，则直接返回
      resolve(x)
    } else if (x instanceof Promise) {
      // 如果 x 是一个 promise，需要等待 promise 结束
      x.then((value) => {
        // value 依然可能是例如 Promise 的类型，所以还需继续判断
        Promise.resolvePromise(promise2, value, resolve, reject)
      }, reject)
    } else {
      // thenable 形式
      let called = false // 防止被调用多次
      try {
        const then = x.then
        if (isFunction(then)) {
          // 如果 then 是一个函数，则符合 thenable
          then.call(
            x,
            (value) => {
              // 保持 x 的 this
              if (called) return
              called = true
              Promise.resolvePromise(promise2, value, resolve, reject)
            },
            (reason) => {
              if (called) return
              called = true
              reject(reason)
            }
          )
        } else {
          resolve(x) // 不是函数，则直接返回这个普通的对象
        }
      } catch (e) {
        if (called) return
        called = true
        reject(e)
      }
    }
  }

  state = Promise.PENDING // 当前状态
  value // 终值
  reason // 拒因
  onFulfilledReactions = [] // 当 fulfilled 时的异步操作
  onRejectedReactions = [] // 当 rejected 时的异步操作

  constructor(executor) {
    // 参数校验，判断 executor 是否为函数
    if (!isFunction(executor)) {
      throw new TypeError(`Promise executor ${executor} is not a function`)
    }

    // value 为终值
    const resolve = (value) => {
      // 状态一旦改变，再次调用也没用
      if (this.state === Promise.PENDING) {
        this.state = Promise.FULFILLED // 改变状态
        this.value = value // 赋终值
        this.onFulfilledReactions.forEach((fn) => fn()) // 调用处理函数
      }
    }

    // reason 为拒因
    const reject = (reason) => {
      // 状态一旦改变，再次调用也没用
      if (this.state === Promise.PENDING) {
        // 等待状态才行
        this.state = Promise.REJECTED // 改变状态
        this.reason = reason // 赋值拒因
        this.onRejectedReactions.forEach((fn) => fn()) // 执行操作
      }
    }

    // 因为 executor 执行过程中有可能出错，所以需要 try/catch
    try {
      executor(resolve, reject)
    } catch (e) {
      // 当发生错误时，调用 reject
      this.reject(e)
    }
  }

  // 用户传递的回调函数
  then(onFullfilled, onRejected) {
    // 为了透传，如果不是函数，则重新赋值为函数，也不抛错
    if (!isFunction(onFullfilled)) {
      onFullfilled = (value) => value
    }

    if (!isFunction(onRejected)) {
      onRejected = (reason) => {
        throw reason
      }
    }

    // 为了能链式调用，需要返回一个新的实例
    const promise2 = new Promise((resolve, reject) => {
      // fulfilled 时操作，为了访问 this.value，需要保持 this
      const onFulfilledReaction = () => {
        // 模拟异步
        setTimeout(() => {
          try {
            const x = onFullfilled(this.value) // 执行 onFullfilled
            Promise.resolvePromise(promise2, x, resolve, reject) // 继续处理返回值的情况
          } catch (e) {
            reject(e)
          }
        })
      }

      const onRejectedReaction = () => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            Promise.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.state === Promise.FULFILLED) {
        onFulfilledReaction()
      } else if (this.state === Promise.REJECTED) {
        onRejectedReaction()
      } else if (this.state === Promise.PENDING) {
        this.onFulfilledReactions.push(onFulfilledReaction)
        this.onRejectedReactions.push(onRejectedReaction)
      }
    })

    return promise2
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
}

// Promise.defer = Promise.deferred = function () {
//   let dfd = {}
//   dfd.promise = new Promise((resolve, reject) => {
//     dfd.resolve = resolve
//     dfd.reject = reject
//   })
//   return dfd
// }
module.exports = Promise
```

</details>

## Promise.race

```js
const race = (arr) => {
  return new Promise((resolve, reject) => {
    arr.forEach((item) => Promise.resolve(item).then(resolve, reject))
  })
}
```

## Promise.all

```js
const all = (arr) => {
  let count = 0
  let result = []

  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(arr[i])
        .then((res) => {
          result[i] = res
          if (++count === arr.length) {
            resolve(res)
          }
        })
        .catch((error) => {
          reject(error)
        })
    }
  })
}
```

## Promise.allSettled

![](https://segmentfault.com/img/bVbKo8s)

```js
const allSettled = (arr) => {
  let count = 0
  let result = []

  const handle = (i, value) => {
    if (++count === arr.length) {
      resolve()
    }

    result[i] = value
  }

  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(arr[i])
        .then((res) => {
          handle(i, { status: 'fulfilled', value: res })
        })
        .catch((error) => {
          handle(i, { status: 'rejected', value: res })
        })
    }
  })
}
```

## 实现函数 promisify，把回调函数改成 promise 形式

```js
const promisify = (f) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      f(...args, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
}

var func1 = function (a, b, c, callback) {
  let rst = a + b + c
  callback(null, rst)
}

var func2 = promisify(func1)
func2(1, 2, 3).then((rst) => {
  console.log('rst', rst)
}) //输出6
```

## promisifyAll

```js
promisifyAll(obj) {
  for (let key in obj) {
    if (typeof obj[key] === "function") {
      obj[key] = promisify(obj[key]);
    }
  }
}
```

## promise.map，限制 promise 并发数

```js
function pMap(list, mapper, concurrency = Infinity) {
  // list 为 Iterator，先转化为 Array
  list = Array.from(list)
  return new Promise((resolve, reject) => {
    let currentIndex = 0
    let result = []
    let resolveCount = 0
    let len = list.length
    function next() {
      const index = currentIndex
      currentIndex++
      Promise.resolve(list[index])
        .then((o) => mapper(o, index))
        .then((o) => {
          result[index] = o
          resolveCount++
          if (resolveCount === len) {
            resolve(result)
          }
          if (currentIndex < len) {
            next()
          }
        })
    }
    for (let i = 0; i < concurrency && i < len; i++) {
      next()
    }
  })
}

pMap([1, 2, 3, 4, 5], (x) => Promise.resolve(x + 1))
pMap([Promise.resolve(1), Promise.resolve(2)], (x) => x + 1)
// 注意输出时间控制
pMap([1, 1, 1, 1, 1, 1, 1, 1], (x) => sleep(1000), { concurrency: 2 })
```
