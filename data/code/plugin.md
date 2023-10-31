```ts
// 程序主体，定义程序核心逻辑是增加计算器运算能力
class Calculator {
  plugins = [];
  num = 0;
  constructor(initial: number) {
    this.num = initial;
  }

  use(plugin) {
    this.plugins.push(plugin);
    this[plugin.names] = plugin.calculate.bind(this);
  }

  result() {
    return this.num;
  }
}
// 插件声明
interface Plugin {
  names: string;
  calculate: (num: number) => this;
}
// 插件实现
class AddPlugin {
  names = "add";
  calculate(num: number) {
    this.num = this.num + num;
    return this;
  }
}

class SubtractPlugin {
  names = "subtract";
  calculate(num: number) {
    this.num = this.num - num;
    return this;
  }
}

const myCalculator = new Calculator(5);
// 插件安装
myCalculator.use(new AddPlugin());
myCalculator.use(new SubtractPlugin());

console.log(myCalculator.add(5).subtract(2).result());
```