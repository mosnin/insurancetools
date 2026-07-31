import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { breadcrumbStructuredData, SITE_URL, SITE_NAME } from "@/lib/seo";

const CANONICAL = `${SITE_URL}/privacy`;
const TITLE = `Privacy Policy | ${SITE_NAME}`;
const DESCRIPTION =
  "Privacy policy explaining what data Insurance Tools collects, how advertising cookies work, and the choices you have. Read our full privacy practices here.";

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

export default function PrivacyPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Privacy Policy" },
  ];

  return (
    <>
      <StructuredData
        data={[
          breadcrumbStructuredData([
            { name: "Home", url: SITE_URL },
            { name: "Privacy Policy", url: CANONICAL },
          ]),
        ]}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <BreadcrumbNav items={breadcrumbs} />

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <article className="prose-article mt-8">
          <p className="text-slate-600 leading-relaxed mb-4">
            This privacy policy explains what information {SITE_NAME} collects when you use our
            insurance calculators, why we collect it, and what control you have over it. We built
            this site to be useful without requiring an account, so the short version is that we
            collect very little.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Calculator inputs stay in your browser</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Every calculator on this site runs entirely in your browser. The income, home value,
            deductible, or any other number you type into a tool is never transmitted to our
            servers, never stored in a database, and never shared with a third party. Closing the
            tab discards it. This is why the site does not ask you to sign up.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Analytics</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We use Google Analytics and Vercel Analytics to understand which calculators people
            use and how they find them. These services record aggregate information such as the
            pages visited, the approximate geographic region, the referring site, and general
            device and browser characteristics. We use this only to decide which tools to build
            and improve. You can opt out of Google Analytics using the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Analytics opt out browser add on
            </a>
            .
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Advertising and cookies</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            This site is supported by advertising. When advertising is enabled we use Google
            AdSense, and third party vendors including Google use cookies to serve ads based on
            your prior visits to this and other websites. Google&apos;s use of advertising cookies
            enables it and its partners to serve ads to you based on your visit to this site and
            other sites on the internet.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Ads Settings
            </a>
            . You can also opt out of a third party vendor&apos;s use of cookies for personalized
            advertising at{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              aboutads.info
            </a>
            . For a broader explanation of how online tracking works and what your options are,
            the Federal Trade Commission publishes plain language guidance at{" "}
            <a
              href="https://consumer.ftc.gov/articles/how-protect-your-privacy-online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              consumer.ftc.gov
            </a>
            .
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Information we do not collect</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We do not ask for or store your name, email address, postal address, phone number,
            Social Security number, bank account details, or any other directly identifying
            information. We do not sell data, because we do not collect the kind of data that
            could be sold. If you contact us voluntarily, we use the message only to reply.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Children</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            This site is intended for a general adult audience and is not directed at children
            under 13. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Your rights</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Depending on where you live, you may have the right to access, correct, or delete
            personal information a business holds about you, and to opt out of its sale or sharing.
            Because we do not maintain accounts or store the values you enter into calculators,
            there is generally no personal record for us to retrieve or erase. Requests relating to
            advertising identifiers are best directed to the ad platform through the opt out links
            above.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Changes to this policy</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We may update this policy as the site changes. The date at the top of this page always
            reflects the most recent revision. Material changes will be described here rather than
            applied silently.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-3">Contact</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Questions about this policy can be sent through our{" "}
            <Link href="/contact" className="text-blue-600 underline">
              contact page
            </Link>
            . You can also review our{" "}
            <Link href="/terms" className="text-blue-600 underline">
              terms of service
            </Link>{" "}
            or browse the full set of{" "}
            <Link href="/tools" className="text-blue-600 underline">
              insurance calculators
            </Link>
            .
          </p>
        </article>
      </div>
    </>
  );
}
