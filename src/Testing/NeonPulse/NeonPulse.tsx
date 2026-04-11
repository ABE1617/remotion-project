import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { TikTokToken, TikTokPage } from "../../types/captions";
import type { NeonPulseProps, NeonColorScheme } from "./types";
import { NEON_SCHEMES } from "./types";
import { FONT_FAMILIES } from "../../utils/fonts";
import { msToFrames } from "../../utils/timing";
import { CAPTION_PADDING } from "../../utils/captionPosition";
import { hexToRgba } from "../../utils/colors";

// ── Helper: Multi-layer neon text-shadow ────────────────────────────────────
// 8 layers creating realistic neon falloff:
//   1-2: Inner core (bright, tight)
//   3-4: Middle glow (primary neon color, medium spread)
//   5-6: Outer bloom (wide, softer)
//   7-8: Background ambient (very wide, faint atmosphere)

function buildNeonTextShadow(
  coreColor: string,
  glowColor: string,
  intensity: number,
  glowMultiplier: number,
): string {
  const layers: Array<{ color: string; blur: number; baseOpacity: number }> = [
    // Inner core
    { color: coreColor, blur: 2, baseOpacity: 0.95 },
    { color: coreColor, blur: 4, baseOpacity: 0.8 },
    // Middle glow
    { color: glowColor, blur: 8, baseOpacity: 0.7 },
    { color: glowColor, blur: 14, baseOpacity: 0.55 },
    // Outer bloom
    { color: glowColor, blur: 30, baseOpacity: 0.35 },
    { color: glowColor, blur: 50, baseOpacity: 0.2 },
    // Background ambient
    { color: glowColor, blur: 90, baseOpacity: 0.1 },
    { color: glowColor, blur: 120, baseOpacity: 0.05 },
  ];

  return layers
    .map((layer) => {
      const scaledBlur = Math.round(layer.blur * glowMultiplier);
      const scaledOpacity = Math.min(layer.baseOpacity * intensity, 1);
      return `0 0 ${scaledBlur}px ${hexToRgba(layer.color, scaledOpacity)}`;
    })
    .join(", ");
}

// ── Helper: Deterministic jitter ────────────────────────────────────────────
// Returns 0-1, deterministic per (frame, seed) pair for reproducible renders.

function jitter(frame: number, seed: number): number {
  return Math.sin(frame * 127.1 + seed * 311.7) * 0.5 + 0.5;
}

// ── Helper: Neon tube flicker ───────────────────────────────────────────────
// ~12% of frames produce a subtle brightness dip, simulating tube flicker.

function getFlickerOpacity(
  frame: number,
  seed: number,
  enabled: boolean,
): number {
  if (!enabled) return 1;
  const j = jitter(frame, seed);
  if (j > 0.92) return 0.7;
  if (j > 0.88) return 0.85;
  return 1;
}

// ── Helper: Power-on flicker pattern ────────────────────────────────────────
// Staccato dark->flash->dark->half->dark->mostly->smooth ramp to full.
// NOT a smooth fade — mimics real neon sign startup behavior.

