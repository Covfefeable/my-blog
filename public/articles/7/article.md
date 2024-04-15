## A) 背景

在某些金融行业的系统中，一些敏感数据会经过加密传输，到达浏览器端再进行解密。为防止代码逻辑被外部用户轻易知晓，从而使信息解密被脚本化，这些系统通常都含有一些反调试逻辑；再如文库网站，课程学习网站，为防止用户复制粘贴，或者随意调整课程视频播放速度，代码中或多或少也添加了反调试逻辑。最近查找了相关资料，发现相关文章或话题甚少，即便找到了，这些文章也只是提供了一套千篇一律的代码。现在浏览器更新迭代非常快，这些代码也理所当然地不起作用了。

从逆向代码的人的角度来讲，前端基本算是无秘密，借助一些工具，去掉反调试逻辑只是时间问题，再美化一下混淆的代码，虽然可读性较差，但是借助浏览器自带的devtools逐步调试，摸清基本逻辑是没问题的。但是这并不能说明前端做反调试是无用功，根据系统的信息敏感程度，我们可以逐级调整反调试逻辑的严密程度，相关手段其实是非常多的，只是必要与否的问题。

## B) anti-debug 思路

> 检测未预期的执行环境（我们只希望在浏览器中执行）
> 检测调试工具是否打开（比如浏览器的devtools）
> 代码完整性检测
> 程序流完整性检测
> 反模拟

目前可行的主要思路就是将混淆技术和加密学结合起来，代码可以被加密成一个个代码块，后一个代码块的解密依赖于前一个已经解密的代码块，正常的程序流是根据既定序列从一个代码块链式调用下一个代码块，当我们发现异常时，程序流改变其原来的既定序列，而跳转到假的代码块。

## C）一些方法和手段

### 1）函数重定义

这是最广泛使用的，且最被人所知的防止自己的代码被调试的方法。我们可以将提取信息的相关函数重新定义，比如console.log()，这会将变量等信息打印在控制台中。我们可以尝试讲其重定义。防止信息被提取。

```javascript
function redefineConsole() {
    // 重定义 console.log
    let originalConsLog = window['console']['log'];
    let reDefineConsLog = (argu) => {
        if(Array.isArray(argu) && argu.indexOf('test') > -1){
            originalConsLog(argu);
        } else {
            originalConsLog(undefined);
            // originalConsLog('%canti-debug activited', 'color: #6076ff;');
        }
    }
    window['console']['log'] = reDefineConsLog;
    window['console']['info'] = reDefineConsLog;
    window['console']['warn'] = reDefineConsLog;
    // console.error() 没有重定义，防止翻车
}
```

如此一来，当别人在控制台试图打印一些东西时，就只会出现 undefined，这在一开始会他造成非常大的困扰和疑惑 :）

### 2）断点

同样，这也是一个广泛用于反调试逻辑的东西，也是网上最多的。debugger 被用于调试代码，当代码执行到这一行时会暂停，我们得以观察到什么已经发生了，什么还没发生。
值得注意的是，当且仅当控制台已经打开时执行到debugger，代码就才会暂停执行，只有手动跳过才可以让代码继续执行。

```javascript
setTimeout(() => {while (true) {eval("debugger")}},100)
```

将上面这个无限循环加入代码，当控制台被打开时，就会无限跳出debugger，非常烦人。

### 3）devtools检测：时间差异

经典的基于时间的反逆向技术，一段代码正常执行，与打开调试器执行，花费的总时间是不一样的。所以通过计算一段代码执行的时间，我们就可以获知是否有人正在调试代码。

```javascript
function isDevToolOpend() {
    // debugger 只会在 devtools 打开后生效，而手动跳过 debugger 需要的时间大于100ms，如此可以判定 devtools 已经打开
    let prev = new Date().getTime();
    eval(String.fromCharCode(...dic.s2)); // debugger
    let after = new Date().getTime();
    return after - prev > 100;
}
```

见如上代码，正常执行时，总时间小于100ms，而打开控制台，必须要手动跳过断点，所以执行时间一定会大于100ms。据此可以推断是否打开了devtools。

### 4）devtools检测：尺寸变更

如果devtools被打开，那么窗口的大小会发生改变，看下面两组 API:

