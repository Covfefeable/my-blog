"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Home from "@/components/home";
import styles from "./index.module.css";

const FRAME_COUNT = 360;
const frameUrl = (index: number) => `/home-intro/original/frame-${String(index).padStart(3, "0")}.webp`;

export default function HomeIntro() {
  const [complete, setComplete] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setComplete(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const images = Array.from({ length: FRAME_COUNT }, (_, index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = frameUrl(index);
      return image;
    });
    const playhead = { frame: 0 };

    const draw = () => {
      const image = images[Math.round(playhead.frame)];
      if (!image?.complete || !image.naturalWidth) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(window.innerWidth * ratio);
      const height = Math.round(window.innerHeight * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.clearRect(0, 0, width, height);
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    images[0].addEventListener("load", draw, { once: true });
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
            if (progress >= 0.995) {
              setComplete(true);
              requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
            }
          },
        },
      });
    }, section);

    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      scope.revert();
    };
  }, []);

  if (complete) {
    return <section className={styles.homeContent}><Home /></section>;
  }

  return (
    <section ref={sectionRef} className={styles.sequence} data-home-intro aria-label="首页开场动画">
      <div className={styles.stickyStage}>
        <div className={styles.sitePreview} aria-hidden="true">
          <Home />
        </div>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      </div>
    </section>
  );
}
