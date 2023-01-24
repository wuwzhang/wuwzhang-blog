---
title: sort
date: '2023-01-08'
tags: ['function', 'sort']
draft: true
description: heap
---

## 冒泡排序

![冒泡](https://www.runoob.com/wp-content/uploads/2019/03/bubbleSort.gif)

```js
const bubble = (arr) => {
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

## 堆排序

```js
heapsort([6, 3, 4, 1]) // [1, 3, 4, 6]

const heapsort = (arr) => {
  const a = [...arr]
  let l = a.length

  const heapify = (a, i) => {
    const left = 2 * i + 1
    const right = 2 * i + 2
    let max = i
    if (left < l && a[left] > a[max]) max = left
    if (right < l && a[right] > a[max]) max = right
    if (max !== i) {
      ;[a[max], a[i]] = [a[i], a[max]]
      heapify(a, max)
    }
  }

  for (let i = Math.floor(l / 2); i >= 0; i -= 1) heapify(a, i)
  for (i = a.length - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]
    l--
    heapify(a, 0)
  }
  return a
}
```
