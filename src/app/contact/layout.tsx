import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

// The contact page itself is a client component, because the form needs
// state. A client component cannot export metadata, so the route's metadata
// lives here in the segment layout instead. This is the standard Next.js
// split and keeps the form interactive without giving up its SEO tags.
const TITLE = `Contact Us | ${SITE_NAME}`;
const DESCRIPTION =
  "Contact Insurance Tools to request a new insurance calculator, report a calculation error, or ask about partnerships. We read every message and reply to most.";
const CANONICAL = `${SITE_URL}/contact`;

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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
