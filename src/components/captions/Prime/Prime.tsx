import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../shared/types";
import type { PrimeProps, EchoOverlayEntry } from "./types";
import { FONT_FAMILIES } from "../../../utils/fonts";
import { msToFrames } from "../../../utils/timing";
import { CAPTION_PADDING } from "../../../utils/captionPosition";

// ---------------------------------------------------------------------------
// PrimeWord — single word with staggered entrance
// ---------------------------------------------------------------------------

const PrimeWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  wordIndex: number;
  isLine2: boolean;
  isSpecial: boolean;
  line1Color: string;
  line2Color: string;
  line1FontSize: number;
  line2FontSize: number;
  line1FontWeight: number | string;
  line2FontWeight: number | string;
  fontFamily: string;
  specialFontFamily: string;
  specialColor: string;
  letterSpacing: string;
  textShadow: string;
}> = ({
  token,
  pageStartMs,
  wordIndex,
  isLine2,
  isSpecial,
  line1Color,
  line2Color,
  line1FontSize,
  line2FontSize,
  line1FontWeight,
  line2FontWeight,
  fontFamily,
  specialFontFamily,
  specialColor,
  letterSpacing,
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance per word
  const activateFrame = Math.round(((token.fromMs - pageStartMs) / 1000) * fps);
  const wordSpring = spring({
    frame: frame - activateFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(fps * 0.25),
  });

  const slideY = interpolate(wordSpring, [0, 1], [20, 0]);
  const wordOpacity = interpolate(wordSpring, [0, 1], [0, 1]);

  const color = isSpecial ? specialColor : line1Color;
  const fontSize = isSpecial ? line2FontSize : (isLine2 ? line2FontSize : line1FontSize);
  const fontWeightVal = isLine2 ? line2FontWeight : line1FontWeight;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: isSpecial ? specialFontFamily : fontFamily,
        fontSize,
        fontWeight: isSpecial ? 600 : fontWeightVal,
        fontStyle: isSpecial ? "italic" : "normal",
        color,
        letterSpacing,
        lineHeight: 1.1,
        textShadow,
        textTransform: "lowercase",
        whiteSpace: "nowrap",
        transform: `translateY(${slideY}px)`,
        opacity: wordOpacity,
        marginRight: 12,
      }}
    >
      {token.text}
    </span>
  );
};

// ---------------------------------------------------------------------------
// PrimePage — splits tokens into lines, renders word by word
// ---------------------------------------------------------------------------

