---
title: typescript
date: '2023-01-03'
tags: ['note', 'typescript']
draft: false
summary: TypeScript 是 JavaScript 的类型的超集，支持 ES6 语法，支持面向对象编程的概念，如类、接口、继承、泛型等
---

<TOCInline toc={props.toc} asDisclosure toHeading={3} />

## 什么是 ts

TypeScript 是 JavaScript 的类型的超集，支持 ES6 语法，支持面向对象编程的概念，如类、接口、继承、泛型等

![](https://static.vue-js.com/61c2c1f0-0950-11ec-a752-75723a64e8f5.png)

## TypeScript 的特性主要有如下

- 类型批注和编译时类型检查 ：在编译时批注变量类型
- 类型推断：ts 中没有批注变量类型会自动推断变量的类型
- 类型擦除：在编译过程中批注的内容和接口会在运行时利用工具擦除
- 接口：ts 中用接口来定义对象类型
- 枚举：用于取值被限定在一定范围内的场景
- Mixin：可以接受任意类型的值
- 泛型编程：写代码时使用一些以后才指定的类型
- 名字空间：名字只在该区域内有效，其他区域可重复使用该名字而不冲突
- 元组：元组合并了不同类型的对象，相当于一个可以装不同类型数据的数组

## typescript 的数据类型有哪些

- number、string、array、tuple、boolean、object、null、undefined、void、never、enum、any、unknow

## TypeScript 中枚举类型的理解？应用场景

通俗来说，枚举就是一个对象的所有可能取值的集合

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

// 编译后
var Direction
;(function (Direction) {
  Direction[(Direction['Up'] = 0)] = 'Up'
  Direction[(Direction['Down'] = 1)] = 'Down'
  Direction[(Direction['Left'] = 2)] = 'Left'
  Direction[(Direction['Right'] = 3)] = 'Right'
})(Direction || (Direction = {}))

console.log(Direction.Up === 0) // true
console.log(Direction[0]) // Up
```

## 说说你对 TypeScript 中接口的理解

一个接口所描述的是一个对象相关的属性和方法，但并不提供具体创建此对象实例的方法

## type 和 interface 区别

- 类型别名不仅可以用来表示基本类型，还可以用来表示对象类型、联合类型、元组和交集;interface 仅限于描述对象类型。
- 类无法实现联合类型
- 声明合并:如果你多次声明一个同名的接口，TypeScript 会将它们合并到一个声明中，并将它们视为一个接口。如果是 type 的话，重复使用 Person 是会报错的
- 索引签名问题

```ts
type userName = string; // 基本类型
type userId = string | number; // 联合类型
type arr = number[];

type SetPoint = (x: number, y: number) => void;
interface SetPoint {
  (x: number, y: number): void;
}


type Person = { name: string; } | { setName(name:string): void };
// 无法对联合类型Person进行实现
// error: A class can only implement an object type or intersection of object types with statically known members.
class Student implements Person {
  name= "张三";
  setName(name:string):void{
        // todo
    }
}

interface Person { name: string }
interface Person { age: number }
let user: Person = {
    name: "Tolu",
    age: 0,
};

type Person { name: string };
// Error: 标识符“Person”重复。ts(2300)
type Person { age: number }

interface propType{
    [key: string] : string
}
let props: propType
type dataType = {
    title: string
}
interface dataType1 {
    title: string
}
const data: dataType = {title: "订单页面"}
const data1: dataType1 = {title: "订单页面"}
props = data
// Error:类型“dataType1”不可分配给类型“propType”; 类型“dataType1”中缺少索引签名
props = data1
```

![](https://s2.51cto.com/oss/202204/07/679528b981212b359db251a59332088834ffc4.jpg)

## 装饰器

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上

是一种在不改变原类和使用继承的情况下，动态地扩展对象功能

同样的，本质也不是什么高大上的结构，就是一个普通的函数，@expression 的形式其实是 Object.defineProperty 的语法糖

expression 求值后必须也是一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入

```ts
function addAge(constructor: Function) {
  constructor.prototype.age = 18
}

@addAge
class Person {
  name: string
  age!: number
  constructor() {
    this.name = 'huihui'
  }
}

let person = new Person()

console.log(person.age) // 18
```

- 方法/属性装饰
  - target：对象的原型
  - propertyKey：方法的名称
  - descriptor：方法的属性描述符

```ts
// 声明装饰器修饰方法/属性
function method(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log(target)
  console.log('prop ' + propertyKey)
  console.log('desc ' + JSON.stringify(descriptor) + '\n\n')
  descriptor.writable = false
}

function property(target: any, propertyKey: string) {
  console.log('target', target)
  console.log('propertyKey', propertyKey)
}

class Person {
  @property
  name: string
  constructor() {
    this.name = 'huihui'
  }

  @method
  say() {
    return 'instance method'
  }

  @method
  static run() {
    return 'static method'
  }
}

const xmz = new Person()

// 修改实例方法say
xmz.say = function () {
  return 'edit'
}
```

![](https://static.vue-js.com/e96bc1b0-114d-11ec-8e64-91fdec0f05a1.png)

- 参数装饰
  - target ：当前对象的原型
  - propertyKey ：参数的名称
  - index：参数数组中的位置

```ts
function logParameter(target: Object, propertyName: string, index: number) {
  console.log(target)
  console.log(propertyName)
  console.log(index)
}

class Employee {
  greet(@logParameter message: string): string {
    return `hello ${message}`
  }
}
const emp = new Employee()
emp.greet('hello')
```

## 参考笔记

- [TypeScript 中的泛型你真搞懂了吗？](../blog/93.md#TypeScript中的泛型你真搞懂了吗？)
