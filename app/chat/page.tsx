import ChatInterface from "@/components/ChatInterface";
import { isCategoryId } from "@/lib/categories";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = isCategoryId(params.category) ? params.category : "general";

  return <ChatInterface initialCategory={category} initialQuestion={params.q} />;
}
