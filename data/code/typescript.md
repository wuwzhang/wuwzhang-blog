---
title: typescript 函数
date: '2023-01-06'
tags: ['function', 'typescript']
draft: false
description: pick、omit、Exclude、ReturnType、IF、Awaited、Length、Deep Readonly、RequiredByKeys、PartialByKeys、PartialByKeys、Last、Intersection、Diff
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

## pick

实现 TS 内置的 `Pick<T, K>`，但不可以使用它。
从类型 T 中选择出属性 K，构造成一个新的类型。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
  title: 'Clean room',
  completed: false,
}
```

```ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }
```

## Omit

不使用 Omit 实现 TypeScript 的 `Omit<T, K>` 泛型。

Omit 会创建一个省略 K 中字段的 T 对象。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

```ts
type MyOmit<T, U> = {
  [K in keyof T as Exclude<K, U>]: T[K]
}
```

## Exclude

实现内置的`Exclude<T, U>`类型，但不能直接使用它本身。
从联合类型 T 中排除 U 的类型成员，来构造一个新的类型。

```ts
type Exclude<T, U> = T extends U ? never : T
```

## ReturnType

不使用 ReturnType 实现 TypeScript 的 `ReturnType<T>` 泛型。

```ts
type MyReturnType<T> = T extends (...args: any) => infer R ? R : never

const fn = (v: boolean) => {
  if (v) return 1
  else return 2
}

type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
```

## IF

实现一个 IF 类型，它接收一个条件类型 C ，一个判断为真时的返回类型 T ，以及一个判断为假时的返回类型 F。 C 只能是 true 或者 false， T 和 F 可以是任意类型。

```ts
type If<C extends boolean, T, F> = C extends true ? T : F

type A = If<true, 'a', 'b'> // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```

## Awaited

假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 Promise 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。

比如：Promise`<ExampleType>`，请你返回 ExampleType 类型。

```ts
type MyAwaited<T extends Promise<any>> = T extends Promise<infer U> ? U : never

// 或
type MyAwaited<T extends Promise<any>> = T extends Promise<infer U> ? MyAwaited<U> : T
```

## Sometimes we want to limit the range of numbers... For examples.

```ts
type Helper<T extends number, R extends unknown[] = []> = R['length'] extends T
  ? R
  : Helper<T, [never, ...R]>

type NumberRange<
  T extends number,
  U extends number,
  R extends unknown[] = Helper<T>
> = R['length'] extends U ? [...R, R['length']][number] : NumberRange<T, U, [...R, R['length']]>

type result = NumberRange<2, 9> //  | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
```

## Deep Readonly

```ts
type X = {
  x: {
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = {
  readonly x: {
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey'
}

type Todo = DeepReadonly<X> // should be same as `Expected`

type DeepReadonly<T> = T extends Function ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> }
```

## Length

```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type spaceXLength = Length<spaceX> // expected 5

type Length<T extends readonly any[]> = T['length']
```

## RequiredByKeys

```ts
type RequiredByKeys<T, K extends keyof any = keyof T> = Omit<
  Required<Pick<T, K & keyof T>> & Omit<T, K>,
  never
>

interface User {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User, 'name'> // { name: string; age?: number; address?: string }
```

## PartialByKeys

```ts
type Merge<X> = {
  [k in keyof X]: X[k] extends object ? Merge<X[k]> : X[k]
}

type EmptyGeneric = 'empty'

type MyPick<X, Y> = Y extends keyof X ? Y : never

type PartialByKeys<T, K = EmptyGeneric> = [K] extends [EmptyGeneric]
  ? Partial<T>
  : Merge<Partial<Pick<T, MyPick<T, K>>> & Omit<T, MyPick<T, K>>>

interface User {
  name: string
  age: number
  address: string
}

type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string }
```

### PickByType

```ts
type OnlyBoolean = PickByType<
  {
    name: string
    count: number
    isReadonly: boolean
    isEnable: boolean
  },
  boolean
> // { isReadonly: boolean; isEnable: boolean; }

type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}
```

## Last

实现一个通用`Last<T>`，它接受一个数组 T 并返回其最后一个元素的类型。

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1

type Last<T extends unknown[]> = T extends [...infer P, infer K] ? K : never
```

## Intersection 交集

```ts
// type Extract<T, U> = T extends U ? T : never
type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>

type C1 = { name: string; age: number; visible: boolean }
type C2 = { name: string; age: number; sex: number }

type C3 = Intersection<C1, C2>
```

## Diff

```ts
// type Exclude<T, U> = T extends U ? never : T
type Diff<T extends object, U extends object> = Pick<T, Exclude<keyof T, keyof U>>

type C1 = { name: string; age: number; visible: boolean }
type C2 = { name: string; age: number; sex: number }

type C11 = Diff<C1, C2>
```

## Compute

```ts
type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] }
// type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Merge<O1 extends object, O2 extends object> = Compute<O1 & Omit<O2, keyof O1>>
type C1C2 = Merge<C1, C2>
```
