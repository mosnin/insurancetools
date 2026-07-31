import { Suspense } from "react";
import type { Metadata } from "next";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { FadeIn } from "@/components/motion";
import { ProcessingOrb } from "@/components/brand";
import { generatePageMetadata, breadcrumbStructuredData, SITE_URL } from "@/lib/seo";
import { SearchResultsClient } from "./SearchResultsClient";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

function getQuery(q: string | string[] | undefined): string {
  if (Array.isArray(q)) return (q[0] ?? "").trim();
  return (q ?? "").trim();
}

function truncateQuery(query: string, max = 60): string {
  return query.length > max ? `${query.slice(0, max).trim()}...` : query;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = getQuery(params.q);

  if (!query) {
    return generatePageMetadata({
      title: "Search Insurance Calculators | Insurance Tools",
      description:
        "Search free insurance calculators by category, name, or the coverage decision you're weighing to find the exact tool you need in seconds, no sign-up.",
      path: "/search",
      keywords: ["search insurance calculators", "insurance calculator search", "find a calculator"],
    });
  }

  const displayQuery = truncateQuery(query);

  return generatePageMetadata({
    title: `Search results for "${displayQuery}" | Insurance Tools`,
    description: `Insurance calculator search results for "${displayQuery}". Browse matching categories, or refine your search to find an exact match.`,
    path: `/search?q=${encodeURIComponent(query)}`,
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = getQuery(params.q);

  const breadcrumbJsonLd = breadcrumbStructuredData([
    { name: "Home", url: SITE_URL },
    { name: "Search", url: `${SITE_URL}/search` },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BreadcrumbNav items={[{ name: "Home", href: "/" }, { name: "Search" }]} />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Search Insurance Calculators
          </h1>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Find the right category instantly, from auto and home coverage to claims and deductibles.
          </p>
        </FadeIn>

        <Suspense
          fallback={
            <div className="flex min-h-[16rem] items-center justify-center">
              <ProcessingOrb state="searching" size={64} speed={1.65} label="Searching calculators" />
            </div>
          }
        >
          <SearchResultsClient initialQuery={query} />
        </Suspense>
      </section>
    </>
  );
}
