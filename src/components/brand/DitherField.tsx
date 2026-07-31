/**
 * Deterministic halftone art.
 *
 * Every decorative image on the landing page is drawn, not photographed: a
 * grid of dots whose radius follows a smooth field function, thresholded so
 * the result reads as a dithered bitmap rather than a gradient. The output
 * depends only on the props, so the server and client renders always agree
 * and there is no image to download.
 */

export type DitherVariant = "wave" | "peak" | "ridge" | "basin";

export interface DitherFieldProps {
  variant?: DitherVariant;
  /** Dot columns across the field. Rows are derived from the aspect ratio. */
  columns?: number;
  /** Width divided by height. 1.6 is the default landscape plate. */
  aspect?: number;
  /** Tailwind text color class, the dots inherit it via currentColor. */
  className?: string;
  /** Decorative by default. Pass a label to expose it to assistive tech. */
  label?: string;
}

const CELL = 10;
const MAX_RADIUS = 4.6;
/** Dots below this radius are dropped, which is what creates the dither. */
const MIN_RADIUS = 0.5;

/** Cheap deterministic hash in [0, 1), used to roughen the threshold edge. */
function jitter(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function field(variant: DitherVariant, u: number, v: number): number {
  switch (variant) {
    // A diagonal swell that breaks up toward the lower right, the shape used
    // beside long-form explanations.
    case "wave":
      return (
        0.5 +
        0.5 * Math.sin(u * 5.4 + v * 2.1) * Math.cos(v * 3.4 - u * 1.2) -
        0.55 * (u * 0.6 + v * 0.4)
      );
    // A single bright lobe fading outward, used for portrait plates.
    case "peak": {
      const dx = u - 0.42;
      const dy = v - 0.38;
      return 1.15 - 2.6 * Math.sqrt(dx * dx + dy * dy) + 0.14 * Math.sin(u * 14 + v * 9);
    }
    // Vertical bars thinning left to right, used as a column rail.
    case "ridge":
      return 0.72 - 0.85 * u + 0.3 * Math.sin(v * 12.5) * Math.cos(u * 4);
    // A trough with a bright rim, used behind stacked UI mocks.
    case "basin":
    default: {
      const dx = u - 0.5;
      const dy = v - 0.55;
      const r = Math.sqrt(dx * dx + dy * dy);
      return 0.95 - Math.abs(r - 0.3) * 3.4;
    }
  }
}

export function DitherField({
  variant = "wave",
  columns = 40,
  aspect = 1.6,
  className = "text-slate-900",
  label,
}: DitherFieldProps) {
  const rows = Math.max(6, Math.round(columns / aspect));
  const width = columns * CELL;
  const height = rows * CELL;

  const dots: { cx: number; cy: number; r: number }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const u = x / (columns - 1);
      const v = y / (rows - 1);
      const raw = field(variant, u, v) + (jitter(x, y) - 0.5) * 0.22;
      const r = Math.min(1, Math.max(0, raw)) * MAX_RADIUS;
      if (r < MIN_RADIUS) continue;
      dots.push({
        cx: x * CELL + CELL / 2,
        cy: y * CELL + CELL / 2,
        r: Math.round(r * 100) / 100,
      });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <g fill="currentColor">
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
        ))}
      </g>
    </svg>
  );
}
