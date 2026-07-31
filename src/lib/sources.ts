/**
 * The authority each tool category's figures are checked against.
 *
 * This is the site's answer to "who reviewed this": not a named person,
 * because no one on this team is a licensed insurance agent or advisor and
 * inventing a reviewer would be exactly the kind of fabricated authority
 * signal that gets a site penalized. Instead, every category is tied to a
 * specific regulatory or industry body that actually publishes the rules,
 * definitions, or figures the category's calculators use, with a direct
 * link to that body's own page rather than its homepage.
 *
 * These URLs were selected for being long-standing, canonical section
 * pages rather than dated fact sheets or press releases, on the theory that
 * a stable URL is less likely to 404 than a specific year's announcement.
 * They have not been live-fetched from this environment, so spot-check them
 * after deploy the way you would any citation you did not personally write.
 */

export interface SourceAuthority {
  /** Full legal name, used in link text and structured data. */
  name: string;
  /** Short form for tight UI, e.g. the LastUpdated line. */
  shortName: string;
  /** A specific section page, never a bare domain root. */
  url: string;
  /** One sentence: what this body governs for the category it is attached to. */
  description: string;
}

export type CategorySlug =
  | "auto"
  | "home"
  | "life"
  | "health"
  | "business"
  | "renters"
  | "travel"
  | "pet"
  | "claims"
  | "deductibles"
  | "coverage"
  | "state-requirements";

export const CATEGORY_AUTHORITY: Record<CategorySlug, SourceAuthority> = {
  auto: {
    name: "the National Association of Insurance Commissioners",
    shortName: "the NAIC",
    url: "https://content.naic.org/consumer/auto-insurance",
    description: "publishes the consumer guidance on auto coverage types and liability limits these tools follow.",
  },
  home: {
    name: "the Insurance Information Institute",
    shortName: "the Insurance Information Institute",
    url: "https://www.iii.org/article/homeowners-insurance-basics",
    description: "publishes the replacement cost and dwelling coverage definitions these homeowners tools use.",
  },
  life: {
    name: "the Insurance Information Institute",
    shortName: "the Insurance Information Institute",
    url: "https://www.iii.org/article/how-much-life-insurance-do-i-need",
    description: "publishes the income-replacement and needs-analysis methodology these life insurance tools model.",
  },
  health: {
    name: "the Centers for Medicare and Medicaid Services",
    shortName: "the Centers for Medicare and Medicaid Services",
    url: "https://www.healthcare.gov/glossary/",
    description: "sets the plan terminology and out-of-pocket cost definitions these health tools use.",
  },
  business: {
    name: "the U.S. Small Business Administration",
    shortName: "the Small Business Administration",
    url: "https://www.sba.gov/business-guide/manage-your-business/get-business-insurance",
    description: "publishes the coverage guidance these business insurance tools are built around.",
  },
  renters: {
    name: "the Insurance Information Institute",
    shortName: "the Insurance Information Institute",
    url: "https://www.iii.org/article/renters-insurance-basics",
    description: "publishes the personal property and liability coverage guidance these renters tools use.",
  },
  travel: {
    name: "the U.S. Department of State",
    shortName: "the U.S. Department of State",
    url: "https://travel.state.gov/content/travel/en/international-travel/before-you-go/your-health-abroad/insurance-providers-overseas.html",
    description: "publishes the guidance on travel medical coverage these trip insurance tools reference.",
  },
  pet: {
    name: "the National Association of Insurance Commissioners",
    shortName: "the NAIC",
    url: "https://content.naic.org/consumer/pet-insurance",
    description: "publishes the consumer guidance on pet insurance terms these tools follow.",
  },
  claims: {
    name: "the National Association of Insurance Commissioners",
    shortName: "the NAIC",
    url: "https://content.naic.org/consumer/filing-a-claim",
    description: "publishes the claims-handling and settlement guidance these payout tools are checked against.",
  },
  deductibles: {
    name: "the Insurance Information Institute",
    shortName: "the Insurance Information Institute",
    url: "https://www.iii.org/article/why-do-i-have-a-deductible-and-how-does-it-work",
    description: "publishes the deductible mechanics these comparison tools are modeled on.",
  },
  coverage: {
    name: "the National Association of Insurance Commissioners",
    shortName: "the NAIC",
    url: "https://content.naic.org/consumer",
    description: "publishes the coverage-type definitions these needs calculators are built around.",
  },
  "state-requirements": {
    name: "the National Association of Insurance Commissioners",
    shortName: "the NAIC",
    url: "https://content.naic.org/state-insurance-departments",
    description: "maintains the directory of state insurance departments these minimum-requirement tools cite.",
  },
};

const CATEGORY_SLUGS = new Set<string>(Object.keys(CATEGORY_AUTHORITY));

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_SLUGS.has(value);
}

export function getCategoryAuthority(categorySlug: string): SourceAuthority | null {
  return isCategorySlug(categorySlug) ? CATEGORY_AUTHORITY[categorySlug] : null;
}
