import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../shared/types";
import type { PaperIIProps, TornPaperEntry, NewspaperTransitionEntry } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";
import { getCaptionPositionStyle } from "../../../utils/captionPosition";

// ---------------------------------------------------------------------------
// PaperIIWord
// ---------------------------------------------------------------------------

const PaperIIWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  upcomingColor: string;
  activeColor: string;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  colorTransitionMs: number;
}> = ({
  token,
  pageStartMs,
  upcomingColor,
  activeColor,
  allCaps,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  colorTransitionMs,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000 + pageStartMs;
  const isPast = currentTimeMs >= token.toMs;

  // Smooth color transition over colorTransitionMs
  const transitionProgress = interpolate(
    currentTimeMs,
    [token.fromMs, token.fromMs + colorTransitionMs],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const color =
    transitionProgress >= 1 || isPast
      ? activeColor
      : interpolateColors(transitionProgress, [0, 1], [upcomingColor, activeColor]);

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        color,
        textTransform: allCaps ? "uppercase" : "none",
        letterSpacing,
        lineHeight: 1.1,
        whiteSpace: "nowrap",
      }}
    >
      {token.text}
    </span>
  );
};

// ---------------------------------------------------------------------------
// PaperIIStrip — one rounded white strip containing one line of words
// ---------------------------------------------------------------------------