```javascript
window.innerWidth // 返回窗口的文档显示区的宽度
window.innerHeight // 返回窗口的文档显示区的高度

window.outerWidth // 返回一个窗口的外部宽度，包括所有界面元素（如工具栏/滚动条）
window.outerHeight // 返回一个窗口的外部高度，包括所有界面元素（如工具栏/滚动条）
```

当我们打开devtools时，window.innerWidth，window.innerHeight 会发生改变，而 window.outerWidth，window.outerHeight则不会，依据尺寸的变更，我们可以判断devtools是否已近打开，还可以判断devtools在哪一侧打开。

```javascript
const threshold = 160;
const widthThreshold = window.outerWidth - window.innerWidth > threshold;
const heightThreshold = window.outerHeight - window.innerHeight > threshold;
const orientation = widthThreshold ? 'vertical' : 'horizontal';
```

这种方法非常正规，在绝大多数浏览器上都可以正常工作，不过当调试窗口与浏览器分离开之后，这个方法就会失效。

### 5）devtools检测：sourcemap

代码发布到线上之前都会被处理，一般都有如下步骤：

> 压缩混淆，减小体积
> 多个文件合并，减少HTTP请求数
> 通过编译或者转译，将其他语言编译成JavaScript

这三个步骤，都使得实际运行的代码不同于开发代码，不管是 debug 还是分析线上的报错，都会变得非常困难。而解决这个问题的方法，就是使用sourceMap。简单说，sourceMap就是一个文件，里面储存着转换后代码的位置和对应的转换前的位置。

SourceMappingURL可以获取Javascript资源的sourcemap。它将压缩/混淆的Javascript代码映射到其原始代码，从而使开发人员可以在浏览器中轻松调试其代码，而不必调试压缩/混淆后的代码，是个古老又有点酷的功能！

任何script标签包含如下注释的脚本标记，将使浏览器向其发送请求。

```javascript
//# SourceMappingURL=https://www.my-website.com/map.json
```

值得注意的是，仅在打开浏览器的devtools时才会激活SourceMappingURL功能，请求时，network或console面板中都看不到任何东西，只有当使用代理时（例如fiddler，wireshark或是BurpSuite），或是在Chrome浏览器的chrome://net-export中查找请求。总之，Javascript无法捕获对此请求的响应，因为它是由浏览器本身处理的。
所以这种行为是完全隐蔽的，我们可以在浏览器执行javascript时从浏览器中获取任何类型的动态信息。比如可以窃取Cookie，报告时间戳以及其他任何类型的信息，并将其添加到SourceMappingURL中以进行发送。很强大！见以下PoC：

```html
<html>
    <head>
        <script>
            function  smap(url)  {
                const script = document.createElement('script');
                script.textContent =  `//# sourceMappingURL=${url}`;
                document.head.appendChild(script);
                script.remove();  // 很牛逼! script 标签甚至都不用留在 DOM 中
            }
            smap('http://test/devtools.php'); // <?php setcookie("DevTools", "True"); ?>
        </script>
        <script>
            function getCookieValue(a) {
                var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
                return b ? b.pop() : '';
            }

            setInterval( () => { 
                if (getCookieValue("DevTools") == "True") {
                    alert("DevTools opened!");
                }
            }, 100);
        </script>
    </head>
    <body>
        <h1>devtools检测：SourceMappingURL</h1>
    </body>
 </html>
