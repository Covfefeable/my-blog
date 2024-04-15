在软件开发的过程中，混淆（Obfuscation）是指将代码转换成功能上等价，但是人类难以阅读和理解的形式，如同自然语言一样，代码的混淆通常会使用不必要的迂回表达式来组成语句，并将变量，函数，类的名称改为无意义的名称以降低可读性。不同语言会因为其特性而易于混淆或难以混淆，本篇以javascript为例。

需要注意的是，压缩与混淆并不是完全相同的概念，压缩工具（如 UglifyJS）通常会删去未被调用的语句，优化抽象语法树使生成的代码其更加精简，或将变量名改为单个字母。其一定程度上降低了代码的可读性，起到了混淆的作用，但是另一方面，其根本目的是缩小代码体积而非混淆。通常来说，混淆会主动增加冗余代码，逻辑迂回，一定程度上会增加代码体积，与压缩是相悖的。所以在很多产品中，想要获得更好的性能表现，安全性就要有所取舍。混淆可以通过人为手动实现或工具自动实现，后者被广泛用于商业化的产品。

## A）抽象语法树

### A1）什么是抽象语法树

我们在编写代码的时候，会用到 eslint，babel 等工具，它们会对代码进行检查或者转换，以 babel 为例，它是如何将 ES6/ES7/ES8 的语法转换为可在node/浏览器中执行的代码呢？这些操作都离不开抽象语法树（AST）。

![analysis-progress](/articles/5/images/analysis-progress.jpg)

在谈到编译器设计时，术语”抽象语法树“（AST）也即语法树(Syntax Tree)，可互换使用。

如上图所示，抽象语法树由解析树（Parse Tree）转换而来。解析树是包含代码所有语法信息的树型结构，它是代码的直接翻译，所以解析树，也被成为具象语法树（Concret Syntax Tree, 简称CST）。而抽象语法树，忽略了一些解析树包含的一些语法信息，剥离掉一些不重要的细节，是解析树的精简版本。

再如上图所示，源代码首先会经过一个词法分析（Lexical analysis）的过程，在这个过程中，代码会被从左到右，自上而下的扫描，将代码拆分为基本的单词或符号，这些东西被传入分词器，被各种标识器（关键字/标识符/常量识/操作符识别器等）所标识，确定这些单词的词性。这一过程的产物是token序列。token一般用<type, value>形似的二元组来表示，type表示一个单词种类，value为属性值，以 **let a = 1** 为例，经过词法分析，会产生如下token序列。

```javascript
<LET, ->
<ID, a>
<OPT, =>
<CONST, 1>
```

这个过程为分词阶段。

分词阶段完成以后，token序列会经过解析器，由解析器识别出序列中的各类词语，然后根据语言的文法规则(Rules of Grammar)输出解析树，这棵树是对代码的树形描述。文法是什么呢？想想学英语的过程中，句子是如何被划分，解构的，比如一个简单的例子：

*CNN is filled with fake news!*

```javascript
<句子> -> <名词短语><动词短语>

<名词短语> -> <形容词><名词>

<动词短语> -> <动词><名词短语>

<形容词> -> fake

<名词> -> CNN | news

<动词> -> filled
```

显而易见，解析树就是这样分析而形成的。对解析树进行修剪，就生成了语法树 --- 这就是AST，对于本篇所讲的混淆技术，这样的简单理解已经足够。

### A2）利用 babel 操作抽象语法树

