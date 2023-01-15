---
title: 给对象的所有方法添加异常处理
date: '2022-03-09'
tags: ['js', 'proxy']
draft: false
description: 给对象的所有方法添加异常处理
---

```js
class ExceptionHandler {
  handle(exception) {
    console.log('记录错误：', exception.message, exception.stack)
  }
}

class ExceptionsZone {
  static exceptionHandler = new ExceptionHandler()

  static run(callback) {
    try {
      callback()
    } catch (e) {
      this.exceptionHandler.handle(e)
    }
  }

  static async asyncRun(callback) {
    try {
      await callback()
    } catch (e) {
      this.exceptionHandler.handle(e)
    }
  }
}

function createExceptionZone(target, prop) {
  return (...args) => {
    let result
    ExceptionsZone.run(() => {
      result = target[prop](...args)
    })
    return result
  }
}

function createExceptionProxy() {
  return (target, prop) => {
    if (!(prop in target)) {
      return
    }

    if (typeof target[prop] === 'function') {
      return createExceptionZone(target, prop)
    }

    return target[prop]
  }
}

function createProxy(target) {
  const proxy = createExceptionProxy()
  return new Proxy(target, {
    get: proxy,
    set: proxy,
  })
}
```

## 测试

```js
const obj = {
  name: 'guang',
  say() {
    console.log('Hi, I\'m ' + this.name);
  },
  coding() {
    //xxx
    throw new Error('bug');
  }
  coding2() {
    //xxx
    throw new Error('bug2');
  }
}

const proxy = createProxy(obj);

proxy.say();
proxy.coding();
```

## 来源

- [如何优雅地给对象的所有方法添加异常处理](https://cloud.tencent.com/developer/article/1949778)
