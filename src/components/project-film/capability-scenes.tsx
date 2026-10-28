import Image from "next/image";
import type { CSSProperties } from "react";
import abilities from "./burst-icons.json";
import styles from "./capability-scenes.module.css";

const fallingAbilities = [...abilities, ...abilities];

const messages = [
  { role: "host", zh: "主持人", en: "Host", textZh: "先检查图片渲染入口，再实现预览。最后交给审查。", textEn: "Find the image renderer, implement the preview, then hand it over for review." },
  { role: "developer", zh: "开发者", en: "Developer", textZh: "找到统一渲染层，已加入图片放大和关闭交互。", textEn: "Found the shared renderer. Image enlargement and dismissal are in place." },
  { role: "reviewer", zh: "审查者", en: "Reviewer", textZh: "还需要键盘操作、焦点返回，以及预览时锁定滚动。", textEn: "Add keyboard controls, restore focus on close, and lock background scrolling." },
  { role: "developer", zh: "开发者", en: "Developer", textZh: "已补齐，鼠标和键盘操作都检查过了。", textEn: "Updated and checked with both mouse and keyboard." },
  { role: "host", zh: "主持人", en: "Host", textZh: "实现与审查已完成，汇总结果。", textEn: "Implementation and review complete. Here is the result." },
];

export default function CapabilityScenes({ isZh }: { isZh: boolean }) {
  return <>
    <div className={styles.collaboration} data-collab-scene aria-label={isZh ? "多 Agent 协作示例" : "Multi-agent collaboration example"}>
      <div className={styles.collabHeader}><p>Multi-Agent</p><h4>{isZh ? "一个任务，不止一个视角。" : "One task. More than one perspective."}</h4></div>
      <div className={styles.board} data-team-board>
        <div className={styles.team} aria-label={isZh ? "协作成员" : "Team members"}>
          {[{ id: "host", zh: "主持人", en: "Host", initial: "H" }, { id: "developer", zh: "开发者", en: "Developer", initial: "D" }, { id: "reviewer", zh: "审查者", en: "Reviewer", initial: "R" }].map(role => <div className={styles.member} data-agent={role.id} key={role.id}><span>{role.initial}</span><strong>{isZh ? role.zh : role.en}</strong></div>)}
          <p className={styles.teamNote}>{isZh ? "主持人调度，成员依次接力。" : "Host-directed. One member at a time."}</p>
        </div>
        <div className={styles.conversation}>
          <div className={styles.request}>{isZh ? "给文章图片加上点击预览。" : "Add click-to-preview to article images."}</div>
          <ol className={styles.messages}>
            {messages.map((message, index) => <li className={styles.message} data-agent-message data-speaker={message.role} key={index}><span>{isZh ? message.zh : message.en}</span><p>{isZh ? message.textZh : message.textEn}</p></li>)}
          </ol>
        </div>
      </div>
    </div>
    <div className={styles.ecosystem} data-ecosystem-scene aria-label={isZh ? "MCP 与 Skills 扩展示例" : "MCP and Skills extension examples"}>
      <div className={styles.toolRain} data-tool-rain aria-hidden="true">
        {Array.from({ length: 80 }, (_, index) => {
          const ability = abilities[index * 7 % abilities.length];
          return <span className={styles.rainDrop} data-rain-drop key={index} style={{
            left: `${3 + (index * .618034 % 1) * 94}%`,
            "--rain-size": `${16 + index % 5 * 3}px`,
            "--rain-duration": `${6 + index % 9 * .65}s`,
            "--rain-delay": `${-index * 1.73}s`,
            "--rain-opacity": .14 + index % 5 * .025,
            "--rain-turn": `${index % 2 ? 14 : -14}deg`,
          } as CSSProperties}><Image src={`/projects/ohmycode/icons/${ability.file}`} alt="" width={40} height={40} unoptimized /></span>;
        })}
      </div>
      <div className={styles.ecosystemHeader} data-ecosystem-header><h4>{isZh ? "海量MCP和SKILL" : "Countless MCP tools and skills"}<br /><span>{isZh ? "放心接入" : "Connect with confidence"}</span></h4></div>
      <div className={styles.hub} data-ability-hub><Image src="/projects/ohmycode/icon.png" alt="" width={128} height={128} /><strong data-ability-brand>Oh<span className={styles.brandAccent}>My</span>Code</strong></div>
      {fallingAbilities.map((ability,index) => {
        const originalIndex = index % abilities.length;
        return <div key={`${ability.name}-${index}`} className={styles.ability} data-ability data-mobile-hidden={originalIndex >= 18 && originalIndex < abilities.length - 6 ? "true" : "false"} aria-hidden="true">
          <Image src={`/projects/ohmycode/icons/${ability.file}`} alt="" width={40} height={40} unoptimized />
        </div>;
      })}
      <p className={styles.ecosystemNote} data-ecosystem-note>{isZh ? "可接入的扩展示例" : "Examples of available extensions"} <span>MCP / Skills</span></p>
      <p className={styles.outro} data-ecosystem-outro>{isZh ? "让想法成为现实" : "Turn ideas into reality"}</p>
    </div>
  </>;
}
