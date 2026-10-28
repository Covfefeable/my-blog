"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./index.module.css";

export default function ProjectFilm({ isZh }: { isZh: boolean }) {
  const root = useRef<HTMLElement>(null);
  const movie = useRef<HTMLVideoElement>(null);
  const androidMovie = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const fullMovie = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [videoRatio, setVideoRatio] = useState(1600 / 748);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const video = movie.current;
    const phone = androidMovie.current;
    const section = root.current;
    if (!section || !video) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const phoneVideo = androidMovie.current;
      if (!phoneVideo) return;
      const heads = [{ video, progress: 0, requested: 0 }, { video: phoneVideo, progress: 0, requested: 0 }];
      const seeks = heads.map((head) => {
        const seek = () => { if (!head.video.seeking && Number.isFinite(head.video.duration) && Math.abs(head.video.currentTime - head.requested) > .07) head.video.currentTime = head.requested; };
        head.video.pause();
        head.video.addEventListener("seeked", seek);
        return seek;
      });
      const update = (index: number) => {
        const head = heads[index];
        head.requested = Number.isFinite(head.video.duration) ? head.progress * Math.max(0, head.video.duration - .1) : 0;
        seeks[index]();
      };
      const stage = section.querySelector<HTMLElement>(`.${styles.cinema}`)!;
      const letter = section.querySelector<HTMLElement>(`.${styles.initialO}`)!;
      const frames = section.querySelector<HTMLElement>(`.${styles.frames}`)!;
      const stageBox = stage.getBoundingClientRect();
      const letterBox = letter.getBoundingClientRect();
      const frameBox = frames.getBoundingClientRect();
      const centerX = letterBox.left + letterBox.width / 2;
      const centerY = letterBox.top + letterBox.height / 2;
      const shiftX = stageBox.left + stageBox.width / 2 - centerX;
      const shiftY = stageBox.top + stageBox.height / 2 - centerY;
      const portal = { scale: 1, shift: 0 };
      const targetScale = Math.max(stageBox.width / (letterBox.width * .56), stageBox.height / (letterBox.height * .54)) * 1.6;
      const drawPortal = () => {
        gsap.set(letter, { scale: portal.scale, x: shiftX * portal.shift, y: shiftY * portal.shift, transformOrigin: "50% 50%" });
        frames.style.clipPath = `ellipse(${letterBox.width * .28 * portal.scale}px ${letterBox.height * .27 * portal.scale}px at ${centerX + shiftX * portal.shift - frameBox.left}px ${centerY + shiftY * portal.shift - frameBox.top}px)`;
      };
      drawPortal();
      const timeline = gsap.timeline({ scrollTrigger: { trigger: section.querySelector(`.${styles.cinema}`), start: "top top", end: () => innerWidth > 900 ? "+=320%" : "+=240%", pin: true, scrub: .65, invalidateOnRefresh: true } });
      timeline.to(section.querySelectorAll(`.${styles.wordRest}, .${styles.headline} > p`), { autoAlpha: 0, duration: .1 }, .1)
        .to(portal, { scale: targetScale, shift: 1, duration: .3, ease: "power2.in", onUpdate: drawPortal }, .12)
        .fromTo(section.querySelector(`.${styles.browserShell}`), { scale: .94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .14 }, .27)
        .to(section.querySelector(`.${styles.headline}`), { autoAlpha: 0, duration: .04 }, .42)
        .fromTo(section.querySelector(`.${styles.chapterOne}`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .07 }, .44)
        .to(section.querySelector(`.${styles.chapterOne}`), { autoAlpha: 0, y: -15, duration: .06 }, .54)
        .fromTo(section.querySelector(`.${styles.chapterTwo}`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .08 }, .58)
        .to(heads[0], { progress: 1, ease: "none", duration: .34, onUpdate: () => update(0) }, .43)
        .to(section.querySelector(`.${styles.browserShell}`), { scale: .84, yPercent: -10, autoAlpha: 0, duration: .13 }, .77)
        .to(section.querySelector(`.${styles.chapterTwo}`), { autoAlpha: 0, duration: .06 }, .78)
        .to(stage, { backgroundColor: "#d4dfcf", duration: .2 }, .83)
        .fromTo(section.querySelector(`.${styles.bridge}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: .06 }, .89)
        .fromTo(section.querySelectorAll(`.${styles.bridge} h4 span`), { autoAlpha: 0, y: 45 }, { autoAlpha: 1, y: 0, duration: .09, stagger: .06 }, .9)
        .to(section.querySelector(`.${styles.bridge} h4 span:first-child`), { autoAlpha: 0, y: -65, duration: .22, ease: "power2.inOut" }, 1.14)
        .to(section.querySelector(`.${styles.bridge} h4 span:last-child`), { scale: 2.2, y: -95, autoAlpha: 0, duration: .36, ease: "power2.inOut", transformOrigin: "50% 50%" }, 1.2)
        .fromTo(section.querySelector(`.${styles.androidShell}`), { autoAlpha: 0, scale: .78, yPercent: 18 }, { autoAlpha: 1, scale: 1, yPercent: 0, duration: .38, ease: "power2.inOut" }, 1.24)
        .fromTo(section.querySelector(`.${styles.chapterThree}`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .08 }, 1.52)
        .to(heads[1], { progress: 1, ease: "none", duration: .4, onUpdate: () => update(1) }, 1.52);
      return () => { heads.forEach((head, index) => head.video.removeEventListener("seeked", seeks[index])); timeline.kill(); frames.style.removeProperty("clip-path"); };
    });
    const stopWhenHidden = () => { if (document.hidden) { video.pause(); androidMovie.current?.pause(); } };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => { media.revert(); phone?.pause(); document.removeEventListener("visibilitychange", stopWhenHidden); };
  }, [ready]);

  const openFilm = () => {
    dialog.current?.showModal();
    if (fullMovie.current) { fullMovie.current.currentTime = 0; void fullMovie.current.play().catch(() => {}); }
  };

  return <section className={styles.showcase} ref={root} aria-label="OhMyCode" style={{ "--movie-ratio": videoRatio } as CSSProperties}>
    <div className={styles.cinema}>
      <div className={styles.headline}><h3 aria-label="OhMyCode"><span className={styles.initialO} aria-hidden="true">O</span><span className={styles.wordRest} aria-hidden="true">hMyCode</span></h3><p>{isZh ? "写代码。也走出编辑器。" : "Write code. Go beyond the editor."}</p></div>
      <div className={styles.frames}>
      <div className={`${styles.videoShell} ${styles.browserShell}`}>
        <video ref={movie} className={styles.movie} width={1600} height={748} muted playsInline preload="metadata" poster="/projects/ohmycode/browser-poster.jpg" onLoadedMetadata={(event) => { const video = event.currentTarget; if (video.videoHeight) setVideoRatio(video.videoWidth / video.videoHeight); }} onLoadedData={() => setReady(true)} onError={() => setFailed(true)} aria-label={isZh ? "OhMyCode 真实客户端：Agent 操作内置浏览器" : "Actual OhMyCode client: an agent operating its built-in browser"}>
          <source src="/projects/ohmycode/browser-demo.mp4" type="video/mp4" />
        </video>
        {failed && <p className={styles.failure}>{isZh ? "视频未能加载。" : "The video could not load."}<button onClick={() => { setFailed(false); movie.current?.load(); }}>{isZh ? "重试" : "Retry"}</button></p>}
      </div>
      <div className={`${styles.videoShell} ${styles.androidShell}`}>
        <video ref={androidMovie} className={styles.androidMovie} width={2038} height={1000} muted playsInline preload="auto" poster="/projects/ohmycode/android-poster.jpg" aria-label={isZh ? "Android 设备操作实录" : "Android device recording"}><source src="/projects/ohmycode/android-demo.mp4" type="video/mp4" /></video>
      </div>
      </div>
      <div className={styles.bridge} aria-hidden="true">
        <h4><span>{isZh ? "浏览器之外，" : "Beyond the browser."}</span><span>{isZh ? "还有你的手机。" : "Onto your phone."}</span></h4>
      </div>
      <div className={styles.captions} aria-hidden="true">
        <p className={styles.chapterOne}>{isZh ? "说出任务。" : "Describe the task."}</p>
        <p className={styles.chapterTwo}>{isZh ? "看它动手。" : "Watch it work."}</p>
        <p className={styles.chapterThree}>{isZh ? "再把任务，交给手机。" : "Take the task to your phone."}</p>
      </div>
    </div>
    <div className={styles.details}>
      <p className={styles.description}>{isZh ? "自选模型，本地执行。对话、终端和浏览器，在同一个工作空间里推进任务。" : "Your model. Local execution. Conversations, terminals and a browser, working in one workspace."}</p>
      <div className={styles.links}><button onClick={openFilm}>{isZh ? "观看真实演示" : "Watch the demo"} <span aria-hidden="true">↗</span></button><a href="https://github.com/Covfefeable/ohmycode" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      <p className={styles.support}>{isZh ? "也支持 Android 设备操控、主持人调度的多 Agent 群聊、语音，以及 MCP / Skills。" : "Also supports Android control, host-directed multi-agent chat, voice, MCP and Skills."}</p>
    </div>
    <dialog ref={dialog} className={styles.dialog} onClose={() => fullMovie.current?.pause()} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className={styles.close} type="button" autoFocus onClick={() => dialog.current?.close()} aria-label={isZh ? "关闭视频" : "Close video"}>×</button>
      <video ref={fullMovie} controls playsInline preload="none" poster="/projects/ohmycode/browser-poster.jpg" aria-label={isZh ? "OhMyCode 完整演示视频" : "OhMyCode demo video"}><source src="/projects/ohmycode/browser-full.mp4" type="video/mp4" /></video>
    </dialog>
  </section>;
}
