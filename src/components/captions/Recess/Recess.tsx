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
// RecessWord — single word, active word gets gold color + bounce
// ---------------------------------------------------------------------------

const RecessWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  textColor: string;
  highlightColor: string;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  textShadow: string;
}> = ({
  token,
  pageStartMs,
  textColor,
  highlightColor,
  allCaps,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  textShadow,
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
        fontFamily,
        fontSize,
        fontWeight,
        color: isActive ? highlightColor : textColor,
        textTransform: allCaps ? "uppercase" : "none",
        letterSpacing,
        lineHeight: 1,
        whiteSpace: "nowrap",
        textShadow,
        transform: `scale(${scale})`,
      }}
    >
      {token.text}
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
  highlightColor: string;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  textShadow: string;
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
            gap: 10,
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
// ImageOverlay — slides up from bottom
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

  const slideIn = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(fps * 0.4),
  });
  const slideY = interpolate(slideIn, [0, 1], [960, 0]);

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
  highlightColor = "#FFD700",
  fontFamily = FONT_FAMILIES.oswald,
  fontSize = 76,
  fontWeight = 700,
  position = "bottom",
  maxWordsPerLine = 2,
  allCaps = true,
  letterSpacing = "0.06em",
  lineHeight = 1.0,
  lineGap = 4,
  textShadow = "0 3px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)",
  showGradient = true,
  emphasisWords = [],
  emphasisScale = 1.6,
  imageOverlays = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

      {imageOverlays.map((entry, i) => (
        <ImageOverlay key={i} entry={entry} />
      ))}

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
                highlightColor={highlightColor}
                allCaps={allCaps}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                textShadow={textShadow}
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
