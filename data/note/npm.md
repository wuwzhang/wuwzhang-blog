---
title: npm
date: '2023-01-09'
tags: ['note', 'npm', 'project']
draft: false
summary: 在日常工作中，代码常用的基本操作如下
---

# npm

## npm 发包

### 注册

- 官网或内网注册
- 本地通过命令行 npm login 登陆

### 发包

```json
// 以下三项最重要的字段
{
  "name": "@shanyue/just-demo",
  "version": "1.0.0",
  "main": "./index.js"
}
```

如若该包进行更新后，需要再次发包，可 npm version 控制该版本进行升级,遵守 Semver 规范

```shell
# 增加一个修复版本号: 1.0.1 -> 1.0.2 (自动更改 package.json 中的 version 字段)
$ npm version patch

# 增加一个小的版本号: 1.0.1 -> 1.1.0 (自动更改 package.json 中的 version 字段)
$ npm version minor

# 将更新后的包发布到 npm 中
$ npm publish --registry=xxx
```

#### Semver 规范

> Semantic Versioning 语义化版本的缩写

- major: 当你发了一个含有 Breaking Change 的 API
- minor: 当你新增了一个向后兼容的功能时
- patch: 当你修复了一个向后兼容的 Bug 时

```js
// 假设原函数
export const sum = (x: number, y: number): number => x + y

// Patch Version，修复小 Bug
export const sum = (x: number, y: number): number => x + y

// Minor Version，向后兼容
export const sum = (...rest: number[]): number => rest.reduce((s, x) => s + x, 0)

// Marjor Version，出现 Breaking Change
export const sub = () => {}
```

对于 `~1.2.3` 而言，它的版本号范围是 `>=1.2.3 <1.3.0`

对于 `^1.2.3` 而言，它的版本号范围是 `>=1.2.3 <2.0.0`

当我们 `npm i` 时，默认的版本号是 `^`，可最大限度地在向后兼容与新特性之间做取舍，但是有些库有可能不遵循该规则，我们在项目时应当使用 `yarn.lock/package-lock.json` 锁定版本号。

#### 项目指定 node 版本号

```json
{
  "engines": {
    "node": ">=14.0.0"
  }
}
```

本地项目所需要的 node 版本号改成 `>=16.0.0`，而本地的 node 版本号为 `v10.24.1`

- npm 将会发生警告，提示你本地的 node 版本与此项目不符
- yarn 将会直接报错，提示

#### package-lock 的工作流程

1. `npm i webpack`，此时下载最新 webpack 版本 5.58.2，在 `package.json` 中显示为 webpack: `^5.58.2`，版本号范围是 `>=5.58.2 < 6.0.0`
2. 在 `package-lock.json` 中全局搜索 webpack，发现 webpack 的版本是被锁定的，也是说它是确定的 `webpack: 5.58.2`
3. 经过一个月后，webpack 最新版本为 `5.100.0`，但由于 webpack 版本在 package-lock.json`` 中锁死，每次上线时仍然下载 5.58.2 版本号
4. 经过一年后，webpack 最新版本为 `6.0.0`，但由于 webpack 版本在 `package-lock.json` 中锁死，且 `package.json` 中 webpack 版本号为 `^5.58.2`，与 `package-lock.json` 中为一致的版本范围。每次上线时仍然下载 `5.58.2` 版本号
5. 支线剧情：经过一年后，webpack 最新版本为 6.0.0，需要进行升级，此时手动改写 package.json 中 webpack 版本号为 `^6.0.0`，与 `package-lock.json` 中不是一致的版本范围。此时 npm i 将下载 6.0.0 最新版本号，并重写 `package-lock.json` 中锁定的版本号为 `6.0.0`

#### 总结

当 `package-lock.json` 该 package 锁死的版本号符合 `package.json` 中的版本号范围时，将以 `package-lock.json` 锁死版本号为主。

