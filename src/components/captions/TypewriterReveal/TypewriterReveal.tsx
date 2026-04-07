import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { CaptionPage } from "../shared/types";
import type { TypewriterRevealProps, TypewriterColorScheme } from "./types";
import { TYPEWRITER_SCHEMES } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";

function resolveScheme(
  scheme: TypewriterRevealProps["scheme"],
  custom?: Partial<TypewriterColorScheme>,
): TypewriterColorScheme {
  if (scheme === "custom" && custom) {
    return {
      textColor: custom.textColor ?? "#FFFFFF",
      bgColor: custom.bgColor ?? "rgba(0,0,0,0.8)",
      cursorColor: custom.cursorColor ?? custom.textColor ?? "#FFFFFF",
    };
  }
  const key = scheme ?? "classic";
  if (key === "custom") return TYPEWRITER_SCHEMES.classic;
  return TYPEWRITER_SCHEMES[key];
}

function buildCharTimings(
  page: CaptionPage,
  lowercase: boolean,
): { text: string; timings: number[] } {
  const parts: string[] = [];
  const timings: number[] = [];

  for (let ti = 0; ti < page.tokens.length; ti++) {
    const token = page.tokens[ti];
    const word = lowercase ? token.text.toLowerCase() : token.text;

    if (ti > 0) {
      parts.push(" ");
      timings.push(page.tokens[ti - 1].end);
    }

    const charCount = word.length;
    for (let ci = 0; ci < charCount; ci++) {
      parts.push(word[ci]);
      timings.push(
        token.start + (ci / charCount) * (token.end - token.start),
      );
    }
  }

  return { text: parts.join(""), timings };
}

/** A single page with character-by-character typewriter reveal */
const TypewriterPage: React.FC<{
  page: CaptionPage;
  colors: TypewriterColorScheme;
  fontSize: number;
  fontFamily: string;
  letterSpacing: string;
  lineHeight: number;
  lowercase: boolean;
  showCursor: boolean;
  cursorBlinkMs: number;
  enableBox: boolean;
  boxBorderRadius: number;
  maxWidth: number;
  fadeInDurationMs: number;
  fadeOutDurationMs: number;
}> = ({
  page,
  colors,
  fontSize,
  fontFamily,
  letterSpacing,
  lineHeight,
  lowercase,
  showCursor,
  cursorBlinkMs,
  enableBox,
  boxBorderRadius,
  maxWidth,
  fadeInDurationMs,
  fadeOutDurationMs,
}) => {
  // Inside Sequence: frame is relative to Sequence start
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Absolute time for character timing lookups
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  const { text, timings } = useMemo(
    () => buildCharTimings(page, lowercase),
    [page, lowercase],
  );

  // Page fade
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

  // Find last revealed character
  let lastRevealedIdx = -1;
  for (let i = 0; i < timings.length; i++) {
    if (currentTimeMs >= timings[i]) {
      lastRevealedIdx = i;
    } else {
      break;
    }
  }

  // Cursor blink
  const blinkCycleFrames = Math.max(2, Math.round((cursorBlinkMs / 1000) * fps));
  const halfCycle = Math.max(1, Math.floor(blinkCycleFrames / 2));
  const cursorVisible =
    showCursor && Math.floor((frame % blinkCycleFrames) / halfCycle) === 0;

  const charStyle: React.CSSProperties = {
    fontFamily,
    fontSize,
    fontWeight: 400,
    letterSpacing,
    lineHeight,
    whiteSpace: "pre-wrap",
  };

  return (
    <div style={{ opacity: pageOpacity, display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        style={{
          ...(enableBox
            ? { background: colors.bgColor, borderRadius: boxBorderRadius, padding: "16px 24px" }
            : {}),
          maxWidth,
          textAlign: "center",
        }}
      >
        {text.split("").map((char, i) => {
          const isRevealed = i <= lastRevealedIdx;
          const isCursorPos = i === lastRevealedIdx + 1;

          return (
            <React.Fragment key={i}>
              {isCursorPos && showCursor && (
                <span style={{ ...charStyle, color: colors.cursorColor, opacity: cursorVisible ? 1 : 0 }}>|</span>
              )}
              <span style={{ ...charStyle, color: colors.textColor, opacity: isRevealed ? 1 : 0 }}>{char}</span>
            </React.Fragment>
          );
        })}
        {lastRevealedIdx === text.length - 1 && showCursor && (
          <span style={{ ...charStyle, color: colors.cursorColor, opacity: cursorVisible ? 1 : 0 }}>|</span>
        )}
      </div>
    </div>
  );
};

export const TypewriterReveal: React.FC<TypewriterRevealProps> = ({
  pages,
  scheme = "classic",
  customColors,
  fontSize = 48,
  fontFamily = FONT_FAMILIES.spaceMono,
  position = "bottom",
  showCursor = true,
  cursorBlinkMs = 530,
  enableBox = true,
  lowercase = true,
  letterSpacing = "0.03em",
  lineHeight = 1.4,
  fadeInDurationMs = 150,
  fadeOutDurationMs = 150,
  boxBorderRadius = 8,
  maxWidthPercent = 0.85,
}) => {
  const { fps, width } = useVideoConfig();
  const maxWidth = width * maxWidthPercent;

  const colors = useMemo(
    () => resolveScheme(scheme, customColors),
    [scheme, customColors],
  );

  const positionStyle: React.CSSProperties =
    position === "top"
      ? { justifyContent: "flex-start", paddingTop: 200 }
      : position === "center"
        ? { justifyContent: "center" }
        : { justifyContent: "flex-end", paddingBottom: 350 };

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
                padding: "0 60px",
                ...positionStyle,
              }}
            >
              <div style={{ position: "absolute", width: "calc(100% - 120px)" }}>
                <TypewriterPage
                  page={page}
                  colors={colors}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  letterSpacing={letterSpacing}
                  lineHeight={lineHeight}
                  lowercase={lowercase}
                  showCursor={showCursor}
                  cursorBlinkMs={cursorBlinkMs}
                  enableBox={enableBox}
                  boxBorderRadius={boxBorderRadius}
                  maxWidth={maxWidth}
                  fadeInDurationMs={fadeInDurationMs}
                  fadeOutDurationMs={fadeOutDurationMs}
                />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
