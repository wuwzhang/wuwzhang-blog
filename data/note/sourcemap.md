---
title: SourceMap
date: '2022-06-11'
tags: ['note', 'project']
draft: false
summary: SourceMap原理
---

# SourceMap 原理

- [彻底搞懂 Webpack 的 sourcemap 配置原理](https://mp.weixin.qq.com/s/0Sq9Z0i9Q3N0likFlZB0rQ)

> 保存源代码映射关系的文件，解决前端打包后 `debug`错误定位问题

## `source map`的格式

```json
{
  "version": 3,
  "file": "out.js",
  "sourceRoot": "",
  "sources": ["foo.js", "bar.js"],
  "names": ["src", "maps", "are", "fun"],
  "mappings": "AAgBC,SAAQ;CAAEA"
}
```

### 属性

- `version`：`Source map`的版本
- `file`：转换后的文件名。
- `sourceRoot`：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。
- `sources`：转换前的文件。该项是一个数组，表示可能存在多个文件合并。
- `names`：转换前的所有变量名和属性名。
- `mappings`：记录位置信息的字符串

### `mappings`

- **对应行**: 以`;`分割
  - 第一个`;`前的数据表示第一行的内容
- **对应位置**: 以`,`分割
  - 第一个`,`前的数据表示改行代码的第一个位置
- **位置转换**: 以`VLQ`（64 未编码`[A-Z][a-z][0-9]+/`）编码表示，代表该位置对应的转换前的源码位置

```js
mappings: 'AAgBC,SAAQ;CAAEA' // 表示一共2行 第一行2个位置 第二行一个位置
```

### 位置对应原理

> 每个位置用`5`表示

- 第`1`位: 在（转换后的代码的）的第几列
- 第`2`位: 属于`sources`属性中的哪一个文件
- 第`3`位: 属于转换前代码的第几行
- 第`4`位: 属于转换前代码的第几列
- 第`5`位: 位置属于 names 属性中的哪一个变量
