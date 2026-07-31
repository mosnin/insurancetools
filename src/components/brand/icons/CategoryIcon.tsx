/**
 * Category marks.
 *
 * Rebuilt after the first set read as janky: it used 1.5 and 0.75 unit
 * strokes, dashed guide lines, and hand-plotted arrowheads, none of which
 * survive being rasterised at 44px. Thin strokes land between pixels and go
 * grey, dashes alias into dotted mush, and a three point arrowhead needs to
 * be perfect or it looks broken.
 *
 * The rules this set follows instead:
 *
 * - One stroke weight, 2.25 units, everywhere. No hairlines.
 * - Round caps and joins, so no corner can turn into a spike.
 * - No dashes, no arrowheads finer than the stroke itself.
 * - Every mark fills the 8..40 live area, so none of them float in space.
 * - Exactly one solid blue element per mark, large enough to read at 24px.
 *
 * The result is a set that is legible at 22px in a marquee chip and still
 * substantial at 84px in a feature card. Pure inline SVG: no dependency, no
 * request, no runtime cost.
 */

export type CategoryIconName =
  | "auto"
  | "home"
  | "life"
  | "health"
  | "business"
  | "renters"
  | "travel"
  | "pet"
  | "claims"
  | "deductibles"
  | "coverage"
  | "state-requirements";

export interface CategoryIconProps {
  name: CategoryIconName;
  /** Rendered edge length in pixels. Drawn to work from 20 up. */
  size?: number;
  className?: string;
  /** Accessible name. Omit for decorative use next to a visible label. */
  title?: string;
}

const BLUE = "fill-blue-600";

function Marks({ name }: { name: CategoryIconName }) {
  switch (name) {
    // Car: hood/windshield curve, ground line, two wheels, one solid.
    case "auto":
      return (
        <>
          <path d="M8 31 L11.5 20 Q13.5 16.5 18 16.5 H30 Q34.5 16.5 36.5 20 L40 31" />
          <path d="M6 31 H42" />
          <circle cx="15.5" cy="34.5" r="4.5" />
          <circle cx="32.5" cy="34.5" r="4.5" className={BLUE} stroke="none" />
        </>
      );

    // Elevation: roof, walls, a solid door.
    case "home":
      return (
        <>
          <path d="M8 22 L24 9 L40 22" />
          <path d="M12.5 22 V38" />
          <path d="M35.5 22 V38" />
          <path d="M7 38 H41" />
          <rect x="20" y="27" width="8" height="11" rx="1.5" className={BLUE} stroke="none" />
        </>
      );

    // Heart with a solid pulse line.
    case "life":
      return (
        <>
          <path d="M24 40 C10 30 7 22 7 16.5 C7 11 11.5 8 16 8 C20 8 23 10.5 24 14 C25 10.5 28 8 32 8 C36.5 8 41 11 41 16.5 C41 22 38 30 24 40 Z" />
          <path d="M13 24 H19 L22 18.5 L25.5 29.5 L28.5 24 H35" className="stroke-blue-600" />
        </>
      );

    // Cross in a circle, solid center.
    case "health":
      return (
        <>
          <circle cx="24" cy="24" r="15.5" />
          <path d="M24 16 V32" />
          <path d="M16 24 H32" />
          <circle cx="24" cy="24" r="3" className={BLUE} stroke="none" />
        </>
      );

    // Case with a handle and a solid latch.
    case "business":
      return (
        <>
          <rect x="7" y="14" width="34" height="25" rx="4" />
          <path d="M18 14 V11 A3 3 0 0 1 21 8 H27 A3 3 0 0 1 30 11 V14" />
          <path d="M7 24 H41" />
          <rect x="20" y="20" width="8" height="8" rx="2" className={BLUE} stroke="none" />
        </>
      );

    // Apartment block, four windows, one solid.
    case "renters":
      return (
        <>
          <rect x="10" y="8" width="28" height="32" rx="2" />
          <path d="M10 40 H38" />
          <rect x="15" y="14" width="6" height="6" rx="1" />
          <rect x="27" y="14" width="6" height="6" rx="1" />
          <rect x="15" y="24" width="6" height="6" rx="1" className={BLUE} stroke="none" />
          <rect x="27" y="24" width="6" height="6" rx="1" />
        </>
      );

    // Paper airplane, one solid marker.
    case "travel":
      return (
        <>
          <path d="M8 24 L40 10 L27 40 L22 27 L8 24 Z" />
          <path d="M22 27 L40 10" />
          <circle cx="34" cy="16" r="2.4" className={BLUE} stroke="none" />
        </>
      );

    // Paw print: four toes, one solid pad.
    case "pet":
      return (
        <>
          <circle cx="16" cy="16" r="4.5" />
          <circle cx="32" cy="16" r="4.5" />
          <circle cx="11" cy="27" r="4" />
          <circle cx="37" cy="27" r="4" />
          <path
            d="M24 24 C31 24 35 30 35 35 C35 39.5 31 41 27 39 C25.5 38.2 22.5 38.2 21 39 C17 41 13 39.5 13 35 C13 30 17 24 24 24 Z"
            className={BLUE}
            stroke="none"
          />
        </>
      );

    // Clipboard, solid clip, checkmark.
    case "claims":
      return (
        <>
          <rect x="11" y="9" width="26" height="34" rx="3" />
          <rect x="18" y="6" width="12" height="6" rx="2" className={BLUE} stroke="none" />
          <path d="M17 25 L21.5 29.5 L31 20" className="stroke-blue-600" />
        </>
      );

    // Wallet, fold line, solid coin.
    case "deductibles":
      return (
        <>
          <rect x="7" y="14" width="34" height="24" rx="4" />
          <path d="M7 21 H41" />
          <circle cx="32" cy="27.5" r="3.5" className={BLUE} stroke="none" />
        </>
      );

    // Shield with a solid confirmation mark.
    case "coverage":
      return (
        <>
          <path d="M24 7 L38 12.5 V24 C38 32 31.5 38.5 24 41 C16.5 38.5 10 32 10 24 V12.5 Z" />
          <path d="M17.5 23.5 L22 28 L30.5 19.5" className="stroke-blue-600" />
        </>
      );

    // Map pin, solid center.
    case "state-requirements":
      return (
        <>
          <path d="M24 41 C24 41 37 28.5 37 18.5 C37 11.5 31 6 24 6 C17 6 11 11.5 11 18.5 C11 28.5 24 41 24 41 Z" />
          <circle cx="24" cy="18.5" r="5.5" className={BLUE} stroke="none" />
        </>
      );
  }
}

export function CategoryIcon({ name, size = 64, className = "", title }: CategoryIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title && <title>{title}</title>}
      <Marks name={name} />
    </svg>
  );
}
