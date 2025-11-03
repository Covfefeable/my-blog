import Github from "@/assets/icon/github";
import styles from "./index.module.css";
import Mail from "@/assets/icon/mail";

export default function About() {
  return (
    <main>
      <section className={styles.aboutContent}>
        <p className={styles.intro}>Hi there!</p>
        <p className={styles.introDetail}>
          I am JayChiu and I work as a front end engineer for more than {' '}
          {new Date().getFullYear() - 2020} years. I am also a cybersecurity
          researcher, like to find vulnerabilities in web application. these
          years I have been working on deep learning, llm and has built some funny
          projects with it. for more details, check out my project list.
        </p>
      </section>

      <section className={styles.contactContent}>
        <p
          className={styles.contactItem}
          onClick={() => {
            window.open("https://github.com/Covfefeable");
          }}
        >
          <Github /> <span>@Covfefeable</span>
        </p>
        <p
          className={styles.contactItem}
          onClick={() => {
            window.open("mailto:rears_seasons_0n@icloud.com");
          }}
        >
          <Mail /> <span className={styles.email}>Click to send me an email</span>
          <p className={styles.tooltip}>
            click to send me an email!
          </p>
        </p>
      </section>
    </main>
  );
}
