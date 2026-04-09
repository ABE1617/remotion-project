import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { TikTokPage } from "../shared/types";
import type { KaraokeHighlightProps, KaraokeColorScheme } from "./types";
import { KARAOKE_SCHEMES } from "./types";
import { KaraokeWord } from "./KaraokeWord";
import { msToFrames } from "../../../utils/timing";
import { getCaptionPositionStyle } from "../../../utils/captionPosition";

function resolveColorScheme(
  scheme: KaraokeHighlightProps["scheme"],
  custom?: Partial<KaraokeColorScheme>,
): KaraokeColorScheme {
  if (scheme === "custom" && custom) {
    return {
      activeColor: custom.activeColor ?? "#FFD700",
      inactiveColor: custom.inactiveColor ?? "#FFFFFF",
      glowColor: custom.glowColor ?? custom.activeColor ?? "#FFD700",
      pillBackground: custom.pillBackground ?? "rgba(0, 0, 0, 0.75)",
      pillBorder: custom.pillBorder ?? "rgba(255, 255, 255, 0.08)",
      strokeColor: custom.strokeColor ?? "#000000",
    };
  }
  const key = scheme ?? "gold";
  if (key === "custom") return KARAOKE_SCHEMES["gold"];
  return KARAOKE_SCHEMES[key];
}

/** Renders a single page of karaoke words inside a pill */
const KaraokePage: React.FC<{
  page: TikTokPage;
  pageIndex: number;
  colorScheme: KaraokeColorScheme;
  showPill: boolean;
  frostedGlass: boolean;
  staggeredEntrance: boolean;
  staggerDelayFrames: number;
  maxWidth: number;
  fontSize: number;
  pageStartFrame: number;
  crossfadeDurationFrames: number;
  pageDurationFrames: number;
}> = ({
  page,
  colorScheme,
  showPill,
  frostedGlass,
  staggeredEntrance,
  staggerDelayFrames,
  maxWidth,
  fontSize,
  pageStartFrame,
  crossfadeDurationFrames,
  pageDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page-level crossfade envelope
  const entryOpacity = interpolate(
    frame,
    [pageStartFrame, pageStartFrame + crossfadeDurationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const pageEndFrame = pageStartFrame + pageDurationFrames;
  const exitOpacity = interpolate(
    frame,
    [pageEndFrame - crossfadeDurationFrames, pageEndFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const pageOpacity = Math.min(entryOpacity, exitOpacity);

  if (pageOpacity <= 0) return null;

  // Current time in ms (absolute)
  const currentTimeMs = (frame / fps) * 1000;

  // Pill styles
  const pillStyle: React.CSSProperties = showPill
    ? {
        background: colorScheme.pillBackground,
        borderRadius: 12,
        padding: "14px 24px",
        border: `1px solid ${colorScheme.pillBorder}`,
        ...(frostedGlass
          ? {
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }
          : {}),
      }
    : {};

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
          gap: "6px 18px",
          ...pillStyle,
        }}
      >
        {page.tokens.map((token, idx) => {
          const isActive =
            currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;

          return (
            <KaraokeWord
              key={idx}
              token={token}
              index={idx}
              isActive={isActive}
              colorScheme={colorScheme}
              pageStartFrame={pageStartFrame}
              staggeredEntrance={staggeredEntrance}
              staggerDelayFrames={staggerDelayFrames}
              fontSize={fontSize}
            />
          );
        })}
      </div>
    </div>
  );
};

export const KaraokeHighlight: React.FC<KaraokeHighlightProps> = ({
  pages,
  scheme = "gold",
  colorScheme: customScheme,
  fontSize = 64,
  position = "bottom",
  showPill = true,
  frostedGlass = false,
  staggeredEntrance = true,
  staggerDelayFrames = 1,
  maxWidthPercent = 0.8,
  crossfadeDurationFrames = 4,
}) => {
  const { fps, width } = useVideoConfig();
  const frame = useCurrentFrame();
  const maxWidth = width * maxWidthPercent;

  const colors = useMemo(
    () => resolveColorScheme(scheme, customScheme),
    [scheme, customScheme],
  );

  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        ...positionStyle,
      }}
    >
      <div style={{ position: "relative", width: "100%", minHeight: 200 }}>
        {pages.map((page, pageIndex) => {
          const pageStartFrame = msToFrames(page.startMs, fps);
          const pageDurationFrames = msToFrames(page.durationMs, fps);

          // Only render pages in the visible window (with crossfade margins)
          const isVisible =
            frame >= pageStartFrame - 1 &&
            frame <= pageStartFrame + pageDurationFrames + 1;

          if (!isVisible) return null;

          return (
            <KaraokePage
              key={pageIndex}
              page={page}
              pageIndex={pageIndex}
              colorScheme={colors}
              showPill={showPill}
              frostedGlass={frostedGlass}
              staggeredEntrance={staggeredEntrance}
              staggerDelayFrames={staggerDelayFrames}
              maxWidth={maxWidth}
              fontSize={fontSize}
              pageStartFrame={pageStartFrame}
              crossfadeDurationFrames={crossfadeDurationFrames}
              pageDurationFrames={pageDurationFrames}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