const PaperIIStrip: React.FC<{
  tokens: TikTokToken[];
  pageStartMs: number;
  paperColor: string;
  upcomingColor: string;
  activeColor: string;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  colorTransitionMs: number;
  stripPaddingX: number;
  stripPaddingY: number;
  borderRadius: number;
}> = ({
  tokens,
  pageStartMs,
  paperColor,
  upcomingColor,
  activeColor,
  allCaps,
  fontSize,
  fontFamily,
  fontWeight,
  letterSpacing,
  colorTransitionMs,
  stripPaddingX,
  stripPaddingY,
  borderRadius,
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: `${stripPaddingY}px ${stripPaddingX}px`,
        backgroundColor: paperColor,
        borderRadius,
        boxShadow: "0 2px 6px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      {tokens.map((token, idx) => (
        <PaperIIWord
          key={idx}
          token={token}
          pageStartMs={pageStartMs}
          upcomingColor={upcomingColor}
          activeColor={activeColor}
          allCaps={allCaps}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          colorTransitionMs={colorTransitionMs}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PaperIIPage — one caption page (Sequence), splits tokens into strip lines
// ---------------------------------------------------------------------------

const PaperIIPage: React.FC<{
  page: TikTokPage;
  maxWordsPerLine: number;
  stripGap: number;
  slideDistance: number;
  paperColor: string;
  upcomingColor: string;
  activeColor: string;
  allCaps: boolean;
  fontSize: number;
  fontFamily: string;
  fontWeight: number | string;
  letterSpacing: string;
  colorTransitionMs: number;
  stripPaddingX: number;
  stripPaddingY: number;
  borderRadius: number;
}> = ({
  page,
  maxWordsPerLine,
  stripGap,
  slideDistance,
  ...stripProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split tokens into lines
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
    lines.push(page.tokens.slice(i, i + maxWordsPerLine));
  }

  // Simple fade in/out
  const pageLocalMs = (frame / fps) * 1000;
  const fadeInOpacity = interpolate(
    pageLocalMs,
    [0, 120],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const fadeOutOpacity = interpolate(
    pageLocalMs,
    [page.durationMs - 150, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: stripGap,
        opacity: Math.min(fadeInOpacity, fadeOutOpacity),
      }}
    >
      {lines.map((lineTokens, lineIdx) => (
        <PaperIIStrip
          key={lineIdx}
          tokens={lineTokens}
          pageStartMs={page.startMs}
          {...stripProps}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// TornPaperOverlay — torn paper asset + text strips with stop-motion animation
// ---------------------------------------------------------------------------

const TornPaperOverlay: React.FC<{
  entry: TornPaperEntry;
}> = ({ entry }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearFrame = msToFrames(entry.appearAtMs, fps);
  const disappearFrame = msToFrames(entry.disappearAtMs, fps);

  if (frame < appearFrame - 2) return null;
  if (frame > disappearFrame + 24) return null;

  // Stop-motion quantize for paper (~8fps)
  const stopFrame = Math.floor(frame / 4) * 4;

  // Seeded random for deterministic per-frame jitter
  const jitter = (seed: number) => {
    let s = (seed * 16807 + 11) % 2147483647;
    return ((s & 0x7fffffff) / 0x7fffffff) * 2 - 1; // -1 to 1
  };

  // ===== PAPER ASSET: smooth fast slide down =====
  const paperElapsed = frame - appearFrame;
  const paperY = interpolate(paperElapsed, [0, 6], [-100, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const paperOpacity = interpolate(paperElapsed, [0, 2], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Paper exit: smooth fast slide up (delayed — strips exit first)
  const paperExitDelay = 6;
  const paperExitElapsed = frame - disappearFrame - paperExitDelay;
  const paperExitY = interpolate(paperExitElapsed, [0, 6], [0, -100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const paperExitOpacity = interpolate(paperExitElapsed, [3, 6], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const paperFinalY = paperY + (paperExitElapsed >= 0 ? paperExitY : 0);
  const paperFinalOpacity = paperOpacity * (paperExitElapsed >= 0 ? paperExitOpacity : 1);

  // ===== TEXT STRIPS: stop-motion slam from sides =====

  const stripsDelay = 8;
  const stripsAppear = appearFrame + stripsDelay;
  const strip1Elapsed = stopFrame - stripsAppear;
  const strip2Elapsed = stopFrame - stripsAppear - 8;

  const topRotation = entry.topStripRotation ?? -10;
  const bottomRotation = entry.bottomStripRotation ?? 7;

  // Strip 1 entrance: slam from right with overshoot settle
  const s1Steps = [
    { x: 500, y: -80, r: 30, o: 0 },
    { x: 120, y: -10, r: topRotation - 8, o: 1 },
    { x: -12, y: 5, r: topRotation + 3, o: 1 },  // overshoot past
    { x: 5, y: -2, r: topRotation - 1, o: 1 },   // bounce back
    { x: 0, y: 0, r: topRotation, o: 1 },         // settle
  ];
  const s1Step = Math.min(Math.max(Math.floor(strip1Elapsed / 2), 0), s1Steps.length - 1);
  const s1 = strip1Elapsed >= 0 ? s1Steps[s1Step] : s1Steps[0];

  // Strip 2 entrance: slam from left with overshoot settle
  const s2Steps = [
    { x: -500, y: 70, r: -25, o: 0 },
    { x: -100, y: 10, r: bottomRotation + 8, o: 1 },
    { x: 15, y: -4, r: bottomRotation - 3, o: 1 },  // overshoot
    { x: -4, y: 2, r: bottomRotation + 1, o: 1 },   // bounce back
    { x: 0, y: 0, r: bottomRotation, o: 1 },         // settle
  ];
  const s2Step = Math.min(Math.max(Math.floor(strip2Elapsed / 2), 0), s2Steps.length - 1);
  const s2 = strip2Elapsed >= 0 ? s2Steps[s2Step] : s2Steps[0];

  // Idle jitter
  const s1Idle = s1Step >= s1Steps.length - 1 && stopFrame < disappearFrame;
  const s2Idle = s2Step >= s2Steps.length - 1 && stopFrame < disappearFrame;

  // Strip exit
  const stripExitElapsed = stopFrame - disappearFrame;
  const isStripExiting = stripExitElapsed >= 0;

  // Exit: reverse of entrance — strips fly back the way they came
  const s1ExitSteps = [
    { x: 0, y: 0, r: topRotation, o: 1 },
    { x: 120, y: -10, r: topRotation - 8, o: 1 },
    { x: 500, y: -80, r: 30, o: 0 },
  ];
  const s1ExitStep = Math.min(Math.max(Math.floor(stripExitElapsed / 2), 0), s1ExitSteps.length - 1);
  const s1Exit = isStripExiting ? s1ExitSteps[s1ExitStep] : { x: 0, y: 0, r: 0, o: 1 };

  const s2ExitSteps = [
    { x: 0, y: 0, r: bottomRotation, o: 1 },
    { x: -100, y: 10, r: bottomRotation + 8, o: 1 },
    { x: -500, y: 70, r: -25, o: 0 },
  ];
  const s2ExitStep = Math.min(Math.max(Math.floor((stripExitElapsed - 2) / 2), 0), s2ExitSteps.length - 1);
  const s2Exit = isStripExiting ? s2ExitSteps[s2ExitStep] : { x: 0, y: 0, r: 0, o: 1 };

  const s1Final = {
    x: (isStripExiting ? s1Exit.x : s1.x) + (s1Idle ? jitter(stopFrame * 11 + 19) * 2 : 0),
    y: (isStripExiting ? s1Exit.y : s1.y) + (s1Idle ? jitter(stopFrame * 5 + 41) * 2 : 0),
    r: (isStripExiting ? s1Exit.r : s1.r) + (s1Idle ? jitter(stopFrame * 3 + 7) * 1.5 : 0),
    o: isStripExiting ? s1Exit.o : s1.o,
  };
  const s2Final = {
    x: (isStripExiting ? s2Exit.x : s2.x) + (s2Idle ? jitter(stopFrame * 17 + 37) * 2 : 0),
    y: (isStripExiting ? s2Exit.y : s2.y) + (s2Idle ? jitter(stopFrame * 7 + 59) * 2 : 0),
    r: (isStripExiting ? s2Exit.r : s2.r) + (s2Idle ? jitter(stopFrame * 9 + 23) * 1.5 : 0),
    o: isStripExiting ? s2Exit.o : s2.o,
  };

  // Customizable props with defaults
  const stripColor = entry.stripColor ?? "#1A1A1A";
  const stripTextColor = entry.stripTextColor ?? "#FFFFFF";
  const stripFontFamily = entry.stripFontFamily ?? FONT_FAMILIES.oswald;
  const stripFontSize = entry.stripFontSize ?? 72;
  const stripFontWeight = entry.stripFontWeight ?? 700;
  const stripLetterSpacing = entry.stripLetterSpacing ?? "0.06em";
  const shadowColor = entry.shadowColor ?? "#4CAF50";
  const shadowOffsetX = entry.shadowOffsetX ?? 10;
  const shadowOffsetY = entry.shadowOffsetY ?? 9;
  const stripPadding = entry.stripPadding ?? [14, 32];
  const stripGap = entry.stripGap ?? 120;
  const stripsPositionTop = entry.stripsPositionTop ?? "25%";

  const dotTexture = {
    backgroundImage: `
      radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px),
      radial-gradient(circle, rgba(255,255,255,0.05) 1.5px, transparent 1.5px),
      radial-gradient(circle, rgba(255,255,255,0.10) 1.5px, transparent 1.5px)
    `,
    backgroundSize: "10px 10px, 10px 10px, 10px 10px",
    backgroundPosition: "0px 0px, 5px 5px, 3px 8px",
  };

  const textStyle: React.CSSProperties = {
    fontFamily: stripFontFamily,
    fontSize: stripFontSize,
    fontWeight: stripFontWeight,
    color: stripTextColor,
    textTransform: "uppercase",
    letterSpacing: stripLetterSpacing,
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill>
      {/* LAYER 1: Torn paper image — smooth slide down */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          transform: `translateY(${paperFinalY}%)`,
          opacity: paperFinalOpacity,
        }}
      >
        <Img
          src={staticFile("torn-paper.png")}
          style={{
            width: "100%",
            display: "block",
          }}
        />
      </div>

      {/* LAYER 2: Text strips — stop-motion slam from sides */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: stripsPositionTop,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: stripGap,
        }}
      >
        {/* Top strip — slams from right */}
        <div style={{
          position: "relative",
          display: "inline-block",
          transform: `translate(${s1Final.x}px, ${s1Final.y}px) rotate(${s1Final.r}deg)`,
          opacity: s1Final.o,
        }}>
          <div style={{ position: "absolute", top: shadowOffsetY, left: shadowOffsetX, width: "100%", height: "100%", backgroundColor: shadowColor }} />
          <div style={{ position: "relative", backgroundColor: stripColor, ...dotTexture, padding: `${stripPadding[0]}px ${stripPadding[1]}px` }}>
            <span style={textStyle}>{entry.topText}</span>
          </div>
        </div>

        {/* Bottom strip — slams from left */}
        <div style={{
          position: "relative",
          display: "inline-block",
          marginLeft: 10,
          transform: `translate(${s2Final.x}px, ${s2Final.y}px) rotate(${s2Final.r}deg)`,
          opacity: s2Final.o,
        }}>
          <div style={{ position: "absolute", top: shadowOffsetY, left: shadowOffsetX, width: "100%", height: "100%", backgroundColor: shadowColor }} />
          <div style={{ position: "relative", backgroundColor: stripColor, ...dotTexture, padding: `${stripPadding[0]}px ${stripPadding[1]}px` }}>
            <span style={textStyle}>{entry.bottomText}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// NewspaperTransition — full-screen newspaper slides bottom to top
// ---------------------------------------------------------------------------

const NewspaperTransition: React.FC<{
  entry: NewspaperTransitionEntry;
}> = ({ entry }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const atFrame = msToFrames(entry.atMs, fps);
  const elapsed = frame - atFrame;

  // Each entry: [frameOffset, yPosition]
  // Uneven timing — fast slam through the middle, snappy edges
  const keyframes: [number, number][] = [
    [0, 1920],    // off screen below
    [2, 1000],    // rush in
    [4, 300],     // almost there
    [5, 0],       // BAM — full cover
    [7, 0],       // hold for 2 frames
    [9, -400],    // start leaving
    [11, -1100],  // rush out
    [13, -1920],  // gone
  ];

  // Find current position
  let y = 1920;
  for (let i = 0; i < keyframes.length - 1; i++) {
    const [f1, y1] = keyframes[i];
    const [f2] = keyframes[i + 1];
    if (elapsed >= f1 && elapsed < f2) {
      y = y1;
      break;
    }
  }
  if (elapsed >= keyframes[keyframes.length - 1][0]) {
    return null; // done
  }
  if (elapsed < 0) return null;

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("torn-newspaper.png")}
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateY(${y}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PaperII — main exported component
// ---------------------------------------------------------------------------

export const PaperII: React.FC<PaperIIProps> = ({
  pages,
  paperColor = "#FFFFFF",
  upcomingColor = "#B0B0B0",
  activeColor = "#1A1A1A",
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 64,
  fontWeight = 900,
  position = "bottom",
  maxWordsPerLine = 4,
  allCaps = false,
  letterSpacing = "0.03em",
  stripPaddingX = 44,
  stripPaddingY = 26,
  stripGap = 10,
  borderRadius = 28,
  slideDistance = 20,
  colorTransitionMs = 60,
  tornPapers = [],
  newspaperTransitions = [],
}) => {
  const { fps } = useVideoConfig();
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {/* Newspaper transitions — behind everything */}
      {newspaperTransitions.map((entry, i) => (
        <NewspaperTransition key={i} entry={entry} />
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
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                ...positionStyle,
              }}
            >
              <PaperIIPage
                page={page}
                maxWordsPerLine={maxWordsPerLine}
                stripGap={stripGap}
                slideDistance={slideDistance}
                paperColor={paperColor}
                upcomingColor={upcomingColor}
                activeColor={activeColor}
                allCaps={allCaps}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                colorTransitionMs={colorTransitionMs}
                stripPaddingX={stripPaddingX}
                stripPaddingY={stripPaddingY}
                borderRadius={borderRadius}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Torn paper overlays */}
      {tornPapers.map((entry, i) => (
        <TornPaperOverlay key={i} entry={entry} />
      ))}
    </AbsoluteFill>
  );
};
