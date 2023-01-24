---
title: 数据结构
date: '2022-10-11'
tags: ['algorithm', 'JS']
draft: false
description: 链表、图、树、堆
---

<TOCInline toc={props.toc} asDisclosure toHeading={2} />

# 数据结构

- [javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)
- [30secondsofcode - JavaScript Data Structures](https://www.30secondsofcode.org/c/js-data-structures/p/1)
- [web 前端面试 - 面试官系列 - 对算法的理解](https://vue3js.cn/interview/algorithm/Algorithm.html)

## 链表

链表（Linked List）是一种物理存储单元上非连续、非顺序的存储结构，数据元素的逻辑顺序是通过链表中的指针链接次序实现的，由一系列结点（链表中每一个元素称为结点）组成

每个结点包括两个部分：一个是存储数据元素的数据域，另一个是存储下一个结点地址的指针域

### 遍历

遍历很好理解，就是根据 next 指针遍历下去，直到为 null，如下：

```js
let current = head
while (current) {
  console.log(current.val)
  current = current.next
}
```

### 插入

![插入](https://static.vue-js.com/f5fe5fd0-1c76-11ec-8e64-91fdec0f05a1.png)

- 存储插入位置的前一个节点
- 存储插入位置的后一个节点
- 将插入位置的前一个节点的 next 指向插入节点
- 将插入节点的 next 指向前面存储的 next 节点

```JS
let current = head
while (current < position){
  pervious = current;
  current = current.next;
}
pervious.next = node;
node.next = current;
```

### 删除

![删除](https://static.vue-js.com/0160cd90-1c77-11ec-a752-75723a64e8f5.png)

```js
while (current != node) {
  pervious = current
  current = current.next
  nextNode = current.next
}
pervious.next = nextNode
```

### 链表反转

```text
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

[看一遍就理解，图解单链表反转](https://juejin.cn/post/6844904058562543623)

```js
public ListNode reverseList(ListNode head) {
  ListNode prev = null;
  ListNode curr = head;
  while (curr != null) {
    ListNode nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}
```

<details>
 <summary>数组实现</summary>

```js
class LinkedList {
  constructor() {
    this.nodes = []
  }

  get size() {
    return this.nodes.length
  }

  get head() {
    return this.size ? this.nodes[0] : null
  }

  get tail() {
    return this.size ? this.nodes[this.size - 1] : null
  }

  insertAt(index, value) {
    const previousNode = this.nodes[index - 1] || null
    const nextNode = this.nodes[index] || null
    const node = { value, next: nextNode }

    if (previousNode) previousNode.next = node
    this.nodes.splice(index, 0, node)
  }

  insertFirst(value) {
    this.insertAt(0, value)
  }

  insertLast(value) {
    this.insertAt(this.size, value)
  }

  getAt(index) {
    return this.nodes[index]
  }

  removeAt(index) {
    const previousNode = this.nodes[index - 1]
    const nextNode = this.nodes[index + 1] || null

    if (previousNode) previousNode.next = nextNode

    return this.nodes.splice(index, 1)
  }

  clear() {
    this.nodes = []
  }

  reverse() {
    this.nodes = this.nodes.reduce(
      (acc, { value }) => [{ value, next: acc[0] || null }, ...acc],
      []
    )
  }

  *[Symbol.iterator]() {
    yield* this.nodes
  }
}

const list = new LinkedList()

list.insertFirst(1)
list.insertFirst(2)
list.insertFirst(3)
list.insertLast(4)
list.insertAt(3, 5)

list.size // 5
list.head.value // 3
list.head.next.value // 2
list.tail.value // 4
;[...list.map((e) => e.value)] // [3, 2, 1, 5, 4]

list.removeAt(1) // 2
list.getAt(1).value // 1
list.head.next.value // 1
;[...list.map((e) => e.value)] // [3, 1, 5, 4]

list.reverse()
;[...list.map((e) => e.value)] // [4, 5, 1, 3]

list.clear()
list.size // 0
```

</details>

## 图

图是一种抽象的数据类型，在图中的数据元素通常称为结点，V 是所有顶点的集合，E 是所有边的集合

### 常见表达图的方式

- 邻接矩阵
- 邻接表

#### 邻接矩阵

通过使用一个二维数组`G[N][N]`进行表示 N 个点到 N-1 编号，通过邻接矩阵可以立刻看出两顶点之间是否存在一条边，只需要检查邻接矩阵行 i 和列 j 是否是非零值，对于无向图，邻接矩阵是对称的
![邻接矩阵](https://static.vue-js.com/881d4300-2059-11ec-a752-75723a64e8f5.png)

#### 邻接表

![](https://static.vue-js.com/949fedd0-2059-11ec-a752-75723a64e8f5.png)

```js
const graph = {
  A: [2, 3, 5],
  B: [2],
  C: [0, 1, 3],
  D: [0, 2],
  E: [6],
  F: [0, 6],
  G: [4, 5],
}
```

### 操作

- 深度优先遍历(dfs)
- 广度优先遍历(bfs)

```js
const graph = {
  0: [1, 4],
  1: [2, 4],
  2: [2, 3],
  3: [],
  4: [3],
}

// dfs
const visited = new Set()
const dfs = (n, callback) => {
  callback(n)
  visited.add(n) // 访问过添加记录
  graph[n].forEach((c) => {
    if (!visited.has(c)) {
      // 判断是否访问呢过
      dfs(c)
    }
  })
}

// bfs
const visited = new Set()
const bfs = (n, callback) => {
  visited.add(n)
  const q = [n]
  while (q.length) {
    const n = q.shift()
    callback(n)
    graph[n].forEach((c) => {
      if (!visited.has(c)) {
        q.push(c)
        visited.add(c)
      }
    })
  }
}
```

## 树

树可以表示数据之间一对多的关系。以树与二叉树最为常用，直观看来，树是以分支关系定义的层次结构

二叉树满足以下两个条件：

- 本身是有序树
- 树中包含的各个结点的不能超过 2，即只能是 0、1 或者 2

![二叉树](https://static.vue-js.com/84ae31f0-1dfe-11ec-8e64-91fdec0f05a1.png)

### 二叉树的遍历

- 前序遍历
- 中序遍历
- 后序遍历
- 层序遍历

#### 前序遍历

1. 访问根节点
2. 访问当前节点的左子树
3. 若当前节点无左子树，则访问当前节点的右子

<details>
 <summary>代码</summary>

```js
// 递归
const preOrder = (root) => {
  if (!root) {
    return
  }
  console.log(root)
  preOrder(root.left)
  preOrder(root.right)
}

// 非递归
const preOrder = (root) => {
  if (!root) {
    return
  }
  const stack = [root]
  while (stack.length) {
    const n = stack.pop()
    console.log(n.val)
    if (n.right) {
      stack.push(n.right)
    }
    if (n.left) {
      stack.push(n.left)
    }
  }
}
```

</details>

#### 中序遍历

1. 访问当前节点的左子树
2. 访问根节点
3. 访问当前节点的右子

<details>
 <summary>代码</summary>

```js
// 递归
const inOrder = (root) => {
  if (!root) {
    return
  }
  inOrder(root.left)
  console.log(root.val)
  inOrder(root.right)
}

// 非递归
const inOrder = (root) => {
  if (!root) {
    return
  }
  const stack = [root]
  let p = root
  while (stack.length || p) {
    while (p) {
      stack.push(p)
      p = p.left
    }
    const n = stack.pop()
    console.log(n.val)
    p = n.right
  }
}
```

</details>

#### 后序遍历

1. 访问当前节点的左子树
2. 访问当前节点的右子
3. 访问根节点

<details>
 <summary>代码</summary>

```js
// 递归
const postOrder = (root) => {
  if (!root) {
    return
  }
  postOrder(root.left)
  postOrder(root.right)
  console.log(n.val)
}

// 非递归
const preOrder = (root) => {
  if (!root) {
    return
  }
  const stack = [root]
  const outPut = []
  while (stack.length) {
    const n = stack.pop()
    outPut.push(n.val)
    if (n.right) {
      stack.push(n.right)
    }
    if (n.left) {
      stack.push(n.left)
    }
  }
  while (outPut.length) {
    const n = outPut.pop()
    console.log(n.val)
  }
}
```

</details>

#### 层序遍历

按照二叉树中的层次从左到右依次遍历每层中的结点

借助队列先进先出的特性，从树的根结点开始，依次将其左孩子和右孩子入队。而后每次队列中一个结点出队，都将其左孩子和右孩子入队，直到树中所有结点都出队，出队结点的先后顺序就是层次遍历的最终结果

```js
const levelOrder = (root) => {
  if (!root) {
    return []
  }
  const queue = [[root, 0]]
  const res = []
  while (queue.length) {
    const n = queue.shift()
    const [node, leval] = n
    if (!res[leval]) {
      res[leval] = [node.val]
    } else {
      res[leval].push(node.val)
    }
    if (node.left) {
      queue.push([node.left, leval + 1])
    }
    if (node.right) {
      queue.push([node.right, leval + 1])
    }
  }
  return res
}
```

### 二叉树实现

<details>
 <summary>代码</summary>

```js
class BinaryTreeNode {
  constructor(key, value = key, parent = null) {
    this.key = key
    this.value = value
    this.parent = parent
    this.left = null
    this.right = null
  }

  get isLeaf() {
    return this.left === null && this.right === null
  }

  get hasChildren() {
    return !this.isLeaf
  }
}

class BinaryTree {
  constructor(key, value = key) {
    this.root = new BinaryTreeNode(key, value)
  }

  *inOrderTraversal(node = this.root) {
    if (node.left) yield* this.inOrderTraversal(node.left)
    yield node
    if (node.right) yield* this.inOrderTraversal(node.right)
  }

  *postOrderTraversal(node = this.root) {
    if (node.left) yield* this.postOrderTraversal(node.left)
    if (node.right) yield* this.postOrderTraversal(node.right)
    yield node
  }

  *preOrderTraversal(node = this.root) {
    yield node
    if (node.left) yield* this.preOrderTraversal(node.left)
    if (node.right) yield* this.preOrderTraversal(node.right)
  }

  insert(parentNodeKey, key, value = key, { left, right } = { left: true, right: true }) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        const canInsertLeft = left && node.left === null
        const canInsertRight = right && node.right === null
        if (!canInsertLeft && !canInsertRight) return false
        if (canInsertLeft) {
          node.left = new BinaryTreeNode(key, value, node)
          return true
        }
        if (canInsertRight) {
          node.right = new BinaryTreeNode(key, value, node)
          return true
        }
      }
    }
    return false
  }

  remove(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.left.key === key) {
        node.left = null
        return true
      }
      if (node.right.key === key) {
        node.right = null
        return true
      }
    }
    return false
  }

  find(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node
    }
    return undefined
  }
}

