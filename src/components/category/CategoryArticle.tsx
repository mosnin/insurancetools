import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdInArticle } from "@/components/ads";
import { Reveal } from "@/components/motion";
import type {
  ArticleSection,
  CategoryExternalLink,
  CategoryRelatedCategory,
  CategoryRelatedTool,
} from "@/lib/category-content";

interface CategoryArticleProps {
  sections: ArticleSection[];
  externalLinks: CategoryExternalLink[];
  relatedCategories: CategoryRelatedCategory[];
  relatedTools: CategoryRelatedTool[];
  adSlot: string;
}

function ArticleSectionBlock({ section }: { section: ArticleSection }) {
  return (
    <Reveal className="mb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.heading}</h2>
      {section.paragraphs.map((p, i) => (
        <p key={i} className="text-slate-600 leading-relaxed mb-4">
          {p}
        </p>
      ))}
      {section.subsections?.map((sub) => (
        <div key={sub.heading} className="mt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-3">{sub.heading}</h3>
          {sub.paragraphs.map((p, i) => (
            <p key={i} className="text-slate-600 leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </div>
      ))}
    </Reveal>
  );
}

/**
 * Long-form SEO article wrapper: renders the H2/H3 section structure, drops
 * an AdInArticle unit roughly halfway through, then closes with an internal
 * "Explore More" link block and an external "Helpful Resources" block so
 * every category page builds the topic cluster and cites authoritative
 * sources.
 */
export function CategoryArticle({
  sections,
  externalLinks,
  relatedCategories,
  relatedTools,
  adSlot,
}: CategoryArticleProps) {
  const midpoint = Math.ceil(sections.length / 2);
  const firstHalf = sections.slice(0, midpoint);
  const secondHalf = sections.slice(midpoint);

  return (
    <article className="mt-4">
      {firstHalf.map((section) => (
        <ArticleSectionBlock key={section.heading} section={section} />
      ))}

      <AdInArticle slot={adSlot} />

      {secondHalf.map((section) => (
        <ArticleSectionBlock key={section.heading} section={section} />
      ))}

      <Reveal className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-t border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Explore More Tools</h2>
          <ul className="space-y-2">
            {relatedCategories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/tools/${cat.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
            {relatedTools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.categorySlug}/${tool.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Helpful Government Resources</h2>
          <ul className="space-y-3">
            {externalLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 text-sm text-blue-600 hover:underline"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                </a>
                <p className="text-xs text-slate-500 mt-0.5">{link.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </article>
  );
}
