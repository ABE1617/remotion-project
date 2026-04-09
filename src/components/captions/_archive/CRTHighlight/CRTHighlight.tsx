import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";
import type { TikTokPage } from "../shared/types";
import type { CRTHighlightProps } from "./types";
import { msToFrames } from "../../../utils/timing";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { getCaptionPositionStyle } from "../../../utils/captionPosition";
import { isCRTKeyword } from "./crtKeywords";

/* ─── CRT Scanline Overlay ─── */

const CRTScanlines: React.FC<{ seed: string }> = ({ seed }) => {
  const frame = useCurrentFrame();

  // Scanlines scroll down — slower crawl
  const scrollY = (frame * 0.45) % 4;

  // Occasional brightness flicker
  const flicker = random(`flicker-${seed}-${Math.floor(frame / 4)}`) > 0.82
    ? 0.5 + random(`depth-${seed}-${frame}`) * 0.3
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: -6,
        pointerEvents: "none",
        opacity: 0.4 * flicker,
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.5) 0px,
          rgba(0, 0, 0, 0.5) 2px,
          transparent 2px,
          transparent 4px
        )`,
        transform: `translateY(${scrollY}px)`,
        borderRadius: 4,
        mixBlendMode: "multiply",
      }}
    />
  );
};

/* ─── CRT Word (keyword with full effect) ─── */

const CRTWord: React.FC<{
  text: string;
  isActive: boolean;
  crtColor: string;
  fontSize: number;
  triggerFrame: number;
  wordIndex: number;
}> = ({ text, isActive, crtColor, fontSize, triggerFrame, wordIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame - triggerFrame;
  const hasAppeared = elapsed >= 0;

  // Pop-in spring
  const revealSpring = hasAppeared
    ? spring({
        fps,
        frame: elapsed,
        config: { mass: 0.35, damping: 8, stiffness: 240 },
      })
    : 0;

  const scale = hasAppeared
    ? interpolate(revealSpring, [0, 1], [0, isActive ? 1.15 : 1.02], {
        extrapolateRight: "clamp",
      })
    : 0;

  const translateY = hasAppeared
    ? interpolate(revealSpring, [0, 0.4, 1], [16, -5, 0], {
        extrapolateRight: "clamp",
      })
    : 16;

  // CRT jitter — subtle Y/X shake
  const jitterX = hasAppeared
    ? (random(`jx-${wordIndex}-${frame}`) - 0.5) * 1.2
    : 0;
  const jitterY = hasAppeared
    ? (random(`jy-${wordIndex}-${frame}`) - 0.5) * 0.8
    : 0;

  // Chromatic aberration — RGB split (stronger)
  const rgbOffset = isActive ? 3.5 : 2.5;

  // Phosphor glow intensity (bigger)
  const glowSize = isActive ? 20 : 12;

  // CRT flicker on the word itself — slightly slower
  const wordFlicker = random(`wf-${wordIndex}-${Math.floor(frame / 3)}`) > 0.88
    ? 0.7
    : 1;

  const crtShadow = [
    // RGB split
    `${-rgbOffset}px 0 0 rgba(255,0,0,0.7)`,
    `${rgbOffset}px 0 0 rgba(0,100,255,0.7)`,
    // Phosphor glow — triple layer for more bloom
    `0 0 ${glowSize * 0.5}px ${crtColor}`,
    `0 0 ${glowSize}px ${crtColor}`,
    `0 0 ${glowSize * 3}px ${crtColor}35`,
    // Depth shadow
    `0 3px 10px rgba(0,0,0,0.6)`,
  ].join(", ");

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        fontFamily: FONT_FAMILIES.bebasNeue,
        fontWeight: 400,
        fontSize: fontSize * 1.35,
        textTransform: "none",
        letterSpacing: "0.06em",
        lineHeight: 1.2,
        color: crtColor,
        textShadow: crtShadow,
        transform: `scale(${scale}) translate(${jitterX}px, ${translateY + jitterY}px)`,
        transformOrigin: "center bottom",
        whiteSpace: "pre",
        padding: "0 6px",
        opacity: wordFlicker,
      }}
    >
      <CRTScanlines seed={`${wordIndex}`} />
      {text}
    </span>
  );
};

/* ─── Normal Word ─── */

const NormalWord: React.FC<{
  text: string;
  isActive: boolean;
  isPast: boolean;
  activeColor: string;
  inactiveColor: string;
  fontSize: number;
  triggerFrame: number;
}> = ({
  text,
  isActive,
  isPast,
  activeColor,
  inactiveColor,
  fontSize,
  triggerFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = frame - triggerFrame;
  const hasAppeared = elapsed >= 0;

  const revealSpring = hasAppeared
    ? spring({
        fps,
        frame: elapsed,
        config: { mass: 0.4, damping: 10, stiffness: 220 },
      })
    : 0;

  let targetScale: number;
  if (!hasAppeared) {
    targetScale = 0;
  } else if (isActive) {
    targetScale = 1.06;
  } else if (isPast) {
    targetScale = 0.98;
  } else {
    targetScale = 1;
  }

  const scale = interpolate(revealSpring, [0, 1], [0, targetScale], {
    extrapolateRight: "clamp",
  });

  const translateY = hasAppeared
    ? interpolate(revealSpring, [0, 0.4, 1], [10, -3, 0], {
        extrapolateRight: "clamp",
      })
    : 10;

  const color = isActive ? activeColor : inactiveColor;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT_FAMILIES.bebasNeue,
        fontWeight: 400,
        fontSize,
        textTransform: "none",
        letterSpacing: "0.04em",
        lineHeight: 1.2,
        color,
        WebkitTextStroke: "3px #000000",
        paintOrder: "stroke fill",
        textShadow: "0 3px 8px rgba(0,0,0,0.5)",
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transformOrigin: "center bottom",
        whiteSpace: "pre",
        padding: "0 4px",
      }}
    >
      {text}
    </span>
  );
};

/* ─── Page ─── */

const CRTPage: React.FC<{
  page: TikTokPage;
  pageStartFrame: number;
  pageDurationFrames: number;
  activeColor: string;
  inactiveColor: string;
  crtColor: string;
  fontSize: number;
  maxWidth: number;
}> = ({
  page,
  pageStartFrame,
  pageDurationFrames,
  activeColor,
  inactiveColor,
  crtColor,
  fontSize,
  maxWidth,
}) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = localFrame + pageStartFrame;

  // Page fade
  const fadeFrames = 5;
  const entryOpacity = interpolate(
    localFrame,
    [0, fadeFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const exitOpacity = interpolate(
    localFrame,
    [pageDurationFrames - fadeFrames, pageDurationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const pageOpacity = Math.min(entryOpacity, exitOpacity);

  if (pageOpacity <= 0) return null;

  const currentTimeMs = (frame / fps) * 1000;

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        opacity: pageOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          maxWidth,
          textAlign: "center",
          gap: "8px 18px",
          padding: "20px 10px",
        }}
      >
        {page.tokens.map((token, idx) => {
          const isActive =
            currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;
          const isPast = currentTimeMs >= token.toMs;
          const isKeyword = isCRTKeyword(token.text);
          const localTrigger = msToFrames(token.fromMs, fps) - pageStartFrame;

          if (isKeyword) {
            return (
              <CRTWord
                key={idx}
                text={token.text}
                isActive={isActive}
                crtColor={crtColor}
                fontSize={fontSize}
                triggerFrame={localTrigger}
                wordIndex={idx}
              />
            );
          }

          return (
            <NormalWord
              key={idx}
              text={token.text}
              isActive={isActive}
              isPast={isPast}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              fontSize={fontSize}
              triggerFrame={localTrigger}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ─── Main Component ─── */

export const CRTHighlight: React.FC<CRTHighlightProps> = ({
  pages,
  activeColor = "#FFFFFF",
  inactiveColor = "rgba(255,255,255,0.65)",
  crtColor = "#FFD700",
  fontSize = 85,
  position = "center",
  maxWidthPercent = 0.85,
}) => {
  const { fps, width } = useVideoConfig();
  const maxWidth = width * maxWidthPercent;

  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        ...positionStyle,
      }}
    >
      <div style={{ position: "relative", width: "100%", minHeight: 300 }}>
        {pages.map((page, pageIndex) => {
          const pageStartFrame = msToFrames(page.startMs, fps);
          const pageDurationFrames = msToFrames(page.durationMs, fps);

          return (
            <Sequence
              key={pageIndex}
              from={pageStartFrame}
              durationInFrames={pageDurationFrames}
              name={page.text}
              premountFor={10}
            >
              <CRTPage
                page={page}
                pageStartFrame={pageStartFrame}
                pageDurationFrames={pageDurationFrames}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
                crtColor={crtColor}
                fontSize={fontSize}
                maxWidth={maxWidth}
              />
            </Sequence>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
