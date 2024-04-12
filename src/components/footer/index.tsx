import styles from "./index.module.css";
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span className={styles.copyRight}>
          &copy; 2023-2024 llmol.com 版权所有
        </span>
        <a className={styles.beian} href="https://beian.miit.gov.cn">
          备案号：粤ICP备2024229772号
        </a>
      </div>
    </footer>
  );
}
