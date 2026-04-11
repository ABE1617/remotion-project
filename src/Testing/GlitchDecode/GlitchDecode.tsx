import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { GlitchDecodeProps, GlitchDecodeColorScheme } from "./types";
import { GLITCH_DECODE_SCHEMES, SCRAMBLE_CHARS } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { CAPTION_PADDING } from "../../utils/captionPosition";

// ── Helper: Deterministic PRNG ──────────────────────────────────────────────
// Sin-hash produces a deterministic 0-1 value for any (frame, charIndex, seed)
// triple, ensuring identical output across Remotion render passes.

function deterministicRandom(
  frame: number,
  charIndex: number,
  seed: number,
): number {
  const val =
    Math.sin(frame * 127.1 + charIndex * 311.7 + seed * 543.31) * 43758.5453;
  return val - Math.floor(val);
}

// ── Helper: Get scrambled character ─────────────────────────────────────────
// Returns the character to display at a given frame and the decode state.
// Characters resolve LEFT-TO-RIGHT: each char has its own resolve frame
// computed as scrambleDurationFrames + charIndex * charStaggerFrames.
// In the last 2 frames before resolve, there's a 50% chance to flash the
// correct character, creating a satisfying "settling" effect.

interface ScrambleResult {
  char: string;
  isResolved: boolean;
  decodeProgress: number;
}

function getScrambledChar(
  localFrame: number,
  charIndex: number,
  correctChar: string,
  charPool: string,
  scrambleDurationFrames: number,
  charStaggerFrames: number,
): ScrambleResult {
  const resolveFrame = scrambleDurationFrames + charIndex * charStaggerFrames;

  // Already resolved
  if (localFrame >= resolveFrame) {
    return { char: correctChar, isResolved: true, decodeProgress: 1 };
  }

  // Word hasn't started decoding yet
  if (localFrame < 0) {
    return { char: "\u2588", isResolved: false, decodeProgress: 0 };
  }

  // Compute decode progress (0 -> 1) for this character
  const decodeProgress = Math.max(0, Math.min(localFrame / resolveFrame, 1));

  // In last 2 frames before resolve, 50% chance to flash correct char
  if (resolveFrame - localFrame <= 2) {
    const flashRandom = deterministicRandom(localFrame, charIndex, 999);
    if (flashRandom > 0.5) {
      return { char: correctChar, isResolved: false, decodeProgress };
    }
  }

  // Pick a random char from pool
  const rand = deterministicRandom(localFrame, charIndex, 0);
  const poolIndex = Math.floor(rand * charPool.length);
  return { char: charPool[poolIndex], isResolved: false, decodeProgress };
}

// ── DecodeChar ──────────────────────────────────────────────────────────────
// Renders a single character with fixed monospace width ("1ch").
// During decode: displays RGB-split ghost spans behind the main character
// using mixBlendMode: "screen" for chromatic aberration effect.
// The split offset and opacity fade as the character approaches resolution.

const DecodeChar: React.FC<{
  char: string;
  isResolved: boolean;
  decodeProgress: number;
  rgbRedColor: string;
  rgbBlueColor: string;
  rgbSplitOffset: number;
}> = ({ char, isResolved, decodeProgress, rgbRedColor, rgbBlueColor, rgbSplitOffset }) => {
  const splitOffset = rgbSplitOffset * (1 - decodeProgress);
  const splitOpacity = interpolate(decodeProgress, [0, 0.8, 1], [0.5, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        width: "1ch",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* RGB split ghosts — only during decode */}
      {!isResolved && (
        <>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              color: rgbRedColor,
              transform: `translateX(-${splitOffset}px)`,
              opacity: splitOpacity,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          >
            {char}
          </span>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              color: rgbBlueColor,
              transform: `translateX(${splitOffset}px)`,
              opacity: splitOpacity,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          >
            {char}
          </span>
        </>
      )}
      {/* Main character on top */}
      <span style={{ position: "relative" }}>{char}</span>
    </span>
  );
};

// ── DecodeWord ──────────────────────────────────────────────────────────────
// Renders all characters of a word token. Computes a local frame offset
// relative to when the word starts being spoken, then maps each character
// through the scramble/resolve pipeline.

const DecodeWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  tokenIndex: number;
  scheme: GlitchDecodeColorScheme;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  allCaps: boolean;
  charStaggerFrames: number;
  scrambleDurationFrames: number;
  rgbSplitOffset: number;
  showPlaceholders: boolean;
  charPool: string;
}> = ({
  token,
  pageStartMs,
  tokenIndex,
  scheme,
  fontFamily,
  fontSize,
  fontWeight,
  allCaps,
  charStaggerFrames,
  scrambleDurationFrames,
  rgbSplitOffset,
  showPlaceholders,
  charPool,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const displayText = allCaps ? token.text.toUpperCase() : token.text;
  const entryFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const localFrame = frame - entryFrame;

  // Word hasn't started yet — show placeholder blocks
  if (localFrame < 0) {
    if (!showPlaceholders) return null;

    return (
      <span
        style={{
          display: "inline-flex",
          fontFamily,
          fontSize,
          fontWeight,
          color: scheme.placeholderColor,
          opacity: 0.3,
          lineHeight: 1.3,
        }}
      >
        {displayText.split("").map((_, idx) => (
          <span
            key={idx}
            style={{
              display: "inline-block",
              width: "1ch",
              textAlign: "center",
            }}
          >
            {"\u2588"}
          </span>
        ))}
      </span>
    );
  }

  // Word entrance: spring-driven opacity
  const entranceOpacity = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.4, damping: 12, stiffness: 200 },
  });

  return (
    <span
      style={{
        display: "inline-flex",
        fontFamily,
        fontSize,
        fontWeight,
        color: scheme.textColor,
        lineHeight: 1.3,
        opacity: entranceOpacity,
        willChange: "opacity",
      }}
    >
      {displayText.split("").map((correctChar, charIdx) => {
        const result = getScrambledChar(
          localFrame,
          charIdx,
          correctChar,
          charPool,
          scrambleDurationFrames,
          charStaggerFrames,
        );

        return (
          <DecodeChar
            key={charIdx}
            char={result.char}
            isResolved={result.isResolved}
            decodeProgress={result.decodeProgress}
            rgbRedColor={scheme.rgbRedColor}
            rgbBlueColor={scheme.rgbBlueColor}
            rgbSplitOffset={rgbSplitOffset}
          />
        );
      })}
    </span>
  );
};

// ── DecodePage ──────────────────────────────────────────────────────────────
// Lays out tokens into lines, adds optional scanline overlay, and handles
// page exit fade.

const DecodePage: React.FC<{
  page: TikTokPage;
  scheme: GlitchDecodeColorScheme;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  allCaps: boolean;
  maxWordsPerLine: number;
  charStaggerFrames: number;
  scrambleDurationFrames: number;
  rgbSplitOffset: number;
  showPlaceholders: boolean;
  enableScanlines: boolean;
  charPool: string;
}> = ({
  page,
  scheme,
  fontFamily,
  fontSize,
  fontWeight,
  allCaps,
  maxWordsPerLine,
  charStaggerFrames,
  scrambleDurationFrames,
  rgbSplitOffset,
  showPlaceholders,
  enableScanlines,
  charPool,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page-local time for exit fade
  const pageLocalMs = (frame / fps) * 1000;

  // Page exit fade (last 120ms)
  const exitDurationMs = 120;
  const exitStartMs = page.durationMs - exitDurationMs;
  const exitOpacity = interpolate(
    pageLocalMs,
    [exitStartMs, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Split tokens into lines
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
        gap: 10,
        width: "100%",
        opacity: exitOpacity,
        position: "relative",
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
            const globalTokenIdx = lineIdx * maxWordsPerLine + tokenIdx;
            return (
              <div
                key={`${lineIdx}-${tokenIdx}`}
                style={{ padding: "0 10px" }}
              >
                <DecodeWord
                  token={token}
                  pageStartMs={page.startMs}
                  tokenIndex={globalTokenIdx}
                  scheme={scheme}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  allCaps={allCaps}
                  charStaggerFrames={charStaggerFrames}
                  scrambleDurationFrames={scrambleDurationFrames}
                  rgbSplitOffset={rgbSplitOffset}
                  showPlaceholders={showPlaceholders}
                  charPool={charPool}
                />
              </div>
            );
          })}
        </div>
      ))}

      {/* Scanline overlay */}
      {enableScanlines && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

// ── GlitchDecode (main export) ──────────────────────────────────────────────
// Monospace terminal-style captions where characters scramble through random
// symbols before resolving left-to-right. RGB chromatic aberration during
// decode phase. Gaming/tech creator aesthetic.

export const GlitchDecode: React.FC<GlitchDecodeProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.spaceMono,
  fontSize = 52,
  fontWeight = 700,
  position = "center",
  scheme = "terminal",
  charStaggerFrames = 2,
  scrambleDurationFrames = 6,
  rgbSplitOffset = 3,
  showPlaceholders = true,
  enableScanlines = true,
  maxWordsPerLine = 3,
  charPool = SCRAMBLE_CHARS,
  allCaps = true,
}) => {
  const { fps } = useVideoConfig();

  // Resolve color scheme
  const colorScheme: GlitchDecodeColorScheme =
    GLITCH_DECODE_SCHEMES[scheme] ?? GLITCH_DECODE_SCHEMES.terminal;

  // Position styling
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
                <DecodePage
                  page={page}
                  scheme={colorScheme}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  allCaps={allCaps}
                  maxWordsPerLine={maxWordsPerLine}
                  charStaggerFrames={charStaggerFrames}
                  scrambleDurationFrames={scrambleDurationFrames}
                  rgbSplitOffset={rgbSplitOffset}
                  showPlaceholders={showPlaceholders}
                  enableScanlines={enableScanlines}
                  charPool={charPool}
                />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
