import type { CaptionStyleProps } from "../shared/types";

export interface GlitchColorPreset {
  /** Main color of the special word after glitch settles */
  color: string;
}

export const GLITCH_PRESETS: Record<string, GlitchColorPreset> = {
  cyan: { color: "#00F0FF" },
  red: { color: "#FF3344" },
  green: { color: "#39FF14" },
  yellow: { color: "#FFD700" },
  pink: { color: "#FF44CC" },
};

export interface GlitchHighlightWord {
  text: string;
  preset?: string;
}

export interface GlitchHighlightProps extends CaptionStyleProps {
  /** Words that get the glitch effect */
  highlightWords?: GlitchHighlightWord[];
  /** Default color preset. Default: "cyan" */
  colorPreset?: string;
  /** Stagger delay in frames. Default: 1 */
  staggerDelayFrames?: number;
  /** Letter spacing in em. Default: 0.04 */
  letterSpacing?: number;
  /** Duration of glitch effect in frames. Default: 8 */
  glitchDurationFrames?: number;
}
