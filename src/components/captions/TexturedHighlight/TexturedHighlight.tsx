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
import type { CaptionToken, CaptionPage } from "../shared/types";
import type { TexturedHighlightProps, TexturePreset } from "./types";
import { TEXTURE_PRESETS } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";

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

/** Normal word -- slides in from left/right */
const NormalWord: React.FC<{
  text: string;
  fontSize: number;
  fontFamily: string;
  letterSpacing: number;
  outlineShadow: string;
  scale: number;
  yOffset: number;
  opacity: number;
  xOffset?: number;
}> = ({ text, fontSize, fontFamily, letterSpacing, outlineShadow, scale, yOffset, opacity, xOffset = 0 }) => (
  <span
    style={{
      display: "inline-block",
      fontFamily,
      fontSize,
      fontWeight: 900,
      color: "rgba(255,255,255,0.9)",
      textTransform: "uppercase",
      letterSpacing: `${letterSpacing}em`,
      textShadow: `${outlineShadow}, 0 4px 8px rgba(0,0,0,0.5)`,
      transform: `scale(${scale}) translate(${xOffset}px, ${yOffset}px)`,
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
 * Painted keyword -- uses a brush/marker font with gradient fill
 * clipped to the text. The font itself provides the hand-painted texture.
 */
const PaintedWord: React.FC<{
  text: string;
  fontSize: number;
  texture: TexturePreset;
  yOffset: number;
  opacity: number;
  rotation: number;
  xOffset?: number;
}> = ({
  text,
  fontSize,
  texture,
  yOffset,
  opacity,
  rotation,
  xOffset = 0,
}) => {
  const paintedFontSize = Math.round(fontSize * 1.8);
  const thickOutline = buildOutlineShadow(5, "#000000");

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
        transformOrigin: "center bottom",
        opacity,
        whiteSpace: "nowrap",
        lineHeight: 1.1,
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILIES.bebasNeue,
          fontSize: paintedFontSize,
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: texture.glowColor,
          textShadow: `${thickOutline}, 0 5px 12px rgba(0,0,0,0.7)`,
        }}
      >
        {text}
      </span>
    </span>
  );
};

const SLIDE_SPRING: SpringConfig = {
  mass: 0.5,
  damping: 14,
  stiffness: 180,
  overshootClamping: false,
};

