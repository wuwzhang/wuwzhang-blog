---
title: css 基础
date: '2023-01-13'
tags: ['css']
draft: true
description: css 面试题
---

# CSS 面试题

## 1. display: none; 与 visibility: hidden; 的区别

- display:none;会让元素完全从渲染树中消失，渲染的时候不占据任何空间；visibility: hidden;不会让元素从渲染树消失，渲染师元素继续占据空间，只是内容不可见
- display: none;是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示；visibility:hidden;是继承属性，子孙节点消失由于继承了 hidden，通过设置 visibility: visible;可以让子孙节点显式
- 修改常规流中元素的 display 通常会造成文档重排。修改 visibility 属性只会造成本元素的重绘
- 读屏器不会读取 display: none;元素内容；会读取 visibility: hidden 元素内容

## 2. link 与 @import 的区别

- link 是 HTML 方式， @import 是 CSS 方式
- link 最大限度支持并行下载， @import 过多嵌套导致串行下载，出现 FOUC
- link 可以通过 rel="alternate stylesheet" 指定候选样式
  浏览器对 link 支持早于 @import ，可以使用 @import 对老浏览器隐藏样式
- @import 必须在样式规则之前，可以在 css 文件中引用其他文件
- 总体来说：link 优于@import

## 3. CSS 如何计算选择器优先？

- 相同权重，定义最近者为准：行内样式 > 内部样式 > 外部样式
- 含外部载入样式时，后载入样式覆盖其前面的载入的样式和内部样式
- 选择器优先级: 行内样式[1000] > id[100] > class[10] > Tag[1]
- 在同一组属性设置中，!important 优先级最高，高于行内样式

## 4. BFC

BFC（Block Formatting Context），即块级格式化上下文，它是页面中的一块渲染区域，并且有一套属于自己的渲染规则

BFC 是一个独立的布局环境,可以理解为一个容器,在这个容器中按照一定规则进行物品摆放,并且不会影响其它环境中的物品。
如果一个元素符合触发 BFC 的条件，则 BFC 中的元素布局不受外部影响。
浮动元素会创建 BFC，则浮动元素内部子元素主要受该浮动元素影响，所以两个浮动元素之间是互不影响的。

创建 BFC

1. 根元素或包含根元素的元素
2. 浮动元素 `float ＝ left | right 或 inherit（≠ none）`
3. 绝对定位元素 position ＝ absolute 或 fixed`
4. `display ＝ inline-block | flex | inline-flex | table-cell 或 table-caption`
5. `overflow ＝ hidden | auto 或 scroll (≠ visible)`

BFC 的特性

1. BFC 是一个独立的容器，容器内子元素不会影响容器外的元素。反之亦如此。
2. 盒子从顶端开始垂直地一个接一个地排列，盒子之间垂直的间距是由 margin 决定的。
3. 在同一个 BFC 中，两个相邻的块级盒子的垂直外边距会发生重叠。
4. BFC 区域不会和 float box 发生重叠。
5. BFC 能够识别并包含浮动元素，当计算其区域的高度时，浮动元素也可以参与计算了。

## 5. CSS3 新增伪类有哪些？

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

## 6. overflow: scroll 时不能平滑滚动的问题怎么处理？

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

## 7. 一个高度自适应的 div，里面有两个 div，一个高度 100px，希望另一个填满剩下的高度

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

## 7. display:inline-block 什么时候会显示间隙？

- 相邻的 inline-block 元素之间有换行或空格分隔的情况下会产生间距
- 非 inline-block 水平元素设置为 inline-block 也会有水平间距
- 可以借助 vertical-align:top; 消除垂直间隙
- 可以在父级加 font-size：0; 在子元素里设置需要的字体大小，消除垂直间隙
- 把 li 标签写到同一行可以消除垂直间隙，但代码可读性差

## 8. 使用 CSS 实现网站的暗黑模式 (Dark Mode)

```css
@media (prefers-color-scheme: dark) {
  :root {
  }
}

