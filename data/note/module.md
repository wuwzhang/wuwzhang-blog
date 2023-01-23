---
title: 模块化方案
date: '2023-01-09'
tags: ['ems', 'project']
draft: false
summary: 模块化方案
---

## 模块化方案

- [思维导图](https://www.processon.com/view/link/5c8409bbe4b02b2ce492286a#map)

### CJS（commonjs）

commonjs 是 Node 中的模块规范，通过 require 及 exports 进行导入导出 (进一步延伸的话，module.exports 属于 commonjs2)，采用同步加载模块，而加载的文件资源大多数在本地服务器，所以执行速度或时间没问题

同时，webpack 也对 cjs 模块得以解析，因此 cjs 模块可以运行在 node 环境及 webpack 环境下的，但不能在浏览器中直接使用

#### 使用

```js
// sum.js
exports.sum = (x, y) => x + y

// index.js
const { sum } = require('./sum.js')
```

#### 动态加载

```js
require(`./${a}`)
```

## AMD（Asynchronous Module Definition）

意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。其中 RequireJS 是最佳实践者。

```js
// model1.js
define(function () {
    console.log('model1 entry');
    return {
        getHello: function () {
            return 'model1';
        }
    };
});
// model2.js
define(function () {
    console.log('model2 entry');
    return {
        getHello: function () {
            return 'model2';
        }
    };
});
// main.js
define(function (require) {
    var model1 = require('./model1');
    console.log(model1.getHello());
    var model2 = require('./model2');
    console.log(model2.getHello());
});
<script src="https://cdn.bootcss.com/require.js/2.3.6/require.min.js"></script>
<script>
    requirejs(['main']);
</script>
// 输出结果
// model1 entry
// model2 entry
// model1
// model2
```

## CMD(Common Module Definition)

规范主要是 Sea.js 推广中形成的，一个文件就是一个模块，可以像 Node.js 一般书写模块代码。主要在浏览器中运行，当然也可以在 Node.js 中运行。

它与 AMD 很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD 推崇依赖就近、延迟执行。

```js
// model1.js
define(function (require, exports, module) {
    console.log('model1 entry');
    exports.getHello = function () {
        return 'model1';
    }
});
// model2.js
define(function (require, exports, module) {
    console.log('model2 entry');
    exports.getHello = function () {
        return 'model2';
    }
});
// main.js
define(function(require, exports, module) {
    var model1 = require('./model1'); //在需要时申明
    console.log(model1.getHello());
    var model2 = require('./model2'); //在需要时申明
    console.log(model2.getHello());
});
<script src="https://cdn.bootcss.com/seajs/3.0.3/sea.js"></script>
<script>
    seajs.use('./main.js')
</script>
// 输出
// model1 entry
// model1
// model2 entry
// model2
```

## UMD（Universal Module Definition）

该模式主要用来解决 CommonJS 模式和 AMD 模式代码不能通用的问题，并同时还支持老式的全局变量规范。既可以在 node/webpack 环境中被 require 引用，也可以在浏览器中直接用 CDN 被 script.src 引入

```js
// bundle.js
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    // CommonJS
    module.exports = factory(require("jquery"));
  } else {
    // 全局变量
    root.returnExports = factory(root.jQuery);
  }
})(this, function ($) {
  // ...
});
// index.html
<script src="bundle.js"></script>
<script>
  console.log(myBundle());
</script>
```

1. 判断 define 为函数，并且是否存在 define.amd，来判断是否为 AMD 规范,
2. 判断 module 是否为一个对象，并且是否存在 module.exports 来判断是否为 CommonJS 规范
3. 如果以上两种都没有，设定为原始的代码规范。

## esm (es module)

esm 是 tc39 对于 ESMAScript 的模块话规范，在 Node 及 浏览器中均支持。

esm 是未来的趋势，目前一些 CDN 厂商，前端构建工具均致力于 cjs 模块向 esm 的转化，比如 skypack、 snowpack、vite 等。

目前，在浏览器与 node.js 中均原生支持 esm。

- esm 因为是标准，所以未来很多浏览器会支持，可以很方便的在浏览器中使用。(浏览器默认加载不能省略.js)
- esm 同时兼容在 node 环境下运行
- cjs 模块输出的是一个值的拷贝，esm 输出的是值的引用，输出接口动态绑定
- cjs 模块是运行时加载，esm 是编译时加载
- esm 模块的导入导出，通过 import 和 export 来确定。 可以和 cmj 模块混合使用。

#### 使用

```js
// sum.js
export const sum = (x, y) => x + y

// index.js
import { sum } from './sum'
```

esm 为静态导入，正因如此，可在编译期进行 Tree Shaking，减少 js 体积。

#### 动态加载

```js
const ms = await import('https://cdn.skypack.dev/ms@latest')

ms.default(1000)
```

动态加载，只有当模块运行后，才能知道导出的模块是什么。

```js
var test = 'hello'
module.exports = {
  [test + '1']: 'world',
}
```

静态编译, 在编译阶段就能知道导出什么模块。

```js
export function hello() {
  return 'world'
}
```

##### 动态加载特点

1. import 命令会被 JavaScript 引擎静态分析，优先于模块内的其他内容执行。
2. export 命令会有变量声明提前的效果。

```js
// a.js
console.log('a.js')
import { age } from './b.js'

// b.js
export let age = 1
console.log('b.js 先执行')

// 运行 index.html 执行结果:
// b.js 先执行
// a.js
```

#### 浏览器中如何使用原生的 ESM

##### Native Import: Import from URL

通过 `script[type=module]`，可直接在浏览器中使用原生 ESM。这也使得前端不打包 (Bundless) 成为可能。

```html
<script type="module">
  import lodash from 'https://cdn.skypack.dev/lodash'
</script>
```

由于前端跑在浏览器中，因此它也只能从 URL 中引入 Package

1. 绝对路径: `<https://cdn.sykpack.dev/lodash>`
2. 相对路径: `./lib.js`

现在打开浏览器控制台，把以下代码粘贴在控制台中。由于 http import 的引入，你发现你调试 lodash 此列工具库更加方便了。

```shell
> lodash = await import('https://cdn.skypack.dev/lodash')

> lodash.get({ a: 3 }, 'a')
```

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-22/clipboard-2865.638ba7.webp)

