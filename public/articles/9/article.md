在上一期介绍完卷积神经网络，以及见识到卷积神经网络在图像识别领域的强大之处之后，想必大家对深度学习所能做的其他事情会比较感兴趣。那么，这一期我们就来看看深度学习在自然语言处理领域的应用。自然语言处理是人工智能领域的一个重要方向，它涉及到计算机对人类语言的理解和生成。自然语言处理的应用非常广泛，包括机器翻译、语音识别、情感分析、文本分类等等。今天我们通过使用 LSTM 网络来实现一个文本情感分类器，来看看深度学习在自然语言处理领域的应用。

## A) 回顾

关于 TensorFlow 的基本概念，我们在之前的文章中已经介绍过了，这里就不再赘述。如果你还不了解 TensorFlow，可以参考之前的文章。点击这里查看：[TensorFlow 往期](/post?id=4)。

## B) 文本情感分类

### 1. 我们如何理解文本？

人类不会每时每刻都从头开始思考，当你阅读这篇文章时，你会根据对前面内容的理解来理解后面的内容，而不是时刻都重新理解整篇文章。换句话说，人的思维具有持久性，显然，这种持久性来源于记忆。

而传统的神经网络并不能做到这一点，这是一个明显的缺点，比如，当我们用传统的神经网络来对电影中的每个情节进行分类时，它如何以前面的情节为基础来理解后面的情节？或许大概率做不到。

### 2. 循环神经网络（RNN）

循环神经网络的出现就是为了解决这个问题，它是带有循环的神经网络，允许信息在网络中持续传递，持久存在。这样，网络就可以根据之前的信息来理解后面的信息。

<img src="/articles/9/images/RNN-rolled.png" width='100' style='display: block;margin: 0 auto;' />

上图是一个简单的循环神经网络 A，输入Xt并输出值Ht，循环允许信息在网络中持续传递。看起来有点难以理解，但其实它和普通的神经网络并没有什么不同，它可以被理解成被复制了多份的神经网络，每个神经网络传递信息给下一个神经网络。展开来看，就是下面这个样子：

<img src="/articles/9/images/RNN-unrolled.png" width='600' style='display: block;margin: 0 auto;' />

下面这个动态图示会让人更容易理解：

<img src="/articles/9/images/rnn-dy.gif" width='800' style='display: block;margin: 0 auto;' />

上一个神经网络的输出会作为下一个神经网络的输入，

<img src="/articles/9/images/rnn-pass.gif" width='600' style='display: block;margin: 0 auto;' />

那么每个 RNN 单元是如何工作的呢？我们可以看到，RNN 单元有两个输入，一个是输入值 Xt，另一个是上一个 RNN 单元的输出值 Ht-1，然后通过一个激活函数（通常是 tanh 函数）来计算当前的输出值 Ht。

<img src="/articles/9/images/rnn-work-dy.gif" width='600' style='display: block;margin: 0 auto;' />

这种链状的结构就已经揭示了循环神经网络与处理序列数据密切相关，在过去，循环神经网络在语音识别、自然语言处理等领域已经取得了很大的成功。虽然现在已经发展出了更好的架构，但循环神经网络仍然是一个很好的起点。

而 LSTM（Long Short-Term Memory）是一种特殊的循环神经网络，对于很多任务来说，它的效果要比普通的循环神经网络好很多。

### 3. RNN 在处理长期依赖上的问题

RNN 最大的特点就是能将先前的信息与当前任务联系起来，例如使用先前的句子来理解当前的句子，但是 RNN 真的能很好地完成这个任务吗？

有时，我们只需要当前任务附近的信息，比如一个语言模型，根据之前的单词来预测下一个单词，当我们预测 “我出生在中国，我会说__” 时，我们不需要任何更深层次的上下文，很明显下一个单词是 “中文”。在这种情况下，当相关的信息与当前所需信息之间的距离很小时，RNN 可以较好的完成任务。

<img src="/articles/9/images/RNN-shorttermdepdencies.png" width='400' style='display: block;margin: 0 auto;' />

但在另一种情况下，依然是语言模型，当我们预测 “我出生在中国 ... 此处省略100字 ...，我会说流利的__”，最近的信息表明，下一个词大概率是一种语言，但是是何种语言，我们要追溯到 100 个字之前的上下文，这时相关信息与需要的信息点之间的距离就变得很大了，在这种情况下，RNN 无法学习到这种长期依赖。

