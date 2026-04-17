import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { StackProps } from "../types";

/**
 * Stack — Full iOS-style task switcher visual.
 * Dark blurred wallpaper background, stacked cards with rounded corners
 * and depth shadows, Clip A card slides left while Clip B card comes
 * forward from the stack behind it.
 */

const CARD_RADIUS = 40;
const CARD_SCALE = 0.82;

// Fake "other app" cards in the background stack
const GHOST_CARDS = [
  { color: "#1a1a2e", offsetX: -60, scale: 0.72, opacity: 0.3 },
  { color: "#16213e", offsetX: -120, scale: 0.68, opacity: 0.15 },
];

export const Stack: React.FC<StackProps> = ({
  clipA,
  clipB,
  progress,
  style,
}) => {
  const ease = Easing.bezier(0.32, 0.72, 0, 1);

  // Phase 1 (0 → 0.35): zoom out into task switcher view
  // Phase 2 (0.35 → 0.7): slide cards horizontally (A slides left, B comes center)
  // Phase 3 (0.7 → 1): zoom B back to full screen

  // Zoom into switcher view
  const enterSwitcher = interpolate(progress, [0, 0.3], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit switcher view
  const exitSwitcher = interpolate(progress, [0.7, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Horizontal slide of cards
  const slideProgress = interpolate(progress, [0.3, 0.7], [0, 1], {
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background blur/dark — visible during switcher view
  const bgOpacity = interpolate(
    progress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card A: starts full screen → shrinks to card → slides left → gone
  const scaleA = interpolate(enterSwitcher, [0, 1], [1, CARD_SCALE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radiusA = interpolate(enterSwitcher, [0, 1], [0, CARD_RADIUS], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideXA = interpolate(slideProgress, [0, 1], [0, -110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityA = interpolate(slideProgress, [0.6, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card B: starts behind in stack → slides to center → zooms to full screen
  const slideXB = interpolate(slideProgress, [0, 1], [55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stackScaleB = interpolate(slideProgress, [0, 1], [0.72, CARD_SCALE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalScaleB = interpolate(exitSwitcher, [0, 1], [CARD_SCALE, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleBTotal = progress < 0.7 ? stackScaleB : finalScaleB;
  const radiusB = interpolate(exitSwitcher, [0, 1], [CARD_RADIUS, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityB = interpolate(progress, [0.15, 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ghost cards visibility
  const ghostOpacity = interpolate(
    progress,
    [0.1, 0.3, 0.7, 0.9],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0a0a0f", ...style }}>
      {/* Dark wallpaper background with subtle gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, #1a1a30 0%, #0a0a0f 70%)",
          opacity: bgOpacity,
        }}
      />

      {/* Ghost cards — other "apps" in the stack */}
      {GHOST_CARDS.map((ghost, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: ghostOpacity * ghost.opacity,
            transform: `translateX(${ghost.offsetX - slideProgress * 60}px) scale(${ghost.scale})`,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: "92%",
              height: "85%",
              borderRadius: CARD_RADIUS,
              background: ghost.color,
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      ))}

      {/* Card B — next app coming forward */}
      <AbsoluteFill
        style={{
          transform: `translateX(${slideXB}%) scale(${scaleBTotal})`,
          borderRadius: radiusB,
          overflow: "hidden",
          opacity: opacityB,
          boxShadow:
            progress > 0.15 && progress < 0.95
              ? `0 20px 60px rgba(0,0,0,0.5)`
              : "none",
        }}
      >
        <OffthreadVideo
          src={clipB}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Card A — current app shrinking and sliding away */}
      {opacityA > 0.01 && (
        <AbsoluteFill
          style={{
            transform: `translateX(${slideXA}%) scale(${scaleA})`,
            borderRadius: radiusA,
            overflow: "hidden",
            opacity: opacityA,
            boxShadow: `0 20px 60px rgba(0,0,0,${0.5 * (1 - slideProgress)})`,
          }}
        >
          <OffthreadVideo
            src={clipA}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {/* Subtle top status bar hint — thin line at top during switcher view */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 80,
          height: 4,
          borderRadius: 2,
          backgroundColor: `rgba(255,255,255,${0.15 * bgOpacity})`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
