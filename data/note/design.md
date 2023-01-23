---
title: JS基础
date: '2022-08-03'
tags: ['ES6', 'JS']
draft: false
description: 单例模式、工厂模式、代理模式
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

## 单例模式

![](https://static.vue-js.com/fa7898d0-3b2c-11ec-8e64-91fdec0f05a1.png)

<details>
 <summary>代码</summary>

```js
// 单例构造函数
function CreateSingleton(name) {
  this.name = name
  this.getName()
}

// 获取实例的名字
CreateSingleton.prototype.getName = function () {
  console.log(this.name)
}
// 单例对象
const Singleton = (function () {
  var instance
  return function (name) {
    if (!instance) {
      instance = new CreateSingleton(name)
    }
    return instance
  }
})()

// 创建实例对象1
const a = new Singleton('a')
// 创建实例对象2
const b = new Singleton('b')

console.log(a === b) // true
```

</details>

### 使用场景

在前端中，很多情况都是用到单例模式，例如页面存在一个模态框的时候，只有用户点击的时候才会创建，而不是加载完成之后再创建弹窗和隐藏，并且保证弹窗全局只有一个

<details>
 <summary>代码</summary>

```js
const getSingle = function (fn) {
  let result
  return function () {
    return result || (result = fn.apply(this, arguments))
  }
}

const createLoginLayer = function () {
  var div = document.createElement('div')
  div.innerHTML = '我是浮窗'
  div.style.display = 'none'
  document.body.appendChild(div)
  return div
}

const createSingleLoginLayer = getSingle(createLoginLayer)

document.getElementById('loginBtn').onclick = function () {
  var loginLayer = createSingleLoginLayer()
  loginLayer.style.display = 'block'
}
```

</details>

## 工厂模式

工厂模式是用来创建对象的一种最常用的设计模式，不暴露创建对象的具体逻辑，而是将将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂

### 简单工厂模式

简单工厂模式也叫静态工厂模式，用一个工厂对象创建同一类对象类的实例

<details>
 <summary>代码</summary>

```js
function Factory(career) {
  function User(career, work) {
    this.career = career
    this.work = work
  }
  let work
  switch (career) {
    case 'coder':
      work = ['写代码', '修Bug']
      return new User(career, work)
      break
    case 'hr':
      work = ['招聘', '员工信息管理']
      return new User(career, work)
      break
    case 'driver':
      work = ['开车']
      return new User(career, work)
      break
    case 'boss':
      work = ['喝茶', '开会', '审批文件']
      return new User(career, work)
      break
  }
}
let coder = new Factory('coder')
console.log(coder)
let boss = new Factory('boss')
console.log(boss)
```

</details>
Factory就是一个简单工厂。当我们调用工厂函数时，只需要传递name、age、career就可以获取到包含用户工作内容的实例对象

### 工厂方法模式

工厂方法模式跟简单工厂模式差不多，但是把具体的产品放到了工厂函数的 prototype 中

<details>
 <summary>代码</summary>

```js
// 工厂方法
function Factory(career) {
  if (this instanceof Factory) {
    var a = new this[career]()
    return a
  } else {
    return new Factory(career)
  }
}
// 工厂方法函数的原型中设置所有对象的构造函数
Factory.prototype = {
  coder: function () {
    this.careerName = '程序员'
    this.work = ['写代码', '修Bug']
  },
  hr: function () {
    this.careerName = 'HR'
    this.work = ['招聘', '员工信息管理']
  },
  driver: function () {
    this.careerName = '司机'
    this.work = ['开车']
  },
  boss: function () {
    this.careerName = '老板'
    this.work = ['喝茶', '开会', '审批文件']
  },
}
let coder = new Factory('coder')
console.log(coder)
let hr = new Factory('hr')
console.log(hr)
```

</details>

### 抽象工厂模式

上述简单工厂模式和工厂方法模式都是直接生成实例，但是抽象工厂模式不同，抽象工厂模式并不直接生成实例， 而是用于对产品类簇的创建

通俗点来讲就是：简单工厂和工厂方法模式的工作是生产产品，那么抽象工厂模式的工作就是生产工厂的

由于 JavaScript 中并没有抽象类的概念，只能模拟，可以分成四部分：

- 用于创建抽象类的函数
- 抽象类
- 具体类
- 实例化具体类

<details>
 <summary>代码</summary>

```js
let CareerAbstractFactory = function (subType, superType) {
  // 判断抽象工厂中是否有该抽象类
  if (typeof CareerAbstractFactory[superType] === 'function') {
    // 缓存类
    function F() {}
    // 继承父类属性和方法
    F.prototype = new CareerAbstractFactory[superType]()
    // 将子类的constructor指向父类
    subType.constructor = subType
    // 子类原型继承父类
    subType.prototype = new F()
  } else {
    throw new Error('抽象类不存在')
  }
}
```

</details>

## 构造函数模式

- 没有显式地创建对象。
- 属性和方法直接赋值给了 this。
- 没有 return。

<details>
 <summary>代码</summary>

```js
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function () {
    console.log(this.name)
  }
}
let person1 = new Person('Nicholas', 29, 'Software Engineer')
let person2 = new Person('Greg', 27, 'Doctor')
person1.sayName() // Nicholas
person2.sayName() // Greg
```

</details>

1. 在内存中创建一个新对象。
2. 这个新对象内部的`[[Prototype]`]特性被赋值为构造函数的 prototype 属性。
3. 构造函数内部的 this 被赋值为这个新对象（即 this 指向新对象）。
4. 执行构造函数内部的代码（给新对象添加属性）。
5. 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象。

