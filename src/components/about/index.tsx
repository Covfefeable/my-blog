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
        <div
          className={styles.contactItem}
          onClick={() => {
            window.open("https://github.com/Covfefeable");
          }}
        >
          <Github /> <span>@Covfefeable</span>
        </div>
        <div
          className={`${styles.contactItem} ${styles.email}`}
          onClick={() => {
            window.open("mailto:rears_seasons_0n@icloud.com");
          }}
        >
          <Mail /> <span>{t("about.sendEmail")}</span>
          <div className={styles.tooltip}>
            {t("about.emailTooltip")}
          </div>
        </div>
      </div>
    </main>
  );
}
