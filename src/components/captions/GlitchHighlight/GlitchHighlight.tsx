import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SpringConfig } from "remotion";
import type { TikTokToken, TikTokPage } from "../shared/types";
import type { GlitchHighlightProps, GlitchColorPreset } from "./types";
import { GLITCH_PRESETS } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";
import { getCaptionPositionStyle } from "../../../utils/captionPosition";

function normalizeWord(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function buildOutlineShadow(sw: number, color: string): string {
  return [
    `${-sw}px ${-sw}px 0 ${color}`,
    `${sw}px ${-sw}px 0 ${color}`,
    `${-sw}px ${sw}px 0 ${color}`,
    `${sw}px ${sw}px 0 ${color}`,
    `0 ${-sw}px 0 ${color}`,
    `0 ${sw}px 0 ${color}`,
    `${-sw}px 0 0 ${color}`,
    `${sw}px 0 0 ${color}`,
  ].join(", ");
}

const SLIDE_SPRING: SpringConfig = {
  mass: 0.5,
  damping: 14,
  stiffness: 180,
  overshootClamping: false,
};

/** Normal word -- same slide-in as GradientHighlight */
const NormalWord: React.FC<{
  text: string;
  fontSize: number;
  fontFamily: string;
  letterSpacing: number;
  outlineShadow: string;
  opacity: number;
  xOffset: number;
}> = ({ text, fontSize, fontFamily, letterSpacing, outlineShadow, opacity, xOffset }) => (
  <span
    style={{
      display: "inline-block",
      fontFamily,
      fontSize,
      fontWeight: 900,
      color: "rgba(255,255,255,0.9)",
      textTransform: "none",
      letterSpacing: `${letterSpacing}em`,
      textShadow: "0 4px 8px rgba(0,0,0,0.5)",
      transform: `translateX(${xOffset}px)`,
      transformOrigin: "center center",
      opacity,
      whiteSpace: "nowrap",
      lineHeight: 1.2,
    }}
  >
    {text}
  </span>
);

/**
 * Deterministic pseudo-random per frame -- same seed+frame always gives same value.
 * Changes every frame for chaotic jitter, but renders consistently.
 */
function jitter(frame: number, seed: number): number {
  return Math.sin(frame * 127.1 + seed * 311.7) * 0.5 + 0.5; // 0-1
}

/**
 * Glitch word -- chaotic digital corruption:
 * - Per-frame random RGB split (not smooth)
 * - 6 slices with random per-frame displacement
 * - Random skew/scale warp per frame
 * - Hard flicker cuts (not smooth fades)
 * - White flash on first 2 frames
 * - Secondary glitch burst
 * - Scanline overlay
 */
const GlitchWord: React.FC<{
  text: string;
  fontSize: number;
  color: string;
  glitchProgress: number;
  localFrame: number;
  opacity: number;
  xOffset: number;
}> = ({ text, fontSize, color, glitchProgress, localFrame, opacity, xOffset }) => {
  const glitchFontSize = Math.round(fontSize * 1.8);

  // Glitch intensity: alternates between glitch and clean moments
  // Pattern: GLITCH -> clean -> GLITCH -> clean -> small glitch -> settle
  const intensity = (() => {
    if (glitchProgress < 0.15) {
      // Initial hard glitch
      return interpolate(glitchProgress, [0, 0.15], [1, 0.9], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    if (glitchProgress < 0.25) {
      // Brief clean window (word shows normal)
      return interpolate(glitchProgress, [0.15, 0.25], [0.9, 0.05], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    if (glitchProgress < 0.45) {
      // Second glitch burst
      return interpolate(glitchProgress, [0.25, 0.32, 0.45], [0.05, 0.85, 0.1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    if (glitchProgress < 0.55) {
      // Another clean window
      return interpolate(glitchProgress, [0.45, 0.55], [0.1, 0.02], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    if (glitchProgress < 0.72) {
      // Third smaller burst
      return interpolate(glitchProgress, [0.55, 0.62, 0.72], [0.02, 0.6, 0.05], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    // Final settle
    return interpolate(glitchProgress, [0.72, 1], [0.05, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  })();

  // Per-frame random values (deterministic via frame number)
  const r1 = jitter(localFrame, 1);
  const r2 = jitter(localFrame, 2);
  const r3 = jitter(localFrame, 3);
  const r4 = jitter(localFrame, 4);
  const r5 = jitter(localFrame, 5);
  const r6 = jitter(localFrame, 6);

  // RGB split: random direction + magnitude each frame
  const rgbX = intensity * (r1 - 0.5) * 30;
  const rgbY = intensity * (r2 - 0.5) * 10;

  // Random skew per frame
  const skew = intensity * (r3 - 0.5) * 20;

  // Random scaleX warp
  const scaleX = 1 + intensity * (r4 - 0.5) * 0.15;

  // Hard flicker: random cuts, not smooth
  const flickerRoll = jitter(localFrame, 7);
  const flicker = intensity > 0.05
    ? (flickerRoll > 0.7 ? 0.4 : flickerRoll > 0.3 ? 1 : 0.75)
    : 1;

  // White flash on first 2 frames
  const isWhiteFlash = localFrame >= 0 && localFrame <= 1;
  const mainColor = isWhiteFlash ? "#FFFFFF" : color;

  // Ghost opacity scales with intensity
  const ghostOpacity = intensity * 0.75;

  const sharedFont: React.CSSProperties = {
    fontFamily: FONT_FAMILIES.bebasNeue,
    fontSize: glitchFontSize,
    fontWeight: 400,
    textTransform: "none",
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
    lineHeight: 1.1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  };

  // 3 slices with per-frame random displacement
  const sliceSeeds = [r1, r2, r3];
  const sliceCount = 3;
  const slices = Array.from({ length: sliceCount }, (_, i) => {
    const sliceHeight = 100 / sliceCount;
    const top = i * sliceHeight;
    const bottom = 100 - (i + 1) * sliceHeight;
    const shift = intensity * (sliceSeeds[i] - 0.5) * 40;
    return { top, bottom: Math.max(bottom, 0), shift };
  });

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        opacity: opacity * flicker,
        transform: `translateX(${xOffset}px) scaleX(${scaleX}) skewX(${skew}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Invisible sizer */}
      <span
        style={{
          fontFamily: FONT_FAMILIES.bebasNeue,
          fontSize: glitchFontSize,
          fontWeight: 400,
          textTransform: "none",
          letterSpacing: "0.06em",
          visibility: "hidden",
          whiteSpace: "nowrap",
          lineHeight: 1.1,
        }}
      >
        {text}
      </span>

      {/* RGB ghost layers — only render when intensity is noticeable */}
      {intensity > 0.1 && (
        <>
          <span
            style={{
              ...sharedFont,
              color: "#FF0040",
              opacity: ghostOpacity,
              transform: `translate(${-rgbX}px, ${-rgbY}px)`,
              clipPath: `inset(0% 0% ${50 + r5 * 20}% 0%)`,
              mixBlendMode: "screen",
            }}
          >
            {text}
          </span>
          <span
            style={{
              ...sharedFont,
              color: "#0044FF",
              opacity: ghostOpacity,
              transform: `translate(${rgbX}px, ${rgbY}px)`,
              clipPath: `inset(${50 - r6 * 20}% 0% 0% 0%)`,
              mixBlendMode: "screen",
            }}
          >
            {text}
          </span>
        </>
      )}
      {intensity > 0.3 && (
        <span
          style={{
            ...sharedFont,
            color: "#00FF55",
            opacity: ghostOpacity * 0.35,
            transform: `translate(${rgbX * 0.4}px, ${-rgbY * 0.6}px)`,
            mixBlendMode: "screen",
          }}
        >
          {text}
        </span>
      )}

      {/* Main text: sliced during glitch, single clean layer when settled */}
      {intensity > 0.05 ? (
        slices.map((slice, i) => (
          <span
            key={i}
            style={{
              ...sharedFont,
              color: mainColor,
              textShadow: "0 4px 10px rgba(0,0,0,0.6)",
              transform: `translateX(${slice.shift}px)`,
              clipPath: `inset(${slice.top}% 0% ${slice.bottom}% 0%)`,
            }}
          >
            {text}
          </span>
        ))
      ) : (
        <span
          style={{
            ...sharedFont,
            color,
            textShadow: "0 4px 10px rgba(0,0,0,0.6)",
          }}
        >
          {text}
        </span>
      )}

      {/* Scanline overlay during glitch */}
      {intensity > 0.05 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 3px,
              rgba(0,0,0,${intensity * 0.3}) 3px,
              rgba(0,0,0,${intensity * 0.3}) 4px
            )`,
            pointerEvents: "none",
          }}
        />
      )}
    </span>
  );
};

/** Animated word wrapper */
const AnimatedWord: React.FC<{
  token: TikTokToken;
  globalIndex: number;
  pageStartMs: number;
  isGlitch: boolean;
  color: string;
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  outlineShadow: string;
  staggerDelayFrames: number;
  glitchDurationFrames: number;
}> = ({
  token,
  globalIndex,
  pageStartMs,
  isGlitch,
  color,
  fontFamily,
  fontSize,
  letterSpacing,
  outlineShadow,
  staggerDelayFrames,
  glitchDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tokenEntryFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const delayedEntry = tokenEntryFrame + globalIndex * staggerDelayFrames;
  const localFrame = frame - delayedEntry;

  // Slide-in for both types
  const slideSpring = spring({ fps, frame: localFrame, config: SLIDE_SPRING });
  const direction = globalIndex % 2 === 0 ? -1 : 1;
  const xOffset = interpolate(slideSpring, [0, 1], [35 * direction, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(slideSpring, [0, 0.25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (isGlitch) {
    // Glitch progress: 0 (full glitch) -> 1 (settled) over glitchDurationFrames
    const glitchProgress = interpolate(
      localFrame,
      [0, glitchDurationFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    return (
      <GlitchWord
        text={token.text}
        fontSize={fontSize}
        color={color}
        glitchProgress={glitchProgress}
        localFrame={localFrame}
        opacity={opacity}
        xOffset={xOffset}
      />
    );
  }

  return (
    <NormalWord
      text={token.text}
      fontSize={fontSize}
      fontFamily={fontFamily}
      letterSpacing={letterSpacing}
      outlineShadow={outlineShadow}
      opacity={opacity}
      xOffset={xOffset}
    />
  );
};

/** Page layout -- normal words inline, glitch words on own line */
const GlitchPage: React.FC<{
  page: TikTokPage;
  highlightMap: Map<string, GlitchColorPreset>;
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  outlineShadow: string;
  staggerDelayFrames: number;
  glitchDurationFrames: number;
}> = ({
  page,
  highlightMap,
  fontFamily,
  fontSize,
  letterSpacing,
  outlineShadow,
  staggerDelayFrames,
  glitchDurationFrames,
}) => {
  const groups: { tokens: TikTokToken[]; isGlitch: boolean; color: string }[] = [];
  let currentNormal: TikTokToken[] = [];

  for (const token of page.tokens) {
    const match = highlightMap.get(normalizeWord(token.text));
    if (match) {
      if (currentNormal.length > 0) {
        groups.push({ tokens: currentNormal, isGlitch: false, color: "#FFFFFF" });
        currentNormal = [];
      }
      groups.push({ tokens: [token], isGlitch: true, color: match.color });
    } else {
      currentNormal.push(token);
    }
  }
  if (currentNormal.length > 0) {
    groups.push({ tokens: currentNormal, isGlitch: false, color: "#FFFFFF" });
  }

  let globalIndex = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, maxWidth: "100%", overflow: "hidden" }}>
      {groups.map((group, groupIdx) => {
        if (group.isGlitch) {
          const token = group.tokens[0];
          const idx = globalIndex;
          globalIndex++;
          return (
            <div key={`g-${groupIdx}`} style={{ padding: "4px 0" }}>
              <AnimatedWord
                token={token}
                globalIndex={idx}
                pageStartMs={page.startMs}
                isGlitch={true}
                color={group.color}
                fontFamily={fontFamily}
                fontSize={fontSize}
                letterSpacing={letterSpacing}
                outlineShadow={outlineShadow}
                staggerDelayFrames={staggerDelayFrames}
                glitchDurationFrames={glitchDurationFrames}
              />
            </div>
          );
        }

        return (
          <div
            key={`g-${groupIdx}`}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: 0 }}
          >
            {group.tokens.map((token) => {
              const idx = globalIndex;
              globalIndex++;
              return (
                <div key={`w-${idx}`} style={{ padding: "0 8px" }}>
                  <AnimatedWord
                    token={token}
                    globalIndex={idx}
                    pageStartMs={page.startMs}
                    isGlitch={false}
                    color="#FFFFFF"
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    letterSpacing={letterSpacing}
                    outlineShadow={outlineShadow}
                    staggerDelayFrames={staggerDelayFrames}
                    glitchDurationFrames={glitchDurationFrames}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const GlitchHighlight: React.FC<GlitchHighlightProps> = ({
  pages,
  highlightWords = [],
  colorPreset = "cyan",
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 72,
  strokeColor = "#000000",
  strokeWidth = 4,
  position = "center",
  staggerDelayFrames = 1,
  letterSpacing = 0.04,
  glitchDurationFrames = 14,
}) => {
  const { fps } = useVideoConfig();

  const defaultPreset = GLITCH_PRESETS[colorPreset] ?? GLITCH_PRESETS.cyan;

  const highlightMap = useMemo(() => {
    const map = new Map<string, GlitchColorPreset>();
    for (const hw of highlightWords) {
      const preset = GLITCH_PRESETS[hw.preset ?? colorPreset] ?? defaultPreset;
      map.set(normalizeWord(hw.text), preset);
    }
    return map;
  }, [highlightWords, colorPreset, defaultPreset]);

  const outlineShadow = useMemo(
    () => buildOutlineShadow(strokeWidth, strokeColor),
    [strokeWidth, strokeColor],
  );

  const positionStyle = getCaptionPositionStyle(position as "top" | "center" | "bottom");

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
            premountFor={10}
            name={page.tokens.map((t) => t.text).join(" ")}
          >
            <AbsoluteFill
              style={{ display: "flex", alignItems: "center", ...positionStyle }}
            >
              <GlitchPage
                page={page}
                highlightMap={highlightMap}
                fontFamily={fontFamily}
                fontSize={fontSize}
                letterSpacing={letterSpacing}
                outlineShadow={outlineShadow}
                staggerDelayFrames={staggerDelayFrames}
                glitchDurationFrames={glitchDurationFrames}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
