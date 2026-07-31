"use client";

/**
 * Site footer (Team 9: Header, Mega Menu, Footer).
 *
 * The site wide internal link backbone: every category page, the core
 * utility pages, and 60+ individual tool pages with keyword rich anchor
 * text. Also carries the brand block, financial disclaimer, and a few
 * links to authoritative outside sources.
 */

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FOOTER_TOOL_COLUMNS } from "@/lib/nav";
import { Wordmark } from "@/components/brand";

const CATEGORY_LINKS = [
  { name: "Auto", href: "/tools/auto" },
  { name: "Home", href: "/tools/home" },
  { name: "Life", href: "/tools/life" },
  { name: "Health", href: "/tools/health" },
  { name: "Business", href: "/tools/business" },
  { name: "Renters", href: "/tools/renters" },
  { name: "Travel", href: "/tools/travel" },
  { name: "Pet", href: "/tools/pet" },
  { name: "Claims", href: "/tools/claims" },
  { name: "Deductibles", href: "/tools/deductibles" },
  { name: "Coverage", href: "/tools/coverage" },
  { name: "State Requirements", href: "/tools/state-requirements" },
];

const SITE_LINKS = [
  { name: "All Tools", href: "/tools" },
  { name: "Explore", href: "/explore" },
  { name: "Search", href: "/search" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const EXTERNAL_SOURCES = [
  { name: "National Association of Insurance Commissioners", href: "https://content.naic.org/consumer" },
  { name: "Insurance Information Institute", href: "https://www.iii.org" },
  { name: "HealthCare.gov", href: "https://www.healthcare.gov" },
];

export function Footer() {
  const year = new Date().getFullYear();

  const siteNavigationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: CATEGORY_LINKS.map((c) => c.name),
    url: CATEGORY_LINKS.map(
      (c) => `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.insurancetools.org"}${c.href}`
    ),
  };

  return (
    <footer className="border-t border-hairline-strong bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Popular tools grid: the site wide internal link backbone. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {FOOTER_TOOL_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="eyebrow mb-3.5">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] leading-snug text-slate-500 transition-colors duration-150 hover:text-blue-600"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-10 border-t border-hairline" />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand block */}
          <div className="md:col-span-2">
            <Wordmark className="mb-4" />
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              Free insurance calculators for auto, home, life, health, and business coverage,
              plus claims, deductibles, and state requirements. No sign up required, and every
              result is computed in your browser as you type.
            </p>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-slate-400">
              Disclaimer: the calculators on Insurance Tools are provided for educational and
              informational purposes only. They do not constitute insurance, financial, tax, or
              legal advice, and are not a quote from any insurer. Always consult a licensed
              agent before making a coverage decision.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="eyebrow mb-3.5">Categories</h3>
            <ul className="space-y-2">
              {CATEGORY_LINKS.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-slate-500 transition-colors duration-150 hover:text-blue-600"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site + external links */}
          <div>
            <h3 className="eyebrow mb-3.5">Site</h3>
            <ul className="space-y-2">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors duration-150 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="eyebrow mb-3.5 mt-7">
              <Link href="/about#sources" className="hover:text-blue-600">
                Authoritative Sources
              </Link>
            </h3>
            <ul className="space-y-2">
              {EXTERNAL_SOURCES.map((src) => (
                <li key={src.href}>
                  <a
                    href={src.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1 text-sm text-slate-500 transition-colors duration-150 hover:text-blue-600"
                  >
                    <span>{src.name}</span>
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-6 sm:flex-row">
          <p className="label-mono text-slate-400">
            &copy; {year} INSURANCETOOLS.ORG. INFORMATIONAL ONLY, NOT INSURANCE ADVICE.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-slate-400 transition-colors hover:text-slate-600">
              About
            </Link>
            <Link href="/contact" className="text-xs text-slate-400 transition-colors hover:text-slate-600">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
