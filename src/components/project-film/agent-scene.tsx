"use client";

import styles from "./agent-scene.module.css";
import VoiceOrb from "./voice-orb";


const thoughtNotes = [
  { kind: "read", zh: "正在读取", en: "Reading", file: "article-content.tsx" },
  { kind: "think", zh: "正在思考", en: "Thinking", file: "" },
  { kind: "edit", zh: "正在编辑", en: "Editing", file: "ImagePreview.tsx" },
  { kind: "read", zh: "正在读取", en: "Reading", file: "ImagePreview.module.css" },
  { kind: "edit", zh: "正在编辑", en: "Editing", file: "useScrollLock.ts" },
  { kind: "think", zh: "正在思考", en: "Thinking", file: "" },
  { kind: "read", zh: "正在读取", en: "Reading", file: "preview.spec.tsx" },
  { kind: "edit", zh: "正在编辑", en: "Editing", file: "ImagePreview.tsx" },
] as const;

function ActivityIcon({ kind }: { kind: string }) {
  return <svg className={kind === "think" ? styles.spinner : undefined} width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">{kind === "think" ? <path d="M16 10a6 6 0 1 1-6-6" /> : kind === "edit" ? <path d="m4 13 9-9 3 3-9 9-4 1Z M11 6l3 3" /> : <><path d="M5 2h7l4 4v12H5Z M12 2v5h4 M8 11h5 M8 14h5" /></>}</svg>;
}

function Check() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m4 10 4 4 8-8" /></svg>;
}

