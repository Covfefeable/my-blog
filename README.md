# JayChiu's Blog

个人技术博客，记录前端开发、网络安全、AI 与项目实践。项目基于 Next.js App Router 构建，文章使用 Markdown 管理，并支持中英文界面和深色模式。

## 本地开发

环境要求：Node.js 20、pnpm 11。

```bash
pnpm install
pnpm dev
```

访问 `http://localhost:3000`。

## 常用命令

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## 添加文章

1. 在 `public/articles/<id>/` 中添加 `article.md` 和 `cover.png`。
2. 在 `src/assets/article/config.ts` 中补充文章标题、日期、摘要和 ID。
3. 文章页会在构建时静态生成，并自动加入 sitemap。

## Docker

```bash
docker build -t jaychiu-blog .
docker run --rm -p 3000:3000 jaychiu-blog
```
