## [Vite](https://juejin.cn/post/7106136866381889573)
> 是旨在提升开发者体验的下一代 JavaScript 构建工具，核心借助了浏览器的原生 ES Modules 和像 esbuild 这样的将代码编译成 native code 的打包工具。

Vite 主要有两方面组成：
- 一个开发服务器，基于 ESM 提供丰富的内建能力，比如速度快到惊人的模块热更新（HMR）；
- 一套构建指令，使用 rollup 进行代码打包，且零配置即可输出用于生产环境的高度优化的静态代码。

Vite 的核心能力和 webpack + webpack-dev-server 相似，但是在开发者体验上有一些提升：
- 无论项目大小有多大，启动应用都只需更少的时间；
- 无论项目大小有多大，HMR（Hot Module Replacing）热更新都可以做到及时响应；
- 按需编译；
- 零配置，开箱即用；
- Esbuild 能力带来的 Typescript/jsx 的原生支持。

大型的 JavaScript 项目在开发和生产环境有比较差的性能表现，往往是因为我们使用的构建工具没有充分做到并行处理、内存优化和缓存。

### 核心理念：Bundless 开发环境构建
浏览器的原生 ES Modules 能力允许在不将代码打包到一起的情况下运行 JavaScript 应用。Vite 的核心理念很简单，就是借助浏览器原生 ES Modules 能力，当浏览器发出请求时，为浏览器按需提供 ES Module 文件，浏览器获取 ES Module 文件会直接执行。

#### 应用启动
Vite 将应用中的模块分为依赖和源码两类，分别进行服务器启动时间的优化。

- 依赖模块，开发过程中基本不会变化。Vite 对依赖采用了 esbuild 预构建的方式，esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍；
- 源码模块，是用户自己开发的代码，会经常变动。

Vite 在浏览器请求时按需转换并以原生 ESM 方式提供源码，让浏览器接管了打包程序的部分工作。

#### Vite 如何工作？
Vite 通过原生 ES Modules 托管源代码，本质上是让浏览器来接管部分打包器的工作。Vite 只会在浏览器请求发生时，按需将源码转成 ES Modules 格式返回给浏览器，由浏览器加载并执行 ES Modules 文件。

![Alt text](/static/images/note/image-2.png)

### 热更新
在基于 Bundle 构建的构建器中，当一个文件变动时，重新构建整个 Bundle 文件是非常低效的，且随着应用规模的上升，构建速度会直线下降。

传统的构建器虽然提供了热更新的能力，但是也会存在随着应用规模上升，热更新速度显著下降的问题。

Vite 基于 ESM 按需提供源码文件，当一个文件被编辑后，Vite 只会重新编译并提供该文件。因此，无论项目规模多大，Vite 的热更新都可以保持快速更新。

此外，Vite 合理利用浏览器缓存来加速页面加载，源码模块请求根据 304 Not Modified 进行协商缓存；依赖模块请求通过 Cache-Control: max-age=31536000,immutable 进行强缓存，因此一旦缓存，不会再次请求。

### 生产环境仍需打包
在生产环境使用 ESM 会存在大量额外网络请求问题，因此生产环境不太试用 ESM，最好的方式还是代码进行 tree-shaking、懒加载、和 chunk 分隔等。

那么生产环境的构建为什么不直接使用 esbuild，而是使用 rollup 呢？这是因为 esbuild 在代码分隔、css 处理等方面的功能仍在开发中，rollup 在应用打包方面更加的成熟且灵活。

### 性能提升
Vite 依托支持原生 ESM 模块的现代浏览器，极大的降低了应用的启动和重新构建时间。Vite 本质上是一个在开发环境为浏览器按需提供文件的 Web Server，这些文件包含源码模块和在第一次运行时使用 esbuild 预构建的依赖模块

Vite 和 Webpack 的主要不同在于开发环境下对于源码如何被托管以及支持哪种模块规范。

### 依赖预构建
Vite 在首次启动时，会进行依赖预构建。依赖预构建有两个目的：
- CommonJs 和 UMD 的兼容性：开发阶段，Vite 的 Dev Server 将所有代码视为原生 ES 模块。因此，Vite 必须将 CommonJS 或 UMD 发布的依赖项转为 ESM。
- 性能：Vite 将有很多内部模块的依赖视为单个模块，以提升页面加载性能。比如，lodash-es 拥有超过 600 个内部模块，当 import {debounce} from 'lodash-es'; 时，浏览器会同时发起超过 600 个请求，并行请求过多将会显著影响页面加载性能。因此预构建将 lodash-es 视为一个模块，浏览器只需要发起一个请求。

### 缓存
#### 文件系统缓存
Vite 会将预构建的依赖缓存到 node_modules/.vite ，它根据几个源决定是否需要重新运行预构建步骤：
- package.json 中的 dependencies 列表；
- 包管理的 lockfile，例如 package-lock.json，yarn.lock 或者 pnpm-lock.yaml
- 可能在 vite.config.js 相关字段中配置过的。

只有在上述其中一项发生更改时，才需要重新运行预构建。
如果处于某些原因，你想要强制 Vite 重新构建依赖，你可以用 --force 命令选项启动开发服务器，或者手动删除 node_modules/.vite 目录。
#### 浏览器缓存
解析后的依赖请求会以 HTTP 头 max-age=31536000,immutable 强缓存，以提高开发时的页面重载性能。如果你想通过本地编辑来调试依赖项，可以：
- 通过浏览器调试工具的 Network 选项卡暂时禁用缓存；
- 重启 Vite Dev Server，并添加 --force 命令以重新构建依赖；
- 重新载入页面。

### Typescript 原生支持
Vite 天然支持引入 .ts 文件，单仅支持 .ts 文件的转译工作，并不执行任何类型检查。

Vite 使用 esbuild 将 TypeScript 转译到 JavaScript，约是 tsc 速度的 20-30 倍，同时 HMR 更新到浏览器的时间小于 50 ms。

### 对比
简单对 Webpack 和 Vite 进行一个对比：
#### Webpack
- 支持的模块规范：ES Modules，CommonJS 和 AMD Modules；
- Dev Server：通过 webpack-dev-server 托管打包好的模块；
- 生产环境构建：webpack

### Vite
- 支持的模块规范：ES Modules；
- Dev Server：原生 ES Modules；
- 生产环境构建：Rollup

### 总结
由于浏览器原生 ES Modules 的支持，当浏览器发出请求时，Vite 可以在不将源码打包为一个 Bundle 文件的情况下，将源码文件转化为 ES Modules 文件之后返回给浏览器。这样 Vite 的应用启动和热更新 HMR 时的速度都不会随着应用规模的增加而变慢。


### esbuild
esbuild 是一个由 Evan Wallace 开发的 JavaScript 打包器。由 Go 语言编写，打包速度和其他打包器相比，具有非常明显的优势。

![Alt text](/static/images/note/esbuild.png)