"use client";

import Github from "@/assets/icon/github";
import styles from "./index.module.css";
import Mail from "@/assets/icon/mail";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  const years = new Date().getFullYear() - 2020;

  return (
    <main className={styles.aboutContent}>
      <h1 className={styles.intro}>{t("about.greeting")}</h1>
      <p className={styles.introDetail}>
        {t("about.introduction", { years })}
      </p>

      <div className={styles.contactContent}>
        <a
          className={styles.contactItem}
          href="https://github.com/Covfefeable"
          target="_blank"
          rel="noreferrer"
        >
          <Github /> <span>@Covfefeable</span>
        </a>
        <a
          className={`${styles.contactItem} ${styles.email}`}
          href="mailto:rears_seasons_0n@icloud.com"
        >
          <Mail /> <span>{t("about.sendEmail")}</span>
          <div className={styles.tooltip}>
            {t("about.emailTooltip")}
          </div>
        </a>
      </div>
    </main>
  );
}
