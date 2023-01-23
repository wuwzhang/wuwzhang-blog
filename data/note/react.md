# react

> 《React 设计原理》读书笔记

## React 理念

### 架构

- React 15
  - Reconciler(协调器)：VDOM 实现，负责根据自变量变化计算 UI 变化; 无法中断
  - Render(渲染器)：负责将 UI 变化渲染到宿主环境中
- React 16
  - Scheduler(调度器)：调度任务优先级，高优先级任务先进入 Reconciler
  - Reconciler(协调器)：VDOM 实现，负责根据自变量变化计算 UI 变化
  - Renderer(渲染器)：负责将 UI 变化渲染到宿主环境中

新架构中 Reconciler 从递归变成可中断循环过程，每个循环都会调用 shouldYield 判断当前 Time Slice 是否有剩余时间， 没有剩余时间，则暂停更新流程，将主线程交给渲染流水线，等待下一个宏任务再继续执行

当 Scheduler 将调度任务交给 Reconciler 后， Reconciler 最终会给 VDOM 元素标记各种副作用 flags

Scheduler 和 Reconciler 都是在内存中进行，不会更新宿主环境 UI，即使反复终端也不会看到不完整的 UI，只有 Reconciler 完，工作流才会进入到 Renderer

### 模式

特性

- Sync(同步)
- Async Mode(异步模式)：异步可中断，解决 cpu 瓶颈
- Concurrent Mode(并发模式)：多个工作流并发执行，解决 I/O 瓶颈
- Concurrent Feature(并发特性)

模式

- Legacy 模式：通过`ReactDOM.render(<App />, rootNode)`创建应用, 默认关闭 StrictMode，未开启并发更新(v16、v17 默认)
- Blocking 模式，通过`ReactDOM.createBlockingRoot(rootNode).render(<App />)`创建应用，从 Legacy 模式向 Concurrent 模式过度的中间模式，默认开启 StrictMode
- Concurrent 模式，通过`ReactDOM.createRoot(rootNode).render(<App />)`

### Fiber 架构

React 节点类型

- React Element(React 元素)，即 createElement 方法的返回值
- React Component(React 组件)
- FiberNode，组成 Fiber 架构的节点类型

FiberNode 含义

- 作为架构：v15 的 Reconciler 采用递归方式，称作 Stack Reconciler；v16+ 版本的 Reconciler 基于 FiberNode 实现，称为 Fiber Reconciler
- 作为静态的数据结构，每个 FiberNode 对应一个 React 元素，用于保存 React 元素的类型、对应的 DOM 元素信息
- 作为动态的工作单元，每个 FiberNode 用于保存本次更新改 React 元素变化的数据、要执行的工作（增、删、改、更新 Ref、副作用等）

### 双缓存机制

Fiber 架构中同时存在两课 Fiber Tree，一棵是真实 UI 对应的 Fiber Tree（当前缓冲区），另一棵是正在内存中构建的 Fiber Tree(后缓冲区)

current 指前缓冲区的 FiberNode，workInProgress 指后缓冲区的 FiberNode，alternate 属性指向另一个缓冲区对应的 FiberNode

#### mount

1. 整个应用首次渲染，首次进入页面
2. 某个组件的首次渲染 `{ isShow ? <Btn /> : null}`

创建 Fiber Tree

- 创建 fiberRootNode（2 没该步骤）
- 创建 tag 为 3 FiberNode，代表 HostRoot
- 从 HostRootFiber 开始，DFS 生成 Fiber Node
- 遍历过程中，为 FiberNode 标记代表副作用的 flags，以便后续在 Renderer 中使用

```jsx
import React, { useState } from 'react'

export default function App() {
  const [num, add] = useState(0)
  return <p onClick={() => add(num + 1)}>{num}</p>
}

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(<App />)
```

rootElement 为 HostRootFiber，代表应用在宿主环境挂载的根节点，负责管理应用的全部事宜，如

- Current Fiber Tree 与 Wip Fiber Tree 之间的切换
- 应用中任务的过期时间
- 应用任务的调度信息

FiberRootNode.current 指向 Current Fiber Tree 的根节点，当前仅有一个 HostRootFiber，对应首屏渲染时只有根节点的空白页面

mount 流程会基于 React 元素以 DFS 的顺序生成 Wip Fiber Tree，复用 Current Fiber Tree 中的同级节点，Wip Fiber Tree 生成完毕，FiberRootNode 会被传递给 Renderer；当 Renderer 完成工作后（UI 渲染完成），FiberRootNode.current 指向 Wip Fiber Tree 完成双缓存的切换

#### update

触发更新，会开启 update 流程，生成一棵新的 Wip Fiber Tree，完成 Renderer 后（UI 渲染完成），FiberRootNode.current 指向 Wip Fiber Tree 完成双缓存的切换

一个页面可以创建多个应用

## React 架构

### Render

根绝 Scheduler 结果不同，render 阶段肯能开始于 performSyncWorkOnRoot (同步更新流程：workLoopSync)，或 performConcurrentWorkOnRoot （并发更新流程：workLoopConcurrent）方法

perfomUnitOfWork 会创建下一个 fiberNode 并赋值给 wip，并将 wip 自己创建的 fiberNode 连起来生成 Fiber Tree

perfomUnitOfWork 工作：递、归

- 递
  - 从 HostRootFiber 开始 DFS 遍历，并将每个遍历到的 FiberNode 执行 beginWork(将传入的 FiberNode 创建生成下一个 FiberNode)
  - 当 perfomUnitOfWork 遍历到叶子节点（没有子 FiberNode）执行 归
- 归
  - 调用 completeWork 函数处理 FiberNode
  - 当某个 FiberWork 执行玩 completeWork 后
    - 如果存在 `fiberNode.sibling !== null`(存在兄弟节点)，进入兄弟节点的 递 阶段
    - 不存在，进入父节点的 归 阶段
