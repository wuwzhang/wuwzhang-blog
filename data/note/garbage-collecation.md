---
title: 垃圾回收
date: '2022-10-19'
tags: ['note', 'js']
draft: false
summary: 什么是垃圾：对象不在被引用或不能从根上访问到
---

<TOCInline toc={props.toc} asDisclosure toHeading={3} />

# [垃圾回收](https://www.bilibili.com/video/BV1sy4y137Nh?p=1)

## 什么是垃圾

- 对象不在被引用
- 不能从根上访问到

## GC 算法

> 垃圾回收算法

- 引用计数
  - 优点
    - 发现垃圾立即回收
    - 最大程度减少程序暂停
  - 缺点
    - 无法回收循环引用的对象
    - 时间开销大
- 标记清除
  - 优点
    - 可以解决对象循环引用
  - 缺点
    - 地址不连续，碎片化，空间浪费
- 标记整理
  - 相比于标记清除，多一步整理碎片空间的步骤
- 分待回收
  - v8 垃圾回收策略

## v8 垃圾回收

> v8 内存设置上限，超过会影响用户感知，基于分代回收思想进行垃圾回收

垃圾回收会阻塞 JS 的代码执行

分为新生代和老生代回收，将内存空间一分为二

- 新生代
  - 小空间，32M | 16M，复制算法空间换时间
  - 存活时间较短的对象
  - 采用复制算法+标记整理
  - 将空间分成 from（使用空间） + to（空闲空间） // 空间等大
  - 活动对象存储于 from 空间
  - 标记整理后将活动对象拷贝至 to 空间
  - from 和 to 空间交换完成释放
- 晋升
  - 将新生代对象移动到老生代
  - 一轮 GC 还存活的新生代需要晋升
  - to 空间的使用率超过 25%
- 老生代
  - 大空间 1.4G | 700M
  - 存活时间长（全局变量、闭包数据）
  - 标记清除、标记整理、增量标记算法
  - 标记清除完成垃圾回收
  - 晋升空间不足时，使用标记整理进行空间优化
  - 增量标记算法提升效率

## 常见内存泄露情况

意外的全局变量

```js
function foo(arg) {
  bar = 'this is a hidden global variable'
}
```

另一种意外的全局变量可能由 `this` 创建：

```js
function foo() {
  this.variable = 'potential accidental global'
}
// foo 调用自己，this 指向了全局对象（window）
foo()
```

上述使用严格模式，可以避免意外的全局变量

定时器也常会造成内存泄露

```js
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if(node) {
        // 处理 node 和 someResource
        node.innerHTML = JSON.stringify(someResource));
    }
}, 1000);
```

如果`id`为 Node 的元素从`DOM`中移除，该定时器仍会存在，同时，因为回调函数中包含对`someResource`的引用，定时器外面的`someResource`也不会被释放

包括我们之前所说的闭包，维持函数内局部变量，使其得不到释放

```js
function bindEvent() {
  var obj = document.createElement('XXX')
  var unused = function () {
    console.log(obj, '闭包内引用obj obj不会被释放')
  }
  obj = null // 解决方法
}
```

没有清理对`DOM`元素的引用同样造成内存泄露

```js
const refA = document.getElementById('refA')
document.body.removeChild(refA) // dom删除了
console.log(refA, 'refA') // 但是还存在引用能console出整个div 没有被回收
refA = null
console.log(refA, 'refA') // 解除引用
```

包括使用事件监听`addEventListener`监听的时候，在不监听的情况下使用`removeEventListener`取消对事件监听
