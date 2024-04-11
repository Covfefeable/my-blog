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
    date: "2017-08-01",
    description:
      "要实时追踪上百万台手机，是一项非常复杂的工程。那么具体该如何实现？",
    id: 1,
  },
  {
    cover: "test.png",
    title: "Tensorflow.js（一）初探",
    date: "2018-08-01",
    description:
      "Tensorflow.js 是一个用于在浏览器和 Node.js 中训练和部署机器学习模型的库。",
    id: 2,
  },
  {
    cover: "test.png",
    title: "Tensorflow.js（二）",
    date: "2018-08-01",
    description:
      "Tensorflow.js 是一个用于在浏览器和 Node.js 中训练和部署机器学习模型的库。",
    id: 3,
  },
  {
    cover: "test.png",
    title: "Tensorflow.js（三）",
    date: "2018-08-01",
    description:
      "Tensorflow.js 是一个用于在浏览器和 Node.js 中训练和部署机器学习模型的库。",
    id: 3,
  },
];
