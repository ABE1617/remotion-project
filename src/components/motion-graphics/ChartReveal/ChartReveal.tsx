import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import type { ChartRevealProps, DataPoint } from "./types";

// ---------------------------------------------------------------------------
// ChartReveal — premium animated chart (line or bar).
// ---------------------------------------------------------------------------
//
// Line choreography (entrance, ~34 frames):
//   0-4    card scales 0.97→1 + fades in
//   4-8    title fades + drifts translateY(8→0)
//   8-22   line path draws via stroke-dashoffset (ease-out cubic, lands softly)
//   22-30  gradient fill under line fades in (only if fillBelow)
//   22-28  first+last axis labels fade in
//   28-34  highlight callout scales in with SPRING_SNAPPY
//
// Bar choreography (entrance, varies with bar count):
//   0-4    card scales 0.97→1 + fades in
//   4-8    title fades + drifts translateY(8→0)
//   8+     bars grow bottom→up via scaleY spring, 3-frame stagger
//   after  axis labels + highlight callout
//
// Hold: completely static.
//
// Exit (14 frames): whole card scales 1→0.96 + fades to 0.
//
// Smoothing: Catmull-Rom → cubic Bezier with tension 0.5. The segment-by-
// segment tangents give us a naturally smooth curve through every data point
// without the overshoot you get from quadratic splines or monotone Hermite.
// Path length is computed analytically by sampling 32 points per cubic segment
// and summing chord distances — no getTotalLength() DOM round-trip needed.

const CARD_RADIUS = 16;
const CARD_PADDING_X = 56;
const CARD_PADDING_Y = 64;
const TITLE_GAP = 24;
const AXIS_LABEL_GAP = 20;

interface Pt {
  x: number;
  y: number;
}

interface CubicSegment {
  p0: Pt;
  p1: Pt;
  p2: Pt;
  p3: Pt;
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

// Arc length of a single cubic by chord sampling.
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

// Catmull-Rom → cubic Bezier control-point conversion.
// Returns an array of cubic segments (one per consecutive pair of points).
// Boundary handling: for i=0 we use P[0] as the "previous" tangent anchor;
// for i=N-1 we use P[N-1] as the "next" tangent anchor. Tension 0.5 gives
// a designed-looking curve without overshoot.
function buildCatmullRomCubics(points: Pt[], tension = 0.5): CubicSegment[] {
  const segments: CubicSegment[] = [];
  if (points.length < 2) return segments;

  const tangent = (prev: Pt, next: Pt): Pt => ({
    x: ((next.x - prev.x) / 2) * tension,
    y: ((next.y - prev.y) / 2) * tension,
  });

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const prevAnchor = i === 0 ? points[0] : points[i - 1];
    const nextAnchor = i + 2 >= points.length ? points[i + 1] : points[i + 2];
    const t0 = tangent(prevAnchor, p1);
    const t1 = tangent(p0, nextAnchor);
    const c1: Pt = { x: p0.x + t0.x, y: p0.y + t0.y };
    const c2: Pt = { x: p1.x - t1.x, y: p1.y - t1.y };
    segments.push({ p0, p1: c1, p2: c2, p3: p1 });
  }

  return segments;
}

// Serialize cubic segments into an SVG path `d` string.
function cubicsToPath(segments: CubicSegment[]): string {
  if (segments.length === 0) return "";
  const first = segments[0];
  let d = `M ${first.p0.x.toFixed(2)} ${first.p0.y.toFixed(2)}`;
  for (const s of segments) {
    d +=
      ` C ${s.p1.x.toFixed(2)} ${s.p1.y.toFixed(2)},` +
      ` ${s.p2.x.toFixed(2)} ${s.p2.y.toFixed(2)},` +
      ` ${s.p3.x.toFixed(2)} ${s.p3.y.toFixed(2)}`;
  }
  return d;
}

