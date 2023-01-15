---
title: tree sharking
date: '2023-01-09'
tags: ['npm', 'project', 'tree sharking']
draft: false
summary: tree shark原理
---

# Tree shaking

Tree Shaking 指基于 ES Module 进行静态分析，通过 AST 将用不到的函数进行移除，从而减小打包体积。

1. 没有使用额外的模块系统，直接定位 import 来替换 export 的模块
2. 去掉了未被使用的代码

ES Modules 之所以能 Tree-shaking 主要为以下四个原因

1. import 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面。
2. import 的模块名只能是字符串常量。
3. 不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成。
4. import binding 是 immutable 的，类似 const。比如说你不能 `import { a } from './a'` 然后给 a 赋值个其他什么东西。

## 特点

### import \*

当使用语法 import \* 时，Tree Shaking 依然生效。

```js
// maths.js
const maths = {
  sum() {},
  sub() {},
}

// index.js
import * as maths from './maths'

// Tree Shaking 依然生效
maths.sum(3, 4)
maths['sum'](3, 4)
```

`import * as maths` 其中 maths 的数据结构是固定的，无复杂数据，通过 AST 分析可查知其引用关系。

### JSON TreeShaking

Tree Shaking 甚至可对 JSON 进行优化。原理是因为 JSON 格式简单，通过 AST 容易预测结果，不像 JS 对象有复杂的类型与副作用。

```json
{
  "a": 3,
  "b": 4
}
```

```js
import obj from './main.json'

// obj.b 由于未使用到，仍旧不会被打包
console.log(obj.a)
```

### 引入支持 Tree Shaking 的 Package

为了减小生产环境体积，我们可以使用一些支持 ES 的 package，比如使用 lodash-es 替代 lodash。

可以在 npm.devtool.tech 中查看某个库是否支持 Tree Shaking。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/lodash-es.60xosee62440.png)

## 副作用

```js
// effect.js
console.log(unused()) // 副作用
export function unused() {
  console.log(1)
}
// index.js
import { unused } from './effect'
console.log(42)
```

在 index.js 中并 console.log。而 rollup 并不知道这个全局的函数去除是否安全

在打包地时候可以显示地指定 treeshake.moduleSideEffects 为 false，可以显示地告诉 rollup 外部依赖项没有其他副作用。

不指定的情况下的打包输出。 `npx rollup index.js --file bundle.js`

```js
console.log(unused())

function unused() {
  console.log(1)
}

console.log(42)
```

指定没有副作用下的打包输出。`npx rollup index.js --file bundle-no-effect.js --no-treeshake.moduleSideEffects`

```js
console.log(42)
```

## 参考笔记

- [第 147 期](../blog/147.md)

## 来源

- [《模块化系列》彻底理清 AMD,CommonJS,CMD,UMD,ES6](https://zhuanlan.zhihu.com/p/108217164)
- [Tree Shaking 的原理是什么](https://q.shanyue.tech/fe/webpack/87.html#import)
