import type { Metadata } from "next";
import Link from "next/link";
import { WaterDamageClaimCalculatorTool } from "@/components/tools/WaterDamageClaimCalculatorTool";
import { FAQSection } from "@/components/tools/FAQSection";
import { LastUpdated } from "@/components/tools/LastUpdated";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { StructuredData } from "@/components/seo/StructuredData";
import { AdLeaderboard, AdInArticle } from "@/components/ads";
import { getToolBySlug } from "@/lib/tools";
import {
  toolStructuredData,
  breadcrumbStructuredData,
  faqStructuredData,
  SITE_URL,
  SITE_NAME,
} from "@/lib/seo";

const tool = getToolBySlug("water-damage-claim-calculator")!;

const TITLE = "Free Water Damage Claim Calculator | Insurance Tools";
const DESCRIPTION =
  "Use this water damage claim calculator to estimate your insurance payout after a pipe burst, appliance leak, or covered water loss, based on your repair estimate, deductible, and any policy sublimit.";
const PAGE_URL = `${SITE_URL}/tools/home/water-damage-claim-calculator`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: tool.keywords.join(", "),
  authors: [{ name: SITE_NAME }],
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
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
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

const faqs = [
  {
    question: "Does this water damage claim calculator tell me if my loss is covered?",
    answer:
      "No. It only does the payout math once coverage exists: the lesser of your repair cost and any water damage sublimit, minus your deductible. Whether the specific loss is covered at all depends on your policy's cause-of-loss language and any exclusions for gradual damage, flood, or lack of maintenance. Read your declarations page or ask your insurer before assuming a number here will actually be paid.",
  },
  {
    question: "Why did my estimated payout come out to $0?",
    answer:
      "That happens when your repair cost, or the portion of it capped by a water damage sublimit, is at or below your deductible. Insurance is built to cover losses larger than your deductible, not to reimburse every dollar of every repair, so small water damage claims often net close to nothing after the deductible applies. Many homeowners choose to pay those smaller losses out of pocket rather than file a claim that pays little and still appears in their claims history.",
  },
  {
    question: "What is a water damage sublimit and how do I know if I have one?",
    answer:
      "A sublimit is a lower cap some policies place on specific types of water loss, most commonly sewer or drain backup and sometimes mold remediation, that applies even if your overall dwelling coverage limit is much higher. Not every policy has one, and the amount varies by insurer and by endorsement. Check your policy's declarations page or endorsement list for a line item naming backup, overflow, or water damage sublimit; if you don't see one, leave that field at $0.",
  },
  {
    question: "Is flood damage the same as water damage for insurance purposes?",
    answer:
      "No, and this is one of the most expensive misunderstandings in home insurance. A standard homeowners policy typically treats flood, meaning water that rises from outside the home such as groundwater, surface runoff, or storm surge, as excluded, while sudden interior water losses like a burst pipe are typically covered. Flood coverage generally has to be purchased separately, most commonly through the National Flood Insurance Program or a private flood insurer.",
  },
  {
    question: "How is sudden water damage different from gradual damage in a claim decision?",
    answer:
      "Insurers generally distinguish loss by cause: a sudden, accidental event like a burst supply line or a failed appliance hose is typically covered because it wasn't something a homeowner could reasonably have prevented in the moment. A leak that develops slowly over weeks or months, such as a dripping fitting behind a wall, is typically treated as a maintenance failure the homeowner should have caught, and is typically excluded. Adjusters look at physical evidence, like the extent of mold growth or wood rot, to decide which category a claim falls into.",
  },
];

const breadcrumbs = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "Home Calculators", href: "/tools/home" },
  { name: tool.name },
];

const jsonLd = [
  toolStructuredData(tool),
  breadcrumbStructuredData(
    breadcrumbs.map((b) => ({ name: b.name, url: b.href ? `${SITE_URL}${b.href}` : PAGE_URL }))
  ),
  faqStructuredData(faqs),
];

