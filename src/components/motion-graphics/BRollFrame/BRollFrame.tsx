import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import type {
  BRollFrameAspectRatio,
  BRollFramePosition,
  BRollFrameProps,
  BRollFrameVariant,
} from "./types";

// ---------------------------------------------------------------------------
// BRollFrame — framed image / video pop-in for speaker references.
// ---------------------------------------------------------------------------
//
// Choreography (entrance @ 30fps, 14 frames):
//   0-14  scale 0.9 → 1.0 via SPRING_SNAPPY (gentle overshoot = "placed")
//   0-10  opacity 0 → 1
//   Polaroid only: rotate -6deg → -2.5deg over the same window
//   Drop shadow tightens-to-diffused during entrance (landing feel)
//
// Hold: sub-pixel sinusoidal Y parallax (~2px, slow frequency).
//
// Exit (10 frames):
//   scale 1.0 → 1.05 (lifts OFF the frame — deliberately premium)
//   opacity 1 → 0
//   Polaroid only: rotate -2.5deg → -5deg (tilts away)

const EDGE_PADDING = 120;

const ASPECT_MAP: Record<BRollFrameAspectRatio, number> = {
  "16:9": 16 / 9,
  "4:5": 4 / 5,
  "1:1": 1,
  "9:16": 9 / 16,
};

interface PositionStyle {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  transform?: string;
}

function getPositionStyle(
  position: BRollFramePosition,
): PositionStyle {
  switch (position) {
    case "top-left":
      return { top: EDGE_PADDING, left: EDGE_PADDING };
    case "top-right":
      return { top: EDGE_PADDING, right: EDGE_PADDING };
    case "bottom-left":
      return { bottom: EDGE_PADDING, left: EDGE_PADDING };
    case "bottom-right":
      return { bottom: EDGE_PADDING, right: EDGE_PADDING };
    case "center":
    default:
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
  }
}

// Diffused drop shadow — interpolated from tight (entrance start) to diffused
// (hold/exit). Large blur + low opacity = editorial, not default-Figma harsh.
function buildShadow(variant: BRollFrameVariant, diffuseProgress: number): string {
  // diffuseProgress: 0 = tight/close, 1 = fully diffused
  const baseBlur = variant === "polaroid" ? 30 : 24;
  const maxBlur = variant === "polaroid" ? 90 : 64;
  const baseY = variant === "polaroid" ? 10 : 8;
  const maxY = variant === "polaroid" ? 34 : 22;
  const baseSpread = 0;
  const maxSpread = variant === "polaroid" ? -6 : -4;

  const blur = interpolate(diffuseProgress, [0, 1], [baseBlur, maxBlur]);
  const y = interpolate(diffuseProgress, [0, 1], [baseY, maxY]);
  const spread = interpolate(diffuseProgress, [0, 1], [baseSpread, maxSpread]);

  // Polaroid shadow is a touch stronger to match its heavier presence.
  const alpha = variant === "polaroid" ? 0.32 : 0.26;

  return `0 ${y}px ${blur}px ${spread}px rgba(0,0,0,${alpha})`;
}

