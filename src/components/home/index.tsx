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
        <p className={styles.intro}>Frontend engineer,</p>
        <p className={styles.intro}>Cybersecurity researcher</p>
        <p className={styles.introDetail}>
          I&apos;m currently a frontend engineer at {" "}
          <a
            href="https://www.meizu.com/"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Meizu
          </a>
          , and previously worked as a cybersecurity editor at {" "}
          <a 
            href="https://www.freebuf.com" 
            target="_blank" 
            rel="noreferrer"
            className={styles.link}
          >
            FreeBuf
          </a>.
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
