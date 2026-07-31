import type { Metadata } from "next";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdMultiplex } from "@/components/ads";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { SourceStrip } from "@/components/home/SourceStrip";
import { CapabilitiesSection } from "@/components/home/CapabilitiesSection";
import { DemoSection } from "@/components/home/DemoSection";
import { WorkflowSection } from "@/components/home/WorkflowSection";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { SocialProof } from "@/components/home/SocialProof";
import { ToolMarquee } from "@/components/home/ToolMarquee";
import { TrustSection } from "@/components/home/TrustSection";
import { SeoContent } from "@/components/home/SeoContent";
import { Faq } from "@/components/home/Faq";
import { ClosingCta } from "@/components/home/ClosingCta";
import {
  homeWebsiteStructuredData,
  homeOrganizationStructuredData,
  homeWebPageStructuredData,
  homeItemListStructuredData,
  homeCategoryListStructuredData,
  homeHowToStructuredData,
  homeFaqStructuredData,
} from "@/components/home/structuredData";

/* Focus keyword: "free insurance calculators", first in the title, inside
   the first four words of the description, and exact-matched by the H1. */
const TITLE = "Free Insurance Calculators Online | Insurance Tools";
const DESCRIPTION =
  "Free insurance calculators for auto, home, life, health, and business coverage. 12 categories, no sign-up. Figure out what you need before you buy.";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "free insurance calculators",
    "insurance coverage calculator",
    "deductible calculator",
    "life insurance calculator",
    "claim payout calculator",
    "insurance tools",
  ].join(", "),
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: SITE_URL },
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
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} free insurance calculators` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={[
          homeWebsiteStructuredData(),
          homeOrganizationStructuredData(),
          homeWebPageStructuredData(),
          homeItemListStructuredData(),
          homeCategoryListStructuredData(),
          homeHowToStructuredData(),
          homeFaqStructuredData(),
        ]}
      />

      <Hero />
      <SourceStrip />

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <AdLeaderboard slot="home-leaderboard" />
      </div>

      <CapabilitiesSection />
      <DemoSection />
      <WorkflowSection />
      <CategoryShowcase />
      <ToolMarquee />
      <TrustSection />
      <SocialProof />
      <SeoContent />
      <Faq />
      <ClosingCta />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <AdMultiplex slot="home-multiplex" />
      </div>
    </>
  );
}
