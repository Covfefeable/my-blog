访问 [vueBasicTensowflow](https://github.com/Covfefeable/vueBasicTensorflow) 获取本次分享的 tensorflow.js demo

## A) 介绍

TensorFlow 是一个开源机器学习平台，它最初由谷歌大脑团队的研究员和工程师开发，被广泛用于机器学习领域。而 TensorFlow.js 是使用 JavaScript 进行机器学习开发的库，有了它，我们可以：

> 在浏览器中开发机器学习模型
> 在nodejs中开发机器学习模型
> 使用现有的机器学习模型
> 对现有的模型进行再训练

机器学习是个很大的课题，短时间内无法详尽地将其介绍到位，所以今天只是通过 Tensorflow.js 对机器学习做一个初步的分享。

需要注意的是，在学习 Tensrdlow 之前，我们需要掌握基本的线性代数知识。

## B) 'tensor' of tensorflow

### 1) 张量的定义

tensor 即张量，如何理解张量？见以下示例：

一阶张量（标量/tf.scalar）：只具有数值大小，而没有方向
二阶张量（矢量/tf.tensor1d）：一维数组，有大小，有方向
三阶张量（矩阵/tf.tensor2d）：二维数组，即矩阵
四阶张量（tf.tensor3d）：三维数组
...

tensorflow.js 提供对张量进行运算的能力，那么张量之间该和运算呢？

### 2) 张量的运算

#### 2.1) 张量与标量的运算

很简单，将该标量与张量的每一个值进行相应运算即可

``` javascript
const x = tf.tensor([[1, 2], [10, 20]]);
const y = tf.scalar(3);
x.add(y).print(); // [[4, 5], [13, 23]]
x.mul(y).print(); // [[3, 6], [30, 60]]
```

#### 2.2) 张量与张量的运算

easy，见示例

```javascript
const x = tf.tensor2d([[1, 2], [3, 4]]);
const y = tf.tensor2d([[2, 3], [4, 5]]);
x.add(y).print(); // [[3, 5], [7, 9]]
x.mul(y).print(); // [[2, 6], [12, 20]]
```

注意！这里的乘法似乎怪怪的，看着不像是当时学习线性代数时的矩阵乘法，当时学习的是：

原来，这里的mul()方法计算得出的是哈达马积，而上图的运算法则是矩阵的点积，点积在 tensorflow.js 里的方法为matMul()；此方法在深度学习中使用的很频繁，应注意区分。

```javascript
const x = tf.tensor2d([[1, 2], [3, 4]]);
const y = tf.tensor2d([[2, 3], [4, 5]]);
x.matMul(y).print(); // [[10, 13], [22, 29]]
```

#### 2.3) 矩阵的转置

矩阵的转置就是将矩阵的所有元素绕着一条从第1行第1列元素出发的右下方45度的射线作镜面反转，即得到矩阵的转置。

![transpose](http://118.195.181.201/imgs/art_1/matrix_transpose.png)

```javascript
const x = tf.tensor2d([[1, 2], [3, 4], [5, 6]]);
x.transpose().print(); // [[1, 3, 5], [2, 4, 6]]  
```

#### 2.4) 单位矩阵

任何矩阵和单位矩阵的点积的结果都是原矩阵本身。单位矩阵就是一个n*n的矩阵，对角线上的元素都是1，其它为0。

我们通过以下代码生成一个单位矩阵

```javascript
tf.oneHot(tf.tensor1d([0, 1, 2], 'int32'), 3).print();

/**
 * Tensor
 *  [[1, 0, 0],
 *   [0, 1, 0],
 *   [0, 0, 1]]
 */

//  tf.oneHot (indices, depth, onValue?, offValue?)

//  Creates a one-hot tf.Tensor. The locations represented by indices take value onValue (defaults to 1), while all other locations take value offValue (defaults to 0). If indices is rank R, the output has rank R+1 with the last axis of size depth.

//  tf.oneHot(tf.tensor1d([0, 1], 'int32'), 3).print();

//  Parameters:
//  indices (tf.Tensor|TypedArray|Array) tf.Tensor of indices with dtype int32.
//  depth (number) The depth of the one hot dimension.
//  onValue (number) A number used to fill in the output when the index matches the location. Optional
//  offValue (number) A number used to fill in the output when the index does not match the location. Optional
//  Returns: tf.Tensor
```

#### 2.4) 矩阵的逆运算

非常容易理解，如果一个矩阵和另一矩阵相乘得到单位矩阵，那么这个矩阵就是该矩阵的逆。而两个矩阵的除法可以理解为一个矩阵和另一个矩阵的逆的点积。

tensorflow.js 至今未提供矩阵逆运算的方法。

#### 2.5) 其他的运算

```javascript
x.mean() // 求均值
x.max() // 求最大值
x.min() // 求最小值
x.sum() // 求总和
// ...
// 还有很多数学方法，如余弦，正切等，不多做介绍
```

## D) 开始正题前，需要先行了解的知识点

这些知识点每一个都可以当成一个课题来做一次单独的分享，不过这里了解一下大致意思即可，暂时不做深入了解。

1.基本机器学习步骤如下：
> 准备训练数据
> 构建一个模型
> 利用训练数据和模型，进行迭代的学习
> 模型训练完毕，用这个模型对新的数据进行预测

2.神经网络

正如我们的人脑一样，在一个层次上和神经网络中有数百万个神经元，这些神经元通过一种称之为突触的结构彼此紧紧相连。它可以通过轴突，将电信号从一个层传递到另一个层。这就是我们人类学习事物的方式。 每当我们看到、听到、感觉和思考时，一个突触（电脉冲）从层次结构中的一个神经元被发射到另一个神经元，这使我们能够从我们出生的那一天起，就开始学习、记住和回忆我们日常生活中的东西。
机器学习中的神经网络也很类似，是一个多层结构的反馈网络，包括输入，输出和隐藏层。每一层由若干个神经元组成。整个网络反馈输出的结果和期望值的差异来进行学习。可以理解网络是一个函数ouput=function(input), 随着网络层次的加深，神经网络可以模拟一个非常复杂的非线性函数，当然学习的成本就更高，因为要学习的参数会随着层数和每一层的神经元的个数增加而增加
> 图中中除了输入层和输出层，还有隐藏层。可以看出，隐藏层不直接接受外界的信号,也不直接向外界发送信号。隐藏层的作用，简单来说就是构造出一个复杂的模型，复杂的程度由隐藏层的层数和各隐藏层神经元的个数决定。因此，当隐藏层层数等于0时，相当于一个最简单的模型——线性或非线性回归模型。

3.激活函数
> 激活函数（Activation functions）对于人工神经网络模型学习、理解非常复杂的非线性的函数来说具有十分重要的作用。它们将非线性特性引入到我们的网络中。引入激活函数是为了增加神经网络模型的非线性。没有激活函数的每层都相当于矩阵相乘。就算你叠加了若干层之后，无非还是个矩阵相乘罢了。
> 如果我们不运用激活函数的话，则输出信号将仅仅是一个简单的线性函数。线性函数一个一级多项式。现如今，线性方程是很容易解决的，但是它们的复杂性有限，并且从数据中学习复杂函数映射的能力更小。一个没有激活函数的神经网络将只不过是一个线性回归模型罢了，它功率有限，并且大多数情况下执行得并不好。我们希望我们的神经网络不仅仅可以学习和计算线性函数，而且还要比这复杂得多。同样是因为没有激活函数，我们的神经网络将无法学习和模拟其他复杂类型的数据，例如图像、视频、音频、语音等。这就是为什么我们要使用人工神经网络技术，诸如深度学习，来理解一些复杂的事情，一些相互之间具有很多隐藏层的非线性问题，而这也可以帮助我们了解复杂的数据。

那么为什么我们需要非线性函数？

绘制非线性函数时它们具有曲率。我们需要的是一个可以学习和表示几乎任何东西的神经网络模型，以及可以将输入映射到输出的任意复杂函数。神经网络被认为是通用函数近似器（Universal Function Approximators）。这意味着他们可以计算和学习任何函数。几乎我们可以想到的任何过程都可以表示为神经网络中的函数计算

4.损失函数
> 损失函数用来评价模型的预测值和真实值不一样的程度，损失函数越好，通常模型的性能越好。不同的模型用的损失函数一般也不一样，我们一般用均方误差来评估损失。

5.优化器
> 有损失就需要优化，在机器学习中，每一次迭代训练总是更趋于模型最优解的方向，即每一次训练后损失在逐步减少，这是优化器在起作用，常见的优化器有很多，我们目前主要使用随机梯度下降（sgd）和adam算法。

## E) 通过机器学习解决线性回归问题

### 1) 什么是线性回归

回顾完基本的线性代数知识，接下来就可以正式开始了。那么什么是线性回归？

#### 1.1) 什么是回归

回归分析是来自统计学的一个概念，它是一种预测性的建模技术，主要研究自变量和因变量之间的关系。通常使用线/曲线来拟合数据点，然后研究如何使曲线到数据点的距离差异最小。例如下图中将数据点拟合一条曲线：

回归分析的目标就是要拟合一条曲线，让数据点到拟合曲线的距离加起来的和是最小的。

#### 1.2) 什么是线性

"线性"="齐次性"+"可加性",
"齐次性"是指类似于: f(ax)=af(x),
"可加性"是指类似于: f(x+y)=f(x)+f(y),

简单来说，就是线用直的（大部分情况下 :D）简单线性回归就是通过一条直线找出自变量与因变量的关系

### 2) 准备训练数据

我们需要在一堆散点中找出线性规律，所以首先要准备一堆散点，在 vueBasicTensorflow 中，/src/utils/genData.js 的 genLinearData() 方法提供了线性的散点，我们可以设置噪点及强度，给训练增加不确定性。

### 3) 构建线性模型并训练

构建模型、训练模型在 tensorflow.js 里面分别有两种实现方式：Core API 和 Layers API，初学这里时困扰了很久，所以说一下笔者的看法，

Layers API 使用了神经网络中“层”的概念构建模型，也即是说，Layers API 封装了一些常用的网络层使我们能更快速地使用，使用它时，我们不必过多注意其他的细节。

Core API 则借助底层的数学运算，手动构建模型和训练模型，属于一般的机器学习范畴。

一般来说，我们始终应当优先使用 Layers API，因为它基于被广泛使用的 Keras API，而后者遵循了最佳实践并降低了认知负担。Layers API 还提供了各种现成的解决方案，如权重初始化、模型序列化、训练监视、概率和安全检查，并且通过 Layers API，我们可以保存或加载模型。如果需要最大程度的灵活性和控制，且不需要序列化或可以实现自己的序列化逻辑，则可以使用 Core API。

本例中使用了 Layers API，因为特征和结果存在单调关系，所以无需添加隐藏层以及设置激活函数。

```javascript
// 定义序贯模型
const model = tf.sequential();

// 添加输入层
model.add(tf.layers.dense({ units: 1, inputShape: [1] })); // 神经元数量为1个

// 设置损失函数和优化器
model.compile({
    loss: tf.losses.meanSquaredError, // 均方误差
    optimizer: tf.train.sgd(0.5) // 学习率需要自己调整
})
const xs = tf.tensor(xs);
const ys = tf.tensor(ys);

// 进行训练
model.fit(xs, ys, {
    batchSize: 32, // 一批次的数量，默认为32
    epochs: 100, // 迭代次数
}).then(()=>{
    const predictValue = model.predict(tf.tensor([...predictXs])); // 训练完成后预测
    console.log(output.dataSync());
    model.save('localstorage://demo-model'); // 保存模型
})
```

简单易懂，训练完之后我们就可以进行预测了。注意：epochs，batchsize 以及学习率是所谓的超参数，西药自己手动调整，以让训练过程达到最高效率。

## F) 通过机器学习解决非线性回归问题

毕竟现实生活中线性回归的实际应用只占少数，比如房价和房屋面积的线性关系等，我们也会遇到很多非线性的回归问题，比如无线电频谱分析等，那么这时该如何利用机器学习来进行预测呢？

我们完全可以通过 Layers API，添加更多的层数和神经元来进行非线性回归，但是在这里我们尝试一下 Core API。代码就不贴在这里了，可以移步至 vueBasicTensowflow /src/views/Core/mathPredictAbs 查看代码。本例通过 Core API 拟合了三次函数的图像。Core API 给我的最直观的感受是，模型由我自己定义（y=ax^3+bx^2+cx+d），机器所要做的只是为常数 a，b，c，d 赋予最合适的值。

另 vueBasicTensowflow 中还包含了正弦函数的图像，以及类贝塞尔函数图像的拟合，均是通过 Core API 实现，如果要使用 Layers API，则需要合适的层，更多的数据集，更长的训练时间才能达到理想的拟合程度。

## G) 总结

退一万步，通过机器学习做一些事情（图像识别，文本识别），就像是依照过往的经验来对未来进行预测，显然这样得到的结论不是普适性的，而且机器没有人的天赋观念，没有理性，所以也就无法通过演绎法推导出任何新的知识。所以机器观察了成千上万的白天鹅，也无法得出世界上有黑天鹅的结论。
另外，经验论存在一个无法回避的问题，就是如何确定感官（数据）是可靠的，比如由于光线的折射，水中鱼的位置并不是其真实的位置，这样会产生偏差。数据集来源于人对自然的观察，而人类的感官对于感知自然具有巨大的局限性。因而机器学习的结果不是必然的，也不是普适性的，真正的AI离我们还很远。
笔者认为，在前端进行机器学习（边缘计算）是一个很棒的想法，但是由于浏览器性能问题，前端更适合直接使用已经训练好的模型，并直接应用。从用户体验上讲，没有人会愿意等待模型训练，他们更喜欢支付宝集五福那样开箱即用的AI。
通过 tensorflow.js 拟合线性函数与非线性函数并看到结果是一件非常令人激动的事。初入门 tensorflow，需要了解很多前置的，跨领域的知识，我在网上搜寻了许久，也没能成功地将 tensorflow.js 进行系统地学习，其官方文档的寥寥几笔的指南显然不够的，google提供的 tfjs-example 对于初学者来说也比较难以理解。总之，通过此篇文章对 Tensorflow.js 有一个初步的，较为系统性的理解，已经是很大的进步，笔者也希望通过日后的深入，让大家对 Tensorflow 有更为全面的理解。


## 参考来源

[tensorflow.js--三种方法用js搭建神经网络实现曲线拟合](https://www.jianshu.com/p/67cd2d2e0bab)
[tensorflow.js 官方文档](https://js.tensorflow.org/api/latest/)
[机器学习中的Bias（偏差）、Error（误差）、Variance（方差）](https://www.zhihu.com/question/27068705)
[tensorflow入门学习，优化器（optimizer）的作用是什么，tensorflow有哪些优化器](https://blog.popkx.com/tensorflow-study-use-of-optimizer-and-optimizers-tensorflow-has/)
