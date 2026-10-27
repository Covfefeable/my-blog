import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { articles } from "@/assets/article/config";
import ArticleContent from "./article-content";
import Registration from "@/components/registration";
import styles from "./post.module.css";

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
    <main className={styles.archivePage} data-archive-page>
      <nav className={styles.archiveNav} aria-label="文章导航">
        <Link href="/" className={styles.brand}>Jay Chiu</Link>
        <div><Link href="/">首页</Link><Link href="/#archive">文章</Link><Link href="/#personnel">关于</Link></div>
      </nav>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{article.title}</h1><p className={styles.description}>{article.description}</p>
          <div className={styles.heroFooter}><time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time><span>Jay Chiu</span></div>
        </div>
        <div className={styles.cover} style={{ backgroundImage: `url(/articles/${article.id}/cover.png)` }} role="img" aria-label={`${article.title} 封面`} />
      </header>
      <div className={styles.readingLayout}>
        <article className={styles.article}>
          <ArticleContent html={content} />
          <footer className={styles.articleEnd}><span>感谢阅读</span><Link href="/#archive">更多文章 →</Link><Registration /></footer>
        </article>
      </div>
    </main>
  );
}
