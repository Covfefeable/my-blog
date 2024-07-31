### A) 数据的分类

网站数据抓取一直是一个热门的话题，对收集的数据进行处理，分析也是一个重要的环节。收集到的数据是各种各样的，总体来说，数据可以分为结构化的数据，半结构化数据与非结构化的数据。

##### 结构化数据

结构化数据是指可以用一定的数据结构来表示的数据，比如数据库中的数据，可以用表格来表示，每一行是一条数据，每一列是一个字段。结构化数据的特点是数据的结构是固定的，可以用一定的规则来描述。这样的数据处理起来比较容易，可以用 SQL 语句来查询，也可以用一些工具来进行批量分析。

##### 半结构化数据

半结构化数据是指非关系模型的，数据的结构不是固定的，但是基本可以用一定的规则来描述，比如 XML，HTML，JSON，日志文件等。这样的数据处理起来相对比较困难，需要先通过各种办法解析数据，必要时尽量将其转化为结构化数据，然后再进行处理。

##### 非结构化数据

非结构化数据是指数据的结构不固定，也没有一定的规则来描述，比如图片，视频，音频，文本等。这样的数据处理起来比较困难，有时需要通过深度学习等技术来进行处理。

### B) HTML 正文提取

本次我们主要介绍阅读模式的实现，即 HTML 正文提取，经过上面的介绍，我们知道 HTML 是半结构化数据，它的结构是不固定的，但是有基本的规则可以利用。那么有哪些方案可供我们选择呢？

##### 为每个页面编写模板

这是最简单的方案，但是也是不太可取的方案。因为这样的方案需要为每个页面编写模板，而且模板的维护成本很高，一旦页面发生变化，模板也需要相应的修改。这样的方案不具备通用性，只能针对特定的网站。当且仅当我们只需适配少量的网站时，可以考虑这样的方案。

##### 文本密度

基于文本密度的识别，主要是通过遍历 DOM 节点，计算每个节点的文本密度，当该节点的文本占比大于所有文本的 0.4，即可认为是正文区域，否则继续遍历父节点。

这样的方案比较粗糙，但是也有一些问题，比如当页面中有大量的图片时，图片的文本密度很低，会出现识别不到的情况。

