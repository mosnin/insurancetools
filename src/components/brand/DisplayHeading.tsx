import type { ElementType, ReactNode } from "react";

export interface DisplayHeadingProps {
  /** The quiet first clause, set in a light weight and a muted tone. */
  lead: ReactNode;
  /** The emphasised second clause, set solid in near-black. */
  emphasis: ReactNode;
  as?: ElementType;
  size?: "xl" | "lg" | "md";
  align?: "left" | "center";
  className?: string;
}

const SIZES: Record<NonNullable<DisplayHeadingProps["size"]>, string> = {
  xl: "text-[2.1rem] sm:text-5xl lg:text-[3.4rem]",
  lg: "text-[1.75rem] sm:text-4xl lg:text-[2.6rem]",
  md: "text-2xl sm:text-3xl",
};

/**
 * The landing page heading treatment: a light weight, muted opening clause
 * that hands off to a solid, near-black emphasis. The contrast between the
 * two carries the hierarchy, so headings can stay large without shouting.
 */
export function DisplayHeading({
  lead,
  emphasis,
  as: Tag = "h2",
  size = "lg",
  align = "left",
  className = "",
}: DisplayHeadingProps) {
  return (
    <Tag
      className={`${SIZES[size]} font-light leading-[1.12] tracking-[-0.03em] text-slate-400 ${
        align === "center" ? "text-center" : ""
      } ${className}`}
    >
      {lead}{" "}
      <span className="font-medium text-slate-900">{emphasis}</span>
    </Tag>
  );
}
