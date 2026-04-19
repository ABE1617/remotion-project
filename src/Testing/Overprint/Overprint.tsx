import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { TikTokPage, TikTokToken } from "../../types/captions";
import type { OverprintProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Shared types ─── */

type LineKind = "body" | "keyword";
interface OverprintLine {
  kind: LineKind;
  tokens: TikTokToken[];
}

/* ─── Word ─── */

const OverprintWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  isKw: boolean;
  inkColor: string;
  plateColor: string;
  fontSize: number;
  registrationTravelPx: number;
  settledOffsetPx: number;
  keywordOffsetPx: number;
  lockInDurationMs: number;
  plateAngleDeg: number;
  plateDrift: boolean;
}> = ({
  token,
  pageStartMs,
  isKw,
  inkColor,
  plateColor,
  fontSize,
  registrationTravelPx,
  settledOffsetPx,
  keywordOffsetPx,
  lockInDurationMs,
  plateAngleDeg,
  plateDrift,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageLocalMs = (frame / fps) * 1000;
  const tokenLocalMs = token.fromMs - pageStartMs;

  const lockProgress = interpolate(
    pageLocalMs,
    [tokenLocalMs, tokenLocalMs + lockInDurationMs],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const eased = 1 - Math.pow(1 - lockProgress, 3);

  const inkOpacity = interpolate(
    pageLocalMs,
    [tokenLocalMs, tokenLocalMs + lockInDurationMs * 0.45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const plateOpacity = interpolate(
    pageLocalMs,
    [tokenLocalMs + lockInDurationMs * 0.1, tokenLocalMs + lockInDurationMs * 0.55],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const targetOffset = isKw ? keywordOffsetPx : settledOffsetPx;
  const currentOffset = interpolate(
    eased,
    [0, 1],
    [registrationTravelPx, targetOffset],
  );

  const rad = (plateAngleDeg * Math.PI) / 180;
  let plateX = Math.cos(rad) * currentOffset;
  let plateY = Math.sin(rad) * currentOffset;

  // Hand-pressed wobble — tiny sinusoidal drift after the plate has settled
  if (plateDrift && lockProgress >= 1) {
    const t = frame / fps;
    plateX += Math.sin(t * 2.1 + token.fromMs * 0.002) * 0.4;
    plateY += Math.cos(t * 1.7 + token.fromMs * 0.002) * 0.35;
  }

  const baseTextStyle: React.CSSProperties = {
    fontFamily: isKw ? FONT_FAMILIES.playfairDisplay : FONT_FAMILIES.dmSans,
    fontSize,
    fontWeight: isKw ? 900 : 600,
    fontStyle: isKw ? "italic" : "normal",
    letterSpacing: isKw ? "-0.02em" : "-0.01em",
    lineHeight: 0.95,
    whiteSpace: "nowrap",
    display: "block",
  };

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        color: "transparent",
        ...baseTextStyle,
      }}
    >
      {/* Layout ghost */}
      <span style={{ visibility: "hidden" }}>{token.text}</span>

      {/* Accent plate — behind ink */}
      <span
        aria-hidden
        style={{
          ...baseTextStyle,
          position: "absolute",
          top: 0,
          left: 0,
          color: plateColor,
          transform: `translate(${plateX}px, ${plateY}px)`,
          opacity: plateOpacity,
          textShadow: "0 2px 0 rgba(0,0,0,0.08)",
        }}
      >
        {token.text}
      </span>

      {/* Ink plate on top */}
      <span
        aria-hidden
        style={{
          ...baseTextStyle,
          position: "absolute",
          top: 0,
          left: 0,
          color: inkColor,
          opacity: inkOpacity,
          textShadow: "0 2px 14px rgba(0,0,0,0.35)",
        }}
      >
        {token.text}
      </span>
    </span>
  );
};

/* ─── Page ─── */

const OverprintPage: React.FC<{
  page: TikTokPage;
  lines: OverprintLine[];
  kwSet: Set<string>;
  inkColor: string;
  plateColor: string;
  bodyFontSize: number;
  keywordSizeMultiplier: number;
  registrationTravelPx: number;
  settledOffsetPx: number;
  keywordOffsetPx: number;
  lockInDurationMs: number;
  plateAngleDeg: number;
  lineGap: number;
  wordGap: number;
  positionStyle: React.CSSProperties;
  maxWidth: number;
  plateDrift: boolean;
}> = ({
  page,
  lines,
  kwSet,
  inkColor,
  plateColor,
  bodyFontSize,
  keywordSizeMultiplier,
  registrationTravelPx,
  settledOffsetPx,
  keywordOffsetPx,
  lockInDurationMs,
  plateAngleDeg,
  lineGap,
  wordGap,
  positionStyle,
  maxWidth,
  plateDrift,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pageLocalMs = (frame / fps) * 1000;

  const fadeOut = interpolate(
    pageLocalMs,
    [page.durationMs - 220, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        ...positionStyle,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: lineGap,
          maxWidth,
          width: maxWidth,
        }}
      >
        {lines.map((line, lineIdx) => {
          const isKeywordLine = line.kind === "keyword";
          const fontSize = isKeywordLine
            ? Math.round(bodyFontSize * keywordSizeMultiplier)
            : bodyFontSize;

          return (
            <div
              key={lineIdx}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: wordGap,
                maxWidth,
              }}
            >
              {line.tokens.map((token, idx) => (
                <OverprintWord
                  key={idx}
                  token={token}
                  pageStartMs={page.startMs}
                  isKw={isKeyword(token.text, kwSet)}
                  inkColor={inkColor}
                  plateColor={plateColor}
                  fontSize={fontSize}
                  registrationTravelPx={registrationTravelPx}
                  settledOffsetPx={settledOffsetPx}
                  keywordOffsetPx={keywordOffsetPx}
                  lockInDurationMs={lockInDurationMs}
                  plateAngleDeg={plateAngleDeg}
                  plateDrift={plateDrift}
                />
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─── Line builder: keywords break to their own line (pullquote) ─── */

function buildLines(
  tokens: TikTokToken[],
  kwSet: Set<string>,
  maxWordsPerLine: number,
): OverprintLine[] {
  const lines: OverprintLine[] = [];
  let bodyBuffer: TikTokToken[] = [];

  const flushBody = () => {
    if (bodyBuffer.length === 0) return;
    for (let i = 0; i < bodyBuffer.length; i += maxWordsPerLine) {
      lines.push({
        kind: "body",
        tokens: bodyBuffer.slice(i, i + maxWordsPerLine),
      });
    }
    bodyBuffer = [];
  };

  for (const tok of tokens) {
    if (isKeyword(tok.text, kwSet)) {
      flushBody();
      lines.push({ kind: "keyword", tokens: [tok] });
    } else {
      bodyBuffer.push(tok);
    }
  }
  flushBody();
  return lines;
}

/* ─── Main Component ─── */

export const Overprint: React.FC<OverprintProps> = ({
  pages,
  keywords = [],
  inkColor = "#F5F0E5",
  plateColor = "#C84B31",
  bodyFontSize = 92,
  keywordSizeMultiplier = 1.55,
  position = "bottom",
  maxWordsPerLine = 4,
  maxWidthPercent = 0.82,
  lineGap = 14,
  wordGap = 20,
  registrationTravelPx = 24,
  settledOffsetPx = 4,
  keywordOffsetPx = 11,
  lockInDurationMs = 260,
  plateAngleDeg = 28,
  plateDrift = true,
}) => {
  const { fps, width } = useVideoConfig();
  const kwSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);
  const maxWidth = width * maxWidthPercent;

  return (
    <AbsoluteFill>
      {pages.map((page, pageIndex) => {
        const startFrame = msToFrames(page.startMs, fps);
        const durationFrames = msToFrames(page.durationMs, fps);
        if (durationFrames <= 0) return null;

        const lines = buildLines(page.tokens, kwSet, maxWordsPerLine);

        return (
          <Sequence
            key={pageIndex}
            from={startFrame}
            durationInFrames={durationFrames}
            premountFor={10}
          >
            <OverprintPage
              page={page}
              lines={lines}
              kwSet={kwSet}
              inkColor={inkColor}
              plateColor={plateColor}
              bodyFontSize={bodyFontSize}
              keywordSizeMultiplier={keywordSizeMultiplier}
              registrationTravelPx={registrationTravelPx}
              settledOffsetPx={settledOffsetPx}
              keywordOffsetPx={keywordOffsetPx}
              lockInDurationMs={lockInDurationMs}
              plateAngleDeg={plateAngleDeg}
              lineGap={lineGap}
              wordGap={wordGap}
              positionStyle={positionStyle}
              maxWidth={maxWidth}
              plateDrift={plateDrift}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
