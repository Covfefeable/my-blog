"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { articles } from "@/assets/article/config";
import styles from "./index.module.css";

const Lanyard = dynamic(() => import("@/components/lanyard"), {
  ssr: false,
  loading: () => <div className={styles.badgeLoading}>IDENTITY TOKEN LOADING</div>,
});

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

const Icon = ({ children }: { children: React.ReactNode }) => <span aria-hidden="true">{children}</span>;

export default function HomeExperience() {
  const { i18n } = useTranslation();
  const [showAllArticles, setShowAllArticles] = useState(false);
  const allArticles = useMemo(() => [...articles].reverse(), []);
  const visibleArticles = showAllArticles ? allArticles : allArticles.slice(0, 5);
  const isZh = i18n.resolvedLanguage === "zh-CN";
  const copy = isZh ? {
    statement: "用代码、好奇心，以及一点可控的混乱，构建让人记得住的数字体验。",
    verified: "身份已验证 · 已授予访问权限",
    roles: "前端开发工程师 / 安全研究",
    systemOnline: "系统在线",
    accessCode: "访问节点 / JC-07",
    node: "节点 07",
    locationMeta: "上海 / 中国",
    latency: "延迟 12MS",
    enter: "进入文章档案",
    profile: "查看个人档案",
    accessTitle: "当前工作",
    accessIntro: "集中展示我最近正在推进的项目、持续研究的技术方向，以及目前的合作状态。",
    focusLabel: "02 / 当前工作 · CURRENT WORK",
    featuredLabel: "主要项目 · FEATURED PROJECT",
    featuredKicker: "开源 Code Agent 工作空间",
    featuredDescription: "把本地工具、持久终端、可恢复执行和 Multi-Agent 协作放进同一套 Runtime。",
    featuredAction: "查看 GitHub 仓库 ↗",
    resumeLabel: "个人简历 · RESUME",
    resumeTitle: "前端开发工程师",
    resumeDescription: "查看工作经历、项目经验与专业技能。",
    resumeAction: "打开 PDF ↗",
    securityLabel: "研究方向 · SECURITY LAB",
    securityKicker: "WEB 安全研究",
    securityDescription: "攻击面、反调试、代码保护，以及浏览器里那些不安分的细节。",
    securityAction: "查看相关记录",
    creativeLabel: "创作主题 · CREATIVE SYSTEMS",
    creativeKicker: "正在持续构建",
    creativeDescription: "把工程、视觉和实验性交互组合成有记忆点的数字体验。",
    archiveTitle: "文章档案",
    archiveLabel: "03 / 活动记录 · ACTIVITY LOGS",
    allRecords: `查看全部 ${articles.length} 条记录`,
    loadMore: `加载其余 ${Math.max(articles.length - 5, 0)} 篇文章`,
    openRecord: "打开 ↗",
    personnelLabel: "04 / 人员档案 · PERSONNEL FILE",
    quote: "“把技术、视觉和交互组合成不只是能用，而且让人记得住的东西。”",
    roleLabel: "职位",
    roleValue: "前端开发工程师",
    locationLabel: "所在地",
    locationValue: "中国上海",
    focusFieldLabel: "方向",
    focusFieldValue: "安全 / AI / 创意编程",
    experienceLabel: "经历",
    dragBadge: "拖动 / 点击翻面",
    lanyardLabel: "可拖动的数字工牌",
    dockIdentity: "主页",
    dockWork: "工作",
    dockArchive: "文章",
    dockProfile: "档案",
    dockContact: "联系",
    dockLanguage: "语言",
    contactLead: "本次访问已记录",
    contactTitle: "想一起做点有意思的东西吗？",
    contactAction: "开始交流",
    sessionLabel: "会话编号",
    statusActive: "状态：活跃",
  } : {
    statement: "Building interfaces with code, curiosity and a little controlled chaos.",
    verified: "IDENTITY VERIFIED · CLEARANCE GRANTED",
    roles: "FRONTEND ENGINEER / SECURITY EXPLORER",
    systemOnline: "SYSTEM ONLINE",
    accessCode: "ACCESS / JC-07",
    node: "NODE 07",
    locationMeta: "SHANGHAI / CN",
    latency: "LATENCY 12MS",
    enter: "ENTER ARCHIVE",
    profile: "PERSONNEL FILE",
    accessTitle: "Current work",
    accessIntro: "The active projects, ongoing research topics and collaboration status shaping my work right now.",
    focusLabel: "02 / CURRENT WORK",
    featuredLabel: "FEATURED PROJECT",
    featuredKicker: "Open-source Code Agent workspace",
    featuredDescription: "One runtime for local tools, persistent terminals, recoverable execution and Multi-Agent collaboration.",
    featuredAction: "VIEW ON GITHUB ↗",
    resumeLabel: "RESUME",
    resumeTitle: "Frontend Engineer",
    resumeDescription: "View professional experience, selected projects and technical skills.",
    resumeAction: "OPEN PDF ↗",
    securityLabel: "SECURITY LAB",
    securityKicker: "WEB SECURITY RESEARCH",
    securityDescription: "Attack surfaces, anti-debugging, code protection and the less obedient corners of the browser.",
    securityAction: "VIEW RELATED RECORD",
    creativeLabel: "CREATIVE SYSTEMS",
    creativeKicker: "ONGOING PRACTICE",
    creativeDescription: "Combining engineering, visual systems and experimental interaction into memorable digital experiences.",
    archiveTitle: "Writing archive",
    archiveLabel: "03 / ACTIVITY LOGS",
    allRecords: `VIEW ALL ${articles.length} RECORDS`,
    loadMore: `LOAD ${Math.max(articles.length - 5, 0)} MORE RECORDS`,
    openRecord: "OPEN ↗",
    personnelLabel: "04 / PERSONNEL FILE",
    quote: "“I combine technology, visual systems and interaction into things that are useful and memorable.”",
    roleLabel: "ROLE",
    roleValue: "Frontend Engineer",
    locationLabel: "LOCATION",
    locationValue: "Shanghai, China",
    focusFieldLabel: "FOCUS",
    focusFieldValue: "Security / AI / Creative Code",
    experienceLabel: "EXPERIENCE",
    dragBadge: "DRAG / CLICK TO FLIP",
    lanyardLabel: "Interactive draggable badge",
    dockIdentity: "IDENTITY",
    dockWork: "WORK",
    dockArchive: "ARCHIVE",
    dockProfile: "PROFILE",
    dockContact: "CONTACT",
    dockLanguage: "LANGUAGE",
    contactLead: "YOUR VISIT HAS BEEN LOGGED",
    contactTitle: "Want to build something interesting?",
    contactAction: "START A CONVERSATION",
    sessionLabel: "SESSION ID",
    statusActive: "STATUS: ACTIVE",
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const changeLanguage = () => {
    const nextLanguage = isZh ? "en" : "zh-CN";
    void i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <div className={styles.portal} data-portal-home>
      <section className={styles.hero} id="identity">
        <div className={styles.dotGrid} />
        <div className={styles.scanGlow} />
        <div className={styles.systemBar}>
          <span>{copy.accessCode}</span>
          <span className={styles.online}><i /> {copy.systemOnline}</span>
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{copy.verified}</p>
          <h1><DecryptedName /></h1>
          <p className={styles.roles}>{copy.roles}</p>
          <p className={styles.statement}>{copy.statement}</p>
          <div className={styles.heroActions}>
            <button type="button" onClick={() => scrollTo("archive")}>{copy.enter} <span>↘</span></button>
            <button type="button" className={styles.secondaryAction} onClick={() => scrollTo("personnel")}>{copy.profile} <span>→</span></button>
          </div>
          <div className={styles.coordinates}>
            <span>{copy.node}</span><span>{copy.locationMeta}</span><span>{copy.latency}</span>
          </div>
        </div>

        <div className={styles.lanyardStage}>
          <Lanyard ariaLabel={copy.lanyardLabel} />
          <p className={styles.dragHint}><span>↔</span> {copy.dragBadge}</p>
        </div>
      </section>

      <main className={styles.content}>
        <section className={styles.clearance} id="focus">
          <header className={styles.sectionHeader}>
            <div><span>{copy.focusLabel}</span><h2>{copy.accessTitle}</h2></div>
            <p>{copy.accessIntro}</p>
          </header>
          <div className={styles.bento}>
            <a className={`${styles.panel} ${styles.panelLead} ${styles.panelLink}`} href="https://github.com/Covfefeable/ohmycode" target="_blank" rel="noreferrer">
              <span className={styles.panelCode}>{copy.featuredLabel}</span>
              <div><p>{copy.featuredKicker}</p><h3>OhMyCode</h3><p>{copy.featuredDescription}</p></div>
              <span className={styles.panelAction}>{copy.featuredAction}</span>
            </a>
            <a className={`${styles.panel} ${styles.panelStatus} ${styles.panelLink}`} href="/resume/qu-jie-frontend-engineer.pdf" target="_blank" rel="noreferrer">
              <span className={styles.panelCode}>{copy.resumeLabel}</span>
              <span className={styles.resumeMark}>CV</span>
              <strong>{copy.resumeTitle}</strong><p>{copy.resumeDescription}</p>
              <span className={styles.panelAction}>{copy.resumeAction}</span>
            </a>
            <article className={styles.panel}>
              <span className={styles.panelCode}>{copy.securityLabel}</span>
              <div><p>{copy.securityKicker}</p><h3>Web Security</h3><p>{copy.securityDescription}</p></div>
              <Link href="/posts/6">{copy.securityAction} <span>↗</span></Link>
            </article>
            <article className={`${styles.panel} ${styles.panelWide}`}>
              <span className={styles.panelCode}>{copy.creativeLabel}</span>
              <div><p>{copy.creativeKicker}</p><h3>Frontend / AI / Interaction</h3><p>{copy.creativeDescription}</p></div>
              <div className={styles.signalLines}><i /><i /><i /><i /><i /></div>
            </article>
          </div>
        </section>

        <section className={styles.archive} id="archive">
          <header className={styles.sectionHeader}>
            <div><span>{copy.archiveLabel}</span><h2>{copy.archiveTitle}</h2></div>
            <span>{copy.allRecords}</span>
          </header>
          <div className={styles.logList}>
            {visibleArticles.map((article, index) => (
              <Link href={`/posts/${article.id}`} className={styles.logRow} key={article.id}>
                <span className={styles.logIndex}>{String(index + 1).padStart(2, "0")}</span>
                <time>{article.date.replaceAll("-", ".")}</time>
                <div><h3>{article.title}</h3><p>{article.description}</p></div>
                <span className={styles.openLog}>{copy.openRecord}</span>
              </Link>
            ))}
          </div>
          {!showAllArticles && allArticles.length > 5 ? (
            <button className={styles.loadMore} type="button" onClick={() => setShowAllArticles(true)}>{copy.loadMore} <span>↓</span></button>
          ) : null}
        </section>

        <section className={styles.personnel} id="personnel">
          <span className={styles.fileLabel}>{copy.personnelLabel}</span>
          <div className={styles.personnelGrid}>
            <div><p className={styles.quote}>{copy.quote}</p><a href="https://github.com/Covfefeable" target="_blank" rel="noreferrer">GITHUB / @Covfefeable ↗</a></div>
            <dl>
              <div><dt>{copy.roleLabel}</dt><dd>{copy.roleValue}</dd></div>
              <div><dt>{copy.locationLabel}</dt><dd>{copy.locationValue}</dd></div>
              <div><dt>{copy.focusFieldLabel}</dt><dd>{copy.focusFieldValue}</dd></div>
              <div><dt>{copy.experienceLabel}</dt><dd>Meizu / FreeBuf</dd></div>
              <div><dt>GITHUB</dt><dd><a href="https://github.com/Covfefeable" target="_blank" rel="noreferrer">@Covfefeable ↗</a></dd></div>
            </dl>
          </div>
        </section>

        <section className={styles.contact} id="contact">
          <p>{copy.contactLead}</p>
          <h2>{copy.contactTitle}</h2>
          <a href="mailto:rears_seasons_0n@icloud.com">{copy.contactAction} <span>↗</span></a>
          <div><span>{copy.sessionLabel}: GUEST-{new Date().getFullYear()}</span><span>{copy.statusActive}</span></div>
        </section>
      </main>

      <nav className={styles.dock} aria-label="Quick navigation">
        <button type="button" onClick={() => scrollTo("identity")} aria-label={copy.dockIdentity}><Icon>⌂</Icon><small>{copy.dockIdentity}</small></button>
        <button type="button" onClick={() => scrollTo("focus")} aria-label={copy.dockWork}><Icon>✦</Icon><small>{copy.dockWork}</small></button>
        <button type="button" onClick={() => scrollTo("archive")} aria-label={copy.dockArchive}><Icon>▤</Icon><small>{copy.dockArchive}</small></button>
        <button type="button" onClick={() => scrollTo("personnel")} aria-label={copy.dockProfile}><Icon>◎</Icon><small>{copy.dockProfile}</small></button>
        <button type="button" onClick={() => scrollTo("contact")} aria-label={copy.dockContact}><Icon>↗</Icon><small>{copy.dockContact}</small></button>
        <button type="button" onClick={changeLanguage} aria-label={isZh ? "Switch to English" : "切换为中文"}><Icon>{isZh ? "EN" : "中"}</Icon><small>{copy.dockLanguage}</small></button>
      </nav>
    </div>
  );
}
