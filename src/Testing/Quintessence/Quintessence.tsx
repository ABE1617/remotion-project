import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { QuintessenceProps } from "./types";
import { msToFrames } from "../../utils/timing";
import { FONT_FAMILIES } from "../../utils/fonts";
import { CAPTION_PADDING } from "../../utils/captionPosition";

/* ─── Helpers ─── */

interface WordSlot {
  token: TikTokToken;
  startMs: number;
  endMs: number;
}

function toTitleCase(text: string): string {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildWordSlots(pages: TikTokPage[]): WordSlot[] {
  const slots: WordSlot[] = [];
  for (const page of pages) {
    for (let i = 0; i < page.tokens.length; i++) {
      const token = page.tokens[i];
      const next = page.tokens[i + 1];
      slots.push({
        token,
        startMs: token.fromMs,
        endMs: next ? next.fromMs : page.startMs + page.durationMs,
      });
    }
  }
  return slots;
}

/* ─── Main Component ─── */

export const Quintessence: React.FC<QuintessenceProps> = ({
  pages,
  fontSize = 160,
  position = "bottom",
  color = "#E8D44D",
  stretchY = 1.6,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const slots = buildWordSlots(pages);

  const activeSlot = slots.find((slot) => {
    const startFrame = msToFrames(slot.startMs, fps);
    const endFrame = msToFrames(slot.endMs, fps);
    return frame >= startFrame && frame < endFrame;
  });

  if (!activeSlot) return null;

  const startFrame = msToFrames(activeSlot.startMs, fps);
  const endFrame = msToFrames(activeSlot.endMs, fps);
  const elapsed = frame - startFrame;

  // Quick fade in
  const fadeInFrames = 3;
  const fadeIn = interpolate(elapsed, [0, fadeInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Quick fade out
  const fadeOutFrames = 3;
  const fadeOut = interpolate(
    frame,
    [endFrame - fadeOutFrames, endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = fadeIn * fadeOut;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: CAPTION_PADDING.bottomSafe,
        paddingLeft: CAPTION_PADDING.sidesSafe,
        paddingRight: CAPTION_PADDING.sidesSafe,
        opacity,
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Word-shaped blurred shadow below */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            fontFamily: FONT_FAMILIES.playfairDisplay,
            fontWeight: 700,
            fontSize,
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
            whiteSpace: "nowrap",
            color: "rgba(0,0,0,0.4)",
            filter: "blur(10px)",
            transform: `scaleY(${stretchY})`,
            transformOrigin: "center bottom",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {toTitleCase(activeSlot.token.text)}
        </span>
        <span
          style={{
            display: "inline-block",
            position: "relative",
            fontFamily: FONT_FAMILIES.playfairDisplay,
            fontWeight: 700,
            fontSize,
            color,
            lineHeight: 0.9,
            letterSpacing: "-0.06em",
            whiteSpace: "nowrap",
            transform: `scaleY(${stretchY})`,
            transformOrigin: "center bottom",
            textAlign: "center",
          }}
        >
          {toTitleCase(activeSlot.token.text)}
        </span>
      </div>
    </AbsoluteFill>
  );
};
