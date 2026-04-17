import React from "react";
import { AbsoluteFill, interpolate, Easing, OffthreadVideo } from "remotion";
import type { ShutterFlashProps } from "../types";

export const SHUTTER_FLASH_PEAK_PROGRESS = 0.5;

/**
 * ShutterFlash — Camera-shutter transition. Blade(s) sweep across the frame
 * with a brief white flash at peak closure (mimicking exposure). The leading
 * edge of each blade carries a subtle highlight stripe for shutter physicality.
 */
export const ShutterFlash: React.FC<ShutterFlashProps> = ({
  clipA,
  clipB,
  progress,
  style,
  blades = "dual",
  flashColor = "#FFFFFF",
  bladeColor = "#0A0A0A",
  chromaticAberrationOnReveal = true,
}) => {
  // Blade easings: fast/committed closure, smooth release
  const easeInCubic = Easing.bezier(0.4, 0, 1, 1);
  const easeOutCubic = Easing.bezier(0, 0, 0.6, 1);

  const showClipB = progress >= SHUTTER_FLASH_PEAK_PROGRESS;

  // Closure progress (0 -> 1 across 0 .. 0.4). At 0.4 blades fully cover.
  const closureY = interpolate(progress, [0, 0.4], [-100, 0], {
    easing: easeInCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Opening progress (0 -> 1 across 0.6 .. 1). Translate 0 -> 100 (offscreen).
  const openingY = interpolate(progress, [0.6, 1], [0, 100], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // After closure (>=0.4) and before opening begins (<0.6), blades are held at 0.
  const bladeY =
    progress < 0.4 ? closureY : progress < 0.6 ? 0 : openingY;

  // Flash overlay — 0 -> 1 -> 0 across the cut
  const flashOpacity = interpolate(
    progress,
    [0.45, 0.48, 0.52, 0.55],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Chromatic aberration strength on the incoming clip (quick decay)
  const caStrength = interpolate(progress, [0.5, 0.55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const caActive = chromaticAberrationOnReveal && showClipB && caStrength > 0.01;
  const caOffset = 2 * caStrength;

  // Fallback settle: 0.95 -> 1.0 scale on incoming if CA is disabled
  const settleScaleB = interpolate(progress, [0.5, 0.6], [0.97, 1.0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const highlightColor = "rgba(255,255,255,0.15)";
  const HIGHLIGHT_HEIGHT = 1.5;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      {/* Base clip layer */}
      <AbsoluteFill>
        {caActive ? (
          <AbsoluteFill style={{ transform: `scale(${settleScaleB})` }}>
            {/* Red channel, shifted left */}
            <AbsoluteFill
              style={{
                transform: `translateX(${-caOffset}px)`,
                mixBlendMode: "screen",
              }}
            >
              <OffthreadVideo
                src={clipB}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "url(#shutterflash-red-filter)",
                }}
              />
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <filter id="shutterflash-red-filter">
                    <feColorMatrix
                      type="matrix"
                      values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    />
                  </filter>
                </defs>
              </svg>
            </AbsoluteFill>
            {/* Green channel, center */}
            <AbsoluteFill style={{ mixBlendMode: "screen" }}>
              <OffthreadVideo
                src={clipB}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "url(#shutterflash-green-filter)",
                }}
              />
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <filter id="shutterflash-green-filter">
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    />
                  </filter>
                </defs>
              </svg>
            </AbsoluteFill>
            {/* Blue channel, shifted right */}
            <AbsoluteFill
              style={{
                transform: `translateX(${caOffset}px)`,
                mixBlendMode: "screen",
              }}
            >
              <OffthreadVideo
                src={clipB}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "url(#shutterflash-blue-filter)",
                }}
              />
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <filter id="shutterflash-blue-filter">
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                    />
                  </filter>
                </defs>
              </svg>
            </AbsoluteFill>
          </AbsoluteFill>
        ) : (
          <AbsoluteFill
            style={{
              transform: showClipB ? `scale(${settleScaleB})` : undefined,
            }}
          >
            <OffthreadVideo
              src={showClipB ? clipB : clipA}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      {/* Blades */}
      {blades === "dual" ? (
        <>
          {/* Top blade — slides down from -100% to 0, then up to -100% */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "50%",
              background: bladeColor,
              transform: `translateY(${
                progress < 0.6 ? bladeY : -openingY
              }%)`,
              willChange: "transform",
            }}
          >
            {/* Highlight edge on the bottom (center-facing) edge */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: HIGHLIGHT_HEIGHT,
                background: highlightColor,
              }}
            />
          </div>

          {/* Bottom blade — slides up from 100% to 0, then down to 100% */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "50%",
              background: bladeColor,
              transform: `translateY(${
                progress < 0.6 ? -bladeY : openingY
              }%)`,
              willChange: "transform",
            }}
          >
            {/* Highlight edge on the top (center-facing) edge */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: HIGHLIGHT_HEIGHT,
                background: highlightColor,
              }}
            />
          </div>
        </>
      ) : (
        /* Single blade — slides down from -100% to 0, then off to 100% */
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: bladeColor,
            transform: `translateY(${bladeY}%)`,
            willChange: "transform",
          }}
        >
          {/* Highlight on the leading (bottom) edge */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: HIGHLIGHT_HEIGHT,
              background: highlightColor,
            }}
          />
        </div>
      )}

      {/* White flash overlay — the signature frame */}
      {flashOpacity > 0.001 && (
        <AbsoluteFill
          style={{
            background: flashColor,
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
