---
title: webpack
date: '2023-01-10'
tags: ['note', 'webpack']
draft: false
summary: webpack 是一个用于现代JavaScript应用程序的静态模块打包工具
---

# webpack

> webpack 是一个用于现代 JavaScript 应用程序的静态模块打包工具

当 webpack 处理应用程序时，它会在内部构建一个依赖图，此依赖图对应映射到项目所需的每个模块（不再局限 js 文件），并生成一个或多个 bundle

![](https://static.vue-js.com/9ce194a0-a578-11eb-85f6-6fac77c0c9b3.png)

- 编译代码能力: 浏览器兼容问题
- 模块整合能力: 解决浏览器频繁请求文件的问题
- 万物皆可模块能力: 支持不同种类的前端模块类型，统一的模块化方案，所有资源文件的加载都可以通过代码控制

## 运行流程

![](https://static.vue-js.com/b566d400-a658-11eb-85f6-6fac77c0c9b3.png)

### 初始化流程

从配置文件和 Shell 语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数

```js
// 文件配置
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');

module.exports = {
  // 入口文件，是模块构建的起点，同时每一个入口文件对应最后生成的一个 chunk。
  entry: './path/to/my/entry/file.js'，
  // 文件路径指向(可加快打包过程)。
  resolve: {
    alias: {
      'react': pathToReact
    }
  },
  // 生成文件，是模块构建的终点，包括输出文件与输出路径。
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  // 这里配置了处理各模块的 loader ，包括 css 预处理 loader ，es6 编译 loader，图片处理 loader。
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ],
    noParse: [pathToReact]
  },
  // webpack 各插件对象，在 webpack 的事件流中执行对应的方法。
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

### 编译构建流程

从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理

```js
module.exports = {
  entry: './src/file.js',
}
```

初始化完成后会调用 Compiler 的 run 来真正启动 webpack 编译构建流程，主要流程如下：

- compile 开始编译: 执行模块创建、依赖收集、分块、打包等主要任务的对象
- make 从入口点分析模块及其依赖的模块，创建这些模块对象
- build-module 构建模块
- seal 封装构建结果
- emit 把各个 chunk 输出到结果文件

![](https://static.vue-js.com/d77fc560-a658-11eb-85f6-6fac77c0c9b3.png)

## loader

默认情况下，在遇到 import 或者 require 加载模块的时候，webpack 只支持对 js 和 json 文件打包，像 css、sass、png 等这些类型的文件的时候，需要配置对应的 loader 进行文件内容的解析

可以通过配置文件（webpack.config.js）、内联（在每个 import 语句中显式指定 loader）

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
}
```

loader 支持链式调用，链中的每个 loader 会处理之前已处理过的资源，最终变为 js 代码。顺序为相反的顺序执行，即上述执行方式为 sass-loader、css-loader、style-loader

可以通过 loader 的预处理函数，为 JavaScript 生态系统提供更多能力。用户现在可以更加灵活地引入细粒度逻辑，例如：压缩、打包、语言翻译和更多其他特性

### [常见 loader](https://cloud.tencent.com/developer/chapter/17844)

- style-loader: 将 css 添加到 DOM 的内联样式标签 style 里
- css-loader :允许将 css 文件通过 require 的方式引入，并返回 css 代码
- less-loader: 处理 less
- sass-loader: 处理 sass
- postcss-loader: 用 postcss 来处理 CSS
- autoprefixer-loader: 处理 CSS3 属性前缀，已被弃用，建议直接使用 postcss
- row-loader: 用于 webpack 的加载器，可让您将文件作为字符串导入。
- file-loader: 将所需的对象作为文件发送并返回其公用 URL, 分发文件到 output 目录并返回相对路径
- url-loader: 将文件加载为 base64 编码的 URL, 和 file-loader 类似，但是当文件小于设定的 limit 时可以返回一个 Data Url
- html-minify-loader: 压缩 HTML
- babel-loader: 用 babel 来转换 ES6 文件到 ES

### [自己实现一个 loader](https://webpack.docschina.org/api/loaders/)

- [图解 Webpack——实现一个 Loader](https://developer.aliyun.com/article/916711)

所导出的函数必须是使用 function 关键字声明的，不可以使用箭头函数，因为 Webpack 会修改函数的 this，而箭头函数没有自己的 this，所以可能会出错

```js
// 导出一个函数，source为webpack传递给loader的文件源内容
module.exports = function (source) {
  const content = doSomeThing2JsString(source)

  // 如果 loader 配置了 options 对象，那么this.query将指向 options
  const options = this.query

  // 可以用作解析其他模块路径的上下文
  console.log('this.context')

  /*
   * this.callback 参数：
   * error：Error | null，当 loader 出错时向外抛出一个 error
   * content：String | Buffer，经过 loader 编译后需要导出的内容
   * sourceMap：为方便调试生成的编译后内容的 source map
   * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
   */
  this.callback(null, content) // 异步
  return content // 同步
}
```

- [自己实现一个 webpack loader](juejin.cn/post/7150314373087657992)

```js
// webpack.config.js 配置loader
{ 
  test: /\.md$/,
  use: [
          { loader: './markdown-loader', options: { headerIds: false }}
      ]
 }


 // 编写loader
 // markdown-loader.js
 const marked = require("marked");
 function markdownLoader(source) {
    const options = this.query; // 获取loader参数 { headerIds: false }

    // 另一种options获取方法：
    const schema = {
        type: 'object', //options是一个对象
        properties: {
            headerIds: {
                type: 'boolean'
            },
        }
    }
    const options = this.getOptions(schema) || {}

    // 处理
    const html = marked.marked(source, options); // 使用marked插件转换为html
    const code = `module.exports = ${JSON.stringify(html)}`
    return code; // 传出Javascript
  }
  module.exports = markdownLoader;


 // html引用
 import html from './markdown.md';
 document.getElementById("root").innerHTML = html;

```

## plugins

plugin 赋予其各种灵活的功能，例如打包优化、资源管理、环境变量注入等，它们会运行在 webpack 的不同阶段（钩子 / 生命周期），贯穿了 webpack 整个编译周期, plugins 可以做其他所有 loaders 做不了的事情, 比如:

- bundle optimization(bundle 优化)
- assets management(assets 管理)
- injection of environment variables(注入环境变量)
- ...

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
module.exports = {
  ...
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
};
```

### 自己编写一个 plugin

其本质是一个具有 apply 方法 javascript 对象

apply 方法会被 webpack compiler 调用，并且在整个编译生命周期都可以访问 compiler 对象

- 插件必须是一个函数或者是一个包含 apply 方法的对象，这样才能访问 compiler 实例
- 传给每个插件的 compiler 和 compilation 对象都是同一个引用，因此不建议修改
- 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住

```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
   // Webpack 会调用 MyPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply (compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap('MyPlugin', compilation => {
        // compilation: 当前打包构建流程的上下文
        console.log(compilation);

        // do something...
    })
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

### 常见 plugins

- HtmlWebpackPlugin: 在打包结束后，⾃动生成⼀个 html ⽂文件，并把打包生成的 js 模块引⼊到该 html 中
- clean-webpack-plugin: 删除（清理）构建目录
- mini-css-extract-plugin: 提取 CSS 到一个单独的文件中
- DefinePlugin: 允许在编译时创建配置的全局对象，是一个 webpack 内置的插件，不需要安装
- copy-webpack-plugin: 复制文件或目录到执行区域，如 vue 的打包过程中，如果我们将一些文件放到 public 的目录下，那么这个目录会被复制到 dist 文件夹中

![](https://static.vue-js.com/bd749400-a7c2-11eb-85f6-6fac77c0c9b3.png)

## loader 和 plugin 区别

- loader 是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中
- plugin 赋予了 webpack 各种灵活的功能，例如打包优化、资源管理、环境变量注入等，目的是解决 loader 无法实现的其他事

![](https://static.vue-js.com/9a04ec40-a7c2-11eb-ab90-d9ae814b240d.png)

- loader 运行在打包文件之前
- plugins 在整个编译周期都起作用

在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果

对于 loader，实质是一个转换器，将 A 文件进行编译形成 B 文件，操作的是文件，比如将 A.scss 或 A.less 转变为 B.css，单纯的文件转换过程

## 热更新（HMR: Hot Module Replacement）

> 模块热替换，指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用

```js
// 配置
const webpack = require('webpack')
module.exports = {
  // ...
  devServer: {
    // 开启 HMR 特性
    hot: true,
    // hotOnly: true
  },
}
```

### 实现原理

![](https://static.vue-js.com/adc05780-acd4-11eb-ab90-d9ae814b240d.png)

- Webpack Compile：将 JS 源代码编译成 bundle.js
- HMR Server：用来将热更新的文件输出给 HMR Runtime
- Bundle Server：静态资源文件服务器，提供文件访问路径
- HMR Runtime：socket 服务器，会被注入到浏览器，更新文件的变化
- bundle.js：构建输出的文件
- 在 HMR Runtime 和 HMR Server 之间建立 websocket，即图上 4 号线，用于实时更新文件变化

1. 启动阶段为上图 1 - 2 - A - B

在编写未经过 webpack 打包的源代码后，Webpack Compile 将源代码和 HMR Runtime 一起编译成 bundle 文件，传输给 Bundle Server 静态资源服务器

2. 更新阶段为上图 1 - 2 - 3 - 4

当某一个文件或者模块发生变化时，webpack 监听到文件变化对文件重新编译打包，编译生成唯一的 hash 值，这个 hash 值用来作为下一次热更新的标识

根据变化的内容生成两个补丁文件：manifest（包含了 hash 和 chunkId，用来说明变化的内容）和 chunk.js 模块

由于 socket 服务器在 HMR Runtime 和 HMR Server 之间建立 websocket 链接，当文件发生改动的时候，服务端会向浏览器推送一条消息，消息包含文件改动后生成的 hash 值，如下图的 h 属性，作为下一次热更细的标识

在浏览器接受到这条消息之前，浏览器已经在上一次 socket 消息中已经记住了此时的 hash 标识，这时候我们会创建一个 ajax 去服务端请求获取到变化内容的 manifest 文件

mainfest 文件包含重新 build 生成的 hash 值，以及变化的模块，对应上图的 c 属性

浏览器根据 manifest 文件获取模块变化的内容，从而触发 render 流程，实现局部模块更新

### 总结

- 通过 webpack-dev-server 创建两个服务器：提供静态资源的服务（express）和 Socket 服务
- express server 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- socket server 是一个 websocket 的长连接，双方可以通信
- 当 socket server 监听到对应的模块发生变化时，会生成两个文件.json（manifest 文件）和.js 文件（update chunk）
- 通过长连接，socket server 可以直接将这两个文件主动发送给客户端（浏览器）
- 浏览器拿到两个新的文件后，通过 HMR runtime 机制，加载这两个文件，并且针对修改的模块进行更新
