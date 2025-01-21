import { Article, articles } from "@/assets/article/config";
import styles from "./index.module.css";
import BlogPostCard from "@/components/blog-post-card";

export default function Home() {
  const articlesCopy: Article[] = JSON.parse(
    JSON.stringify(articles)
  ).reverse();

  return (
    <main>
      <section className={styles.aboutContent}>
        <p className={styles.intro}>A funny frontend engineer,</p>
        <p className={styles.intro}>Amateur cybersecurity researcher</p>
        <p className={styles.introDetail}>
          I am a frontend engineer who is passionate about web development and
          cybersecurity. I am currently working as a frontend engineer at {" "}
          <a
            href="https://www.meizu.com/"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            meizu
          </a>
          . I am also like to learn about stock trading and investing.
        </p>
      </section>

      <div className={styles.recentPostsTitle}>Recent Posts</div>
      <section className={styles.recentPostsContent}>
        {articlesCopy.slice(0, 3).map((i) => {
          return (
            <BlogPostCard
              key={i.id}
              id={i.id}
              title={i.title}
              description={i.description}
              date={i.date}
              handleClick={() => {
                window.open(`/post?id=${i.id}`);
              }}
            />
          );
        })}
      </section>
    </main>
  );
}
