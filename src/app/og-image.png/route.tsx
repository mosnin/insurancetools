import { ImageResponse } from "next/og";
import { CATEGORY_ORDER } from "@/lib/category-content";

/**
 * The site's Open Graph card, served at /og-image.png.
 *
 * Every page's metadata pointed at this path, across 452 files, and the file
 * did not exist. Every Open Graph and Twitter card on the site was a 404,
 * which means every share rendered blank and any reviewer checking the site
 * saw a broken asset. Generating it from a route rather than committing a
 * binary keeps it in the same design language as the site and lets the tool
 * count stay accurate as the catalog grows.
 */

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark: the same monogram tile the header uses. */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#0f172a",
              padding: "7px",
            }}
          >
            <div style={{ width: "19px", height: "19px", background: "#ffffff", borderRadius: "2px" }} />
            <div style={{ width: "19px", height: "19px", background: "#ffffff59", borderRadius: "2px" }} />
            <div style={{ width: "19px", height: "19px", background: "#ffffff59", borderRadius: "2px" }} />
            <div style={{ width: "19px", height: "19px", background: "#3b82f6", borderRadius: "2px" }} />
          </div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#0f172a" }}>Insurance</span>
            <span style={{ color: "#94a3b8" }}>&nbsp;Tools</span>
          </div>
        </div>

        {/* Two tone headline, matching the site's display treatment. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "76px",
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
          }}
        >
          <span style={{ color: "#94a3b8", fontWeight: 300 }}>Free insurance calculators for</span>
          <span style={{ color: "#0f172a", fontWeight: 500 }}>every coverage decision you face</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "28px",
            fontSize: "24px",
            color: "#64748b",
          }}
        >
          <span>
            {CATEGORY_ORDER.length} categories, no sign-up
          </span>
          <span style={{ color: "#2563eb" }}>insurancetools.org</span>
        </div>
      </div>
    ),
    size
  );
}
