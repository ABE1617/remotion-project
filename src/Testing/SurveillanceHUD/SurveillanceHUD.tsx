import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { SurveillanceHUDProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

// ── Helpers ────────────────────────────────────────────────────────────────

const DECODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%$&*<>?/\\";

function seededRand(a: number, b: number): number {
  return Math.abs(Math.sin(a * 127.1 + b * 311.7) * 43758.5453) % 1;
}

function getScrambleChar(frame: number, charIndex: number, wordSeed: number): string {
  const idx = Math.floor(seededRand(frame * 3 + charIndex * 7, wordSeed * 11) * DECODE_CHARSET.length);
  return DECODE_CHARSET[idx];
}

function splitIntoLines(
  tokens: TikTokToken[],
  maxPerLine: number,
): TikTokToken[][] {
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < tokens.length; i += maxPerLine) {
    lines.push(tokens.slice(i, i + maxPerLine));
  }
  return lines;
}

// ── HUD decorators ─────────────────────────────────────────────────────────
//
// Corner brackets frame the caption block like a targeting reticle.
// A scan line sweeps repeatedly across the block.

const CornerBrackets: React.FC<{ color: string }> = ({ color }) => {
  const SIZE = 18;
  const THICKNESS = 2;

  const corner = (style: React.CSSProperties) => (
    <div style={{ position: "absolute", width: SIZE, height: SIZE, ...style }} />
  );

  return (
    <>
      {/* Top-left */}
      {corner({
        top: -8, left: -8,
        borderTop: `${THICKNESS}px solid ${color}`,
        borderLeft: `${THICKNESS}px solid ${color}`,
      })}
      {/* Top-right */}
      {corner({
        top: -8, right: -8,
        borderTop: `${THICKNESS}px solid ${color}`,
        borderRight: `${THICKNESS}px solid ${color}`,
      })}
      {/* Bottom-left */}
      {corner({
        bottom: -8, left: -8,
        borderBottom: `${THICKNESS}px solid ${color}`,
        borderLeft: `${THICKNESS}px solid ${color}`,
      })}
      {/* Bottom-right */}
      {corner({
        bottom: -8, right: -8,
        borderBottom: `${THICKNESS}px solid ${color}`,
        borderRight: `${THICKNESS}px solid ${color}`,
      })}
    </>
  );
};