构造函数的主要问题在于，其定义的方法会在每个实例上都创建一遍

## 代理模式

代理模式（Proxy Pattern）是为一个对象提供一个代用品或占位符，以便控制对它的访问

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要时，提供一个替身对象来控制这个对象的访问，客户实际上访问的是替身对象

![](https://static.vue-js.com/951c99b0-3d6a-11ec-a752-75723a64e8f5.png)

而按照功能来划分，javascript 代理模式常用的有：

- 缓存代理
- 虚拟代理

### 缓存代理

缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果

<details>
 <summary>代码</summary>

```js
var muti = function () {
  console.log('开始计算乘积')
  var a = 1
  for (var i = 0, l = arguments.length; i < l; i++) {
    a = a * arguments[i]
  }
  return a
}

var proxyMult = (function () {
  var cache = {}
  return function () {
    var args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return (cache[args] = mult.apply(this, arguments))
  }
})()

proxyMult(1, 2, 3, 4) // 输出:24
proxyMult(1, 2, 3, 4) // 输出:24
```

</details>

### 虚拟代理

虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建

<details>
 <summary>代码</summary>

```js
// 未使用
let MyImage = (function () {
  let imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  // 创建一个Image对象，用于加载需要设置的图片
  let img = new Image()

  img.onload = function () {
    // 监听到图片加载完成后，设置src为加载完成后的图片
    imgNode.src = img.src
  }

  return {
    setSrc: function (src) {
      // 设置图片的时候，设置为默认的loading图
      imgNode.src = 'https://img.zcool.cn/community/01deed576019060000018c1bd2352d.gif'
      // 把真正需要设置的图片传给Image对象的src属性
      img.src = src
    },
  }
})()

MyImage.setSrc('https://xxx.jpg')

// 使用
// 图片本地对象，负责往页面中创建一个img标签，并且提供一个对外的setSrc接口
let myImage = (function () {
  let imgNode = document.createElement('img')
  document.body.appendChild(imgNode)

  return {
    //setSrc接口，外界调用这个接口，便可以给该img标签设置src属性
    setSrc: function (src) {
      imgNode.src = src
    },
  }
})()
// 代理对象，负责图片预加载功能
let proxyImage = (function () {
  // 创建一个Image对象，用于加载需要设置的图片
  let img = new Image()
  img.onload = function () {
    // 监听到图片加载完成后，给被代理的图片本地对象设置src为加载完成后的图片
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function (src) {
      // 设置图片时，在图片未被真正加载好时，以这张图作为loading，提示用户图片正在加载
      myImage.setSrc('https://img.zcool.cn/community/01deed576019060000018c1bd2352d.gif')
      img.src = src
    },
  }
})()

proxyImage.setSrc('https://xxx.jpg')
```

</details>

## 策略模式

## 观察者

![](https://static.vue-js.com/d3a80020-3f7c-11ec-a752-75723a64e8f5.png)

<details>
 <summary>代码</summary>

```js
// 被观察者
class Subject {
  constructor() {
    this.observerList = []
  }

  addObserver(observer) {
    this.observerList.push(observer)
  }

  removeObserver(observer) {
    const index = this.observerList.findIndex((o) => o.name === observer.name)
    this.observerList.splice(index, 1)
  }

  notifyObservers(message) {
    const observers = this.observerList
    observers.forEach((observer) => observer.notified(message))
  }
}

// 观察者
class Observer {
  constructor(name, subject) {
    this.name = name
    if (subject) {
      subject.addObserver(this)
    }
  }

  notified(message) {
    console.log(this.name, 'got message', message)
  }
}

const subject = new Subject()
const observerA = new Observer('observerA', subject)
const observerB = new Observer('observerB')
subject.addObserver(observerB)
subject.notifyObservers('Hello from subject')
subject.removeObserver(observerA)
subject.notifyObservers('Hello again')
```

</details>

## 发布订阅模式

发布-订阅是一种消息范式，消息的发送者（称为发布者）不会将消息直接发送给特定的接收者（称为订阅者）。而是将发布的消息分为不同的类别，无需了解哪些订阅者（如果有的话）可能存在

同样的，订阅者可以表达对一个或多个类别的兴趣，只接收感兴趣的消息，无需了解哪些发布者存在

![](https://static.vue-js.com/e24d3cd0-3f7c-11ec-8e64-91fdec0f05a1.png)

<details>
 <summary>代码</summary>

```js
class PubSub {
  constructor() {
    this.messages = {}
    this.listeners = {}
  }
  // 添加发布者
  publish(type, content) {
    const existContent = this.messages[type]
    if (!existContent) {
      this.messages[type] = []
    }
    this.messages[type].push(content)
  }
  // 添加订阅者
  subscribe(type, cb) {
    const existListener = this.listeners[type]
    if (!existListener) {
      this.listeners[type] = []
    }
    this.listeners[type].push(cb)
  }
  // 通知
  notify(type) {
    const messages = this.messages[type]
    const subscribers = this.listeners[type] || []
    subscribers.forEach((cb, index) => cb(messages[index]))
  }
}

class Publisher {
  constructor(name, context) {
    this.name = name
    this.context = context
  }
  publish(type, content) {
    this.context.publish(type, content)
  }
}

class Subscriber {
  constructor(name, context) {
    this.name = name
    this.context = context
  }
  subscribe(type, cb) {
    this.context.subscribe(type, cb)
  }
}

const TYPE_A = 'music'
const TYPE_B = 'movie'
const TYPE_C = 'novel'

const pubsub = new PubSub()

const publisherA = new Publisher('publisherA', pubsub)
publisherA.publish(TYPE_A, 'we are young')
publisherA.publish(TYPE_B, 'the silicon valley')
const publisherB = new Publisher('publisherB', pubsub)
publisherB.publish(TYPE_A, 'stronger')
const publisherC = new Publisher('publisherC', pubsub)
publisherC.publish(TYPE_C, 'a brief history of time')

const subscriberA = new Subscriber('subscriberA', pubsub)
subscriberA.subscribe(TYPE_A, (res) => {
  console.log('subscriberA received', res)
})
const subscriberB = new Subscriber('subscriberB', pubsub)
subscriberB.subscribe(TYPE_C, (res) => {
  console.log('subscriberB received', res)
})
const subscriberC = new Subscriber('subscriberC', pubsub)
subscriberC.subscribe(TYPE_B, (res) => {
  console.log('subscriberC received', res)
})

pubsub.notify(TYPE_A)
pubsub.notify(TYPE_B)
pubsub.notify(TYPE_C)
```

</details>
