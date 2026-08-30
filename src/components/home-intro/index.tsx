"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeExperience, { PortalPreview } from "@/components/home-experience";
import styles from "./index.module.css";

const FRAME_COUNT = 360;
const frameUrl = (index: number) => `/home-intro/original/frame-${String(index).padStart(3, "0")}.webp`;

export default function HomeIntro() {
  const [complete, setComplete] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const justFinishedRef = useRef(false);

  useEffect(() => {
    const shouldSkip = Boolean(window.location.hash)
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (shouldSkip) setComplete(true);
    setIntroChecked(true);
  }, []);

  useEffect(() => {
    if (!complete || !justFinishedRef.current) return;

    justFinishedRef.current = false;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "instant" });
    const releaseScroll = window.setTimeout(() => {
      document.documentElement.style.overflow = previousOverflow;
    }, 900);

    return () => {
      window.clearTimeout(releaseScroll);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [complete]);

  useEffect(() => {
    if (!complete || !window.location.hash) return;
    const targetId = window.location.hash.slice(1);
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    });
  }, [complete]);

  useEffect(() => {
    if (!introChecked || complete) return;

    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!canvas || !section || !stage) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const images = Array.from({ length: FRAME_COUNT }, (_, index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = frameUrl(index);
      return image;
    });
    const playhead = { frame: 0 };
    let hasDrawnFrame = false;
    let completionStarted = false;

    const draw = () => {
      const image = images[Math.round(playhead.frame)];
      if (!image?.complete || !image.naturalWidth) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const stageBounds = stage.getBoundingClientRect();
      const width = Math.max(1, Math.round(stageBounds.width * ratio));
      const height = Math.max(1, Math.round(stageBounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.clearRect(0, 0, width, height);
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

      if (!hasDrawnFrame) {
        hasDrawnFrame = true;
        setFrameReady(true);
      }
    };

    images[0].addEventListener("load", draw, { once: true });
    images.forEach((image, index) => {
      image.addEventListener("load", () => {
        if (index === Math.round(playhead.frame)) draw();
      });
    });
    const scope = gsap.context(() => {
      gsap.to(playhead, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        snap: "frame",
        onUpdate: draw,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.15,
          onUpdate: ({ progress }) => {
            canvas.style.opacity = String(1 - gsap.utils.clamp(0, 1, (progress - 0.88) / 0.12));
            if (progress >= 0.995 && !completionStarted) {
              completionStarted = true;
              justFinishedRef.current = true;
              setComplete(true);
            }
          },
        },
      });
    }, section);

    const onResize = () => {
      // Pinch zoom changes the visual viewport but not the layout. Resizing the
      // canvas here would clear the current frame and expose the poster again.
      if (window.visualViewport && window.visualViewport.scale !== 1) return;
      draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      scope.revert();
    };
  }, [complete, introChecked]);

  if (!introChecked && !complete) {
    return <div className={styles.preparing}><PortalPreview /></div>;
  }

  if (complete) {
    return <HomeExperience />;
  }

  return (
    <section ref={sectionRef} className={styles.sequence} data-home-intro aria-label="首页开场动画">
      <div ref={stageRef} className={styles.stickyStage}>
        <PortalPreview />
        <div className={`${styles.poster} ${frameReady ? styles.posterHidden : ""}`} aria-hidden="true" />
        <canvas ref={canvasRef} className={`${styles.canvas} ${frameReady ? styles.canvasReady : ""}`} aria-hidden="true" />
      </div>
    </section>
  );
}
