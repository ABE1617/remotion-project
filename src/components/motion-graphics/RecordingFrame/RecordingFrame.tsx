import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { resolveMGPosition } from "../shared/positioning";
import { useMGPhase } from "../shared/useMGPhase";
import type {
  RecordingFrameAnnotation,
  RecordingFrameProps,
} from "./types";

// ---------------------------------------------------------------------------
// RecordingFrame — camera-viewfinder overlay lifted from the Telemetry
// caption. Thin inset border, a scan line sweeping down, and four corner
// annotations (ELAPSED counter, CAM, FORMAT, REC by default). Every
// element is customizable.
// ---------------------------------------------------------------------------

const DEFAULT_ANNOTATIONS: RecordingFrameAnnotation[] = [
  { label: "ELAPSED", value: "timestamp", corner: "top-left" },
  { label: "CAM", value: "01", corner: "top-right" },
  { label: "FORMAT", value: "1080P 30FPS", corner: "bottom-left" },
  { label: "REC", value: "●", corner: "bottom-right" },
];

const cornerToStyle = (
  corner: RecordingFrameAnnotation["corner"],
  inset: number,
): React.CSSProperties => {
  const base: React.CSSProperties = { position: "absolute" };
  switch (corner) {
    case "top-left":
      base.top = inset;
      base.left = inset;
      break;
    case "top-right":
      base.top = inset;
      base.right = inset;
      break;
    case "bottom-left":
      base.bottom = inset;
      base.left = inset;
      break;
    case "bottom-right":
      base.bottom = inset;
      base.right = inset;
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
  frameInset = 30,
  showScanLine = true,
  scanLineColor,
  scanLineCycle = 90,
  annotations = DEFAULT_ANNOTATIONS,
  anchor,
  offsetX,
  offsetY,
  scale,
}) => {
  const frame = useCurrentFrame();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 8, defaultExitFrames: 8 },
  );

  const { containerStyle, wrapperStyle } = resolveMGPosition({
    anchor,
    offsetX,
    offsetY,
    scale,
  });

  if (!visible) return null;

  // Whole-overlay fade in/out so the frame doesn't hard-pop.
  const enterOpacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = 1 - exitProgress;
  const overlayOpacity = enterOpacity * exitOpacity;

  // Scan line Y position — loops through scanLineCycle frames.
  const scanY = interpolate(
    frame % scanLineCycle,
    [0, scanLineCycle],
    [0, 1920],
  );

  const resolvedScanColor = scanLineColor ?? `${accentColor}26`; // ~15% alpha

  // Elapsed seconds since the component started.
  const elapsedSeconds = Math.max(0, localFrame) / 30;

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={wrapperStyle}>
        <AbsoluteFill style={{ opacity: overlayOpacity }}>
          {/* Thin inset border */}
          {showFrame ? (
            <div
              style={{
                position: "absolute",
                top: frameInset,
                left: frameInset,
                right: frameInset,
                bottom: frameInset,
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
                backgroundColor: resolvedScanColor,
                transform: `translateY(${scanY}px)`,
                pointerEvents: "none",
              }}
            />
          ) : null}

          {/* Corner annotations */}
          {annotations.map((a, i) => {
            const displayValue =
              a.value === "timestamp"
                ? `T+${elapsedSeconds.toFixed(1)}s`
                : a.value;
            return (
              <div
                key={i}
                style={cornerToStyle(a.corner, frameInset + 10)}
              >
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
                  {displayValue}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
