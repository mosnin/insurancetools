import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { CATEGORY_ORDER, CATEGORY_CONTENT } from "@/lib/category-content";
import {
  SITE_URL,
  SITE_NAME,
  breadcrumbStructuredData,
  collectionPageStructuredData,
  faqStructuredData,
} from "@/lib/seo";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdMultiplex } from "@/components/ads";
import { FadeIn, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { CategoryIndexCard, CategoryFAQ } from "@/components/category";

const TITLE = "Insurance Calculators: Coverage, Deductibles & Claims";
const DESCRIPTION =
  "Free insurance calculators covering auto, home, life, health, and business coverage, deductibles, and claims. Browse every category. Start calculating free.";
const PAGE_URL = `${SITE_URL}/tools`;
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: "insurance calculators, coverage calculator, deductible calculator, claim calculator",
  authors: [{ name: SITE_NAME }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const faqs = [
  {
    question: "How many insurance calculators are available on this site?",
    answer:
      "Insurance Tools is organized into 12 categories covering auto, home, life, health, business, renters, travel, pet, claims, deductibles, coverage, and state requirements. The calculator library is being built out category by category, and every one is free to use with no sign-up required.",
  },
  {
    question: "Are these insurance calculators really free?",
    answer:
      "Yes, every calculator on this site is completely free, requires no account, and gives instant results directly in your browser. There are no paywalls, subscriptions, or usage limits on any tool.",
  },
  {
    question: "Which insurance calculators should I start with?",
    answer:
      "Start with the category that matches your immediate need: coverage calculators if you're figuring out how much insurance to buy, deductible calculators if you're comparing plan options, or claims calculators if you're estimating a payout on an existing loss.",
  },
  {
    question: "Do these calculators replace advice from a licensed agent?",
    answer:
      "No. These tools help you understand coverage math and compare scenarios before you talk to an agent or buy a policy, but they are not a substitute for advice from a licensed insurance professional about your specific situation.",
  },
  {
    question: "Can I suggest a new insurance calculator?",
    answer:
      "This site is actively expanding its calculator library based on common coverage questions. Browsing the category pages below is the fastest way to confirm whether a specific calculator you need already exists before assuming it is missing.",
  },
];

export default function ToolsIndexPage() {
  const breadcrumbs = [{ name: "Home", href: "/" }, { name: "Tools" }];

  const categoryItems = CATEGORY_ORDER.map((slug) => {
    const content = CATEGORY_CONTENT[slug];
    const toolCount = new Set(
      TOOLS.filter((t) => t.categorySlug === slug).map((t) => t.slug)
    ).size;
    return { slug, content, toolCount };
  });

  const jsonLd = [
    collectionPageStructuredData({
      name: TITLE,
      description: DESCRIPTION,
      url: PAGE_URL,
      items: categoryItems.map((c) => ({
        name: `${c.content.displayName} Calculators`,
        url: `${SITE_URL}/tools/${c.slug}`,
      })),
    }),
    breadcrumbStructuredData(
      breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
    ),
    faqStructuredData(faqs),
  ];

  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-8 pb-2">
          <BreadcrumbNav items={breadcrumbs} />
          <FadeIn className="mt-6 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Insurance Calculators
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Browse every insurance calculator on the site, organized into twelve categories covering
              auto, home, life, health, business, and the decisions that cut across all of them: how
              much coverage you need, which deductible makes sense, and what a claim might actually pay.
              Pick a category below to see what&apos;s available.
            </p>
          </FadeIn>
        </div>

        <div className="my-8">
          <AdLeaderboard slot="tools-index-top" />
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {categoryItems.map((c) => (
            <StaggerItem key={c.slug}>
              <CategoryIndexCard
                slug={c.slug}
                displayName={c.content.displayName}
                icon={c.content.icon}
                intro={c.content.intro}
                toolCount={c.toolCount}
              />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-14 py-8 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Finding the Right Insurance Calculator
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Insurance decisions usually come before or after a specific moment: buying a policy, renewing
            one, or filing a claim. Each calculator on this site is built around one of those moments, so
            the math matches the decision you&apos;re actually making rather than a generic quote
            comparison.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            The fastest way to find what you need is to start from the category that matches your
            situation. If you&apos;re figuring out how much insurance to buy in the first place, start
            with{" "}
            <Link href="/tools/coverage" className="text-blue-600 hover:underline">
              coverage calculators
            </Link>
            . If you&apos;re comparing plan or deductible options, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            category walks through the break-even math. Anyone dealing with an active loss should start
            with{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>
            , while auto, home, life, health, and business coverage each have their own dedicated
            category below.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Every category page groups its calculators into logical sub-sections, links out to related
            categories, and includes a long-form guide explaining the coverage math behind each tool, not
            just the inputs. Start with the category grid above, or jump directly to{" "}
            <Link href="/tools/state-requirements" className="text-blue-600 hover:underline">
              state requirement calculators
            </Link>{" "}
            if you already know what you&apos;re looking for.
          </p>
        </Reveal>

        <CategoryFAQ faqs={faqs} />

        <div className="mt-12">
          <AdMultiplex slot="tools-index-bottom" />
        </div>
      </div>
    </>
  );
}
