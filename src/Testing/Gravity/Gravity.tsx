import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import type { GravityProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

const SHADOW = [
  "0 4px 12px rgba(0,0,0,0.8)",
  "0 0 30px rgba(0,0,0,0.4)",
  "0 0 50px rgba(0,0,0,0.2)",
].join(", ");

/**
 * Gravity — words drop from above with physical weight. Critically-damped
 * spring gives a heavy, satisfying landing with minimal bounce. Keywords
 * are larger and land with a brief scale bump on impact. Like heavy metal
 * letters being placed down.
 */

const GravityWord: React.FC<{
  text: string;
  fromMs: number;
  pageStartMs: number;
  isKw: boolean;
  fontSize: number;
  textColor: string;
  index: number;
}> = ({ text, fromMs, pageStartMs, isKw, fontSize, textColor, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordStart = msToFrames(fromMs - pageStartMs, fps);
  const localFrame = Math.max(0, frame - wordStart);

  // Heavy drop — critically damped, minimal bounce
  const drop = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 18,
      mass: 1.2,
      stiffness: 120,
      overshootClamping: false,
    },
  });

  // Start far above, land at 0
  const translateY = interpolate(drop, [0, 1], [-80, 0]);

  // Opacity fades in quickly
  const opacity = interpolate(localFrame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Impact scale bump for keywords — brief 1.08x on landing
  let scale = 1;
  if (isKw && localFrame > 0) {
    const impactSpring = spring({
      frame: localFrame,
      fps,
      config: { damping: 12, mass: 0.5, stiffness: 300, overshootClamping: false },
    });
    // impactSpring overshoots to ~1.08 then settles at 1.0
    scale = 1 + (impactSpring - 1) * 0.15;
    scale = Math.max(scale, 0.98);
  }

  return (
    <span
      style={{
        fontFamily: FONT_FAMILIES.barlowCondensed || FONT_FAMILIES.oswald,
        fontWeight: isKw ? 800 : 600,
        fontSize: isKw ? fontSize * 1.25 : fontSize,
        color: textColor,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        textShadow: SHADOW,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        display: "inline-block",
        whiteSpace: "nowrap",
        lineHeight: 1.1,
      }}
    >
      {text}
    </span>
  );
};

const GravityPage: React.FC<{
  tokens: { text: string; fromMs: number }[];
  pageStartMs: number;
  keywordSet: Set<string>;
  fontSize: number;
  textColor: string;
  maxWordsPerLine: number;
}> = ({ tokens, pageStartMs, keywordSet, fontSize, textColor, maxWordsPerLine }) => {
  const lines: { text: string; fromMs: number }[][] = [];
  for (let i = 0; i < tokens.length; i += maxWordsPerLine) {
    lines.push(tokens.slice(i, i + maxWordsPerLine));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, maxWidth: 850 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {line.map((token, wi) => (
            <GravityWord
              key={wi}
              text={token.text}
              fromMs={token.fromMs}
              pageStartMs={pageStartMs}
              isKw={isKeyword(token.text, keywordSet)}
              fontSize={fontSize}
              textColor={textColor}
              index={li * maxWordsPerLine + wi}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const Gravity: React.FC<GravityProps> = ({
  pages,
  fontSize = 54,
  position = "bottom",
  keywords = [],
  textColor = "#FFFFFF",
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
              <GravityPage tokens={page.tokens} pageStartMs={page.startMs} keywordSet={keywordSet} fontSize={fontSize} textColor={textColor} maxWordsPerLine={maxWordsPerLine} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