<img src="/articles/9/images/RNN-longtermdependencies.png" width='400' style='display: block;margin: 0 auto;' />

### 4. 长短期记忆网络（LSTM）

长短期记忆网络（通常简称为“LSTM”）是一种特殊的 RNN，能够学习长期依赖性。并在后续的时间里被许多人完善和推广。它们在解决各种各样的问题上都表现得非常好，并且现在被广泛使用。LSTM 设计的初衷就是为了避免长期依赖问题。记住长期依赖是这种神经网络的默认行为。

所有的循环神经网络都具有重复神经网络模块的链式形式。在标准 RNN 中，这个重复的模块只有一个非常简单的结构，比如一个 tanh 层。

<img src="/articles/9/images/LSTM3-SimpleRNN.png" width='600' style='display: block;margin: 0 auto;' />

LSTM 也有这样的链式结构，但是重复的模块有一个不同的结构。不同于单一神经网络层，这个模块有四个神经网络层。

<img src="/articles/9/images/LSTM3-chain.png" width='600' style='display: block;margin: 0 auto;' />

有点复杂，但是我们可以一步一步来理解。

#### a. LSTM 的核心思想

LSTM 的关键是单元状态，即穿过图顶部的水平线。细胞状态有点像传送带。它直接沿着整个链条运行，只有一些较小的线性相互作用。信息很容易不加改变地流动。

<img src="/articles/9/images/LSTM3-C-line.png" width='600' style='display: block;margin: 0 auto;' />

LSTM 也能向细胞状态删除或添加信息，由称为“门”的结构调节。门是一种选择性地让信息通过的方式。它们由 sigmoid 层和逐点乘法运算组成。

<img src="/articles/9/images/LSTM3-gate.png" width='100' style='display: block;margin: 0 auto;' />

sigmoid 层输出 0 到 1 之间的数字，描述每个组件应该有多少通过。值为0意味着不让任何东西通过，而值1意味着让所有东西通过。

LSTM 具有三个这样的门，用于保护和控制单元状态。

#### b. LSTM 的工作原理

LSTM 的第一步是决定我们要从细胞状态中遗忘哪些信息。这个决定是由称为“遗忘门”的 sigmoid 层做出的。它根据 Ht-1 和 Xt进行运算，并输出一个介于0和1的值，对于细胞状态的 Ct-1。1 代表“完全保留这个”，而0代表“彻底忘记这个”。

举个例子，在一个语言模型中，当我们使用代词 “他” 时，遇到了一个新的主语 “这个女孩”，我们就需要遗忘 “他” 的信息。

<img src="/articles/9/images/LSTM3-focus-f.png" width='600' style='display: block;margin: 0 auto;' />

<img src="/articles/9/images/forget-gate-dy.gif" width='600' style='display: block;margin: 0 auto;' />

LSTM 的第二步是决定我们要在细胞状态中存储哪些新的信息。这分为两个部分。首先，一个称为“输入门”的 sigmoid 层决定哪些值将要被更新。接着 tanh 层创建一个新的候选值向量 C̃t。在下一步中，我们将把这两个值结合起来，以更新细胞状态。

依旧是上面的例子，当我们遇到了新的主语 “这个女孩”，我们就需要存储 “这个女孩” 的信息，并在之后转而使用代词 “她”。

<img src="/articles/9/images/LSTM3-focus-i.png" width='600' style='display: block;margin: 0 auto;' />

<img src="/articles/9/images/input-gate-dy.gif" width='600' style='display: block;margin: 0 auto;' />

现在就可以更新旧的细胞状态了，从Ct-1进入新的细胞状态Ct。图示步骤已经决定了要做什么。

我们将旧状态乘以Ft，遗忘之前决定忘记的事情。然后加上新的候选值 t*C̃t，根据想要更新的程度进行调整。

在上面的例子中，我们会在此处实际删除有关旧主语的性别信息并添加新主语的性别信息。

<img src="/articles/9/images/LSTM3-focus-C.png" width='600' style='display: block;margin: 0 auto;' />

