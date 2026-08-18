import type { Metadata } from "next";
import About from "@/components/about";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "关于" };

export default function AboutPage() {
  return <main className={styles.main}><section className={styles.content}><About /></section></main>;
}
