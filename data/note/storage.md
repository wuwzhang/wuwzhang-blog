---
title: 缓存
date: '2022-06-11'
tags: ['None', 'storage', 'HTTP']
update: '2023-01-12'
draft: false
summary: 前端缓存
---

## 前端缓存

- http 缓存
  - 强缓存
    - Pragma
    - Cache-Control
    - Expires
  - 协商缓存
    - ETag/If-None-Match
    - Last-Modified/If-Modified-Since
- 浏览器缓存
  - 本地存储
    - Cookie
    - WebStorage
      - sessionStorage
      - localStorage
    - WebSql
    - indexDB
    - Application Cache
    - PWA
  - 默认存储
    - 往返缓存 BFCache

![浏览器缓存](https://upload-images.jianshu.io/upload_images/3174701-8e74b69ad9376710?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

### 什么是`HTTP`缓存

`HTTP`缓存可以说是`HTTP`性能优化中简单高效的一种优化方式了，缓存是一种保存资源副本并在下次请求时直接使用该副本的技术，当`web`缓存发现请求的资源已经被存储，它会拦截请求，返回该资源的拷贝，而不会去源服务器重新下载。

常见的`http`缓存只能缓存`get`请求响应的资源，对于其他类型的响应则无能为力，所以后续说的请求缓存都是指`GET`请求。

### 用户刷新/访问行为的手段分成三类

- 在`URI`输入栏中输入然后回车/通过书签访问
- `F5`/点击工具栏中的刷新按钮/右键菜单重新加载
- `Ctl+F5` （完全不使用 HTTP 缓存）

不同的刷新手段，会导致浏览器使用不同的缓存策略

`HTTP`缓存主要是通过请求和响应报文头中的对应`Header`信息，来控制缓存的策略。

响应头中相关字段为`Expires`、`Cache-Control`、`Last-Modified`、`Etag`。

### `HTTP`缓存分类

- 根据是否需要**重新向服务器发起请求**来分类
  - 强制缓存: 强制缓存如果生效，不需要再和服务器发生交互
  - 协商缓存: 协商缓存不管是否生效，都需要与服务端发生交互
- 根据是否可以被**单个或者多个用户**使用来分类
  - 私有缓存
  - 共享缓存

强制缓存和协商缓存的一些对比:
![强制缓存和协商缓存的一些对比](https://upload-images.jianshu.io/upload_images/4845448-ab0e961921da5694?imageMogr2/auto-orient/strip|imageView2/2/w/690/format/webp)

1. 打开网页，地址栏输入地址： 查找 disk cache 中是否有匹配。如有则使用；如没有则发送网络请求。
2. 普通刷新 (F5)：因为 TAB 并没有关闭，因此 memory cache 是可用的，会被优先使用(如果匹配的话)。其次才是 disk cache。
3. 强制刷新 (Ctrl + F5)：浏览器不使用缓存，因此发送的请求头部均带有 Cache-control: no-cache(为了兼容，还带了 Pragma: no-cache),服务器直接返回 200 和最新内容。

假设浏览器有一个缓存数据库用于本地缓存，先看看浏览器请求资源的情况：
![浏览器请求资源](https://images2015.cnblogs.com/blog/632130/201702/632130-20170210141639213-1923993391.png)

#### 强缓存

强制缓存在缓存数据未失效的情况下（即`Cache-Control`的`max-age`没有过期或者`Expires`的缓存时间没有过期），那么就会直接使用浏览器的缓存数据，不会再向服务器发送任何请求。

在缓存数据时，仅基于强制缓存，请求数据的流程如下:
![缓存数据时，仅基于强制缓存，请求数据的流程](https://images2015.cnblogs.com/blog/632130/201702/632130-20170210135521072-1812985836.png)

强制缓存生效时，`HTTP`状态码是`200`。这种方式页面的加载速度是最快的，性能也是很好的，但是在这期间，如果服务器端的资源修改了，页面上是拿不到的，因为它不会再向服务器发请求了。在`Chrome` 中，强缓存又分为`Disk Cache`（存放在硬盘中）和`Memory Cache`（存放在内存中），存放的位置是由浏览器控制的。

是否强缓存由`Expires`、`Cache-Control` 和 `Pragma` 3 个`Header` 属性共同来控制。

![Header](https://upload-images.jianshu.io/upload_images/4845448-217723260f75ed90?imageMogr2/auto-orient/strip|imageView2/2/w/800/format/webp)
在`HTTP 1.1`的版本，`Expires`被`Cache-Control`替代

##### Expires

- HTTP 1.0
- 存在于服务端返回的响应头中
- 缺点：不存在时区问题, 服务器的时间和浏览器的时间可能并不一致导致失效

```shell
Expires: Wed, 21 Oct 2021 07:28:00 GMT
```

##### Cache-Control

- HTTP 1.1
- 响应头和请求头
- 缺点：时间最终还是会失效

Cache-Control 主要是利用该字段的 max-age 值来进行判断，它是一个相对时间，例如 Cache-Control:max-age=3600，代表着资源的有效期是 3600 秒。

cache-control 除了该字段外，还有下面几个比较常用的设置值：

- no-cache：不使用本地缓存。需要使用缓存协商，先与服务器确认返回的响应是否被更改，如果之前的响应中存在 ETag，那么请求的时候会与服务端验证，如果资源未被更改，则可以避免重新下载。
- no-store：直接禁止浏览器缓存数据，每次用户请求该资源，都会向服务器发送一个请求，每次都会下载完整的资源。
- public：可以被所有的用户缓存，包括终端用户和 CDN 等中间代理服务器。
- private：只能被终端用户的浏览器缓存，不允许 CDN 等中继缓存服务器对其缓存。
  Cache-Control 与 Expires 可以在服务端配置同时启用，同时启用的时候 Cache-Control 优先级高。如：

```shell
cache-control:max-age=691200
expires:Fri, 15 May 2020 10:47:02 GMT
```

那么表示资源可以被缓存的最长时间为 691200 秒。

在`Chrome`浏览器中返回的`200`状态会有两种情况：

- from memory cache
  - 从内存中获取/一般缓存更新频率较高的 js、图片、字体等资源
- from disk cache
  - 从磁盘中获取/一般缓存更新频率较低的 js、css 等资源

这两种情况是`Chrome`自身的一种缓存策略，这也是为什么`Chrome`浏览器响应的快的原因。其他浏览返回的是已缓存状态，没有标识是从哪获取的缓存。

Chrome:
![chrome](https://upload-images.jianshu.io/upload_images/4845448-1cff8751a782e4c7?imageMogr2/auto-orient/strip|imageView2/2/w/570/format/webp)

Firefox:
![Firefox](https://upload-images.jianshu.io/upload_images/4845448-f0dd6442c2147820?imageMogr2/auto-orient/strip|imageView2/2/w/765/format/webp)

```js
const express = require('express')
const app = express()
var options = {
  etag: false, // 禁用协商缓存
  lastModified: false, // 禁用协商缓存
  setHeaders: (res, path, stat) => {
    res.set('Cache-Control', 'max-age=10') // 强缓存超时时间为10秒
  },
}
app.use(express.static(__dirname + '/public', options))
app.listen(3000)
```

第一次加载，页面会向服务器请求数据，并在`Response Header`中添加`Cache-Control`，过期时间为`10`秒
![第一次加载](https://static001.geekbang.org/infoq/7b/7b3493d4aab4eb33fea0b51f77dc97be.webp)

第二次加载，`Date`头属性未更新，可以看到浏览器直接使用了强缓存，实际没有发送请求。
![第二次加载](https://static001.geekbang.org/infoq/d4/d49923cad855fa3463b0b82a33931ec6.webp)

过了`10`秒的超时时间之后，再次请求资源：
![过了10秒的超时时间之后](https://static001.geekbang.org/infoq/a1/a1cf936de6932e45ec8e6f20b40a9473.webp)

不同的访问/刷新手段，会使浏览器使用不同的缓存策略，要让浏览器走强制缓存对请求方式有一个要求: 在`URI`输入栏中输入然后回车/通过书签访问

#### 协商缓存

当浏览器的强缓存失效的时候或者请求头中设置了不走强缓存(属性设置为`no-cache`)

在请求头中设置了 `If-Modified-Since`或者`If-None-Match`的时候，会将这两个属性值到服务端去验证是否命中协商缓存，如果命中了协商缓存，会返回`304`状态，加载浏览器缓存，那么浏览器第二次请求时就会与服务器进行协商，与服务器端对比判断资源是否进行了修改更新。

![规则](https://images2015.cnblogs.com/blog/632130/201702/632130-20170210141716838-764535017.png)

跟协商缓存相关的`header`头属性有（`ETag/If-None-Match` 、`Last-Modified/If-Modified-Since`）请求头和响应头需要成对出现:
![请求头和响应头](https://upload-images.jianshu.io/upload_images/4845448-a22cef109d00aa79?imageMogr2/auto-orient/strip|imageView2/2/w/800/format/webp)

协商缓存的执行流程是这样的：

- 当浏览器**第一次**向服务器发送请求时，会在响应头中返回协商缓存的头属性：`ETag`和`Last-Modified`
  - `ETag`返回的是一个`hash`值
  - `Last-Modified`返回的是`GMT`格式的最后修改时间。
- 浏览器在**第二次**发送请求的时候，会在请求头中带上与`ETag`对应的`If-None-Match`
  - `ETag`就是响应头中返回的`ETag`的值
  - `Last-Modified`对应的`If-Modified-Since`。
- 服务器在接收到这两个参数后会做比
  - 如果返回的是`304`状态码，则说明请求的资源没有修改，浏览器可以直接在缓存中取数据
  - 否则，服务器会直接返回数据。

```js
const express = require('express')
const app = express()
var options = {
  etag: true, // 开启协商缓存
  lastModified: true, // 开启协商缓存
  setHeaders: (res, path, stat) => {
    res.set({
      'Cache-Control': 'max-age=00', // 浏览器不走强缓存
      Pragma: 'no-cache', // 浏览器不走强缓存
    })
  },
}
app.use(express.static(__dirname + '/public', options))
app.listen(3001)
```

第一次请求资源:
![第一次请求资源](https://static001.geekbang.org/infoq/7d/7d333f4797e6147422624af73432347d.webp)

第二次请求资源，服务端根据请求头中的`If-Modified-Since`和`If-None-Match`验证文件是否修改。
![第二次请求资源](https://static001.geekbang.org/infoq/64/6494554dd1a2877bae6288cca3934921.webp)

再来验证一下`ETag`在强校验的情况下，只增加一行空格，`hash`值如何变化，在代码中，采用的是对文件进行`MD5`加密来计算其`hash`值。

**注**：只是为了演示用，实际计算不是通过`MD5`加密的，`Apache`默认通过`FileEtag`中`FileEtag INode Mtime Size`的配置自动生成`ETag`，用户可以通过自定义的方式来修改文件生成`ETag`的方式。

为了保证`lastModified`不影响缓存，把通过`Last-Modified/If-Modified-Since`请求头删除了，源码如下：

```js
const express = require('express')
const CryptoJS = require('crypto-js/crypto-js')
const fs = require('fs')
const app = express()
var options = {
  etag: true, // 只通过Etag来判断
  lastModified: false, // 关闭另一种协商缓存
  setHeaders: (res, path, stat) => {
    const data = fs.readFileSync(path, 'utf-8') // 读取文件
    const hash = CryptoJS.MD5(JSON.stringify(data)) // MD5加密
    res.set({
      'Cache-Control': 'max-age=00', // 浏览器不走强缓存
      Pragma: 'no-cache', // 浏览器不走强缓存
      ETag: hash, // 手动设置Etag值为MD5加密后的hash值
    })
  },
}
app.use(express.static(__dirname + '/public', options))
app.listen(4000) // 使用新端口号，否则上面验证的协商缓存会一直存在
```

第一次和第二次请求如下：
![第一次](https://static001.geekbang.org/infoq/a2/a2a127648387b91ed953f7e0af821d1d.webp)
![第二次](https://static001.geekbang.org/infoq/76/76c8d4f8059b5c3cc3fbf84e48495325.webp)

然后修改了`test.js` ，增加一个空格后再删除一个空格，保持文件内容不变，但文件的修改时间改变，发起第三次请求，由于我生成`ETag`的方式是通过对文件内容进行 MD5 加密生成，所以虽然修改时间变化了，但请求依然返回了`304`，读取浏览器缓存。
![304](https://static001.geekbang.org/infoq/04/04826d47fd951a7c852608c3bdcce519.webp)

`ETag/If-None-Match`是在`HTTP/1.1`出现的，主要解决了`Last-Modified/If-Modified-Since`所解决不了的问题：

- `Last-Modified`标注的最后修改只能精确到秒级，如果某些文件在`1`秒钟以内，被修改多次的话，它将不能准确标注文件的修改时间
- 如果某些文件被修改了，但是内容并没有任何变化，而`Last-Modified`却改变了，导致文件没法使用缓存
- 有可能存在服务器没有准确获取文件修改时间，或者与代理服务器时间不一致等情形

##### 整体流程图

![整体流程图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ba010a1229f477b93e3432e5e8be509~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### 私有缓存（浏览器级缓存）

私有缓存只能用于单独的用户：`Cache-Control: Private`

#### 共享缓存（代理级缓存）

共享缓存可以被多个用户使用: `Cache-Control: Public`

### 为什么要使用 HTTP 缓存 ？

1. 减少了冗余的数据传输，节省了网费。
2. 缓解了服务器的压力， 大大提高了网站的性能
3. 加快了客户端加载网页的速度

### HTTP 缓存的几个注意点

1. 强缓存情况下，只要缓存还没过期，就会直接从缓存中取数据，就算服务器端有数据变化，也不会从服务器端获取了，这样就无法获取到修改后的数据。决解的办法有：在修改后的资源加上随机数,确保不会从缓存中取。

例如：
`<http://www.kimshare.club/kim/common.css?v=22324432>`
`<http://www.kimshare.club/kim/common.2312331.css>`

2. 尽量减少`304`的请求，因为我们知道，协商缓存每次都会与后台服务器进行交互，所以性能上不是很好。从性能上来看尽量多使用强缓存。

3. 在`Firefox`浏览器下，使用`Cache-Control: no-cache`是不生效的，其识别的是`no-store`。这样能达到其他浏览器使用`Cache-Control: no-cache`的效果。所以为了兼容`Firefox`浏览器，经常会写成`Cache-Control: no-cache,nostore`。

如果什么缓存策略都没设置，那么浏览器会怎么处理？（启发式缓存）

对于这种情况，浏览器会采用一个启发式的算法，通常会取响应头中的 Date 减去 Last-Modified 值的 10% 作为缓存时间。

### 实际场景应用缓存策略

#### 频繁变动的资源

```shell
Cache-Control: no-cache
```

对于频繁变动的资源，首先需要使用 Cache-Control: no-cache 使浏览器每次都请求服务器，然后配合 ETag 或者 Last-Modified 来验证资源是否有效。这样的做法虽然不能节省请求数量，但是能显著减少响应数据大小。

#### 不常变化的资源

```shell
Cache-Control: max-age=31536000
```

通常在处理这类资源时，给它们的 Cache-Control 配置一个很大的 max-age=31536000 (一年)，这样浏览器之后请求相同的 URL 会命中强制缓存。而为了解决更新的问题，就需要在文件名(或者路径)中添加 hash， 版本号等动态字符，之后更改动态字符，从而达到更改引用 URL 的目的，让之前的强制缓存失效 (其实并未立即失效，只是不再使用了而已)。
在线提供的类库 (如 jquery-3.3.1.min.js, lodash.min.js 等) 均采用这个模式。

## 来源

- [深入理解浏览器的缓存机制](https://www.jianshu.com/p/54cc04190252)
