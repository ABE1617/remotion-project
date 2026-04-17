import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { MaskWipeProps } from "../types";

export const MASK_WIPE_PEAK_PROGRESS = 0.5;

/**
 * Mask Wipe — A geometric shape sweeps across the frame to reveal the next clip.
 * The leading-edge accent line is the premium signal that elevates this beyond a basic wipe.
 */
export const MaskWipe: React.FC<MaskWipeProps> = ({
  clipA,
  clipB,
  progress,
  style,
  shape = "diagonal",
  direction = "right",
  accentLine = true,
  accentColor = "#FFD60A",
  accentWidth = 6,
  feather = 3,
}) => {
  const ease = Easing.bezier(0.65, 0, 0.35, 1);
  const p = interpolate(progress, [0, 1], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Compute clip-path for clipA based on shape + direction
  const clipPathA = getClipPath(shape, direction, p);

  // Accent line visibility window
  const accentVisible = accentLine && p > 0.02 && p < 0.98;
  const accentOpacity = interpolate(p, [0.02, 0.08, 0.92, 0.98], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* Clip B underneath — the destination */}
      <AbsoluteFill>
        <OffthreadVideo
          src={clipB}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Clip A on top with animated clip-path */}
      <AbsoluteFill
        style={{
          clipPath: clipPathA,
          WebkitClipPath: clipPathA,
          filter: feather > 0 ? `blur(0px)` : undefined,
        }}
      >
        <OffthreadVideo
          src={clipA}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Leading edge accent line — the premium signal */}
      {accentVisible && (
        <AccentLine
          shape={shape}
          direction={direction}
          progress={p}
          color={accentColor}
          width={accentWidth}
          opacity={accentOpacity}
        />
      )}
    </AbsoluteFill>
  );
};

// ---------------- Helpers ----------------

