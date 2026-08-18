"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import NavMode from "@/assets/icon/nav-mode";
import { detectLanguage } from "@/i18n";
import styles from "./index.module.css";

export default function Header() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("mode", savedTheme || systemTheme);

    const initialLanguage = detectLanguage();
    void i18n.changeLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;
  }, [i18n]);

  const menuItems = [
    { href: "/", label: t("nav.home") },
    { href: "/posts", label: t("nav.posts") },
    { href: "/about", label: t("nav.about") },
  ];

  const changeLanguage = () => {
    const nextLanguage = i18n.resolvedLanguage === "zh-CN" ? "en" : "zh-CN";
    void i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  const toggleTheme = () => {
    const nextMode = document.documentElement.getAttribute("mode") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("mode", nextMode);
    localStorage.setItem("theme", nextMode);
  };

  const isActive = (href: string) => href === "/" ? pathname === "/" : Boolean(pathname?.startsWith(href));

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link className={styles.logo} href="/">JayChiu&apos;s Blog</Link>
        <div className={styles.rightContent}>
          <nav className={styles.menu} aria-label="Primary navigation">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`${styles.menuItem} ${isActive(item.href) ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.actions}>
            <button type="button" className={styles.languageToggle} onClick={changeLanguage} aria-label={t("nav.switchLanguage")}>
              {i18n.resolvedLanguage === "zh-CN" ? "EN" : "中"}
            </button>
            <button type="button" className={styles.themeToggle} onClick={toggleTheme} aria-label={t("nav.toggleTheme")}>
              <NavMode />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
