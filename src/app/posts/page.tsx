import type { Metadata } from "next";
import Posts from "@/components/posts";
import styles from "../page.module.css";

export const metadata: Metadata = { title: "文章" };

export default function PostsPage() {
  return <main className={styles.main}><section className={styles.content}><Posts /></section></main>;
}
