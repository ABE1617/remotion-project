import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SpringConfig } from "remotion";
import type { CaptionPage } from "../shared/types";
import type { BlockFlipProps } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";

const DEFAULT_SPRING: SpringConfig = {
  mass: 0.5,
  damping: 12,
  stiffness: 200,
  overshootClamping: false,
};

const DEFAULT_BLOCK_COLORS = [
  "#FF3B5C",
  "#FFB800",
  "#00C2FF",
  "#8B5CF6",
  "#10B981",
  "#FF6B35",
];

/** A single word block that flips in */
const FlipBlock: React.FC<{
  text: string;
  delayFrames: number;
  bgColor: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  springConfig: SpringConfig;
}> = ({
  text,
  delayFrames,
  bgColor,
  textColor,
  fontSize,
  fontFamily,
  fontWeight,
  borderRadius,
  paddingX,
  paddingY,
  springConfig,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - delayFrames);
  const isActive = frame >= delayFrames;

  const flipSpring = spring({
    fps,
    frame: localFrame,
    config: springConfig,
  });

  // Flip from 90deg (edge-on) to 0deg (face-on)
  const rotateY = interpolate(flipSpring, [0, 1], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scale up slightly as it flips in
  const scale = interpolate(flipSpring, [0, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (!isActive) return null;

  return (
    <div
      style={{
        perspective: 600,
        display: "inline-block",
      }}
    >
      <div
        style={{
          background: bgColor,
          borderRadius,
          padding: `${paddingY}px ${paddingX}px`,
          transform: `rotateY(${rotateY}deg) scale(${scale})`,
          backfaceVisibility: "hidden",
          transformOrigin: "center center",
        }}
      >
        <span
          style={{
            fontFamily,
            fontWeight,
            fontSize,
            color: textColor,
            textTransform: "uppercase",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/** A page of word blocks that flip in one by one */
const BlockFlipPage: React.FC<{
  page: CaptionPage;
  blockColors: string[];
  textColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  borderRadius: number;
  gap: number;
  paddingX: number;
  paddingY: number;
  springConfig: SpringConfig;
  maxWidth: number;
  fadeInDurationMs: number;
  fadeOutDurationMs: number;
  colorOffset: number;
}> = ({
  page,
  blockColors,
  textColor,
  fontSize,
  fontFamily,
  fontWeight,
  borderRadius,
  gap,
  paddingX,
  paddingY,
  springConfig,
  maxWidth,
  fadeInDurationMs,
  fadeOutDurationMs,
  colorOffset,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page fade in/out
  const pageLocalMs = (frame / fps) * 1000;
  const fadeIn = interpolate(pageLocalMs, [0, fadeInDurationMs], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOutStart = page.durationMs - fadeOutDurationMs;
  const fadeOut = interpolate(
    pageLocalMs,
    [fadeOutStart, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const pageOpacity = Math.min(fadeIn, fadeOut);

  return (
    <div style={{ opacity: pageOpacity }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap,
          maxWidth,
        }}
      >
        {page.tokens.map((token, i) => {
          // Delay = how many frames from page start until this word flips in
          const delayFrames = msToFrames(token.start - page.startMs, fps);

          return (
            <FlipBlock
              key={i}
              text={token.text}
              delayFrames={delayFrames}
              bgColor={blockColors[(i + colorOffset) % blockColors.length]}
              textColor={textColor}
              fontSize={fontSize}
              fontFamily={fontFamily}
              fontWeight={fontWeight}
              borderRadius={borderRadius}
              paddingX={paddingX}
              paddingY={paddingY}
              springConfig={springConfig}
            />
          );
        })}
      </div>
    </div>
  );
};

export const BlockFlip: React.FC<BlockFlipProps> = ({
  pages,
  blockColors = DEFAULT_BLOCK_COLORS,
  textColor = "#FFFFFF",
  fontSize = 52,
  fontFamily = FONT_FAMILIES.anton,
  fontWeight = 400,
  position = "center",
  borderRadius = 6,
  gap = 10,
  paddingX = 18,
  paddingY = 10,
  springConfig = DEFAULT_SPRING,
  maxWidthPercent = 0.85,
  fadeInDurationMs = 150,
  fadeOutDurationMs = 200,
}) => {
  const { fps, width } = useVideoConfig();
  const maxWidth = width * maxWidthPercent;

  const positionStyle: React.CSSProperties =
    position === "top"
      ? { justifyContent: "flex-start", paddingTop: 200 }
      : position === "center"
        ? { justifyContent: "center" }
        : { justifyContent: "flex-end", paddingBottom: 350 };

  // Track cumulative token count for continuous color cycling across pages
  const pageColorOffsets = useMemo(() => {
    const offsets: number[] = [];
    let total = 0;
    for (const page of pages) {
      offsets.push(total);
      total += page.tokens.length;
    }
    return offsets;
  }, [pages]);

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
            name={page.tokens.map((t) => t.text).join(" ")}
          >
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 40px",
                ...positionStyle,
              }}
            >
              <BlockFlipPage
                page={page}
                blockColors={blockColors}
                textColor={textColor}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                borderRadius={borderRadius}
                gap={gap}
                paddingX={paddingX}
                paddingY={paddingY}
                springConfig={springConfig}
                maxWidth={maxWidth}
                fadeInDurationMs={fadeInDurationMs}
                fadeOutDurationMs={fadeOutDurationMs}
                colorOffset={pageColorOffsets[pageIndex]}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
