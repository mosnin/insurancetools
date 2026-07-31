import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { CategoryIcon, DisplayHeading, Eyebrow, type CategoryIconName } from "@/components/brand";
import { TOTAL_CATEGORY_COUNT } from "./data";

interface Capability {
  glyph: CategoryIconName;
  title: string;
  body: string;
  meta: string;
  href: string;
  hrefLabel: string;
}

const CAPABILITIES: Capability[] = [
  {
    glyph: "coverage",
    title: "One calculator per question",
    body:
      "Nothing here is a general purpose quote form with a dropdown bolted on. Each calculator is built for a single question, how much coverage, what deductible, what a claim pays, with the inputs that question actually needs and none of the ones it does not.",
    meta: `${TOTAL_CATEGORY_COUNT} categories, growing`,
    href: "/tools",
    hrefLabel: "Browse the tools directory",
  },
  {
    glyph: "deductibles",
    title: "Answers while you type",
    body:
      "Results recompute on every keystroke, so changing a deductible or a coverage limit is a comparison rather than a fresh calculation. That turns a calculator into somewhere you test five scenarios in a minute instead of somewhere you look up one number and leave.",
    meta: "No submit button, no page reload",
    href: "/tools/deductibles",
    hrefLabel: "Try the deductible calculators",
  },
  {
    glyph: "life",
    title: "Your figures stay on your device",
    body:
      "Every calculation runs in your browser. Income, home value, and medical spending figures are never posted to a server, never attached to an account, and never sold to an insurer, because there is no account to attach them to in the first place.",
    meta: "No sign-up, nothing stored",
    href: "/privacy",
    hrefLabel: "Read the privacy policy",
  },
];

export function CapabilitiesSection() {
  return (
    <section className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <Eyebrow>What you get</Eyebrow>
          <DisplayHeading
            className="mt-6"
            lead="Purpose built calculators,"
            emphasis="fast enough to think with"
          />
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {CAPABILITIES.map((cap) => (
            <StaggerItem key={cap.title} className="h-full">
              <div className="group flex h-full flex-col rounded-2xl border border-hairline-strong bg-white p-7 transition-colors hover:border-blue-200">
                <div className="flex h-32 items-center justify-center rounded-xl border border-hairline bg-slate-50/60 text-slate-900 transition-colors group-hover:text-blue-700">
                  <CategoryIcon name={cap.glyph} size={84} />
                </div>
                <h3 className="mt-6 text-base font-semibold text-slate-900">{cap.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-500">{cap.body}</p>
                <p className="label-mono mt-6 border-t border-hairline pt-4 text-slate-400">
                  {cap.meta.toUpperCase()}
                </p>
                <Link
                  href={cap.href}
                  className="mt-3 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  {cap.hrefLabel}
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