const ScanLine: React.FC<{ color: string; periodFrames: number }> = ({
  color,
  periodFrames,
}) => {
  const frame = useCurrentFrame();
  const progress = (frame % periodFrames) / periodFrames;
  const topPercent = progress * 100;

  return (
    <div
      style={{
        position: "absolute",
        top: `${topPercent}%`,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(to right, transparent 0%, ${color} 30%, ${color} 70%, transparent 100%)`,
        opacity: 0.35,
        pointerEvents: "none",
      }}
    />
  );
};

// ── SurveillanceWord ───────────────────────────────────────────────────────
//
// All words in the current page are visible immediately in a dim, scrambled
// "unresolved data" state. When a word's fromMs arrives:
//   1. Brightness snaps up (spring)
//   2. Characters decode left-to-right over `decodeFrames` frames
// Past words stay bright but dimmer — logged, confirmed data.

const SurveillanceWord: React.FC<{
  token: TikTokToken;
  tokenIndex: number;
  pageStartFrame: number;
  currentTimeMs: number;
  activeColor: string;
  pastColor: string;
  idleColor: string;
  decodeFrames: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
}> = ({
  token,
  tokenIndex,
  pageStartFrame,
  currentTimeMs,
  activeColor,
  pastColor,
  idleColor,
  decodeFrames,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
  const isPast = currentTimeMs >= token.toMs;

  const wordOnsetFrame = msToFrames(token.fromMs, fps) - pageStartFrame;
  const framesSinceOnset = frame - wordOnsetFrame;

  // ── Brightness spring (dim idle → bright active) ───────────────────────
  const brightnessSpring = spring({
    fps,
    frame: framesSinceOnset,
    config: { mass: 0.25, damping: 10, stiffness: 380, overshootClamping: true },
  });

  const opacity = isPast
    ? 0.6
    : isActive
      ? interpolate(brightnessSpring, [0, 1], [0.18, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0.18; // upcoming: dim/scrambled

  const textColor = isPast ? pastColor : isActive ? activeColor : idleColor;

  // ── Character decode ───────────────────────────────────────────────────
  const rawText = allCaps ? token.text.toUpperCase() : token.text;
  const wordSeed = tokenIndex * 13 + token.text.charCodeAt(0);

  // Progress 0→1 over decodeFrames after word onset
  const decodeProgress =
    framesSinceOnset >= 0
      ? Math.min(framesSinceOnset / decodeFrames, 1)
      : 0;

  const lockedCount = Math.floor(decodeProgress * rawText.length);

  const renderedChars = rawText.split("").map((realChar, ci) => {
    // Spaces always shown as-is
    if (realChar === " ") return " ";

    if (isPast || ci < lockedCount) {
      // Locked in — show real character
      return realChar;
    }
    // Upcoming or actively scrambling — show random char
    return getScrambleChar(frame, ci, wordSeed);
  });

  // Active word gets a text-shadow glow
  const textShadow = isActive
    ? `0 0 8px ${activeColor}CC, 0 0 20px ${activeColor}66`
    : undefined;

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        fontFamily,
        fontSize,
        fontWeight,
        color: textColor,
        letterSpacing: `${letterSpacing}em`,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        textShadow,
        willChange: "opacity, color",
      }}
    >
      {renderedChars.join("")}
    </span>
  );
};

// ── SurveillancePage ───────────────────────────────────────────────────────

const SurveillancePage: React.FC<{
  page: TikTokPage;
  pageStartFrame: number;
  activeColor: string;
  pastColor: string;
  idleColor: string;
  decodeFrames: number;
  showBrackets: boolean;
  showScanLine: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
  maxWordsPerLine: number;
  lineGap: number;
  wordGap: number;
}> = ({
  page,
  pageStartFrame,
  activeColor,
  pastColor,
  idleColor,
  decodeFrames,
  showBrackets,
  showScanLine,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
  maxWordsPerLine,
  lineGap,
  wordGap,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  const lines = useMemo(
    () => splitIntoLines(page.tokens, maxWordsPerLine),
    [page.tokens, maxWordsPerLine],
  );

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
        padding: "12px 16px",
      }}
    >
      {showBrackets && <CornerBrackets color={activeColor} />}
      {showScanLine && <ScanLine color={activeColor} periodFrames={40} />}

      {lines.map((lineTokens, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "nowrap",
            gap: wordGap,
          }}
        >
          {lineTokens.map((token, ti) => {
            const tokenIndex = li * maxWordsPerLine + ti;
            return (
              <SurveillanceWord
                key={`${li}-${ti}`}
                token={token}
                tokenIndex={tokenIndex}
                pageStartFrame={pageStartFrame}
                currentTimeMs={currentTimeMs}
                activeColor={activeColor}
                pastColor={pastColor}
                idleColor={idleColor}
                decodeFrames={decodeFrames}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── SurveillanceHUD (main export) ─────────────────────────────────────────

export const SurveillanceHUD: React.FC<SurveillanceHUDProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.spaceMono,
  fontSize = 64,
  fontWeight = 700,
  position = "center",
  activeColor = "#00FF41",
  pastColor = "#00B830",
  idleColor = "#004D12",
  decodeFrames = 10,
  showBrackets = true,
  showScanLine = true,
  letterSpacing = 0.06,
  allCaps = true,
  maxWordsPerLine = 3,
  lineGap = 14,
  wordGap = 20,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const pageStartFrame = msToFrames(page.startMs, fps);
        const pageDurationFrames = msToFrames(page.durationMs, fps);

        return (
          <Sequence
            key={pageIndex}
            from={pageStartFrame}
            durationInFrames={Math.max(pageDurationFrames, 1)}
            premountFor={5}
          >
            <AbsoluteFill
              style={{
                ...getCaptionPositionStyle(position),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <SurveillancePage
                page={page}
                pageStartFrame={pageStartFrame}
                activeColor={activeColor}
                pastColor={pastColor}
                idleColor={idleColor}
                decodeFrames={decodeFrames}
                showBrackets={showBrackets}
                showScanLine={showScanLine}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                allCaps={allCaps}
                maxWordsPerLine={maxWordsPerLine}
                lineGap={lineGap}
                wordGap={wordGap}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
