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
import type { ParallaxPop3DProps, SizedWord } from "./types";
import { SIZE_PRESETS } from "./types";
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
  sizedScale: number;
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
  sizedScale,
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

  // ── Entrance spring ─────────────────────────────────────────────────
  const entranceFrame = Math.round((tokenStartMs / 1000) * fps);
  const entranceSpring = hasAppeared
    ? spring({ fps, frame: frame - entranceFrame, config: { mass: 0.4, damping: 14, stiffness: 200 } })
    : 0;
  const entranceOpacity = entranceSpring;
  const entranceTranslateY = interpolate(entranceSpring, [0, 1], [12, 0], { extrapolateRight: "clamp" });

  // ── Pop spring (active word) ───────────────────────────────────────
  const popFrame = Math.round((tokenStartMs / 1000) * fps);
  const popSpring = isActive
    ? spring({ fps, frame: frame - popFrame, config: popSpringConfig })
    : 0;
  const dePopSpring = isPast
    ? spring({ fps, frame: frame - Math.round((tokenEndMs / 1000) * fps), config: { mass: 0.4, damping: 16, stiffness: 180 } })
    : 0;
  const effectivePopAmount = popSpring - dePopSpring;

  const currentLayers = Math.round(lerp(restingDepthLayers, activeDepthLayers, clamp(effectivePopAmount, 0, 1)));
  const currentOffset = lerp(restingOffsetPerLayer, activeOffsetPerLayer, clamp(effectivePopAmount, 0, 1));
  const currentAmbientBlur = lerp(restingAmbientBlur, activeAmbientBlur, clamp(effectivePopAmount, 0, 1));
  const currentScale = lerp(1, activeScale, clamp(effectivePopAmount, 0, 1));
  const currentTranslateY = lerp(0, activeTranslateY, clamp(effectivePopAmount, 0, 1));

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

  const wordOpacity = isPast ? entranceOpacity * pastWordOpacity : entranceOpacity;

  // ── Combined transforms ───────────────────────────────────────────────
  const totalTranslateY = entranceTranslateY + currentTranslateY;

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize: fontSize * sizedScale,
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
  sizedWords: SizedWord[];
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
  sizedWords,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page-local time for fade-out
  const pageLocalMs = (frame / fps) * 1000;

  const exitOpacity = interpolate(
    pageLocalMs,
    [page.durationMs - 150, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
          {lineTokens.map((token, tokenIdx) => {
            const sizedMatch = sizedWords.find(
              (sw) => sw.word.toLowerCase() === token.text.toLowerCase(),
            );
            const resolvedScale = sizedMatch
              ? typeof sizedMatch.scale === "string"
                ? SIZE_PRESETS[sizedMatch.scale]
                : sizedMatch.scale
              : 1;
            return (
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
                sizedScale={resolvedScale}
              />
            </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── ParallaxPop3D (main export) ─────────────────────────────────────────────

export const ParallaxPop3D: React.FC<ParallaxPop3DProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 95,
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
  sizedWords = [],
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
                  sizedWords={sizedWords}
                />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
