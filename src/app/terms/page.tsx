import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { breadcrumbStructuredData, SITE_URL, SITE_NAME } from "@/lib/seo";

const CANONICAL = `${SITE_URL}/terms`;
const TITLE = `Terms of Service | ${SITE_NAME}`;
const DESCRIPTION =
  "Terms of service for Insurance Tools, covering acceptable use, the educational nature of our calculators, accuracy limits, and liability. Read the full terms here.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
};

const LAST_UPDATED = "July 28, 2026";

export default function TermsPage() {
  const breadcrumbs = [{ name: "Home", href: "/" }, { name: "Terms of Service" }];

  return (
    <>
      <StructuredData
        data={[
          breadcrumbStructuredData([
            { name: "Home", url: SITE_URL },
            { name: "Terms of Service", url: CANONICAL },
          ]),
        ]}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BreadcrumbNav items={breadcrumbs} />

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <article className="prose-article mt-8">
          <p className="text-slate-600 leading-relaxed mb-4">
            These terms govern your use of {SITE_NAME}. By using the site you agree to them. They
            are written to be read, not to be impenetrable, so the important points come first.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Not insurance advice</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            This is the most important term on the page. Every calculator, article, and figure on
            this site is provided for educational and informational purposes only. Nothing here is
            insurance, financial, tax, or legal advice, and using the site does not create an
            advisory relationship or a quote. We are not an insurer, a licensed insurance agent, a
            broker, or a tax preparer.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Coverage decisions depend on circumstances a calculator cannot see, including
            underwriting, state rules, and insurer-specific terms. Before acting on any result,
            consult a licensed insurance agent who knows your full situation. For help finding your
            state&apos;s insurance department, the NAIC maintains a directory at{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              naic.org
            </a>
            .
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Accuracy and limitations</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We work hard to implement standard coverage, deductible, and claims math correctly and
            to cite primary sources such as the NAIC and HealthCare.gov. Even so, results are
            estimates. Models simplify, state rules change, insurers underwrite differently, and
            real policies contain terms a general purpose tool cannot model. A small difference in
            risk factors can move a real quote meaningfully.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            State minimum requirements and plan terminology change over time. Where we cite a
            figure, we name the source. Always confirm current requirements against the relevant
            authority, for example your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              state&apos;s insurance department
            </a>
            , before buying or renewing a policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Acceptable use</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            You may use these calculators freely for personal and commercial decision making. You
            may not scrape the site at a volume that degrades it for others, attempt to breach or
            probe its security, misrepresent our content as your own, or republish our articles
            wholesale without attribution and a link back.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Availability</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            The site is provided as is and as available. We may change, suspend, or remove any
            calculator or article at any time, and we do not guarantee uninterrupted access.
            Calculators run in your browser, so they generally keep working during brief network
            interruptions once a page has loaded.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Third party links and advertising</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Articles link to outside sources, and the site carries advertising. We do not control
            third party sites or the ads served to you, and a link is not an endorsement. Your
            dealings with any advertiser or linked site are solely between you and them. See our{" "}
            <Link href="/privacy" className="text-blue-600 underline">
              privacy policy
            </Link>{" "}
            for how advertising cookies work and how to opt out.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Limitation of liability</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            To the maximum extent permitted by law, {SITE_NAME} is not liable for any indirect,
            incidental, or consequential losses arising from your use of the site, including
            financial losses resulting from coverage decisions informed by a calculator result.
            Some jurisdictions do not allow certain exclusions, so parts of this section may not
            apply to you.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Intellectual property</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            The articles, page designs, and calculator implementations on this site are ours. The
            underlying coverage and claims math is not, it is standard and freely usable. You are
            welcome to quote a short passage with a link back to the page it came from.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Changes</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We may revise these terms as the site evolves. The date at the top reflects the most
            recent revision, and continued use after a change means you accept the revised terms.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Contact</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Questions can be sent through our{" "}
            <Link href="/contact" className="text-blue-600 underline">
              contact page
            </Link>
            . You can also browse every{" "}
            <Link href="/tools" className="text-blue-600 underline">
              insurance calculator
            </Link>{" "}
            or{" "}
            <Link href="/explore" className="text-blue-600 underline">
              explore tools by category
            </Link>
            .
          </p>
        </article>
      </div>
    </>
  );
}
