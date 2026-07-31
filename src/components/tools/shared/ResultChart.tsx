"use client";

/**
 * A small stacked-area plot for calculator results.
 *
 * Four of 446 calculators had any visualisation at all, which is why unique
 * tools still read as one templated form repeated hundreds of times. This is
 * the shared primitive that fixes that: give it a series of periods with a
 * base and a top value and it draws the split over time.
 *
 * Pure SVG and pure arithmetic, so it adds no dependency, no request, and no
 * measurable weight to a page that already ships the numbers it plots. It
 * scales with its container and never animates, so it cannot cost layout or
 * contribute to CLS.
 */

export interface ChartPoint {
  /** X axis position, usually a year or month index. */
  period: number;
  /** The lower band, e.g. money actually paid in, or remaining balance. */
  base: number;
  /** The full height, e.g. total balance. Must be >= base. */
  total: number;
}

export interface ResultChartProps {
  points: ChartPoint[];
  /** Legend label for the lower band. */
  baseLabel: string;
  /** Legend label for the band between base and total. */
  topLabel: string;
  /** Accessible one-line summary of what the plot shows. */
  summary: string;
  /** Height in pixels. Width always fills the container. */
  height?: number;
  className?: string;
}

const W = 320;
const H = 120;

function toPath(points: ChartPoint[], value: (p: ChartPoint) => number, max: number): string {
  return points
    .map((p, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * W;
      const y = H - (value(p) / max) * H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function ResultChart({
  points,
  baseLabel,
  topLabel,
  summary,
  height = 150,
  className = "",
}: ResultChartProps) {
  if (points.length < 2) return null;

  const max = Math.max(...points.map((p) => p.total), 1);
  const totalPath = toPath(points, (p) => p.total, max);
  const basePath = toPath(points, (p) => p.base, max);
  const totalArea = `${totalPath} L${W},${H} L0,${H} Z`;
  const baseArea = `${basePath} L${W},${H} L0,${H} Z`;

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ height }}
        className="w-full"
        role="img"
        aria-label={summary}
      >
        {/* Two horizontal guides, so the plot reads as measured. */}
        {[0.33, 0.66].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={H * f}
            y2={H * f}
            className="stroke-slate-100"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={totalArea} className="fill-blue-100" />
        <path d={baseArea} className="fill-slate-200/70" />
        <path
          d={totalPath}
          className="fill-none stroke-blue-600"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={basePath}
          className="fill-none stroke-slate-400"
          strokeWidth="1.5"
          strokeDasharray="3 2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <figcaption className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2 w-3 rounded-sm bg-slate-300" />
          {baseLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2 w-3 rounded-sm bg-blue-200" />
          {topLabel}
        </span>
      </figcaption>
    </figure>
  );
}
