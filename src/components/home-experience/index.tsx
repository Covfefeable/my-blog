"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import ProjectFilm from "@/components/project-film";
import ExternalArrow from "@/components/external-arrow";
import Registration from "@/components/registration";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { articles } from "@/assets/article/config";
import styles from "./index.module.css";

const Lanyard = dynamic(() => import("@/components/lanyard"), {
  ssr: false,
  loading: BadgeLoading,
});

function BadgeLoading() {
  const { i18n } = useTranslation();
  return <div className={styles.badgeLoading} role="status">{i18n.resolvedLanguage === "zh-CN" ? "正在加载工牌" : "Loading badge"}</div>;
}

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

function DecryptedName() {
  const target = "JAY CHIU";
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let iteration = 0;
    const timer = window.setInterval(() => {
      setValue(
        target
          .split("")
          .map((character, index) => {
            if (character === " " || index < iteration) return character;
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join(""),
      );
      iteration += 0.34;
      if (iteration >= target.length) {
        setValue(target);
        window.clearInterval(timer);
      }
    }, 55);
    return () => window.clearInterval(timer);
  }, []);

  return <span aria-label={target}>{value}</span>;
}

export default function HomeExperience() {
  const { i18n } = useTranslation();
  const [showAllArticles, setShowAllArticles] = useState(false);
  const allArticles = useMemo(() => [...articles].reverse(), []);
  const visibleArticles = showAllArticles ? allArticles : allArticles.slice(0, 5);
  const isZh = i18n.resolvedLanguage === "zh-CN";
  const copy = isZh ? {
    statement: "写前端，也折腾 Web 安全。做过的项目、遇到的问题，都记在这里。",
    roles: "前端开发工程师",
    enter: "阅读文章",
    profile: "关于我",
    accessTitle: "当前 focus",
    accessIntro: "最近在做 OhMyCode，也持续关注 Web 安全与界面交互。",
    featuredLabel: "开源项目",
    featuredKicker: "开源 Code Agent 工作空间",
    featuredDescription: "把本地工具、持久终端、可恢复执行和 Multi-Agent 协作放进同一套 Runtime。",
    featuredAction: "查看 GitHub 仓库",
    resumeLabel: "个人简历",
    resumeTitle: "前端开发工程师",
    resumeDescription: "查看工作经历、项目经验与专业技能。",
    resumeAction: "打开 PDF",
    archiveTitle: "最近的文章",
    loadMore: `加载其余 ${Math.max(articles.length - 5, 0)} 篇文章`,
    openRecord: "打开",
    personnelLabel: "关于我",
    quote: "最近主要在做 OhMyCode。之前写过反调试、代码混淆，也做过 TensorFlow.js 和大模型相关的实验。",
    roleLabel: "职位",
    roleValue: "前端开发工程师",
    locationLabel: "所在地",
    locationValue: "中国上海",
    focusFieldLabel: "方向",
    focusFieldValue: "Web 安全、AI 工具、前端交互",
    experienceLabel: "经历",
    lanyardLabel: "可拖动的数字工牌",
    dockIdentity: "主页",
    dockWork: "工作",
    dockArchive: "文章",
    dockProfile: "档案",
    dockContact: "联系",
    dockLanguage: "语言",
    contactTitle: "联系我",
  } : {
    statement: "I build frontends and work on web security. This is where I write about my projects and the problems I run into.",
    roles: "Frontend engineer",
    enter: "Read the articles",
    profile: "About me",
    accessTitle: "Current focus",
    accessIntro: "Building OhMyCode and exploring web security and interface interaction.",
    featuredLabel: "FEATURED PROJECT",
    featuredKicker: "Open-source Code Agent workspace",
    featuredDescription: "One runtime for local tools, persistent terminals, recoverable execution and Multi-Agent collaboration.",
    featuredAction: "VIEW ON GITHUB",
    resumeLabel: "RESUME",
    resumeTitle: "Frontend Engineer",
    resumeDescription: "View professional experience, selected projects and technical skills.",
    resumeAction: "OPEN PDF",
    archiveTitle: "Recent writing",
    loadMore: `Load ${Math.max(articles.length - 5, 0)} more articles`,
    openRecord: "OPEN",
    personnelLabel: "About me",
    quote: "I'm currently building OhMyCode. Earlier posts cover anti-debugging, code obfuscation, TensorFlow.js and experiments with large language models.",
    roleLabel: "Role",
    roleValue: "Frontend Engineer",
    locationLabel: "Location",
    locationValue: "Shanghai, China",
    focusFieldLabel: "Interests",
    focusFieldValue: "Web security, AI tools, frontend interaction",
    experienceLabel: "Experience",
    lanyardLabel: "Interactive draggable badge",
    dockIdentity: "IDENTITY",
    dockWork: "WORK",
    dockArchive: "ARCHIVE",
    dockProfile: "PROFILE",
    dockContact: "CONTACT",
    dockLanguage: "LANGUAGE",
    contactTitle: "Get in touch",
  };

  const changeLanguage = () => {
    const nextLanguage = isZh ? "en" : "zh-CN";
    void i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <div className={styles.portal} data-portal-home>
      <nav className={styles.navigation} aria-label={isZh ? "主导航" : "Main navigation"}>
        <a className={styles.wordmark} href="#identity">Jay Chiu<span> / {isZh ? "个人博客" : "Personal blog"}</span></a>
        <div>
          <a href="#archive">{copy.dockArchive}</a>
          <a href="#focus">{isZh ? "项目" : "Projects"}</a>
          <a href="#personnel">{copy.profile}</a>
          <button type="button" onClick={changeLanguage} aria-label={isZh ? "Switch to English" : "切换为中文"}>{isZh ? "EN" : "中文"}</button>
        </div>
      </nav>
      <section className={styles.hero} id="identity">

        <div className={styles.heroCopy}>
          <h1><DecryptedName /></h1>
          <p className={styles.roles}>{copy.roles}</p>
          <p className={styles.statement}>{copy.statement}</p>
          <div className={styles.heroActions}>
            <a href="#archive">{copy.enter} <span aria-hidden="true">↓</span></a>
            <a href="#personnel" className={styles.secondaryAction}>{copy.profile} <span aria-hidden="true">→</span></a>
          </div>
        </div>

        <div className={styles.lanyardStage}>
          <Lanyard ariaLabel={copy.lanyardLabel} />
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.archive} id="archive">
          <header className={styles.sectionHeader}><h2>{copy.archiveTitle}</h2></header>
          <div className={styles.logList}>
            {visibleArticles.map((article) => <Link href={`/posts/${article.id}`} className={styles.logRow} key={article.id}>
              <time dateTime={article.date}>{article.date.replaceAll("-", ".")}</time>
              <div><h3>{article.title}</h3><p>{article.description}</p></div>
              <span className={styles.openLog} aria-hidden="true"><ExternalArrow /></span>
            </Link>)}
          </div>
          {!showAllArticles && allArticles.length > 5 && <button className={styles.loadMore} type="button" onClick={() => setShowAllArticles(true)}>{copy.loadMore} ↓</button>}
        </section>
        <section className={styles.clearance} id="focus">
          <header className={styles.sectionHeader}>
            <h2>{copy.accessTitle}</h2>
            <p>{copy.accessIntro}</p>
          </header>
          <div className={styles.bento}>
            <ProjectFilm isZh={isZh} />
            <a className={`${styles.panel} ${styles.panelStatus} ${styles.panelLink}`} href="/resume/qu-jie-frontend-engineer.pdf" target="_blank" rel="noreferrer">
              <span className={styles.panelCode}>{copy.resumeLabel}</span>
              <strong>{copy.resumeTitle}</strong><p>{copy.resumeDescription}</p>
              <span className={styles.panelAction}>{copy.resumeAction} <ExternalArrow /></span>
            </a>
          </div>
        </section>

        <section className={styles.personnel} id="personnel">
          <h2>{copy.personnelLabel}</h2>
          <div className={styles.personnelGrid}>
            <div><p className={styles.aboutText}>{copy.quote}</p><a href="https://github.com/Covfefeable" target="_blank" rel="noreferrer">GitHub / @Covfefeable <ExternalArrow /></a></div>
            <dl>
              <div><dt>{copy.roleLabel}</dt><dd>{copy.roleValue}</dd></div>
              <div><dt>{copy.locationLabel}</dt><dd>{copy.locationValue}</dd></div>
              <div><dt>{copy.focusFieldLabel}</dt><dd>{copy.focusFieldValue}</dd></div>
              <div><dt>{copy.experienceLabel}</dt><dd>Meizu / FreeBuf</dd></div>
            </dl>
          </div>
        </section>

        <section className={styles.contact} id="contact">
          <h2>{copy.contactTitle}</h2>
          <a href="mailto:rears_seasons_0n@icloud.com">rears_seasons_0n@icloud.com <ExternalArrow /></a>
        </section>
      </div>
      <footer className={styles.footer}><span>© {new Date().getFullYear()} Jay Chiu</span><Registration /><a href="https://github.com/Covfefeable" target="_blank" rel="noreferrer">GitHub <ExternalArrow /></a><a href="#contact">{copy.dockContact}</a></footer>
    </div>
  );
}
