import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { articles } from "@/assets/article/config";
import ArticleContent from "./article-content";
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
        <Link href="/" className={styles.brand}><i /> JC / ARCHIVE</Link>
        <div><Link href="/">首页 HOME</Link><Link href="/#archive">文章 RECORDS</Link><Link href="/#personnel">关于 PROFILE</Link></div>
      </nav>
      <header className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.recordMeta}><span>ARCHIVE RECORD / {String(article.id).padStart(2, "0")}</span><span>访问权限：公开 PUBLIC</span></div>
        <div className={styles.heroContent}>
          <p>研究记录 · RESEARCH LOG</p><h1>{article.title}</h1><p className={styles.description}>{article.description}</p>
          <div className={styles.heroFooter}><time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time><span>BY JAY CHIU</span><span>STATUS / PUBLISHED</span></div>
        </div>
        <div className={styles.cover} style={{ backgroundImage: `url(/articles/${article.id}/cover.png)` }} role="img" aria-label={`${article.title} 封面`} />
      </header>
      <div className={styles.readingLayout}>
        <aside className={styles.sideRail}>
          <span>DOCUMENT INFO · 文档信息</span>
          <dl><div><dt>编号</dt><dd>JC-{String(article.id).padStart(3, "0")}</dd></div><div><dt>日期</dt><dd>{article.date}</dd></div><div><dt>语言</dt><dd>中文 / ZH</dd></div><div><dt>状态</dt><dd className={styles.active}>● ACTIVE</dd></div></dl>
          <Link href="/#archive">← 返回文章档案</Link>
        </aside>
        <article className={styles.article}>
          <ArticleContent html={content} />
          <footer className={styles.articleEnd}><span>END OF RECORD · 记录结束</span><Link href="/#archive">继续浏览文章档案 →</Link></footer>
        </article>
      </div>
    </main>
  );
}
