---
title: 正则表达式
date: '2022-07-12'
tags: ['note', 'regx', 'js']
draft: false
summary: 正则表达式(regular expression)描述了一种字符串匹配的模式（pattern），可以用来检查一个串是否含有某种子串、将匹配的子串替换或者从某个串中取出符合某个条件的子串等
---

# 正则表达式

> 正则表达式(regular expression)描述了一种字符串匹配的模式（pattern），可以用来检查一个串是否含有某种子串、将匹配的子串替换或者从某个串中取出符合某个条件的子串等

简单说: 对字符串的增加删改查

## \* 1、感受正则的魅力

> - g 全局匹配
> - i 忽略大小写
> - m 多行搜索
> - s 将字符串视为单行匹配
> - y 模式表示匹配到不符合的就停掉，不会继续往后匹配，必须连续的符合条件的

```js
let title = '现在是2021年06月19日13点15分'
// 普通方式拿到上面一段文字中的数字
let time = [...title].filter((item) => !Number.isNaN(Number.parseInt(item, 10)))
// 拿到数字
console.log(time.join(''))

// 使用正则获取数字,正则比上面的要简洁的多
let numbs = title.match(/\d/g)
console.log(numbs.join(''))

// 打印结果完全相同
console.log(time.join('') === numbs.join('')) // true
```

## \* 2、字面量方式创建正则表达式

```js
let title = 'heiqiu'
// test是检测的意思
// 判断字符串中是否有q
console.log(/q/.test(title)) // true

let reg = /q/
console.log(reg.test(title)) // true
```

## \* 3、对象方式创建正则表达式

```js
let title = 'heiqiu'
// 对象方式创建，可以方便的使用变量
let re = 'h'
let reg = new RegExp(re, 'g')

console.log(reg.test(title)) // true
```

## 4、或者选择符

> - | 用一个竖杠表示或者

```js
let title = 'heiqiu'
// 一个竖表示或者，两边的表达式满足任意条件即可
console.log(/hei|x/.test(title))

let tel = '020-9999999'
console.log(/(010|020)-\d{7,8}/.test(tel))
```

## \* 5、原子表和原子组选择符

> - [] 中括号表示原子表
> - () 小括号表示原子组

```js
// 原子表有 或者的意思，1或者2或者3
let reg = /[123]/g
// 原子组表示一个具体值,内容视为一个整体,123或者456
let reg2 = /(123|456)/g
let title = '1234688'
console.log(reg.test(title)) // true
console.log(reg2.test(title)) // true

console.log(title.match(reg)) //  ["1", "2", "3"]
console.log(title.match(reg2)) //  ["123"]
```

## \* 6、正则表达式中的转义符

> - \ 斜杠表示转义符
> - \d 阿拉伯数字
> - \w 字母、数字或下划线字符

需求：匹配带有小数点的数字

```js
let numb = 23.32
// . 有两层含义 除了换行符外的任意字符 和 普通点
// 正则含义：一个或多个数字加上一个点再加上一个或多个数字
let reg = /\d+\.\d+/
console.log(reg.test(numb))

console.log('d+.d+')
console.log('\\d+\\.\\d+')
// 字符串形式传入，需要对转义符 \ 做转义
let regObj = new RegExp('\\d+\\.\\d+')
console.log(regObj.test(numb))
```

## 7、字符边界约束

> ^ 表示正则开始，$ 表示正则结束

```js
let numb = '125499999'
// 限制以数字开始的数字结束的长度是5到9位的数字,同时以数字开始并且以数字结束
// ^ 表示开始，$ 表示结束
let numreg = /^\d{5,9}$/
console.log(numreg.test(numb)) // true
```

## 8、数值与空白元字符

> - \d, 匹配数字
> - \D, 匹配除了数字
> - [], 中括号里面出现的东西就要，如果中括号里面加上^表示不匹配中括号里面的内容
> - \s, 小写的 s 表示匹配空格
> - \S, 大写的 S 表示匹配除了空格
> - \+ 号匹配 1 个或多个字符
> - {x，y} 匹配 x 到 y 个字符

```js
let tel = `李四：010-56948754，张三：020-23522222`
// 只匹配第一个数字
console.log(tel.match(/\d/)) // 0
// 匹配第一组是数字得值
console.log(tel.match(/\d+/)) // 010
// g表示全局匹配，小写的\d表示匹配数组
console.log(tel.match(/\d{3}-\d{8,9}/g)) // ["010-56948754", "020-23522222"]

// 大写的\D表示匹配除了数字
console.log(tel.match(/\D+/g)) // ["李四：", "-", "，张三：", "-"]

// [],中括号里面出现的东西就要,如果中括号里面加上^表示不匹配中括号里面的内容
// \s,小写的s表示匹配空格
// \S,大写的S表示匹配除了空格
// +号匹配多个字符
console.log(tel.match(/[^：，\d\s-]+/g)) //  ["李四", "张三"]
```

