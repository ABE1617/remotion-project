export type TransitionDirection =
  | "from-left"
  | "from-right"
  | "from-top"
  | "from-bottom";

export interface TransitionConfig {
  durationInFrames: number;
  direction?: TransitionDirection;
}

export interface GlitchConfig extends TransitionConfig {
  intensity?: number;
  sliceCount?: number;
}

export interface SwipeConfig extends TransitionConfig {
  direction?: TransitionDirection;
  angle?: number;
}

export interface ZoomTransitionConfig extends TransitionConfig {
  zoomScale?: number;
}
