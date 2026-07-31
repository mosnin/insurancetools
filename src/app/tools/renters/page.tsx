import type { Metadata } from "next";
import { CategoryPage } from "@/components/category";
import { CATEGORY_CONTENT, buildCategoryMetadata } from "@/lib/category-content";

export const metadata: Metadata = buildCategoryMetadata(CATEGORY_CONTENT.renters);

export default function RentersInsurancePage() {
  return <CategoryPage categorySlug="renters" />;
}