## 9、w 和 W 元字符

> - \w 小写的 w 表示匹配字母、数字、下划线
> - \W 大写的 w 表示匹配不是字母、数字、下划线

```js
// 例子：匹配邮箱
let email = '15039155555@163.org.cn'
let emailreg = /^\w+@\w+(\.\w+)+$/
console.log(email.match(emailreg))
console.log(emailreg.test(email))
```

## \* 10、点元字符使用

> - . 表示除了换行符以外的字符

需求：匹配所有内容

```js
let title = `'黑球' 
'土豆'
`
// 只匹配到黑球
console.log(title.match(/.+/))

// 末尾跟上小写s表示将字符串视为单行匹配
console.log(title.match(/.+/s))
```

## \* 11、如何精巧匹配所有字符

> - [\s\S] 匹配空格和不是空格，两个都加上表示所有
> - [\d\D] 匹配数字和不是数字，两个都加上表示所有
> - [^] 表示匹配所有

需求：匹配所有内容

```js
let html = `
            <span>
                heiqiu
                shutiao
            </span>
        `

// 使用原子表匹配所有字符
// []字符只要有中括号里面的内容就可以匹配到
console.log(html.match(/<span>[\s\S]+<\/span>/))
```

## 12、i 和 g 模式修正符

> - i 不区分大小写
> - g 全局匹配

```js
let name = 'HeiQIu'
// 查找s,不区分大小写
console.log(name.match(/h/gi))

// 全局替换操作
let time = '2020/11/10'
// 把斜杠换为横杠 2020-11-10
console.log(time.replace(/\//g, '-'))
```

## \* 13、m 多行匹配修正符

> - m 多行匹配,即每一行单独处理

需求：格式化 [{name:'js',price:'200 元'}]

```js
let lessonObj = `
    #1 js,200元 #
    #2 php,300元 #
    #9 baidu.com # 百度
    #3 node.js,180元 #
  `
let filterLesson = lessonObj.match(/^\s*#\d+\s+.+\s+#$/gm)
console.log(filterLesson)
let lessons = filterLesson.map((v) => {
  v = v.replace(/\s*#\d+\s*/, '').replace(/\s+#/, '')
  ;[name, price] = v.split(',')
  return { name, price }
})
console.log(JSON.stringify(lessons, null, 2))
```

#### \* 14、汉字和字符属性

```js
let name = 'hello,你好中国,upup....加油！！！'

// 匹配标点符号
console.log(name.match(/\p{P}/gu)) // [",", ",", ".", ".", ".", ".", "！", "！", "！"]

// 匹配汉字
let strs = name.match(/\p{sc=Han}+/gu)
console.log(strs) // ["你好中国", "加油"]

// 匹配汉字
let hanzi = name.match(/[\u4e00-\u9fff]+/g)
console.log(hanzi) // ["你好中国", "加油"]
```

#### \* 15、lastIndex 属性的使用

```js
let name = 'heiqiu1'

// match获取元素只能获取到第一个元素的主信息
// 加上g后主信息会丢失
console.log(name.match(/\d/))

let reg = /\w/g
// 使用exec每检索一次，正则中的lastindex会加1
while ((res = reg.exec(name))) {
  console.log(res)
  // 此模式正则必须为g模式
  console.log(reg.lastIndex)
}
```

#### \* 16、有效率的 y 模式

> - y 模式表示匹配到不符合的就停掉，不会继续往后匹配，必须连续的符合条件的

需求：找出所有 qq 号

```js
let name = '我的qq号是,1111111111,22224545488,6411313416544，电话号是188888'

// 查到数字，逗号有或没有
// y 模式找到后就不会继续往后找
let reg = /(\d+),?/y
reg.lastIndex = 7
let qqList = []
while ((res = reg.exec(name))) {
  qqList.push(res[1])
}
console.log(qqList) // ["1111111111", "22224545488", "6411313416544"]
```

#### \* 17、原子表的基本使用

> - [] 原子表表示里面的内容时或者的关系,检测的内容在其中就可以被匹配到

```js
let name = 'heiqiu'
let namereg = /[hy]/g
console.log(name.match(namereg))

let time = '2020-s11-s13'
// \1 和 \2必须配合（）使用，\1表示后面的内容必须和第一个小括号匹配到的内容相同
let reg = /^\d{4}([-\/])(s)\d{2}\1\2\d{2}$/
console.log(time.match(reg))
```

#### 18、区间匹配

> - [a-z] 匹配 26 位小写字母
> - [0-9] 匹配 0-9 之间的数字，包含 0 和 9