export default function WaterDamageClaimCalculatorPage() {
  return (
    <>
      <StructuredData data={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-6">
          <BreadcrumbNav items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Water Damage Claim Calculator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Estimate what a water damage claim might actually pay after your deductible and any policy
            sublimit, and see where the common sudden-versus-gradual-versus-flood line usually falls.
            Free, instant, and it never asks who you are.
          </p>
          <LastUpdated category="home" />
        </div>

        <div className="mt-2">
          <WaterDamageClaimCalculatorTool />
        </div>

        <div className="my-10">
          <AdLeaderboard slot="tool-water-damage-top" />
        </div>

        <article className="prose-like mt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who This Water Damage Claim Calculator Is For</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This tool is for the moment right after a restoration company or plumber hands you a repair
            estimate and you need a fast, rough sense of what your insurer is likely to actually pay, not
            the full repair bill. It&apos;s also useful before you call your insurer at all, when you&apos;re
            trying to decide whether a leak is even worth filing a claim over once the deductible eats
            into it. It is not built for people who already have a written settlement offer in hand;
            those numbers should come from your adjuster, not from a browser calculator that has never
            seen your policy.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Sudden Water Damage, Gradual Damage, and Flood: Why the Cause Matters
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Homeowners insurance sorts water losses by cause, not just by the amount of damage, and the
            cause is usually the single biggest factor in whether a claim gets paid at all. A sudden and
            accidental event, such as a supply line bursting behind a washing machine or a pipe freezing
            and splitting overnight, is typically covered under a standard homeowners policy, because the
            homeowner had no reasonable way to prevent or catch it before damage occurred. A slow leak
            that seeps for weeks or months, often discovered only once mold or rot has spread, is
            typically excluded, since insurers generally classify it as a maintenance issue the homeowner
            should have found sooner. Flood water, meaning water that enters from outside the structure
            through rising groundwater, surface runoff, or storm surge, sits in its own category entirely
            and is typically excluded from a standard homeowners policy regardless of how sudden the flood
            was, which is why flood coverage is usually sold as a separate policy. None of this is
            guaranteed by law or uniform across every insurer; it reflects widely used policy language,
            not a specific carrier&apos;s contract, so always confirm the actual cause-of-loss terms in your
            own declarations page.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">How the Payout Estimate Is Calculated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The calculator starts with the repair or remediation cost you enter, ideally pulled from a
            contractor&apos;s or restoration company&apos;s written estimate rather than a guess. If your policy has
            a water damage sublimit, meaning a separate, lower cap some insurers apply to specific losses
            like sewer or drain backup, the tool caps the repair cost at that sublimit before doing
            anything else, since a sublimit overrides the general dwelling limit for that type of loss. It
            then subtracts your deductible from whichever figure is smaller, and floors the result at
            zero, since a policy never pays a negative amount. Leaving the sublimit field at $0 tells the
            calculator you don&apos;t have one, which is the right setting for most standard homeowners and
            renters policies.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Worked Example</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Say a supply line to a dishwasher fails overnight and floods part of a kitchen and the room
            below it. A restoration company estimates $12,000 to dry, repair, and replace flooring and
            drywall. The policy has a standard $1,000 deductible and no separate water damage sublimit.
            Because there&apos;s no sublimit, the calculator uses the full $12,000 repair cost and subtracts
            the $1,000 deductible, landing on an estimated $11,000 payout, with roughly $1,000 remaining
            as out-of-pocket cost. Because the cause was a sudden appliance failure rather than a slow
            leak or outside flooding, this loss also falls into the category that&apos;s typically covered, so
            the estimate is at least plausible to bring into a claim conversation, not automatically
            disqualified by the cause of loss.
          </p>

          <AdInArticle slot="tool-water-damage-mid" />

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Mistakes This Tool Helps Avoid</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The most common mistake is assuming any water in the house is treated the same by an insurer,
            when cause of loss is usually the deciding factor long before the dollar amount matters. A
            second is filing a claim for a repair that barely clears the deductible, which can leave a
            claim on record for years while paying out very little. A third, and often the most expensive,
            is discovering only after a flood that a standard homeowners policy never covered rising water
            in the first place, because flood coverage was assumed to already be included. A fourth is
            confusing a sewer or drain backup sublimit with the full dwelling limit, then being surprised
            when a backup claim pays far less than a comparable fire or wind claim would.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Assumptions and Limitations</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This calculator assumes the repair estimate you enter is reasonably accurate and that any
            sublimit you enter is the correct figure from your own policy; it does not verify either
            number against a real policy document. It applies one deductible and, optionally, one
            sublimit, and does not model coinsurance penalties, separate mold or debris removal caps, code
            upgrade coverage, or additional living expenses, all of which can appear on a real water
            damage claim depending on the policy and the state. It does not determine whether a loss is
            covered at all, and the sudden-versus-gradual-versus-flood guidance here describes common
            industry patterns, not a specific insurer&apos;s contract language, which can and does vary. Treat
            every figure here as a planning number to bring into a conversation with your insurer or a
            licensed claims adjuster, not as a final settlement amount.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Terms Used on This Page</h2>
          <ul className="list-disc pl-5 text-slate-700 leading-relaxed mb-4 space-y-1.5">
            <li>
              <strong>Water damage sublimit</strong> — a lower coverage cap some policies apply to specific
              water losses, such as sewer or drain backup, that overrides the general dwelling limit for
              that type of claim.
            </li>
            <li>
              <strong>Sudden and accidental loss</strong> — damage from an abrupt, unexpected event, like a
              burst pipe, that a policy typically covers because it couldn&apos;t reasonably have been prevented
              in the moment.
            </li>
            <li>
              <strong>Flood insurance</strong> — separate coverage for water that enters from outside the
              home, such as rising groundwater or storm surge, which a standard homeowners policy typically
              does not cover.
            </li>
          </ul>

          <p className="text-slate-700 leading-relaxed mb-4">
            For a broader look at what a standard homeowners policy does and doesn&apos;t include, the{" "}
            <a
              href="https://www.iii.org/article/homeowners-insurance-basics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Insurance Information Institute
            </a>{" "}
            publishes an overview of standard coverage. For flood-specific coverage, including how it
            differs from a homeowners policy and how to purchase it, see{" "}
            <a
              href="https://www.floodsmart.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              FloodSmart.gov
            </a>
            , the National Flood Insurance Program&apos;s consumer site. For general guidance on the claims
            process itself, the{" "}
            <a
              href="https://content.naic.org/consumer/filing-a-claim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              National Association of Insurance Commissioners
            </a>{" "}
            publishes consumer guidance on filing and handling a claim. If you have questions specific to
            your state&apos;s claims rules or your insurer&apos;s obligations, your{" "}
            <a
              href="https://content.naic.org/state-insurance-departments"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              state&apos;s Department of Insurance
            </a>{" "}
            is the authoritative source.
          </p>

          <p className="text-slate-700 leading-relaxed">
            This calculator is part of the{" "}
            <Link href="/tools/home" className="text-blue-600 hover:underline">
              Home insurance calculators
            </Link>{" "}
            category. If you&apos;re deciding what deductible to carry going forward, the{" "}
            <Link href="/tools/deductibles" className="text-blue-600 hover:underline">
              deductible calculators
            </Link>{" "}
            walk through that tradeoff, and for other loss types or a broader look at how settlements are
            typically calculated, the{" "}
            <Link href="/tools/claims" className="text-blue-600 hover:underline">
              claims calculators
            </Link>{" "}
            cover related scenarios.
          </p>
        </article>

        <FAQSection faqs={faqs} />

        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-base font-semibold text-slate-900">About Insurance Tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Insurance Tools builds free, browser-based calculators that help you understand coverage,
            claims, and costs before you&apos;re already on the phone with an insurer. Every tool runs entirely
            on your device, keeps the numbers you enter private, and aims to leave you better prepared for
            the conversation that comes next, whether that&apos;s with an agent, an adjuster, or a contractor.
          </p>
        </section>
      </div>
    </>
  );
}
