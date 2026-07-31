import Link from "next/link";

export interface WordmarkProps {
  /** Render as a link to the homepage. Set false inside an existing anchor. */
  asLink?: boolean;
  /** Hide the text and show the mark alone (mobile rails, favicons in copy). */
  markOnly?: boolean;
  /**
   * Drop " Tools" below the `xl` breakpoint, leaving just "Insurance".
   * Used in the header, where the nav needs the horizontal room.
   */
  collapse?: boolean;
  className?: string;
}

/**
 * The Insurance Tools wordmark: a hairline-framed monogram tile next to
 * the name. The tile carries a four cell grid with one filled cell, the
 * same motif the pixel glyphs and section markers use, so the brand reads
 * as one drawing system rather than a logo bolted onto a template.
 */
export function Wordmark({
  asLink = true,
  markOnly = false,
  collapse = false,
  className = "",
}: WordmarkProps) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${asLink ? "" : className}`}>
      <span
        aria-hidden="true"
        className="grid h-7 w-7 shrink-0 grid-cols-2 grid-rows-2 gap-px rounded-md border border-slate-900 bg-slate-900 p-[3px]"
      >
        <span className="rounded-[1px] bg-white" />
        <span className="rounded-[1px] bg-white/35" />
        <span className="rounded-[1px] bg-white/35" />
        <span className="rounded-[1px] bg-blue-500" />
      </span>
      {!markOnly && (
        <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.015em] text-slate-900">
          Insurance
          <span className={`text-slate-400 ${collapse ? "hidden xl:inline" : ""}`}>
            {" "}
            Tools
          </span>
        </span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" className={`inline-block shrink-0 ${className}`} aria-label="Insurance Tools home">
      {content}
    </Link>
  );
}
