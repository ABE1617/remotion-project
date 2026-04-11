import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "../../types/captions";
import type { RunawayProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

/** Seeded pseudo-random so rotations are deterministic per page index */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/** Build a list of sentences (one per page) with random rotation */
function buildSentenceList(
  pages: TikTokPage[],
  maxRotation: number,
) {
  return pages.map((page, idx) => {
    const rot = seededRandom(idx) * maxRotation * 2 - maxRotation;
    return {
      text: page.text,
      fromMs: page.startMs,
      toMs: page.startMs + page.durationMs,
      rotation: Math.round(rot * 10) / 10,
    };
  });
}

export const Runaway: React.FC<RunawayProps> = ({
  pages,
  fontFamily = "Helvetica, Arial, sans-serif",
  fontSize = 80,
  fontWeight = 700,
  position = "center",
  maxVisibleWords = 3,
  boxPaddingX = 24,
  boxPaddingY = 14,
  stackGap = 10,
  maxRotation = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  const sentences = useMemo(
    () => buildSentenceList(pages, maxRotation),
    [pages, maxRotation],
  );

  // Show the current sentence (page)
  const visibleSentence = useMemo(() => {
    for (let i = sentences.length - 1; i >= 0; i--) {
      if (currentTimeMs >= sentences[i].fromMs && currentTimeMs < sentences[i].toMs) {
        return sentences[i];
      }
    }
    return null;
  }, [sentences, currentTimeMs]);

  const positionStyle = getCaptionPositionStyle(position);

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: stackGap,
        }}
      >
        {visibleSentence && (
          <div
            key={`${visibleSentence.fromMs}-${visibleSentence.text}`}
            style={{
              display: "inline-block",
              backgroundColor: "#000000",
              padding: `${boxPaddingY}px ${boxPaddingX}px`,
              transform: `rotate(${visibleSentence.rotation}deg)`,
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize,
                fontWeight,
                color: "#FFFFFF",
                textTransform: "none",
                lineHeight: 1,
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {visibleSentence.text}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
