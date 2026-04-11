import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SpringConfig } from "remotion";
import type { TikTokToken } from "../../types/captions";
import type { KineticScatterProps } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { getCaptionPositionStyle } from "../../utils/captionPosition";

// ── Default spring config ──────────────────────────────────────────────────
// Low damping + moderate stiffness = elastic snap with slight overshoot.
// overshootClamping: false allows the satisfying spring bounce.

const SCATTER_SPRING: SpringConfig = {
  damping: 8,
  mass: 0.4,
  stiffness: 200,
  overshootClamping: false,
};

// ── Helper: Deterministic PRNG ─────────────────────────────────────────────
// Sin-hash produces a deterministic 0-1 value for any two seed inputs,
// ensuring identical scatter positions across Remotion render passes.

function seededRandom(seed1: number, seed2: number): number {
  const x = Math.sin(seed1 * 127.1 + seed2 * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Helper: Generate scatter position ──────────────────────────────────────
// Computes a deterministic scattered position for a letter based on
// word index and character index. Returns offsets relative to the
// letter's natural inline-flow position.

interface ScatterConfig {
  scatterX: number;
  scatterY: number;
  scatterRotation: number;
  scatterScale: number;
}

function generateScatterPosition(
  wordIndex: number,
  charIndex: number,
  frameWidth: number,
  frameHeight: number,
  scatterRange: number,
): ScatterConfig {
  const r1 = seededRandom(wordIndex * 100 + charIndex, 1);
  const r2 = seededRandom(wordIndex * 100 + charIndex, 2);
  const r3 = seededRandom(wordIndex * 100 + charIndex, 3);
  const r4 = seededRandom(wordIndex * 100 + charIndex, 4);

  return {
    scatterX: (r1 - 0.5) * 2 * (frameWidth / 2) * scatterRange,
    scatterY: (r2 - 0.5) * 2 * (frameHeight / 2) * scatterRange,
    scatterRotation: (r3 - 0.5) * 360,
    scatterScale: 0.5 + r4 * 1.0,
  };
}

// ── Helper: Vary spring config per letter ──────────────────────────────────
// Applies +/-10% variation to mass and stiffness so letters don't all
// land at the exact same moment — produces an organic, physical feel.

function varySpringConfig(
  baseConfig: SpringConfig,
  wordIndex: number,
  charIndex: number,
): SpringConfig {
  const massVariation = seededRandom(wordIndex * 50 + charIndex, 100);
  const stiffnessVariation = seededRandom(wordIndex * 50 + charIndex, 200);

  // Map 0-1 to 0.9-1.1 (±10%)
  const massMul = 0.9 + massVariation * 0.2;
  const stiffMul = 0.9 + stiffnessVariation * 0.2;

  return {
    ...baseConfig,
    mass: (baseConfig.mass ?? 1) * massMul,
    stiffness: (baseConfig.stiffness ?? 170) * stiffMul,
  };
}

// ── ScatterLetter ──────────────────────────────────────────────────────────
// Animates a single character from its scattered position to its natural
// inline-flow position using spring physics. The transform offsets FROM
// the letter's natural position — layout engine handles the assembled state.

const ScatterLetter: React.FC<{
  char: string;
  wordIndex: number;
  charIndex: number;
  charCount: number;
  entryFrame: number;
  letterStaggerFrames: number;
  scatterConfig: ScatterConfig;
  springConfig: SpringConfig;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  primaryColor: string;
  textShadow: string;
}> = ({
  char,
  wordIndex,
  charIndex,
  charCount,
  entryFrame,
  letterStaggerFrames,
  scatterConfig,
  springConfig,
  fontFamily,
  fontSize,
  fontWeight,
  primaryColor,
  textShadow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stagger: distribute delay evenly across letters
  const staggerDelay =
    charCount > 1
      ? Math.round((charIndex / (charCount - 1)) * letterStaggerFrames)
      : 0;

  // Vary spring per letter for organic feel
  const variedConfig = varySpringConfig(springConfig, wordIndex, charIndex);

  // Assembly progress: 0 = scattered, 1 = assembled
  const assembleProgress = spring({
    fps,
    frame: frame - entryFrame - staggerDelay,
    config: variedConfig,
  });

  // Interpolate from scattered to assembled position
  const translateX = interpolate(
    assembleProgress,
    [0, 1],
    [scatterConfig.scatterX, 0],
  );
  const translateY = interpolate(
    assembleProgress,
    [0, 1],
    [scatterConfig.scatterY, 0],
  );
  const rotation = interpolate(
    assembleProgress,
    [0, 1],
    [scatterConfig.scatterRotation, 0],
  );
  const scale = interpolate(
    assembleProgress,
    [0, 1],
    [scatterConfig.scatterScale, 1],
  );

  // Opacity: scattered letters are slightly transparent, fade to full
  const opacity = interpolate(assembleProgress, [0, 0.15], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        color: primaryColor,
        textShadow,
        lineHeight: 1.1,
        transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: "center center",
        opacity,
        willChange: "transform, opacity",
      }}
    >
      {char}
    </span>
  );
};

// ── ScatterWord ────────────────────────────────────────────────────────────
// Container for a single word. Splits text into characters, pre-computes
// deterministic scatter positions, and renders each as a ScatterLetter.

const ScatterWord: React.FC<{
  token: TikTokToken;
  wordIndex: number;
  entryFrame: number;
  letterStaggerFrames: number;
  scatterRange: number;
  springConfig: SpringConfig;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  primaryColor: string;
  textShadow: string;
  allCaps: boolean;
}> = ({
  token,
  wordIndex,
  entryFrame,
  letterStaggerFrames,
  scatterRange,
  springConfig,
  fontFamily,
  fontSize,
  fontWeight,
  primaryColor,
  textShadow,
  allCaps,
}) => {
  const { width: frameWidth, height: frameHeight } = useVideoConfig();

  const displayText = allCaps ? token.text.toUpperCase() : token.text;
  const chars = displayText.split("");

  // Pre-compute scatter positions (deterministic, stable across renders)
  const scatterConfigs = useMemo(
    () =>
      chars.map((_, charIndex) =>
        generateScatterPosition(
          wordIndex,
          charIndex,
          frameWidth,
          frameHeight,
          scatterRange,
        ),
      ),
    [wordIndex, chars.length, frameWidth, frameHeight, scatterRange],
  );

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {chars.map((char, charIndex) => (
        <ScatterLetter
          key={charIndex}
          char={char}
          wordIndex={wordIndex}
          charIndex={charIndex}
          charCount={chars.length}
          entryFrame={entryFrame}
          letterStaggerFrames={letterStaggerFrames}
          scatterConfig={scatterConfigs[charIndex]}
          springConfig={springConfig}
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontWeight={fontWeight}
          primaryColor={primaryColor}
          textShadow={textShadow}
        />
      ))}
    </div>
  );
};