```js
// [a-z] 或者 [0-9] 表示区间，只能是升序书写，不能降序书写
let a = 'a1b2c3'

// 匹配0-9的数字
let numreg = /[0-9]+/g
console.log(a.match(numreg)) // ["1", "2", "3"]

// 匹配字母
let objreg = /[a-z]+/g
console.log(a.match(objreg)) // ["a", "b", "c"]
```

#### \* 19、排除匹配

```js
let name = 'heiqiu'
// [^iu]表示排除字母iu
let reg = /[^iu]+/g
console.log(name.match(reg))
```

#### \* 20、原子表里的字符不会解析

```js
let name = '(heiqiu).+'
// 在原子表中的特殊字符不会被当成有特殊含义的字符，只会当做普通字符来匹配
let reg = /[().+]/g
console.log(name.match(reg)) // ["(", ")", ".", "+"]
```

#### 21、使用正则去除字符串中的所有空格

```js
let title = '  111  2 33  '
// 去空格，去除中间或者两边的空格
function trimreg(data) {
  return data.match(/[^\s]+/g).join('')
}
console.log(trimreg(title)) // 111233
```

#### \* 22、认识原子组

> - 一个小括号包起来的东西被称为原子组，\1 表示与第一个原子组相同的内容

```js
let dom = `
    <h1>标题一</h1>
    <h2>标题二</h2>
`

let reg = /<(h[1-6])>[\s\S]*<\/\1>/g
console.log(dom.match(reg)) // ["<h1>标题一</h1>", "<h2>标题二</h2>"]

let title = '黑球土豆黑球土豆黑球'

let reg = /((黑球)(土豆))\1\2/g
console.log(title.match(reg))
```

#### 23、邮箱验证使用原子组

> - 验证邮箱表达式：/\^\[\da-z][\w.]+@(\w+.)+(com|cn|org)$/i
> - 含义：以数字或者字母开头，数字字母下划线为主体，一个 @符号，后面跟上数字字母下划线和小数点，可以为多个，以 com 或 cn 或 org 结尾

```js
let mailAdd = '133333334@163.com'
/*
      邮箱正则
      以数字或者字母开头，数字字母下划线为主体，一个@符号
      后面跟上数字字母下划线和小数点，可以为多个
      以com 或 cn 或 org结尾
  */
let emailreg = /^[\da-z][\w.]+@(\w+\.)+(com|cn|org)$/i
console.log(emailreg.test(mailAdd))
```

#### \* 24、嵌套分组和不记录分组

> - 原子组里面加上?: 表示不记录该原子组，但是原子组的功能仍然生效

```js
let urlStr = `
    http://www.baidu.com
    https://taobao.cn
    https://www.zhifubao.com
`
// 原子组里面加上?:表示不记录该原子组，但是原子组的功能仍然生效
let reg = /https?:\/\/((?:\w+\.)?\w+\.(?:com|cn))/gi

let urls = []
while ((res = reg.exec(urlStr))) {
  // 1 表示第一个原子组
  console.log(res)
  urls.push(res[1])
}
console.log(urls) // ["www.baidu.com", "taobao.cn", "www.zhifubao.com"]
```

#### \* 25、重复匹配的使用

> - +：一个或者多个
> - \*：零个或者多个
> - ?: 有或者没有
> - {1,2}：一个到两个，最少一个，最多 2 连个，数字随便定义

```js
let name = 'sooooo'
// + ：一个或者多个
console.log(name.match(/so+/)) // sooooo

// * ：零个或者多个
console.log(name.match(/so*/)) // sooooo

// ? ：有或者没有
console.log(name.match(/so?/)) // so

// {1,2} ：一个到两个，最少一个，最多两个
console.log(name.match(/so{1,2}/)) // soo
```

#### \* 26、禁止贪婪

> - ? 禁止贪婪，会匹配最小的那个单位

```js
let name = 'soooooo'

// *：零个或多个，加上问号表示匹配0个
let reg = /so*?/g
console.log(name.match(reg)) // ["s"]

// +：一个或多个，加上问号表示只匹配1个
reg = /so+?/g
console.log(name.match(reg)) // ["so"]

// ?：0个或者1个，再加上问号表示只匹配0个
reg = /so??/g
console.log(name.match(reg)) // ["s"]

// {2,5} 表示匹配2到5个，加上问号表示匹配2个
reg = /so{2,5}?/g
console.log(name.match(reg)) // ["soo"]
```

#### \* 27、使用 matchAll 完成全局匹配

> - matchAll 获取到的是一个迭代对象，可以被遍历到

```js
let html = `
<h3>哈哈哈,sdfsdf</h3>
<h2>嘿嘿嘿</h2>
<h4>呵呵呵</h4>
<h5>嘎嘎嘎</h5>
`

let reg = /<(h[1-6])>([\s\S]+?)<\/\1>/g
// matchAll获取到的是一个迭代对象,可以被遍历到
let listAll = html.matchAll(reg)

let htmlData = []
for (let item of listAll) {
  htmlData.push(item[2])
}
console.log(htmlData) // ["哈哈哈,sdfsdf", "嘿嘿嘿", "呵呵呵", "嘎嘎嘎"]
```

