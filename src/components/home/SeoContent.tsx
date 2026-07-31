import Link from "next/link";
import { Reveal } from "@/components/motion";
import { AdInArticle } from "@/components/ads";
import { DisplayHeading, Eyebrow, SectionRule } from "@/components/brand";

const EXTERNAL = "text-blue-600 hover:text-blue-700 underline underline-offset-2";
const INTERNAL = "font-medium text-blue-600 hover:text-blue-700";

/**
 * The homepage article. This is the block that ranks: focus keyword "free
 * insurance calculators" plus long tail variants, kept inside the 2 to 3
 * percent combined density band, with keyword-rich internal anchors into
 * the category hubs and authoritative outbound links.
 */
export function SeoContent() {
  return (
    <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>The long version</Eyebrow>
          <DisplayHeading
            as="h2"
            className="mt-6"
            lead="A complete guide to"
            emphasis="free insurance calculators"
          />
          <SectionRule className="mt-8" label="01" />
        </Reveal>

        <Reveal className="mt-8 space-y-5 leading-relaxed text-slate-600">
          <p>
            Insurance decisions get easier the moment you can see the math behind them. That is the
            premise of this site: a library of free insurance calculators that turns &ldquo;how much
            coverage do I need&rdquo; from a guess into a number you can check. Comparing a $500 deductible
            against a $1,000 one, working out what a total loss actually pays, checking whether a
            coverage upgrade is worth its added premium: each has a purpose built tool here rather
            than a quote form that assumes you already know what you want to buy.
          </p>
          <p>
            Insurance Tools is organized into {" "}
            <Link href="/tools" className={INTERNAL}>
              12 categories
            </Link>
            , from everyday auto and home coverage through business liability and claims math.
            Nothing requires an account, nothing is metered, and every result is computed in your
            browser as you type. If you know what you need, the spotlight search at the top of this
            page finds it in a keystroke or two. If you do not, the categories group tools by the
            decision they answer: what to buy, how much, what a claim pays, and whether an upgrade
            is worth it.
          </p>

          <h3 className="pt-3 text-lg font-semibold text-slate-900">
            Why a calculator beats a quote form
          </h3>
          <p>
            A quote form assumes you already know what coverage to request, then optimizes for
            getting your contact information. An insurance calculator does the opposite: it works out
            the coverage question first, with labelled inputs, realistic defaults, and a result that
            updates on every keystroke. Change a deductible or a coverage limit and the outcome moves
            with it, which is what makes these useful for comparing scenarios rather than producing a
            single number you then have to interpret alone.
          </p>
          <p>
            The second advantage is verification. A quote form gives you a premium and no way to
            check the reasoning behind it. Every calculator on this site states the math it applies
            and breaks the result into its components, so a coverage recommendation arrives split
            into dwelling, liability, and personal property, and a claim estimate arrives split into
            replacement cost and depreciation. When you can see the parts, you can tell a right
            answer from a merely plausible one.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <SectionRule label="02" />
          <h2 className="mt-8 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
            How these free insurance calculators are built
          </h2>
        </Reveal>

        <Reveal className="mt-6 space-y-5 leading-relaxed text-slate-600">
          <p>
            None of the math here is proprietary or hidden inside a model. Every calculator applies
            standard coverage, deductible, and claims methodology used across the industry: needs
            analysis for life insurance, replacement cost math for property, and break-even math for
            deductible comparisons. Two families of questions account for most of what visitors come
            looking for.
          </p>

          <h3 className="pt-3 text-lg font-semibold text-slate-900">Coverage and needs math</h3>
          <p>
            The{" "}
            <Link href="/tools/coverage" className={INTERNAL}>
              coverage calculators
            </Link>{" "}
            and the{" "}
            <Link href="/tools/life" className={INTERNAL}>
              life insurance calculators
            </Link>{" "}
            both work backward from a target: how much liability protection matches your assets, or
            how many years of income a household would need replaced. Sizing the target correctly is
            the difference between guessing at a policy amount and planning one, which is also why
            the{" "}
            <Link href="/tools/home" className={INTERNAL}>
              home insurance calculators
            </Link>{" "}
            and the{" "}
            <Link href="/tools/business" className={INTERNAL}>
              business insurance calculators
            </Link>{" "}
            are both built around the same needs-first approach.
          </p>

          <h3 className="pt-3 text-lg font-semibold text-slate-900">Deductible and claims math</h3>
          <p>
            The{" "}
            <Link href="/tools/deductibles" className={INTERNAL}>
              deductible calculators
            </Link>{" "}
            and the{" "}
            <Link href="/tools/claims" className={INTERNAL}>
              claims calculators
            </Link>{" "}
            both rest on the same underlying trade-off: a lower premium now against a larger
            out-of-pocket cost later. Break-even math turns that trade-off into a specific number of
            months or years, which is why these two categories are among the highest-intent on the
            site. The same logic drives the{" "}
            <Link href="/tools/auto" className={INTERNAL}>
              auto insurance calculators
            </Link>{" "}
            and the{" "}
            <Link href="/tools/health" className={INTERNAL}>
              health insurance calculators
            </Link>
            , pointed at a slightly different question each time.
          </p>
        </Reveal>

        <AdInArticle slot="home-in-article" />

        <Reveal className="mt-12">
          <SectionRule label="03" />
          <h2 className="mt-8 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
            Choosing the right calculator for your situation
          </h2>
        </Reveal>

        <Reveal className="mt-6 space-y-5 leading-relaxed text-slate-600">
          <p>
            Most visitors arrive with one of a handful of questions. If you are buying or renewing a
            policy, start with{" "}
            <Link href="/tools/coverage" className={INTERNAL}>
              coverage calculators
            </Link>{" "}
            to size the amount before comparing quotes. If you already have offers and are choosing
            between deductible levels, the{" "}
            <Link href="/tools/deductibles" className={INTERNAL}>
              deductible calculators
            </Link>{" "}
            work out the break-even point directly. If you are dealing with an active loss, the{" "}
            <Link href="/tools/claims" className={INTERNAL}>
              claims calculators
            </Link>{" "}
            estimate what a settlement might actually pay before you accept an offer.
          </p>
          <p>
            Business owners and freelancers reach for a different shelf, including the{" "}
            <Link href="/tools/business" className={INTERNAL}>
              business insurance calculators
            </Link>{" "}
            for liability, cyber, and workers&apos; comp exposure. Renters, travelers, and pet owners each
            have a dedicated category too, since{" "}
            <Link href="/tools/renters" className={INTERNAL}>
              renters
            </Link>
            ,{" "}
            <Link href="/tools/travel" className={INTERNAL}>
              travel
            </Link>
            , and{" "}
            <Link href="/tools/pet" className={INTERNAL}>
              pet
            </Link>{" "}
            coverage each answer a fairly narrow question well. Anyone unsure what their state
            actually requires can start with the{" "}
            <Link href="/tools/state-requirements" className={INTERNAL}>
              state requirement calculators
            </Link>
            . The full index lives in the{" "}
            <Link href="/tools" className={INTERNAL}>
              tools directory
            </Link>
            , and the{" "}
            <Link href="/explore" className={INTERNAL}>
              explore page
            </Link>{" "}
            groups everything by category if you would rather scan than search.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <SectionRule label="04" />
          <h2 className="mt-8 text-2xl font-semibold tracking-[-0.02em] text-slate-900">
            Where to verify the numbers yourself
          </h2>
        </Reveal>

        <Reveal className="mt-6 space-y-5 leading-relaxed text-slate-600">
          <p>
            A calculator is a planning instrument, not a quote or a policy, and that matters most
            once state requirements or plan rules enter the picture. For coverage definitions and
            consumer guidance across every line of insurance, the{" "}
            <a
              href="https://content.naic.org/consumer"
              target="_blank"
              rel="noopener noreferrer"
              className={EXTERNAL}
            >
              National Association of Insurance Commissioners
            </a>{" "}
            is the authority our figures are checked against. For health plan terminology and
            out-of-pocket rules, {" "}
            <a
              href="https://www.healthcare.gov/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className={EXTERNAL}
            >
              HealthCare.gov
            </a>{" "}
            maintains the official definitions. For state-specific minimum requirements, your
            state&apos;s Department of Insurance is the primary source our{" "}
            <Link href="/tools/state-requirements" className={INTERNAL}>
              state requirement calculators
            </Link>{" "}
            point back to.
          </p>
          <p>
            Used that way, free insurance calculators do the job they should. They turn a vague
            worry into a specific number, show you which input the answer is most sensitive to, and
            send you into a conversation with a licensed agent already knowing what you are asking
            for. When a decision involves real coverage at scale, treat every result here as the
            start of that conversation rather than the end of it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