<img src="/articles/9/images/update-cell-dy.gif" width='600' style='display: block;margin: 0 auto;' />

最后一步就需要决定要输出什么。输出值基于细胞状态，但会被过滤处理。首先进过一个 sigmoid 层，它决定我们要输出细胞状态的哪些部分。然后，我们将细胞状态通过tanh（将值收敛到-1到1）并将其乘以 sigmoid 门的输出，这样就实现只输出我们决定输出的部分。

## C) 使用 LSTM 实现文本情感分类

到这里，我们已经基本介绍完 LSTM 的基本工作原理，现在我们将通过 nodejs 使用 LSTM 来实现一个文本情感分类功能，用于对股票评论进行情感分类。我们将使用 TensorFlow.js 来实现这个分类器。

### 1. 数据集

笔者抓取了2024年3月8日到2024年5月17日关于上证指数的评论，并使用大模型进行了批量的情感标注，标注结果为 0（负面）和 1（正面）。得到足够的有效数据。

### 2. 数据预处理

进行训练之前，我们需要对数据进行预处理，比如分词。在本案例中，我们使用了 ``` "segment": "^0.1.3" ``` 来对评论进行分词，当然 jieba 也是一个不错的选择，分词结束后，我们可以得到分完词的二维数组，我们设置每个评论的长度为 20，不足 20 的评论用 “” 填充。

```javascript
[
    ["逃命", "吧", "，", "兄弟", "们", "", ...],
    ["反弹", "都是", "卖点", "", "", ...],
]
```

接下来我们要生成词表，将每个词映射到一个整数，这样我们就可以将评论转换为一个整数数组，方便输入到神经网络中。

```javascript
// 词表示例
{"秩":6548,"严惩":6549,"普通人":6550,"上策":6551}
```

然后我们将评论转换为整数数组，不足 20 的评论用 0 填充。

```javascript
[
    [6548, 6549, 2345, 0, 0, ...],
    [6550, 6551, 654, 0, 0, ...],
]
```

### 3. 词嵌入

词嵌入技术是将词映射到连续的向量空间中，使得语义上相近的词在向量空间中的距离也相近，从而能够更好地捕捉词与词之间的语义关系。这种映射通常是通过训练神经网络模型在大量文本数据上进行学习得到的。

<img src="/articles/9/images/word-embedding.png" width='600' style='display: block;margin: 0 auto;' />

在 LSTM 网络中，我们需要将整数数组转换为词嵌入，词嵌入是一个维度较低的向量，它可以表示一个词的语义信息。在 TensorFlow.js 中，我们可以使用 ```tf.layers.embedding``` 来实现词嵌入。


```javascript
  model.add(
    tf.layers.embedding({
      inputDim: wordSet.length,
      outputDim: 128,
      inputLength: config.maxWordNum,
    })
  );
```

### 4. 添加 LSTM 层以及全连接层

然后添加 LSTM 层，这里我们使用了两层 LSTM 和 dropout 层，dropout 层可以防止过拟合。可以适当加入卷积层，以提高模型的性能。

```javascript
  model.add(
    tf.layers.lstm({
      units: 128,
      returnSequences: true,
    })
  );

  model.add(
    tf.layers.dropout({
      rate: 0.1,
    })
  );

  model.add(
    tf.layers.lstm({
      units: 128,
      returnSequences: false,
    })
  );
```

最后添加全连接层，用于输出分类结果。

```javascript
  model.add(tf.layers.dense({ units: 2, activation: "softmax" }));
```


### 5. 超参数的设置与训练

损失函数我们使用交叉熵损失函数，优化器使用 Adam 优化器。

```javascript
  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: "adam",
    metrics: ["accuracy"],
  });
```

模型描述如下：

