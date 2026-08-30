import HomeIntro from "@/components/home-intro";
import styles from "./page.module.css";

export default function Page() {
  return <main className={styles.main}><section className={`${styles.content} ${styles.homeShell}`}><HomeIntro /></section></main>;
}
