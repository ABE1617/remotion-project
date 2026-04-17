import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import type {
  RecordingFrameAnnotation,
  RecordingFrameProps,
} from "./types";

// ---------------------------------------------------------------------------
// RecordingFrame — camera-viewfinder overlay extracted from Telemetry.
// Full-frame by design: thin 30px inset border, scan line sweeping down,
// four corner annotations. Visual spec is identical to the original
// Telemetry frame.
// ---------------------------------------------------------------------------

const DEFAULT_ANNOTATIONS: RecordingFrameAnnotation[] = [
  { label: "ELAPSED", value: "timestamp", corner: "top-left" },
  { label: "WORDS", value: "wordcount", corner: "top-right" },
  { label: "RATE", value: "wpm", corner: "bottom-left" },
  { label: "SIG", value: "ACTIVE", corner: "bottom-right" },
];

const cornerToStyle = (
  corner: RecordingFrameAnnotation["corner"],
): React.CSSProperties => {
  const base: React.CSSProperties = { position: "absolute" };
  switch (corner) {
    case "top-left":
      base.top = 40;
      base.left = 40;
      break;
    case "top-right":
      base.top = 40;
      base.right = 40;
      break;
    case "bottom-left":
      base.bottom = 40;
      base.left = 40;
      break;
    case "bottom-right":
      base.bottom = 40;
      base.right = 40;
      break;
  }
  return base;
};

export const RecordingFrame: React.FC<RecordingFrameProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  accentColor = "#C5432E",
  textColor = "#F0EEE9",
  annotationFontSize = 24,
  showFrame = true,
  frameBorderColor = "rgba(240,238,233,0.08)",
  showScanLine = true,
  scanLineColor = "rgba(197,67,46,0.15)",
  scanLineCycle = 90,
  annotations = DEFAULT_ANNOTATIONS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 8, defaultExitFrames: 8 },
  );

  if (!visible) return null;

  // Whole-overlay fade in/out so it doesn't hard-pop.
  const enterOpacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = 1 - exitProgress;
  const overlayOpacity = enterOpacity * exitOpacity;

  // Scan line Y — cycles off the absolute frame like the original Telemetry.
  const scanY = interpolate(
    frame % scanLineCycle,
    [0, scanLineCycle],
    [0, 1920],
  );

  const elapsedSeconds = Math.max(0, localFrame) / fps;

  const resolveValue = (raw: string): string => {
    if (raw === "timestamp") {
      return `T+${elapsedSeconds.toFixed(1)}s`;
    }
    if (raw === "wordcount") {
      return String(Math.floor(elapsedSeconds * 2));
    }
    if (raw === "wpm") {
      const wpm =
        elapsedSeconds > 0.3 ? Math.round(120 + elapsedSeconds * 8) : 0;
      return String(Math.min(220, wpm));
    }
    return raw;
  };

  return (
    <AbsoluteFill style={{ opacity: overlayOpacity }}>
      {/* Thin inset border */}
      {showFrame ? (
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 30,
            right: 30,
            bottom: 30,
            border: `1px solid ${frameBorderColor}`,
            pointerEvents: "none",
          }}
        />
      ) : null}

      {/* Scan line */}
      {showScanLine ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 1,
            backgroundColor: scanLineColor,
            transform: `translateY(${scanY}px)`,
            pointerEvents: "none",
          }}
        />
      ) : null}

      {/* Corner annotations */}
      {annotations.map((a, i) => (
        <div key={i} style={cornerToStyle(a.corner)}>
          <div
            style={{
              fontFamily: FONT_FAMILIES.jetBrainsMono,
              fontSize: annotationFontSize * 0.75,
              fontWeight: 400,
              color: `${textColor}80`,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1.4,
            }}
          >
            {a.label}
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILIES.jetBrainsMono,
              fontSize: annotationFontSize,
              fontWeight: 500,
              color: accentColor,
              letterSpacing: "0.02em",
              lineHeight: 1.2,
            }}
          >
            {resolveValue(a.value)}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
