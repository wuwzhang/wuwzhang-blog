---
title: 函数式编程
date: '2022-01-09'
tags: ['note', 'function']
draft: false
summary: 函数式编程（Functional Programming）不是一种新的框架或工具，而是一种以函数为主的编程范式。编程范式也叫编程范型，是一类编程风格，除了函数式编程，常用的还有面向对象编程、命令式编程等。
---

# 函数式编程

函数式编程（Functional Programming）不是一种新的框架或工具，而是一种以函数为主的编程范式。编程范式也叫编程范型，是一类编程风格，除了函数式编程，常用的还有面向对象编程、命令式编程等。

因为 JavaScript 的特性，非常适合使用函数式编程。

我们先了解以下基本基本概念：

## 函数是一等公民

- 可以当做常量，或者变量来引用
- 将函数当做参数传递给其他函数
- 将函数作为其他函数的返回值

以上几点 JavaScript 都可以满足。在 JavaScript 函数是一等公民。

## 数据不可变

在纯种的函数式编程语言中，数据是不可变的，或者说没有变量这个概念，所有的数据一旦产生，就不能改变其中的值，如果要改变，那就只能生成一个新的数据。

react 中 props 不可变。redux 中 reducer 不可改变 state，只能返回一个新的 state。

## 强制使用纯函数

所谓纯函数，就是和数学概念上的函数一样的函数，**没有任何副作用，输出完全由输入决定**。JavaScript 本身就是一个弱类型没有副作用检查的语言，所以没法强制使用纯函数，基本还是要靠程序员自觉。

## 支持函数递归调用

JavaScript 当然支持递归，不过，对于原教旨主义的函数式编程语言，根本不存在 for/while 这样的循环语句，需要循环执行就要靠递归。

## 函数只接受一个参数

JavaScript 语言没有限制一个函数的参数个数，所以这一点上 JavaScript 也不够原教旨主义，不过，知道函数式编程有这样一个规矩，可以帮助我们理解为什么 Redux 的一些代码写成很奇怪的样子。

```js
// 传统写法
const someMiddleware = (store, next, action) => {
  // 实现middleware
}

// 但是实际上 redux 严格遵循了函数式编程的定义
const someMiddleware = (store) => (next) => (action) => {}
// 或
const someMiddleware = (store) => {
  return (next) => {
    return (action) => {}
  }
}
```

## 柯里化（`curry`）

curry 的概念很简单：将一个低阶函数转换为高阶函数的过程就叫柯里化，这里表明的是一种“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。

```js
// 加法
// 普通写法
var add = (x, y) => x + y
// 柯里化
var add = (x) => (y) => x + y

var addOne = add(1)
var addFive = add(5)
var addTen = add(10)

addOne(1) // 2
addFive(1) // 6
addTen(1) // 11
```

柯里化工作方式是通过为每个可能的参数嵌套函数，使用由嵌套函数创建的自然闭包来保留对每个连续参数的访问。我们来编写一个通用的 `curry` 函数

```js
const curry = (fn) => {
  return function curried() {
    const args = [].slice.call(arguments),
      context = this
    // fn.length 函数期望接收的参数个数
    return args.length >= fn.length
      ? fn.apply(context, args)
      : function () {
          const rest = [].slice.call(arguments)
          return curried.apply(context, args.concat(rest))
        }
  }
}

const add = curry((a, b, c) => a + b + c)

add(1, 2, 3) // 6
add(1)(2, 3) // 6
add(1)(2)(3) // 6
add(1, 2)(3) // 6

const border = {
  style: 'border',
  generate: function (length, measure, type, color) {
    return [this.style + ':', length + measure, type, color].join(' ') + ';'
  },
}

border.curriedGenerate = curry(border.generate)

border.curriedGenerate(2)('px')('solid')('#369') // border: 2px solid #369;
```

## 代码组合（`compose`）

```js
var compose = function (f, g) {
  return function (x) {
    return f(g(x))
  }
}
```

`f`和`g`都是函数，`x`是在它们之间通过“管道”传输的值。

在`compose`的定义中，`g`将先于`f`执行，因此就创建了一个从右到左的数据流。这样做的可读性远远高于嵌套一大堆的函数调用，如果不用组合，`shout`函数将会是这样的：

```js
var shout = function (x) {
  return exclaim(toUpperCase(x))
}
```

让代码从右向左运行，而不是由内而外运行，我觉得可以称之为“左倾”（吁——）。我们来看一个顺序很重要的例子：

```js
var head = function (x) {
  return x[0]
}
var reverse = reduce(function (acc, x) {
  return [x].concat(acc)
}, [])
var last = compose(head, reverse)

last(['jumpkick', 'roundhouse', 'uppercut'])
//=> 'uppercut'
```

