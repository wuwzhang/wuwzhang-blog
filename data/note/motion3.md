---
title: 动效 - PPT - 2
date: '2022-03-05'
tags: ['motion']
draft: false
summary: 动效实现方案
---

<TOCInline toc={props.toc} asDisclosure toHeading={3} />

### 实现方案

| 方案   | 实现方案                                                  | 优势                                                                                                                                                                                                                           | 劣势                                                                                                                                                                                        |
| ------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 手工   | css3 / canvas / svg / Web API                             | 灵活，所有动效都尽在开发的掌握                                                                                                                                                                                                 | 开发时间长，沟通成本大，设计同学很难空口描述出想要的动效，也受开发的水平限制比较大                                                                                                          |
| gif    |                                                           | 开发成本低，沟通成本小                                                                                                                                                                                                         | 1. 画质上，gif 支持颜色少(最大 256 色)、Alpha 透明度支持差，图像锯齿毛边比较严重 2. 交互上，不能直接控制播放、暂停、播放次数，灵活性差 3. 性能上，gif 会引起页面周期性的 paint ，性能较差。 |
| 视频   |                                                           | 可以便捷的操作序列帧，开发成本小，相较 gif 体积较小                                                                                                                                                                            | 移动端视频在不同 app、不同机型、不同系统的播放体验不大一样，尤其是 app 内，需要端侧做一些处理                                                                                               | 尽量不要在移动端使用 |
| 雪碧图 |                                                           | 开发成本中等，沟通成本小                                                                                                                                                                                                       | 合成的雪碧图文件大，且在不同屏幕分辨率下可能会失真                                                                                                                                          |
| apng   | 开发用图片的形式嵌入                                      | 同 gif，体积较 gif 小，可以与 webp 的大小相对比，性能性价比相对高                                                                                                                                                              | 1.支持全彩和透明(最重要) 2.向下兼容 PNG 3.无专利问题(之前 GIF 的 LZW 算法有专利限制)                                                                                                        |
| lottie | 设开发引入 lottie 插件，并对设计给出的 json 进行解析      | 开发成本中等，效果不受开发同学水平限制，只要设计画的出，开发就能实现出来；灵活，基点元素可以作为一个普通的 dom 节点进行定位，整个动画可以任意播放停止甚至倒放以及从某一帧开始播放（具体能实现的参见 api 文档），灵活度非常高。 | 在开发层面和设计层面看到的帧节点以及播放速度不同，需要持续进行沟通联调，沟通成本大；lottie 插件打包前 400+kb，打包后也有 200+kb，会显著增加项目的大小                                       |
| svga   | 设计同学给出 .svga 文件，开发引入 svga 插件，对其进行解析 | 理论上来说同 lottie                                                                                                                                                                                                            | 实际引入中，存在“无故清除 canvas 画布”的问题，不稳定性极高，建议只使用在单纯播放的场景                                                                                                      |

---

### 什么是 APNG

> APNG 是基于 PNG 格式扩展的一种位图动画格式，增加了对动画图像的支持，同时加入了 24 位真彩色图像和 8 位 Alpha 透明度的支持，动画拥有更好的质量。

