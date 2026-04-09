import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../shared/types";
import type { RecessProps, ImageOverlayEntry } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";
import { CAPTION_PADDING } from "../../../utils/captionPosition";

// ---------------------------------------------------------------------------
// RecessWord — single word with pill highlight when active
// ---------------------------------------------------------------------------

const RecessWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  textColor: string;
  pillColor: string;
  pillTextColor: string;
  pillRadius: number;
  pillPaddingX: number;
  pillPaddingY: number;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
}> = ({
  token,
  pageStartMs,
  textColor,
  pillColor,
  pillTextColor,
  pillRadius,
  pillPaddingX,
  pillPaddingY,
  allCaps,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000 + pageStartMs;
  const isActive = currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;

  // Bounce spring when word becomes active
  const activateFrame = Math.round(((token.fromMs - pageStartMs) / 1000) * fps);
  const bounceSpring = spring({
    frame: frame - activateFrame,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.4 },
  });
  const scale = isActive ? interpolate(bounceSpring, [0, 1], [0.85, 1]) : 1;

  return (
    <span
      style={{
        display: "inline-block",
        position: "relative",
        padding: `${pillPaddingY}px ${pillPaddingX}px`,
        borderRadius: pillRadius,
        background: isActive ? pillColor : "transparent",
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily,
          fontSize,
          fontWeight,
          color: isActive ? pillTextColor : textColor,
          textTransform: allCaps ? "uppercase" : "none",
          letterSpacing,
          lineHeight: 1,
          whiteSpace: "nowrap",
          textShadow: "0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.6)",
          transform: `scale(${scale})`,
        }}
      >
        {token.text}
      </span>
    </span>
  );
};

// ---------------------------------------------------------------------------
// RecessPage — one caption page, splits tokens into short lines
// ---------------------------------------------------------------------------