```

### 6）隐式流完整性控制

我们可以通过堆栈跟踪判断原始执行顺序。
通过使用arguments.callee.caller，就可以创建堆栈跟踪，以保存先前执行的函数。然后可以借此来生成哈希，该哈希值可用于生成用于解密JavaScript其他部分代码块的密钥。这样我们就可以对流完整性进行隐式控制，因为如果执行的顺序稍有不同，则创建的哈希将完全不同。如果哈希不同，则生成的密钥也将不同。而密钥不同，就无法解密代码。看这个示例：

```javascript
function getCallStack() {
    var stack = "#", total = 0, fn = arguments.callee;
    while ( (fn = fn.caller) ) {
        stack = stack + "" +fn.name;
        total++
    }
    return stack
}
function test1() {
    console.log(getCallStack());
}
function test2() {
    test1();
}
function test3() {
    test2();
}
function test4() {
    test3();
}
test4(); // #test1test2test3test4
```

执行此代码时，会看到字符串'#test1test2test3test4'，如果我们修改任何函数的名称，或者变更执行顺序，返回的字符串就会变化。通过该字符串我们可以计算哈希，然后将其用作种子，以得出用于解密其他代码块的密钥。如果由于密钥无效而无法解密下一个代码块，则可以捕获异常并将程序流重定向到虚假路径。

如何知道某个函数的代码是否被修改？我们计算函数或代码块的哈希值，并将其与已知的值进行比较。但是这种方法其实很不优雅。如果使用堆栈跟踪中的相同策略。计算代码块的哈希值，并将其用作解密其他代码块的密钥，看起来就没那么蠢了。

为了创建隐式流完整性控制，最好的想法是使用md5碰撞。就是在函数内部检测自己的 md5。为了在函数内部执行检查，可以创建如下的函数。

```javascript
function（）{if(md5(arguments.callee.toString()==='<md5>')code_function;}
```

PoC详见：https://gist.github.com/cgvwzq/c70901dc46aeb8a3d70dc70177428a30

### 7）限制环境

我们还可以尝试检测代码是否在正确的环境中执行。我们所谓的“正确的环境”是：

代码在浏览器执行（不是模拟器，不是NodeJS等）
代码正在目标域/资源中执行（不是本地服务器）

给个简单的例子：

```javascript
// 很不优雅
if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
    console.log("环境非法")
}
```

按照这个思路，另一个方法是检测用来打开文档的 handler（类似于 if（location.protocol == 'file:'）{…}），或者尝试通过 HTTP 请求检测其他资源（图像、css 等）是否可用。当然，所有这些方法都非常容易被绕过。
我们可以设法检测只存在于浏览器上下文中的对象：

```javascript
//NodeJS下： 
try { .. console.log ( window ) ; } catch ( e ) { .. console.log ( "NodeJS detected!!!!" ) ; }
```

反之亦然：在 NodeJS 中，有一些对象也是浏览器上下文所不具备的。

```javascript
//浏览器下： 
console.log ( global ) // VM104:1 Uncaught ReferenceError: global is not defined at :1:13
```

### 9）未实现的语法

用于调试JavaScript代码的大多数工具（JSDetox，JSUnpack等）都使用旧的引擎，因此我们可以使用最新实现的怪异语法来破坏解析器。例如，指数运算符（**）不能被JSUnpack（SyntaxError：Missing）和JSDetox（Unexpected token *）解析。
与语法有关的另一个技巧是使用解构赋值来设置值。 例如，一个简单的window.top.location ='JavaScript：alert（1337）'可以表示为`[[{0：top [（0）.toString.call（477066499943,30）]}] = [['JavaScript ：alert（1337）']]。 旧的解析器执行到这里会终止:)。 

### 9）反模拟：WebGL

使用 WebGL 处理数据并与 JavaScript 交互：如果有人试图 "模拟" 我们的 JavaScript 代码时，他就需要为其模拟器提供 WebGL 支持。
可以实现一个简单的算法（例如多色图形）来创建基于各种"种子"（seed）的图像，然后在预定位置提取像素的值，并将其用作密钥来解密代码块。当然这只是一个想法而已。

## 总结

通过五个主要的思路（检测环境，检测调试工具，检测代码完整性，检测流完整性，反模拟），我们其实已经可以在绝大多数场景下劝退试图逆向的人，上面介绍的方法也可以共同作用，来达到更好的效果。如果必要，我们可以将上述生成的哈希值混合一些变量，作为每次请求的参数，如果发现任何异常，由服务端进行处理（包含但不限于返回虚假信息，一定时间内拒绝访问等），这样则会使调试变得更加艰难，同时也需要更加严谨地使用。

## 参考来源

>[JavaScript AntiDebugging Tricks](https://x-c3ll.github.io/posts/javascript-antidebugging/)

>[Abusing SourceMappingURL feature to create one of the strongest Cross Browsers Javascript Anti Debugging techniques](https://weizman.github.io/?javascript-anti-debugging-some-next-level-shit-part-1)

>[Anti Debugging Mechanism Full Example](https://us-central1-smap-251411.cloudfunctions.net/scenario)

>[基于浏览器窗口变更的 devtools 检测](https://github.com/sindresorhus/devtools-detect)

>[How I made two PHP files with the same MD5 hash](https://natmchugh.blogspot.com/2014/10/how-i-made-two-php-files-with-same-md5.html)