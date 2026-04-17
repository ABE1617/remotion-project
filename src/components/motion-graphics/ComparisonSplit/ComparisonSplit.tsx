import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import type { ComparisonContent, ComparisonSplitProps } from "./types";

// ---------------------------------------------------------------------------
// ComparisonSplit — before/after or wrong/right split-screen motion graphic.
// ---------------------------------------------------------------------------
//
// Choreography (entrance @ 30fps, ~28 frames):
//   0-8   divider grows outward from center (scaleY or scaleX 0→1).
//   6-18  both sides slide in from their outer edges + fade.
//   16-24 labels drop from translateY(-30) + fade.
//   22-28 VS pill (if enabled) scales in with gentle overshoot.
//
// Hold: completely static.
//
// Exit (16 frames, reversed + snappier):
//   0-6   VS pill scales down + fades.
//   0-8   labels fade + drift up.
//   4-14  sides slide back toward their outer edges + fade.
//   8-16  divider collapses to center last.

const LABEL_SIZE = 64;
const LABEL_PADDING_X = 14;
const LABEL_PADDING_Y = 8;
const LABEL_EDGE_OFFSET = 60;
const LABEL_BG = "#0A0A0A";

const DIVIDER_THICKNESS = 6;
const DIVIDER_GLOW =
  "0 0 16px rgba(255,255,255,0.6), 0 0 4px rgba(255,255,255,0.9)";

const VS_DIAMETER = 88;
const VS_FONT_SIZE = 32;

// ---------------------------------------------------------------------------
// Side content renderer — image / video / text / color.
// ---------------------------------------------------------------------------

const SideContent: React.FC<{ content: ComparisonContent }> = ({ content }) => {
  if (content.type === "image") {
    return (
      <Img
        src={content.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }
  if (content.type === "video") {
    return (
      <Video
        src={content.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }
  if (content.type === "color") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: content.color,
        }}
      />
    );
  }
  // text
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: content.bgColor ?? "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILIES.anton,
          fontSize: 96,
          fontWeight: 400,
          color: content.color ?? "#FFFFFF",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        {content.text}
      </div>
    </div>
  );
};

