"use client";

import { Article, articles } from "@/assets/article/config";
import BlogPostCard from "@/components/blog-post-card";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";

export default function Posts() {
  const { t } = useTranslation();
  const articlesCopy: Article[] = [...articles].reverse();

  return (
    <main className={styles.postsContainer}>
      <h1 className={styles.title}>{t("posts.all")}</h1>
      
      <div className={styles.postsGrid}>
        {articlesCopy.map((article) => (
          <BlogPostCard
            key={article.id}
            id={article.id}
            title={article.title}
            date={article.date}
            description={article.description}
          />
        ))}
      </div>
    </main>
  );
}
