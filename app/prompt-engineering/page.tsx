import CategoryLanding from "@/components/CategoryLanding";
import { CATEGORIES } from "@/lib/categories";

export default function PromptEngineeringPage() {
  return <CategoryLanding category={CATEGORIES["prompt-engineering"]} />;
}
