import { SITE_NAME, SITE_URL, faqStructuredData, howToStructuredData } from "@/lib/seo";
import { HOME_FAQS, TOTAL_CATEGORY_COUNT, CATEGORY_META } from "./data";

const DESCRIPTION =
  "Free insurance calculators for auto, home, life, health, and business coverage, all running instantly in your browser with no sign-up.";

/** WebSite schema with a sitelinks SearchAction pointing at /search. */
export function homeWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Organization schema identifying the publisher behind the tools. */
export function homeOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    description: `Publisher of free, browser-based insurance calculators covering auto, home, life, health, business, and ${TOTAL_CATEGORY_COUNT - 5} more coverage categories.`,
  };
}

/**
 * WebPage schema for the homepage, including the speakable selectors that
 * let voice surfaces read the H1 and the opening summary aloud.
 */
export function homeWebPageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Free Insurance Calculators Online",
    description: DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "Thing", name: "Insurance coverage calculators" },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#how-it-works p"],
    },
  };
}

/** ItemList schema for the category hubs featured on the homepage. */
export function homeItemListStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Insurance calculator categories",
    numberOfItems: CATEGORY_META.length,
    itemListElement: CATEGORY_META.map((meta, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${meta.name} Insurance`,
      url: `${SITE_URL}/tools/${meta.slug}`,
    })),
  };
}

/** ItemList of the category hubs, one entry per top level section. */
export function homeCategoryListStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Insurance calculator categories on ${SITE_NAME}`,
    numberOfItems: TOTAL_CATEGORY_COUNT,
    itemListElement: CATEGORY_META.map((meta, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: meta.name,
      description: meta.description,
      url: `${SITE_URL}/tools/${meta.slug}`,
    })),
  };
}

/** HowTo schema mirroring the three step workflow section on the page. */
export function homeHowToStructuredData() {
  return howToStructuredData({
    name: "How to use a free insurance calculator",
    description:
      "Find the calculator that matches your question, enter your own figures, and read the result along with the breakdown behind it.",
    url: SITE_URL,
    steps: [
      {
        name: "Find the calculator for your question",
        text: `Search the spotlight at the top of the page, or browse the ${TOTAL_CATEGORY_COUNT} categories, to open the calculator built for the decision you are weighing.`,
      },
      {
        name: "Enter your own numbers",
        text: "Replace the default figures with your own. Fields are labelled in plain English, so you only change the inputs your situation actually affects.",
      },
      {
        name: "Read the result and its breakdown",
        text: "The headline figure arrives with its components, such as the split between dwelling and liability coverage, or the break-even point on a deductible comparison.",
      },
    ],
  });
}

/** FAQPage schema, generated from the same data the visible FAQ section renders. */
export function homeFaqStructuredData() {
  return faqStructuredData(HOME_FAQS);
}
