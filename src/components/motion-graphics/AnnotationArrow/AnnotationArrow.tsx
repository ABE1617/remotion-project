import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { useMGPhase } from "../shared/useMGPhase";
import type { AnnotationArrowProps } from "./types";

// ---------------------------------------------------------------------------
// AnnotationArrow — hand-drawn SVG arrow that draws itself onto the video.
// ---------------------------------------------------------------------------
//
// Choreography (entrance, ~22 frames):
//   0-18  stroke-dashoffset eases from pathLength → 0 (line draws in, slowing
//         as it reaches the tip — ease-out, not spring; springs feel mechanical
//         for a "drawing by hand" motion)
//   16-22 arrowhead scales in via SPRING_SNAPPY from the tip + fades
//
// Hold: continuous sub-pixel sinusoidal translate (~1.5px) keeps the arrow alive
// without being distracting.
//
// Exit (10 frames):
//   stroke-dashoffset eases back up 0 → pathLength (line erases from start)
//   arrowhead fades out over the first 6 frames
//
// Path shape is a single cubic Bezier P0→P3 for the analytical presets. Control
// points P1/P2 are seeded-random offsets from the baseline, so the same `seed`
// produces the same hand-drawn imperfections on every render and different
// seeds produce different variation. Path length is approximated by summing
// 32 line segments along the curve — no DOM measurement, SSR-safe.
//
// Arrowhead direction uses the line's tangent at t=1 (3·(P3−P2)), NOT the
// straight P0→P3 direction. This is required for curved paths where those two
// differ substantially.

const FRAME_W = 1080;
const FRAME_H = 1920;

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32). Small, deterministic, good enough for jitter.
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

interface Pt {
  x: number;
  y: number;
}

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// Cubic Bezier point at t.
function cubicPoint(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const a = mt2 * mt;
  const b = 3 * mt2 * t;
  const c = 3 * mt * t2;
  const d = t2 * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

// Approximate cubic Bezier arc length by summing N short segments.
function cubicLength(
  p0: Pt,
  p1: Pt,
  p2: Pt,
  p3: Pt,
  samples = 32,
): number {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const cur = cubicPoint(p0, p1, p2, p3, t);
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    len += Math.sqrt(dx * dx + dy * dy);
    prev = cur;
  }
  return len;
}

interface BezierShape {
  p0: Pt;
  p1: Pt;
  p2: Pt;
  p3: Pt;
  d: string;
  length: number;
}

