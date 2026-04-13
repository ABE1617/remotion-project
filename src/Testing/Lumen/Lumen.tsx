import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { LightLeak } from "@remotion/light-leaks";
import type { TikTokPage, TikTokToken } from "../../types/captions";
import type { LumenProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Word Component ─── */

const LumenWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  fontSize: number;
  isKw: boolean;
  textColor: string;
  keywordColor: string;
  sweepDuration: number;
}> = ({
  token,
  pageStartMs,
  fontSize,
  isKw,
  textColor,
  keywordColor,
  sweepDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activateFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const elapsed = frame - activateFrame;
  const hasAppeared = elapsed >= 0;

  const entranceSpring = hasAppeared
    ? spring({ fps, frame: elapsed, config: { damping: 200 } })
    : 0;

  // Scale: 0.95 -> 1
  const scale = interpolate(entranceSpring, [0, 1], [0.95, 1], {
    extrapolateRight: "clamp",
  });

  // Lens flare sweep position for keywords
  const sweepPosition = isKw && hasAppeared
    ? interpolate(elapsed, [0, sweepDuration], [-100, 200], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : -100;

  const wordFontSize = isKw ? fontSize * 1.35 : fontSize;
  const color = isKw ? keywordColor : textColor;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
        fontFamily: isKw
          ? FONT_FAMILIES.playfairDisplay
          : FONT_FAMILIES.montserrat,
        fontWeight: isKw ? 400 : 600,
        fontStyle: isKw ? "italic" : "normal",
        fontSize: wordFontSize,
        lineHeight: 1.1,
        color: hasAppeared ? color : "transparent",
        opacity: entranceSpring,
        transform: `scale(${scale})`,
        transformOrigin: "center bottom",
        textShadow: hasAppeared
          ? isKw
            ? "0 0 20px rgba(212,162,76,0.5), 0 0 40px rgba(212,162,76,0.3), 0 2px 8px rgba(0,0,0,0.4)"
            : "0 2px 10px rgba(0,0,0,0.5)"
          : "none",
        whiteSpace: "nowrap",
        letterSpacing: isKw ? "-0.02em" : "0.01em",
      }}
    >
      {token.text}
      {/* Gradient sweep (lens flare) for keywords */}
      {isKw && hasAppeared && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sweepPosition}%`,
            width: "40%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </span>
  );
};

/* ─── Light Leak Timing ─── */

/**
 * Find frames where keywords appear so we can time light leaks.
 * Returns the first keyword hit per page.
 */
function findKeywordHits(
  pages: TikTokPage[],
  keywordSet: Set<string>,
  fps: number,
): { startFrame: number; durationFrames: number }[] {
  const hits: { startFrame: number; durationFrames: number }[] = [];
  for (const page of pages) {
    const firstKw = page.tokens.find((t) => isKeyword(t.text, keywordSet));
    if (firstKw) {
      const startFrame = msToFrames(firstKw.fromMs, fps) - 5; // Start slightly before
      hits.push({ startFrame: Math.max(0, startFrame), durationFrames: 30 });
    }
  }
  return hits;
}

/* ─── Main Component ─── */

export const Lumen: React.FC<LumenProps> = ({
  pages,
  fontSize = 70,
  position = "bottom",
  keywords = [],
  maxWordsPerLine = 4,
  lineGap = 14,
  wordGap = 14,
  textColor = "#FFFFFF",
  keywordColor = "#D4A24C",
  showLightLeak = true,
  lightLeakHueShift = 40,
  sweepDuration = 15,
}) => {
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  const keywordHits = useMemo(
    () => findKeywordHits(pages, keywordSet, fps),
    [pages, keywordSet, fps],
  );

  return (
    <AbsoluteFill>
      {/* Light leak overlays timed to keyword hits */}
      {showLightLeak &&
        keywordHits.map((hit, idx) => (
          <Sequence
            key={`leak-${idx}`}
            from={hit.startFrame}
            durationInFrames={hit.durationFrames}
          >
            <LightLeak
              seed={idx}
              hueShift={lightLeakHueShift}
              style={{ opacity: 0.15 }}
            />
          </Sequence>
        ))}

      {/* Caption text */}
      {pages.map((page, pageIndex) => {
        const startFrame = msToFrames(page.startMs, fps);
        const durationFrames = msToFrames(page.durationMs, fps);
        if (durationFrames <= 0) return null;

        const lines: TikTokToken[][] = [];
        for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
          lines.push(page.tokens.slice(i, i + maxWordsPerLine));
        }

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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: lineGap,
                }}
              >
                {lines.map((lineTokens, lineIdx) => (
                  <div
                    key={lineIdx}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      justifyContent: "center",
                      columnGap: wordGap,
                      rowGap: lineGap,
                    }}
                  >
                    {lineTokens.map((token, tokenIdx) => (
                      <LumenWord
                        key={tokenIdx}
                        token={token}
                        pageStartMs={page.startMs}
                        fontSize={fontSize}
                        isKw={isKeyword(token.text, keywordSet)}
                        textColor={textColor}
                        keywordColor={keywordColor}
                        sweepDuration={sweepDuration}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
