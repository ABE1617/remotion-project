import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { TikTokToken } from "../../types/captions";
import type { ScanlineImpactProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

/* ─── Deterministic random ─── */

function srand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* ─── Page renderer ─── */

const ScanlinePage: React.FC<{
  lines: TikTokToken[][];
  durationMs: number;
  textColor: string;
  fontSize: number;
  skewAngle: number;
  scanlineWidth: number;
  scanlineGap: number;
}> = ({
  lines,
  durationMs,
  textColor,
  fontSize,
  skewAngle,
  scanlineWidth,
  scanlineGap,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = msToFrames(durationMs, fps);

  // Timing
  const entranceDuration = 14;
  const exitStart = totalFrames - 12;

  // Scanline — thick fill, thin surgical cuts (3:1 ratio)
  const stripeSize = scanlineWidth + scanlineGap;
  const scanlineMask = `repeating-linear-gradient(to bottom, white 0px, white ${scanlineWidth}px, transparent ${scanlineWidth}px, transparent ${stripeSize}px)`;

  // Outline sweep
  const sweepDuration = Math.min(totalFrames * 0.6, 20);
  const sweepDelay = entranceDuration + 2;
  const sweepPos = interpolate(
    frame,
    [sweepDelay, sweepDelay + sweepDuration],
    [-30, 130],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const sweepW = 8;
  const sweepSk = 25;
  const showSweep = sweepPos > -sweepW - sweepSk && sweepPos < 130;
  const sweepClip = `polygon(${sweepPos - sweepW}% ${-sweepSk}%, ${sweepPos + sweepW}% ${-sweepSk - 10}%, ${sweepPos + sweepW + sweepSk}% ${100 + 10}%, ${sweepPos - sweepW + sweepSk}% ${100 + sweepSk}%)`;

  // Build word-grouped character list
  interface WordGroup {
    chars: { char: string; animIdx: number }[];
    isBreak: boolean;
    isSpace: boolean;
  }
  const words: WordGroup[] = [];
  let ai = 0;
  lines.forEach((lineTokens, li) => {
    if (li > 0) words.push({ chars: [], isBreak: true, isSpace: false });
    lineTokens.forEach((token, ti) => {
      if (ti > 0) words.push({ chars: [], isBreak: false, isSpace: true });
      const w: WordGroup = { chars: [], isBreak: false, isSpace: false };
      for (const ch of token.text.toUpperCase()) {
        w.chars.push({ char: ch, animIdx: ai++ });
      }
      words.push(w);
    });
  });

  // Per-character pop-in / pop-out (in place, random stagger order)
  const getCharStyle = (i: number): React.CSSProperties => {
    if (i < 0) return {};

    // Entrance: punch in from slightly behind (scale up + fade), random stagger
    const delay = srand(i * 3 + 1) * entranceDuration * 0.8;
    const elapsed = frame - delay;
    const prog = elapsed >= 0
      ? spring({ fps, frame: elapsed, config: { damping: 14, stiffness: 300 } })
      : 0;

    let scale = interpolate(prog, [0, 1], [1.8, 1], { extrapolateRight: "clamp" });
    let op = interpolate(prog, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // Exit: shrink out
    if (frame >= exitStart) {
      const exitDelay = srand(i * 3 + 4) * 6;
      const exitElapsed = frame - exitStart - exitDelay;
      if (exitElapsed > 0) {
        const exitProg = interpolate(exitElapsed, [0, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        scale = interpolate(exitProg, [0, 1], [1, 0.2]);
        op = 1 - exitProg;
      }
    }

    return {
      display: "inline-block",
      transform: `scale(${scale.toFixed(2)})`,
      opacity: op,
    };
  };

  // Render words — each word is a nowrap group so lines only break between words
  const renderChars = (extraStyle?: (i: number) => React.CSSProperties) =>
    words.map((w, wi) => {
      if (w.isBreak) return <br key={wi} />;
      if (w.isSpace)
        return (
          <span key={wi} style={{ display: "inline-block", width: "0.25em" }}>
            {"\u00A0"}
          </span>
        );
      return (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {w.chars.map((c, ci) => (
            <span
              key={ci}
              style={{
                display: "inline-block",
                ...getCharStyle(c.animIdx),
                ...(extraStyle ? extraStyle(c.animIdx) : {}),
              }}
            >
              {c.char}
            </span>
          ))}
        </span>
      );
    });

  const fontStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILIES.barlowCondensed,
    fontWeight: 900,
    fontSize,
    textTransform: "uppercase",
    textAlign: "center",
    lineHeight: 1.0,
    letterSpacing: "-0.02em",
    maxWidth: 850,
    paddingBottom: fontSize * 0.15,
  };

  return (
    <div
      style={{
        transform: `skewX(${skewAngle}deg)`,
        transformOrigin: "center center",
        position: "relative",
      }}
    >
      {/* Layer 1: Solid text + fat glow — the luminous base */}
      <div
        style={{
          ...fontStyle,
          color: textColor,
          textShadow: [
            `0 0 15px ${textColor}99`,
            `0 0 30px ${textColor}66`,
            `0 0 60px ${textColor}33`,
          ].join(", "),
        }}
      >
        {renderChars()}
      </div>

      {/* Layer 2: Dark scanline cuts — thin dark lines carved into the solid base */}
      <div
        style={{
          ...fontStyle,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          color: "rgba(0,0,0,0.5)",
          WebkitMaskImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent ${scanlineWidth}px, white ${scanlineWidth}px, white ${stripeSize}px)`,
          WebkitMaskPosition: "0px 0px",
          WebkitMaskRepeat: "repeat",
        } as React.CSSProperties}
      >
        {renderChars()}
      </div>

      {/* Layer 3: Outline sweep */}
      {showSweep && (
        <div
          style={{
            ...fontStyle,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.9)",
            clipPath: sweepClip,
            pointerEvents: "none",
          } as React.CSSProperties}
        >
          {renderChars()}
        </div>
      )}
    </div>
  );
};

/* ─── Main component ─── */

export const ScanlineImpact: React.FC<ScanlineImpactProps> = ({
  pages,
  fontSize = 200,
  position = "bottom",
  textColor = "#E0E860",
  maxWordsPerLine = 2,
  skewAngle = -12,
  scanlineSpeed = 40,
  scanlineWidth = 4,
  scanlineGap = 1.5,
  scanlineOpacity = 0.45,
}) => {
  const { fps } = useVideoConfig();
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
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
              <ScanlinePage
                lines={lines}
                durationMs={page.durationMs}
                textColor={textColor}
                fontSize={fontSize}
                skewAngle={skewAngle}
                scanlineWidth={scanlineWidth}
                scanlineGap={scanlineGap}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
