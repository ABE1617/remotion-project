import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { PulseProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Single line renderer ─── */

const PulseLine: React.FC<{
  tokens: { text: string }[];
  keywordSet: Set<string>;
  textColor: string;
  keywordColor: string;
  fontSize: number;
  opacity: number;
  dimmed: boolean;
}> = ({ tokens, keywordSet, textColor, keywordColor, fontSize, opacity, dimmed }) => {
  const dimColor = "#BBBBBB";

  return (
    <div
      style={{
        opacity,
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "center",
        gap: "0 12px",
        lineHeight: 0.4,
      }}
    >
      {tokens.map((token, idx) => {
        const isKw = isKeyword(token.text, keywordSet);
        const color = dimmed ? dimColor : isKw ? keywordColor : textColor;
        return (
          <span
            key={idx}
            style={{
              fontFamily: FONT_FAMILIES.dmSans,
              fontWeight: 700,
              fontSize: isKw ? fontSize * 1.25 : fontSize,
              color,
              textTransform: "none",
              letterSpacing: "-0.02em",
              textShadow: [
                // Diffused background shadow (all directions)
                "0 0 12px rgba(0,0,0,0.7)",
                "0 0 30px rgba(0,0,0,0.4)",
                "0 0 50px rgba(0,0,0,0.2)",
                // Existing drop shadow
                "1px 2px 5px rgba(0,0,0,0.4)",
                // Keyword glow (only for active keywords)
                ...(isKw && !dimmed
                  ? [
                      `0 0 10px ${keywordColor}80`,
                      `0 0 20px ${keywordColor}40`,
                      `0 0 40px ${keywordColor}25`,
                    ]
                  : []),
              ].join(", "),
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

export const Pulse: React.FC<PulseProps> = ({
  pages,
  fontSize = 80,
  position = "bottom",
  keywords = [],
  textColor = "#FFFFFF",
  keywordColor = "#00BFFF",
  fadeDurationFrames = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  // Find latest page that has started = active line
  let activeIdx = -1;
  for (let i = pages.length - 1; i >= 0; i--) {
    if (frame >= msToFrames(pages[i].startMs, fps)) {
      activeIdx = i;
      break;
    }
  }

  if (activeIdx < 0) return null;

  const isFirstPage = activeIdx === 0;
  const slotGap = 22;
  const slotOffset = fontSize * 0.5 + slotGap;
  const activeStart = msToFrames(pages[activeIdx].startMs, fps);
  const staggerFrames = 8;

  // --- Slot 1 (top) opacity ---
  let slot1Opacity: number;
  if (isFirstPage) {
    // First page: slot 1 IS the active line, fade in
    slot1Opacity = interpolate(
      frame,
      [activeStart, activeStart + fadeDurationFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  } else if (activeIdx === 1) {
    // Second page: slot 1 content unchanged (still page 0), stays fully visible
    slot1Opacity = 1;
  } else {
    // 3rd+ page: slot 1 content changed, fade in the new dimmed line
    slot1Opacity = interpolate(
      frame,
      [activeStart, activeStart + fadeDurationFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  }

  // --- Slot 2 (bottom) opacity ---
  let slot2Opacity = 0;
  if (!isFirstPage) {
    const delay = activeIdx >= 2 ? staggerFrames : 0;
    const appear = activeStart + delay;
    slot2Opacity = interpolate(
      frame,
      [appear, appear + fadeDurationFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  }

  // Last page fade out
  if (activeIdx === pages.length - 1) {
    const activeEnd = msToFrames(
      pages[activeIdx].startMs + pages[activeIdx].durationMs,
      fps,
    );
    const fadeOut = interpolate(
      frame,
      [activeEnd - fadeDurationFrames, activeEnd],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    if (isFirstPage) {
      slot1Opacity *= fadeOut;
    } else {
      slot2Opacity *= fadeOut;
    }
  }

  // Smooth organic float
  const t = frame / fps;
  const floatY = Math.sin(t * 1.2) * 14 + Math.sin(t * 1.8) * 7;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        ...positionStyle,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: slotOffset + fontSize * 0.5,
          transform: `translateY(${floatY.toFixed(2)}px)`,
          willChange: "transform",
        }}
      >
        {/* Slot 1 (top): first page = active, later = dimmed previous */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PulseLine
            tokens={pages[isFirstPage ? activeIdx : activeIdx - 1].tokens}
            keywordSet={keywordSet}
            textColor={textColor}
            keywordColor={keywordColor}
            fontSize={fontSize}
            opacity={slot1Opacity}
            dimmed={!isFirstPage}
          />
        </div>

        {/* Slot 2 (bottom): active line, appears after slot 1 */}
        {!isFirstPage && (
          <div
            style={{
              position: "absolute",
              top: slotOffset,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PulseLine
              tokens={pages[activeIdx].tokens}
              keywordSet={keywordSet}
              textColor={textColor}
              keywordColor={keywordColor}
              fontSize={fontSize}
              opacity={slot2Opacity}
              dimmed={false}
            />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
