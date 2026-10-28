"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CapabilityScenes from "./capability-scenes";
import ExternalArrow from "@/components/external-arrow";
import { createAgentAnimation } from "./agent-animation";
import styles from "./index.module.css";

const COLLAB_SPEED = 1.4;
const COLLAB_EXTENSION = 8.12 / COLLAB_SPEED - 1.12;
const VIDEO_SCROLL_FACTOR = 3;
const VIDEO_WINDOWS = [{ start: .43, end: .77 }, { start: 2.4, end: 2.82 }];
const VIDEO_EXTENSION = VIDEO_WINDOWS.reduce((total, window) => total + (window.end - window.start) * (VIDEO_SCROLL_FACTOR - 1), 0);

function narrativeTime(scrollTime: number) {
  let offset = 0;
  for (const window of VIDEO_WINDOWS) {
    const start = window.start + offset;
    const duration = (window.end - window.start) * VIDEO_SCROLL_FACTOR;
    if (scrollTime < start) return scrollTime - offset;
    if (scrollTime <= start + duration) return window.start + (scrollTime - start) / VIDEO_SCROLL_FACTOR;
    offset += (window.end - window.start) * (VIDEO_SCROLL_FACTOR - 1);
  }
  return scrollTime - offset;
}

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
        const seek = () => {
          if (head.video.readyState < 2 || head.video.seeking || !Number.isFinite(head.video.duration)) return;
          if (Math.abs(head.video.currentTime - head.requested) > .07) head.video.currentTime = head.requested;
        };
        head.video.pause();
        head.video.addEventListener("seeked", seek);
        head.video.addEventListener("loadeddata", seek);
        head.video.addEventListener("canplay", seek);
        return seek;
      });
      const stage = section.querySelector<HTMLElement>(`.${styles.cinema}`)!;
      const letter = section.querySelector<HTMLElement>(`.${styles.initialO}`)!;
      const frames = section.querySelector<HTMLElement>(`.${styles.frames}`)!;
      const screen = section.querySelector<HTMLElement>("[data-phone-screen]")!;
      const rain = section.querySelector<HTMLElement>("[data-tool-rain]")!;
      const previous = {
        background: stage.style.backgroundColor, letter: letter.style.transform, clip: frames.style.clipPath,
      };
      letter.style.removeProperty("transform");
      let geometry = { centerX: 0, centerY: 0, shiftX: 0, shiftY: 0, frameX: 0, frameY: 0, width: 1, height: 1, scale: 1, glyphOffset: 0 };
      const measurePortal = () => {
        const stageBox = stage.getBoundingClientRect();
        rain.style.setProperty("--rain-distance", `${stageBox.height + 100}px`);
        const wordBox = letter.parentElement!.getBoundingClientRect();
        const frameBox = frames.getBoundingClientRect();
        // Negative letter spacing shortens the span's advance, but does not shrink the O glyph.
        const spacing = parseFloat(getComputedStyle(letter).letterSpacing) || 0;
        const glyphWidth = letter.offsetWidth - spacing;
        const glyphOffset = -spacing / 2;
        const centerX = wordBox.left + letter.offsetLeft + glyphWidth / 2;
        const centerY = wordBox.top + letter.offsetTop + letter.offsetHeight / 2;
        geometry = {
          centerX, centerY, shiftX: stageBox.left + stageBox.width / 2 - centerX,
          shiftY: stageBox.top + stageBox.height / 2 - centerY, frameX: frameBox.left, frameY: frameBox.top,
          width: glyphWidth, height: letter.offsetHeight, glyphOffset,
          scale: Math.max(stageBox.width / (glyphWidth * .56), stageBox.height / (letter.offsetHeight * .54)) * 1.6,
        };
      };
      const clamp = gsap.utils.clamp(0, 1);
      const colors = [
        { start: .18, end: .4, from: "#f1eee7", to: "#dfeaf5" },
        { start: .83, end: 1.03, from: "#dfeaf5", to: "#f0e3d6" },
        { start: 1.53, end: 1.88, from: "#f0e3d6", to: "#e7e0f2" },
        { start: 2.04, end: 2.29, from: "#e7e0f2", to: "#dcebe3" },
        { start: 3.25, end: 3.49, from: "#dcebe3", to: "#f3e4cf" },
        { start: 5.64, end: 6.19, from: "#f3e4cf", to: "#e8e4dc" },
        { start: 6.98, end: 7.36, from: "#e8e4dc", to: "#f4f5f2" },
      ].map(color => {
        const offset = (color.start >= 2 ? .9 : 0) + (color.start >= 3.2 ? COLLAB_EXTENSION : 0);
        return { ...color, start: color.start + offset, end: color.end + offset };
      });
      let animation: gsap.core.Timeline | undefined;
      const renderFrame = () => {
        if (!animation) return;
        const time = narrativeTime(animation.time());
        rain.dataset.running = String(time >= 4.25 + COLLAB_EXTENSION && time < 6.58 + COLLAB_EXTENSION && !document.hidden);
        const zoom = Math.pow(clamp((time - .12) / .3), 3);
        const scale = 1 + (geometry.scale - 1) * zoom;
        const x = geometry.shiftX * zoom, y = geometry.shiftY * zoom;
        letter.style.transform = `translate(${x - geometry.glyphOffset * (scale - 1)}px, ${y}px) scale(${scale})`;
        frames.style.clipPath = `ellipse(${geometry.width * .29 * scale}px ${geometry.height * .28 * scale}px at ${geometry.centerX + x - geometry.frameX}px ${geometry.centerY + y - geometry.frameY}px)`;
        let background = "#f1eee7";
        for (const color of colors) {
          if (time < color.start) break;
          background = gsap.utils.interpolate(color.from, color.to, clamp((time - color.start) / (color.end - color.start)));
        }
        stage.style.backgroundColor = background;
        // The cropped first frame lands on the exact pixel region inside the Android recording.
        const flip = clamp((time - 1.59) / .19);
        const flight = clamp((time - 1.59) / .49);
        const landing = gsap.parseEase("power2.inOut")(flight);
        const arc = Math.sin(Math.PI * landing);
        const videoWidth = frames.clientWidth;
        const videoHeight = videoWidth * 1000 / 2038;
        const initialHeight = Math.min(stage.clientHeight * .42, 320);
        const initialWidth = initialHeight * 422 / 752;
        const targetWidth = videoWidth * 422 / 2038;
        const targetHeight = videoHeight * 752 / 1000;
        const centerX = stage.clientWidth / 2 + (1819 / 2038 - .5) * videoWidth * landing - arc * Math.min(45, stage.clientWidth * .035);
        const centerY = stage.clientHeight / 2 + (512 / 1000 - .5) * videoHeight * landing - arc * Math.min(130, stage.clientHeight * .15);
        screen.style.width = `${initialWidth + (targetWidth - initialWidth) * landing}px`;
        screen.style.height = `${initialHeight + (targetHeight - initialHeight) * landing}px`;
        screen.style.left = `${centerX}px`;
        screen.style.top = `${centerY}px`;
        screen.style.transform = `translate(-50%, -50%) perspective(2200px) translateZ(${65 * arc}px) rotateZ(${8 * arc}deg) rotateX(${4 * (1 - landing) + 4 * arc}deg) rotateY(${90 * (1 - flip) - 360 * landing}deg)`;
        screen.style.filter = `drop-shadow(0 ${18 * arc}px ${24 * arc}px rgba(20,30,40,${.22 * arc}))`;
        screen.style.opacity = String(time < 1.59 ? 0 : 1 - clamp((time - 2.32) / .08));
        screen.style.visibility = time >= 1.59 && time < 2.4 ? "visible" : "hidden";
        heads.forEach((head, index) => {
          const progress = index === 0 ? clamp((time - .43) / .34) : clamp((time - 2.4) / .42);
          const startTime = index === 1 ? 3 : 0;
          head.requested = Number.isFinite(head.video.duration) ? startTime + progress * Math.max(0, head.video.duration - startTime - .1) : 0;
          seeks[index]();
        });
      };
      measurePortal();
      // Keep the camera distance fixed: tweening it from zero produces a projection singularity.
      gsap.set(section.querySelector("[data-phone-word]"), { transformPerspective: 2200 });
      const timeline = gsap.timeline({
        onUpdate: renderFrame,
        scrollTrigger: {
          trigger: stage, start: "top top", end: () => {
            const distance = (innerWidth > 900 ? 1000 : 780) * (8.32 + COLLAB_EXTENSION + VIDEO_EXTENSION) / 10.32;
            return `+=${distance}%`;
          },
          pin: true, scrub: .65, invalidateOnRefresh: false,
          onRefresh: () => { measurePortal(); renderFrame(); },
        },
      });
      animation = timeline;
      heads.forEach(head => head.video.addEventListener("loadedmetadata", renderFrame));
      document.addEventListener("visibilitychange", renderFrame);
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
          scale: 2.2, transformOrigin: "50% 50%",
          duration: .62, ease: "power2.inOut",
        }, 1.16)
        .to(section.querySelector("[data-phone-word]"), { rotationY: -90, rotationX: 4, duration: .43, ease: "sine.inOut" }, 1.16)
        .to(section.querySelector("[data-phone-word]"), { rotationY: -180, rotationX: 6, duration: .19, ease: "none" }, 1.59)
        .to(section.querySelector("[data-phone-word]"), { autoAlpha: 0, duration: .26, ease: "power2.inOut" }, 1.52)
        .to(section.querySelector(`.${styles.androidShell}`), { scale: .84, yPercent: -8, autoAlpha: 0, duration: .16 }, 1.98)
        .to(section.querySelector(`.${styles.chapterThree}`), { autoAlpha: 0, duration: .1 }, 1.98)
        .fromTo(section.querySelector("[data-collab-scene]"), { autoAlpha: 0, scale: .92, y: 50 }, { autoAlpha: 1, scale: 1, y: 0, duration: .18 }, 2.08);

      timeline.to(section.querySelector("[data-collab-scene]"), { scale: .45, autoAlpha: 0, duration: .22, ease: "power2.inOut" }, 3.2)
        .fromTo(section.querySelector("[data-ecosystem-scene]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .12 }, 3.35)
        .fromTo(rain, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, 3.35)
        .to(rain, { autoAlpha: 0, duration: .18 }, 5.5)
        .fromTo(section.querySelector("[data-ability-hub]"), { xPercent: -50, yPercent: -50, x: 0, y: 0, top: "50%", scale: .4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .2, ease: "power2.out" }, 3.36);

      const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-ability]")).filter(card => getComputedStyle(card).display !== "none");
      const settled: Array<{ card: HTMLElement; x: number; y: number; half: number }> = [];
      const noise = (seed: number) => {
        const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
        return value - Math.floor(value);
      };
      cards.forEach((card, index) => {
        const arrival = 3.5 + index / Math.max(1, cards.length - 1) * .6;
        const size = innerWidth <= 900 ? 46 : 68;
        const scale = .72 + noise(index + 19) * .38;
        const tilt = (noise(index + 71) - .5) * 54;
        const radians = Math.abs(tilt * .4) * Math.PI / 180;
        const half = size * scale * (Math.cos(radians) + Math.sin(radians)) / 2;
        let targetX = 0, targetY = -Infinity;
        // Prefer gaps in the pile over building narrow towers at arbitrary random positions.
        for (let candidate = 0; candidate < 6; candidate++) {
          const x = (noise(index * 13 + candidate + 1) - .5) * (stage.clientWidth - size * 1.5) * .9;
          let y = stage.clientHeight / 2 - half - 12;
          for (const previous of settled) {
            if (Math.abs(x - previous.x) < (half + previous.half) * .85) {
              y = Math.min(y, previous.y - previous.half - half + 4);
            }
          }
          if (y > targetY) {
            targetX = x;
            targetY = y;
          }
        }
        settled.push({ card, x: targetX, y: targetY, half });
        const bounce = (innerWidth <= 900 ? 18 : 28) + index % 4 * 7;
        gsap.set(card, { autoAlpha: 0 });
        timeline.set(card, { autoAlpha: 1 }, arrival).fromTo(card, {
          xPercent: -50, yPercent: -50, x: targetX,
          y: -stage.clientHeight / 2 - 100, z: 0, scale, rotation: -tilt * 2,
        }, {
          y: targetY, rotation: tilt, duration: .22, ease: "power2.in",
        }, arrival)
          .to(card, { y: targetY - bounce, rotation: -tilt, duration: .1, ease: "power2.out" }, arrival + .22)
          .to(card, { y: targetY, rotation: tilt * .6, duration: .08, ease: "power2.in" }, arrival + .32)
          .to(card, { y: targetY - bounce * .25, rotation: -tilt * .3, duration: .06, ease: "power2.out" }, arrival + .4)
          .to(card, { y: targetY, rotation: tilt * .4, duration: .05, ease: "power2.in" }, arrival + .46);
      });
      [...settled].sort((a, b) => a.y - b.y || a.x - b.x).forEach(({ card }, index) => {
        const absorption = 4.7 + index / Math.max(1, cards.length - 1) * .48;
        timeline.to(card, { x: 0, y: 0, z: 0, scale: .035, rotation: 0, duration: .38, ease: "power3.in" }, absorption)
          .to(card, { autoAlpha: 0, duration: .1 }, absorption + .28);
      });
      timeline.fromTo(section.querySelector("[data-ecosystem-header]"), { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: .2 }, 4.7)
        .fromTo(section.querySelector("[data-ecosystem-note]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: .15 }, 4.7)
        .to(section.querySelectorAll("[data-ecosystem-header], [data-ecosystem-note]"), { autoAlpha: 0, duration: .18 }, 5.5)
        .fromTo(section.querySelector("[data-ability-hub]"), { scale: 1, top: "50%", y: 0 }, {
          scale: 1.5, top: "45%", y: 0, duration: .55, ease: "power2.inOut",
        }, 5.64)
        .fromTo(section.querySelector("[data-ability-brand]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .22 }, 6.02)
        .fromTo(section.querySelector("[data-ecosystem-outro]"), { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: .25 }, 6.32)
        .to(section.querySelector("[data-ability-hub]"), { autoAlpha: 0, y: -85, scale: 1.55, duration: .35, ease: "power2.inOut" }, 6.96)
        .to(section.querySelector("[data-ecosystem-outro]"), { autoAlpha: 0, y: -55, duration: .3, ease: "power2.inOut" }, 6.99)
        .fromTo(section.querySelector("[data-end-content]"), { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: .3, ease: "power2.out" }, 7.12);
      timeline.shiftChildren(COLLAB_EXTENSION, true, 3.2);
      timeline.add(createAgentAnimation(section, stage).timeScale(COLLAB_SPEED), 2.08);
      timeline.shiftChildren(.9, true, 1.98);
      timeline.fromTo(section.querySelector(`.${styles.androidShell}`),
        { autoAlpha: 0, scale: 1, yPercent: 0 },
        { autoAlpha: 1, duration: .22, ease: "power2.inOut" }, 2.1)
        .fromTo(section.querySelector(`.${styles.chapterThree}`),
          { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .08 }, 2.32);
      // Insert scrolling room only while each video is playing; keep transition speeds intact.
      for (const window of [...VIDEO_WINDOWS].reverse()) {
        timeline.shiftChildren((window.end - window.start) * (VIDEO_SCROLL_FACTOR - 1), true, window.end);
      }
      timeline.scrollTrigger?.refresh();
      renderFrame();
      return () => {
        animation = undefined;
        document.removeEventListener("visibilitychange", renderFrame);
        delete rain.dataset.running;
        rain.style.removeProperty("--rain-distance");
        heads.forEach((head, index) => {
          head.video.removeEventListener("seeked", seeks[index]);
          head.video.removeEventListener("loadeddata", seeks[index]);
          head.video.removeEventListener("canplay", seeks[index]);
          head.video.removeEventListener("loadedmetadata", renderFrame);
        });
        timeline.kill();
        stage.style.backgroundColor = previous.background;
        letter.style.transform = previous.letter;
        frames.style.clipPath = previous.clip;
        screen.removeAttribute("style");
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
      <div className={styles.headline}><h3 aria-label="OhMyCode"><span className={styles.initialO} aria-hidden="true">O</span><span className={styles.wordRest} aria-hidden="true">h<span className={styles.brandAccent}>My</span>Code</span></h3><p>{isZh ? "写代码。也走出编辑器。" : "Write code. Go beyond the editor."}</p></div>
      <div className={styles.frames}>
      <div className={`${styles.videoShell} ${styles.browserShell}`}>
        <video ref={movie} className={styles.movie} width={1600} height={748} muted playsInline preload="metadata" poster="/projects/ohmycode/browser-poster.jpg" onLoadedMetadata={(event) => { const video = event.currentTarget; if (video.videoHeight) setVideoRatio(video.videoWidth / video.videoHeight); }} onError={() => setFailed(true)} aria-label={isZh ? "OhMyCode 真实客户端：Agent 操作内置浏览器" : "Actual OhMyCode client: an agent operating its built-in browser"}>
          <source src="/projects/ohmycode/browser-demo.mp4" type="video/mp4" />
        </video>
        {failed && <p className={styles.failure}>{isZh ? "视频未能加载。" : "The video could not load."}<button onClick={() => { setFailed(false); movie.current?.load(); }}>{isZh ? "重试" : "Retry"}</button></p>}
      </div>
      <div className={`${styles.videoShell} ${styles.androidShell}`}>
        <video ref={androidMovie} className={styles.androidMovie} width={2038} height={1000} muted playsInline preload="auto" poster="/projects/ohmycode/android-poster.jpg" aria-label={isZh ? "Android 设备操作实录" : "Android device recording"}><source src="/projects/ohmycode/android-scrub.mp4" type="video/mp4" /></video>
      </div>
      </div>
      <div className={styles.bridge} aria-hidden="true">
        <h4><span data-bridge-line data-bridge-first>{isZh ? "浏览器之外，" : "Beyond the browser."}</span><span data-bridge-line data-phone-line><span data-phone-prefix>{isZh ? "还有你的" : "Onto your "}</span><span data-phone-word>{isZh ? "手机" : "phone"}</span></span></h4>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.phoneScreen} data-phone-screen src="/projects/ohmycode/android-screen.png" alt="" aria-hidden="true" />
      <CapabilityScenes isZh={isZh} />
      <div className={styles.captions} aria-hidden="true">
        <p className={styles.chapterOne}>{isZh ? "说出任务。" : "Describe the task."}</p>
        <p className={styles.chapterTwo}>{isZh ? "看它动手。" : "Watch it work."}</p>
        <p className={styles.chapterThree}>{isZh ? "再把任务，交给手机。" : "Take the task to your phone."}</p>
      </div>
      <div className={styles.detailsScene} data-end-content>
    <div className={styles.details}>
      <p className={styles.description}>{isZh ? "OhMyCode 是我在做的开源 Code Agent。它可以直接使用本地终端、浏览器和 Android 设备。" : "OhMyCode is an open-source Code Agent I'm building. It works with local terminals, a browser and Android devices."}</p>
      <div className={styles.links}><button onClick={openFilm}>{isZh ? "观看真实演示" : "Watch the demo"} <ExternalArrow /></button><a href="https://github.com/Covfefeable/ohmycode" target="_blank" rel="noreferrer">GitHub <ExternalArrow /></a></div>
    </div>
      </div>
    </div>
    <dialog ref={dialog} className={styles.dialog} onClose={() => fullMovie.current?.pause()} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className={styles.close} type="button" autoFocus onClick={() => dialog.current?.close()} aria-label={isZh ? "关闭视频" : "Close video"}>×</button>
      <video ref={fullMovie} controls playsInline preload="none" poster="/projects/ohmycode/browser-poster.jpg" aria-label={isZh ? "OhMyCode 完整演示视频" : "OhMyCode demo video"}><source src="/projects/ohmycode/browser-full.mp4" type="video/mp4" /></video>
    </dialog>
  </section>;
}
