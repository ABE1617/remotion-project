import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import type { SpringConfig } from "remotion";
import type { TikTokToken } from "../shared/types";
import type { KaraokeColorScheme } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";

const KARAOKE_SPRING: SpringConfig = {
  mass: 0.5,
  damping: 10,
  stiffness: 200,
  overshootClamping: false,
};

interface KaraokeWordProps {
  token: TikTokToken;
  index: number;
  isActive: boolean;
  colorScheme: KaraokeColorScheme;
  pageStartFrame: number;
  staggeredEntrance: boolean;
  staggerDelayFrames: number;
  fontSize: number;
}

export const KaraokeWord: React.FC<KaraokeWordProps> = ({
  token,
  index,
  isActive,
  colorScheme,
  pageStartFrame,
  staggeredEntrance,
  staggerDelayFrames,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale pulse when word becomes active
  const tokenStartFrame = Math.round((token.fromMs / 1000) * fps);
  const framesSinceActive = frame - tokenStartFrame;

  const springVal =
    framesSinceActive >= 0
      ? spring({
          fps,
          frame: framesSinceActive,
          config: KARAOKE_SPRING,
        })
      : 0;

  // Active: scale up to 1.10 via spring, stays there while active
  // Inactive: snap back to 1.0
  const scale = isActive ? interpolate(springVal, [0, 1], [1.0, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) : 1.0;

  // Subtle lift on active word
  const translateY = isActive
    ? interpolate(springVal, [0, 1], [0, -2], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Staggered entrance opacity
  const wordEntryDelay = staggeredEntrance ? index * staggerDelayFrames : 0;
  const wordEntryFrame = pageStartFrame + wordEntryDelay;
  const entranceOpacity = interpolate(
    frame,
    [wordEntryFrame, wordEntryFrame + 3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Color: instant snap
  const color = isActive ? colorScheme.activeColor : colorScheme.inactiveColor;

  // Text stroke (4-directional) + drop shadow
  const s = 2;
  const sc = colorScheme.strokeColor;
  const strokeShadow = [
    `${-s}px ${-s}px 0 ${sc}`,
    `${s}px ${-s}px 0 ${sc}`,
    `${-s}px ${s}px 0 ${sc}`,
    `${s}px ${s}px 0 ${sc}`,
    `0 ${-s}px 0 ${sc}`,
    `0 ${s}px 0 ${sc}`,
    `${-s}px 0 0 ${sc}`,
    `${s}px 0 0 ${sc}`,
  ].join(", ");

  const dropShadow = "0 4px 8px rgba(0,0,0,0.5)";

  // Glow only on active word
  const glowShadow = isActive
    ? `0 0 10px ${colorScheme.glowColor}, 0 0 20px ${colorScheme.glowColor}`
    : "";

  const textShadow = [strokeShadow, dropShadow, glowShadow]
    .filter(Boolean)
    .join(", ");

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT_FAMILIES.montserrat,
        fontWeight: 800,
        fontSize,
        textTransform: "none",
        letterSpacing: "-0.01em",
        lineHeight: 1.25,
        color,
        textShadow,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transformOrigin: "center center",
        opacity: entranceOpacity,
        whiteSpace: "pre",
      }}
    >
      {token.text}
    </span>
  );
};
