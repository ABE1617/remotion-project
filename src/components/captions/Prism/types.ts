import type { CaptionStyleProps } from "../shared/types";

export interface PrismColorPreset {
  tintColor: string;
  burnColor: string;
  glowColor: string;
}

export const PRISM_PRESETS: Record<string, PrismColorPreset> = {
  red: { tintColor: "#FF8C5A", burnColor: "#F0A070", glowColor: "#FF8C5A" },
  blue: { tintColor: "#4DD9E8", burnColor: "#38C4D4", glowColor: "#4DD9E8" },
  green: { tintColor: "#00FF44", burnColor: "#00CC33", glowColor: "#00FF44" },
  purple: { tintColor: "#8800FF", burnColor: "#6600CC", glowColor: "#8800FF" },
  gold: { tintColor: "#FFD700", burnColor: "#CC9900", glowColor: "#FFD700" },
  cyan: { tintColor: "#00E5FF", burnColor: "#00B8CC", glowColor: "#00E5FF" },
};

export type PrismPresetName = keyof typeof PRISM_PRESETS;

export interface PrismProps extends CaptionStyleProps {
  maxWidthPercent?: number;
  maxWordsPerLine?: number;
  keywordScale?: number;
  /** Scale for keywords when alone on a line. Default: 2.2 */
  soloKeywordScale?: number;
  /** Color preset for the prism effect. Default: "red" */
  colorPreset?: PrismPresetName;
}
