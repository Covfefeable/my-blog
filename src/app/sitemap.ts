import type { MetadataRoute } from "next";
import { articles } from "@/assets/article/config";

const siteUrl = "https://llmol.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [""].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  return pages.concat(articles.map((article) => ({
    url: `${siteUrl}/posts/${article.id}`,
    lastModified: new Date(article.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  })));
}