[gif vs apng vs webp](http://littlesvr.ca/apng/gif_apng_webp3.html)
![](https://p6.music.126.net/obj/wo3DlcOGw6DClTvDisK1/3515572012/bc69/f332/118e/d174b90ccb3b2598e83c3a71dcc39a09.png)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87b333f72050452997fc9afc490d7744~tplv-k3u1fbpfcp-watermark.image)

如果动画仅单独展示可以使用`<img>`直接展示 APNG 动画，但是会存在**兼容性 Bug**

- 部分浏览器不支持 APNG 播放
- apng 在页面上只能播放一次，所以如果一个动画需要重复播放，需要每次给动画连接添加时间戳，让浏览器认为是一个新的连接
- apng 在安卓和 ios 上表现存在差距，例如安卓播放一次，ios 会播放两次
- apng 的动画时间无法控制，很难实现中途暂停，衔接等操作

当然，我们可以通过[apng-canvas]将 apng 转为 canvas, 来抹平不同浏览器的差异，且便于控制 APNG 播放

_原理可见[Web 端 APNG 播放实现原理](https://juejin.cn/post/6857678436304388104)_

### steps

> steps()功能符和 CSS3 animation 中的 cubic-bezier()功能符的地位和作用是一样的，都可以作为 animation-timing-function 的属性值。

steps()更像是楼梯坡道，cubic-bezier()更像是无障碍坡道。如下图示意：
[![2BK3m8.png](https://z3.ax1x.com/2021/06/07/2BK3m8.png)](https://imgtu.com/i/2BK3m8)

###### 用法

```scss
// steps(number, position)
steps(5, end);
steps(2, start);
```

- 第一个参数指定了函数中的间隔数量（必须是正整数）
- 第二个参数可选，指定在每个间隔的起点或是终点发生阶跃变化，接受 start 和 end 两个值，默认为 end

![](https://img12.360buyimg.com/ling/jfs/t1/76833/39/2270/11321/5d08af97Ea8628351/cc4b972e192ab455.png)

---

### 举个 🌰

> `step()`函数结合序列帧图片，可以实现很多小而美的逐帧动画效果。如 twitter 的 Like 的效果

逐帧显示下图，然后控制 background-position 实现效果。

![](https://cssanimation.rocks/images/posts/steps/heart.png)

```scss
// animation-play-state: paused | running;
animation: heart-burst steps(28) 0.8s infinite both;
```

**还有还有~**

CSS3 动画是可以随时暂停的，真暂停，纹丝不动的那种，只需要使用这段 CSS 声明即可：

```scss
animation-play-state: paused;
```

结合这些，我们可以实现
![](https://user-gold-cdn.xitu.io/2018/10/16/1667baa4000711c9?imageslim)
[codepen-star](https://codepen.io/wuw/pen/VwpdvdO)

---

### 运动分解

对于复杂动画，我们可以对动画进行分解，通过标签嵌套，分别应用在祖先元素和后代元素上，例如下图这个抛物线动画效果：
![](https://user-gold-cdn.xitu.io/2018/10/16/1667baa411504371?imageslim)

```scss
@keyframes xAxis {
  100% {
    animation-timing-function: linear;
    transform: translateX(100px);
  }
}

@keyframes yAxis {
  100% {
    animation-timing-function: ease-in;
    transform: translateY(100px);
  }
}
```

[codepen-运动分解](https://codepen.io/wuw/pen/oNZyoOR)

---

### 探秘神奇的运动路径动画 motion path

> 什么是 CSS Motion Path 运动路径？利用这个规范规定的属性，我们可以控制元素按照特定的路径进行位置变换的动画。并且，这个路径可以是非常复杂的一条路径

CSS 传统方式实现直线路径动画

CSS 也可以实现一些简单的曲线路径动画的， 但是对于简单弧线还能实现，比如上面讲的力的分解，但是再复杂一点的，比如下图，就无能为力了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8352a40165d4943a59a2b09f53e13ac~tplv-k3u1fbpfcp-zoom-1.image)

CSS Motion Path 规范主要包含以下几个属性：

- offset-path：接收一个 SVG 路径（与 SVG 的 path、CSS 中的 clip-path 类似），指定运动的几何路径
- offset-distance：控制当前元素基于 offset-path 运动的距离
- offset-position：指定 offset-path 的初始位置
- ...

_其实 offset-path 这个属性都前身叫做 motion-path ，并且所有 motion-* 相关都属性都改为了 offset-*_

[codepen-motion-path](https://codepen.io/wuw/pen/qBrKpoE)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fe1f250fbab4f77a18409fc1fc9ada0~tplv-k3u1fbpfcp-zoom-1.image)

[CodePen Demo -- CSS Motion Path offset-path animation](https://codepen.io/Chokcoco/pen/dyNaZea)

---

### @property ，让不可能变可能

> @property CSS at-rule 是 CSS Houdini API 的一部分, 它允许开发者显式地定义他们的 CSS 自定义属性，允许进行属性类型检查、设定默认值以及定义该自定义属性是否可以被继承。

###### 语法

```scss
@property --property-name {
  syntax: '<color>';
  inherits: false;
  initial-value: #fff;
}

p {
  color: var(--property-name);
}
```

- @property --property-name 中的 --property-name 就是自定义属性的名称，定义后可在 CSS 中通过 var(--property-name) 进行引用
- syntax：该自定义属性的语法规则，也可以理解为表示定义的自定义属性的类型
- inherits：是否允许继承
- initial-value：初始值

支持的 syntax 语法类型

```
length
number
percentage
length-percentage
color
image
url
integer
angle
time
resolution
transform-list
transform-function
custom-ident (a custom identifier string)
```

他能帮我们一些解决 css 原生不支持的动画问题

比如，CSS 是不支持背景渐变色的直接过渡变化的，我们得到的只是两帧之间的之间变化。

---

### 使用 color syntax 语法类型作用于渐变

> 定义了两个 CSS Houdini 自定义变量 --houdini-colorA 和 --houdini-colorB，在 hover 变化的时候，改变这两个颜色。

```scss
@property --houdini-colorA {
  syntax: '<color>';
  inherits: false;
  initial-value: #fff;
}
@property --houdini-colorB {
  syntax: '<color>';
  inherits: false;
  initial-value: #000;
}
.property {
  background: linear-gradient(45deg, var(--houdini-colorA), var(--houdini-colorB));
  transition: 1s --houdini-colorA, 1s --houdini-colorB;

  &:hover {
    --houdini-colorA: #38f;
    --houdini-colorB: #3f8;
  }
}
```

transition: 1s --houdini-colorA, 1s --houdini-colorB 针对 CSS Houdini 自定义变量设定过渡，而不是针对 background 设定过渡动画

[codepen-property-demo](https://codepen.io/Chokcoco/pen/eYgyWLB?editors=1100)

## canvas

### 特点

- 效率高、性能好、可控性高，只能处理位图，内存占用恒定
- 依赖分辨率
- 不支持事件处理器
- 弱的文本渲染能力
- 能够以 .png 或 .jpg 格式保存结果图像
- 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

### 实现

- 基本动画
- 粒子动画
- [物理动画](https://juejin.cn/post/6844904185121488910)

## Web Animation API(简称 WAAPI)

> Web animation API，简言之就是把 CSS3 实现的 animation 动画变成由 JS 代码实现。

```js
var myAnimation = element.animate(keyframes, options)

element.animate([{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], {
  duration: 3000,
  delay: 0,
  fill: 'forwards',
  easing: 'steps(8, end)',
  iterations: Infinity,
})
```

![](https://www.w3cplus.com/sites/default/files/blogs/2020/2007/create-highly-performant-animations-using-web-animations-api-and-reack-hooks-5.png)

_兼容性问题，可以添加垫片 polyfill：web-animations-js_

#### 1. 动态创建

CSS 动画如果给定动画的开始值和结束值事先不知道，那么就会非常棘手

#### 2. 回放控制

Web Animation API 提供了一些控制动画播放的有用方法，比如 play()、pause()、reverse()和 playbackRate

[codepen-WAAPI-控制函数](https://codepen.io/wuw/pen/yLMqqZM?editors=0010)

#### 3. 控制 Web 动画的生命周期

举例：淡入淡出 - css

```scss
@keyframes fadeOut {
  to { opacity: 0 }
}

element.style.animationName = "fadeOut";
element.addEventListener("animationend", event => {
  element.remove();
})
```

_动画事件冒泡，事件可能来自于 DOM 层次结构中一个子元素中完成的动画，动画可以以同样的方式命名_

Web Animation API 使用 promise 来监控动画的 ready 和 finished 状态：

```js
let animation = element.animate(
  {
    opacity: 0,
  },
  1000
)
animation.finished.then(() => {
  element.remove()
})
```

---

## FLIP 实现 DOM 切换动画

> FLIP 是一种记忆设备和技术, 来源于 First，Last，Invert，Play

##### First

指的是在任何事情发生之前（过渡之前），记录当前元素的位置和尺寸, 可以使用 getBoundingClientRect()这个 API 来处理

```js
// 获取当前元素的边界

const first = el.getBoundingClientRect()
```

![](https://www.w3cplus.com/sites/default/files/blogs/2018/1812/flip-layout-5.png)

##### Last

执行一段代码，让元素发生相应的变化，并记录元素在最后状态的位置和尺寸，比如

```js
// 通过给元素添加一个类名，设置元素最后状态的位置和大小

el.classList.add('totes-at-the-end')
```

##### Invert

先计算出从初始状态到最终状态元素发生的改变，比如宽度、高度、透明度等，然后在元素上应用一个 transform 或 opacity 使这些改变反转。如果一个元素由初始状态到最终状态是向下移动了 90px，那就需要对元素应用 transform: translate(0, -90px)，这样就使元素看起来还在初始位置。

##### Play

移除元素上的 transform 并设置 transform 相关的动画。可以使用`Web Animations API`实现

###### **FLIP 技术可以以一种高性能的方式来动态的改变 DOM 元素的位置和尺寸，而不需要管它的布局是如何计算或渲染的**

[vue 官方](https://cn.vuejs.org/v2/guide/transitions.html#%E5%88%97%E8%A1%A8%E7%9A%84%E6%8E%92%E5%BA%8F%E8%BF%87%E6%B8%A1)
