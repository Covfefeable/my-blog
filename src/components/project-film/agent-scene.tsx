"use client";

import styles from "./agent-scene.module.css";

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
    <header className={styles.heading} data-team-heading><p>Multi-Agent</p><h4>{isZh ? "开发、测试与代码审查" : "Development, testing and code review"}</h4></header>
    <div className={styles.task} data-team-task>
      <div><span>{roles.host}</span><strong>{isZh ? "给文章图片加上点击预览" : "Add image previews to articles"}</strong></div>
      <span className={styles.dispatch} data-team-dispatch>{isZh ? "拆解任务" : "Delegate"}<svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10h14m-5-5 5 5-5 5" /></svg></span>
    </div>
    <div className={styles.deck} data-team-deck>
      <article className={styles.agent} data-team-card data-team-developer>
        <header><div><h5>{roles.developer}</h5><p>{isZh ? "实现预览交互" : "Build the interaction"}</p></div><i /></header>
        <div className={styles.agentBody}>
          <div className={styles.file}><span data-team-file>ImagePreview.tsx</span><span className={styles.incoming} data-team-incoming>{isZh ? "审查者 · 补上背景滚动锁定" : "Reviewer · Add scroll locking"}</span></div>
          <pre className={styles.code}><code><span data-team-code><b>function</b> openPreview(src) {'{'}</span><span data-team-code>  setImage(src)</span><span data-team-code>  dialog.showModal()</span><span className={styles.fixLine} data-team-fix>+ lockPageScroll()</span><span data-team-code>{'}'}</span></code></pre>
          <div className={styles.revision} data-team-revision><Check />{isZh ? "滚动锁定已补齐" : "Scroll lock added"}</div>
        </div>
      </article>
      <article className={styles.agent} data-team-card data-team-tester>
        <header><div><h5>{roles.tester}</h5><p>{isZh ? "验证真实操作" : "Test the interaction"}</p></div><i /></header>
        <div className={styles.agentBody}>
          <div className={styles.testCanvas}><div className={styles.testImage} data-team-test-image><svg aria-hidden="true" viewBox="0 0 180 80"><rect width="180" height="80" rx="4" fill="#c9ddd0" /><circle cx="135" cy="22" r="10" fill="#f4e6ba" /><path d="m0 80 53-55 41 42 24-25 62 38Z" fill="#6d9a7b" /><path d="m0 80 70-29 55 29Z" fill="#426d52" /></svg></div><span className={styles.cursor} data-team-cursor><svg width="22" height="26" viewBox="0 0 22 26" fill="currentColor" stroke="#fff" strokeWidth="1.5"><path d="M2 2v20l6-6 5 8 4-2-5-8h8Z" /></svg></span></div>
          <ul className={styles.tests}>{(isZh ? ["点击放大", "Esc 关闭", "焦点返回"] : ["Click to enlarge", "Escape to close", "Focus restored"]).map((text, index) => <li data-team-check key={index}><Check /><span>{text}</span></li>)}</ul>
        </div>
      </article>
      <article className={styles.agent} data-team-card data-team-reviewer>
        <header><div><h5>{roles.reviewer}</h5><p>{isZh ? "检查交互边界" : "Review the details"}</p></div><i /></header>
        <div className={styles.agentBody}>
          <p className={styles.reviewIntro}>{isZh ? "预览打开以后，背景页面呢？" : "What happens to the page behind the preview?"}</p>
          <div className={styles.finding} data-team-finding><span>!</span><div><strong>{isZh ? "背景仍可滚动" : "Background still scrolls"}</strong><p>{isZh ? "打开时锁定，关闭后恢复。" : "Lock on open. Restore on close."}</p></div></div>
          <div className={styles.handoff} data-team-return>{isZh ? "已反馈给开发者 →" : "Sent to Developer →"}</div>
          <div className={styles.approved} data-team-approved><Check /><strong>{isZh ? "复查通过" : "Review approved"}</strong></div>
        </div>
      </article>
    </div>
    <div className={styles.result} data-team-result>
      <div className={styles.resultCopy}><span className={styles.complete}><Check />{isZh ? "已合并" : "Merged"}</span><h5>{isZh ? "图片预览已完成" : "Image preview implemented"}</h5><p>{isZh ? "点击放大、Esc 关闭，关闭后恢复页面滚动。" : "Click to enlarge, Escape to close. Page scrolling is restored on dismissal."}</p></div>
      <div className={styles.delivery}>
        <header><span>ImagePreview.tsx</span><strong>{isZh ? "交付完成" : "Ready"}</strong></header>
        <ul>{[
          { role: "developer", label: roles.developer, zh: "图片放大与关闭", en: "Image enlargement and dismissal" },
          { role: "tester", label: roles.tester, zh: "点击、Esc、焦点返回", en: "Click, Escape and focus restoration" },
          { role: "reviewer", label: roles.reviewer, zh: "背景滚动锁定与恢复", en: "Background scroll locking and restoration" },
        ].map(item => <li key={item.role}><div><span>{item.label}</span><strong>{isZh ? item.zh : item.en}</strong></div><Check /></li>)}</ul>
      </div>
    </div>
  </div>;
}
