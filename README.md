# Insurance Tools

Free, browser-based insurance calculators. Insurance Tools helps people figure out what
coverage they need, how much of it, what a claim might pay, and whether a policy or
upgrade is worth it, before they talk to an agent or request a quote.

Live at [insurancetools.org](https://insurancetools.org).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel. Every calculator
runs client-side; no user input is ever sent to a server.

## Structure

- `src/lib/tools.ts` — the calculator registry (`TOOLS`) and category list (`CATEGORIES`)
- `src/lib/category-content.ts` — the 12-category taxonomy and each category's SEO content
- `src/lib/nav.ts` — header mega menu and footer link data
- `src/app/tools/<category>/` — category hub pages; individual calculators ship as
  `src/app/tools/<category>/<slug>/page.tsx`
- `src/components/tools/` — shared tool UI framework (FAQ, related tools, result charts)

## Category taxonomy

Auto, Home, Life, Health, Business, Renters, Travel, Pet, Claims, Deductibles, Coverage,
State Requirements. The library launched with this taxonomy in place and the calculator
list empty; tools ship in one category at a time.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.local.example` to `.env.local` and fill in values to enable AdSense, Google
Analytics, and view-count tracking (all optional — the site works fully without them).

## Not insurance advice

Every calculator here is math applied to numbers a user supplies, for educational and
informational purposes only. Nothing on the site is insurance, financial, tax, or legal
advice, and no result is a quote from any insurer.
