import type { CSSProperties } from "react";

export interface TransitionProps {
  clipA: string;
  clipB: string;
  progress: number;
  style?: CSSProperties;
}

export interface CardSwipeProps extends TransitionProps {
  direction?: "left" | "right";
}

export interface CubeProps extends TransitionProps {
  direction?: "left" | "right";
}

export interface ZoomThroughProps extends TransitionProps {}

export interface SlideOverProps extends TransitionProps {
  direction?: "left" | "right";
}

export interface FlipProps extends TransitionProps {
  direction?: "horizontal" | "vertical";
}

export interface MorphProps extends TransitionProps {}

export interface StackProps extends TransitionProps {}

export interface CrossfadeZoomProps extends TransitionProps {}

export interface FlashCutProps extends TransitionProps {
  color?: string;
  radialGradient?: boolean;
}

export interface ZoomPunchProps extends TransitionProps {
  direction?: "in" | "out";
  focalPoint?: { x: number; y: number };
  chromaticAberration?: boolean;
}

export interface MaskWipeProps extends TransitionProps {
  shape?: "horizontal" | "diagonal" | "circle-iris" | "angular";
  direction?: "left" | "right" | "up" | "down";
  accentLine?: boolean;
  accentColor?: string;
  accentWidth?: number;
  feather?: number;
}

export interface MotionBlurSlideProps extends TransitionProps {
  direction?: "left" | "right" | "up" | "down";
  blurStrength?: number;
  gap?: number;
}

export interface WhipPanProps extends TransitionProps {
  direction?:
    | "horizontal-right"
    | "horizontal-left"
    | "vertical-down"
    | "vertical-up"
    | "diagonal-tl-br"
    | "diagonal-tr-bl";
  intensity?: number;
}

export interface ShutterFlashProps extends TransitionProps {
  blades?: "single" | "dual";
  flashColor?: string;
  bladeColor?: string;
  chromaticAberrationOnReveal?: boolean;
}

export interface BlurDissolveProps extends TransitionProps {
  peakBlur?: number;
  scaleAmplitude?: number;
  desaturationDip?: boolean;
}

export interface GlitchProps extends TransitionProps {
  intensity?: "soft" | "hard";
  rgbOffset?: number;
  scanLineCount?: number;
  seed?: number;
}

export interface LightLeakProps extends TransitionProps {
  palette?: "warm" | "gold" | "cool" | "magenta";
  direction?: "tl-br" | "tr-bl" | "left-right" | "top-down";
  intensity?: number;
}

export interface FilmBurnProps extends TransitionProps {
  burnColor?: string;
  tintColor?: string;
  intensity?: number;
  seed?: number;
}

export interface ShakeProps extends TransitionProps {
  // Amplitude tier. Default "medium". "heavy" also adds a brief flash at the
  // peak — the classic beat-drop look.
  intensity?: "subtle" | "medium" | "heavy";
  // Deterministic seed for the pseudo-random jitter pattern. Default 1.
  seed?: number;
  // Color of the peak flash (only visible on "heavy"). Default "#FFFFFF".
  flashColor?: string;
}

export interface DollyZoomProps extends TransitionProps {
  // "in" = zoom toward the subject; "out" = pull back. Default "in".
  direction?: "in" | "out";
  // Where to pivot the zoom (0–1 each axis). Default center (0.5, 0.5).
  focalPoint?: { x: number; y: number };
  // Strength of the vertigo distortion (0–1). Default 0.7.
  intensity?: number;
}

export interface InversionProps extends TransitionProps {
  // Width of the peak in progress units (how long the invert lasts). Default 0.1.
  peakWidth?: number;
}

export interface IrisProps extends TransitionProps {
  // "in" = circle grows from center; "out" = circle shrinks from full.
  // Default "in".
  direction?: "in" | "out";
  // 0–1 normalized focal point. Default (0.5, 0.5).
  focalPoint?: { x: number; y: number };
  // Thin accent ring drawn at the iris edge. Default true.
  accentRing?: boolean;
  accentColor?: string;
}

export interface AnamorphicStreakProps extends TransitionProps {
  // Streak color. Default iMessage-blue cinematic flare "#6AA8FF".
  color?: string;
  // Streak intensity (0–1). Default 0.9.
  intensity?: number;
}

export interface PanelStackProps extends TransitionProps {
  // Where the outgoing clip tilts away to. Default "back" (scales + tilts
  // into the stack, iOS app-switcher style). "side" slides it off to the
  // left with a subtle rotation instead.
  tiltDirection?: "back" | "side";
  // Dark background that shows behind the stack. Default "#000".
  backgroundColor?: string;
}

export interface StepPushProps extends TransitionProps {
  // Which direction the panels push. Default "left" (clipA exits left,
  // clipB enters from right — standard keynote forward step).
  direction?: "left" | "right" | "up" | "down";
  // Small separator shadow between the two panels. Default true.
  separatorShadow?: boolean;
}

export interface CardLiftProps extends TransitionProps {
  // How far up the card lifts as it fades (percentage of frame height).
  // Default 10.
  liftAmount?: number;
  // Scale the lifting card shrinks to. Default 0.9.
  liftScale?: number;
}