/** Animated word -- delegates to Normal or Painted */
const AnimatedWord: React.FC<{
  token: CaptionToken;
  globalIndex: number;
  pageStartMs: number;
  isPainted: boolean;
  texture: TexturePreset;
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  outlineShadow: string;
  staggerDelayFrames: number;
}> = ({
  token,
  globalIndex,
  pageStartMs,
  isPainted,
  texture,
  fontFamily,
  fontSize,
  letterSpacing,
  outlineShadow,
  staggerDelayFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tokenEntryFrame = msToFrames(token.start - pageStartMs, fps);
  const delayedEntry = tokenEntryFrame + globalIndex * staggerDelayFrames;
  const localFrame = frame - delayedEntry;

  if (isPainted) {
    // === PAINTED WORDS: Same slide animation as normal, just different styling ===
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

    return (
      <PaintedWord
        text={token.text}
        fontSize={fontSize}
        texture={texture}
        yOffset={0}
        opacity={opacity}
        rotation={0}
        xOffset={xOffset}
      />
    );
  }

  // === NORMAL WORDS: Horizontal slide-in, alternating left/right ===
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

  return (
    <NormalWord
      text={token.text}
      fontSize={fontSize}
      fontFamily={fontFamily}
      letterSpacing={letterSpacing}
      outlineShadow={outlineShadow}
      scale={1}
      yOffset={0}
      opacity={opacity}
      xOffset={xOffset}
    />
  );
};

/** Single page -- normal words flow inline, special words get their own line */
const TexturedPage: React.FC<{
  page: CaptionPage;
  highlightMap: Map<string, TexturePreset>;
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  outlineShadow: string;
  staggerDelayFrames: number;
}> = ({
  page,
  highlightMap,
  fontFamily,
  fontSize,
  letterSpacing,
  outlineShadow,
  staggerDelayFrames,
}) => {
  // Split tokens into groups: runs of normal words, then a special word on its own
  // e.g. ["your", "mind", "is", "a", "WEAPON"] -> [normal group, special standalone]
  const groups: { tokens: CaptionToken[]; isPainted: boolean; texture: TexturePreset }[] = [];
  let currentNormal: CaptionToken[] = [];

  for (const token of page.tokens) {
    const normalized = normalizeWord(token.text);
    const match = highlightMap.get(normalized);
    if (match) {
      // Flush any accumulated normal words as a group
      if (currentNormal.length > 0) {
        groups.push({ tokens: currentNormal, isPainted: false, texture: TEXTURE_PRESETS.forest });
        currentNormal = [];
      }
      // Special word gets its own group
      groups.push({ tokens: [token], isPainted: true, texture: match });
    } else {
      currentNormal.push(token);
    }
  }
  if (currentNormal.length > 0) {
    groups.push({ tokens: currentNormal, isPainted: false, texture: TEXTURE_PRESETS.forest });
  }

  let globalIndex = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 96, maxWidth: "100%", overflow: "hidden" }}>
      {groups.map((group, groupIdx) => {
        if (group.isPainted) {
          // Special word: own line, centered
          const token = group.tokens[0];
          const idx = globalIndex;
          globalIndex++;
          return (
            <div key={`g-${groupIdx}`} style={{ padding: "4px 0" }}>
              <AnimatedWord
                token={token}
                globalIndex={idx}
                pageStartMs={page.startMs}
                isPainted={true}
                texture={group.texture}
                fontFamily={fontFamily}
                fontSize={fontSize}
                letterSpacing={letterSpacing}
                outlineShadow={outlineShadow}
                staggerDelayFrames={staggerDelayFrames}

              />
            </div>
          );
        }

        // Normal words: flow inline on one line
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
                    isPainted={false}
                    texture={TEXTURE_PRESETS.forest}
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    letterSpacing={letterSpacing}
                    outlineShadow={outlineShadow}
                    staggerDelayFrames={staggerDelayFrames}
  
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

export const TexturedHighlight: React.FC<TexturedHighlightProps> = ({
  pages,
  highlightWords = [],
  texturePreset = "forest",
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 72,
  strokeColor = "#000000",
  strokeWidth = 4,
  position = "center",
  staggerDelayFrames = 1,
  letterSpacing = 0.04,
}) => {
  const { fps } = useVideoConfig();

  const defaultTexture = TEXTURE_PRESETS[texturePreset] ?? TEXTURE_PRESETS.forest;

  const highlightMap = useMemo(() => {
    const map = new Map<string, TexturePreset>();
    for (const hw of highlightWords) {
      const tex = TEXTURE_PRESETS[hw.texture ?? texturePreset] ?? defaultTexture;
      map.set(normalizeWord(hw.text), tex);
    }
    return map;
  }, [highlightWords, texturePreset, defaultTexture]);

  const outlineShadow = useMemo(
    () => buildOutlineShadow(strokeWidth, strokeColor),
    [strokeWidth, strokeColor],
  );

  const positionStyle: React.CSSProperties =
    position === "top"
      ? { justifyContent: "flex-start", paddingTop: 160 }
      : position === "bottom"
        ? { justifyContent: "flex-end", paddingBottom: 200 }
        : { justifyContent: "center" };

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
            name={page.tokens.map((t) => t.text).join(" ")}
          >
            <AbsoluteFill
              style={{ display: "flex", alignItems: "center", padding: "0 60px", ...positionStyle }}
            >
              <TexturedPage
                page={page}
                highlightMap={highlightMap}
                fontFamily={fontFamily}
                fontSize={fontSize}
                letterSpacing={letterSpacing}
                outlineShadow={outlineShadow}
                staggerDelayFrames={staggerDelayFrames}

              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
