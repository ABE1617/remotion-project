import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import type { TikTokToken } from "../../types/captions";
import type { VinylProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";
import { buildKeywordSet, isKeyword } from "../shared/keywords";

/* ─── Film Grain Overlay ─── */

const GrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  // SVG feTurbulence with per-frame seed for animated grain
  const seed = frame % 100;
  const svgFilter = `<svg xmlns='http://www.w3.org/2000/svg'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' seed='${seed}' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.06,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgFilter)}")`,
        backgroundSize: "200px 200px",
        pointerEvents: "none",
      }}
    />
  );
};

/* ─── Word Component ─── */

const VinylWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  fontSize: number;
  isKw: boolean;
  textColor: string;
  underlineColor: string;
  underlineHeight: number;
  wobbleAmplitude: number;
}> = ({
  token,
  pageStartMs,
  fontSize,
  isKw,
  textColor,
  underlineColor,
  underlineHeight,
  wobbleAmplitude,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activateFrame = msToFrames(token.fromMs - pageStartMs, fps);
  const elapsed = frame - activateFrame;
  const hasAppeared = elapsed >= 0;

  // Spring for settling
  const settleSpring = hasAppeared
    ? spring({ fps, frame: elapsed, config: { damping: 200 } })
    : 0;

  // VHS tracking wobble: sine wave with decaying amplitude
  const wobbleDecay = 1 - settleSpring;
  const wobbleX = hasAppeared
    ? Math.sin(elapsed * 0.8) * wobbleAmplitude * wobbleDecay
    : 0;

  // Underline wipe for keywords
  const underlineWidth = isKw && hasAppeared
    ? interpolate(settleSpring, [0, 1], [0, 100], {
        extrapolateRight: "clamp",
      })
    : 0;

  const wordFontSize = isKw ? fontSize * 1.3 : fontSize;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        fontFamily: FONT_FAMILIES.lora,
        fontWeight: isKw ? 700 : 500,
        fontStyle: isKw ? "italic" : "normal",
        fontSize: wordFontSize,
        lineHeight: 1.1,
        color: hasAppeared ? textColor : "transparent",
        opacity: settleSpring,
        transform: `translateX(${wobbleX}px)`,
        textShadow: hasAppeared
          ? "0 1px 6px rgba(0,0,0,0.5)"
          : "none",
        whiteSpace: "nowrap",
        letterSpacing: "-0.01em",
      }}
    >
      {token.text}
      {/* Underline wipe for keywords */}
      {isKw && hasAppeared && (
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            height: underlineHeight,
            width: `${underlineWidth}%`,
            backgroundColor: underlineColor,
            borderRadius: 1,
          }}
        />
      )}
    </span>
  );
};

/* ─── Main Component ─── */

export const Vinyl: React.FC<VinylProps> = ({
  pages,
  fontSize = 72,
  position = "bottom",
  keywords = [],
  maxWordsPerLine = 4,
  lineGap = 14,
  wordGap = 14,
  textColor = "#F5E6D3",
  underlineColor = "#8B7355",
  underlineHeight = 3,
  showGrain = true,
  wobbleAmplitude = 2.5,
}) => {
  const { fps } = useVideoConfig();
  const keywordSet = useMemo(() => buildKeywordSet(keywords), [keywords]);
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {/* Film grain overlay */}
      {showGrain && <GrainOverlay />}

      {/* Warm color wash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 40%, rgba(139,115,85,0.08) 100%)",
          pointerEvents: "none",
        }}
      />

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
                      <VinylWord
                        key={tokenIdx}
                        token={token}
                        pageStartMs={page.startMs}
                        fontSize={fontSize}
                        isKw={isKeyword(token.text, keywordSet)}
                        textColor={textColor}
                        underlineColor={underlineColor}
                        underlineHeight={underlineHeight}
                        wobbleAmplitude={wobbleAmplitude}
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
