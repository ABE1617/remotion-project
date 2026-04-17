import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { resolveMGPosition } from "../shared/positioning";
import { useMGPhase } from "../shared/useMGPhase";
import type { TypingIndicatorProps } from "./types";

// ---------------------------------------------------------------------------
// TypingIndicator — the three-dot "someone is typing" bubble used all over
// short-form (iMessage / Messenger / WhatsApp style).
// ---------------------------------------------------------------------------
//
// Dots pulse continuously while the indicator is on screen. Each dot runs a
// sine-wave opacity + scale cycle of ~1.4s, staggered 0.18s apart — matches
// the real iOS typing rhythm.
//
// Entrance (6 frames): bubble scales 0.85 → 1 + fades 0 → 1.
// Hold: dots pulse, bubble static.
// Exit (6 frames): bubble scales 1 → 0.9 + fades to 0.

const BUBBLE_PAD_X = 28;
const BUBBLE_PAD_Y = 28;
const DOT_DIAMETER = 22;
const DOT_GAP = 12;
const BUBBLE_RADIUS = 42;
const TAIL_SIZE = 18;

// Continuous dot pulse — 1.4s full cycle at 30fps = 42 frames, 0.18s stagger
// per dot = ~6 frames. Dots animate opacity 0.3 → 1 → 0.3 and scale 0.85 → 1.
const DOT_CYCLE_FRAMES = 42;
const DOT_STAGGER_FRAMES = 6;

function dotPulse(frame: number, dotIndex: number): { opacity: number; scale: number } {
  const phase =
    ((frame - dotIndex * DOT_STAGGER_FRAMES) * Math.PI * 2) /
    DOT_CYCLE_FRAMES;
  // Sine-based wave, normalized 0 → 1.
  const wave = (Math.sin(phase) + 1) / 2;
  return {
    opacity: 0.3 + wave * 0.7,
    scale: 0.85 + wave * 0.15,
  };
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  side = "incoming",
  bubbleColor = "#2C2C2E",
  dotColor = "#8E8E93",
  showTail = true,
  anchor,
  offsetX,
  offsetY,
  scale,
}) => {
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 6, defaultExitFrames: 6 },
  );

  const { containerStyle, wrapperStyle } = resolveMGPosition({
    anchor,
    offsetX,
    offsetY,
    scale,
  });

  if (!visible) return null;

  // --- Bubble entrance / exit -------------------------------------------
  const enterScale = interpolate(localFrame, [0, 6], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterOpacity = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.9]);
  const exitOpacity = 1 - exitProgress;

  const isExiting = exitProgress > 0;
  const bubbleScale = isExiting ? exitScale : enterScale;
  const bubbleOpacity = isExiting ? exitOpacity : enterOpacity;

  // --- Tail geometry ----------------------------------------------------
  // A small filled circle/teardrop sitting in the bottom corner opposite
  // the bubble's origin side — an approximation of the iOS speech tail
  // without requiring an SVG path.
  const tailStyle: React.CSSProperties = showTail
    ? {
        position: "absolute",
        bottom: -2,
        [side === "incoming" ? "left" : "right"]: -4,
        width: TAIL_SIZE,
        height: TAIL_SIZE,
        borderRadius: "50%",
        backgroundColor: bubbleColor,
      }
    : { display: "none" };
  const tailDotStyle: React.CSSProperties = showTail
    ? {
        position: "absolute",
        bottom: -8,
        [side === "incoming" ? "left" : "right"]: -12,
        width: TAIL_SIZE * 0.5,
        height: TAIL_SIZE * 0.5,
        borderRadius: "50%",
        backgroundColor: bubbleColor,
      }
    : { display: "none" };

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={wrapperStyle}>
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: DOT_GAP,
            paddingLeft: BUBBLE_PAD_X,
            paddingRight: BUBBLE_PAD_X,
            paddingTop: BUBBLE_PAD_Y,
            paddingBottom: BUBBLE_PAD_Y,
            backgroundColor: bubbleColor,
            borderRadius: BUBBLE_RADIUS,
            transform: `scale(${bubbleScale})`,
            opacity: bubbleOpacity,
            transformOrigin:
              side === "incoming" ? "bottom left" : "bottom right",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          }}
        >
          {[0, 1, 2].map((i) => {
            const { opacity, scale: dotScale } = dotPulse(localFrame, i);
            return (
              <div
                key={i}
                style={{
                  width: DOT_DIAMETER,
                  height: DOT_DIAMETER,
                  borderRadius: DOT_DIAMETER / 2,
                  backgroundColor: dotColor,
                  opacity,
                  transform: `scale(${dotScale})`,
                }}
              />
            );
          })}

          {/* Tail — two rounded blobs stacked at the bubble's bottom corner,
              approximating the iOS speech-bubble curl without SVG paths. */}
          <div style={tailStyle} />
          <div style={tailDotStyle} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