function getPowerOnIntensity(localFrame: number, duration: number): number {
  if (duration <= 0) return 1;
  const t = localFrame / duration;
  if (t >= 1) return 1;
  if (t < 0) return 0;

  // Staccato pattern
  if (t < 0.1) return 0;
  if (t < 0.15) return 0.9;
  if (t < 0.25) return 0.05;
  if (t < 0.35) return 0.7;
  if (t < 0.42) return 0.1;
  if (t < 0.55) return 0.85;
  if (t < 0.6) return 0.4;

  // Smooth ramp from 0.4 to 1.0 over remaining frames
  return interpolate(t, [0.6, 1.0], [0.8, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── NeonWord ────────────────────────────────────────────────────────────────

const NeonWord: React.FC<{
  token: TikTokToken;
  pageStartMs: number;
  tokenIndex: number;
  scheme: NeonColorScheme;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
  glowIntensity: number;
  pulseSpeed: number;
  flickerEnabled: boolean;
  powerOnProgress: number;
}> = ({
  token,
  pageStartMs,
  tokenIndex,
  scheme,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
  glowIntensity,
  pulseSpeed,
  flickerEnabled,
  powerOnProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current time in ms (Sequence-local)
  const pageLocalMs = (frame / fps) * 1000;

  // Token timing relative to page start
  const tokenStartMs = token.fromMs - pageStartMs;
  const tokenEndMs = token.toMs - pageStartMs;
  const tokenDurationMs = tokenEndMs - tokenStartMs;

  const isActive = pageLocalMs >= tokenStartMs && pageLocalMs < tokenEndMs;
  const isPast = pageLocalMs >= tokenEndMs;

  // ── Compute glow level ────────────────────────────────────────────────

  let glowLevel: number;

  if (isActive) {
    // Progress through current token (0 -> 1)
    const tokenProgress = Math.min(
      (pageLocalMs - tokenStartMs) / Math.max(tokenDurationMs, 1),
      1,
    );

    // Composite sine waves for organic neon pulse
    const wave1 =
      Math.sin(tokenProgress * Math.PI * 3 * pulseSpeed) * 0.15;
    const wave2 =
      Math.sin(tokenProgress * Math.PI * 7 * pulseSpeed) * 0.05;
    glowLevel = 0.85 + wave1 + wave2;

    // Onset brightness burst: quick spring adds +30% that decays
    const onsetFrame = msToFrames(tokenStartMs, fps);
    const onsetBurst = spring({
      frame: frame - onsetFrame,
      fps,
      config: { mass: 0.3, damping: 8, stiffness: 200 },
    });
    // Invert spring: starts at 1 (full burst) and settles to 0
    const burstDecay = 1 - onsetBurst;
    glowLevel += burstDecay * 0.3;
  } else if (isPast) {
    // Dim neon outline for spoken words
    glowLevel = 0.25;
  } else {
    // Very dim for upcoming words
    glowLevel = 0.2;
  }

  // Apply power-on multiplier
  const effectiveGlow = glowLevel * powerOnProgress;

  // Apply flicker
  const flickerOp = getFlickerOpacity(frame, tokenIndex * 7 + 3, flickerEnabled);
  const finalGlow = effectiveGlow * flickerOp;

  // ── Build text shadow ─────────────────────────────────────────────────
  const textShadow = buildNeonTextShadow(
    scheme.core,
    scheme.glow,
    glowIntensity * finalGlow,
    isActive ? 1.2 : 0.8,
  );

  // ── Text color ────────────────────────────────────────────────────────
  // Active: bright core. Inactive: glow color at reduced opacity.
  const textColor = isActive
    ? scheme.core
    : hexToRgba(scheme.glow, Math.min(finalGlow * 1.5, 1));

  // ── Active word scale ─────────────────────────────────────────────────
  let scale = 1;
  if (isActive) {
    const onsetFrame = msToFrames(tokenStartMs, fps);
    const scaleSpring = spring({
      frame: frame - onsetFrame,
      fps,
      config: { mass: 0.4, damping: 12, stiffness: 180 },
    });
    scale = interpolate(scaleSpring, [0, 1], [1.0, 1.05]);
  }

  const displayText = allCaps ? token.text.toUpperCase() : token.text;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontSize,
        fontWeight,
        color: textColor,
        letterSpacing: `${letterSpacing}em`,
        textShadow,
        lineHeight: 1.3,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        whiteSpace: "nowrap",
        willChange: "transform, text-shadow, color",
        transition: isPast ? "color 0.15s, text-shadow 0.15s" : undefined,
      }}
    >
      {displayText}
    </span>
  );
};

// ── NeonPage ────────────────────────────────────────────────────────────────

const NeonPage: React.FC<{
  page: TikTokPage;
  scheme: NeonColorScheme;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  letterSpacing: number;
  allCaps: boolean;
  maxWordsPerLine: number;
  glowIntensity: number;
  pulseSpeed: number;
  flickerEnabled: boolean;
  powerOnEntrance: boolean;
  powerOnDurationFrames: number;
}> = ({
  page,
  scheme,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  allCaps,
  maxWordsPerLine,
  glowIntensity,
  pulseSpeed,
  flickerEnabled,
  powerOnEntrance,
  powerOnDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page-local time for fade-out
  const pageLocalMs = (frame / fps) * 1000;

  // ── Power-on progress ─────────────────────────────────────────────────
  const powerOnProgress = powerOnEntrance
    ? getPowerOnIntensity(frame, powerOnDurationFrames)
    : 1;

  // ── Page exit fade (last 200ms) ───────────────────────────────────────
  const exitDurationMs = 200;
  const exitStartMs = page.durationMs - exitDurationMs;
  const exitOpacity = interpolate(
    pageLocalMs,
    [exitStartMs, page.durationMs],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ── Split tokens into lines ───────────────────────────────────────────
  const lines: TikTokToken[][] = [];
  for (let i = 0; i < page.tokens.length; i += maxWordsPerLine) {
    lines.push(page.tokens.slice(i, i + maxWordsPerLine));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: "100%",
        opacity: exitOpacity,
      }}
    >
      {lines.map((lineTokens, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 0,
          }}
        >
          {lineTokens.map((token, tokenIdx) => {
            const globalTokenIdx = lineIdx * maxWordsPerLine + tokenIdx;
            return (
              <div
                key={`${lineIdx}-${tokenIdx}`}
                style={{ padding: "0 10px" }}
              >
                <NeonWord
                  token={token}
                  pageStartMs={page.startMs}
                  tokenIndex={globalTokenIdx}
                  scheme={scheme}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  letterSpacing={letterSpacing}
                  allCaps={allCaps}
                  glowIntensity={glowIntensity}
                  pulseSpeed={pulseSpeed}
                  flickerEnabled={flickerEnabled}
                  powerOnProgress={powerOnProgress}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── NeonPulse (main export) ─────────────────────────────────────────────────

export const NeonPulse: React.FC<NeonPulseProps> = ({
  pages,
  fontFamily = FONT_FAMILIES.montserrat,
  fontSize = 78,
  fontWeight = 800,
  position = "bottom",
  colorScheme = "electricBlue",
  flickerEnabled = true,
  glowIntensity = 1,
  powerOnEntrance = true,
  powerOnDurationFrames = 10,
  darkOverlay = true,
  darkOverlayOpacity = 0.6,
  letterSpacing = 0.06,
  pulseSpeed = 1,
  maxWordsPerLine = 4,
  allCaps = true,
}) => {
  const { fps } = useVideoConfig();

  // Resolve color scheme
  const scheme: NeonColorScheme = NEON_SCHEMES[colorScheme] ?? NEON_SCHEMES.electricBlue;

  // ── Position styling ──────────────────────────────────────────────────
  const maxWidth =
    position === "bottom"
      ? 1080 - CAPTION_PADDING.sidesSafe * 2
      : 1080 - CAPTION_PADDING.sides * 2;

  let positionStyles: React.CSSProperties;
  switch (position) {
    case "top":
      positionStyles = {
        position: "absolute",
        left: "50%",
        top: CAPTION_PADDING.top,
        transform: "translateX(-50%)",
      };
      break;
    case "center":
      positionStyles = {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
      break;
    case "bottom":
    default:
      positionStyles = {
        position: "absolute",
        left: "50%",
        bottom: CAPTION_PADDING.bottomSafe,
        transform: "translateX(-50%)",
      };
      break;
  }

  return (
    <AbsoluteFill>
      {/* Dark gradient overlay for neon contrast */}
      {darkOverlay && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "45%",
            background: `linear-gradient(to top, rgba(0, 0, 0, ${darkOverlayOpacity}) 0%, rgba(0, 0, 0, ${darkOverlayOpacity * 0.6}) 50%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />
      )}

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
          >
            <AbsoluteFill>
              <div
                style={{
                  ...positionStyles,
                  maxWidth,
                  width: "max-content",
                  textAlign: "center",
                }}
              >
                <NeonPage
                  page={page}
                  scheme={scheme}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  letterSpacing={letterSpacing}
                  allCaps={allCaps}
                  maxWordsPerLine={maxWordsPerLine}
                  glowIntensity={glowIntensity}
                  pulseSpeed={pulseSpeed}
                  flickerEnabled={flickerEnabled}
                  powerOnEntrance={powerOnEntrance}
                  powerOnDurationFrames={powerOnDurationFrames}
                />
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
