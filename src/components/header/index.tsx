"use client";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { useEffect } from "react";

interface HeaderProps {
  showMenu: boolean;
  onSelect?: (item: string) => void;
}

export default function Header(props: HeaderProps) {
  const backToHome = () => {
    window.location.href = "/";
  };

  return (
    <header className={styles.header}>
      <span className={styles.logo} onClick={backToHome}>
        Covfefeable&apos;s Blog
      </span>
      {props.showMenu && (
        <div className={styles.menu}>
          {["Home", "Posts", "About"].map((item) => (
            <span
              key={item}
              className={styles.menuItem}
              onClick={() => props.onSelect?.(item)}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
