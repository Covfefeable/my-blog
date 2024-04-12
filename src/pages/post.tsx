"use client";
import { Layout } from "@/app/layout";
import styles from "./post.module.css";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { articles } from "@/assets/article/config";

export default function Post() {
  const [article, setArticle] = useState("Blog post not found.");
  const [info, setInfo] = useState({
    title: "",
    date: "",
  });
  const getArticle = async () => {
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get("id");
    if (!id) {
      return;
    }
    const res = await fetch(`/articles/${id}/article.md`);
    if (res.status !== 200) {
      return;
    }
    const text = await res.text();
    const html = await marked(text);
    setArticle(html);
  };

  const getArticleInfo = () => {
    if (typeof window === "undefined") {
      return;
    }
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get("id");
    if (!id) {
      return;
    }
    const article = articles.find((i) => i.id === Number(id));
    if (!article) {
      return;
    }
    setInfo({
      title: article.title,
      date: article.date,
    });
  };

  useEffect(() => {
    getArticle();
    getArticleInfo();
  }, []);

  return (
    <Layout showMenu={false}>
      <title>{info.title}</title>
      <section className={styles.articleContainer}>
        <article className={styles.article}>
          <div className={styles.title}>{info.title}</div>
          <div className={styles.date}>2021-08-01</div>
          <div
            dangerouslySetInnerHTML={{ __html: article }}
            className={styles.root}
          />
        </article>
      </section>
    </Layout>
  );
}