export default function AgentScene({ isZh }: { isZh: boolean }) {
  const roles = {
    host: isZh ? "主持人" : "Host",
    developer: isZh ? "开发者" : "Developer",
    tester: isZh ? "测试者" : "Tester",
    reviewer: isZh ? "审查者" : "Reviewer",
  };
  return <div className={styles.scene} data-collab-scene aria-label={isZh ? "多 Agent 协作演示" : "Multi-agent collaboration demo"}>
    <div className={styles.thinkingBackdrop} data-team-thoughts aria-hidden="true">
      {[0, 1].map(side => <div className={`${styles.thinkingColumn} ${side ? styles.thinkingRight : styles.thinkingLeft}`} key={side}><div className={styles.thinkingTrack}>
        {[...thoughtNotes, ...thoughtNotes].map((_, index) => {
          const note = thoughtNotes[(index + side * 3) % thoughtNotes.length];
          return <div className={styles.thinkingNote} key={index}><ActivityIcon kind={note.kind} /><span>{isZh ? note.zh : note.en}</span>{note.file && <code>{note.file}</code>}</div>;
        })}
      </div></div>)}
    </div>
    <header className={styles.heading} data-team-heading><p>Multi-Agent</p><h4>{isZh ? "多 Agent 协同，事半功倍" : "Multiple agents. Greater impact."}</h4></header>
    <div className={styles.task} data-team-task>
      <div><span>{roles.host}</span><strong data-team-task-text>{isZh ? "给文章中的图片加上点击预览功能" : "Add click-to-preview functionality to article images"}</strong></div>
      <span className={styles.dispatch} data-team-dispatch>{isZh ? "拆解任务" : "Delegate"}<svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10h14m-5-5 5 5-5 5" /></svg></span>
    </div>
    <VoiceOrb />
    <div className={styles.deck} data-team-deck>
      <article className={styles.agent} data-team-card data-team-developer>
        <header><div><h5>{roles.developer}</h5><p>{isZh ? "实现预览交互" : "Build the interaction"}</p></div><i /></header>
        <div className={styles.agentBody}>
          <div className={styles.file}><span data-team-file>ImagePreview.tsx</span><span className={styles.incoming} data-team-incoming>{isZh ? "测试者 · 补上背景滚动锁定" : "Tester · Add scroll locking"}</span></div>
          <pre className={styles.code}><code><span data-team-code><b>function</b> openPreview(src) {'{'}</span><span data-team-code>  setImage(src)</span><span data-team-code>  dialog.showModal()</span><span className={styles.fixLine} data-team-fix>+ lockPageScroll()</span><span data-team-code>{'}'}</span></code></pre>
          <div className={styles.revision} data-team-revision><Check />{isZh ? "滚动锁定已补齐" : "Scroll lock added"}</div>
        </div>
      </article>
      <article className={styles.agent} data-team-card data-team-reviewer>
        <header><div><h5>{roles.reviewer}</h5><p>{isZh ? "检查打开与关闭的代码" : "Inspect the implementation"}</p></div><i /></header>
        <div className={styles.agentBody}>
          <div className={styles.file}>ImagePreview.tsx</div>
          <div className={styles.inspection}>
            <code><span>function openPreview(src) {'{'}</span><span>  setImage(src)</span><span>  dialog.showModal()</span><span>{'}'}</span></code>
            <span className={styles.lens} data-team-lens aria-hidden="true" />
          </div>
          <div className={styles.reviewStatus} data-team-review-pass><Check />{isZh ? "代码检查通过" : "Code review passed"}</div>
        </div>
      </article>
      <article className={styles.agent} data-team-card data-team-tester>
        <header data-team-test-header><div><h5>{roles.tester}</h5><p>{isZh ? "验证真实操作" : "Test the interaction"}</p></div><i /></header>
        <div className={styles.agentBody} data-team-test-body>
          <div className={styles.testCanvas} data-team-test-canvas>
            <div className={styles.browserBar}><i /><i /><i /><span>llmol.com / posts / 7</span></div>
            <div className={styles.articleViewport}>
              <div className={styles.testPage} data-team-test-page>
                <span>WEB SECURITY</span><h6>{isZh ? "前端反调试的手段与应用" : "Anti-debugging in the browser"}</h6>
                <p>{isZh ? "从浏览器出发，探索代码保护与调试之间的边界。" : "Exploring code protection and debugging in the browser."}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/articles/7/cover.png" alt={isZh ? "文章配图" : "Article illustration"} />
                <p>{isZh ? "检测执行环境、检查代码完整性，以及程序流保护。" : "Execution environment, code integrity and control flow."}</p>
              </div>
              <div className={styles.preview} data-team-preview>
                <div className={styles.previewToolbar}><span>{isZh ? "图片预览" : "Image preview"}</span><span data-team-close>×</span></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.testImage} data-team-test-image src="/articles/7/cover.png" alt={isZh ? "放大后的文章配图" : "Enlarged article illustration"} />
                <span className={styles.previewHint}>{isZh ? "Esc 关闭" : "Esc to close"}</span>
              </div>
              <span className={styles.scrollProbe} data-team-scroll-probe>{isZh ? "滚动页面 ↓" : "Scroll page ↓"}</span>
              <span className={styles.cursor} data-team-cursor><svg width="22" height="26" viewBox="0 0 22 26" fill="currentColor" stroke="#fff" strokeWidth="1.5"><path d="M2 2v20l6-6 5 8 4-2-5-8h8Z" /></svg></span>
            </div>
          </div>
          <ul className={styles.tests} data-team-tests>{(isZh ? ["点击放大", "Esc 关闭"] : ["Click to enlarge", "Escape to close"]).map((text, index) => <li data-team-check key={index}><Check /><span>{text}</span></li>)}</ul>
          <div className={styles.testOutcome} data-team-test-outcome>
          <div className={styles.finding} data-team-finding><span aria-hidden="true">!</span><strong>{isZh ? "背景仍可滚动" : "Background still scrolls"}</strong></div>
          <div className={styles.handoff} data-team-return>{isZh ? "已反馈给开发者 →" : "Sent to Developer →"}</div>
          <div className={styles.approved} data-team-approved><Check /><strong>{isZh ? "重新测试通过" : "Retest passed"}</strong></div>
          </div>
        </div>
      </article>
    </div>
    <div className={styles.result} data-team-result role="img" aria-label={isZh ? "任务完成" : "Task complete"}><svg className={styles.completionMark} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle data-team-complete-ring cx="32" cy="32" r="27" /><path data-team-complete-check d="m19 32 9 9 18-19" /></svg><span className={styles.confetti} aria-hidden="true">{Array.from({ length: 48 }, (_, index) => <i data-team-confetti key={index} style={{ backgroundColor: ["#397c50", "#f1b94c", "#e783a0", "#6f9fd5", "#ba91d2", "#ef8157"][index % 6] }} />)}</span></div>
  </div>;
}
