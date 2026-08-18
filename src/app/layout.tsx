import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "./basic-layout";
import Providers from "./providers";

const siteUrl = "https://llmol.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "JayChiu's Blog", template: "%s | JayChiu's Blog" },
  description: "记录前端开发、网络安全、AI 与个人项目实践。",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "JayChiu's Blog",
    title: "JayChiu's Blog",
    description: "记录前端开发、网络安全、AI 与个人项目实践。",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Providers><Layout>{children}</Layout></Providers>
      </body>
    </html>
  );
}