案例：[Just-Read](https://chrome.google.com/webstore/detail/just-read/dgmanlpmmkibanfdgjocnabmcaclkmod)

##### 文本特征

基于文本特征的识别，是根据正文的特征来识别正文，比如：标点符号的数量，文本长度的峰值变化。

这种方案相对好一点，但是对于图片类内容依旧无法识别。

案例：chrome自带的阅读模式（开启方法： 在 chrome://flags 页面搜索 read mode 启动）

##### 权重计算

在文本特征的基础上进行权值计算，使用特征为：标点符号数量、正文长度、正文链接密度。通过对以上特征的加权计算，对于得分加权到父级节点，并赋予祖父节点一半的权值。最后找出权值最高的 dom 节点就是正文节点

案例：Safari 的阅读模式，Safari 的识别算法基于 Readability，但是进行了改进，识别率更高。

### Readability 解析过程介绍

1. 将一些垃圾节点去掉。
```javascript
// 不显示在界面上的节点（“display: none”等）
const _isProbablyVisible = (node) {
    // Have to null-check node.style and node.className.indexOf to deal with SVG and MathML nodes.
    return (!node.style || node.style.display != "none")
      && !node.hasAttribute("hidden")
      //check for "fallback-image" so that wikimedia math images are displayed
      && (!node.hasAttribute("aria-hidden") || node.getAttribute("aria-hidden") != "true" || (node.className && node.className.indexOf && node.className.indexOf("fallback-image") !== -1));
},
if (!this._isProbablyVisible(node)) {
    this.log("Removing hidden node - " + matchString);
    node = this._removeAndGetNext(node);
    continue;
}
```

``` javascript
// 没有任何内容的节点
const _isElementWithoutContent = (node) {
    return node.nodeType === this.ELEMENT_NODE &&
      node.textContent.trim().length == 0 &&
      (node.children.length == 0 ||
       node.children.length == node.getElementsByTagName("br").length + node.getElementsByTagName("hr").length);
}

if ((node.tagName === "DIV" || node.tagName === "SECTION" || node.tagName === "HEADER" ||
    node.tagName === "H1" || node.tagName === "H2" || node.tagName === "H3" ||
    node.tagName === "H4" || node.tagName === "H5" || node.tagName === "H6") &&
    this._isElementWithoutContent(node)) {
        node = this._removeAndGetNext(node);
        continue;
}
```

```javascript
// 去掉不像正文的节点

// unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i

// okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i

if (this.REGEXPS.unlikelyCandidates.test(matchString) &&
    !this.REGEXPS.okMaybeItsACandidate.test(matchString) &&
    !this._hasAncestorTag(node, "table") &&
    !this._hasAncestorTag(node, "code") &&
    node.tagName !== "BODY" &&
    node.tagName !== "A") {
        this.log("Removing unlikely candidate - " + matchString);
        node = this._removeAndGetNext(node);
        continue;
}
// UNLIKELY_ROLES: [ "menu", "menubar", "complementary", "navigation", "alert", "alertdialog", "dialog" ]
if (this.UNLIKELY_ROLES.includes(node.getAttribute("role"))) {
    this.log("Removing content with role " + node.getAttribute("role") + " - " + matchString);
    node = this._removeAndGetNext(node);
    continue;
}
```

```javascript
// "aria-modal = true" and "role = dialog"的节点
// User is not able to see elements applied with both "aria-modal = true" and "role = dialog"
    if (node.getAttribute("aria-modal") == "true" && node.getAttribute("role") == "dialog") {
        node = this._removeAndGetNext(node);
        continue;
    }
```

2. 将内部没有块级元素的 div 转换为 p 标签

```javascript
        if (node.tagName === "DIV") {
          // Put phrasing content into paragraphs.
          var p = null;
          var childNode = node.firstChild;
          while (childNode) {
            var nextSibling = childNode.nextSibling;
            if (this._isPhrasingContent(childNode)) {
              if (p !== null) {
                p.appendChild(childNode);
              } else if (!this._isWhitespace(childNode)) {
                p = doc.createElement("p");
                node.replaceChild(p, childNode);
                p.appendChild(childNode);
              }
            } else if (p !== null) {
              while (p.lastChild && this._isWhitespace(p.lastChild)) {
                p.removeChild(p.lastChild);
              }
              p = null;
            }
            childNode = nextSibling;
          }

          // Sites like http://mobile.slate.com encloses each paragraph with a DIV
          // element. DIVs with only a P element inside and no text content can be
          // safely converted into plain P elements to avoid confusing the scoring
          // algorithm with DIVs with are, in practice, paragraphs.
          if (this._hasSingleTagInsideElement(node, "P") && this._getLinkDensity(node) < 0.25) {
            var newNode = node.children[0];
            node.parentNode.replaceChild(newNode, node);
            node = newNode;
            elementsToScore.push(node);
          } else if (!this._hasChildBlockElement(node)) {
            node = this._setNodeTag(node, "P");
            elementsToScore.push(node);
          }
        }
```

3. 遍历所有段落，并根据内容进行打分
    + 基础分 +1分
    + 根据逗号切分，分出多少段就加多少分
    + 如果段落内字符长度小于 25，不计分
    + 没有父节点的，不计分
    + 逗号分隔，每个逗号 +1分
    + 文本每超过100字，+1分，至少 +3分

4. 它们的父节点会以子节点的分数 * 系数 作为一个基数，系数根据相距级数递减

5. 找出分数最高的节点。最终的分数是当前分数 * 链接密度，链接密度是链接内文本除以总文本长度

6. 如果依旧没有合适节点，就用body，如果有，继续找更合适的，具体为一个包含三个或以上最高候选节点的节点

7. 如果从子到父，分数呈现上升趋势，说明有更多内容待发现（如果没有其他内容，不会呈上升趋势），此时用父节点更合适

更多细节请参考：[readability 源码](https://github.com/mozilla/readability/blob/main/Readability.js)

进过改进和优化，目前的版本识别率比 Readability 更好，但是依然有很多细节需要完善。

##### 存在的问题

1. 对短文本文章的识别率不高

2. 对于纯图片的页面识别率不理想，需要额外适配

3. 对于知乎等网站（一个页面包含多篇文章的页面），识别有误

### 简单实现

```javascript
            if (self !== top) {
                // iframe 不处理
                return false;
            }
            // 在克隆的 document 上操作，避免对原页面造成影响
            const documentClone = document.cloneNode(true);

            // 获取所有的 div，如果div中包含只包含 p 标签，则将这个 div 替换为 p 标签
            // 因为一些文章的内容是被 div 包裹的，这样会干扰算法
            const divs = documentClone.body.getElementsByTagName('div');
            const divsArray = [...divs];
            for (let i = 0; i < divsArray.length; i++) {
                const div = divsArray[i];
                if (div.children.length >= 1 && div.getElementsByTagName('p').length === div.children.length) {
                    const p = documentClone.createElement('p');
                    p.innerHTML = div.innerHTML;
                    div.parentElement.replaceChild(p, div);
                }
            }

            let candidateNode = {
                score: 0
            };
            let nodes = []
            const pNodes = documentClone.body.getElementsByTagName('p');
            nodes = [...pNodes]
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                let score = 1;
                const text = node.innerText;

                // text 中的中文标点越多，加分越多，但是标点符号不能连续
                score += text.split(/：|。|；|，|,|\.|\?|”/).length;

                // 如果 text 的长度超过 200，则额外加分
                score += Math.max(Math.floor(text.length / 100), 2);

                // 如果 text 的长度小于等于10，则减分
                score -= text.length <= 10 ? 1 : 0;

                typeof node.score !== 'number' && (node.score = 0);
                node.score += score;

                node.setAttribute('score', node.score);
                node.score > candidateNode.score && (candidateNode = node);
                let index = 0;
                let tempNode = node.parentElement;
                while (tempNode && tempNode.tagName !== 'BODY') {
                    if (/div|article|section/i.test(tempNode.tagName)) {
                        typeof tempNode.score !== 'number' && (tempNode.score = 0);
                        // 子节点的权重会向上影响父节点，但是权重会衰减
                        tempNode.score += score / (index < 2 ? index + 2 : index * 3);
        
                        // 如果 tempNode 的子节点中有 img 标签，且img宽度大于 300，则加分
                        if (tempNode.getElementsByTagName('img').length > 0) {
                            const imgs = tempNode.getElementsByTagName('img');
                            for (let j = 0; j < imgs.length; j++) {
                                const img = imgs[j];
                                if (img.naturalWidth > 300) {
                                    tempNode.score += 5;
                                }
                            }
                        }

                        tempNode.setAttribute('score', tempNode.score);
                        tempNode.score > candidateNode.score && (candidateNode = tempNode);
                        if (++index >= 3) {
                            break;
                        }
                    }
                    tempNode = tempNode.parentElement?.cloneNode(true);
                }
            }
            return {
                time: '',
                cover: '',
                url: documentClone.URL.startsWith('http') ? documentClone.URL : location.href,
                article: candidateNode,
                title: documentClone.title ? documentClone.title.replace(/(.*)[|\-\\/>\u00bb] .*/gi, '$1') : ''
            };
```

### 参考来源

1. [Readability](https://github.com/mozilla/readability/blob/49d345a455da1f4aa93f8b41e0f50422f9959c7c/Readability.js#L2225)