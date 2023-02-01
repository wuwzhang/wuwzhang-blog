# React 问答

## 1. super() 和 super(props) 有什么区别

```js
class sup {
  constructor(name) {
    this.name = name
  }

  printName() {
    console.log(this.name)
  }
}

class sub extends sup {
  constructor(name, age) {
    super(name) // super代表的事父类的构造函数
    this.age = age
  }

  printAge() {
    console.log(this.age)
  }
}

let jack = new sub('jack', 20)
jack.printName() //输出 : jack
jack.printAge() //输出 : 20
```

`super(name)` 相当于调用 `sup.prototype.constructor.call(this,name)`

super() 就是将父类中的 this 对象继承给子类的，没有 super() 子类就得不到 this 对象

如果先调用 this，再初始化 super()，同样是禁止的行为

在子类 constructor 中，必须先代用 super 才能引用 this

在调用 super() 的时候，我们一般都需要传入 props 作为参数，如果不传进去，React 内部也会将其定义在组件实例中

不建议使用 super() 代替 super(props)

因为在 React 会在类组件构造函数生成实例后再给 this.props 赋值，所以在不传递 props 在 super 的情况下，调用 this.props 为 undefined，如下情况

```jsx
class Button extends React.Component {
  constructor(props) {
    super() // 没传入 props
    console.log(props) //  {}
    console.log(this.props) //  undefined
    // ...
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props) // 传入 props
    console.log(props) //  {}
    console.log(this.props) //  {}
    // ...
  }
}
```

## 2. setState 执行机制

React 并不像 vue2 中调用 Object.defineProperty 数据响应式或者 Vue3 调用 Proxy 监听数据的变化

必须通过 setState 方法来告知 react 组件 state 已经发生了改变

- Legacy 模式：通过`ReactDOM.render(<App />, rootNode)`创建应用, 默认关闭 StrictMode，未开启并发更新(v16、v17 默认)
- Blocking 模式，通过`ReactDOM.createBlockingRoot(rootNode).render(<App />)`创建应用，从 Legacy 模式向 Concurrent 模式过度的中间模式，默认开启 StrictMode
- Concurrent 模式，通过`ReactDOM.createRoot(rootNode).render(<App />)`

### Legacy 模式下

使用 setState 更新数据的时候，setState 的更新类型分成：

- 异步更新
- 同步更新

### 异步更新

```js
changeText() {
  this.setState({
    message: "你好啊"
  })
  console.log(this.state.message); // Hello World
}

// 如果想要立刻获取更新后的值，在第二个参数的回调中更新后会执行
changeText() {
  this.setState({
    message: "你好啊"
  }, () => {
    console.log(this.state.message); // 你好啊
  });
}
```

批量更新

![Alt text](/static/images/note/react-note.png)

```js
export function batchedUpdates(fn, a) {
  // fn -> updateNum
  const preExecutionContext = executionContext
  executionContext |= BatchedContext

  try {
    return fn(a)
  } finally {
    executionContext = preExecutionContext
    resetRenderTime()
    flushSyncCallbackQueue()
  }
}
```

被 setTimeout 包裹，全局上下文不存在 executionContext，执行同步更新逻辑

### Concurrent 模式

被 setTimeout 包裹，依旧是异步

## 3. react 生命周期函数

ui = fn(state)

- reconciler（fn）: 计算状态的变化 - render 阶段
  - reconcile 算法（diff）
- renderer: 将状态渲染到视图中 - commit 阶段
- schedule

### reconciler render 阶段: 可以被打断（concurrent 模式下）

- constructor
- render
- getDerivedStateFromError
- componentWillMount
- shouldComponentUpdate
- componentWillUpdate
- getDerivedStateFromProps
- componentWillReceiveProps

### renderer commit 阶段(不可被打断)

- componentWillUnmount
- getSnapshotBeforeUpdate
- componentDidCatch
- componentDidMount
- componentDidUpdate

### 创建更新流程

1. 调用 ReactDOM.render
2. 进入 Render 阶段
3. 采用 DFS 创建 fiber 树
   1. APP 节点 (constructor -> gDSFP/cWM -> render)
   2. p1 节点（constructor -> gDSFP/cWM -> render）
   3. c1 节点（constructor -> gDSFP/cWM -> render）
   4. c2 节点（constructor -> gDSFP/cWM -> render）
   5. p2 节点（constructor -> gDSFP/cWM -> render）
4. 将 fiber 树的 dom 渲染到视图中
5. 进入 commit 阶段
   1. c2 节点（cDM）
   2. c1 节点（cDM）
   3. p1 节点（cDM）
   4. p2 节点（cDM）
   5. APP 节点（cDM）
