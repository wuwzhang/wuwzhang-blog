## [表达式解释器](https://juejin.cn/post/7099013271776133127)
在流程编排、规则引擎等场景下，我们经常会遇到对一段用户自定义表达式进行解释运行的需求。表达式语法可以很多样，以最近我遇到的一个需求场景为例，需要支持以下类型表达式的解释运行：

|概念|描述|示例|
|--|--|--|
|常量表达式|常量|"THIS_IS_STRING"、98|
|变量表达式|变量的引用|${{custom_var}}|
|函数表达式|表达式中使用函数|`${{!find(miniappConfig, {"node_tpl": "wx_app"})}}`|
|运算符表达式|表达式中使用运算符|`parameters.isDaily===true、{{parameters.isDaily === true}}、parameters.isDaily===true、{{app.pubext && app.pubext.type && app.pubext.data}}`|
|结果输出表达式|结果输出的引用|`${{stages.stage1.jobs.job1.steps.step1.outputs.result}}`|

- 支持的数据类型：String/Number/Boolean/Array/- Object
- 支持上下文访问
- 支持属性访问
- 支持运算符 + - * / === !== >= <= && ||
- 支持对象、数组、字符串的常用方法

with + Function + Proxy 的方式来实现表达式解释器，从而在实现机制上避免用户代码对其他作用域的访问和篡改。

```js
function sandbox(code, ctx = {}) {
  const ctxWithProxy = new Proxy(ctx, {
    has: (target, prop) => {
      if (!target.hasOwnProperty(prop)) {
        throw new Error(`Invalid expression - ${prop}`);
      }

      return target.hasOwnProperty(prop);
    },
  });

  return new Function("global", `with(global){${code}}`).call(
    ctxWithProxy,
    ctxWithProxy
  );
}

const ctx = { a: 1, b: 2, c: { d: 3 } };

const e = 10;

sandbox(`return a + c.d`, ctx); // 4

sandbox(`return e`, ctx); // Error: Invalid expression - e
```

### 存在的问题
#### 沙箱逃逸
可通过原型链访问，完成沙箱逃逸，从而修改原生方法。

```js
// 修改原生方法
sandbox(`({}).constructor.prototype.toString = () => { console.log('Escape!'); }; ({}).toString();`);

// 跳过 Proxy 限制执行非法代码
sandbox(`new arr.constructor.constructor('while(true){console.log("loop")}')()`, ctx)
```

### 退出进程
可以通过 constructor 访问 process，操作进程。
```js
// 执行 process.exit()
sandbox('var x = this.constructor.constructor("return process")().exit()');
```

### 暴露环境变量
可以通过 constructor 暴露环境变量。

```js
sandbox('var x = this.constructor.constructor("return process.env")()');
```

### 泄漏源码
可以通过 process 泄漏源码。

```js
sandbox('var x = this.constructor.constructor("return process.mainModule.require('fs').readFileSync(process.mainModule.filename,'utf-8')")()');
```

### 执行命令行
可通过 process 执行命令行。
```js
sandbox('var x = this.constructor.constructor("return process.mainModule.require('child_process').execSync('cat /etc/passwd',{encoding:'utf-8'})")()');
```

### DoS 攻击
可通过循环语句 while 等进行 DoS 攻击。

```js
sandbox('while(true){}');
```

### 实现一个解释器
解释器（Interpreter）是一个基于用户输入执行源码的工具；编译器（Compiler）是将源码转换成另一种语言或机器码的工具。

![Alt text](/static/images/noteimage.png)

解释器会解析源码，生成 AST（Abstract Syntax Tree）抽象语法树，逐个迭代并执行 AST 节点。

解释器有四个阶段：
- 词法分析（lexical analysis）
- 语法分析（syntax analysis）
- 语义分析（semantic analysis）
- 执行（evaluating）

![Alt text](/static/images/noteimage-1.png)