尽管我们可以定义一个从左向右的版本，但是从右向左执行更加能够反映数学上的含义——是的，组合的概念直接来自于数学课本。实际上，现在是时候去看看所有的组合都有的一个特性了。

```js
// 结合律（associativity）
var associative = compose(f, compose(g, h)) == compose(compose(f, g), h)
// true
```

### `pointfree`

`pointfree`模式指的是，永远不必说出你的数据

```js
// 非 pointfree，因为提到了数据：word
var snakeCase = function (word) {
  return word.toLowerCase().replace(/\s+/gi, '_')
}

// pointfree
var snakeCase = compose(replace(/\s+/gi, '_'), toLowerCase)
```

看到`replace`是如何被局部调用的了么？这里所做的事情就是通过管道把数据在接受单个参数的函数间传递。利用`curry`，我们能够做到让每个函数都先接收数据，然后操作数据，最后再把数据传递到下一个函数那里去。另外注意在`pointfree`版本中，不需要`word`参数就能构造函数；而在非`pointfree`的版本中，必须要有`word`才能进行一切操作。

我们再来看一个例子。

```js
// 非 pointfree，因为提到了数据：name
var initials = function (name) {
  return name.split(' ').map(compose(toUpperCase, head)).join('. ')
}

// pointfree
var initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '))

initials('hunter stockton thompson')
// 'H. S. T'
```

另外，`pointfree`模式能够帮助我们减少不必要的命名，让代码保持简洁和通用。对函数式代码来说，`pointfree`是非常好的石蕊试验，因为它能告诉我们一个函数是否是接受输入返回输出的小函数。比如，`while`循环是不能组合的。不过你也要警惕，`pointfree`就像是一把双刃剑，有时候也能混淆视听。并非所有的函数式代码都是 `pointfree`的，不过这没关系。可以使用它的时候就使用，不能使用的时候就用普通函数。

## 尾递归

尾递归也是递归的一种特殊情形。尾递归是一种特殊的尾调用，即在尾部直接调用自身的递归函数

- 在尾部调用的是函数自身
- 可通过优化，使得计算仅占用常量栈空间

阶乘，如果用普通的递归，如下：

```js
function factorial(n) {
  if (n === 1) return 1
  return n * factorial(n - 1)
}

factorial(5) // 120
```

如果`n`等于 5，这个方法要执行 5 次，才返回最终的计算表达式，这样每次都要保存这个方法，就容易造成栈溢出，复杂度为`O(n)`

使用尾递归，则如下：

```js
function factorial(n, total) {
  if (n === 1) return total
  return factorial(n - 1, n * total)
}

factorial(5, 1) // 120
```

可以看到，每一次返回的就是一个新的函数，不带上一个函数的参数，也就不需要储存上一个函数了。尾递归只需要保存一个调用栈，复杂度 O(1)

### 应用场景

使用尾递归优化求斐波那契数列

```js
function factorial2(n, start = 1, total = 1) {
  if (n <= 2) {
    return total
  }
  return factorial2(n - 1, total, total + start)
}
```

数组扁平化

```js
let a = [1, 2, 3, [1, 2, 3, [1, 2, 3]]]
// 变成
let a = [1, 2, 3, 1, 2, 3, 1, 2, 3]
// 具体实现
function flat(arr = [], result = []) {
  arr.forEach((v) => {
    if (Array.isArray(v)) {
      result = result.concat(flat(v, []))
    } else {
      result.push(v)
    }
  })
  return result
}
```

## 函数缓存

函数缓存，就是将函数运算过的结果进行缓存，本质上就是用空间（缓存存储）换时间（计算过程,常用于缓存数据计算结果和缓存对象

实现函数缓存主要依靠闭包、柯里化、高阶函数

```js
const memoize = function (func, content) {
  let cache = Object.create(null)
  content = content || this
  return (...key) => {
    if (!cache[key]) {
      cache[key] = func.apply(content, key)
    }
    return cache[key]
  }
}

// 调用方式也很简单
const calc = memoize(add)
const num1 = calc(100, 200)
const num2 = calc(100, 200) // 缓存得到的结果
```

- 在当前函数作用域定义了一个空对象，用于缓存运行结果
- 运用柯里化返回一个函数，返回的函数由于闭包特性，可以访问到`cache`
- 然后判断输入参数是不是在`cache`的中。如果已经存在，直接返回`cache`的内容，如果没有存在，使用函数`func`对输入参数求值，然后把结果存储在`cache`中

### 应用场景

虽然使用缓存效率是非常高的，但并不是所有场景都适用，因此千万不要极端的将所有函数都添加缓存

以下几种情况下，适合使用缓存：

- 对于昂贵的函数调用，执行复杂计算的函数
- 对于具有有限且高度重复输入范围的函数
- 对于具有重复输入值的递归函数
- 对于纯函数，即每次使用特定输入调用时返回相同输出的函数