const tree = new BinaryTree(1, 'AB')

tree.insert(1, 11, 'AC')
tree.insert(1, 12, 'BC')
tree.insert(12, 121, 'BG', { right: true })

;[...tree.preOrderTraversal()].map((x) => x.value)
// ['AB', 'AC', 'BC', 'BCG']

;[...tree.inOrderTraversal()].map((x) => x.value)
// ['AC', 'AB', 'BC', 'BG']

tree.root.value // 'AB'
tree.root.hasChildren // true

tree.find(12).isLeaf // false
tree.find(121).isLeaf // true
tree.find(121).parent.value // 'BC'
tree.find(12).left // null
tree.find(12).right.value // 'BG'

tree.remove(12)

;[...tree.postOrderTraversal()].map((x) => x.value)
// ['AC', 'AB']
```

#### 搜索二叉树

- [JavaScript Data Structures - Binary Tree](https://www.30secondsofcode.org/articles/s/js-data-structures-binary-tree)

</details>

## 堆

堆通常是一个可以被看做一棵完全二叉树的数组对象，堆中某个结点的值总是不大于或不小于其父结点的值

- 最大堆：每个根结点，都有根结点的值大于两个孩子结点的值
- 最小堆：每个根结点，都有根结点的值小于孩子结点的值

![堆](https://static.vue-js.com/ea0fd1f0-1ed7-11ec-8e64-91fdec0f05a1.png)

用一维数组存储则如下：

```js
;[0, 1, 2, 3, 4, 5, 6, 7, 8]
```

数组零坐标代码的是堆顶元素

- 一个节点的父亲节点的坐标等于`(其坐标 - 1) >> 1`
- 一个节点的左节点等于`其本身节点坐标 * 2 + 1`
- 一个节点的右节点等于`其本身节点坐标 * 2 + 2`

```js
class MinHeap {
  constructor() {
    // 存储堆元素
    this.heap = []
  }
  // 获取父元素坐标
  getParentIndex(i) {
    return (i - 1) >> 1
  }

