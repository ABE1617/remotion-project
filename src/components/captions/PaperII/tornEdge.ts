import { noise2D } from "@remotion/noise";

/**
 * Generates a CSS `clip-path: polygon(...)` string that creates
 * torn / ripped paper edges along the top and bottom of an element.
 *
 * X coordinates use percentages (width-independent).
 * Y coordinates use px / calc(100% - px) so the tear amplitude
 * is constant regardless of element height.
 *
 * @param seed   Unique string per strip so each strip gets different edges
 * @param amplitude  Max pixel offset of the torn edge (default 6)
 * @param points     Number of sample points along each edge (default 24)
 */
export function generateTornClipPath(
  seed: string,
  amplitude: number = 6,
  points: number = 24,
): string {
  const allPoints: string[] = [];

  // Top edge: left → right
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const xPercent = (t * 100).toFixed(2);
    // noise2D returns roughly -1..1; remap to 0..amplitude
    const raw = noise2D(seed + "-top", t * 8, 0);
    const yOffset = ((raw + 1) / 2) * amplitude;
    allPoints.push(`${xPercent}% ${yOffset.toFixed(1)}px`);
  }

  // Bottom edge: right → left
  for (let i = points; i >= 0; i--) {
    const t = i / points;
    const xPercent = (t * 100).toFixed(2);
    const raw = noise2D(seed + "-btm", t * 8, 0);
    const yOffset = ((raw + 1) / 2) * amplitude;
    allPoints.push(`${xPercent}% calc(100% - ${yOffset.toFixed(1)}px)`);
  }

  return `polygon(${allPoints.join(", ")})`;
}
