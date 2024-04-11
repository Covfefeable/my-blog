import styles from "./index.module.css";
import Image from "next/image";
import img from "../../assets/image/test.png";
interface BlogPostCardProps {
  title: string;
  description: string;
  date: string;
}

export default function BlogPostCard(props: BlogPostCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Image
          src={img}
          alt=""
          className={styles.headerImage}
        />
      </div>
      <div className={styles.cardBody}>
        <h4>{props.title}</h4>
        <h6>{props.date}</h6>
        <p>
          {props.description}
        </p>
      </div>
    </div>
  );
}
