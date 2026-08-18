import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { articles } from "@/assets/article/config";
import styles from "@/pages/post.module.css";

type PostPageProps = { params: { id: string } };

function getArticle(id: string) {
  return articles.find((article) => String(article.id) === id);
}

export function generateStaticParams() {
  return articles.map((article) => ({ id: String(article.id) }));
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const article = getArticle(params.id);
  if (!article) return { title: "文章不存在" };
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      images: [`/articles/${article.id}/cover.png`],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const article = getArticle(params.id);
  if (!article) notFound();

  let markdown: string;
  try {
    markdown = await readFile(path.join(process.cwd(), "public", "articles", params.id, "article.md"), "utf8");
  } catch {
    notFound();
  }

  const rendered = await marked.parse(markdown);
  const content = sanitizeHtml(rendered, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      code: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  return (
    <main className={styles.articleContainer}>
      <article className={styles.article}>
        <h1 className={styles.title}>{article.title}</h1>
        <time className={styles.date} dateTime={article.date}>{article.date}</time>
        <div className={styles.root} dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </main>
  );
}
