---
title: 前端工程化-质量保证
date: '2023-01-08'
tags: ['project', 'ci/cd']
draft: false
description: 前端工程化、ci/cd
---

# 前端工程化 - 运维

## CI/CD

- CI，Continuous Integration，持续集成。
- CD，Continuous Deployment，持续部署。

CICD 一般合称，无需特意区分二者区别。从开发、测试到上线的过程中，借助于 CICD 进行一些自动化处理，保障项目质量。

CICD 与 git 集成在一起，可理解为服务器端的 git hooks: 当代码 push 到远程仓库后，借助 WebHooks 对当前代码在构建服务器(即 CI 服务器，也称作 Runner)中进行自动构建、测试及部署等。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-17/clipboard-6509.1b9b98.webp)

它有若干好处:

1. 功能分支提交后，通过 CICD 进行自动化测试、语法检查等，如未通过 CICD，则无法 CodeReview，更无法合并到生产环境分支进行上线
2. 功能分支提交后，通过 CICD 检查 npm 库的风险、检查构建镜像容器的风险等
   功能分支提交后，通过 CICD 对当前分支代码构建独立镜像并生成独立的分支环境地址进行测试，如对每一个功能分支生成一个可供测试的地址，一般是 `<branch>.dev.shanyue.tech` 此种地址
   功能分支测试通过后，合并到主分支，自动构建镜像并部署到生成环境 (一般生成环境需要手动触发、自动部署)

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-17/clipboard-7669.a41a94.webp)

#### CICD 工具

CICD 集成于 CICD 工具及代码托管服务。CICD 有时也可理解为进行 CICD 的构建服务器，而提供 CICD 的服务，如以下产品，将会提供构建服务与 github/gitlab 集成在一起。

- jenkins
- Travis CI

如果你们公司没有 CICD 基础设置，那么你可以尝试 github 免费的 CICD 服务: github actions (opens new window)。

公司一般以 gitlab CI 作为 CICD 工具，此时需要自建 gitlab Runner 作为构建服务器。

#### 一段简单的 CICD 配置

```
deploy:
  stage: deploy
  only:
    - master
  script:
    - docker build -t harbor.shanyue.tech/fe/devtools-app
    - docker push harbor.shanyue.tech/fe/devtools-app
    - helm upgrade -install devtools-app-chart .
```

### 参考笔记

- [第 106 期](../blog/106.md####三、npmci)

### 来源

- [请问什么是 CICD](https://q.shanyue.tech/engineering/748.html#cicd-%E5%B7%A5%E5%85%B7)

## git hooks

git 允许在各种操作之前添加一些 hook 脚本，如未正常运行则 git 操作不通过。最出名的还是以下两个

- precommit
- prepush

而 hook 脚本置于目录 `~/.git/hooks` 中，以可执行文件的形式存在。

```shell
$ ls -lah .git/hooks
applypatch-msg.sample     pre-merge-commit.sample
commit-msg.sample         pre-push.sample
fsmonitor-watchman.sample pre-rebase.sample
post-update.sample        pre-receive.sample
pre-applypatch.sample     prepare-commit-msg.sample
pre-commit.sample         update.sample
```

另外 git hooks 可使用 core.hooksPath 自定义脚本位置。

```bash
# 可通过命令行配置 core.hooksPath
$ git config 'core.hooksPath' .husky

# 也可通过写入文件配置 core.hooksPath
$ cat .git/config
[core]
  ignorecase = true
  precomposeunicode = true
  hooksPath = .husky
```

在前端工程化中，husky 即通过自定义 core.hooksPath 并将 npm scripts 写入其中的方式来实现此功能。

`~/.husky` 目录下手动创建 hook 脚本。

```shell
# 手动创建 pre-commit hook
$ vim .husky/pre-commit
```

在 pre-commit 中进行代码风格校验

```shell
#!/bin/sh

npm run lint
npm run test
```

### 来源

- [git hooks 原理是什么](https://q.shanyue.tech/engineering/741.html)

## Audit

> 如何检测出你们安装的依赖是否安全

Audit，审计，检测你的所有依赖是否安全。npm audit/yarn audit 均有效。

通过审计，可看出有风险的 package、依赖库的依赖链、风险原因及其解决方案。

```shell
$ npm audit production

$ yarn audit dependencies
```

通过 npm audit fix 可以自动修复该库的风险，原理就是升级依赖库，升级至已修复了风险的版本号。

```shell
$ npm audit fix
```

yarn audit 无法自动修复，需要使用 yarn upgrade 手动更新版本号，不够智能。

synk (opens new window)是一个高级版的 npm audit，可自动修复，且支持 CICD 集成与多种语言。

```shell
$ npx snyk

$ npx wizard
```

## upgrade

> 在项目中，如何平滑升级 npm 包

假设 react 当前版本号为 17.0.1，我们要升级到 17.0.2 应该如何操作？

```git
- "react": "17.0.1",
+ "react": "17.0.2",
```

### 自动发现更新

升级版本号，最不建议的事情就是手动在 package.json 中进行修改。

此时可借助于 npm outdated，发现有待更新的 package。

![](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-10/clipboard-6918.0c6824.webp)

```shell
$ npm outdated -l
Package                 Current    Wanted    Latest  Location                            Depended by  Package Type     Homepage
@next/bundle-analyzer    10.2.0    10.2.3    12.0.3  node_modules/@next/bundle-analyzer  app          dependencies     https://github.com/vercel/next.js#readme
```

### 自动更新版本号

使用 npm outdated 虽能发现需要升级版本号的 package，但仍然需要手动在 package.json 更改版本号进行升级。

此时推荐一个功能更强大的工具 npm-check-updates，比 npm outdated 强大百倍。

npm-check-updates -u，可自动将 package.json 中待更新版本号进行重写。

升级 `[minor]` 小版本号，有可能引起 Break Change，可仅仅升级到最新的 patch 版本。

```shell
$ npx npm-check-updates --target patch
```

### npm update

1. 更新模块只能往后面版本更新，不能往老的版本回滚更新。
2. 只能个更新`[minor]`小版本号，不能更新`[major]`大版本号

`$ npm update lodash` 只能将 `3.9.1` 更新到小版本号最大的那个版本，这里是 `3.10.1`，而不能更新到 `4.*` 版本

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

它实际上是一个 diff 文件，在生产环境中可自动根据 diff 文件与版本号 (根据 patch 文件名存取) 将修复场景复原！

```git
$ cat patches/lodash+4.17.21.patch
diff --git a/node_modules/lodash/index.js b/node_modules/lodash/index.js
index 5d063e2..fc6fa33 100644
--- a/node_modules/lodash/index.js
+++ b/node_modules/lodash/index.js
@@ -1 +1,3 @@
+console.log('DEBUG SOMETHING')
+
 module.exports = require('./lodash');
\ No newline at end of file
```