Note：[AST Explorer](https://astexplorer.net/) 可以让大家对 AST 节点有一个更直观的认识。

Babel 的三个主要处理步骤分别是：**解析（parse），转换（transform），生成（generate）**。

**解析**步骤接收代码并输出 AST。 这个步骤分为两个阶段：即上文提到的词法分析和语法分析。

**转换**步骤接收 AST 并对其进行遍历，在此过程中对节点进行增删改查操作。这是 Babel 或是其他编译器中最复杂的过程。

**生成**步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还可以创建源码映射（source map）。

我们通过如下方式引入：

```javascript
const { parse } = require("@babel/parser");
const { default: traverse } = require('@babel/traverse');
const { default: generate } = require('@babel/generator');
const t = require('@babel/types'); // 包含了构造、验证以及变换 AST 节点的方法
```

引入后，就可以快速生成AST了

```javascript
// 通过 fs 模块读取目标代码文件
let code = fs.readFileSync('./code.js', { encoding: 'utf-8' });

// 解析代码，得到抽象语法树 AST
let AST = parse(code);
```

深度优先遍历语法树，并修改语法树。

```javascript
traverse(AST, {
    // 进入一个节点触发
    enter(path){
        // do something...
        path.replaceWith() // 替换当前节点
    },

    // 离开一个节点触发
    exit(path){
        // do something...
        path.insertBefore() // 在此节点前插入
    }

    // 节点为成员表达式时触发
    MemberExpression(path) {
        // do something...
        path.insertAfter() // 在此节点后插入
    }

    // ...
})
```

根据修改后的语法树，生成新的代码

```javascript
let targetCode = generate(AST);

fs.writeFile('./result.js', targetCode.code, (error) => {
    if (error) console.log(error);
})
```

至此，我们基本了解利用 babel 修操作语法树并生成新的代码的过程。

## B）混淆：逻辑迂回

```javascript
console.log('hello world');
```
逻辑迂回即一句话分三句讲，提高阅读代码的时间成本，要注意的是，必须实现功能等价！那么如何分成多个语句就成了问题，我们需要从字符串入手。

代码是不能随便改的，我们先把字符串参数抽出来：

```javascript
let a = 'hello world'
console.log(a);
```

如果有多个语句，总不能声明一大堆变量出来，需要用一个数组来存储字符串，然后根据数组下标定位字符串。

```javascript
let a = ['hello world', '你好 世界'];
console.log(a[0]);
console.log(a[1]);
```

看起来好多了，不过这非常容易被反混淆脚本还原，用对象来存储会好一些, key值可以任意定义

```javascript
let a = {
    a1: 'hello world',
    a2: '你好 世界'
};
console.log(a.a1);
console.log(a.a2);
```

感觉也没好多少...为什么要这样写呢？

```javascript
let a = {
    a1: 'hello world',
    a2: '你好 世界'
};
console['log'](a['a1']);
console['log'](a['a2']);
```

利用了javascript的语言特性，语句中又出了三个字符串，'log', 'a1/2'又可以提取出来了。很明显，我们的主要思路就是尽可能多的将代码变成字符串形式，再抽离出来。
总之，我们最终得到了类似如下的代码

```javascript
const _originalAggregate = {
  _6c6f67: "log",
  _68656c6c6f20776f726c64: "hello world",
  _4f60597d204e16754c: "\u4F60\u597D \u4E16\u754C"
};

console[_originalAggregate._6c6f67](_originalAggregate._68656c6c6f20776f726c64);

console[_originalAggregate._6c6f67](_originalAggregate._4f60597d204e16754c);
```

另外，数字 1 也可以变成 Number('0x1');

```javascript
let a = 1

// 变换如下，注意，小数不能这样变换！

const _originalAggregate = {
  _307831: "0x1"
};
let a = Number(_originalAggregate._307831);
```

只要能想办法变出字符串，就可以将它抽离出来，甚至我们还可以进一步嵌套混淆。符合文章开头所讲的“迂回”思想。

此时，仅仅两行的代码就已经需要花些时间分辨了

## C）混淆：变量名替换

parser 生成的抽象语法树有一个属性: scope(作用域)，scope.bindings 保存当前作用域下所有定义的变量，scope.bindings[变量名].referencePaths 记录变量被引用的路径(表达式)。

所以我们可以生成随机字符串作为新变量名, 替换scope.bindings, scope.bindings[].referencePaths。

```javascript
function replaceScopeVarsName(path) {
	// 防止重复修改
	if (scopeRecord[path.scope.uid]) return;
	for (let i in path.scope.bindings) {
		let item = path.scope.bindings[i]
		// 变量名应该唯一， 这里用随机字符凑合一下
		let newName = randomString()
		// 替换变量名
		item.identifier.name = newName
		// 替换引用
		item.referencePaths.forEach(function(refItem) {
			refItem.node.name = newName;
		})
	}
	scopeRecord[path.scope.uid] = true
}
```

效果如下：

```javascript
const _originalAggregate = {
  _307831: "0x1",
  _6c6f67: "log"
};

let _$2j = Number(_originalAggregate._307831);

console[_originalAggregate._6c6f67](_$2j);
```

系统函数的替换（console）也是可以的，时间关系，没有实现。

## D）混淆：添加冗余代码

猜猜如下代码会输出什么

```javascript
const _оrigin = {
  _307831: "log",
  _6c6f67: "0x1"
};
const _origin = {
  _307831: "0x1",
  _6c6f67: "log"
};

console[_origin._6c6f67](Number(_origin._307831));
```

Uncaught SyntaxError: Identifier '_origin' has already been declared

我们可以很明显地看到常量 _origin 被声明了两次，这是不被允许的。

结果真的如此吗？

由于俄文的“о”和英文的“o”完全相同，在稍旧版本的 chrome 中，因为同形异义字的存在，地址栏对于 www.sоny.com 和 www.sony.com 的显示完全一样，致使钓鱼网站极难分辨。后 chrome 修复了这个问题。但是控制台内的任何地方，都保持了原样。

我们也可以利用这个技巧来添加少量冗余代码，实现混淆目的。

## E）补充：代码完整性检测-基于代码行数的被动检测技术

在存在反调试逻辑的代码中，实施代码逆向的人员通常会将原始js文件复制到本地，然后删除反调试逻辑相关的代码，之后利用代理工具，在浏览器请求js文件时拦截响应文件，将修改过的js代码覆盖到响应文件，从而实现绕过反调试逻辑。

问题就落在如何检测到js代码被篡改，且检测的代码不会被删除。前些时候的反调试分享中提供了若干完整性检测方案，但都较为复杂，难以实施，代码痕迹明显。最近发现一个可行的，简单的监测方案。

见如下代码

```javascript
try {
    console.xxx('hello');
} catch (err) {
    console.log(err.stack);
}

// ----------------------------------------

// TypeError: console.xxx is not a function
//     at <anonymous>:2:13

```

我们可以获取到错误信息中的**出错行数和列数**

代码在被压缩混淆后，出错代码的行/列信息不会改变，一旦被篡改，该语句的行/列信息必定会变更。

我们可以主动让代码出错，不过我们也准确的知道代码会在哪一行/列出错（AST会提供），如果代码没在预定的行/列出错，那么则表示代码完整性出了问题。据此，我们用最简单的方式完成了代码完整性检测。

如果这段代码被发现了怎么办？---结合同形字混淆一下：

```javascript
try {
    console.lоg('hello'); // TypeError: console.lоg is not a function
} catch (err) {
    if(err.stack.substr(err.stack.indexOf('code.js'), 4) !== '2:13') { // 仅供演示，以实际为准
        _origin = _оrigin; // 虚假的乱序对象覆盖了原始对象，到处都会开始出错
    }
}

```

## F）总结

我们从抽象语法树的层面用代码修改代码，这看起来很酷，在混淆了代码的同时，对 javascript 的语言机制也有了一定的了解。代码混淆包含多个实现方式，逻辑迂回，重命名，添加冗余代码等，每种结合可发挥最大的效果。

但是在手动操作抽象语法树时，务必要注意**针对A处的增删改查是否会影响到B处**，是否会导致B处同样被修改，导致代码不能运行，这需要非常谨慎地修改和检查，利用AST做出一个成熟的工具，是不容易的。

另外，代码混淆与主动的反调试措施有着相同的根本目的，都是为了防止别人了解代码的执行逻辑，但是从策略上讲，两者的达到目的方式很不一样。反调试在于利用多种检测手法在外部构成防御，也就是防止别人接触和调试代码；代码混淆则是从内部改变代码的结构，即使代码被获取和调试，其中的逻辑也不能轻易被探明。在必要场景下，两者结合可以发挥巨大的效用。

## G）参考来源

[CS421 COMPILERS AND INTERPRETERS - Zhong Shao, Yale University](http://flint.cs.yale.edu/cs421/lectureNotes/c04.pdf)

[Leveling Up One’s Parsing Game With ASTs - Vaidehi Joshi](https://medium.com/basecs/leveling-up-ones-parsing-game-with-asts-d7a6fc2400ff)

[使用 Babel 进行抽象语法树操作](https://www.imooc.com/article/289744)

[Babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-lexical-analysis)

[一种基于编译器的的JS混淆及反混淆方案](https://bbs.pediy.com/thread-252454.htm)