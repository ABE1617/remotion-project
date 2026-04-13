import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokPage, TikTokToken } from "../../types/captions";
import type { MonolithProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Helpers ─── */

interface WordGroup {
  tokens: TikTokToken[];
  startMs: number;
  endMs: number;
}

/**
 * Group tokens into chunks of maxWordsVisible for vertical stacking.
 * Each group gets shown as a hard-cut block.
 */
function buildWordGroups(
  page: TikTokPage,
  maxWordsVisible: number,
): WordGroup[] {
  const groups: WordGroup[] = [];
  for (let i = 0; i < page.tokens.length; i += maxWordsVisible) {
    const tokens = page.tokens.slice(i, i + maxWordsVisible);
    groups.push({
      tokens,
      startMs: tokens[0].fromMs,
      endMs: tokens[tokens.length - 1].toMs,
    });
  }
  // Each group stays visible until the next group starts
  for (let i = 0; i < groups.length - 1; i++) {
    groups[i].endMs = groups[i + 1].startMs;
  }
  if (groups.length > 0) {
    groups[groups.length - 1].endMs = page.startMs + page.durationMs;
  }
  return groups;
}

/* ─── Main Component ─── */

export const Monolith: React.FC<MonolithProps> = ({
  pages,
  fontSize = 90,
  position = "bottom",
  keywords = [],
  maxWordsVisible = 3,
  textColor = "#FFFFFF",
  keywordColor = "#E8DCC8",
  keywordScale = 1.3,
  lineHeightMultiplier = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  // Flatten all pages into word groups
  const allGroups: WordGroup[] = [];
  for (const page of pages) {
    allGroups.push(...buildWordGroups(page, maxWordsVisible));
  }

  // Find the active group at current frame
  const activeGroup = allGroups.find((group) => {
    const startFrame = msToFrames(group.startMs, fps);
    const endFrame = msToFrames(group.endMs, fps);
    return frame >= startFrame && frame < endFrame;
  });

  if (!activeGroup) return null;

  const groupStartFrame = msToFrames(activeGroup.startMs, fps);
  const groupDurationFrames =
    msToFrames(activeGroup.endMs, fps) - groupStartFrame;

  return (
    <Sequence
      premountFor={10}
      from={groupStartFrame}
      durationInFrames={groupDurationFrames}
    >
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
          }}
        >
          {activeGroup.tokens.map((token, idx) => {
            const isKw = isKeyword(token.text, keywordSet);
            const wordFontSize = isKw ? fontSize * keywordScale : fontSize;

            return (
              <span
                key={idx}
                style={{
                  display: "block",
                  fontFamily: FONT_FAMILIES.dmSerifDisplay,
                  fontWeight: 400,
                  fontSize: wordFontSize,
                  lineHeight: lineHeightMultiplier,
                  color: isKw ? keywordColor : textColor,
                  textTransform: "uppercase",
                  textAlign: "center",
                  letterSpacing: "-0.03em",
                  textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {token.text}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};
