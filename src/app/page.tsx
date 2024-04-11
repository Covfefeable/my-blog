"use client";
import styles from "./page.module.css";
import Home from "../pages/home";
import { useContext } from "react";
import { MenuContext } from "./layout";

export default function Page() {
  const menu = useContext(MenuContext);
  return (
    <main className={styles.main}>
      <section className={styles.content}>
        {menu === "Home" ? <Home /> : null}
        {/* {menu === "Posts" ? <Posts /> : null}
      {menu === "About" ? <About /> : null} */}
      </section>
    </main>
  );
}