const PrimePage: React.FC<{
  page: TikTokPage;
  maxWordsPerLine: number;
  lineGap: number;
  specialWords: string[];
  line1Color: string;
  line2Color: string;
  line1FontSize: number;
  line2FontSize: number;
  line1FontWeight: number | string;
  line2FontWeight: number | string;
  fontFamily: string;
  specialFontFamily: string;
  specialColor: string;
  letterSpacing: string;
  textShadow: string;
}> = ({
  page,
  maxWordsPerLine,
  lineGap,
  specialWords,
  ...wordProps
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isSpecial = (text: string) =>
    specialWords.some((w) => w.toLowerCase() === text.toLowerCase());

  // Split tokens into lines — special words get their own line
  const lines: { tokens: TikTokToken[]; hasSpecial: boolean }[] = [];
  let buffer: TikTokToken[] = [];

  for (const token of page.tokens) {
    if (isSpecial(token.text)) {
      if (buffer.length > 0) {
        lines.push({ tokens: buffer, hasSpecial: false });
        buffer = [];
      }
      lines.push({ tokens: [token], hasSpecial: true });
    } else {
      buffer.push(token);
      if (buffer.length >= maxWordsPerLine) {
        lines.push({ tokens: buffer, hasSpecial: false });
        buffer = [];
      }
    }
  }
  if (buffer.length > 0) {
    lines.push({ tokens: buffer, hasSpecial: false });
  }

  // Fade out
  const pageLocalMs = (frame / fps) * 1000;
  const fadeOut = interpolate(
    pageLocalMs,
    [page.durationMs - 120, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  let globalWordIdx = 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {(() => {
        let normalLineCount = 0;
        return lines.map((line, lineIdx) => {
        const isLine2 = !line.hasSpecial && normalLineCount++ >= 1;
        return (
          <div
            key={lineIdx}
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: lineIdx > 0 ? lineGap : 0,
              ...(line.hasSpecial ? { justifyContent: "center" } : {}),
            }}
          >
            {line.tokens.map((token, idx) => {
              const wi = globalWordIdx++;
              return (
                <PrimeWord
                  key={idx}
                  token={token}
                  pageStartMs={page.startMs}
                  wordIndex={wi}
                  isLine2={isLine2}
                  isSpecial={line.hasSpecial}
                  {...wordProps}
                  line2FontSize={line.hasSpecial ? wordProps.line2FontSize * 2 : wordProps.line2FontSize}
                  line1FontSize={line.hasSpecial ? wordProps.line1FontSize * 2 : wordProps.line1FontSize}
                />
              );
            })}
          </div>
        );
      });
      })()}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EchoOverlay — stacked echo text effect, full screen
// ---------------------------------------------------------------------------

const EchoOverlay: React.FC<{
  entry: EchoOverlayEntry;
}> = ({ entry }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearFrame = msToFrames(entry.appearAtMs, fps);
  const disappearFrame = msToFrames(entry.disappearAtMs, fps);

  if (frame < appearFrame - 3) return null;
  if (frame > disappearFrame + 15) return null;

  const copies = entry.copies ?? 5;
  const color = entry.color ?? "#5CE6D6";
  const echoFontFamily = FONT_FAMILIES.bebasNeue;
  const echoFontSize = entry.fontSize ?? 140;
  const vOffset = entry.verticalOffset ?? 70;
  const bgColor = entry.bgColor ?? "#0F0F1A";

  // Background fade in/out
  const bgIn = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(fps * 0.3),
  });
  const bgOut = spring({
    frame: frame - disappearFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(fps * 0.3),
  });
  const bgOpacity = bgIn - bgOut;

  // Continuous upward scroll from the start
  const scrollElapsed = Math.max(0, frame - appearFrame);
  const echoDriftY = scrollElapsed * -2;

  // Exit: accelerate scroll upward + fade
  const exitElapsed = Math.max(0, frame - disappearFrame);
  const exitAccel = exitElapsed * exitElapsed * 1.5; // quadratic acceleration
  const exitOp = interpolate(exitElapsed, [0, 10], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Hero scale punch
  const heroPunch = spring({
    frame: frame - appearFrame - 2,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.4 },
  });
  const heroScale = interpolate(heroPunch, [0, 1], [0.85, 1]);

  return (
    <AbsoluteFill>
      {/* Dark background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: bgColor,
          opacity: bgOpacity * 0.95,
        }}
      />

      {/* Echo copies — rendered top (most faded) to bottom (hero) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: bgOpacity,
          perspective: 800,
        }}
      >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `translateX(5%) translateY(${echoDriftY - exitAccel}px) rotateY(12deg)`,
          transformStyle: "preserve-3d",
          transformOrigin: "85% center",
          opacity: exitOp,
        }}
      >
        {/* Echo copies above hero */}
        {Array.from({ length: copies }).map((_, i) => {
          const copyIdx = copies - i;
          const yPos = -copyIdx * vOffset;
          const copyOpacity = interpolate(copyIdx, [1, copies], [0.5, 0.06]);


          return (
            <div
              key={`up-${i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateY(${yPos}px)`,
                fontFamily: echoFontFamily,
                fontSize: echoFontSize,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                width: "100%",
                textAlign: "center",
                opacity: copyOpacity,
                color,
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: `2px ${color}`,
              }}
            >
              {entry.text}
            </div>
          );
        })}

        {/* Hero — center, solid fill, fills width */}
        {(() => {
          return (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) scale(${heroScale})`,
                fontFamily: echoFontFamily,
                fontSize: echoFontSize,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                width: "100%",
                textAlign: "center",
                color,
              }}
            >
              {entry.text}
            </div>
          );
        })()}

        {/* Echo copies below hero */}
        {Array.from({ length: copies }).map((_, i) => {
          const copyIdx = i + 1;
          const yPos = copyIdx * vOffset;
          const copyOpacity = interpolate(copyIdx, [1, copies], [0.5, 0.06]);


          return (
            <div
              key={`down-${i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateY(${yPos}px)`,
                fontFamily: echoFontFamily,
                fontSize: echoFontSize,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                width: "100%",
                textAlign: "center",
                opacity: copyOpacity,
                color,
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: `2px ${color}`,
              }}
            >
              {entry.text}
            </div>
          );
        })}
      </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Prime — main exported component
// ---------------------------------------------------------------------------

export const Prime: React.FC<PrimeProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.inter,
  fontSize = 66,
  fontWeight = 800,
  position = "bottom",
  line1Color = "#FFFFFF",
  line2Color = "#3BA5FF",
  line1FontSize = 52,
  line2FontSize = 66,
  line1FontWeight = 600,
  line2FontWeight = 800,
  maxWordsPerLine = 3,
  letterSpacing = "0.01em",
  lineGap = -30,
  textShadow = "0 2px 8px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.4)",
  leftPadding = "6%",
  specialWords = [],
  specialFontFamily = FONT_FAMILIES.playfairDisplay,
  specialColor = "#5ED4E8",
  titleText,
  titleAppearAtMs,
  titleDisappearAtMs,
  titleFontSize = 200,
  titleColor,
  echoOverlays = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleAppearFrame = titleAppearAtMs != null ? msToFrames(titleAppearAtMs, fps) : -1;
  const titleDisappearFrame = titleDisappearAtMs != null ? msToFrames(titleDisappearAtMs, fps) : -1;
  const showTitle = titleText && titleAppearFrame >= 0 && frame >= titleAppearFrame && frame <= titleDisappearFrame + 15;


  return (
    <AbsoluteFill>
      {/* Title at top — letter by letter drop + shine */}
      {showTitle && titleText && (() => {
        // Shine sweeps after all letters land
        const allLandedFrame = titleAppearFrame + titleText.length * 1 + Math.round(fps * 0.2);
        const shineProgress = interpolate(
          frame,
          [allLandedFrame, allLandedFrame + 14],
          [-20, 120],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
        <div
          style={{
            position: "absolute",
            top: -50,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "baseline",
            whiteSpace: "nowrap",
            overflow: "visible",
          }}
        >
          {titleText.split("").map((char, charIdx) => {
            // Each letter drops from above with stagger
            const charDelay = titleAppearFrame + charIdx * 1;
            const dropSpring = spring({
              frame: frame - charDelay,
              fps,
              config: { damping: 200 },
              durationInFrames: Math.round(fps * 0.2),
            });
            const charY = interpolate(dropSpring, [0, 1], [-30, 0]);
            const charOpacity = interpolate(dropSpring, [0, 1], [0, 1]);

            // Exit: letters fly up, reverse stagger
            const totalChars = titleText.length;
            const exitCharDelay = titleDisappearFrame + (totalChars - 1 - charIdx) * 1;
            const exitSpring = spring({
              frame: frame - exitCharDelay,
              fps,
              config: { damping: 200 },
              durationInFrames: Math.round(fps * 0.25),
            });
            const exitY = interpolate(exitSpring, [0, 1], [0, -30]);
            const exitOpacity = interpolate(exitSpring, [0, 0.6], [1, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });

            const isExitingTitle = frame >= titleDisappearFrame;

            // Shine: each letter flashes white as the wave passes
            const charPercent = (charIdx / totalChars) * 100;
            const shineDistance = Math.abs(shineProgress - charPercent);
            const shineIntensity = shineDistance < 20
              ? interpolate(shineDistance, [0, 20], [1, 0])
              : 0;
            const baseColor = titleColor ?? specialColor;
            const letterColor = shineIntensity > 0
              ? `color-mix(in srgb, #FFFFFF ${Math.round(shineIntensity * 70)}%, ${baseColor})`
              : baseColor;

            return (
              <span
                key={charIdx}
                style={{
                  display: "inline-block",
                  fontFamily: FONT_FAMILIES.feelingPassionate,
                  fontSize: titleFontSize,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: letterColor,
                  textShadow: shineIntensity > 0.3
                    ? `${textShadow}, 0 0 ${12 * shineIntensity}px rgba(255,255,255,${shineIntensity * 0.5})`
                    : textShadow,
                  textTransform: "lowercase",
                  letterSpacing: "0.02em",
                  transform: isExitingTitle
                    ? `translateY(${exitY}px)`
                    : `translateY(${charY}px)`,
                  opacity: isExitingTitle ? exitOpacity : charOpacity,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}

        </div>
        );
      })()}

      {/* Echo overlays — behind captions */}
      {echoOverlays.map((entry, i) => (
        <EchoOverlay key={i} entry={entry} />
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
                ...(position === "top"
                  ? { top: CAPTION_PADDING.top, transform: "translateX(-50%)" }
                  : position === "center"
                    ? { top: "50%", transform: "translate(-50%, -50%)" }
                    : { bottom: CAPTION_PADDING.bottomSafe, transform: "translateX(-50%)" }
                ),
              }}
            >
              <PrimePage
                page={page}
                maxWordsPerLine={maxWordsPerLine}
                lineGap={lineGap}
                specialWords={specialWords}
                line1Color={line1Color}
                line2Color={line2Color}
                line1FontSize={line1FontSize}
                line2FontSize={line2FontSize}
                line1FontWeight={line1FontWeight}
                line2FontWeight={line2FontWeight}
                fontFamily={fontFamily}
                specialFontFamily={specialFontFamily}
                specialColor={specialColor}
                letterSpacing={letterSpacing}
                textShadow={textShadow}
              />
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
