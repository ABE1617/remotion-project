import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

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


/**
 * Deterministic pseudo-random per frame — same seed+frame always gives same value.
 */
function jitter(frame: number, seed: number): number {
  return Math.sin(frame * 127.1 + seed * 311.7) * 0.5 + 0.5;
}

/* ─── Normal Word ─── */

const NormalWord: React.FC<{
  text: string;
  fontSize: number;
  fontFamily: string;
  letterSpacing: number;
  outlineShadow: string;
  opacity: number;
  xOffset: number;
  yOffset?: number;
  scale?: number;
  isActive: boolean;
  isPast: boolean;
}> = ({ text, fontSize, fontFamily, letterSpacing, outlineShadow, opacity, xOffset, yOffset = 0, scale = 1, isActive, isPast }) => {
  const activeScale = isActive ? 1.08 : isPast ? 0.97 : 1;
  const activeColor = isActive ? "#FFFFFF" : "rgba(255,255,255,0.7)";

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight: 900,
        color: activeColor,
        textTransform: "none",
        letterSpacing: `${letterSpacing}em`,
        textShadow: outlineShadow + ", 0 4px 8px rgba(0,0,0,0.5)",
        transform: `translateY(${yOffset}px) scale(${scale * activeScale})`,
        transformOrigin: "center bottom",
        opacity,
        whiteSpace: "nowrap",
        lineHeight: 1.2,
      }}
    >
      {text}
    </span>
  );
};

/* ─── Glitch Word ─── */

