/**
 * Blocky 12x12 bitmap glyphs.
 *
 * The capability cards use drawn pixel art instead of line icons so they
 * carry the same drafting-grid language as the dither plates. Each glyph is
 * authored as twelve strings, one per row, where "#" is a filled cell.
 */

export type PixelGlyphName = "grid" | "bolt" | "lock" | "chart" | "coin";

const GLYPHS: Record<PixelGlyphName, string[]> = {
  // Four blocks on a grid: the 443 tool catalog.
  grid: [
    "............",
    "..####.####.",
    "..####.####.",
    "..####.####.",
    "..####.####.",
    "............",
    "............",
    "..####.####.",
    "..####.####.",
    "..####.####.",
    "..####.####.",
    "............",
  ],
  // Lightning bolt: results the moment you type.
  bolt: [
    "............",
    "......###...",
    ".....###....",
    "....###.....",
    "...###......",
    "..########..",
    "......###...",
    ".....###....",
    "....###.....",
    "...###......",
    "..###.......",
    "............",
  ],
  // Padlock: figures never leave the browser.
  lock: [
    "............",
    "....####....",
    "...##..##...",
    "...##..##...",
    "...##..##...",
    ".##########.",
    ".####..####.",
    ".###.##.###.",
    ".####..####.",
    ".##########.",
    ".##########.",
    "............",
  ],
  // Rising bars: projections and schedules.
  chart: [
    "............",
    "............",
    "..........##",
    "..........##",
    ".......##.##",
    ".......##.##",
    "....##.##.##",
    "....##.##.##",
    ".##.##.##.##",
    ".##.##.##.##",
    "............",
    "............",
  ],
  // Stacked coins: money math.
  coin: [
    "............",
    "...######...",
    "..########..",
    ".##..##..##.",
    ".##..##..##.",
    "..########..",
    "...######...",
    "..########..",
    ".##########.",
    "..########..",
    "...######...",
    "............",
  ],
};

export interface PixelGlyphProps {
  name: PixelGlyphName;
  /** Rendered edge length in pixels. */
  size?: number;
  className?: string;
}

export function PixelGlyph({ name, size = 48, className = "text-blue-600" }: PixelGlyphProps) {
  const rows = GLYPHS[name];
  const cells: { x: number; y: number }[] = [];
  rows.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell === "#") cells.push({ x, y });
    });
  });

  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <g fill="currentColor">
        {cells.map((c) => (
          <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="1" height="1" />
        ))}
      </g>
    </svg>
  );
}
