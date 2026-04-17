import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import type { AuraProps } from "./types";
import { msToFrames, getCurrentTimeMs } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

const SHADOW = [
  "0 0 10px rgba(0,0,0,0.7)",
  "0 0 30px rgba(0,0,0,0.4)",
  "1px 2px 4px rgba(0,0,0,0.5)",
].join(", ");

/** Italic serif fonts with similar metrics for seamless cycling */
const KEYWORD_FONTS = [
  { family: FONT_FAMILIES.playfairDisplay, weight: 700, style: "italic" as const },
  { family: FONT_FAMILIES.lora, weight: 700, style: "italic" as const },
  { family: FONT_FAMILIES.dmSerifDisplay, weight: 400, style: "italic" as const },
  { family: FONT_FAMILIES.cormorantGaramond, weight: 700, style: "italic" as const },
];

/** Frames each font holds before swapping */
const CYCLE_HOLD = 5;

const AuraWord: React.FC<{
  text: string;
  fromMs: number;
  toMs: number;
  pageStartMs: number;
  isKw: boolean;
  kwIndex: number;
  fontSize: number;
  textColor: string;
  glowColor: string;
}> = ({ text, fromMs, toMs, pageStartMs, isKw, kwIndex, fontSize, textColor, glowColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordStart = msToFrames(fromMs - pageStartMs, fps);
  const localFrame = frame - wordStart;

  const currentTimeMs = getCurrentTimeMs(frame, fps) + pageStartMs;
  const isActive = currentTimeMs >= fromMs && currentTimeMs < toMs;

  // Sweep progress: light beam crosses this word
  const sweep = interpolate(localFrame, [0, 7], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const brightness = interpolate(sweep, [0, 0.4, 1], [0.2, 0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const maskPos = interpolate(sweep, [0, 1], [-50, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Keyword glow — always present once revealed, intensifies when active
  const glowBase = isKw
    ? interpolate(localFrame, [5, 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const glowStrength = isKw && isActive ? 1 : glowBase * 0.6;

  const kwGlow = glowStrength > 0
    ? [
        `0 0 16px ${glowColor}${Math.round(glowStrength * 80).toString(16).padStart(2, "0")}`,
        `0 0 35px ${glowColor}${Math.round(glowStrength * 50).toString(16).padStart(2, "0")}`,
        `0 0 60px ${glowColor}${Math.round(glowStrength * 25).toString(16).padStart(2, "0")}`,
      ].join(", ")
    : "";

  // Font cycling: keywords shuffle through serif italics while active
  const isKwActive = isKw && isActive;

  const activeElapsed = frame - msToFrames(fromMs - pageStartMs, fps);
  const fontIndex = isKwActive
    ? Math.floor(activeElapsed / CYCLE_HOLD) % KEYWORD_FONTS.length
    : 0;
  const fontPick = KEYWORD_FONTS[fontIndex];

  // Opacity pulse at each transition — dip to 0.85 then back to 1
  const cycleProgress = isKwActive
    ? (activeElapsed % CYCLE_HOLD) / CYCLE_HOLD
    : 1;
  const cyclePulse = isKwActive
    ? interpolate(cycleProgress, [0, 0.15, 1], [0.82, 1, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const fontFamily = isKwActive
    ? fontPick.family
    : isKw
      ? FONT_FAMILIES.playfairDisplay
      : FONT_FAMILIES.playfairDisplay;

  const fontWeight = isKwActive
    ? fontPick.weight
    : isKw ? 700 : 400;

  const fontStyle = isKwActive
    ? fontPick.style
    : isKw ? "italic" : "normal";

  const wordFontSize = isKw ? fontSize * 1.25 : fontSize;

  const wordStyle: React.CSSProperties = {
    fontFamily,
    fontWeight,
    fontStyle,
    fontSize: wordFontSize,
    color: isKwActive ? glowColor : textColor,
    letterSpacing: "-0.01em",
    textShadow: `${SHADOW}${kwGlow ? `, ${kwGlow}` : ""}`,
    opacity: brightness * cyclePulse,
    WebkitMaskImage: `linear-gradient(110deg, black ${maskPos - 30}%, rgba(0,0,0,0.3) ${maskPos}%, black ${maskPos + 30}%)`,
    maskImage: `linear-gradient(110deg, black ${maskPos - 30}%, rgba(0,0,0,0.3) ${maskPos}%, black ${maskPos + 30}%)`,
    whiteSpace: "nowrap",
  };

  // Keywords get a fixed-size wrapper so font cycling doesn't shift neighbors
  if (isKw) {
    return (
      <span
        style={{
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "baseline",
          // Lock size to default keyword font so layout never shifts
          width: `${text.length * wordFontSize * 0.62}px`,
          height: `${wordFontSize * 1.3}px`,
          overflow: "visible",
        }}
      >
        <span style={{ ...wordStyle, display: "inline-block" }}>{text}</span>
      </span>
    );
  }

  return (
    <span style={{ ...wordStyle, display: "inline-block" }}>{text}</span>
  );
};

const AuraPage: React.FC<{
  tokens: { text: string; fromMs: number; toMs: number }[];
  pageStartMs: number;
  keywordSet: Set<string>;
  fontSize: number;
  textColor: string;
  glowColor: string;
  maxWordsPerLine: number;
}> = ({ tokens, pageStartMs, keywordSet, fontSize, textColor, glowColor, maxWordsPerLine }) => {
  const lines: { text: string; fromMs: number; toMs: number; kwIdx: number }[][] = [];

  let kwCounter = 0;
  const enriched = tokens.map((t) => {
    const kw = isKeyword(t.text, keywordSet);
    const kwIdx = kw ? kwCounter++ : -1;
    return { ...t, kwIdx };
  });

  for (let i = 0; i < enriched.length; i += maxWordsPerLine) {
    lines.push(enriched.slice(i, i + maxWordsPerLine));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, maxWidth: 850 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", gap: 2, justifyContent: "center", alignItems: "baseline" }}>
          {line.map((token, wi) => (
            <AuraWord
              key={wi}
              text={token.text}
              fromMs={token.fromMs}
              toMs={token.toMs}
              pageStartMs={pageStartMs}
              isKw={token.kwIdx >= 0}
              kwIndex={token.kwIdx}
              fontSize={fontSize}
              textColor={textColor}
              glowColor={glowColor}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const Aura: React.FC<AuraProps> = ({
  pages,
  fontSize = 58,
  position = "bottom",
  keywords = [],
  textColor = "#FFFFFF",
  glowColor = "#D4A853",
  maxWordsPerLine = 3,
}) => {
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {pages.map((page, pi) => {
        const startFrame = msToFrames(page.startMs, fps);
        const dur = msToFrames(page.durationMs, fps);
        if (dur <= 0) return null;
        return (
          <Sequence key={pi} from={startFrame} durationInFrames={dur}>
            <AbsoluteFill style={{ display: "flex", alignItems: "center", ...positionStyle }}>
              <AuraPage
                tokens={page.tokens}
                pageStartMs={page.startMs}
                keywordSet={keywordSet}
                fontSize={fontSize}
                textColor={textColor}
                glowColor={glowColor}
                maxWordsPerLine={maxWordsPerLine}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
