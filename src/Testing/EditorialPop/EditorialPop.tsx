import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { EditorialPopProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Page renderer ─── */

const EditorialPopPage: React.FC<{
  tokens: { text: string }[];
  keywordSet: Set<string>;
  fontSize: number;
  keywordScale: number;
  textColor: string;
  durationMs: number;
  fadeDurationFrames: number;
}> = ({ tokens, keywordSet, fontSize, keywordScale, textColor, durationMs, fadeDurationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalFrames = msToFrames(durationMs, fps);

  // Fade in / out
  const fadeIn = interpolate(frame, [0, fadeDurationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [totalFrames - fadeDurationFrames, totalFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = fadeIn * fadeOut;

  // Float
  const t = frame / fps;
  const floatY = Math.sin(t * 1.2) * 14 + Math.sin(t * 1.8) * 7;

  const shadow = [
    "0 0 12px rgba(0,0,0,0.7)",
    "0 0 30px rgba(0,0,0,0.4)",
    "0 0 50px rgba(0,0,0,0.2)",
    "1px 2px 5px rgba(0,0,0,0.4)",
  ].join(", ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        justifyContent: "center",
        gap: "0px 14px",
        lineHeight: 0.75,
        opacity,
        transform: `translateY(${floatY.toFixed(2)}px)`,
        willChange: "transform",
      }}
    >
      {tokens.map((token, idx) => {
        const isKw = isKeyword(token.text, keywordSet);
        return (
          <span
            key={idx}
            style={{
              fontFamily: FONT_FAMILIES.playfairDisplay,
              fontWeight: isKw ? 700 : 400,
              fontStyle: isKw ? "italic" : "normal",
              fontSize: isKw ? fontSize * keywordScale : fontSize,
              color: textColor,
              letterSpacing: "-0.02em",
              textShadow: shadow,
              whiteSpace: "nowrap",
            }}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};

/* ─── Main component ─── */

export const EditorialPop: React.FC<EditorialPopProps> = ({
  pages,
  fontSize = 80,
  position = "bottom",
  keywords = [],
  keywordScale = 1.7,
  textColor = "#FFFFFF",
  fadeDurationFrames = 5,
}) => {
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

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
          >
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                ...positionStyle,
              }}
            >
              <EditorialPopPage
                tokens={page.tokens}
                keywordSet={keywordSet}
                fontSize={fontSize}
                keywordScale={keywordScale}
                textColor={textColor}
                durationMs={page.durationMs}
                fadeDurationFrames={fadeDurationFrames}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
