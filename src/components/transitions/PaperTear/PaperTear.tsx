import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo } from "remotion";
import type { PaperTearProps } from "../types";

export const PAPER_TEAR_PEAK_PROGRESS = 0.5;

// Deterministic pseudo-random for the jagged edge.
function rng(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Build a jagged polygon clip-path that covers the LEFT side up to `edgeX`
// (a value in 0..1 across the viewport). The right edge of the polygon is
// the torn paper edge — a zig-zag with seeded noise amplitude.
function buildTearPolygon(
  edgeX: number,
  jaggedness: number,
  seed: number,
  segments = 48,
): string {
  const points: string[] = [];
  // Top-left corner of the left mask.
  points.push("0% 0%");
  // Traverse down the right edge with jaggedness.
  const maxOffsetPct = 8 * jaggedness;
  for (let i = 0; i <= segments; i++) {
    const y = (i / segments) * 100;
    const n = rng(i, seed) * 2 - 1; // -1..1
    const xPctBase = edgeX * 100;
    const x = xPctBase + n * maxOffsetPct;
    points.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  // Bottom-left corner.
  points.push("0% 100%");
  return `polygon(${points.join(", ")})`;
}

/**
 * PaperTear — a jagged vertical tear sweeps across, revealing the next
 * clip under a paper-textured backing. The tear is a zig-zag polygon
 * clip-path with seeded noise (deterministic per seed so renders are
 * stable) that slides from one side of the frame to the other.
 *
 * A subtle cream paper color peeks out at the tear edge on the revealing
 * side — the "scrapbook" signature without any external texture asset.
 */
export const PaperTear: React.FC<PaperTearProps> = ({
  clipA,
  clipB,
  progress,
  style,
  direction = "right",
  jaggedness = 0.6,
  paperColor = "#F2E9D6",
  seed = 3,
}) => {
  const ease = Easing.bezier(0.65, 0, 0.35, 1);

  // `edgePos` 0..1 — position of the tear edge across the frame.
  // Direction "right" means clipB comes in from the RIGHT (tear sweeps
  // right→left, so edgePos goes 0 → 1 revealing clipB on the right).
  // Direction "left" reverses: tear sweeps left→right.
  const raw = interpolate(progress, [0, 1], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const edgePos = direction === "right" ? raw : 1 - raw;

  // Memoize the polygon so we don't re-stringify every render.
  const tearPolygon = useMemo(
    () => buildTearPolygon(edgePos, jaggedness, seed),
    [edgePos, jaggedness, seed],
  );

  // Paper accent strip — thin band along the tear edge for the
  // "backing paper visible through the rip" detail.
  const paperPolygon = useMemo(() => {
    // A narrow strip just past the tear edge on the revealing side.
    const stripWidth = 0.02; // 2% of frame width
    const rightEdge = Math.min(1, edgePos + stripWidth);
    return buildTearPolygon(rightEdge, jaggedness, seed);
  }, [edgePos, jaggedness, seed]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* Incoming clip — the whole layer; the tear polygon will mask
          clipA ON TOP of it, revealing clipB progressively. */}
      <AbsoluteFill>
        <OffthreadVideo
          src={clipB}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Paper backing accent just past the tear edge */}
      <AbsoluteFill
        style={{
          clipPath:
            direction === "right"
              ? paperPolygon
              : paperPolygon.replace(
                  /polygon\(/,
                  "polygon(",
                ), // kept the same shape; directional flip is handled by edgePos
          WebkitClipPath:
            direction === "right" ? paperPolygon : paperPolygon,
          backgroundColor: paperColor,
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />

      {/* Outgoing clip — shown only on the "left" side of the tear (or
          the appropriate side based on direction). */}
      <AbsoluteFill
        style={{
          clipPath: tearPolygon,
          WebkitClipPath: tearPolygon,
        }}
      >
        <OffthreadVideo
          src={clipA}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
