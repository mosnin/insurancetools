import Link from "next/link";
import { Reveal } from "@/components/motion";
import { DisplayHeading, Eyebrow } from "@/components/brand";
import { HOME_FAQS } from "./data";

export function Faq() {
  return (
    <section
      id="faq"
      className="border-b border-hairline bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Reveal>
            <Eyebrow>Questions</Eyebrow>
            <DisplayHeading
              className="mt-6"
              lead="Everything people ask"
              emphasis="before they trust a number"
            />
            <p className="mt-6 text-sm leading-relaxed text-slate-500">
              Still unsure which calculator fits your situation? Start from the{" "}
              <Link href="/explore" className="font-medium text-blue-600 hover:text-blue-700">
                explore page
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-700">
                send us a question
              </Link>
              .
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="lg:col-span-8">
          <div className="border-t border-hairline-strong">
            {HOME_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group t-resize-details border-b border-hairline"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[15px] font-medium text-slate-900 transition-colors hover:text-blue-600">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="relative mt-2 block h-2.5 w-2.5 shrink-0"
                  >
                    <span className="absolute left-0 top-1/2 block h-px w-full -translate-y-1/2 bg-slate-400 transition-colors group-open:bg-blue-600" />
                    <span className="absolute left-1/2 top-0 block h-full w-px -translate-x-1/2 bg-slate-400 transition-transform group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
