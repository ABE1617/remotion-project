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

  // Group pages into pairs — no text ever repeats across screens
  const pairIdx = Math.floor(activeIdx / 2);
  const isFirstInPair = activeIdx % 2 === 0;
  const slot1PageIdx = pairIdx * 2;
  const slot2PageIdx = pairIdx * 2 + 1;
  const hasSlot2 = !isFirstInPair && slot2PageIdx < pages.length;

  const slotGap = 22;
  const slotOffset = fontSize * 0.5 + slotGap;
  const activeStart = msToFrames(pages[activeIdx].startMs, fps);

  // --- Slot 1 (top) opacity ---
  const slot1Start = msToFrames(pages[slot1PageIdx].startMs, fps);
  let slot1Opacity = interpolate(
    frame,
    [slot1Start, slot1Start + fadeDurationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // --- Slot 2 (bottom) opacity ---
  let slot2Opacity = 0;
  if (hasSlot2) {
    slot2Opacity = interpolate(
      frame,
      [activeStart, activeStart + fadeDurationFrames],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  }

  // Last page fade out
  const lastVisibleIdx = hasSlot2 ? slot2PageIdx : slot1PageIdx;
  if (lastVisibleIdx === pages.length - 1) {
    const activeEnd = msToFrames(
      pages[lastVisibleIdx].startMs + pages[lastVisibleIdx].durationMs,
      fps,
    );
    const fadeOut = interpolate(
      frame,
      [activeEnd - fadeDurationFrames, activeEnd],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    if (hasSlot2) {
      slot2Opacity *= fadeOut;
    } else {
      slot1Opacity *= fadeOut;
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
        {/* Slot 1 (top): first page of the pair */}
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
            tokens={pages[slot1PageIdx].tokens}
            keywordSet={keywordSet}
            textColor={textColor}
            keywordColor={keywordColor}
            fontSize={fontSize}
            opacity={slot1Opacity}
            dimmed={hasSlot2}
          />
        </div>

        {/* Slot 2 (bottom): second page of the pair */}
        {hasSlot2 && (
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
              tokens={pages[slot2PageIdx].tokens}
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
