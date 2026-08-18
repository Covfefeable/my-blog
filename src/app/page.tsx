import Home from "@/components/home";
import styles from "./page.module.css";

export default function Page() {
  return <main className={styles.main}><section className={styles.content}><Home /></section></main>;
}
