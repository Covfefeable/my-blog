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
    let frame = 0;
    let displayed = 1;
    let previous = 0;
    let playing = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    void import("lottie-web").then(({ default: lottie }) => {
      if (disposed) return;
      animation = lottie.loadAnimation({ container: container.current!, renderer: "svg", loop: true, autoplay: false, path: "/projects/ohmycode/voice-orb.json" });
    });
    const draw = (time: number) => {
      const speaking = stage.current?.dataset.speaking === "true" && !document.hidden && !reduced.matches;
      if (animation && speaking !== playing) {
        playing = speaking;
        if (speaking) animation.play(); else animation.pause();
      }
      // Keep the original smoothing, with a wider level range for the demo.
      const level = Math.pow(.5 + .5 * Math.sin(time / 140) * Math.cos(time / 330), 2);
      const target = speaking ? 1 + Math.sqrt(level) * .78 : 1;
      displayed += (target - displayed) * (1 - Math.exp(-Math.min(previous ? time - previous : 16, 64) / (speaking ? 45 : 140)));
      previous = time;
      if (container.current) container.current.style.transform = `scale(${displayed})`;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => { disposed = true; cancelAnimationFrame(frame); animation?.destroy(); };
  }, []);
  return <div ref={stage} className={styles.voiceStage} data-team-voice data-speaking="false" aria-hidden="true"><div ref={container} className={styles.voiceOrb} /></div>;
}
