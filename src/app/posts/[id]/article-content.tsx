"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./post.module.css";

type PreviewImage = { src: string; alt: string };

export default function ArticleContent({ html }: { html: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<PreviewImage | null>(null);

  useEffect(() => {
    const images = contentRef.current?.querySelectorAll("img") ?? [];
    images.forEach((image) => {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `预览图片：${image.alt || "文章图片"}`);
    });
  }, [html]);

  useEffect(() => {
    if (!preview) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [preview]);

  const openImage = (target: EventTarget | null) => {
    if (!(target instanceof HTMLImageElement)) return;
    setPreview({ src: target.currentSrc || target.src, alt: target.alt });
  };

  return (
    <>
      <div
        ref={contentRef}
        className={styles.root}
        onClick={(event) => openImage(event.target)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            if (event.target instanceof HTMLImageElement) event.preventDefault();
            openImage(event.target);
          }
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {preview && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="图片预览" onClick={() => setPreview(null)}>
          <button type="button" className={styles.lightboxClose} onClick={() => setPreview(null)} aria-label="关闭图片预览">×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.src} alt={preview.alt} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </>
  );
}
