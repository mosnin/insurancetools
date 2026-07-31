import type { Metadata } from "next";
import { CategoryPage } from "@/components/category";
import { CATEGORY_CONTENT, buildCategoryMetadata } from "@/lib/category-content";

export const metadata: Metadata = buildCategoryMetadata(CATEGORY_CONTENT.health);

export default function HealthInsurancePage() {
  return <CategoryPage categorySlug="health" />;
}
