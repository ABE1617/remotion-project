import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import type { TrackProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

const SHADOW = [
  "0 0 10px rgba(0,0,0,0.7)",
  "0 0 30px rgba(0,0,0,0.4)",
  "1px 2px 4px rgba(0,0,0,0.5)",
].join(", ");

/**
 * Track — animated letter-spacing. Words appear with letters extremely
 * spread apart and rapidly compress to tight tracking. Keywords get
 * an animated underline that draws from left to right after settling.
 * Swiss design, typographic, clean.
 */

const TrackWord: React.FC<{
  text: string;
  fromMs: number;
  pageStartMs: number;
  isKw: boolean;
  fontSize: number;
  textColor: string;
  underlineColor: string;
}> = ({ text, fromMs, pageStartMs, isKw, fontSize, textColor, underlineColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordStart = msToFrames(fromMs - pageStartMs, fps);
  const localFrame = Math.max(0, frame - wordStart);

  // Letter-spacing: starts wide, compresses
  const trackProgress = interpolate(localFrame, [0, 12], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const letterSpacing = interpolate(trackProgress, [0, 1], [0.5, 0.02]);

  // Opacity
  const opacity = interpolate(localFrame, [0, 6], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Underline for keywords: draws in after word settles
  const underlineWidth = isKw
    ? interpolate(localFrame, [10, 20], [0, 100], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: FONT_FAMILIES.inter,
        fontWeight: isKw ? 700 : 500,
        fontSize: isKw ? fontSize * 1.1 : fontSize,
        color: textColor,
        textTransform: "uppercase",
        letterSpacing: `${letterSpacing}em`,
        textShadow: SHADOW,
        opacity,
        whiteSpace: "nowrap",
      }}
    >
      {text}
      {underlineWidth > 0 && (
        <span
          style={{
            position: "absolute",
            bottom: -4,
            left: 0,
            width: `${underlineWidth}%`,
            height: 2,
            backgroundColor: underlineColor,
            borderRadius: 1,
          }}
        />
      )}
    </span>
  );
};

const TrackPage: React.FC<{
  tokens: { text: string; fromMs: number }[];
  pageStartMs: number;
  keywordSet: Set<string>;
  fontSize: number;
  textColor: string;
  underlineColor: string;
  maxWordsPerLine: number;
}> = ({ tokens, pageStartMs, keywordSet, fontSize, textColor, underlineColor, maxWordsPerLine }) => {
  const lines: { text: string; fromMs: number }[][] = [];
  for (let i = 0; i < tokens.length; i += maxWordsPerLine) {
    lines.push(tokens.slice(i, i + maxWordsPerLine));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, maxWidth: 850 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", gap: 18, justifyContent: "center" }}>
          {line.map((token, wi) => (
            <TrackWord
              key={wi}
              text={token.text}
              fromMs={token.fromMs}
              pageStartMs={pageStartMs}
              isKw={isKeyword(token.text, keywordSet)}
              fontSize={fontSize}
              textColor={textColor}
              underlineColor={underlineColor}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const Track: React.FC<TrackProps> = ({
  pages,
  fontSize = 48,
  position = "bottom",
  keywords = [],
  textColor = "#FFFFFF",
  underlineColor = "rgba(255,255,255,0.6)",
  maxWordsPerLine = 2,
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
              <TrackPage tokens={page.tokens} pageStartMs={page.startMs} keywordSet={keywordSet} fontSize={fontSize} textColor={textColor} underlineColor={underlineColor} maxWordsPerLine={maxWordsPerLine} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
