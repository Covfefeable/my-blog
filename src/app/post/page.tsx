import { redirect } from "next/navigation";

export default function LegacyPostPage({ searchParams }: { searchParams: { id?: string } }) {
  redirect(searchParams.id ? `/posts/${searchParams.id}` : "/posts");
}