```
__________________________________________________________________________________________
Layer (type)                Input Shape               Output shape              Param #   
==========================================================================================
embedding_Embedding1 (Embed [[null,20]]               [null,20,128]             1289856
__________________________________________________________________________________________
conv1d_Conv1D1 (Conv1D)     [[null,20,128]]           [null,18,128]             49280
__________________________________________________________________________________________
max_pooling1d_MaxPooling1D1 [[null,18,128]]           [null,9,128]              0
__________________________________________________________________________________________
conv1d_Conv1D2 (Conv1D)     [[null,9,128]]            [null,7,128]              49280
__________________________________________________________________________________________
max_pooling1d_MaxPooling1D2 [[null,7,128]]            [null,3,128]              0
__________________________________________________________________________________________
lstm_LSTM1 (LSTM)           [[null,3,128]]            [null,3,128]              131584
__________________________________________________________________________________________
bidirectional_Bidirectional [[null,3,128]]            [null,3,256]              263168
__________________________________________________________________________________________
dropout_Dropout1 (Dropout)  [[null,3,256]]            [null,3,256]              0
__________________________________________________________________________________________
lstm_LSTM3 (LSTM)           [[null,3,256]]            [null,128]                197120
__________________________________________________________________________________________
dense_Dense1 (Dense)        [[null,128]]              [null,2]                  258
==========================================================================================
Total params: 1980546
Trainable params: 1980546
Non-trainable params: 0
__________________________________________________________________________________________
```

可见，该模型有 1980546 个参数，属于中等规模的模型。

接下来就是训练模型了，我们将预处理好的数据输入到模型中进行训练，由于 nodejs 以及性能问题的限制，为防止内存溢出，我们取了8000条数据进行训练，并使用300条数据进行测试。

```
Epoch 1 / 50
eta=0.0 ================================================================>
27320ms 3415us/step - acc=0.733 loss=0.550
currectCount: 243, wrongCount: 57， accuracy: 0.81
Epoch 2 / 50
eta=0.0 ================================================================>
27089ms 3386us/step - acc=0.857 loss=0.357
currectCount: 248, wrongCount: 52， accuracy: 0.8266666666666667
Epoch 3 / 50
eta=0.0 ================================================================>
27693ms 3462us/step - acc=0.925 loss=0.210
currectCount: 233, wrongCount: 67， accuracy: 0.7766666666666666
Epoch 4 / 50
eta=0.0 ================================================================>
27607ms 3451us/step - acc=0.956 loss=0.133
currectCount: 247, wrongCount: 53， accuracy: 0.8233333333333334
Epoch 5 / 50
eta=0.0 ================================================================>
27891ms 3486us/step - acc=0.972 loss=0.0860
currectCount: 246, wrongCount: 54， accuracy: 0.82
```

可以看到，模型在训练集上的准确率达到了 97.2%，在测试集上的准确率达到了 82%。在较少的训练集的情况下，这样的效果还算不错。

## D) LSTM 在前端的应用

理论上，任何基于序列的任务都可以使用 LSTM 来解决，比较通用的应用有：文本生成、分类任务、机器翻译、语音识别等，这些可以在前端通过 TensorFlow.js 独立实现而不需要服务端的支持。

另外，或许我们可以记录用户的鼠标或键盘的时序行为，来判断用户的行为是否正常，而不是总是弹出一个验证码。

再或者，我们可以收集大量的日志数据（如 nginx 的 access.log），并标注正常和异常的请求，然后进行训练，来实现一个异常请求分类器，来阻塞恶意请求。

## E) LSTM 与 Transformer

这两种架构都用于处理数据序列。LSTM 按顺序处理数据，一次处理一部分。其记忆单元可以在整个序列中携带信息，以克服短期记忆问题。适合特别关注序列顺序的任务，例如时间序列预测；而 Transformer 会立即处理整个序列，而不是按顺序处理。使用注意力机制来权衡输入数据不同部分的重要性。适合需要理解整个序列上下文的任务，例如语言翻译。

举个例子，LSTM 或 RNN 就像一页一页地阅读一本书，LSTM 会记住整个情节，而 RNN 会忘记一些情节，而 Transformer 就像扫描整本书并立即理解所有内容。

至于选择哪一个模型取决于具体任务、数据集特征和计算资源。他们都在不同的应用中都非常有效，但 Transformer 在管理大规模数据和捕获复杂关系的能力通常使其在许多现代 NLP 任务中具有优势。

## E) 参考来源

- [Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)
- [Illustrated Guide to LSTM’s and GRU’s: A step by step explanation](https://towardsdatascience.com/illustrated-guide-to-lstms-and-gru-s-a-step-by-step-explanation-44e9eb85bf21)
- [TensorFlow.js](https://www.tensorflow.org/js)