// Total arc length = sum of per-segment cubic lengths.
function totalCubicLength(segments: CubicSegment[]): number {
  let sum = 0;
  for (const s of segments) {
    sum += cubicLength(s.p0, s.p1, s.p2, s.p3, 32);
  }
  return sum;
}

interface Palette {
  bg: string;
  title: string;
  axis: string;
  shadow: string;
  calloutText: string;
}

const getPalette = (style: "light" | "dark"): Palette => {
  if (style === "dark") {
    return {
      bg: "#0A0A0A",
      title: "#F5F5F5",
      axis: "#9A9A9A",
      shadow: "0 16px 48px rgba(0,0,0,0.5)",
      calloutText: "#FFFFFF",
    };
  }
  return {
    bg: "#F8F7F4",
    title: "#0A0A0A",
    axis: "#6B6B6B",
    shadow: "0 16px 48px rgba(0,0,0,0.2)",
    calloutText: "#FFFFFF",
  };
};

// Map raw data values into plot-area pixel coordinates (top-left origin SVG).
function mapPoints(
  data: DataPoint[],
  plotW: number,
  plotH: number,
): Pt[] {
  if (data.length === 0) return [];
  const values = data.map((d) => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  // Pad the range slightly so the line never hugs the top/bottom edge.
  const pad = (maxV - minV) * 0.1 || 1;
  const lo = minV - pad;
  const hi = maxV + pad;
  const range = hi - lo || 1;

  if (data.length === 1) {
    return [{ x: plotW / 2, y: plotH - ((data[0].value - lo) / range) * plotH }];
  }

  return data.map((d, i) => {
    const x = (i / (data.length - 1)) * plotW;
    const y = plotH - ((d.value - lo) / range) * plotH;
    return { x, y };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ChartReveal: React.FC<ChartRevealProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  chartType = "line",
  data,
  title,
  width = 720,
  height = 480,
  cardStyle = "light",
  accentColor = "#FF3B30",
  fillBelow = false,
  highlight,
}) => {
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 36, defaultExitFrames: 14 },
  );

  const palette = getPalette(cardStyle);

  // Plot area = card interior minus horizontal padding. Chart SVG height is
  // the configured `height` plus space for axis labels beneath.
  const plotW = width - CARD_PADDING_X * 2;
  const plotH = height;

  // --- Geometry (computed every render; cheap & deterministic) -----------

  const points = mapPoints(data, plotW, plotH);

  // Line chart: build smoothed cubic Bezier path + compute analytical length.
  const segments = chartType === "line" ? buildCatmullRomCubics(points) : [];
  const linePathD = cubicsToPath(segments);
  const pathLength = totalCubicLength(segments);

  // Closed fill shape: trace the line then drop to bottom-right → bottom-left → close.
  const fillPathD =
    segments.length > 0
      ? linePathD +
        ` L ${plotW.toFixed(2)} ${plotH.toFixed(2)}` +
        ` L 0 ${plotH.toFixed(2)} Z`
      : "";

  // Bar geometry: evenly spaced with a 24% gap between bars.
  const barCount = chartType === "bar" ? data.length : 0;
  const barSlot = barCount > 0 ? plotW / barCount : 0;
  const barWidth = barSlot * 0.76;
  const barGap = barSlot * 0.24;
  // Compute bar heights using the same min/max scaling as line charts so the
  // "growing" effect uses real data proportions.
  const barScale = (() => {
    if (chartType !== "bar" || data.length === 0) return { lo: 0, hi: 1 };
    const values = data.map((d) => d.value);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    // For bar charts we anchor the baseline at 0 if all values are positive —
    // bars growing from a non-zero floor feels dishonest.
    const lo = Math.min(0, minV);
    const hi = maxV === lo ? lo + 1 : maxV;
    return { lo, hi };
  })();
  const barFullHeight = (value: number): number => {
    if (chartType !== "bar") return 0;
    return ((value - barScale.lo) / (barScale.hi - barScale.lo)) * plotH;
  };

  // --- Entrance timings --------------------------------------------------

  // Card (0-4).
  const cardEnterSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 4,
  });
  const cardEnterScale = interpolate(cardEnterSpring, [0, 1], [0.97, 1]);
  const cardFadeIn = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title (4-8).
  const titleFadeIn = interpolate(localFrame, [4, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(localFrame, [4, 8], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line draw (8-22) — ease-out cubic on the dashoffset.
  const drawInRaw = interpolate(localFrame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drawInEased = 1 - Math.pow(1 - drawInRaw, 3);
  const dashOffset = pathLength * (1 - drawInEased);

  // Fill fade-in (22-30).
  const fillOpacity = interpolate(localFrame, [22, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Bar entrance per-bar (staggered) ---------------------------------
  // Each bar starts 3 frames after the previous, springs scaleY 0→1.
  const BAR_START = 8;
  const BAR_STAGGER = 3;
  const BAR_SPRING_FRAMES = 12;
  const barSpringValues: number[] =
    chartType === "bar"
      ? data.map((_, i) =>
          spring({
            fps,
            frame: localFrame - (BAR_START + i * BAR_STAGGER),
            config: SPRING_SNAPPY,
            durationInFrames: BAR_SPRING_FRAMES,
          }),
        )
      : [];

  // When all bars have landed: BAR_START + (N-1)*stagger + settle.
  const lastBarLanded =
    chartType === "bar"
      ? BAR_START + (data.length - 1) * BAR_STAGGER + 6
      : 22;

  // Axis labels window — unified for both chart types.
  const axisStart = chartType === "bar" ? lastBarLanded + 4 : 22;
  const axisEnd = axisStart + 6;
  const axisFadeIn = interpolate(localFrame, [axisStart, axisEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight callout — last thing to arrive.
  const calloutStart = chartType === "bar" ? axisEnd + 2 : 28;
  const calloutSpring = spring({
    fps,
    frame: localFrame - calloutStart,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  const calloutScale = interpolate(calloutSpring, [0, 1], [0, 1]);
  const calloutFadeIn = interpolate(
    localFrame,
    [calloutStart, calloutStart + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Exit --------------------------------------------------------------

  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.96]);
  const exitOpacity = 1 - exitProgress;

  const cardScale = cardEnterScale * exitScale;
  const cardOpacity = cardFadeIn * exitOpacity;

  if (!visible) return null;

  // --- Highlight resolved marker position -------------------------------

  let highlightPt: Pt | null = null;
  if (highlight && highlight.index >= 0 && highlight.index < data.length) {
    if (chartType === "line") {
      highlightPt = points[highlight.index] ?? null;
    } else {
      // Bar: center on top of the bar.
      const cx = highlight.index * barSlot + barSlot / 2;
      const cy = plotH - barFullHeight(data[highlight.index].value);
      highlightPt = { x: cx, y: cy };
    }
  }

  // SVG viewBox spans the plot area plus a small vertical margin so a marker
  // dot at y=0 doesn't clip.
  const svgPadTop = 4;
  const svgPadBottom = 4;
  const svgW = plotW;
  const svgH = plotH + svgPadTop + svgPadBottom;

  // Unique gradient id per-instance (per-accent) — avoids collisions if the
  // component renders twice on the same frame with different accent colors.
  const gradientId = `chart-reveal-fill-${accentColor.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width,
          backgroundColor: palette.bg,
          borderRadius: CARD_RADIUS,
          paddingLeft: CARD_PADDING_X,
          paddingRight: CARD_PADDING_X,
          paddingTop: CARD_PADDING_Y,
          paddingBottom: CARD_PADDING_Y,
          boxShadow: palette.shadow,
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {title ? (
          <div
            style={{
              fontFamily: FONT_FAMILIES.inter,
              fontSize: 28,
              fontWeight: 600,
              color: palette.title,
              letterSpacing: "0.02em",
              textAlign: "left",
              lineHeight: 1.1,
              marginBottom: TITLE_GAP,
              opacity: titleFadeIn,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {title}
          </div>
        ) : null}

        {/* Chart SVG */}
        <div style={{ position: "relative", width: "100%" }}>
          <svg
            width={svgW}
            height={svgH}
            viewBox={`0 ${-svgPadTop} ${svgW} ${svgH}`}
            style={{ display: "block", overflow: "visible" }}
          >
            {/* Gradient def for line fill */}
            {chartType === "line" && fillBelow ? (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
            ) : null}

            {/* LINE CHART --------------------------------------------- */}
            {chartType === "line" && segments.length > 0 ? (
              <>
                {fillBelow ? (
                  <path
                    d={fillPathD}
                    fill={`url(#${gradientId})`}
                    opacity={fillOpacity}
                  />
                ) : null}
                <path
                  d={linePathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={dashOffset}
                />
              </>
            ) : null}

            {/* BAR CHART ---------------------------------------------- */}
            {chartType === "bar"
              ? data.map((d, i) => {
                  const full = barFullHeight(d.value);
                  const sp = barSpringValues[i] ?? 0;
                  const scaleY = Math.max(0, sp);
                  const x = i * barSlot + barGap / 2;
                  const y = plotH - full;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={full}
                      rx={8}
                      ry={8}
                      fill={accentColor}
                      style={{
                        transform: `scaleY(${scaleY})`,
                        transformOrigin: `${(x + barWidth / 2).toFixed(2)}px ${plotH}px`,
                        transformBox: "view-box",
                      }}
                    />
                  );
                })
              : null}

            {/* HIGHLIGHT MARKER DOT --------------------------------- */}
            {highlightPt ? (
              <circle
                cx={highlightPt.x}
                cy={highlightPt.y}
                r={10}
                fill={accentColor}
                stroke={palette.bg}
                strokeWidth={3}
                opacity={calloutFadeIn}
                style={{
                  transform: `scale(${calloutScale})`,
                  transformOrigin: `${highlightPt.x.toFixed(2)}px ${highlightPt.y.toFixed(2)}px`,
                  transformBox: "view-box",
                }}
              />
            ) : null}
          </svg>

          {/* HIGHLIGHT LABEL BOX (HTML overlay so text rendering stays crisp) */}
          {highlightPt && highlight ? (
            <div
              style={{
                position: "absolute",
                left: highlightPt.x,
                top: highlightPt.y - 18,
                transform: `translate(-50%, -100%) scale(${calloutScale})`,
                transformOrigin: "50% 100%",
                opacity: calloutFadeIn,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  backgroundColor: accentColor,
                  color: palette.calloutText,
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontFamily: FONT_FAMILIES.inter,
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  position: "relative",
                }}
              >
                {highlight.label}
                {/* Downward-pointing triangle pointer */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: -6,
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "7px solid transparent",
                    borderRight: "7px solid transparent",
                    borderTop: `7px solid ${accentColor}`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Axis labels */}
        <div
          style={{
            position: "relative",
            marginTop: AXIS_LABEL_GAP,
            width: "100%",
            height: 24,
            opacity: axisFadeIn,
          }}
        >
          {chartType === "line" && data.length > 0 ? (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  fontFamily: FONT_FAMILIES.inter,
                  fontSize: 22,
                  fontWeight: 500,
                  color: palette.axis,
                  lineHeight: 1,
                }}
              >
                {data[0].label ?? ""}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  fontFamily: FONT_FAMILIES.inter,
                  fontSize: 22,
                  fontWeight: 500,
                  color: palette.axis,
                  lineHeight: 1,
                }}
              >
                {data[data.length - 1].label ?? ""}
              </div>
            </>
          ) : null}

          {chartType === "bar"
            ? data.map((d, i) => {
                const cx = i * barSlot + barSlot / 2;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: cx,
                      top: 0,
                      transform: "translateX(-50%)",
                      fontFamily: FONT_FAMILIES.inter,
                      fontSize: 22,
                      fontWeight: 500,
                      color: palette.axis,
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {d.label ?? ""}
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
