---
title: sort
date: '2023-01-08'
tags: ['function', 'sort']
draft: true
description: bubbleSort、selectSort、insertSort、mergeSort、heapSort
---

## 冒泡排序

![冒泡](https://www.runoob.com/wp-content/uploads/2019/03/bubbleSort.gif)

`O(n^2)`

```js
const bubbleSort = (arr) => {
  for (let i = 0, len = arr.length; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 相邻元素两两对比
        let tmp = arr[j + 1] // 元素交换
        arr[j + 1] = arr[j]
        arr[j] = tmp
      }
    }
  }
}
```

## 插入排序

![插入](https://www.runoob.com/wp-content/uploads/2019/03/insertionSort.gif)

`O(n^2)`

```js
const insertSort = (arr) => {
  for (let i = 1, len = arr.length; i < len; i++) {
    let pre = i - 1,
      current = arr[i]
    while (pre >= 0 && arr[pre] > current) {
      arr[pre + 1] = arr[pre]
      pre--
    }

    arr[pre + 1] = current
  }

  return arr
}
```

## 选择排序

![选择](https://www.runoob.com/wp-content/uploads/2019/03/selectionSort.gif)

`O(N^2)`

```js
const selectSort(arr) => {
  for (let i = 0, len = arr.length; i < len - **1**; i++) {
    let minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    let tmp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = tmp
  }
}
```

## 并归排序

![并归排序](https://static.vue-js.com/05f14b60-26ad-11ec-a752-75723a64e8f5.png)

`O(nlogn)`

```js
const merge = (left, right) => {
  const result = []

  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }

  return result.concat(left.length ? left : right)
}

const mergeSort = (arr) => {
  // 采用自上而下的递归方法
  const len = arr.length

  if (arr.length < 2) return arr

  const ind = len >> 1 // Math.floor(len / 2)

  return merge(mergeSort(arr.slice(0, ind)), mergeSort(arr.slice(ind)))
}
```

## 快排

![快排](https://www.runoob.com/wp-content/uploads/2019/03/quickSort.gif)

`O(nlogn)`

```js
const quickSort = (arr) => {
  const sort = (arr) => {
    if (arr.length < 2) return arr
    const mid = arr[0]

    const [left, right] = arr
      .slice(1)
      .reduce(
        (pre, cur) => (cur <= mid ? [pre[0].concat(cur), pre[1]] : [pre[0], pre[1].concat(cur)]),
        [[], []]
      )

    return [...sort(left), mid, ...sort(right)]
  }

  return sort(arr)
}
```

## 堆排序

![堆排序](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/17/162d2a9ff258dfe1~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

```js
heapsort([6, 3, 4, 1]) // [1, 3, 4, 6]

function heapsort(array) {
  checkArray(array)
  // 将最大值交换到首位
  for (let i = 0; i < array.length; i++) {
    heapInsert(array, i)
  }
  let size = array.length
  // 交换首位和末尾
  swap(array, 0, --size)
  while (size > 0) {
    heapify(array, 0, size)
    swap(array, 0, --size)
  }
  return array
}

function heapInsert(array, index) {
  // 如果当前节点比父节点大，就交换
  while (array[index] > array[parseInt((index - 1) / 2)]) {
    swap(array, index, parseInt((index - 1) / 2))
    // 将索引变成父节点
    index = parseInt((index - 1) / 2)
  }
}

function heapify(array, index, size) {
  let left = index * 2 + 1
  while (left < size) {
    // 判断左右节点大小
    let largest = left + 1 < size && array[left] < array[left + 1] ? left + 1 : left
    // 判断子节点和父节点大小
    largest = array[index] < array[largest] ? largest : index
    if (largest === index) break
    swap(array, index, largest)
    index = largest
    left = index * 2 + 1
  }
}
```