function getClipPath(
  shape: "horizontal" | "diagonal" | "circle-iris" | "angular",
  direction: "left" | "right" | "up" | "down",
  p: number
): string {
  if (shape === "horizontal") {
    // Full frame at p=0, fully hidden at p=1. Wipe TO direction.
    switch (direction) {
      case "right":
        return `inset(0 ${p * 100}% 0 0)`;
      case "left":
        return `inset(0 0 0 ${p * 100}%)`;
      case "down":
        return `inset(0 0 ${p * 100}% 0)`;
      case "up":
        return `inset(${p * 100}% 0 0 0)`;
    }
  }

  if (shape === "diagonal") {
    // Slanted leading edge. Default: diagonal-right (top leads, bottom trails).
    const SKEW = 20; // percent skew between top and bottom leading edges
    switch (direction) {
      case "right": {
        const topRight = clamp((1 - p) * 100 + SKEW, 0, 120);
        const botRight = clamp((1 - p) * 100 - SKEW, -20, 100);
        return `polygon(0 0, ${topRight}% 0, ${botRight}% 100%, 0 100%)`;
      }
      case "left": {
        const topLeft = clamp(p * 100 - SKEW, -20, 100);
        const botLeft = clamp(p * 100 + SKEW, 0, 120);
        return `polygon(${topLeft}% 0, 100% 0, 100% 100%, ${botLeft}% 100%)`;
      }
      case "down": {
        const rightBot = clamp((1 - p) * 100 + SKEW, 0, 120);
        const leftBot = clamp((1 - p) * 100 - SKEW, -20, 100);
        return `polygon(0 0, 100% 0, 100% ${rightBot}%, 0 ${leftBot}%)`;
      }
      case "up": {
        const leftTop = clamp(p * 100 - SKEW, -20, 100);
        const rightTop = clamp(p * 100 + SKEW, 0, 120);
        return `polygon(0 ${leftTop}%, 100% ${rightTop}%, 100% 100%, 0 100%)`;
      }
    }
  }

  if (shape === "circle-iris") {
    // "right"/"down" => expanding iris (clipB grows out from center).
    // "left"/"up"    => contracting iris (clipA closes inward).
    const isOut = direction === "right" || direction === "down";
    if (isOut) {
      // clipA visible as ring outside growing hole. Easier: just contract clipA to 0 from center.
      // Starting radius = ~150% (covers corners), ending = 0%.
      const r = interpolate(p, [0, 1], [150, 0]);
      return `circle(${r}% at 50% 50%)`;
    }
    // contracting from edges: same effect, just contract clipA
    const r = interpolate(p, [0, 1], [150, 0]);
    return `circle(${r}% at 50% 50%)`;
  }

  if (shape === "angular") {
    // Trapezoidal edge — like horizontal but top moves faster than bottom (or vice versa).
    const FAST = 15; // extra % the faster edge gets
    switch (direction) {
      case "right": {
        // top edge leads by FAST%
        const topRight = clamp((1 - p) * 100 + FAST * 2, 0, 130);
        const botRight = clamp((1 - p) * 100, 0, 100);
        return `polygon(0 0, ${topRight}% 0, ${botRight}% 100%, 0 100%)`;
      }
      case "left": {
        const topLeft = clamp(p * 100, 0, 100);
        const botLeft = clamp(p * 100 - FAST * 2, -30, 100);
        return `polygon(${topLeft}% 0, 100% 0, 100% 100%, ${botLeft}% 100%)`;
      }
      case "down": {
        const rightBot = clamp((1 - p) * 100 + FAST * 2, 0, 130);
        const leftBot = clamp((1 - p) * 100, 0, 100);
        return `polygon(0 0, 100% 0, 100% ${rightBot}%, 0 ${leftBot}%)`;
      }
      case "up": {
        const leftTop = clamp(p * 100, 0, 100);
        const rightTop = clamp(p * 100 - FAST * 2, -30, 100);
        return `polygon(0 ${leftTop}%, 100% ${rightTop}%, 100% 100%, 0 100%)`;
      }
    }
  }

  return "inset(0 0 0 0)";
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---------------- Accent Line ----------------

interface AccentLineProps {
  shape: "horizontal" | "diagonal" | "circle-iris" | "angular";
  direction: "left" | "right" | "up" | "down";
  progress: number;
  color: string;
  width: number;
  opacity: number;
}

const AccentLine: React.FC<AccentLineProps> = ({
  shape,
  direction,
  progress,
  color,
  width,
  opacity,
}) => {
  const glow = `0 0 12px ${color}AA, 0 0 24px ${color}55`;

  if (shape === "horizontal") {
    const common: React.CSSProperties = {
      position: "absolute",
      background: color,
      boxShadow: glow,
      opacity,
      pointerEvents: "none",
    };
    switch (direction) {
      case "right":
        return (
          <div
            style={{
              ...common,
              left: `calc(${(1 - progress) * 100}% - ${width / 2}px)`,
              top: 0,
              width,
              height: "100%",
            }}
          />
        );
      case "left":
        return (
          <div
            style={{
              ...common,
              left: `calc(${progress * 100}% - ${width / 2}px)`,
              top: 0,
              width,
              height: "100%",
            }}
          />
        );
      case "down":
        return (
          <div
            style={{
              ...common,
              top: `calc(${(1 - progress) * 100}% - ${width / 2}px)`,
              left: 0,
              height: width,
              width: "100%",
            }}
          />
        );
      case "up":
        return (
          <div
            style={{
              ...common,
              top: `calc(${progress * 100}% - ${width / 2}px)`,
              left: 0,
              height: width,
              width: "100%",
            }}
          />
        );
    }
  }

  if (shape === "diagonal" || shape === "angular") {
    // Render a long rotated stripe that follows the leading edge.
    // Use an oversized rectangle rotated by the slant angle, positioned along edge center.
    const SKEW_PX_RATIO = shape === "diagonal" ? 0.2 : 0.3; // % -> fraction for angle math
    // Use a large enough rectangle to cover the frame when rotated.
    const oversize = 3000; // px
    const isHoriz = direction === "left" || direction === "right";
    const edgeCenterPct =
      direction === "right" || direction === "down"
        ? (1 - progress) * 100
        : progress * 100;

    // Angle: for diagonal/angular, top is offset from bottom by SKEW_PX_RATIO * frame-axis length.
    // Approx angle = atan(skew / 1). We express it directly in degrees based on ratio.
    const angleDeg = Math.atan(SKEW_PX_RATIO * 2) * (180 / Math.PI); // ~21deg for 0.2, ~31deg for 0.3
    const rotation =
      (direction === "right" || direction === "down" ? 1 : -1) *
      (isHoriz ? angleDeg : -angleDeg);

    const common: React.CSSProperties = {
      position: "absolute",
      background: color,
      boxShadow: glow,
      opacity,
      pointerEvents: "none",
      transformOrigin: "center center",
    };

    if (isHoriz) {
      return (
        <div
          style={{
            ...common,
            left: `calc(${edgeCenterPct}% - ${width / 2}px)`,
            top: `calc(50% - ${oversize / 2}px)`,
            width,
            height: oversize,
            transform: `rotate(${rotation}deg)`,
          }}
        />
      );
    }
    // vertical wipe
    return (
      <div
        style={{
          ...common,
          top: `calc(${edgeCenterPct}% - ${width / 2}px)`,
          left: `calc(50% - ${oversize / 2}px)`,
          height: width,
          width: oversize,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    );
  }

  if (shape === "circle-iris") {
    // Ring that matches the iris radius. Iris uses `circle(${r}% at 50% 50%)` where r in [0, 150].
    // Percent is relative to the distance from center to farthest corner; approximate ring size in px.
    // We scale a square div so its half-diagonal matches r%. Simpler: use a div sized in vmax.
    // We'll size using percentage of min(frameW, frameH) via CSS. Using aspect-square on a % width.
    // r% in circle() is percent of the "reference radius" (farthest corner). For a 1080x1920 frame,
    // that's sqrt(540^2 + 960^2) ≈ 1102px. So ring diameter ≈ 2 * (r/100) * 1102.
    // We'll use pct of height for simplicity and scale diameter = r * 2 * 1.28 (approx corner factor).
    // Cleaner: just use a very large ring and scale it down.
    const r = interpolate(progress, [0, 1], [150, 0]);
    // Ring diameter as fraction of frame: 2 * r% of reference radius.
    // Use CSS: width = height = (r * 2)% of the reference. We approximate by sizing off of height.
    const diameterPct = r * 2 * 1.15; // roughly matches the corner distance

    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${diameterPct}%`,
          aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `${width}px solid ${color}`,
          boxShadow: `${glow}, inset ${glow}`,
          opacity,
          pointerEvents: "none",
          boxSizing: "border-box",
        }}
      />
    );
  }

  return null;
};
