import { TOOLS } from "@/lib/tools";
import {
  getCategoryContent,
  groupCategoryTools,
  type CategorySlug,
} from "@/lib/category-content";
import {
  breadcrumbStructuredData,
  collectionPageStructuredData,
  faqStructuredData,
  SITE_URL,
} from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdMultiplex } from "@/components/ads";
import { CategoryHero } from "./CategoryHero";
import { ToolGrid } from "./ToolGrid";
import { CategoryArticle } from "./CategoryArticle";
import { CategoryFAQ } from "./CategoryFAQ";
import { CategorySearch } from "./CategorySearch";
import { EmptyToolsState } from "./EmptyToolsState";

interface CategoryPageProps {
  categorySlug: CategorySlug;
}

/**
 * Full body of a category landing page: breadcrumbs, structured data
 * (CollectionPage + ItemList + BreadcrumbList + FAQPage), hero/H1, the
 * complete tool grid for the category, the long-form SEO article, the FAQ
 * section, and ad slots. Each src/app/tools/<category>/page.tsx wraps this
 * with its own `export const metadata`, since Next.js requires metadata to
 * be exported directly from the route file.
 */
export function CategoryPage({ categorySlug }: CategoryPageProps) {
  const content = getCategoryContent(categorySlug);
  if (!content) return null;

  const categoryTools = TOOLS.filter((t) => t.categorySlug === categorySlug);
  const groups = groupCategoryTools(categorySlug, categoryTools);
  const uniqueToolCount = groups.reduce((sum, g) => sum + g.tools.length, 0);

  const pageUrl = `${SITE_URL}/tools/${categorySlug}`;
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: `${content.displayName} Calculators` },
  ];

  const itemListItems = groups.flatMap((g) =>
    g.tools.map((tool) => ({
      name: tool.name,
      url: `${SITE_URL}/tools/${tool.categorySlug}/${tool.slug}`,
    }))
  );

  const jsonLd = [
    collectionPageStructuredData({
      name: content.title,
      description: content.metaDescription,
      url: pageUrl,
      items: itemListItems,
    }),
    breadcrumbStructuredData(
      breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : pageUrl }))
    ),
    faqStructuredData(content.faqs),
  ];

  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CategoryHero
          breadcrumbs={breadcrumbs}
          icon={content.icon}
          h1={content.h1}
          intro={content.intro}
          toolCount={uniqueToolCount}
        />

        <div className="my-8">
          <AdLeaderboard slot={`cat-${categorySlug}-top`} />
        </div>

        {uniqueToolCount === 0 ? (
          <EmptyToolsState categoryName={content.displayName} />
        ) : (
          <CategorySearch tools={categoryTools} categoryName={content.displayName}>
            <ToolGrid groups={groups} />
          </CategorySearch>
        )}

        <CategoryArticle
          sections={content.article}
          externalLinks={content.externalLinks}
          relatedCategories={content.relatedCategories}
          relatedTools={content.relatedTools}
          adSlot={`cat-${categorySlug}-article`}
        />

        <CategoryFAQ faqs={content.faqs} />

        <div className="mt-12">
          <AdMultiplex slot={`cat-${categorySlug}-bottom`} />
        </div>
      </div>
    </>
  );
}
