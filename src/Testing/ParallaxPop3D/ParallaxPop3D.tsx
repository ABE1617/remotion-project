import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SpringConfig } from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { ParallaxPop3DProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { CAPTION_PADDING } from "../../utils/captionPosition";
import { clamp, lerp } from "../../utils/math";

// ── Default spring config for pop animation ─────────────────────────────────

const POP_SPRING: SpringConfig = {
  mass: 0.5,
  damping: 10,
  stiffness: 180,
  overshootClamping: false,
};

// ── 3D Extrusion Generator ──────────────────────────────────────────────────
// Pure function that creates a stacked text-shadow string simulating 3D depth.

function generate3DExtrusion(config: {
  layers: number;
  offsetPerLayer: number;
  color: string;
  ambientBlur: number;
  ambientOpacity: number;
}): string {
  const shadows: string[] = [];

  // Layer 0 is the face; layers 1..N form the extrusion stack
  for (let i = 1; i <= config.layers; i++) {
    const offset = Math.round(i * config.offsetPerLayer);
    shadows.push(`-${offset}px ${offset}px 0 ${config.color}`);
  }

  // Ambient ground shadow on the deepest layer
  const deepOffset = Math.round(
    (config.layers + 1) * config.offsetPerLayer,
  );
  shadows.push(
    `-${deepOffset}px ${deepOffset}px ${config.ambientBlur}px rgba(0,0,0,${config.ambientOpacity})`,
  );

  return shadows.join(", ");
}

// ── ParallaxPop3DWord ───────────────────────────────────────────────────────
// The core per-word component. A single spring drives all pop properties.

const ParallaxPop3DWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  primaryColor: string;
  activeColor: string;
  letterSpacing: string;
  allCaps: boolean;
  restingDepthLayers: number;
  activeDepthLayers: number;
  restingOffsetPerLayer: number;
  activeOffsetPerLayer: number;
  extrusionColor: string;
  restingAmbientBlur: number;
  activeAmbientBlur: number;
  ambientShadowOpacity: number;
  activeScale: number;
  activeTranslateY: number;
  popSpringConfig: SpringConfig;
  pastWordOpacity: number;
}> = ({
  token,
  pageStartMs,
  fontFamily,
  fontSize,
  fontWeight,
  primaryColor,
  activeColor,
  letterSpacing,
  allCaps,
  restingDepthLayers,
  activeDepthLayers,
  restingOffsetPerLayer,
  activeOffsetPerLayer,
  extrusionColor,
  restingAmbientBlur,
  activeAmbientBlur,
  ambientShadowOpacity,
  activeScale,
  activeTranslateY,
  popSpringConfig,
  pastWordOpacity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current time in ms (Sequence-local)
  const pageLocalMs = (frame / fps) * 1000;

  // Token timing relative to page start
  const tokenStartMs = token.fromMs - pageStartMs;
  const tokenEndMs = token.toMs - pageStartMs;

  const isActive = pageLocalMs >= tokenStartMs && pageLocalMs < tokenEndMs;
  const isPast = pageLocalMs >= tokenEndMs;
  const hasAppeared = pageLocalMs >= tokenStartMs;

  // ── No animation — static display ──────────────────────────────────────
  const entranceOpacity = hasAppeared ? 1 : 0;
  const entranceTranslateY = 0;

  const effectivePopAmount = isActive ? 1 : 0;

  const currentLayers = isActive ? activeDepthLayers : restingDepthLayers;
  const currentOffset = isActive ? activeOffsetPerLayer : restingOffsetPerLayer;
  const currentAmbientBlur = isActive ? activeAmbientBlur : restingAmbientBlur;
  const currentScale = 1;
  const currentTranslateY = 0;

  // ── Memoized resting shadow (only recomputed when props change) ───────
  const restingShadow = useMemo(
    () =>
      generate3DExtrusion({
        layers: restingDepthLayers,
        offsetPerLayer: restingOffsetPerLayer,
        color: extrusionColor,
        ambientBlur: restingAmbientBlur,
        ambientOpacity: ambientShadowOpacity,
      }),
    [
      restingDepthLayers,
      restingOffsetPerLayer,
      extrusionColor,
      restingAmbientBlur,
      ambientShadowOpacity,
    ],
  );

  // Dynamic shadow: only recompute when actively animating
  const textShadow =
    effectivePopAmount > 0.001
      ? generate3DExtrusion({
          layers: currentLayers,
          offsetPerLayer: currentOffset,
          color: extrusionColor,
          ambientBlur: currentAmbientBlur,
          ambientOpacity: ambientShadowOpacity,
        })
      : restingShadow;

  // ── Color: interpolate from primary to active gold ────────────────────
  const color = interpolateColors(
    effectivePopAmount,
    [0, 1],
    [primaryColor, activeColor],
  );

  // ── Opacity: fully opaque, no dimming ──────────────────────────────────
  const wordOpacity = entranceOpacity;

  // ── Combined transforms ───────────────────────────────────────────────
  const totalTranslateY = entranceTranslateY + currentTranslateY;

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        textShadow,
        lineHeight: 1.2,
        opacity: wordOpacity,
        transform: `scale(${currentScale}) translateY(${totalTranslateY}px)`,
        transformOrigin: "center bottom",
        whiteSpace: "nowrap",
        WebkitTextStroke: "4px #000000",
        paintOrder: "stroke fill",
        willChange: "transform, text-shadow, color, opacity",
      }}
    >
      {displayText}
    </span>
  );
};

// ── ParallaxPop3DPage ───────────────────────────────────────────────────────
// Wraps all words for one page. Handles line splitting and page fade-out.

