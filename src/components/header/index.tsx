"use client";
import NavMode from "@/assets/icon/nav-mode";
import styles from "./index.module.css";

interface HeaderProps {
  showMenu: boolean;
  onSelect?: (item: string) => void;
}

export default function Header(props: HeaderProps) {
  const backToHome = () => {
    window.location.href = "/";
  };

  return (
    <header className={styles.header}>
      <span className={styles.logo} onClick={backToHome}>
        JayChiu&apos;s Blog
      </span>
      <div className={styles.rightContent}>
        {props.showMenu && (
          <div className={styles.menu}>
            {["Home", "Posts", "About"].map((item) => (
              <span
                key={item}
                className={styles.menuItem}
                onClick={() => props.onSelect?.(item)}
              >
                {item}
              </span>
            ))}
          </div>
        )}
        <NavMode
          onClick={() => {
            // html 增加 mode 属性，在 dark 和 light 之间切换
            document.documentElement.setAttribute(
              "mode",
              document.documentElement.getAttribute("mode") === "dark"
                ? "light"
                : "dark"
            );
          }}
        />
      </div>
    </header>
  );
}