#### 28、字符串的 search 方法和 match 方法

> - 字符串的 search 方法，找到后返回字符串所在下标，否则返回 -1
> - 字符串的 match 方法,在字符串内检索指定的值，或找到一个或多个正则表达式的匹配

```js
let urls = `http://www.baidu.com,
            http://taobao.com.cn,
            https://www.tmall.com/
        `

// 字符串的search方法,找到后返回字符串所在下标，否则返回-1
console.log(urls.search('baidu')) // 11

let reg = /https?:\/\/(\w+)?(\w+\.)+(com|cn)/g
// ["http://www.baidu.com", "http://taobao.com.cn", "https://www.tmall.com"]
console.log(urls.match(reg))
```

#### \* 29、$ 符在正则替换中的使用

> - $ : $n 代表原子组
> - $` : 获取替换元素左边的元素
> - $' : 获取替换元素右边的元素
> - $& : 获取替换元素本身

```js
let tel = '(0631)-150518888'
let telreg = /\((\d{3,4})\)-(\d+)/g
// 在replace中$1表示第一个原子组匹配到的内容
console.log(tel.replace(telreg, '$1/$2')) // 0631/150518888

// $` : 获取替换元素左边的元素
// $' : 获取替换元素右边的元素
// $& : 获取替换元素本身
let name = '123你好+++'
console.log(name.replace('你好', "$`$&$'")) // 123123你好++++++
```

#### 30、原子组起别名

> - 使用 ?<xx> 起原子组的别名
> - 使用 $<xx> 读取别名

```js
let html = `<h2>百度</h2>
<h3>支付宝</h3>
`
// 原子组起别名
let reg = /<(h[1-6])>(?<text>.*)?<\/\1>/g
// 使用$<cont>读取原子组的别名
let newHtml = html.replace(reg, `<i>$<text></i>`)
console.log(newHtml)
```

#### \* 31、后等断言

> - (?=xxx) 匹配右侧是 xxx 的字段

```js
let title = '猫黑球和猫土豆是朋友'
// 用小括号包括起来，前面加上?=表示该正则右侧等于某个值得元素
// 匹配猫 右侧 是黑球的字段
let str1 = /猫(?=黑球)/g
// 匹配猫 右侧 是土豆的字段
let str2 = /猫(?=土豆)/g

console.log(title.replace(str1, '黑猫').replace(str2, '灰猫'))
```

#### \* 32、前等断言

> - (?<=href=(['"])) 前面是 href = 单引号或者双引号的字段
>   需求：将网址全部替换为 "https://ant.design"

```js
let html = `
<a href="http://baidu.com">百度</a>
<a href='http://yahu.com'>雅虎</a>
`
// 匹配字符串之前是什么字段
let reg = /(?<=href=(['"])).+(?=\1)/gi
// ["http://baidu.com", "http://yahu.com"]
console.log(html.replace(reg, 'https://ant.design'))
```

#### 33、后不等断言

> ?! 表示不是以什么什么结尾

```js
let title = `阅读量：999
新增人数：10人`
// 匹配是空格的一个或多个，后面不是数字的字段
let reg = /\S+(?!\d+)$/g
console.log(title.match(reg).join('')) // 新增人数：10人
```

#### 34、前不等断言

> ?<! 匹配前面不是什么的字段

```js
let name = 'abc123def'
// 匹配前面不是数字的字符串
let reg = /(?<!\d+)[a-z]+/g
console.log(name.match(reg)) // ["abc", "ef"]
```

#### 35、使用断言模糊电话号

```js
// 不使用断言
let tels = '15036999999'
let reg = /(\d{3})(\d{4})(\d+)/g
tels = tels.replace(reg, (v, ...args) => {
  args[1] = '*'.repeat(4)
  return args.splice(0, 3).join('')
})
console.log(tels) // 150****9999

// 使用断言
let newtel = '15036999999'
// 匹配前面是由3位数字组成，后面是由4位数字组成的字段
let newreg = /(?<=\d{3})\d{4}(?=\d{4})/g
newtel = newtel.replace(newreg, (v) => {
  // 将这个字段替换成4个*号
  return '*'.repeat(4)
})
console.log(newtel) // 150****9999
```

### 36、在线测试工具

[regex101](https://regex101.com/)

- 解释及错误提醒
- 显示匹配信息
- 提供快速参考
- 切换中文显示

[菜鸟工具-正则](https://c.runoob.com/front-end/854)

- 显示匹配信息
- 提供快速参考和常用表达式

[regulex](https://jex.im/regulex)

- 结构分析
