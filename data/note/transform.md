---
title: 类型转换
date: '2022-06-11'
tags: ['note', 'js']
draft: false
summary: 类型转换
---

# 类型转换

## 常见的类型转换有：

- 强制转换（显示转换）
- 自动转换（隐式转换）

### 显示转换

显示转换，即我们很清楚可以看到这里发生了类型的转变，常见的方法有：

- Number()
- parseInt()
- String()
- Boolean()

#### Object.prototype.valueOf()

> valueOf() 方法返回指定对象的原始值。

| 对象     | 返回值                                                   |
| -------- | -------------------------------------------------------- |
| Array    | 返回数组对象本身。                                       |
| Boolean  | 布尔值。                                                 |
| Date     | 存储的时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC。 |
| Function | 函数本身。                                               |
| Number   | 数字值。                                                 |
| Object   | 对象本身。这是默认情况。                                 |
| String   | 字符串值。                                               |
|          | Math 和 Error 对象没有 valueOf 方法。                    |

#### parseInt()

parseInt 相比 Number，就没那么严格了，parseInt 函数逐个解析字符，遇到不能转换的字符就停下来

#### Number()

| 类型      | 转换值                                                                                |
| --------- | ------------------------------------------------------------------------------------- |
| 布尔值    | 0/1                                                                                   |
| 数值      | 直接返回                                                                              |
| 字符串    | 除能转换的，其余返回 NaN                                                              |
| undefined | NaN                                                                                   |
| null      | 0                                                                                     |
| 对象      | 想调用 valueOf, 按上述规则转换返回值，如果是 NaN,则调用 toString,再按字符串的转换方式 |
| Symbol    | TypeError                                                                             |

### String()

| 类型      | 转换值            |
| --------- | ----------------- |
| 布尔值    | 'ture'/'false'    |
| 数值      | 对应字符串        |
| 字符串    | String            |
| undefined | 'undefined        |
| null      | 'null'            |
| 对象      | '[object,Object]' |
| Symbol    | TypeError         |

#### Boolean

![](https://static.vue-js.com/53bdad10-6692-11eb-ab90-d9ae814b240d.png)

### 隐式转换

在隐式转换中，我们可能最大的疑惑是 ：何时发生隐式转换？

我们这里可以归纳为两种情况发生隐式转换的场景：

- 比较运算`（==、!=、>、<）、if、while`需要布尔值地方
- 算术运算`（+、-、*、/、%）`

--

## 乘性操作符

- 有不是数字的操作符调用 Number()处理
- NaN \* anything // NaN
- Infinity \* 0 // NaN
- Infinity \* 非 0 // 根据非 0 返回 ±Infinity

## 加性操作符

### 1. 字符串 + 其他原始类型

> 加号运算符中字符串具有高优先级

```js
'1' + 123
'1' + false
'1' + null
'1' + undefined
```

- 原始类型转换成 toString()、String()
- null 和 undefined 没有 toString

### 2. 数值 + 非字符串原始类型

```js
1 + true
1 + null
1 + undefined
```

- 原始类型调用 toNumber()

### 3. 非数值、字符串以为的原始类型相加

```js
ture + true
ture + null
undefined + undefined
null + null
undefined + null
```

- 调用 toNumber()

#### 4. 任意一项为对象

```js
1 + []
1 + {}
'1' + []
[] + []
[] + {}
{} + {} // 不同浏览器不同结果
{} + []
```

- 同 1
- {} 开头会被人为是区块

### Date 对象

- toString

```js
Infinity + Infinity
-Infinity + Infinity
-0 + +0
'1' + 123
'1' + false
'1' + null
'1' + undefined
1 + true
1 + null
1 + undefined
true + true
true + null
undefined + undefined
null + null
undefined + null
1 + []
1 + {}
1 + { valueOf() { return 1 } }
'1' + []
[] + []
[] + {}
{} + {} // 不同浏览器不同结果
{} + []
1 + new Date()

[,] + [,]; // -> ""
[] + [] === [,] + [,]; // -> true
[,,,] + [,,,]; // -> ",,,,"
([,,,] + [,,,]).length === [,,,,].length; // -> true

"" - - ""
0/0
true++
!5 + !5
"" && -0
+!!NaN * "" - - [,]
```

### 减法操作符

- 任意操作数为字符串、布尔、null、undefined 都调用 Number()
- 对象先潘队是否能调用 valueOf()，能就调用 valueOf()，如果值是 NaN，这返回 NaN,没有 valueOf(),想调用 toString(),在 Number()

## ==

- 布尔 转换成 数值
- 字符串 和 数值 ：字符串转换为数值
- 对象调用 valueOf
- null 和 undefined 相等
- null 和 undefined 不转换成其他类型比较

## ===

- 只有操作符在不转换情况下相等 才返回 true
