import React from "react";
import { Img } from "remotion";

// ---------------------------------------------------------------------------
// Shared helpers for SpeechBubble variants: the fallback initials avatar and
// the social-style count formatter ("18.4K", "920K", "1.2M").
// ---------------------------------------------------------------------------

interface AvatarProps {
  size: number;
  src?: string;
  initials?: string;
  fallbackColor: string;
  fontFamily: string;
  fallbackText?: string; // what to pull initials from if `initials` omitted
}

// Renders either an image avatar or a circular colored tile with the user's
// first 1-2 letters — used as a fallback when no image URL is passed.
export const Avatar: React.FC<AvatarProps> = ({
  size,
  src,
  initials,
  fallbackColor,
  fontFamily,
  fallbackText,
}) => {
  if (src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  const letters = (initials ?? fallbackText ?? "?").slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: fallbackColor,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontFamily,
        // ~42% of diameter renders comfortably inside the circle regardless of
        // whether it's 1 or 2 letters.
        fontSize: Math.round(size * 0.42),
        fontWeight: 700,
        letterSpacing: "-0.01em",
        lineHeight: 1,
      }}
    >
      {letters}
    </div>
  );
};

// Formats a number as a compact social-media-style count string.
// 0 - 999      → "247"
// 1000 - 9999  → "1.8K" (one decimal)
// 10K - 999K   → "18.4K" / "920K" (one decimal under 100K, integer over)
// 1M+          → "1.2M"
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return `${(n / 1000).toFixed(1)}K`;
  if (n < 100_000) return `${(n / 1000).toFixed(1)}K`;
  if (n < 1_000_000) return `${Math.round(n / 1000)}K`;
  if (n < 10_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return `${Math.round(n / 1_000_000)}M`;
}

// Standard scale/translateY/opacity entrance driven by a 0→1 spring progress,
// plus the exit transform. Shared across all four variants so they share
// a single motion signature.
export function composeBubbleTransform(
  enterProgress: number,
  exitProgress: number,
): { transform: string; opacity: number } {
  // Entrance: scale 0.9→1, translateY 20→0.
  const enterScale = 0.9 + 0.1 * enterProgress;
  const enterTranslate = 20 * (1 - enterProgress);
  const enterOpacity = enterProgress;

  // Exit: scale to 0.95, fade out. We compound scale by multiplying rather
  // than switching, which keeps motion smooth if exit starts before entrance
  // fully settles (edge case at very short durationMs values).
  const exitScaleMult = 1 - 0.05 * exitProgress;
  const exitOpacity = 1 - exitProgress;

  const scale = enterScale * exitScaleMult;
  const opacity = enterOpacity * exitOpacity;

  return {
    transform: `translateY(${enterTranslate}px) scale(${scale})`,
    opacity,
  };
}
