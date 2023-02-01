---
title: 资源处理
date: '2023-01-24'
tags: ['AST', 'JS']
draft: true
description: AST
---

## AST(Abstract Syntax Tree)

应用

- 将 Typescript -> Javascript (typescript)
- 将 SASS/LESS -> CSS (sass/less)
- 将 ES6+ -> ES5 (babel)
- 将 Javascript 代码进行格式化 (eslint/prettier)
- 识别 React 项目中的 JSX (babel)
- ...

步骤

1. Code -> AST (Parse)
2. AST -> AST (Transform)
3. AST -> Code (Generate)

### Code -> AST (Parse) - AST 的生成

- 词法分析(Lexical Analysis)
- 语法分析(Syntactic Analysis)

```shell
source code -> Token 流 -> 结构化的AST数据结构
```

#### 词法分析

词法分析用以将代码转化为 Token 流，维护一个关于 Token 的数组

```js
// Code
a = 3

// Token 流
[
  { type: { ... }, value: "a", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "=", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "3", start: 4, end: 5, loc: { ... } },
  ...
]
```

词法分析后的 Token 流也有诸多应用，如:

1. 代码检查，如 eslint 判断是否以分号结尾，判断是否含有分号的 token
2. 语法高亮，如 highlight/prism 使之代码高亮
3. 模板语法，如 ejs 等

#### 语法分析 (Syntactic Analysis)

语法分析将 Token 流转化为结构化的 AST

```js
// Token 流
[
  { type: { ... }, value: "a", start: 0, end: 1, loc: { ... } },
  ...
]

// 结构化的 AST
{
  "type": "Program",
  "start": 0,
  "end": 5,
  "body": [
    {
      "type": "ExpressionStatement",
      "start": 0,
      "end": 5,
      "expression": {
        "type": "AssignmentExpression",
        "start": 0,
        "end": 5,
        "operator": "=",
        "left": {
          "type": "Identifier",
          "start": 0,
          "end": 1,
          "name": "a"
        },
        "right": {
          "type": "Literal",
          "start": 4,
          "end": 5,
          "value": 3,
          "raw": "3"
        }
      }
    }
  ],
  "sourceType": "module"
}
```
