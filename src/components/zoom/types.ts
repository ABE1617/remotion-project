import type { CSSProperties } from "react";

// ── Shared ─────────────────────────────────────────────────────────────

export interface ZoomEvent {
  startMs: number;
  durationMs: number;
  scale?: number;
  originX?: number;
  originY?: number;
}

export interface BaseZoomProps {
  src: string;
  events: ZoomEvent[];
  style?: CSSProperties;
}

// ── Smooth Push ────────────────────────────────────────────────────────

export interface SmoothPushProps extends BaseZoomProps {}

// ── Ken Burns ──────────────────────────────────────────────────────────

export interface KenBurnsProps extends BaseZoomProps {
  direction?: "in" | "out";
  startScale?: number;
  endScale?: number;
  driftX?: number;
  driftY?: number;
}

// ── Snap Reframe ───────────────────────────────────────────────────────

export interface SnapReframeProps extends BaseZoomProps {}

// ── Focus Window ───────────────────────────────────────────────────────

export interface FocusWindowProps extends BaseZoomProps {
  /** Size of the inner window as a fraction of the frame (default: 0.55) */
  windowScale?: number;
  /** Border width in px (default: 3) */
  borderWidth?: number;
  /** Border color (default: "rgba(255,255,255,0.9)") */
  borderColor?: string;
  /** How much the background is zoomed in (default: 1.8) */
  bgScale?: number;
}

// ── Split Frame ────────────────────────────────────────────────────────

export interface SplitFrameProps extends BaseZoomProps {
  /** Number of panels: 2 or 3 (default: 2) */
  panels?: 2 | 3;
  /** Gap between panels in px (default: 6) */
  gap?: number;
}

// ── Circle Mask ────────────────────────────────────────────────────────

export interface CircleMaskProps extends BaseZoomProps {
  /** How much the inside is zoomed (default: 1.5) */
  innerScale?: number;
}

// ── Breathe ────────────────────────────────────────────────────────────

export interface BreatheProps extends BaseZoomProps {
  amplitude?: number;
}

// ── Step Zoom ──────────────────────────────────────────────────────────

export interface StepZoomProps extends BaseZoomProps {}

// ── Letterbox Push ─────────────────────────────────────────────────────

export interface LetterboxPushProps extends BaseZoomProps {
  /** Maximum bar height as fraction of frame height (default: 0.12) */
  maxBarHeight?: number;
  /** Bar color (default: "black") */
  barColor?: string;
}

// ── Anamorphic Breathe ─────────────────────────────────────────────────

export interface AnamorphicBreatheProps extends BaseZoomProps {
  /** Chromatic aberration max offset in px (default: 2.5) */
  caStrength?: number;
  /** Anamorphic streak intensity 0-1 (default: 0.6) */
  streakIntensity?: number;
  /** Film grain opacity 0-1 (default: 0.04) */
  grainOpacity?: number;
}

// ── Depth Pull ─────────────────────────────────────────────────────────

// ── Stage Zoom ─────────────────────────────────────────────────────────

export interface StageZoomProps extends BaseZoomProps {
  /** Scale for first stage (default: 1.15) */
  firstStage?: number;
  /** Scale for second stage (default: 1.35) */
  secondStage?: number;
}

// ── Depth Pull ─────────────────────────────────────────────────────────

export interface DepthPullProps extends BaseZoomProps {
  /** Edge blur max in px (default: 4) */
  edgeBlur?: number;
  /** Show decorative frame lines (default: true) */
  frameLines?: boolean;
}
