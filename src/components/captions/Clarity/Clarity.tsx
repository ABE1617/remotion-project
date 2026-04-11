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

// ---------------------------------------------------------------------------
// ClarityPage — frosted glass caption
// ---------------------------------------------------------------------------

const ClarityPage: React.FC<{
  page: TikTokPage;
  showPunctuation: boolean;
  activeColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  positionStyle: React.CSSProperties;
}> = ({
  page,
  showPunctuation,
  activeColor,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  positionStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pageLocalMs = (frame / fps) * 1000;
  const fadeOut = interpolate(
    pageLocalMs,
    [page.durationMs - 150, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const floatX = Math.sin(frame * 0.06) * 3;
  const floatY = Math.cos(frame * 0.045) * 4;
  const floatRotate = Math.sin(frame * 0.035) * 0.5;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: `translateX(calc(-50% + ${floatX}px)) translateY(${floatY}px) rotate(${floatRotate}deg)`,
        maxWidth: "85%",
        ...positionStyle,
        opacity: fadeOut,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 14px",
      }}
    >
      {page.tokens.map((token, idx) => {
        // Word-by-word fade-in driven by timing
        const tokenLocalMs = token.fromMs - page.startMs;
        const wordFade = interpolate(
          pageLocalMs,
          [tokenLocalMs, tokenLocalMs + 80],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        const text = showPunctuation
          ? token.text
          : token.text.replace(/[.,!?;:'"()\-—…]/g, "");

        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              fontFamily,
              fontSize,
              fontWeight,
              color: activeColor,
              letterSpacing,
              lineHeight: 1.1,
              textTransform: "uppercase",
              textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
              opacity: wordFade,
            }}
          >
            {text}
          </span>
        );
      })}
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

      {/* Sticky notes — paper flutter animations */}
      {group.notes.map((note, i) => {
        const noteDelay = 5 * i;
        const noteElapsed = elapsed - noteDelay - 2;

        // Each note has a different sway rhythm
        const swayFreq = [0.35, 0.28, 0.32][i];
        const swayDir = i === 1 ? -1 : 1; // center note sways opposite

        // --- ENTRANCE: flutter down like a dropped piece of paper ---
        const fallProgress = spring({
          fps,
          frame: noteElapsed,
          config: { mass: 0.6, damping: 14, stiffness: 160, overshootClamping: false },
        });

        // Y: drops from above — starts high, lands at position
        const enterY = interpolate(fallProgress, [0, 1], [-350, 0]);

        // X: pendulum sway that dampens as paper settles
        const swayAmount = interpolate(fallProgress, [0, 0.3, 0.6, 1], [0, 1, 0.5, 0]);
        const swayX = Math.sin(noteElapsed * swayFreq) * 45 * swayAmount * swayDir;

        // Rotation: rocks back and forth like paper catching air
        const rockAmount = interpolate(fallProgress, [0, 0.3, 0.7, 1], [0, 1, 0.4, 0]);
        const rockAngle = Math.sin(noteElapsed * swayFreq + 0.5) * 18 * rockAmount;
        const enterRotation = note.rotation + rockAngle;

        // 3D tilt: paper tilts on X axis as it catches air currents
        const tiltAmount = interpolate(fallProgress, [0, 0.4, 0.8, 1], [0, 1, 0.3, 0]);
        const tiltX = Math.sin(noteElapsed * swayFreq * 1.3) * 25 * tiltAmount;
        const tiltY = Math.cos(noteElapsed * swayFreq * 0.9) * 15 * tiltAmount;

        // Scale: paper appears slightly larger when higher (perspective)
        const enterScale = interpolate(fallProgress, [0, 0.5, 1], [1.15, 1.03, 1]);

        // Opacity: fades in quickly
        const enterOpacity = interpolate(fallProgress, [0, 0.12], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        // Shadow: far away = big diffuse shadow, close = tight shadow
        const enterShadowBlur = interpolate(fallProgress, [0, 1], [35, 6]);
        const enterShadowY = interpolate(fallProgress, [0, 1], [25, 3]);
        const enterShadowOp = interpolate(fallProgress, [0, 1], [0.06, 0.2]);

        // --- EXIT: wind sweep — caught by a gust, flies away ---
        const exitDelay = (2 - i) * 3;
        const exitElapsed = frame - disappearFrame + exitDelay;
        const isExiting = exitElapsed >= 0;

        const exitProgress = spring({
          fps,
          frame: Math.max(0, exitElapsed),
          config: { mass: 0.4, damping: 16, stiffness: 200, overshootClamping: true },
        });

        // Wind direction per note: swept in different directions
        const windAngles = [-35, 10, 40]; // degrees from vertical
        const windAngle = windAngles[i] * (Math.PI / 180);
        const windDist = interpolate(exitProgress, [0, 1], [0, 500]);
        const exitX = Math.sin(windAngle) * windDist;
        const exitY = -Math.cos(windAngle) * windDist;

        // Spins as it flies away
        const exitSpin = interpolate(exitProgress, [0, 1], [0, (i === 1 ? -1 : 1) * 45]);

        // Tumble on 3D axes while flying
        const exitTiltX = interpolate(exitProgress, [0, 1], [0, 30]);
        const exitTiltY = interpolate(exitProgress, [0, 1], [0, (i === 0 ? -1 : 1) * 25]);

        const exitScale = interpolate(exitProgress, [0, 1], [1, 0.6]);
        const exitOpacity = interpolate(exitProgress, [0, 0.5, 1], [1, 0.7, 0]);

        // --- COMBINE ---
        const finalX = isExiting ? exitX : swayX;
        const finalY = isExiting ? exitY : enterY;
        const finalRot = isExiting ? note.rotation + exitSpin : enterRotation;
        const finalTiltX = isExiting ? exitTiltX : tiltX;
        const finalTiltY = isExiting ? exitTiltY : tiltY;
        const finalScale = isExiting ? exitScale : enterScale;
        const finalOpacity = isExiting ? exitOpacity : enterOpacity;
        const finalShadowBlur = isExiting
          ? interpolate(exitProgress, [0, 1], [6, 30])
          : enterShadowBlur;
        const finalShadowY = isExiting
          ? interpolate(exitProgress, [0, 1], [3, 20])
          : enterShadowY;
        const finalShadowOp = isExiting
          ? interpolate(exitProgress, [0, 1], [0.2, 0.03])
          : enterShadowOp;

        const [xOff, yOff] = NOTE_POSITIONS[i];

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
              zIndex: i,
              perspective: 800,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: note.color,
                transform: `translate(${finalX}px, ${finalY}px) rotateX(${finalTiltX}deg) rotateY(${finalTiltY}deg) rotate(${finalRot}deg) scale(${finalScale})`,
                transformOrigin: "center center",
                opacity: finalOpacity,
                boxShadow: `2px ${finalShadowY}px ${finalShadowBlur}px rgba(0,0,0,${finalShadowOp})`,
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
  const trackColor = interpolateColors(toggleSpring, [0, 1], ["#D1D5DB", "#3B82F6"]);

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
          marginRight: 100,
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
  bgColor = "transparent",
  blurAmount = 0,
  activeColor = "#F0F0F0",
  fontFamily = FONT_FAMILIES.poppins,
  fontSize = 68,
  fontWeight = 700,
  position = "bottom",
  borderRadius = 0,
  stripPaddingX = 0,
  stripPaddingY = 0,
  letterSpacing = "0.12em",
  showPunctuation = true,
  stickyNotes = [],
  stickySize = 300,
  stickyFontSize = 50,
  stickyFontFamily = FONT_FAMILIES.caveatBrush,
  toggles = [],
  toggleScale = 1.5,
  toggleFontSize = 72,
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
                activeColor={activeColor}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
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
