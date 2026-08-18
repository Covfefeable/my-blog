import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";

interface BlogPostCardProps {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function BlogPostCard({ id, title, description, date }: BlogPostCardProps) {
  return (
    <Link className={styles.card} href={`/posts/${id}`}>
      <div className={styles.cardHeader}>
        <Image src={`/articles/${id}/cover.png`} width={600} height={400} sizes="(max-width: 768px) 100vw, 33vw" alt={`${title}封面`} className={styles.headerImage} />
      </div>
      <div className={styles.cardBody}>
        <h2>{title}</h2>
        <time dateTime={date}>{date}</time>
        <p>{description}</p>
      </div>
    </Link>
  );
}
