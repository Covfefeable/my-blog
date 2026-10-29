"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import styles from "./agent-scene.module.css";

export default function VoiceOrb() {
  const stage = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let animation: AnimationItem | undefined;
    const element = stage.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const levels = [0, .12, .88, .18, .04, .7, .24, 1, .16, .05, .45, .1, .82, .22, .04, .94, .32, .08, .64, .15, .03, .78, .2, .06, .5, .12, 0];
    const render = () => {
      const progress = Number(element.dataset.voiceProgress || 0);
      const position = Math.min(1, Math.max(0, progress)) * (levels.length - 1);
      const index = Math.min(Math.floor(position), levels.length - 2);
      const fraction = position - index;
      const start = levels[index];
      const end = levels[index + 1];
      // Short attacks and uneven pauses feel like syllables rather than breathing.
      const envelope = end > start ? Math.min(1, fraction / .24) : Math.pow(fraction, .7);
      const level = start + (end - start) * envelope;
      if (container.current) container.current.style.transform = `scale(${reduced.matches ? 1 : .98 + level * .65})`;
      if (animation?.isLoaded) animation.goToAndStop(reduced.matches ? 0 : progress * (animation.totalFrames - 1), true);
    };
    void import("lottie-web").then(({ default: lottie }) => {
      if (disposed) return;
      animation = lottie.loadAnimation({ container: container.current!, renderer: "svg", loop: true, autoplay: false, path: "/projects/ohmycode/voice-orb.json" });
      animation.addEventListener("DOMLoaded", render);
      render();
    });
    element.addEventListener("voice-progress", render);
    return () => { disposed = true; element.removeEventListener("voice-progress", render); animation?.destroy(); };
  }, []);
  return <div ref={stage} className={styles.voiceStage} data-team-voice data-speaking="false" aria-hidden="true"><div ref={container} className={styles.voiceOrb} /></div>;
}