function buildBezier(
  start: Pt,
  end: Pt,
  pathType: "straight" | "curved-arc" | "j-shape",
  seed: number,
): BezierShape {
  const rand = mulberry32(seed);
  // Signed symmetric jitter in range [-1, 1] from uniform RNG.
  const j = () => rand() * 2 - 1;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lineLen = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  // Unit perpendicular vector (rotated 90° from the baseline direction).
  const nx = -dy / lineLen;
  const ny = dx / lineLen;

  const at = (t: number) => lerp(start, end, t);

  let p1: Pt;
  let p2: Pt;

  if (pathType === "straight") {
    // Tiny perpendicular jitter — line still reads as straight but has a
    // human wobble.
    const j1 = j() * 8;
    const j2 = j() * 8;
    const a = at(0.33);
    const b = at(0.66);
    p1 = { x: a.x + nx * j1, y: a.y + ny * j1 };
    p2 = { x: b.x + nx * j2, y: b.y + ny * j2 };
  } else if (pathType === "curved-arc") {
    // Both controls pushed to the SAME side by ~25% of line length — forms a
    // gentle arc. Asymmetric jitter keeps it hand-drawn.
    const amp = lineLen * 0.25;
    const j1 = j() * 14;
    const j2 = j() * 14;
    const a = at(0.33);
    const b = at(0.66);
    p1 = { x: a.x + nx * (amp + j1), y: a.y + ny * (amp + j1) };
    p2 = { x: b.x + nx * (amp + j2), y: b.y + ny * (amp + j2) };
  } else {
    // j-shape: P1 pushed strongly one way, P2 pushed the other — creates the
    // signature swoop-down-then-back-up "J" geometry.
    const amp = lineLen * 0.5;
    const j1 = j() * 18;
    const j2 = j() * 18;
    const a = at(0.28);
    const b = at(0.72);
    p1 = { x: a.x - nx * (amp + j1), y: a.y - ny * (amp + j1) };
    p2 = { x: b.x + nx * (amp * 0.7 + j2), y: b.y + ny * (amp * 0.7 + j2) };
  }

  const d =
    `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} ` +
    `C ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}, ` +
    `${p2.x.toFixed(2)} ${p2.y.toFixed(2)}, ` +
    `${end.x.toFixed(2)} ${end.y.toFixed(2)}`;

  const length = cubicLength(start, p1, p2, end, 32);

  return { p0: start, p1, p2, p3: end, d, length };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AnnotationArrow: React.FC<AnnotationArrowProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  start,
  end,
  pathType = "curved-arc",
  customPath,
  color = "#FFD60A",
  strokeWidth = 8,
  seed = 1,
  arrowheadSize = 32,
}) => {
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 22, defaultExitFrames: 10 },
  );

  // --- Path geometry ------------------------------------------------------
  //
  // For "custom" we don't know the geometry analytically, so we measure via
  // getTotalLength() after mount. This is the documented escape hatch —
  // there's a one-frame hiccup on first paint, which is acceptable.

  const customPathRef = useRef<SVGPathElement | null>(null);
  const [customLength, setCustomLength] = useState<number | null>(null);

  useEffect(() => {
    if (pathType === "custom" && customPathRef.current) {
      try {
        setCustomLength(customPathRef.current.getTotalLength());
      } catch {
        setCustomLength(0);
      }
    }
  }, [pathType, customPath]);

  const isCustom = pathType === "custom";

  // Analytical preset geometry (stable across renders for a given seed).
  const bezier: BezierShape | null = isCustom
    ? null
    : buildBezier(start, end, pathType, seed);

  const pathD = isCustom ? customPath ?? "" : bezier!.d;
  const pathLength = isCustom ? customLength ?? 0 : bezier!.length;

  // --- Arrowhead tangent --------------------------------------------------
  //
  // For the analytical presets the tangent at t=1 is proportional to P3−P2.
  // For custom paths we fall back to the crude start→end direction; callers
  // using "custom" accept slightly degraded quality per the spec.

  let tangentX: number;
  let tangentY: number;
  if (isCustom) {
    tangentX = end.x - start.x;
    tangentY = end.y - start.y;
  } else {
    tangentX = bezier!.p3.x - bezier!.p2.x;
    tangentY = bezier!.p3.y - bezier!.p2.y;
  }
  const tMag = Math.max(1e-4, Math.sqrt(tangentX * tangentX + tangentY * tangentY));
  const tangentAngleDeg = (Math.atan2(tangentY, tangentX) * 180) / Math.PI;

  // Arrowhead chevron: two short lines at ±halfAngle from the incoming tangent,
  // pointing *backwards* from the tip. Half-angle 28° per spec.
  const halfAngle = (28 * Math.PI) / 180;
  const ux = tangentX / tMag;
  const uy = tangentY / tMag;
  // Rotate (-ux, -uy) by ±halfAngle to get the two chevron arms.
  const rot = (x: number, y: number, a: number): Pt => ({
    x: x * Math.cos(a) - y * Math.sin(a),
    y: x * Math.sin(a) + y * Math.cos(a),
  });
  const armA = rot(-ux, -uy, halfAngle);
  const armB = rot(-ux, -uy, -halfAngle);
  const tipX = end.x;
  const tipY = end.y;
  const armAEnd = {
    x: tipX + armA.x * arrowheadSize,
    y: tipY + armA.y * arrowheadSize,
  };
  const armBEnd = {
    x: tipX + armB.x * arrowheadSize,
    y: tipY + armB.y * arrowheadSize,
  };
  const headD =
    `M ${armAEnd.x.toFixed(2)} ${armAEnd.y.toFixed(2)} ` +
    `L ${tipX.toFixed(2)} ${tipY.toFixed(2)} ` +
    `L ${armBEnd.x.toFixed(2)} ${armBEnd.y.toFixed(2)}`;

  // --- Draw-in / erase-out progress --------------------------------------
  //
  // Ease-out: starts fast, decelerates into the tip. Cubic (1 - (1-t)^3).
  // During entrance we interpolate from pathLength → 0.
  // During exit we interpolate from 0 → pathLength (erases from start).

  const drawInRaw = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drawInEased = 1 - Math.pow(1 - drawInRaw, 3);
  const drawOffset = pathLength * (1 - drawInEased);

  // Exit: reverse-draw. exitProgress is 0..1 across the exit window.
  const eraseEased = 1 - Math.pow(1 - exitProgress, 3);
  const eraseOffset = pathLength * eraseEased;

  const isExiting = exitProgress > 0;
  const dashOffset = isExiting ? eraseOffset : drawOffset;

  // --- Arrowhead entrance/exit -------------------------------------------

  const headSpring = spring({
    fps,
    frame: localFrame - 16,
    config: SPRING_SNAPPY,
    durationInFrames: 6,
  });
  const headScale = interpolate(headSpring, [0, 1], [0, 1]);
  const headFadeIn = interpolate(localFrame, [16, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Fades out across the first 6 of 10 exit frames (60% of exit window).
  const headFadeOut = interpolate(exitProgress, [0, 0.6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headOpacity = headFadeIn * headFadeOut;

  // --- Idle wiggle --------------------------------------------------------
  //
  // Low-frequency, two-axis sines with incommensurate periods so the motion
  // doesn't visibly repeat. Amplitude ~1.5px.

  const wiggleX = Math.sin(localFrame * 0.07) * 1.5;
  const wiggleY = Math.cos(localFrame * 0.053 + 1.3) * 1.5;

  if (!visible) return null;
  // For custom paths, wait until we've measured — otherwise the dasharray math
  // is based on a 0-length path and the line pops in fully drawn on frame 1.
  if (isCustom && customLength === null) return null;

  return (
    <AbsoluteFill>
      <svg
        width={FRAME_W}
        height={FRAME_H}
        viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <g transform={`translate(${wiggleX}, ${wiggleY})`}>
          <path
            ref={customPathRef}
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={dashOffset}
          />
          <path
            d={headD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={headOpacity}
            style={{
              transform: `translate(${tipX}px, ${tipY}px) rotate(${tangentAngleDeg}deg) scale(${headScale}) rotate(${-tangentAngleDeg}deg) translate(${-tipX}px, ${-tipY}px)`,
              transformOrigin: "0 0",
              transformBox: "view-box",
            }}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
