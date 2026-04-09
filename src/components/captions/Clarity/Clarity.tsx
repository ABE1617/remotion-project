import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokPage } from "../shared/types";
import { interpolateColors } from "remotion";
import type { ClarityProps, StickyNotesGroup, ToggleEntry } from "./types";
import { SPRING_SNAPPY } from "../../../utils/animations";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";
import { CAPTION_PADDING } from "../../../utils/captionPosition";

function formatText(text: string, showPunctuation: boolean): string {
  if (showPunctuation) return text;
  return text.replace(/[.,!?;:'"()\-—…]/g, "");
}

// ---------------------------------------------------------------------------
// ClarityPage — frosted glass caption
// ---------------------------------------------------------------------------

const ClarityPage: React.FC<{
  page: TikTokPage;
  showPunctuation: boolean;
  bgColor: string;
  blurAmount: number;
  activeColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  stripPaddingX: number;
  stripPaddingY: number;
  borderRadius: number;
  positionStyle: React.CSSProperties;
}> = ({
  page,
  showPunctuation,
  bgColor,
  blurAmount,
  activeColor,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  stripPaddingX,
  stripPaddingY,
  borderRadius,
  positionStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageLocalMs = (frame / fps) * 1000;
  const fadeIn = interpolate(pageLocalMs, [0, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    pageLocalMs,
    [page.durationMs - 150, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "85%",
        ...positionStyle,
        opacity: Math.min(fadeIn, fadeOut),
        padding: `${stripPaddingY}px ${stripPaddingX}px`,
        backgroundColor: bgColor,
        backdropFilter: `blur(${blurAmount}px) saturate(1.4)`,
        WebkitBackdropFilter: `blur(${blurAmount}px) saturate(1.4)`,
        borderRadius,
        border: "1px solid rgba(255,255,255,0.2)",
        fontFamily,
        fontSize,
        fontWeight,
        color: activeColor,
        letterSpacing,
        lineHeight: 1.3,
        textShadow: "0 0 16px rgba(0,0,0,0.5), 0 0 6px rgba(0,0,0,0.4)",
        textAlign: "left" as const,
        whiteSpace: "nowrap",
      }}
    >
      {formatText(page.text, showPunctuation)}
    </div>
  );
};

// ---------------------------------------------------------------------------
// ClarityStickyNotes — 3 overlapping sticky notes with fog backdrop
// ---------------------------------------------------------------------------

// Note positions relative to center: [x offset, y offset]
const NOTE_POSITIONS: [number, number][] = [
  [-310, 20],   // yellow — left
  [0, -30],     // blue — center
  [305, 15],    // pink — right
];

const ClarityStickyNotesGroup: React.FC<{
  group: StickyNotesGroup;
  noteSize: number;
  noteFontSize: number;
  noteFontFamily: string;
}> = ({ group, noteSize, noteFontSize, noteFontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearFrame = msToFrames(group.appearAtMs, fps);
  const disappearFrame = msToFrames(group.disappearAtMs, fps);

  if (frame < appearFrame - 10) return null;
  if (frame > disappearFrame + 10) return null;

  const elapsed = frame - appearFrame;

  // Fog fade in (first ~10 frames = 300ms)
  const fogOpacity = interpolate(
    elapsed,
    [-5, 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Fog/gradient fade out
  const fogFadeOut = interpolate(
    frame,
    [disappearFrame, disappearFrame + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const fogOverall = Math.min(fogOpacity, fogFadeOut);

  return (
    <AbsoluteFill>
      {/* White gradient wash — full width, top of screen */}
      <div
        style={{
          opacity: fogOverall,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50%",
          background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 30%, rgba(255,255,255,0.4) 60%, transparent 100%)",
        }}
      />

      {/* Notes container */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: noteSize * 3 + 60,
          height: noteSize + 80,
        }}
      >

      {/* Sticky notes — rendered back to front */}
      {group.notes.map((note, i) => {
        // Stagger: each note pops in 4 frames after the previous
        const noteDelay = 4 * i;
        const noteElapsed = elapsed - noteDelay - 5; // 5 frame delay after fog starts

        // Exit: reverse stagger (pink first, yellow last), float up + shrink
        const exitDelay = (2 - i) * 3; // pink=0, blue=3, yellow=6
        const exitElapsed = frame - disappearFrame + exitDelay;
        const exitProgress = interpolate(
          exitElapsed,
          [0, 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const exitY = interpolate(exitProgress, [0, 1], [0, -50]);
        const exitScale = interpolate(exitProgress, [0, 1], [1, 0.7]);
        const exitOpacity = interpolate(exitProgress, [0, 0.8, 1], [1, 0.5, 0]);

        // Stick-on: note slaps down from above, sticks to surface
        const slapSpring = spring({
          fps,
          frame: noteElapsed,
          config: { mass: 0.5, damping: 18, stiffness: 250, overshootClamping: false },
        });

        const yDrop = interpolate(slapSpring, [0, 1], [-60, 0]);
        const scale = interpolate(slapSpring, [0, 0.3, 1], [0.9, 1.03, 1]);
        const rotationSettle = interpolate(
          slapSpring,
          [0, 0.4, 1],
          [note.rotation + 6, note.rotation - 2, note.rotation],
        );
        const noteOpacity = interpolate(slapSpring, [0, 0.1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const [xOff, yOff] = NOTE_POSITIONS[i];

        // Shadow grows as note lands
        const shadowBlur = interpolate(slapSpring, [0, 1], [20, 8]);
        const shadowY = interpolate(slapSpring, [0, 1], [12, 3]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: noteSize,
              height: noteSize,
              marginLeft: xOff - noteSize / 2,
              marginTop: yOff - noteSize / 2,
              backgroundColor: note.color,
              transform: `translateY(${yDrop + exitY}px) scale(${scale * exitScale}) rotate(${rotationSettle}deg)`,
              transformOrigin: "center center",
              opacity: noteOpacity * exitOpacity,
              boxShadow: `1px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.15)`,
              zIndex: i,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
            }}
          >
            {/* Checkmark on first note */}
            {i === 0 && (
              <span
                style={{
                  fontSize: noteFontSize * 0.8,
                  color: "#1A1A1A",
                  marginBottom: 2,
                  fontFamily: noteFontFamily,
                }}
              >
                ✓
              </span>
            )}

            {/* Keyword */}
            <span
              style={{
                fontFamily: noteFontFamily,
                fontSize: noteFontSize,
                fontWeight: 400,
                color: "#1A1A1A",
                textAlign: "center",
                lineHeight: 1.1,
                fontStyle: i === 2 ? "italic" : "normal",
              }}
            >
              {note.text}
            </span>

            {/* Underline swoosh on third note */}
            {i === 2 && (
              <div
                style={{
                  width: "60%",
                  height: 2,
                  backgroundColor: "#1A1A1A",
                  marginTop: 4,
                  borderRadius: 2,
                  opacity: 0.5,
                }}
              />
            )}
          </div>
        );
      })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// ClarityToggle — iOS-style toggle at top anchor
// ---------------------------------------------------------------------------

const ClarityToggleItem: React.FC<{
  toggle: ToggleEntry;
  fontSize: number;
  toggleScale: number;
}> = ({ toggle, fontSize, toggleScale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearFrame = msToFrames(toggle.appearAtMs, fps);
  const activateFrame = msToFrames(toggle.activateAtMs, fps);
  const disappearFrame = msToFrames(toggle.disappearAtMs, fps);

  if (frame < appearFrame) return null;
  if (frame > disappearFrame + 8) return null;

  // Fade in
  const fadeIn = interpolate(
    frame,
    [appearFrame, appearFrame + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Fade out
  const fadeOut = interpolate(
    frame,
    [disappearFrame, disappearFrame + 8],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Toggle activation
  const isActivated = frame >= activateFrame;
  const toggleSpring = isActivated
    ? spring({
        fps,
        frame: frame - activateFrame,
        config: SPRING_SNAPPY,
      })
    : 0;

  const trackW = 120 * toggleScale;
  const trackH = 64 * toggleScale;
  const knobSize = 56 * toggleScale;
  const knobGap = 4 * toggleScale;
  const knobTravel = trackW - knobSize - knobGap * 2;

  const knobLeft = interpolate(toggleSpring, [0, 1], [knobGap, knobGap + knobTravel]);
  const trackColor = interpolateColors(toggleSpring, [0, 1], ["#D1D5DB", "#22C55E"]);

  return (
    <div
      style={{
        position: "absolute",
        top: CAPTION_PADDING.top,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILIES.inter,
          fontSize,
          fontWeight: 700,
          color: "#FFFFFF",
          marginRight: 28,
          textShadow: "0 2px 10px rgba(0,0,0,0.4)",
          whiteSpace: "nowrap",
        }}
      >
        {toggle.text}
      </div>

      <div
        style={{
          width: trackW,
          height: trackH,
          borderRadius: trackH / 2,
          backgroundColor: trackColor,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            backgroundColor: "#FFFFFF",
            position: "absolute",
            top: knobGap,
            left: knobLeft,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Clarity — main component
// ---------------------------------------------------------------------------

export const Clarity: React.FC<ClarityProps> = ({
  pages,
  bgColor = "rgba(255,255,255,0.17)",
  blurAmount = 20,
  activeColor = "#FFFFFF",
  fontFamily = FONT_FAMILIES.inter,
  fontSize = 86,
  fontWeight = 500,
  position = "bottom",
  borderRadius = 0,
  stripPaddingX = 40,
  stripPaddingY = 24,
  letterSpacing = "0.02em",
  showPunctuation = true,
  stickyNotes = [],
  stickySize = 300,
  stickyFontSize = 50,
  stickyFontFamily = FONT_FAMILIES.caveatBrush,
  toggles = [],
  toggleScale = 1.5,
  toggleFontSize = 48,
}) => {
  const { fps } = useVideoConfig();

  const positionStyle: React.CSSProperties =
    position === "top"
      ? { top: CAPTION_PADDING.top }
      : { bottom: CAPTION_PADDING.bottomSafe };

  return (
    <AbsoluteFill>
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
            <AbsoluteFill>
              <ClarityPage
                page={page}
                showPunctuation={showPunctuation}
                bgColor={bgColor}
                blurAmount={blurAmount}
                activeColor={activeColor}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                stripPaddingX={stripPaddingX}
                stripPaddingY={stripPaddingY}
                borderRadius={borderRadius}
                positionStyle={positionStyle}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Sticky notes groups */}
      {stickyNotes.map((group, i) => (
        <ClarityStickyNotesGroup
          key={i}
          group={group}
          noteSize={stickySize}
          noteFontSize={stickyFontSize}
          noteFontFamily={stickyFontFamily}
        />
      ))}

      {/* Toggle switches */}
      {toggles.map((toggle, i) => (
        <ClarityToggleItem
          key={i}
          toggle={toggle}
          fontSize={toggleFontSize}
          toggleScale={toggleScale}
        />
      ))}
    </AbsoluteFill>
  );
};