##### ImportMap

在 ESM 中，可通过 importmap 使得裸导入可正常工作:

```html
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash"
    }
  }
</script>
<script type="module">
  import lodash from 'lodash'
</script>
```

##### Import Assertion

```html
<script type="module">
  import data from './data.json' assert { type: 'json' }

  console.log(data)
</script>
```

#### CommonJS 的值拷贝

```js
// a.js
const b = require('./b')
console.log(b.age)
setTimeout(() => {
  console.log(b.age)
  console.log(require('./b').age)
}, 100)
// b.js
let age = 1
setTimeout(() => {
  age = 18
}, 10)
module.exports = {
  age,
}
// 执行：node a.js
// 执行结果：
// 1
// 1
// 1
```

- CommonJS 模块中 require 引入模块的位置不同会对输出结果产生影响，并且会生成值的拷贝
- CommonJS 模块重复引入的模块并不会重复执行，再次获取模块只会获得之前获取到的模块的缓存

#### ES modules 的值的引用

```js
// a.js
import { age } from './b.js'

console.log(age)
setTimeout(() => {
  console.log(age)
  import('./b.js').then(({ age }) => {
    console.log(age)
  })
}, 100)

// b.js
export let age = 1

setTimeout(() => {
  age = 2
}, 10)
// 打开 index.html
// 执行结果：
// 1
// 2
// 2
```

## 来源

- [《模块化系列》彻底理清 AMD,CommonJS,CMD,UMD,ES6](https://zhuanlan.zhihu.com/p/108217164)
- [前端打包时 cjs、es、umd 模块有何不同](https://q.shanyue.tech/engineering/475.html#cjs-commonjs)
