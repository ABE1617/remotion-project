import type { SpringConfig } from "remotion";

export interface Position {
  x: number;
  y: number;
}

export interface NormalizedPosition {
  x: number; // 0-1
  y: number; // 0-1
}

export interface TimingConfig {
  startFrame?: number;
  durationInFrames?: number;
  delay?: number;
}

export interface ColorConfig {
  primary: string;
  secondary?: string;
  accent?: string;
  background?: string;
}

export type AnimationDirection =
  | "left"
  | "right"
  | "up"
  | "down";

export type EntryAnimation =
  | "fade"
  | "slide"
  | "scale"
  | "spring";

export { SpringConfig };
