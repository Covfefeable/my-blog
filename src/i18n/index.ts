import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const supportedLanguages = ["en", "zh-CN"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const resources = {
  en: {
    translation: {
      nav: { home: "Home", posts: "Posts", about: "About", switchLanguage: "切换为中文", toggleTheme: "Toggle theme" },
      home: {
        role: "Frontend engineer,",
        interest: "Cybersecurity researcher",
        introduction: "I'm currently a frontend engineer at <meizu>Meizu</meizu>, and previously worked as a cybersecurity editor at <freebuf>FreeBuf</freebuf>.",
        recentPosts: "Recent Posts",
      },
      posts: { all: "All Posts" },
      about: {
        greeting: "Hi there!",
        introduction: "I am JayChiu and I have worked as a frontend engineer for more than {{years}} years. I am also a cybersecurity researcher interested in finding vulnerabilities in web applications. In recent years, I have focused on deep learning and large language models and built several related projects.",
        sendEmail: "Send me an email",
        emailTooltip: "Click to send me an email!",
      },
      post: { notFound: "Blog post not found." },
    },
  },
  "zh-CN": {
    translation: {
      nav: { home: "首页", posts: "文章", about: "关于", switchLanguage: "Switch to English", toggleTheme: "切换主题" },
      home: {
        role: "前端工程师，",
        interest: "网络安全爱好者",
        introduction: "目前在 <meizu>魅族</meizu> 从事前端开发工作，曾任 <freebuf>FreeBuf</freebuf> 网络安全编辑。",
        recentPosts: "最近更新",
      },
      posts: { all: "全部文章" },
      about: {
        greeting: "你好，我是 JayChiu",
        introduction: "我从事前端开发已有 {{years}} 年。在从事前端开发之余，我也持续关注网络安全、深度学习和大语言模型，并尝试将这些技术应用到一些有意思的项目中。",
        sendEmail: "给我发邮件",
        emailTooltip: "点击发送邮件",
      },
      post: { notFound: "文章不存在或已被删除。" },
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export function detectLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  const savedLanguage = window.localStorage.getItem("language");
  if (savedLanguage === "en" || savedLanguage === "zh-CN") return savedLanguage;
  return window.navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en";
}

export default i18n;