// ── KineticScatter (main export) ───────────────────────────────────────────
// ONE WORD AT A TIME mode. Flattens all tokens from all pages into a single
// array, then creates a Sequence per token. Letters appear scattered on screen
// for `scatterVisibleFrames` before the spring assembly triggers at the
// word's fromMs timestamp.

export const KineticScatter: React.FC<KineticScatterProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.anton,
  fontSize = 90,
  fontWeight = 900,
  primaryColor = "#FFFFFF",
  position = "center",
  springConfig = SCATTER_SPRING,
  letterStaggerFrames = 4,
  textShadow = "0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)",
  scatterRange = 0.7,
  allCaps = true,
  scatterVisibleFrames = 12,
}) => {
  const { fps } = useVideoConfig();

  // Flatten all tokens from all pages into a single ordered list
  const allTokens: { token: TikTokToken; wordIndex: number }[] = useMemo(() => {
    const tokens: { token: TikTokToken; wordIndex: number }[] = [];
    let wordIndex = 0;
    for (const page of pages) {
      for (const token of page.tokens) {
        tokens.push({ token, wordIndex });
        wordIndex++;
      }
    }
    return tokens;
  }, [pages]);

  // Position styling from shared utility
  const positionStyle = getCaptionPositionStyle(position);

  return (
    <AbsoluteFill>
      {allTokens.map(({ token, wordIndex }) => {
        const tokenStartFrame = msToFrames(token.fromMs, fps);
        const tokenEndFrame = msToFrames(token.toMs, fps);
        const tokenDuration = tokenEndFrame - tokenStartFrame;

        // Sequence starts early so scatter is visible before assembly
        const seqFrom = Math.max(0, tokenStartFrame - scatterVisibleFrames);
        // Duration: scatter lead-in + word duration + buffer for spring settle
        const seqDuration = scatterVisibleFrames + tokenDuration + 5;

        // Assembly triggers at scatterVisibleFrames into the Sequence
        // (which aligns with the word's actual fromMs timestamp)
        const entryFrame = tokenStartFrame - seqFrom;

        return (
          <Sequence
            key={wordIndex}
            from={seqFrom}
            durationInFrames={seqDuration}
          >
            <AbsoluteFill
              style={{
                ...positionStyle,
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ScatterWord
                token={token}
                wordIndex={wordIndex}
                entryFrame={entryFrame}
                letterStaggerFrames={letterStaggerFrames}
                scatterRange={scatterRange}
                springConfig={springConfig}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                primaryColor={primaryColor}
                textShadow={textShadow}
                allCaps={allCaps}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
