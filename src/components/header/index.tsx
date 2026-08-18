"use client";
import { useEffect } from "react";
import NavMode from "@/assets/icon/nav-mode";
import styles from "./index.module.css";
import { detectLanguage } from "@/i18n";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  showMenu: boolean;
  onSelect?: (item: string) => void;
  currentMenu?: string;
}

export default function Header(props: HeaderProps) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // 初始化主题设置
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute("mode", initialTheme);

    const initialLanguage = detectLanguage();
    void i18n.changeLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;
  }, [i18n]);

  const menuItems = [
    { id: "Home", label: t("nav.home") },
    { id: "Posts", label: t("nav.posts") },
    { id: "About", label: t("nav.about") },
  ];

  const changeLanguage = () => {
    const nextLanguage = i18n.resolvedLanguage === "zh-CN" ? "en" : "zh-CN";
    void i18n.changeLanguage(nextLanguage);
    window.localStorage.setItem("language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

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
              {menuItems.map((item) => (
                <span
                  key={item.id}
                  className={`${styles.menuItem} ${
                    props.currentMenu === item.id ? styles.active : ""
                  }`}
                  onClick={() => props.onSelect?.(item.id)}
                >
                  {item.label}
                </span>
              ))}
            </nav>
          )}
          <button
            type="button"
            className={styles.languageToggle}
            onClick={changeLanguage}
            aria-label={t("nav.switchLanguage")}
          >
            {i18n.resolvedLanguage === "zh-CN" ? "EN" : "中"}
          </button>
          <button
            type="button"
            className={styles.themeToggle}
            aria-label={t("nav.toggleTheme")}
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
