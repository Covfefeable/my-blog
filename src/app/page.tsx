"use client";
import styles from "./page.module.css";
import Home from "../components/home";
import { useContext } from "react";
import { MenuContext } from "./context";
import Posts from "@/components/posts";

export default function Page() {
  const menu = useContext(MenuContext);
  return (
    <main className={styles.main}>
      <section className={styles.content}>
        {menu === "Home" ? <Home /> : null}
        {menu === "Posts" ? <Posts /> : null}
      {/* {menu === "About" ? <About /> : null} */}
      </section>
    </main>
  );
}
