- [npm.devtool: Find the best package for you, Analyze tech stack for your project.](https://npm.devtool.tech/)
- [skypack: Load optimized npm packages with no install and no build tools.](https://www.skypack.dev/)
- [npm-update-check: upgrades your package.json dependencies to the latest versions, ignoring specified versions.](https://www.npmjs.com/package/npm-check-updates)
- [xo](https://github.com/xojs/xo)
- [depcheck 检查前端项目中未使用的依赖包](https://www.npmjs.com/package/depcheck)

npm-check 用于检查项目中的依赖项，并提供有关过期，未使用和缺少依赖项的信息。npm-check 是基于 depcheck 实现的。它可以提示项目依赖项的状态，但它只会检查并更新项目的直接依赖项，并不会检查和更新嵌套的依赖项（即项目的依赖项的依赖项）
npm-check 具有以下特性：
- 告诉哪些内容已经过期。
- 提供包的文档链接，以便决定是否要更新。
- 提醒代码中没有使用某个依赖项。
- 通过 -g 支持全局安装的包。
- 通过 -u 提供交互式更新，减少输入和拼写错误。
- 支持公有和私有的 @scoped/packages。
- 支持 ES6 风格的 import from 语法。
- 使用安装的版本的 npm 进行模块升级，包括新的 npm@3，以确保依赖项到达预期的位置。
- 适用于任何公共的 npm 注册表、私有注册表以及类似 Sinopia 的备用注册表。
- 在 package.json 中设置 private: true 的包不会在注册表中查询。
- 为命令行应用添加了表情符号。
- 适用于 npm@2 和 npm@3，以及一些新的替代安装程序，例如 ied 和 pnpm。