const RecessPage: React.FC<{
  page: TikTokPage;
  maxWordsPerLine: number;
  lineGap: number;
  textColor: string;
  pillColor: string;
  pillTextColor: string;
  pillRadius: number;
  pillPaddingX: number;
  pillPaddingY: number;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  lineHeight: number;
  emphasisWords: string[];
  emphasisScale: number;
}> = ({
  page,
  maxWordsPerLine,
  lineGap,
  lineHeight,
  emphasisWords,
  emphasisScale,
  ...wordProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isEmphasis = (text: string) =>
    emphasisWords.some((w) => w.toLowerCase() === text.toLowerCase());

  // Split tokens into lines, emphasis words get their own line
  const lines: { tokens: TikTokToken[]; isEmphasis: boolean }[] = [];
  let buffer: TikTokToken[] = [];

  for (const token of page.tokens) {
    if (isEmphasis(token.text)) {
      if (buffer.length > 0) {
        lines.push({ tokens: buffer, isEmphasis: false });
        buffer = [];
      }
      lines.push({ tokens: [token], isEmphasis: true });
    } else {
      buffer.push(token);
      if (buffer.length >= maxWordsPerLine) {
        lines.push({ tokens: buffer, isEmphasis: false });
        buffer = [];
      }
    }
  }
  if (buffer.length > 0) {
    lines.push({ tokens: buffer, isEmphasis: false });
  }

  // Fade in/out
  const pageLocalMs = (frame / fps) * 1000;
  const fadeIn = interpolate(pageLocalMs, [0, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    pageLocalMs,
    [page.durationMs - 120, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
        opacity: Math.min(fadeIn, fadeOut),
        lineHeight,
      }}
    >
      {lines.map((line, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            ...(line.isEmphasis
              ? { fontSize: wordProps.fontSize * emphasisScale }
              : {}),
          }}
        >
          {line.tokens.map((token, idx) => (
            <RecessWord
              key={idx}
              token={token}
              pageStartMs={page.startMs}
              {...wordProps}
              fontSize={
                line.isEmphasis
                  ? wordProps.fontSize * emphasisScale
                  : wordProps.fontSize
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// ImageOverlay — slides up from bottom to half screen
// ---------------------------------------------------------------------------

const ImageOverlay: React.FC<{
  entry: ImageOverlayEntry;
}> = ({ entry }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearFrame = msToFrames(entry.appearAtMs, fps);
  const disappearFrame = msToFrames(entry.disappearAtMs, fps);

  if (frame < appearFrame - 5) return null;
  if (frame > disappearFrame + 15) return null;

  // Slide up from bottom
  const slideIn = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(fps * 0.4),
  });
  const slideY = interpolate(slideIn, [0, 1], [960, 0]);

  // Slide back down on exit
  const slideOut = spring({
    frame: frame - disappearFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(fps * 0.4),
  });
  const exitY = interpolate(slideOut, [0, 1], [0, 960]);

  const finalY = slideY + (frame >= disappearFrame ? exitY : 0);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: entry.height ?? "40%",
        transform: `translateY(${finalY}px)`,
        overflow: "hidden",
        borderRadius: `${entry.borderRadius ?? 20}px ${entry.borderRadius ?? 20}px 0 0`,
      }}
    >
      <Img
        src={entry.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Recess — main exported component
// ---------------------------------------------------------------------------

export const Recess: React.FC<RecessProps> = ({
  pages,
  textColor = "#FFFFFF",
  pillColor = "linear-gradient(90deg, #7B6BA5, #5A9E8F)",
  pillTextColor = "#FFFFFF",
  pillRadius = 10,
  pillPaddingX = 16,
  pillPaddingY = 6,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 58,
  fontWeight = 800,
  position = "bottom",
  maxWordsPerLine = 2,
  allCaps = true,
  letterSpacing = "0.02em",
  lineHeight = 1.05,
  lineGap = 8,
  showGradient = true,
  emphasisWords = [],
  emphasisScale = 1.6,
  imageOverlays = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Check if any image overlay is currently active — if so, captions move to center
  // Synced exactly: active from appearFrame until disappearFrame + slide-out duration
  const slideOutFrames = Math.round(fps * 0.4);
  const activeOverlay = imageOverlays.find((entry) => {
    const aFrame = msToFrames(entry.appearAtMs, fps);
    const dFrame = msToFrames(entry.disappearAtMs, fps);
    return frame >= aFrame && frame <= dFrame + slideOutFrames;
  });
  const isOverlayActive = !!activeOverlay;

  const getPositionStyle = () => {
    if (isOverlayActive) {
      const captionTop = activeOverlay?.captionPosition ?? "59%";
      return { top: captionTop, transform: "translate(-50%, -50%)" } as React.CSSProperties;
    }
    switch (position) {
      case "top":
        return { top: CAPTION_PADDING.top, transform: "translateX(-50%)" };
      case "center":
        return { top: "50%", transform: "translate(-50%, -50%)" } as React.CSSProperties;
      default:
        return { bottom: CAPTION_PADDING.bottomSafe, transform: "translateX(-50%)" };
    }
  };

  return (
    <AbsoluteFill>
      {/* Dark gradient at bottom for readability */}
      {showGradient && !isOverlayActive && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "45%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Image overlays */}
      {imageOverlays.map((entry, i) => (
        <ImageOverlay key={i} entry={entry} />
      ))}

      {/* Caption pages */}
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
            <div
              style={{
                position: "absolute",
                left: "50%",
                maxWidth: 1080 - CAPTION_PADDING.sidesSafe * 2,
                ...getPositionStyle(),
              }}
            >
              <RecessPage
                page={page}
                maxWordsPerLine={maxWordsPerLine}
                lineGap={lineGap}
                textColor={textColor}
                pillColor={pillColor}
                pillTextColor={pillTextColor}
                pillRadius={pillRadius}
                pillPaddingX={pillPaddingX}
                pillPaddingY={pillPaddingY}
                allCaps={allCaps}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                lineHeight={lineHeight}
                emphasisWords={emphasisWords}
                emphasisScale={emphasisScale}
              />
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
