export interface Article {
  cover: string;
  title: string;
  date: string;
  description: string;
  id: number;
}

export const articles = [
  {
    cover: "test.png",
    title: "实时追踪上百万个手机是种怎样的体验？",
    date: "2017-07-23",
    description:
      "要实时追踪上百万台手机，是一项非常复杂的工程。那么具体该如何实现？",
    id: 1,
  },
  {
    cover: "test.png",
    title: "Tensorflow.js（一）初探深度学习",
    date: "2021-08-01",
    description:
      "TensorFlow 是一个开源机器学习平台，它最初由谷歌大脑团队的研究员和工程师开发，被广泛用于机器学习领域。而 TensorFlow.js 是使用 JavaScript 进行机器学习开发的库",
    id: 2,
  },
  {
    cover: "test.png",
    title: "Tensorflow.js（二）：深度学习如何在前端发挥作用",
    date: "2022-03-25",
    description:
      "机器学习和深度学习这两个概念非常容易混淆，在开始之前，需要简单介绍一下这两个概念，简单来说，机器学习需要提前设置算法模型进行约束，而深度学习不需要。",
    id: 3,
  },
  {
    cover: "test.png",
    title: "Tensorflow.js（三）：基于 node 使用卷积神经网络进行文本识别",
    date: "2023-04-20",
    description:
      "接着上期，本文将介绍基于 node 环境，通过 tensorflow.js 使用卷积神经网络进行分类任务处理，并将模型迁移至浏览器使用，再开始之前，我们需要再重新回忆一下相关概念。",
    id: 4,
  },
];