6. 调用 this.setState 将 c2 从蓝色变成绿色
7. 进入 render 阶段
8. 采用 DFS 创建完整的 fiber 树
   1. APP (没改变，不调用生命周期)
   2. P1
   3. c1
   4. c2 (reconcile 算法，标记变化 gDSFP/cWM -> render)
   5. p2
9. 进入 commit 阶段
10. 执行 8.4 的变化对应的视图操作（getSnapshotBeforeUpdate -> cDM）
11. fiber 树指针切换

## useEffect(fn, []) 和 cDM 的区别

render 阶段 -- effect 的数据结构（flags） --> commit 阶段

与所有视图相关的操作都有对应的 effect

- 插入 DOM (Placement flag)
- 更新 DOM（Update flag)
- 删除 DOM（Deletion flag)
- 更新 Ref（Ref flag)
- useEffect 回调（Passive flag)

不同 useEffect 执行时机

- useEffect(fn) -> mount update 时创建 passive flag
- useEffect(fn, []) -> mount 时创建 passive flag
- useEffect(fn, [dep]) -> mount dep 变化时 创建 passive flag

classComponent

- mount 创建 Placement flag
- update 创建 Update flag

render 阶段 -- 传递了一条从子节点到根节点不同 fiber 节点的 effet(flag)链表 --> commit 阶段

commit 阶段

- beforeMutation 阶段 渲染前
- mutation 阶段 渲染中 -> appendChild 操作视图
- layout 阶段 渲染后 -> 调用 cDM

useEffect 的 passive effect 会在 commit 三个阶段执行完成后，异步调用回调函数
componentDidMount 会在 commit 的 mutation 阶段后在 layout 阶段同步调用
useLayoutEffect 的执行时机在 layout 阶段同步执行

## 3. React diff

reconcile 流程（diff）的本质就是对比 current fiberNode 与 JSX 对象，生成 wip(wokInProgress) fiberMode

理论上的复杂度是 O(n^3)，react 为此添加了三个限制

### tree 层级

