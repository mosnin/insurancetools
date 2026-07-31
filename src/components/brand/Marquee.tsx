import type { ReactNode } from "react";

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. Longer reads calmer. */
  duration?: number;
  /** Travel right to left (default) or left to right. */
  reverse?: boolean;
  /** Gap between items, as a Tailwind gap class. */
  gap?: string;
  className?: string;
}

/**
 * Infinite horizontal marquee.
 *
 * The track holds two identical copies of the children and translates by
 * exactly -50%, so the second copy lands where the first began and the loop
 * is seamless. The duplicate is hidden from assistive tech and removed from
 * the tab order, so screen readers and keyboard users encounter each link
 * once while sighted users see a continuous band.
 *
 * Animation is a single compositor-driven transform: no scroll listener, no
 * layout thrash, nothing on the main thread, and no contribution to CLS
 * because the row height is fixed by its content. The markup is server
 * rendered, so every link is in the HTML a crawler receives whether or not
 * the animation runs. Hover or focus pauses it, and it does not run at all
 * under prefers-reduced-motion.
 */
export function Marquee({
  children,
  duration = 44,
  reverse = false,
  gap = "gap-4",
  className = "",
}: MarqueeProps) {
  return (
    <div className={`marquee-viewport relative overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        data-direction={reverse ? "reverse" : undefined}
        style={{ "--marquee-dur": `${duration}s` } as React.CSSProperties}
      >
        <div className={`flex shrink-0 ${gap} pr-4`}>{children}</div>
        <div className={`flex shrink-0 ${gap} pr-4`} aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}

export interface MarqueeColumnProps {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Vertical variant, used for the slow-scrolling tool lists. Same seamless
 * two-copy technique, same guarantees.
 */
export function MarqueeColumn({
  children,
  duration = 34,
  reverse = false,
  className = "",
}: MarqueeColumnProps) {
  return (
    <div className={`marquee-viewport-y relative overflow-hidden ${className}`}>
      <div
        className="marquee-col"
        data-direction={reverse ? "reverse" : undefined}
        style={{ "--marquee-dur": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 flex-col">{children}</div>
        <div className="flex shrink-0 flex-col" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
