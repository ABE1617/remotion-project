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
