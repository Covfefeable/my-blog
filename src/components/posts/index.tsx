import { Article, articles } from "@/assets/article/config";
import styles from "./index.module.css";
import BlogPostCard from "@/components/blog-post-card";
import Image from "next/image";

export default function Home() {
  const articlesCopy: Article[] = JSON.parse(
    JSON.stringify(articles)
  ).reverse();

  return (
    <main>
      <section className={styles.aboutContent}>
        <p className={styles.intro}>frontend,</p>
        <p className={styles.intro}>cybersecurity &</p>
        <p className={styles.intro}>deep learning</p>
        <p className={styles.introDetail}>
          Those are the things I am interested in. happy to share my thoughts
        </p>
      </section>

      <section className={styles.postsContent}>
        {articlesCopy.map((article) => (
          <div className={styles.articleContainer} key={article.id}>
            <div className={styles.date}>{article.date}</div>
            <div
              className={styles.articleBox}
              onClick={() => {
                window.open(`/post?id=${article.id}`);
              }}
            >
              <Image
                src={`/articles/${article.id}/cover.png`}
                width={200}
                height={200}
                alt=""
                className={styles.articleImage}
              />
              <div className={styles.articleContent}>
                <div className={styles.articleTitle}>{article.title}</div>
                <div className={styles.articleDescription}>
                  {article.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