const ParallaxPop3DPage: React.FC<{
  page: TikTokPage;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  primaryColor: string;
  activeColor: string;
  letterSpacing: string;
  allCaps: boolean;
  maxWordsPerLine: number;
  lineGap: number;
  restingDepthLayers: number;
  activeDepthLayers: number;
  restingOffsetPerLayer: number;
  activeOffsetPerLayer: number;
  extrusionColor: string;
  restingAmbientBlur: number;
  activeAmbientBlur: number;
  ambientShadowOpacity: number;
  activeScale: number;
  activeTranslateY: number;
  popSpringConfig: SpringConfig;
  pastWordOpacity: number;
}> = ({
  page,
  fontFamily,
  fontSize,
  fontWeight,
  primaryColor,
  activeColor,
  letterSpacing,
  allCaps,
  maxWordsPerLine,
  lineGap,
  restingDepthLayers,
  activeDepthLayers,
  restingOffsetPerLayer,
  activeOffsetPerLayer,
  extrusionColor,
  restingAmbientBlur,
  activeAmbientBlur,
  ambientShadowOpacity,
  activeScale,
  activeTranslateY,
  popSpringConfig,
  pastWordOpacity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page-local time for fade-out
  const pageLocalMs = (frame / fps) * 1000;

  // ── No exit fade — static display ──────────────────────────────────────
  const exitOpacity = 1;

  // ── Split tokens into lines ───────────────────────────────────────────
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
    lines.push(page.tokens.slice(i, i + maxWordsPerLine));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
        width: "100%",
        opacity: exitOpacity,
      }}
    >
      {lines.map((lineTokens, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 0,
          }}
        >
          {lineTokens.map((token, tokenIdx) => (
            <div
              key={`${lineIdx}-${tokenIdx}`}
              style={{ padding: "0 24px" }}
            >
              <ParallaxPop3DWord
                token={token}
                pageStartMs={page.startMs}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                primaryColor={primaryColor}
                activeColor={activeColor}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                restingDepthLayers={restingDepthLayers}
                activeDepthLayers={activeDepthLayers}
                restingOffsetPerLayer={restingOffsetPerLayer}
                activeOffsetPerLayer={activeOffsetPerLayer}
                extrusionColor={extrusionColor}
                restingAmbientBlur={restingAmbientBlur}
                activeAmbientBlur={activeAmbientBlur}
                ambientShadowOpacity={ambientShadowOpacity}
                activeScale={activeScale}
                activeTranslateY={activeTranslateY}
                popSpringConfig={popSpringConfig}
                pastWordOpacity={pastWordOpacity}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ── ParallaxPop3D (main export) ─────────────────────────────────────────────

export const ParallaxPop3D: React.FC<ParallaxPop3DProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 110,
  fontWeight = 900,
  primaryColor = "#FFFFFF",
  position = "center",
  activeColor = "#33FF00",
  restingDepthLayers = 5,
  activeDepthLayers = 9,
  restingOffsetPerLayer = 0.8,
  activeOffsetPerLayer = 1,
  extrusionColor = "#000000",
  restingAmbientBlur = 6,
  activeAmbientBlur = 16,
  ambientShadowOpacity = 0.35,
  activeScale = 1.15,
  activeTranslateY = -8,
  popSpringConfig = POP_SPRING,
  maxWordsPerLine = 3,
  allCaps = true,
  letterSpacing = "0.05em",
  lineGap = 12,
  pastWordOpacity = 0.7,
}) => {
  const { fps } = useVideoConfig();

  // ── Position styling ──────────────────────────────────────────────────
  const maxWidth =
    position === "bottom"
      ? 1080 - CAPTION_PADDING.sidesSafe * 2
      : 1080 - CAPTION_PADDING.sides * 2;

  let positionStyles: React.CSSProperties;
  switch (position) {
    case "top":
      positionStyles = {
        position: "absolute",
        left: "50%",
        top: CAPTION_PADDING.top,
        transform: "translateX(-50%)",
      };
      break;
    case "center":
      positionStyles = {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
      break;
    case "bottom":
    default:
      positionStyles = {
        position: "absolute",
        left: "50%",
        bottom: CAPTION_PADDING.bottomSafe,
        transform: "translateX(-50%)",
      };
      break;
  }

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const startFrame = msToFrames(page.startMs, fps);
        const durationFrames = msToFrames(page.durationMs, fps);
        if (durationFrames <= 0) return null;

        return (
          <Sequence
            key={pageIndex}
            from={startFrame}
            durationInFrames={durationFrames}
          >
            <AbsoluteFill>
              <div
                style={{
                  ...positionStyles,
                  maxWidth,
                  width: "max-content",
                  textAlign: "center",
                }}
              >
                <ParallaxPop3DPage
                  page={page}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  primaryColor={primaryColor}
                  activeColor={activeColor}
                  letterSpacing={letterSpacing}
                  allCaps={allCaps}
                  maxWordsPerLine={maxWordsPerLine}
                  lineGap={lineGap}
                  restingDepthLayers={restingDepthLayers}
                  activeDepthLayers={activeDepthLayers}
                  restingOffsetPerLayer={restingOffsetPerLayer}
                  activeOffsetPerLayer={activeOffsetPerLayer}
                  extrusionColor={extrusionColor}
                  restingAmbientBlur={restingAmbientBlur}
                  activeAmbientBlur={activeAmbientBlur}
                  ambientShadowOpacity={ambientShadowOpacity}
                  activeScale={activeScale}
                  activeTranslateY={activeTranslateY}
                  popSpringConfig={popSpringConfig}
                  pastWordOpacity={pastWordOpacity}
                />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
