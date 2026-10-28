"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CapabilityScenes from "./capability-scenes";
import styles from "./index.module.css";

export default function ProjectFilm({ isZh }: { isZh: boolean }) {
  const root = useRef<HTMLElement>(null);
  const movie = useRef<HTMLVideoElement>(null);
  const androidMovie = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const fullMovie = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [videoRatio, setVideoRatio] = useState(1600 / 748);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const video = movie.current;
    const phone = androidMovie.current;
    const section = root.current;
    if (!section || !video) return;
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 901px)" }, context => {
      if (!context.conditions?.motion) return;
      const phoneVideo = androidMovie.current;
      if (!phoneVideo) return;
      const heads = [{ video, requested: 0 }, { video: phoneVideo, requested: 0 }];
      const seeks = heads.map((head) => {
        const seek = () => { if (!head.video.seeking && Number.isFinite(head.video.duration) && Math.abs(head.video.currentTime - head.requested) > .07) head.video.currentTime = head.requested; };
        head.video.pause();
        head.video.addEventListener("seeked", seek);
        return seek;
      });
      const stage = section.querySelector<HTMLElement>(`.${styles.cinema}`)!;
      const letter = section.querySelector<HTMLElement>(`.${styles.initialO}`)!;
      const frames = section.querySelector<HTMLElement>(`.${styles.frames}`)!;
      const members = Array.from(section.querySelectorAll<HTMLElement>("[data-agent]"));
      const previous = {
        background: stage.style.backgroundColor, letter: letter.style.transform, clip: frames.style.clipPath,
        members: members.map(member => ({ background: member.style.backgroundColor, color: member.style.color })),
      };
      letter.style.removeProperty("transform");
      let geometry = { centerX: 0, centerY: 0, shiftX: 0, shiftY: 0, frameX: 0, frameY: 0, width: 1, height: 1, scale: 1 };
      const measurePortal = () => {
        const stageBox = stage.getBoundingClientRect();
        const wordBox = letter.parentElement!.getBoundingClientRect();
        const frameBox = frames.getBoundingClientRect();
        const centerX = wordBox.left + letter.offsetLeft + letter.offsetWidth / 2;
        const centerY = wordBox.top + letter.offsetTop + letter.offsetHeight / 2;
        geometry = {
          centerX, centerY, shiftX: stageBox.left + stageBox.width / 2 - centerX,
          shiftY: stageBox.top + stageBox.height / 2 - centerY, frameX: frameBox.left, frameY: frameBox.top,
          width: letter.offsetWidth, height: letter.offsetHeight,
          scale: Math.max(stageBox.width / (letter.offsetWidth * .56), stageBox.height / (letter.offsetHeight * .54)) * 1.6,
        };
      };
      const clamp = gsap.utils.clamp(0, 1);
      const colors = [
        { start: .18, end: .4, from: "#f1eee7", to: "#dfeaf5" },
        { start: .83, end: 1.03, from: "#dfeaf5", to: "#f0e3d6" },
        { start: 1.53, end: 1.88, from: "#f0e3d6", to: "#e7e0f2" },
        { start: 2.04, end: 2.29, from: "#e7e0f2", to: "#dcebe3" },
        { start: 3.25, end: 3.49, from: "#dcebe3", to: "#f3e4cf" },
        { start: 4.96, end: 5.4, from: "#f3e4cf", to: "#e8e4dc" },
        { start: 5.82, end: 6.17, from: "#e8e4dc", to: "#f4f5f2" },
      ].map(color => color.start >= 2 ? { ...color, start: color.start + .4, end: color.end + .4 } : color);
      let animation: gsap.core.Timeline | undefined;
      const renderFrame = () => {
        if (!animation) return;
        const time = animation.time();
        const zoom = Math.pow(clamp((time - .12) / .3), 3);
        const scale = 1 + (geometry.scale - 1) * zoom;
        const x = geometry.shiftX * zoom, y = geometry.shiftY * zoom;
        letter.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        frames.style.clipPath = `ellipse(${geometry.width * .28 * scale}px ${geometry.height * .27 * scale}px at ${geometry.centerX + x - geometry.frameX}px ${geometry.centerY + y - geometry.frameY}px)`;
        let background = "#f1eee7";
        for (const color of colors) {
          if (time < color.start) break;
          background = gsap.utils.interpolate(color.from, color.to, clamp((time - color.start) / (color.end - color.start)));
        }
        stage.style.backgroundColor = background;
        heads.forEach((head, index) => {
          const progress = index === 0 ? clamp((time - .43) / .34) : clamp((time - 1.88) / .44);
          head.requested = Number.isFinite(head.video.duration) ? progress * Math.max(0, head.video.duration - .1) : 0;
          seeks[index]();
        });
        const activeIndex = time < 2.69 ? -1 : Math.min(4, Math.floor((time - 2.69) / .18));
        const activeRole = ["host", "developer", "reviewer", "developer", "host"][activeIndex];
        members.forEach(member => {
          const active = member.dataset.agent === activeRole;
          member.style.backgroundColor = active ? "#cfe2c4" : "#edf1e9";
          member.style.color = active ? "#244f30" : "#63725b";
        });
      };
      measurePortal();
      const timeline = gsap.timeline({
        onUpdate: renderFrame,
        scrollTrigger: {
          trigger: stage, start: "top top", end: () => innerWidth > 900 ? "+=1000%" : "+=780%",
          pin: true, scrub: .65, invalidateOnRefresh: false,
          onRefresh: () => { measurePortal(); renderFrame(); },
        },
      });
      animation = timeline;
      heads.forEach(head => head.video.addEventListener("loadedmetadata", renderFrame));
      timeline.to(section.querySelectorAll(`.${styles.wordRest}, .${styles.headline} > p`), { autoAlpha: 0, duration: .1 }, .1)
        .fromTo(section.querySelector(`.${styles.browserShell}`), { scale: .94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .14 }, .27)
        .to(section.querySelector(`.${styles.headline}`), { autoAlpha: 0, duration: .04 }, .42)
        .fromTo(section.querySelector(`.${styles.chapterOne}`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .07 }, .44)
        .to(section.querySelector(`.${styles.chapterOne}`), { autoAlpha: 0, y: -15, duration: .06 }, .54)
        .fromTo(section.querySelector(`.${styles.chapterTwo}`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .08 }, .58)
        .to(section.querySelector(`.${styles.browserShell}`), { scale: .84, yPercent: -10, autoAlpha: 0, duration: .13 }, .77)
        .to(section.querySelector(`.${styles.chapterTwo}`), { autoAlpha: 0, duration: .06 }, .78)
        .fromTo(section.querySelector(`.${styles.bridge}`), { autoAlpha: 0 }, { autoAlpha: 1, duration: .06 }, .89)
        .fromTo(section.querySelectorAll("[data-bridge-line]"), { autoAlpha: 0, y: 45 }, { autoAlpha: 1, y: 0, duration: .09, stagger: .06 }, .9)
        .to(section.querySelector("[data-bridge-first]"), { autoAlpha: 0, y: -65, duration: .16, ease: "power2.inOut" }, 1.14)
        .to(section.querySelector("[data-phone-prefix]"), { autoAlpha: 0, x: -25, duration: .18, ease: "power2.inOut" }, 1.16)
        .to(section.querySelector("[data-phone-word]"), {
          x: () => -section.querySelector<HTMLElement>("[data-phone-prefix]")!.offsetWidth / 2,
          y: () => -parseFloat(getComputedStyle(section.querySelector("[data-phone-line]")!).lineHeight) / 2,
          scale: 2.2, transformOrigin: "50% 50%", transformPerspective: 900,
          duration: .62, ease: "power2.inOut",
        }, 1.16)
        .to(section.querySelector("[data-phone-word]"), { rotationY: -90, rotationX: 12, duration: .38, ease: "power2.inOut" }, 1.4)
        .to(section.querySelector("[data-phone-word]"), { autoAlpha: 0, duration: .26, ease: "power2.inOut" }, 1.52)
        .fromTo(section.querySelector(`.${styles.androidShell}`), { autoAlpha: 0, scale: .78, yPercent: 18 }, { autoAlpha: 1, scale: 1, yPercent: 0, duration: .38, ease: "power2.inOut" }, 1.53)
        .fromTo(section.querySelector(`.${styles.chapterThree}`), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .08 }, 1.88)
        .to(section.querySelector(`.${styles.androidShell}`), { scale: .84, yPercent: -8, autoAlpha: 0, duration: .16 }, 1.98)
        .to(section.querySelector(`.${styles.chapterThree}`), { autoAlpha: 0, duration: .1 }, 1.98)
        .fromTo(section.querySelector("[data-collab-scene]"), { autoAlpha: 0, scale: .92, y: 50 }, { autoAlpha: 1, scale: 1, y: 0, duration: .18 }, 2.08);

      section.querySelectorAll<HTMLElement>("[data-agent-message]").forEach((message, index) => {
        const at = 2.25 + index * .18;
        timeline.fromTo(message, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .13, ease: "power2.out" }, at);
      });
      timeline.to(section.querySelector("[data-collab-scene]"), { scale: .45, autoAlpha: 0, duration: .22, ease: "power2.inOut" }, 3.2)
        .fromTo(section.querySelector("[data-ecosystem-scene]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .12 }, 3.35)
        .fromTo(section.querySelector("[data-ability-hub]"), { xPercent: -50, yPercent: -50, x: 0, y: 0, top: "55%", scale: .4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .2, ease: "power2.out" }, 3.36);

      const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-ability]")).filter(card => getComputedStyle(card).display !== "none");
      const coordinate = (card: HTMLElement, axis: "x" | "y") => {
        const mobile = innerWidth <= 900;
        return Number(card.dataset[mobile ? (axis === "x" ? "mobileX" : "mobileY") : axis]) * (axis === "x" ? stage.clientWidth : stage.clientHeight);
      };
      timeline.fromTo(cards, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: .08, rotation: 0, autoAlpha: 0 }, {
        x: (_index, card) => coordinate(card, "x"), y: (_index, card) => coordinate(card, "y"),
        scale: index => .65 + (index % 5) * .14, rotation: index => (index % 2 ? 1 : -1) * (5 + index % 5 * 3), autoAlpha: 1,
        duration: .34, stagger: { amount: .045, from: "center" }, ease: "expo.out",
      }, 3.5)
        .fromTo(section.querySelector("[data-ecosystem-header]"), { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: .2 }, 3.65)
        .fromTo(section.querySelector("[data-ecosystem-note]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .15 }, 3.85)
        .to(section.querySelectorAll("[data-ecosystem-header], [data-ecosystem-note]"), { autoAlpha: 0, duration: .15 }, 4.43)
        .to(cards, { x: (_index, card) => coordinate(card, "x") * 2.8, y: (_index, card) => coordinate(card, "y") * 2.8, scale: .55, rotation: index => index % 2 ? 40 : -40, autoAlpha: 0, duration: .4, stagger: { amount: .06, from: "edges" }, ease: "power2.in" }, 4.45)
        .to(section.querySelector("[data-ability-hub] strong"), { autoAlpha: 0, duration: .18 }, 4.96)
        .to(section.querySelector<HTMLElement>("[data-ability-hub]"), {
          scale: 1.5, top: "50%", y: () => {
            const hub = section.querySelector<HTMLElement>("[data-ability-hub]")!;
            const image = hub.querySelector<HTMLElement>("img")!;
            return (hub.offsetHeight / 2 - image.offsetTop - image.offsetHeight / 2) * 1.5;
          }, duration: .55, ease: "power2.inOut",
        }, 4.96)
        .fromTo(section.querySelector("[data-ecosystem-outro]"), { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: .25 }, 5.26)
        .to(section.querySelector("[data-ability-hub]"), { autoAlpha: 0, y: () => {
          const hub = section.querySelector<HTMLElement>("[data-ability-hub]")!;
          const image = hub.querySelector<HTMLElement>("img")!;
          return (hub.offsetHeight / 2 - image.offsetTop - image.offsetHeight / 2) * 1.5 - 85;
        }, scale: 1.55, duration: .35, ease: "power2.inOut" }, 5.8)
        .to(section.querySelector("[data-ecosystem-outro]"), { autoAlpha: 0, y: -55, duration: .3, ease: "power2.inOut" }, 5.83)
        .fromTo(section.querySelector("[data-end-content]"), { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: .3, ease: "power2.out" }, 5.96);
      timeline.shiftChildren(.4, true, 1.98);
      timeline.scrollTrigger?.refresh();
      renderFrame();
      return () => {
        animation = undefined;
        heads.forEach((head, index) => {
          head.video.removeEventListener("seeked", seeks[index]);
          head.video.removeEventListener("loadedmetadata", renderFrame);
        });
        timeline.kill();
        stage.style.backgroundColor = previous.background;
        letter.style.transform = previous.letter;
        frames.style.clipPath = previous.clip;
        members.forEach((member, index) => {
          member.style.backgroundColor = previous.members[index].background;
          member.style.color = previous.members[index].color;
        });
      };
    });
    const stopWhenHidden = () => { if (document.hidden) { video.pause(); androidMovie.current?.pause(); } };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => { media.revert(); phone?.pause(); document.removeEventListener("visibilitychange", stopWhenHidden); };
  }, []);

  const openFilm = () => {
    dialog.current?.showModal();
    if (fullMovie.current) { fullMovie.current.currentTime = 0; void fullMovie.current.play().catch(() => {}); }
  };

  return <section className={styles.showcase} ref={root} aria-label="OhMyCode" style={{ "--movie-ratio": videoRatio } as CSSProperties}>
    <div className={styles.cinema} data-film-stage>
      <div className={styles.headline}><h3 aria-label="OhMyCode"><span className={styles.initialO} aria-hidden="true">O</span><span className={styles.wordRest} aria-hidden="true">hMyCode</span></h3><p>{isZh ? "写代码。也走出编辑器。" : "Write code. Go beyond the editor."}</p></div>
      <div className={styles.frames}>
      <div className={`${styles.videoShell} ${styles.browserShell}`}>
        <video ref={movie} className={styles.movie} width={1600} height={748} muted playsInline preload="metadata" poster="/projects/ohmycode/browser-poster.jpg" onLoadedMetadata={(event) => { const video = event.currentTarget; if (video.videoHeight) setVideoRatio(video.videoWidth / video.videoHeight); }} onError={() => setFailed(true)} aria-label={isZh ? "OhMyCode 真实客户端：Agent 操作内置浏览器" : "Actual OhMyCode client: an agent operating its built-in browser"}>
          <source src="/projects/ohmycode/browser-demo.mp4" type="video/mp4" />
        </video>
        {failed && <p className={styles.failure}>{isZh ? "视频未能加载。" : "The video could not load."}<button onClick={() => { setFailed(false); movie.current?.load(); }}>{isZh ? "重试" : "Retry"}</button></p>}
      </div>
      <div className={`${styles.videoShell} ${styles.androidShell}`}>
        <video ref={androidMovie} className={styles.androidMovie} width={2038} height={1000} muted playsInline preload="auto" poster="/projects/ohmycode/android-poster.jpg" aria-label={isZh ? "Android 设备操作实录" : "Android device recording"}><source src="/projects/ohmycode/android-demo.mp4" type="video/mp4" /></video>
      </div>
      </div>
      <div className={styles.bridge} aria-hidden="true">
        <h4><span data-bridge-line data-bridge-first>{isZh ? "浏览器之外，" : "Beyond the browser."}</span><span data-bridge-line data-phone-line><span data-phone-prefix>{isZh ? "还有你的" : "Onto your "}</span><span data-phone-word>{isZh ? "手机" : "phone"}</span></span></h4>
      </div>
      <CapabilityScenes isZh={isZh} />
      <div className={styles.captions} aria-hidden="true">
        <p className={styles.chapterOne}>{isZh ? "说出任务。" : "Describe the task."}</p>
        <p className={styles.chapterTwo}>{isZh ? "看它动手。" : "Watch it work."}</p>
        <p className={styles.chapterThree}>{isZh ? "再把任务，交给手机。" : "Take the task to your phone."}</p>
      </div>
      <div className={styles.detailsScene} data-end-content>
    <div className={styles.details}>
      <p className={styles.description}>{isZh ? "自选模型，本地执行。对话、终端和浏览器，在同一个工作空间里推进任务。" : "Your model. Local execution. Conversations, terminals and a browser, working in one workspace."}</p>
      <div className={styles.links}><button onClick={openFilm}>{isZh ? "观看真实演示" : "Watch the demo"} <span aria-hidden="true">↗</span></button><a href="https://github.com/Covfefeable/ohmycode" target="_blank" rel="noreferrer">GitHub ↗</a></div>
      <p className={styles.support}>{isZh ? "也支持 Android 设备操控、主持人调度的多 Agent 群聊、语音，以及 MCP / Skills。" : "Also supports Android control, host-directed multi-agent chat, voice, MCP and Skills."}</p>
    </div>
      </div>
    </div>
    <dialog ref={dialog} className={styles.dialog} onClose={() => fullMovie.current?.pause()} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className={styles.close} type="button" autoFocus onClick={() => dialog.current?.close()} aria-label={isZh ? "关闭视频" : "Close video"}>×</button>
      <video ref={fullMovie} controls playsInline preload="none" poster="/projects/ohmycode/browser-poster.jpg" aria-label={isZh ? "OhMyCode 完整演示视频" : "OhMyCode demo video"}><source src="/projects/ohmycode/browser-full.mp4" type="video/mp4" /></video>
    </dialog>
  </section>;
}