当 `package-lock.json` 该 `package` 锁死的版本号不符合 package.json 中的版本号范围时，将会安装该 package 符合 `package.json` 版本号范围的最新版本号，并重写 package-lock.json`

### 实际发包的内容

在 npm 发包时，实际发包内容为 package.json 中 files 字段，一般只需将构建后资源(如果需要构建)进行发包，源文件可发可不发。

### 发包的实际流程

npm publish 将自动走过以下生命周期

- prepublishOnly: 如果发包之前需要构建，可以放在这里执行
- prepack
- prepare: 如果发包之前需要构建，可以放在这里执行 (该周期也会在 npm i 后自动执行)
- postpack
- publish
- postpublish

发包实际上是将本地 package 中的所有资源进行打包，并上传到 npm 的一个过程。你可以通过 npm pack 命令查看详情

需要在发包之前自动做一些事情，如测试、构建等，请在 prepulishOnly 中完成。

```json
{
  prepublishOnly: "npm run test && npm run build";
}
```

prepare 一个最常用的生命周期

- npm install 之后自动执行
- npm publish 之前自动执行

```shell
$ npm pack
npm notice
npm notice 📦  midash@0.2.6
npm notice === Tarball Contents ===
npm notice 1.1kB  LICENSE
npm notice 812B   README.md
npm notice 5.7kB  dist/midash.cjs.development.js
npm notice 13.4kB dist/midash.cjs.development.js.map
npm notice 3.2kB  dist/midash.cjs.production.min.js
npm notice 10.5kB dist/midash.cjs.production.min.js.map
npm notice 5.3kB  dist/midash.esm.js
npm notice 13.4kB dist/midash.esm.js.map
npm notice 176B   dist/omit.d.ts
......
npm notice === Tarball Details ===
npm notice name:          midash
npm notice version:       0.2.6
npm notice filename:      midash-0.2.6.tgz
npm notice package size:  11.5 kB
npm notice unpacked size: 67.8 kB
npm notice shasum:        c89d8c1aa96f78ce8b1dcf8f0f058fa7a6936a6a
npm notice integrity:     sha512-lyx8khPVkCHvH[...]kBL6K6VqOG6dQ==
npm notice total files:   46
npm notice
midash-0.2.6.tgz
```

可以前往 [npm devtool](https://npm.devtool.tech)查看各项数据

## 修复某个 npm 包的紧急 bug

它实际上是一个 diff 文件，在生产环境中可自动根据 diff 文件与版本号 (根据 patch 文件名存取) 将修复场景复原！

`patch-package`

```shell
# 修改 lodash 的一个小问题
$ vim node_modules/lodash/index.js

# 对 lodash 的修复生成一个 patch 文件，位于 patches/lodash+4.17.21.patch
$ npx patch-package lodash

# 将修复文件提交到版本管理之中
$ git add patches/lodash+4.17.21.patch
$ git commit -m "fix 一点儿小事 in lodash"

# 此后的命令在生产环境或 CI 中执行
# 此后的命令在生产环境或 CI 中执行
# 此后的命令在生产环境或 CI 中执行

# 在生产环境装包
$ npm i

# 为生产环境的 lodash 进行小修复
$ npx patch-package

# 大功告成
```

## 如何加速 npm install

1. 选择时延低的 registry，需要企业技术基础建设支持
2. `NODE_ENV=production`，只安装生产环境必要的包(如果 dep 与 devDep 没有仔细分割开来，工作量很大，可以放弃)
3. CI=true，npm 会在此环境变量下自动优化
4. 结合 CI 的缓存功能，充分利用 npm cache
5. 使用 npm ci 代替 npm i，既提升速度又保障应用安全性

## npm i 与 npm ci 的区别是什么

- npm ci 一般用于自动化部署，必须依赖于`package-lock.json`或者`npm-shrinkwrap.json`
- npm ci 安装时会删除`node_modules`
- 如果`package-lock.json`和`package.json`不匹配，则 npm ci 报错
- npm ci 不会更新`package-lock.json`
- npm ci 只能一次安装整个项目：使用此命令无法添加单个依赖项（package.json 被锁定）

## npm cache

npm 会把所有下载的包，保存在用户文件夹下面。(`~/.npm`)

npm install 之后会计算每个包的 sha1 值(PS:安全散列算法(Secure Hash Algorithm))，然后将包与他的 sha1 值关联保存在 `package-lock.json` 里面，下次 npm install 时，会根据 `package-lock.json` 里面保存的 sha1 值去文件夹里面寻找包文件，如果找到就不用从新下载安装了。

```shell
# 上面这个命令是重新计算，磁盘文件是否与 sha1 值匹配，如果不匹配可能删除
npm cache verify

# 删除磁盘所有缓存文件
npm cache clean --force
```

## npm 的 workspace 原理和使用（npm v7.x 新增 node@15.0.0）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4b52f61487e43698830d018f57d3215~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

- 依赖共享。子工作区可以使用主工作区的所有依赖
- 导出子工作区，供所有工作区使用。可以将子工作区导出到 node_modules 中，供所有工作区使用

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1394c09b75e4e409fefafca1e1a490d~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

node_modules
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/011b1db339e445b0a3ee61a8ec215680~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## npm install 之后需要执行一些处理工作

- 使用 npm script 生命周期中的 npm prepare，他将会在发包 (publish) 之前以及装包 (install) 之后自动执行。

```json
{
  "prepare": "npm run build & node packages/husky/lib/bin.js install"
}
```

- 如果指向在装包之后自动执行，可使用 npm postinstall

```json
{
  "postinstall": "patch-package"
}
```