const GlitchWord: React.FC<{
  text: string;
  fontSize: number;
  color: string;
  glitchProgress: number;
  localFrame: number;
  opacity: number;
  xOffset: number;
}> = ({ text, fontSize, color, glitchProgress, localFrame, opacity, xOffset }) => {
  const glitchFontSize = Math.round(fontSize * 2.2);

  // Glitch intensity: bursts with clean windows between
  const intensity = (() => {
    if (glitchProgress < 0.15) {
      return interpolate(glitchProgress, [0, 0.15], [1, 0.9], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    if (glitchProgress < 0.25) {
      return interpolate(glitchProgress, [0.15, 0.25], [0.9, 0.05], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    if (glitchProgress < 0.45) {
      return interpolate(glitchProgress, [0.25, 0.32, 0.45], [0.05, 0.85, 0.1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    if (glitchProgress < 0.55) {
      return interpolate(glitchProgress, [0.45, 0.55], [0.1, 0.02], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    if (glitchProgress < 0.72) {
      return interpolate(glitchProgress, [0.55, 0.62, 0.72], [0.02, 0.6, 0.05], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    // Final settle — residual micro-jitter
    return interpolate(glitchProgress, [0.72, 1], [0.05, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  })();

  // Residual micro-jitter after main glitch settles
  const residualJitter = glitchProgress > 0.72
    ? interpolate(glitchProgress, [0.72, 1], [0.08, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const r1 = jitter(localFrame, 1);
  const r2 = jitter(localFrame, 2);
  const r3 = jitter(localFrame, 3);
  const r4 = jitter(localFrame, 4);
  const r5 = jitter(localFrame, 5);
  const r6 = jitter(localFrame, 6);

  // RGB split
  const rgbX = intensity * (r1 - 0.5) * 35;
  const rgbY = intensity * (r2 - 0.5) * 12;

  // Skew + scaleX warp
  const skew = intensity * (r3 - 0.5) * 24;
  const scaleX = 1 + intensity * (r4 - 0.5) * 0.18;

  // Micro-jitter after settle
  const microX = residualJitter * (r1 - 0.5) * 4;
  const microY = residualJitter * (r2 - 0.5) * 2;

  // Hard flicker
  const flickerRoll = jitter(localFrame, 7);
  const flicker = intensity > 0.05
    ? (flickerRoll > 0.7 ? 0.35 : flickerRoll > 0.3 ? 1 : 0.7)
    : 1;

  // White flash on first 2 frames
  const isWhiteFlash = localFrame >= 0 && localFrame <= 1;
  const mainColor = isWhiteFlash ? "#FFFFFF" : color;

  const ghostOpacity = intensity * 0.8;

  // Neon glow bloom — pulses with intensity
  const glowSize = interpolate(intensity, [0, 0.5, 1], [8, 25, 40], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const glowOpacity = interpolate(intensity, [0, 0.3, 1], [0.3, 0.6, 0.9], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const neonGlow = `0 0 ${glowSize * 0.5}px ${color}, 0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}40`;
  const settledGlow = `0 0 8px ${color}80, 0 0 20px ${color}30`;

  const sharedFont: React.CSSProperties = {
    fontFamily: FONT_FAMILIES.bebasNeue,
    fontSize: glitchFontSize,
    fontWeight: 400,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
    lineHeight: 1.1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  };

  // 4 slices for more chaotic displacement
  const sliceCount = 4;
  const sliceSeeds = [r1, r2, r3, r4];
  const slices = Array.from({ length: sliceCount }, (_, i) => {
    const sliceHeight = 100 / sliceCount;
    const top = i * sliceHeight;
    const bottom = 100 - (i + 1) * sliceHeight;
    const shift = intensity * (sliceSeeds[i] - 0.5) * 50;
    return { top, bottom: Math.max(bottom, 0), shift };
  });

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        opacity: opacity * flicker,
        transform: `translateX(${xOffset + microX}px) translateY(${microY}px) scaleX(${scaleX}) skewX(${skew}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Invisible sizer */}
      <span
        style={{
          fontFamily: FONT_FAMILIES.bebasNeue,
          fontSize: glitchFontSize,
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          visibility: "hidden",
          whiteSpace: "nowrap",
          lineHeight: 1.1,
        }}
      >
        {text}
      </span>

      {/* Color bleed — larger, softer glow that leaks outside text */}
      <span
        style={{
          ...sharedFont,
          color: "transparent",
          textShadow: intensity > 0.05 ? neonGlow : settledGlow,
          opacity: glowOpacity,
        }}
      >
        {text}
      </span>

      {/* RGB ghost layers */}
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
            opacity: ghostOpacity * 0.4,
            transform: `translate(${rgbX * 0.4}px, ${-rgbY * 0.6}px)`,
            mixBlendMode: "screen",
          }}
        >
          {text}
        </span>
      )}

      {/* Main text: sliced during glitch, clean when settled */}
      {intensity > 0.05 ? (
        slices.map((slice, i) => (
          <span
            key={i}
            style={{
              ...sharedFont,
              color: mainColor,
              textShadow: `0 4px 10px rgba(0,0,0,0.6), ${neonGlow}`,
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
            textShadow: `0 4px 10px rgba(0,0,0,0.6), ${settledGlow}`,
          }}
        >
          {text}
        </span>
      )}

      {/* Scanline overlay — thicker, more visible */}
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
              transparent 2px,
              rgba(0,0,0,${intensity * 0.45}) 2px,
              rgba(0,0,0,${intensity * 0.45}) 4px
            )`,
            pointerEvents: "none",
          }}
        />
      )}
    </span>
  );
};

/* ─── Animated Word Wrapper ─── */

const AnimatedWord: React.FC<{
  token: TikTokToken;
  globalIndex: number;
  pageStartMs: number;
  currentTimeMs: number;
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
  currentTimeMs,
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

  const popSpring = spring({ fps, frame: localFrame, config: { mass: 0.4, damping: 12, stiffness: 220 } });

  const scale = interpolate(popSpring, [0, 1], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yOffset = interpolate(popSpring, [0, 0.5, 1], [12, -3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(popSpring, [0, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (isGlitch) {
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
        xOffset={0}
      />
    );
  }

  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
  const isPast = currentTimeMs >= token.toMs;

  return (
    <NormalWord
      text={token.text}
      fontSize={fontSize}
      fontFamily={fontFamily}
      letterSpacing={letterSpacing}
      outlineShadow={outlineShadow}
      opacity={opacity}
      xOffset={0}
      yOffset={yOffset}
      scale={scale}
      isActive={isActive}
      isPast={isPast}
    />
  );
};

/* ─── Page Layout ─── */

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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  // Screen shake — jolt the whole page when a glitch word is currently active
  const activeGlitchToken = page.tokens.find((t) => {
    const norm = normalizeWord(t.text);
    if (!highlightMap.has(norm)) return false;
    return currentTimeMs >= t.fromMs && currentTimeMs < t.fromMs + (glitchDurationFrames / fps) * 1000 * 0.5;
  });

  let shakeX = 0;
  let shakeY = 0;
  if (activeGlitchToken) {
    const glitchLocalMs = currentTimeMs - activeGlitchToken.fromMs;
    const shakeFade = interpolate(glitchLocalMs, [0, 300], [1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    shakeX = jitter(frame, 20) * 8 * shakeFade - 4 * shakeFade;
    shakeY = jitter(frame, 21) * 6 * shakeFade - 3 * shakeFade;
  }

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
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      maxWidth: "100%",
      overflow: "hidden",
      transform: `translate(${shakeX}px, ${shakeY}px)`,
    }}>
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
                currentTimeMs={currentTimeMs}
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
                    currentTimeMs={currentTimeMs}
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

/* ─── Main Component ─── */

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
