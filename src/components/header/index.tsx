"use client";
import styles from "./index.module.css";

interface HeaderProps {
  onSelect: (item: string) => void;
}

export default function Header(props: HeaderProps) {
  const backToHome = () => {
    window.location.href = "/";
  };
  return (
    <header className={styles.header}>
      <span className={styles.logo} onClick={backToHome}>
        Covfefeable&apos;s Blog
      </span>
      <div className={styles.menu}>
        {["Home", "Posts", "About"].map((item) => (
          <span
            key={item}
            className={styles.menuItem}
            onClick={() => props.onSelect(item)}
          >
            {item}
          </span>
        ))}
      </div>
    </header>
  );
}
