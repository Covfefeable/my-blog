"use client";
import { useEffect } from "react";
import NavMode from "@/assets/icon/nav-mode";
import styles from "./index.module.css";

interface HeaderProps {
  showMenu: boolean;
  onSelect?: (item: string) => void;
  currentMenu?: string;
}

export default function Header(props: HeaderProps) {
  useEffect(() => {
    // 初始化主题设置
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute("mode", initialTheme);
  }, []);

  const backToHome = () => {
    window.location.href = "/";
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <span className={styles.logo} onClick={backToHome}>
          JayChiu&apos;s Blog
        </span>
        <div className={styles.rightContent}>
          {props.showMenu && (
            <nav className={styles.menu}>
              {["Home", "Posts", "About"].map((item) => (
                <span
                  key={item}
                  className={`${styles.menuItem} ${
                    props.currentMenu === item ? styles.active : ""
                  }`}
                  onClick={() => props.onSelect?.(item)}
                >
                  {item}
                </span>
              ))}
            </nav>
          )}
          <button
            className={styles.themeToggle}
            aria-label="Toggle theme"
          >
            <NavMode
              onClick={() => {
                const currentMode = document.documentElement.getAttribute("mode");
                const newMode = currentMode === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("mode", newMode);
                // 保存到localStorage以持久化主题设置
                localStorage.setItem("theme", newMode);
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
