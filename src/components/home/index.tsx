import { Article, articles } from "@/assets/article/config";
import styles from "./index.module.css";
import BlogPostCard from "@/components/blog-post-card";
import { Trans, useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const articlesCopy: Article[] = JSON.parse(JSON.stringify(articles)).reverse();

  return (
    <main>
      <section className={styles.aboutContent}>
        <p className={styles.intro}>{t("home.role")}</p>
        <p className={styles.intro}>{t("home.interest")}</p>
        <p className={styles.introDetail}>
          <Trans
            i18nKey="home.introduction"
            components={{
              meizu: <a href="https://www.meizu.com/" target="_blank" rel="noreferrer" className={styles.link} />,
              freebuf: <a href="https://www.freebuf.com" target="_blank" rel="noreferrer" className={styles.link} />,
            }}
          />
        </p>
      </section>

      <div className={styles.recentPostsTitle}>{t("home.recentPosts")}</div>
      <section className={styles.recentPostsContent}>
        {articlesCopy.slice(0, 3).map((article) => (
          <BlogPostCard
            key={article.id}
            id={article.id}
            title={article.title}
            description={article.description}
            date={article.date}
            handleClick={() => window.open(`/post?id=${article.id}`)}
          />
        ))}
      </section>
    </main>
  );
}
