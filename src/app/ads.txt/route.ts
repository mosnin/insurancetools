import { NextResponse } from "next/server";

/**
 * ads.txt, served from the publisher ID already configured for AdSense.
 *
 * Google requires an authorised sellers file at the domain root before it
 * will serve ads at full value, and a missing or malformed one is a common
 * reason inventory goes unmonetised after approval. Generating it from the
 * same env var the ad slots read means the file cannot drift out of sync
 * with the account, and it 404s while no publisher ID is configured rather
 * than publishing a placeholder that would authorise nobody.
 */

export const dynamic = "force-static";

export function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!publisherId) {
    return new NextResponse(null, { status: 404 });
  }

  // AdSense publisher IDs are stored as "ca-pub-XXXXXXXXXXXXXXXX"; the
  // ads.txt record wants the bare pub- form.
  const sellerId = publisherId.replace(/^ca-/, "");

  return new NextResponse(`google.com, ${sellerId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
