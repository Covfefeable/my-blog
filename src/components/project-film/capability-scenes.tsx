import Image from "next/image";
import AgentScene from "./agent-scene";
import type { CSSProperties } from "react";
import abilities from "./burst-icons.json";
import styles from "./capability-scenes.module.css";

const fallingAbilities = [...abilities, ...abilities];

export default function CapabilityScenes({ isZh }: { isZh: boolean }) {
  return <>
    <AgentScene isZh={isZh} />
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
      <div className={styles.ecosystemHeader} data-ecosystem-header><h4>{isZh ? "海量MCP和SKILL" : "Countless MCP tools and skills"}<br /><span>{isZh ? "随心接入" : "Connect your way"}</span></h4></div>
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