export const BRollFrame: React.FC<BRollFrameProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  src,
  mediaType = "image",
  aspectRatio = "16:9",
  width = 540,
  position = "center",
  variant = "clean",
  caption,
}) => {
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 14, defaultExitFrames: 10 },
  );

  if (!visible) return null;

  // --- Geometry ------------------------------------------------------------
  const ratio = ASPECT_MAP[aspectRatio];
  const mediaWidth = width;
  const mediaHeight = width / ratio;

  // Polaroid border treatment: 28px all sides + extra 60px at the bottom.
  const POLAROID_BORDER = 28;
  const POLAROID_BOTTOM_EXTRA = 60;
  const WHITE_BORDER = 4;

  // --- Entrance spring -----------------------------------------------------
  const enterSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 14,
  });
  const enterScale = interpolate(enterSpring, [0, 1], [0.9, 1.0]);
  const enterOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Diffuse progress — tight at frame 0, diffused by the end of the entrance.
  const diffuseProgress = interpolate(localFrame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Polaroid rotation during entrance: -6deg → -2.5deg.
  const polaroidEnterRotation = interpolate(
    enterSpring,
    [0, 1],
    [-6, -2.5],
  );

  // --- Hold parallax -------------------------------------------------------
  // ~2px sin-driven Y offset at a slow frequency. Very subtle.
  const parallaxY = Math.sin(localFrame * 0.05) * 2;

  // --- Exit ----------------------------------------------------------------
  // Scale 1.0 → 1.05 (deliberate "lifting off" feel).
  const exitScale = interpolate(exitProgress, [0, 1], [1, 1.05]);
  const exitOpacity = 1 - exitProgress;
  // Polaroid: -2.5deg → -5deg during exit.
  const polaroidExitRotation = interpolate(exitProgress, [0, 1], [-2.5, -5]);

  // --- Compose transforms -------------------------------------------------
  const isExiting = exitProgress > 0;
  const scale = isExiting ? exitScale : enterScale;
  const opacity = enterOpacity * exitOpacity;

  // Polaroid rotation: during entrance, animate in; during exit, animate out.
  const polaroidRotation = isExiting
    ? polaroidExitRotation
    : polaroidEnterRotation;

  const positionStyle = getPositionStyle(position);
  // Preserve the center-anchor translate while still applying our own motion.
  const positionTransform =
    position === "center" ? "translate(-50%, -50%)" : "";

  // Final motion transform (applied inside positioned wrapper).
  const motionTransform = [
    positionTransform,
    `translateY(${parallaxY}px)`,
    `scale(${scale})`,
    variant === "polaroid" ? `rotate(${polaroidRotation}deg)` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const shadow = buildShadow(variant, diffuseProgress);

  // --- Media element (Img or @remotion/media Video) ------------------------
  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const mediaNode =
    mediaType === "video" ? (
      <Video src={src} style={mediaStyle} />
    ) : (
      <Img src={src} style={mediaStyle} />
    );

  // --- Variant-specific frame rendering -----------------------------------
  // All variants wrap the media in a frame container. The outer wrapper
  // handles position + motion transform; the inner frame handles chrome.

  let frame: React.ReactNode;

  if (variant === "polaroid") {
    // Polaroid: heavy white border, extra bottom space, hand-written caption
    // in the white margin. Subtle corner radius — feels like a real photo.
    frame = (
      <div
        style={{
          backgroundColor: "#FAFAF7",
          padding: POLAROID_BORDER,
          paddingBottom: POLAROID_BORDER + POLAROID_BOTTOM_EXTRA,
          borderRadius: 4,
          boxShadow: shadow,
          width: mediaWidth + POLAROID_BORDER * 2,
        }}
      >
        <div
          style={{
            width: mediaWidth,
            height: mediaHeight,
            overflow: "hidden",
            borderRadius: 2,
            backgroundColor: "#000",
          }}
        >
          {mediaNode}
        </div>
        {caption ? (
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT_FAMILIES.caveatBrush,
              fontSize: 38,
              color: "#1A1A1A",
              textAlign: "center",
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>
    );
  } else if (variant === "white-border") {
    frame = (
      <div>
        <div
          style={{
            padding: WHITE_BORDER,
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            boxShadow: shadow,
            width: mediaWidth + WHITE_BORDER * 2,
          }}
        >
          <div
            style={{
              width: mediaWidth,
              height: mediaHeight,
              overflow: "hidden",
              borderRadius: 10,
              backgroundColor: "#000",
            }}
          >
            {mediaNode}
          </div>
        </div>
        {caption ? (
          <div
            style={{
              marginTop: 16,
              fontFamily: FONT_FAMILIES.inter,
              fontSize: 26,
              fontWeight: 500,
              color: "#B8B8B8",
              letterSpacing: "0.06em",
              textAlign: "center",
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>
    );
  } else {
    // Clean: no border, just the media + soft diffused shadow.
    frame = (
      <div>
        <div
          style={{
            width: mediaWidth,
            height: mediaHeight,
            overflow: "hidden",
            borderRadius: 14,
            backgroundColor: "#000",
            boxShadow: shadow,
          }}
        >
          {mediaNode}
        </div>
        {caption ? (
          <div
            style={{
              marginTop: 16,
              fontFamily: FONT_FAMILIES.inter,
              fontSize: 26,
              fontWeight: 500,
              color: "#B8B8B8",
              letterSpacing: "0.06em",
              textAlign: "center",
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          ...positionStyle,
          // Override the base positionStyle transform; we apply our own.
          transform: motionTransform,
          opacity,
        }}
      >
        {frame}
      </div>
    </AbsoluteFill>
  );
};
