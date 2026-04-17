import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { useMGPhase } from "../shared/useMGPhase";
import type { QuoteCardProps } from "./types";

// ---------------------------------------------------------------------------
// QuoteCard — editorial pull-quote card with giant decorative serif mark
// ---------------------------------------------------------------------------
//
// The premium signal here is typographic, not kinetic: a proper italic
// Playfair Display serif for the quote, a subdued sans attribution line,
// and a magazine-style oversized "66" quotation mark bleeding out of the
// top-left corner at low opacity. The animation choreography sequences
// marks → quote → attribution to mirror how the eye naturally reads a pull
// quote.
//
// Entrance (22 frames):
//   0-10  giant quote marks: scale 0.8→1 (SPRING_SNAPPY) + fade 0 → 12% opacity
//   6-20  quote text:        translateY(8→0) (SPRING_SNAPPY) + fade
//   14-22 attribution:       pure fade (no drift — the "beat" after the quote)
//   0-14  card:              scale 0.96→1 (SPRING_SNAPPY)
//   0-8   card:              fade 0→1
//
// Hold: sub-pixel Y sine on the giant marks (~1px) keeps the layout alive.
//
// Exit (14 frames):
//   Whole card drifts translateY(0→12px) and fades. The quote text fades
//   a touch faster (gone by frame 10/14) so the card appears to "empty out"
//   before the container itself disappears.

const CARD_PADDING_X = 96;
const CARD_PADDING_Y = 80;
const CARD_WIDTH = 918; // ~85% of 1080
const CARD_RADIUS = 8;
const GIANT_MARK_SIZE = 340;
const GIANT_MARK_OPACITY = 0.12;
const ATTRIBUTION_GAP = 32;

export const QuoteCard: React.FC<QuoteCardProps> = ({
  startMs,
  durationMs,
  enterFrames,
  exitFrames,
  quote,
  attribution,
  cardColor = "#0A0A0A",
  quoteColor = "#FFFFFF",
  attributionColor = "#B8B8B8",
  accentColor = "#FFD60A",
  quoteFont,
  quoteFontSize = 64,
}) => {
  const { fps } = useVideoConfig();
  const { visible, localFrame, exitProgress } = useMGPhase(
    { startMs, durationMs, enterFrames, exitFrames },
    { defaultEnterFrames: 22, defaultExitFrames: 14 },
  );

  if (!visible) return null;

  const resolvedQuoteFont = quoteFont ?? FONT_FAMILIES.playfairDisplay;

  // --- Entrance springs ---------------------------------------------------

  // Card scale: frames 0-14, 0.96 → 1.
  const cardSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 14,
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.96, 1]);
  const cardFadeIn = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Giant marks: frames 0-10, scale 0.8 → 1 + fade to final opacity.
  const marksSpring = spring({
    fps,
    frame: localFrame,
    config: SPRING_SNAPPY,
    durationInFrames: 10,
  });
  const marksScale = interpolate(marksSpring, [0, 1], [0.8, 1]);
  const marksFadeIn = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Quote text: frames 6-20, translateY(8 → 0) + fade.
  const quoteSpring = spring({
    fps,
    frame: localFrame - 6,
    config: SPRING_SNAPPY,
    durationInFrames: 14,
  });
  const quoteY = interpolate(quoteSpring, [0, 1], [8, 0]);
  const quoteFadeIn = interpolate(localFrame, [6, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Attribution: frames 14-22, pure fade.
  const attributionFadeIn = interpolate(localFrame, [14, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Hold-state parallax on the giant marks -----------------------------

  const marksParallaxY = Math.sin(localFrame * 0.05) * 1;

  // --- Exit ---------------------------------------------------------------

  // Whole card drifts down 0 → 12px.
  const exitDriftY = exitProgress * 12;
  const exitOpacity = 1 - exitProgress;

  // Quote text fades a bit faster (gone by frame 10 of the 14-frame exit).
  // exitProgress runs 0→1 over 14 frames, so 10/14 ≈ 0.714.
  const quoteExitOpacity = interpolate(exitProgress, [0, 0.714], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Composed opacities -------------------------------------------------

  const cardOpacity = cardFadeIn * exitOpacity;
  const marksOpacity = marksFadeIn * GIANT_MARK_OPACITY * exitOpacity;
  const quoteOpacity = quoteFadeIn * quoteExitOpacity;
  const attributionOpacity = attributionFadeIn * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: CARD_WIDTH,
          backgroundColor: cardColor,
          borderRadius: CARD_RADIUS,
          paddingLeft: CARD_PADDING_X,
          paddingRight: CARD_PADDING_X,
          paddingTop: CARD_PADDING_Y,
          paddingBottom: CARD_PADDING_Y,
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          overflow: "visible",
          transform: `translateY(${exitDriftY}px) scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        {/* Giant decorative opening quote mark — bleeds out of top-left */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: 40,
            fontFamily: resolvedQuoteFont,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: GIANT_MARK_SIZE,
            lineHeight: 1,
            color: accentColor,
            opacity: marksOpacity,
            transform: `scale(${marksScale}) translateY(${marksParallaxY}px)`,
            transformOrigin: "top left",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
          }}
        >
          &ldquo;
        </div>

        {/* Quote text — sits in front of the giant mark */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            fontFamily: resolvedQuoteFont,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: quoteFontSize,
            lineHeight: 1.25,
            letterSpacing: "-0.005em",
            color: quoteColor,
            textAlign: "left",
            transform: `translateY(${quoteY}px)`,
            opacity: quoteOpacity,
          }}
        >
          {quote}
        </div>

        {/* Attribution */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: ATTRIBUTION_GAP,
            fontFamily: FONT_FAMILIES.inter,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: "0.08em",
            color: attributionColor,
            textAlign: "left",
            opacity: attributionOpacity,
          }}
        >
          {"\u2014 " + attribution}
        </div>
      </div>
    </AbsoluteFill>
  );
};
