import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { EditorialPopProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Constants ─── */

const SHADOW = [
  "0 0 12px rgba(0,0,0,0.7)",
  "0 0 30px rgba(0,0,0,0.4)",
  "0 0 50px rgba(0,0,0,0.2)",
  "1px 2px 5px rgba(0,0,0,0.4)",
].join(", ");

/* ─── Single line renderer ─── */

const EditorialPopLine: React.FC<{
  tokens: { text: string }[];
  keywordSet: Set<string>;
  fontSize: number;
  keywordScale: number;
  textColor: string;
}> = ({ tokens, keywordSet, fontSize, keywordScale, textColor }) => {

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "baseline",
        justifyContent: "center",
        gap: "0px 14px",
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
              textShadow: SHADOW,
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

/* ─── Page with 2-line stagger ─── */

const EditorialPopPage: React.FC<{
  lines: { text: string }[][];
  lineDelayMs: number;
  keywordSet: Set<string>;
  fontSize: number;
  keywordScale: number;
  textColor: string;
}> = ({ lines, lineDelayMs, keywordSet, fontSize, keywordScale, textColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line2Visible = lines.length > 1 && frame >= msToFrames(lineDelayMs, fps);
  const slotGap = -65;
  const slotHeight = fontSize * keywordScale;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 850,
        height: slotHeight * 2 + slotGap,
      }}
    >
      {/* Slot 1 (top) — always visible */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <EditorialPopLine
          tokens={lines[0]}
          keywordSet={keywordSet}
          fontSize={fontSize}
          keywordScale={keywordScale}
          textColor={textColor}
        />
      </div>
      {/* Slot 2 (bottom) — appears after delay */}
      {line2Visible && (
        <div style={{ position: "absolute", top: slotHeight + slotGap, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <EditorialPopLine
            tokens={lines[1]}
            keywordSet={keywordSet}
            fontSize={fontSize}
            keywordScale={keywordScale}
            textColor={textColor}
          />
        </div>
      )}
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
  maxWordsPerLine = 3,
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

        // Split tokens into lines
        const lines: { text: string }[][] = [];
        for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
          lines.push(page.tokens.slice(i, i + maxWordsPerLine));
        }

        // Line 2 delay: use the first token's timing from line 2, relative to page start
        const line2DelayMs = lines.length > 1
          ? (page.tokens[maxWordsPerLine]?.fromMs ?? page.startMs) - page.startMs
          : 0;

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
                lines={lines}
                lineDelayMs={line2DelayMs}
                keywordSet={keywordSet}
                fontSize={fontSize}
                keywordScale={keywordScale}
                textColor={textColor}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