只对同级别的节点进行 diff,只有删除、创建操作，没有移动操作
![tree层级](https://static.vue-js.com/ae71d1c0-ec91-11eb-85f6-6fac77c0c9b3.png)
![删除、创建操作，没有移动](https://static.vue-js.com/b85f2bb0-ec91-11eb-ab90-d9ae814b240d.png)

分为两类

- 更新后统计只有一个元素 （object、number、string）
- 更新后统计只有多个元素 （Array、iterator）

#### 对于多节点会经历两次遍历

参与比较的双方 oldFiber 代表 current fiberNode（链表），newChildren 代表 jsx（数组）

1. 第一轮尝试逐个复用节点
   1. 遍历 newChildren[newIndex]与 oldFiber 比较，判断是否可以复用
   2. 可以复用,i++,继续 1.i，如果不可用，分两种情况
      1. key 不同导致不可复用，看产出跳出循环，第一轮遍历结束
      2. key 相同 type 不同导致的不可复用，标记 deletion effect,继续 1.iv cccccccccccc c
2. 第二轮处理剩下的节点

### conponent 层级

两个类型不同的元素生成不同的树。如果元素从 div 变成 p，react 会销毁 div 及其子孙节点，并创建 p 元素及其子孙结点
![conponent层级](https://static.vue-js.com/c1fcdf00-ec91-11eb-ab90-d9ae814b240d.png)

### element 层级

开发者可以通过 key 来暗示哪些元素在不同的渲染下能保持稳定

提供了 3 种节点操作

- INSERT_MARKUP(插入)
- MOVE_EXISTING (移动)
- REMOVE_NODE (删除)

通过 key 可以准确地发现新旧集合中的节点都是相同的节点，因此无需进行节点删除和创建，只需要将旧集合中节点的位置进行移动，更新为新集合中节点的位置

![移动demo](https://static.vue-js.com/cae1c9a0-ec91-11eb-ab90-d9ae814b240d.png)

![对比](https://static.vue-js.com/d34c5420-ec91-11eb-85f6-6fac77c0c9b3.png)

- index： 新集合的遍历下标。
- oldIndex：当前节点在老集合中的下标
- maxIndex：在新集合访问过的节点中，其在老集合的最大下标（可复用的最大节点）

规则

- 当 oldIndex`>`maxIndex 时，将 oldIndex 的值赋值给 maxIndex
- 当 oldIndex`=`maxIndex 时，不操作
- 当 oldIndex`<`maxIndex 时，将当前节点移动到 index 的位置

## 4. 事件机制

React 基于浏览器的事件机制自身实现了一套事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等，称之为合成事件（SyntheticEvent）

实际并不会把事件代理函数直接绑定到真实的节点上，而是把所有的事件绑定到结构的最外层，使用一个统一的事件去监听

这个事件监听器上维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象

当事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用。这样做简化了事件处理和回收机制，效率也有很大提升

### 执行顺序

```js
import React from 'react'
class App extends React.Component {
  constructor(props) {
    super(props)
    this.parentRef = React.createRef()
    this.childRef = React.createRef()
  }
  componentDidMount() {
    console.log('React componentDidMount！')
    this.parentRef.current?.addEventListener('click', () => {
      console.log('原生事件：父元素 DOM 事件监听！')
    })
    this.childRef.current?.addEventListener('click', () => {
      console.log('原生事件：子元素 DOM 事件监听！')
    })
    document.addEventListener('click', (e) => {
      console.log('原生事件：document DOM 事件监听！')
    })
  }
  parentClickFun = () => {
    console.log('React 事件：父元素事件监听！')
  }
  childClickFun = () => {
    console.log('React 事件：子元素事件监听！')
  }
  render() {
    return (
      <div ref={this.parentRef} onClick={this.parentClickFun}>
        <div ref={this.childRef} onClick={this.childClickFun}>
          分析事件执行顺序
        </div>
      </div>
    )
  }
}
export default App

// 原生事件：子元素 DOM 事件监听！
// 原生事件：父元素 DOM 事件监听！
// React 事件：子元素事件监听！
// React 事件：父元素事件监听！
// 原生事件：document DOM 事件监听！
```

- React 所有事件都挂载在 document 对象上
- 当真实 DOM 元素触发事件，会冒泡到 document 对象后，再处理 React 事件
- 所以会先执行原生事件，然后处理 React 事件
- 最后真正执行 document 上挂载的事件

![事件机制](https://static.vue-js.com/08e22ff0-d870-11eb-ab90-d9ae814b240d.png)

- 阻止合成事件间的冒泡，用 e.stopPropagation()
- 阻止合成事件与最外层 document 上的事件间的冒泡，用 e.nativeEvent.stopImmediatePropagation()
- 阻止合成事件与除最外层 document 上的原生事件上的冒泡，通过判断 e.target 来避免

React 事件机制总结如下：

- React 上注册的事件最终会绑定在 document 这个 DOM 上，而不是 React 组件对应的 DOM(减少内存开销就是因为所有的事件都绑定在 document 上，其他节点没有绑定事件)
- React 自身实现了一套事件冒泡机制，所以这也就是为什么我们 event.stopPropagation()无效的原因。
- React 通过队列的形式，从触发的组件向父组件回溯，然后调用他们 JSX 中定义的 callback
- React 有一套自己的合成事件 SyntheticEvent

## 5. 捕获错误

为了解决出现的错误导致整个应用崩溃的问题，react16 引用了错误边界新的概念

错误边界是一种 React 组件，这种组件可以捕获发生在其子组件树任何位置的 JavaScript 错误，并打印这些错误，同时展示降级 UI，而并不会渲染那些发生崩溃的子组件树

错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误

形成错误边界组件的两个条件：

- 使用了 static getDerivedStateFromError()
- 使用了 componentDidCatch()

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

;<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

无法捕获到异常

- 事件处理
- 异步代码
- 服务端渲染
- 自身抛出来的错误

对于错误边界无法捕获的异常，如事件处理过程中发生问题并不会捕获到，是因为其不会在渲染期间触发，并不会导致渲染时候问题

使用 js 的`try...catch...`语法，或者 `window.addEventListener('error', function(event) { ... })`

## 6. JSX 转换成真实 DOM

JSX 通过 babel 最终转化成 React.createElement 这种形式

```jsx
;<div>
  <img src="avatar.png" className="profile" />
  <Hello />
</div>

React.createElement(
  'div',
  null,
  React.createElement('img', {
    src: 'avatar.png',
    className: 'profile',
  }),
  React.createElement(Hello, null)
)
```

在转化过程中，babel 在编译时会判断 JSX 中组件的首字母：

- 当首字母为小写时，其被认定为原生 DOM 标签，createElement 的第一个变量被编译为字符串
- 当首字母为大写时，其被认定为自定义组件，createElement 的第一个变量被编译为对象

createElement 会根据传入的节点信息进行一个判断：

- 如果是原生标签节点， type 是字符串，如 div、span
- 如果是文本节点， type 就没有，这里是 TEXT
- 如果是函数组件，type 是函数名
- 如果是类组件，type 是类名