  // 获取左节点元素坐标
  getLeftIndex(i) {
    return i * 2 + 1
  }

  // 获取右节点元素坐标
  getRightIndex(i) {
    return i * 2 + 2
  }

  // 交换元素
  swap(i1, i2) {
    const temp = this.heap[i1]
    this.heap[i1] = this.heap[i2]
    this.heap[i2] = temp
  }

  // 查看堆顶元素
  peek() {
    return this.heap[0]
  }

  // 获取堆元素的大小
  size() {
    return this.heap.length
  }
}
```

操作：插入、删除

插入

将值插入堆的底部，即数组的尾部，当插入一个新的元素之后，堆的结构就会被破坏，因此需要堆中一个元素做上移操作

将这个值和它父节点进行交换，直到父节点小于等于这个插入的值，大小为 k 的堆中插入元素的时间复杂度为 O(logk)

![插入](https://static.vue-js.com/06893fb0-1ed8-11ec-8e64-91fdec0f05a1.png)

```js
// 插入元素
insert(value) {
  this.heap.push(value)
  this.shifUp(this.heap.length - 1)
}

// 上移操作
shiftUp(index) {
  if (index === 0) { return }
  const parentIndex = this.getParentIndex(index)
  if(this.heap[parentIndex] > this.heap[index]){
    this.swap(parentIndex, index)
    this.shiftUp(parentIndex)
  }
}
```

删除

常见操作是用数组尾部元素替换堆顶，这里不直接删除堆顶，因为所有的元素会向前移动一位，会破坏了堆的结构

然后进行下移操作，将新的堆顶和它的子节点进行交换，直到子节点大于等于这个新的堆顶，删除堆顶的时间复杂度为 O(logk)

```js
// 删除元素
pop() {
  this.heap[0] = this.heap.pop()
  this.shiftDown(0)
}

// 下移操作
shiftDown(index) {
  const leftIndex = this.getLeftIndex(index)
  const rightIndex = this.getRightIndex(index)
  if (this.heap[leftIndex] < this.heap[index]){
    this.swap(leftIndex, index)
    this.shiftDown(leftIndex)
  }
  if (this.heap[rightIndex] < this.heap[index]){
    this.swap(rightIndex, index)
    this.shiftDown(rightIndex)
  }
}
```
