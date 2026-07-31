import type { Metadata } from "next";
import { CategoryPage } from "@/components/category";
import { CATEGORY_CONTENT, buildCategoryMetadata } from "@/lib/category-content";

export const metadata: Metadata = buildCategoryMetadata(CATEGORY_CONTENT.travel);

export default function TravelInsurancePage() {
  return <CategoryPage categorySlug="travel" />;
}
