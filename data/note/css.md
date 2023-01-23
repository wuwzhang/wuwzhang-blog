---
title: css 基础
date: '2023-01-13'
tags: ['css']
draft: true
description: css 面试题
---

# CSS 面试题

## display: none; 与 visibility: hidden; 的区别

- display:none;会让元素完全从渲染树中消失，渲染的时候不占据任何空间；visibility: hidden;不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见
- display: none;是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；visibility:hidden;是继承属性，子孙节点消失由于继承了 hidden，通过设置 visibility: visible;可以让子孙节点显式
- 修改常规流中元素的 display 通常会造成文档重排。修改 visibility 属性只会造成本元素的重绘
- 读屏器不会读取 display: none;元素内容；会读取 visibility: hidden 元素内容

## link 与 @import 的区别

- link 是 HTML 方式， @import 是 CSS 方式
- link 最大限度支持并行下载， @import 过多嵌套导致串行下载，出现 FOUC
- link 可以通过 rel="alternate stylesheet" 指定候选样式
  浏览器对 link 支持早于 @import ，可以使用 @import 对老浏览器隐藏样式
- @import 必须在样式规则之前，可以在 css 文件中引用其他文件
- 总体来说：link 优于@import

## CSS 如何计算选择器优先？

- 相同权重，定义最近者为准：行内样式 > 内部样式 > 外部样式
- 含外部载入样式时，后载入样式覆盖其前面的载入的样式和内部样式
- 选择器优先级: 行内样式[1000] > id[100] > class[10] > Tag[1]
- 在同一组属性设置中，!important 优先级最高，高于行内样式

## BFC

BFC（Block Formatting Context），即块级格式化上下文，它是页面中的一块渲染区域，并且有一套属于自己的渲染规则：

## CSS3 新增伪类有哪些？

- :root 选择文档的根元素，等同于 html 元素
- :empty 选择没有子元素的元素
- :target 选取当前活动的目标元素
- :not(selector) 选择除 selector 元素意外的元素
- :enabled 选择可用的表单元素
- :disabled 选择禁用的表单元素
- :checked 选择被选中的表单元素
- :after 在元素内部最前添加内容
- :before 在元素内部最后添加内容
- :nth-child(n) 匹配父元素下指定子元素，在所有子元素中排序第 n
- :nth-last-child(n) 匹配父元素下指定子元素，在所有子元素中排序第 n，从后向前数
- :nth-child(odd)
- :nth-child(even)
- :nth-child(3n+1)
- :first-child
- :last-child
- :only-child
- :nth-of-type(n) 匹配父元素下指定子元素，在同类子元素中排序第 n
- :nth-last-of-type(n) 匹配父元素下指定子元素，在同类子元素中排序第 n，从后向前数
- :nth-of-type(odd)
- :nth-of-type(even)
- :nth-of-type(3n+1)
- :first-of-type
- :last-of-type
- :only-of-type
- ::selection 选择被用户选取的元素部分
- :first-line 选择元素中的第一行
- :first-letter 选择元素中的第一个字符

## 隐藏元素的方法

- visibility: hidden; 这个属性只是简单的隐藏某个元素，但是元素占用的空间任然存在
- opacity: 0; CSS3 属性，设置 0 可以使一个元素完全透明
- position: absolute; 设置一个很大的 left 负值定位，使元素定位在可见区域之外
- display: none; 元素会变得不可见，并且不会再占用文档的空间。
- transform: scale(0); 将一个元素设置为缩放无限小，元素将不可见，元素原来所在的位置将被保留
- `<div hidden="hidden">` HTML5 属性,效果和 display:none;相同，但这个属性用于记录一个元素的状态
- height: 0; 将元素高度设为 0 ，并消除边框
- filter: blur(0); CSS3 属性，将一个元素的模糊度设置为 0，从而使这个元素“消失”在页面中

## overflow: scroll 时不能平滑滚动的问题怎么处理？

css

```css
html,
body {
  scroll-behavior: smooth;
}
```

js

```js
target.scrollIntoView({
  behavior: 'smooth',
})
```

jq

```js
scrollContainer.animate({
  scrollTop: 0,
})
```

## 一个高度自适应的 div，里面有两个 div，一个高度 100px，希望另一个填满剩下的高度

```css
/* 1 */
.sub {
  height: calc(100%-100px);
}

/* 2 */
.container {
  position: relative;
}
.sub {
  position: absolute;
  top: 100px;
  bottom: 0;
}

/* 3 */
.container {
  display: flex;
  flex-direction: column;
}
.sub {
  flex: 1;
}
```

## display:inline-block 什么时候会显示间隙？

- 相邻的 inline-block 元素之间有换行或空格分隔的情况下会产生间距
- 非 inline-block 水平元素设置为 inline-block 也会有水平间距
- 可以借助 vertical-align:top; 消除垂直间隙
- 可以在父级加 font-size：0; 在子元素里设置需要的字体大小，消除垂直间隙
- 把 li 标签写到同一行可以消除垂直间隙，但代码可读性差
