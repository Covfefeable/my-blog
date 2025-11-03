import { Article, articles } from "@/assets/article/config";
import BlogPostCard from "@/components/blog-post-card";
import styles from "./index.module.css";

export default function Posts() {
  const articlesCopy: Article[] = JSON.parse(
    JSON.stringify(articles)
  ).reverse();

  return (
    <main className={styles.postsContainer}>
      <h1 className={styles.title}>All Posts</h1>
      
      <div className={styles.postsGrid}>
        {articlesCopy.map((article) => (
          <BlogPostCard
            key={article.id}
            id={article.id}
            title={article.title}
            date={article.date}
            description={article.description}
            handleClick={() => {
              window.open(`/post?id=${article.id}`);
            }}
          />
        ))}
      </div>
    </main>
  );
}
