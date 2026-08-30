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

export function PortalPreview() {
  return (
    <div className={styles.preview} data-portal-home aria-hidden="true">
      <div className={styles.previewGrid} />
      <span className={styles.previewStatus}>IDENTITY VERIFIED</span>
    </div>
  );
}

export default function HomeExperience() {
  const { i18n } = useTranslation();
  const allArticles = useMemo(() => [...articles].reverse(), []);
  const isZh = i18n.resolvedLanguage === "zh-CN";
  const copy = isZh ? {
    statement: "用代码、好奇心，以及一点可控的混乱，构建让人记得住的数字体验。",
    enter: "进入文章档案",
    profile: "查看个人档案",
    accessTitle: "当前工作",
    accessIntro: "集中展示我最近正在推进的项目、持续研究的技术方向，以及目前的合作状态。",
    archiveTitle: "文章档案",
    allRecords: `查看全部 ${articles.length} 条记录`,
    contactLead: "本次访问已记录",
    contactTitle: "想一起做点有意思的东西吗？",
    contactAction: "开始交流",
  } : {
    statement: "Building interfaces with code, curiosity and a little controlled chaos.",
    enter: "ENTER ARCHIVE",
    profile: "PERSONNEL FILE",
    accessTitle: "Current work",
    accessIntro: "The active projects, ongoing research topics and collaboration status shaping my work right now.",
    archiveTitle: "Writing archive",
    allRecords: `VIEW ALL ${articles.length} RECORDS`,
    contactLead: "YOUR VISIT HAS BEEN LOGGED",
    contactTitle: "Want to build something interesting?",
    contactAction: "START A CONVERSATION",
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
          <span>ACCESS / JC-07</span>
          <span className={styles.online}><i /> SYSTEM ONLINE</span>
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>IDENTITY VERIFIED · CLEARANCE GRANTED</p>
          <h1><DecryptedName /></h1>
          <p className={styles.roles}>FRONTEND ENGINEER <span>/</span> SECURITY EXPLORER</p>
          <p className={styles.statement}>{copy.statement}</p>
          <div className={styles.heroActions}>
            <button type="button" onClick={() => scrollTo("archive")}>{copy.enter} <span>↘</span></button>
            <button type="button" className={styles.secondaryAction} onClick={() => scrollTo("personnel")}>{copy.profile} <span>→</span></button>
          </div>
          <div className={styles.coordinates}>
            <span>NODE 07</span><span>SHENZHEN / CN</span><span>LATENCY 12MS</span>
          </div>
        </div>

        <div className={styles.lanyardStage}>
          <Lanyard />
          <p className={styles.dragHint}><span>↔</span> DRAG THE BADGE</p>
        </div>
      </section>

      <main className={styles.content}>
        <section className={styles.clearance} id="focus">
          <header className={styles.sectionHeader}>
            <div><span>02 / CURRENT WORK · 当前工作</span><h2>{copy.accessTitle}</h2></div>
            <p>{copy.accessIntro}</p>
          </header>
          <div className={styles.bento}>
            <article className={`${styles.panel} ${styles.panelLead}`}>
              <span className={styles.panelCode}>主要项目 · FEATURED PROJECT</span>
              <div><p>AI 量化策略实验室</p><h3>AI × Quant</h3><p>让 Agent 编写、迭代和回测量化策略，探索大模型如何参与真实研究流程。</p></div>
              <Link href="/posts/11">查看项目记录 <span>↗</span></Link>
            </article>
            <article className={`${styles.panel} ${styles.panelStatus}`}>
              <span className={styles.panelCode}>合作状态 · CURRENT STATUS</span>
              <div className={styles.pulseOrb}><i /><i /><i /></div>
              <strong>开放交流</strong><p>欢迎有趣的想法、实验性产品和不寻常的界面。</p>
            </article>
            <article className={styles.panel}>
              <span className={styles.panelCode}>研究方向 · SECURITY LAB</span>
              <div><p>WEB 安全研究</p><h3>Web Security</h3><p>攻击面、反调试、代码保护，以及浏览器里那些不安分的细节。</p></div>
              <Link href="/posts/6">查看相关记录 <span>↗</span></Link>
            </article>
            <article className={`${styles.panel} ${styles.panelWide}`}>
              <span className={styles.panelCode}>创作主题 · CREATIVE SYSTEMS</span>
              <div><p>正在持续构建</p><h3>Frontend / AI / Interaction</h3><p>把工程、视觉和实验性交互组合成有记忆点的数字体验。</p></div>
              <div className={styles.signalLines}><i /><i /><i /><i /><i /></div>
            </article>
          </div>
        </section>

        <section className={styles.archive} id="archive">
          <header className={styles.sectionHeader}>
            <div><span>03 / ACTIVITY LOGS · 活动记录</span><h2>{copy.archiveTitle}</h2></div>
            <span>{copy.allRecords}</span>
          </header>
          <div className={styles.logList}>
            {allArticles.map((article, index) => (
              <Link href={`/posts/${article.id}`} className={styles.logRow} key={article.id}>
                <span className={styles.logIndex}>{String(index + 1).padStart(2, "0")}</span>
                <time>{article.date.replaceAll("-", ".")}</time>
                <div><h3>{article.title}</h3><p>{article.description}</p></div>
                <span className={styles.openLog}>OPEN ↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.personnel} id="personnel">
          <span className={styles.fileLabel}>04 / PERSONNEL FILE · 人员档案</span>
          <div className={styles.personnelGrid}>
            <div><p className={styles.quote}>“把技术、视觉和交互组合成不只是能用，而且让人记得住的东西。”</p><a href="https://github.com/Covfefeable" target="_blank" rel="noreferrer">GITHUB / @Covfefeable ↗</a></div>
            <dl>
              <div><dt>NAME</dt><dd>Jay Chiu</dd></div>
              <div><dt>ROLE</dt><dd>Frontend Engineer</dd></div>
              <div><dt>LOCATION</dt><dd>Shenzhen, China</dd></div>
              <div><dt>FOCUS</dt><dd>Security / AI / Creative Code</dd></div>
              <div><dt>EXPERIENCE</dt><dd>Meizu / FreeBuf</dd></div>
              <div><dt>GITHUB</dt><dd><a href="https://github.com/Covfefeable" target="_blank" rel="noreferrer">@Covfefeable ↗</a></dd></div>
            </dl>
          </div>
        </section>

        <section className={styles.contact} id="contact">
          <p>{copy.contactLead}</p>
          <h2>{copy.contactTitle}</h2>
          <a href="mailto:rears_seasons_0n@icloud.com">{copy.contactAction} <span>↗</span></a>
          <div><span>SESSION ID: GUEST-{new Date().getFullYear()}</span><span>STATUS: ACTIVE</span></div>
        </section>
      </main>

      <nav className={styles.dock} aria-label="Quick navigation">
        <button type="button" onClick={() => scrollTo("identity")} aria-label="Identity"><Icon>⌂</Icon><small>IDENTITY</small></button>
        <button type="button" onClick={() => scrollTo("focus")} aria-label="Current work"><Icon>✦</Icon><small>WORK</small></button>
        <button type="button" onClick={() => scrollTo("archive")} aria-label="Archive"><Icon>▤</Icon><small>ARCHIVE</small></button>
        <button type="button" onClick={() => scrollTo("personnel")} aria-label="Personnel"><Icon>◎</Icon><small>PROFILE</small></button>
        <button type="button" onClick={() => scrollTo("contact")} aria-label="Contact"><Icon>↗</Icon><small>CONTACT</small></button>
        <button type="button" onClick={changeLanguage} aria-label={isZh ? "Switch to English" : "切换为中文"}><Icon>{isZh ? "EN" : "中"}</Icon><small>LANGUAGE</small></button>
      </nav>
    </div>
  );
}
