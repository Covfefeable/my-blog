import Github from "@/assets/icon/github";
import styles from "./index.module.css";
import Mail from "@/assets/icon/mail";

export default function About() {
  return (
    <main className={styles.aboutContent}>
      <h1 className={styles.intro}>Hi there!</h1>
      <p className={styles.introDetail}>
        I am JayChiu and I work as a front end engineer for more than {' '}
        {new Date().getFullYear() - 2020} years. I am also a cybersecurity
        researcher, like to find vulnerabilities in web application. these
        years I have been working on deep learning, llm and has built some funny
        projects with it. for more details, check out my project list.
      </p>

      <div className={styles.contactContent}>
        <div
          className={styles.contactItem}
          onClick={() => {
            window.open("https://github.com/Covfefeable");
          }}
        >
          <Github /> <span>@Covfefeable</span>
        </div>
        <div
          className={`${styles.contactItem} ${styles.email}`}
          onClick={() => {
            window.open("mailto:rears_seasons_0n@icloud.com");
          }}
        >
          <Mail /> <span>Click to send me an email</span>
          <div className={styles.tooltip}>
            click to send me an email!
          </div>
        </div>
      </div>
    </main>
  );
}
