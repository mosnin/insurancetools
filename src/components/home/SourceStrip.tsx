/**
 * The row that sits where a marketing site would put customer logos. We do
 * not have customer logos, and inventing them would be dishonest, so this
 * strip names the public bodies whose published guidance the calculators
 * are checked against. It does the same job (borrowed credibility) with a
 * claim that is actually true, and it ships authoritative outbound links.
 */

const SOURCES = [
  { short: "NAIC", name: "National Association of Insurance Commissioners", href: "https://content.naic.org/consumer" },
  { short: "III", name: "Insurance Information Institute", href: "https://www.iii.org" },
  { short: "HealthCare.gov", name: "HealthCare.gov", href: "https://www.healthcare.gov" },
  { short: "SBA", name: "U.S. Small Business Administration", href: "https://www.sba.gov" },
  { short: "FEMA", name: "Federal Emergency Management Agency", href: "https://www.floodsmart.gov" },
  { short: "IRS", name: "Internal Revenue Service", href: "https://www.irs.gov" },
];

export function SourceStrip() {
  return (
    <section className="border-b border-hairline bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-center">Rates, limits and thresholds checked against</p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {SOURCES.map((source) => (
            <li key={source.short}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                title={source.name}
                className="group flex items-baseline gap-2 text-slate-400 transition-colors hover:text-slate-900"
              >
                <span className="text-lg font-semibold tracking-[-0.02em]">{source.short}</span>
                <span className="label-mono hidden text-slate-300 transition-colors group-hover:text-slate-400 lg:inline">
                  {source.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