html[theme='dark-model'] {
  filter: invert(1) hue-rotate(180);
  transition: color 300ms, background-color 300ms; /*过渡动画*/
}
```

css 的 filter 属性 是将用于图片上的过滤，颜色变化等图形效果应用与元素上， 上面所使用到的 invert 可以用来反转应用程序的颜色; hue-rotate 是用来改变图像上的应用色颜色 通过 invert(1)将白色变成黑色，那么为了适配颜色的变化，网页上的图像的颜色应该也做一个改变，这个改变就是通过 hue-rotate(180edg)来实现的 filter 属性 其他著名的应用还有: _blur() 模糊图像_ opacity() 图像透明程度 _drop-shadow() 对图像应用阴影效果_

## 9. 如何避免命名样式冲突

1. BEM 式: .home-page .home-page-btn
2. CSS Scoped
3. CSS Module

## 10. 方格背景

```css
.box {
  background: linear-gradient(90deg, rgba(200, 200, 200, 0.1) 3%, transparent 0), linear-gradient(rgba(
          200,
          200,
          200,
          0.1
        ) 3%, transparent 0);
  background-size: 20px 20px;
}
```

## 11. 省略号

```css
/* 单行省略 */
.one {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行省略 */
.mult {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
```

### 单行居中显示文字，多行居左显示，最多两行超过用省略号结尾

```html
<!-- 只有一行时居中显示文字，多行居左显示，最多两行超过用省略号结尾 -->
<div class="container">
  <h2>
    <p><em>我是单行标题居中</em></p>
  </h2>
  <h2>
    <p><em>我是两行标题两行标题两行标题居左</em></p>
  </h2>
  <h2>
    <p>
      <em
        >我是超过两行的标题最后点号省略我是超过两行的标题最后点号省略我是超过两行的标题最后点号省略省略省略</em
      >
    </p>
  </h2>
</div>
```

```css
* {
  margin: 0;
  padding: 0;
}

h2 em {
  position: relative;
  font-style: normal;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.container {
  width: 320px;
  padding: 0 10px;
  margin: 10px auto;
  background: #ddd;
}

.container p {
  display: inline-block;
  text-align: center;
}

h2 {
  text-align: center;
  padding: 10px 0;
}
```

让内层 p 居左 text-align:left，外层 h2 居中 text-align:center，并且将 p 设置为 display:inline-block ，利用 inline-block 元素可以被父级 text-align:center 居中的特性，这样就可以实现单行居中，多行居左

CSS 中的 p 元素，原因在于我们第一个设置的 display: inline-block ，被接下来设置的 display: -webkit-box 给覆盖掉了，所以不再是 inline-block 特性的内部 p 元素占据了一整行，也就自然而然的不再居中，而变成了正常的居左展示

## 12. 动画暂停

```css
.animation {
  animation: move 2s linear infinite alternate;
}

@keyframes move {
  0% {
    transform: translate(-100px, 0);
  }
  100% {
    transform: translate(100px, 0);
  }
}

.run {
  animation-play-state: running;
}

.pause {
  animation-play-state: paused;
}
```

## 13. 层叠水平

![层叠水平](https://images2015.cnblogs.com/blog/608782/201609/608782-20160923104742809-2054066790.png)

## 14. background-blend-mode

`background-blend-mode: lighten`

图片混合

```scss
$img: 'https://user-images.githubusercontent.com/8554143/34350345-4812d23a-ea51-11e7-98eb-461188ce9125.png';

.pic {
  width: 100px;
  height: 100px;
  margin: 50px auto;
  cursor: pointer;
  transition: 0.5s all ease-out;
}

.pic1 {
  background-image: url($img), linear-gradient(#f09, #09f, #f0f);
  background-blend-mode: lighten;
  background-size: cover;
  background-position: 0 0, 0 120px;
  background-repeat: no-repeat;
}

.pic1:hover {
  background-position: 0 0, 0 0;
}
```

![文字混合](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/27/1609662721755187~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)

```html
<div class="container">
  <div class="pic"></div>
  <div class="text">IMAGE</div>
</div>
```

```css
.pic {
  position: relative;
  width: 100%;
  height: 100%;
  background: url($img);
  background-repeat: no-repeat;
  background-size: cover;
}

.text {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #000;
  mix-blend-mode: lighten;
  background-color: #fff;
}
```

### mask 遮罩，一行代码实现头像与国旗的融合

```css
div {
  position: relative;
  margin: auto;
  width: 200px;
  height: 200px;
  /* 正常头像 */
  background: url(image1) no-repeat;
  background-size: cover;
}
.div::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* 国旗图片 */
  background: url(image2) no-repeat;
  background-size: cover;
  mask: linear-gradient(110deg, #000 10%, transparent 70%, transparent);
}
```

![mask](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f57e39d99ef4eb680110bccf5a00f5a~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

## 15. 视觉落差

### background-attachment

- scroll：此关键字表示背景相对于元素本身固定， 而不是随着它的内容滚动。
- local：此关键字表示背景相对于元素的内容固定。如果一个元素拥有滚动机制，背景将会随着元素的内容滚动， 并且背景的绘制区域和定位区域是相对于可滚动的区域而不是包含他们的边框
- fixed：此关键字表示背景相对于视口固定。即使一个元素拥有滚动机制，背景也不会随着元素的内容滚动。

使用 background-attachment: fixed 实现滚动视差

```html
<section class="g-word">Header</section>
<section class="g-img">IMG1</section>
<section class="g-word">Content1</section>
<section class="g-img">IMG2</section>
<section class="g-word">Content2</section>
<section class="g-img">IMG3</section>
<section class="g-word">Footer</section>
```

```css
section {
  height: 100vh;
}

.g-img {
  background-image: url(...);
  background-attachment: fixed;
  background-size: cover;
  background-position: center center;
}
```

![background-attachment](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/10/16521e893d1a43ee~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

### 使用 transform: translate3d

1. 实现滚动视差我们给容器设置上 transform-style: preserve-3d 和 perspective: xpx，那么处于这个容器的子元素就将位于 3D 空间中
2. 再给子元素设置不同的 transform: translateZ()，这个时候，不同元素在 3D Z 轴方向距离屏幕（我们的眼睛）的距离也就不一样
3. 滚动滚动条，由于子元素设置了不同的 transform: translateZ()，那么他们滚动的上下距离 translateY 相对屏幕（我们的眼睛），也是不一样的，这就达到了滚动视差的效果。

```html
<div class="g-container">
  <div class="section-one">translateZ(-1)</div>
  <div class="section-two">translateZ(-2)</div>
  <div class="section-three">translateZ(-3)</div>
</div>
```

```css
html {
  height: 100%;
  overflow: hidden;
}

body {
  perspective: 1px;
  transform-style: preserve-3d;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.g-container {
  height: 150%;

  .section-one {
    transform: translateZ(-1px);
  }
  .section-two {
    transform: translateZ(-2px);
  }
  .section-three {
    transform: translateZ(-3px);
  }
}
```

## 16. 滚动阴影

```css
.g-combine {
  background: linear-gradient(#fff, #f00), radial-gradient(at 50% 0%, #000, #0f0 70%);
  background-size: 100% 10px, 100% 10px;
  background-repeat: no-repeat;
  background-attachment: local, scroll;
}
```

![滚动阴影](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfffb1ca8d924d6491ab218dea8d21bc~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

## 17. 路径动画

```css
div {
  /* 只改变运动路径，其他保持一致 */
  offset-path: path('M 0 0 L 100 0 L 200 0 L 300 100 L 400 0 L 500 100 L 600 0 L 700 100 L 800 0');
  animation: move 2000ms infinite alternate linear;
}
@keyframes move {
  0% {
    offset-distance: 0%;
  }
  100% {
    offset-distance: 100%;
  }
}
```

## 18. 毛玻璃

### backdrop-filter

```css
.g-backdrop-filter {
  backdrop-filter: blur(6px);
}
```

![backdrop-filter](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3844c5f068fb498e84759db843394e64~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

### background-attachment: fixed

```scss
$img: 'https://static.pexels.com/photos/373934/pexels-photo-373934.jpeg';

body {
  height: 100vh;
  display: flex;
  background-image: url($img);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

.g-glossy {
  position: relative;
  width: 600px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url($img);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    filter: blur(10px);
    z-index: -1;
  }
}
```

## 19. flex:1

flex 属性是 flex-grow, flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。后两个属性可选。

flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间（如果有的话）。如果一个项目的 flex-grow 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。如果所有项目的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的 flex-shrink 属性为 0，其他项目都为 1，则空间不足时，前者不缩小。

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。

flex 属性属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。
所以 flex: 1 表示的含义是等分剩余空间。

## 20. display:flex 和 position:absolute/fixed