export const ComparisonSplit: React.FC<ComparisonSplitProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  orientation = "vertical",
  sides,
  labels,
  dividerColor = "#FFFFFF",
  showVsPill = false,
}) => {
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 28, defaultExitFrames: 16 },
  );

  if (!visible) return null;

  const isVertical = orientation === "vertical";

  // ------------------------------------------------------------------------
  // Divider (frames 0-8). Scales from 0 → 1 outward from center.
  // ------------------------------------------------------------------------

  const dividerEnterSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  // Exit: collapses last, between 0.5 and 1 of exitProgress (frames 8-16 of 16).
  const dividerExitScale = interpolate(exitProgress, [0.5, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dividerScale = exitProgress > 0 ? dividerExitScale : dividerEnterSpring;

  // ------------------------------------------------------------------------
  // Sides (frames 6-18). Each slides in from its outer edge.
  // ------------------------------------------------------------------------

  const sideSpring = spring({
    fps,
    frame: localFrame - 6,
    config: SPRING_SNAPPY,
    durationInFrames: 12,
  });
  // 0 = fully off-edge, 1 = fully centered.
  const sideEnterProgress = interpolate(sideSpring, [0, 1], [0, 1]);
  const sideFadeIn = interpolate(localFrame, [6, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Exit: sides slide back between frames 4-14 of 16 exit frames (0.25 → 0.875).
  const sideExitProgress = interpolate(exitProgress, [0.25, 0.875], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Offset in percent: enter moves from -100% → 0%, exit moves from 0% → -100% (for leading side).
  const leadingOffsetPct = (sideEnterProgress - 1) * 100 - sideExitProgress * 100;
  const trailingOffsetPct = (1 - sideEnterProgress) * 100 + sideExitProgress * 100;
  const sideOpacity =
    sideFadeIn *
    interpolate(exitProgress, [0.25, 0.875], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // ------------------------------------------------------------------------
  // Labels (frames 16-24). Drop in from translateY(-30) + fade.
  // ------------------------------------------------------------------------

  const labelSpring = spring({
    fps,
    frame: localFrame - 16,
    config: SPRING_SNAPPY,
    durationInFrames: 8,
  });
  const labelEnterY = interpolate(labelSpring, [0, 1], [-30, 0]);
  const labelFadeIn = interpolate(localFrame, [16, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Exit: labels fade + drift up over frames 0-8 of 16 exit frames (0 → 0.5).
  const labelExitY = interpolate(exitProgress, [0, 0.5], [0, -20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelExitFade = interpolate(exitProgress, [0, 0.5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = labelEnterY + labelExitY;
  const labelOpacity = labelFadeIn * labelExitFade;

  // ------------------------------------------------------------------------
  // VS pill (frames 22-28). Scales from 0 → 1 with gentle overshoot.
  // ------------------------------------------------------------------------

  const vsSpring = spring({
    fps,
    frame: localFrame - 22,
    config: { ...SPRING_SNAPPY, damping: 10 }, // a touch bouncier for punctuation
    durationInFrames: 8,
  });
  const vsEnterScale = vsSpring;
  const vsFadeIn = interpolate(localFrame, [22, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Exit: pill scales down + fades over frames 0-6 of 16 exit frames (0 → 0.375).
  const vsExitScale = interpolate(exitProgress, [0, 0.375], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vsExitFade = interpolate(exitProgress, [0, 0.375], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vsScale = exitProgress > 0 ? vsExitScale : vsEnterScale;
  const vsOpacity = vsFadeIn * vsExitFade;

  // ------------------------------------------------------------------------
  // Per-side layout geometry.
  // ------------------------------------------------------------------------

  const leadingSideStyle: React.CSSProperties = isVertical
    ? { top: 0, left: 0, width: "50%", height: "100%" }
    : { top: 0, left: 0, width: "100%", height: "50%" };

  const trailingSideStyle: React.CSSProperties = isVertical
    ? { top: 0, right: 0, width: "50%", height: "100%" }
    : { bottom: 0, left: 0, width: "100%", height: "50%" };

  const leadingTransform = isVertical
    ? `translateX(${leadingOffsetPct}%)`
    : `translateY(${leadingOffsetPct}%)`;
  const trailingTransform = isVertical
    ? `translateX(${trailingOffsetPct}%)`
    : `translateY(${trailingOffsetPct}%)`;

  // ------------------------------------------------------------------------
  // Divider geometry — a centered line that grows outward from center.
  // ------------------------------------------------------------------------

  const dividerStyle: React.CSSProperties = isVertical
    ? {
        position: "absolute",
        top: 0,
        left: `calc(50% - ${DIVIDER_THICKNESS / 2}px)`,
        width: DIVIDER_THICKNESS,
        height: "100%",
        backgroundColor: dividerColor,
        boxShadow: DIVIDER_GLOW,
        transform: `scaleY(${dividerScale})`,
        transformOrigin: "center",
      }
    : {
        position: "absolute",
        left: 0,
        top: `calc(50% - ${DIVIDER_THICKNESS / 2}px)`,
        height: DIVIDER_THICKNESS,
        width: "100%",
        backgroundColor: dividerColor,
        boxShadow: DIVIDER_GLOW,
        transform: `scaleX(${dividerScale})`,
        transformOrigin: "center",
      };

  // ------------------------------------------------------------------------
  // Label positioning — top (vertical) or horizontally-centered in each half.
  // For horizontal orientation the task spec says: "top label centered
  // horizontally inside top side, bottom label centered horizontally inside
  // bottom side" — so both labels sit on the horizontal centerline of their
  // half, offset vertically from the outer edge by LABEL_EDGE_OFFSET.
  // ------------------------------------------------------------------------

  const leadingLabelWrapperStyle: React.CSSProperties = isVertical
    ? {
        position: "absolute",
        top: LABEL_EDGE_OFFSET,
        left: 0,
        width: "50%",
        display: "flex",
        justifyContent: "center",
      }
    : {
        position: "absolute",
        top: LABEL_EDGE_OFFSET,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      };

  const trailingLabelWrapperStyle: React.CSSProperties = isVertical
    ? {
        position: "absolute",
        top: LABEL_EDGE_OFFSET,
        right: 0,
        width: "50%",
        display: "flex",
        justifyContent: "center",
      }
    : {
        position: "absolute",
        bottom: LABEL_EDGE_OFFSET,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      };

  const labelChipStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILIES.anton,
    fontSize: LABEL_SIZE,
    fontWeight: 400,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    lineHeight: 1,
    backgroundColor: LABEL_BG,
    paddingLeft: LABEL_PADDING_X,
    paddingRight: LABEL_PADDING_X,
    paddingTop: LABEL_PADDING_Y,
    paddingBottom: LABEL_PADDING_Y,
    borderRadius: 4,
    whiteSpace: "nowrap",
  };

  const [leadingContent, trailingContent] = sides;
  const [leadingLabel, trailingLabel] = labels;

  const desatFilter = "saturate(0.4) brightness(0.85)";

  return (
    <AbsoluteFill>
      {/* Leading side (left for vertical, top for horizontal) */}
      <div
        style={{
          position: "absolute",
          overflow: "hidden",
          ...leadingSideStyle,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: leadingTransform,
            opacity: sideOpacity,
            filter: leadingContent.desaturate ? desatFilter : undefined,
          }}
        >
          <SideContent content={leadingContent} />
        </div>
      </div>

      {/* Trailing side (right for vertical, bottom for horizontal) */}
      <div
        style={{
          position: "absolute",
          overflow: "hidden",
          ...trailingSideStyle,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: trailingTransform,
            opacity: sideOpacity,
            filter: trailingContent.desaturate ? desatFilter : undefined,
          }}
        >
          <SideContent content={trailingContent} />
        </div>
      </div>

      {/* Divider line */}
      <div style={dividerStyle} />

      {/* Leading label */}
      <div style={leadingLabelWrapperStyle}>
        <div
          style={{
            ...labelChipStyle,
            transform: `translateY(${labelY}px)`,
            opacity: labelOpacity,
          }}
        >
          {leadingLabel}
        </div>
      </div>

      {/* Trailing label */}
      <div style={trailingLabelWrapperStyle}>
        <div
          style={{
            ...labelChipStyle,
            transform: `translateY(${labelY}px)`,
            opacity: labelOpacity,
          }}
        >
          {trailingLabel}
        </div>
      </div>

      {/* VS pill — geometric center of the frame, on top of divider */}
      {showVsPill ? (
        <div
          style={{
            position: "absolute",
            top: `calc(50% - ${VS_DIAMETER / 2}px)`,
            left: `calc(50% - ${VS_DIAMETER / 2}px)`,
            width: VS_DIAMETER,
            height: VS_DIAMETER,
            borderRadius: VS_DIAMETER / 2,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${vsScale})`,
            opacity: vsOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILIES.anton,
              fontSize: VS_FONT_SIZE,
              fontWeight: 400,
              color: "#0A0A0A",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            VS
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
