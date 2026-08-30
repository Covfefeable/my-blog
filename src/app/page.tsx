import HomeExperience from "@/components/home-experience";
import styles from "./page.module.css";

export default function Page() {
  return <main className={styles.main}><section className={`${styles.content} ${styles.homeShell}`}><HomeExperience /></section></main>;
}
