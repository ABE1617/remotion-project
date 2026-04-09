import type { CaptionStyleProps } from "../shared/types";

export interface KaraokeColorScheme {
  activeColor: string;
  inactiveColor: string;
  glowColor: string;
  pillBackground: string;
  pillBorder: string;
  strokeColor: string;
}

export type KaraokeSchemeName =
  | "gold"
  | "cyan"
  | "green"
  | "pink"
  | "dimmed-white"
  | "custom";

export const KARAOKE_SCHEMES: Record<
  Exclude<KaraokeSchemeName, "custom">,
  KaraokeColorScheme
> = {
  gold: {
    activeColor: "#FFD700",
    inactiveColor: "#FFFFFF",
    glowColor: "#FFD700",
    pillBackground: "rgba(0, 0, 0, 0.75)",
    pillBorder: "rgba(255, 255, 255, 0.08)",
    strokeColor: "#000000",
  },
  cyan: {
    activeColor: "#00F0FF",
    inactiveColor: "#FFFFFF",
    glowColor: "#00F0FF",
    pillBackground: "rgba(0, 0, 0, 0.75)",
    pillBorder: "rgba(255, 255, 255, 0.08)",
    strokeColor: "#000000",
  },
  green: {
    activeColor: "#39FF14",
    inactiveColor: "#FFFFFF",
    glowColor: "#39FF14",
    pillBackground: "rgba(0, 0, 0, 0.75)",
    pillBorder: "rgba(255, 255, 255, 0.08)",
    strokeColor: "#000000",
  },
  pink: {
    activeColor: "#FF69B4",
    inactiveColor: "#FFFFFF",
    glowColor: "#FF69B4",
    pillBackground: "rgba(0, 0, 0, 0.75)",
    pillBorder: "rgba(255, 255, 255, 0.08)",
    strokeColor: "#000000",
  },
  "dimmed-white": {
    activeColor: "#FFFFFF",
    inactiveColor: "rgba(255, 255, 255, 0.45)",
    glowColor: "#FFFFFF",
    pillBackground: "rgba(0, 0, 0, 0.75)",
    pillBorder: "rgba(255, 255, 255, 0.08)",
    strokeColor: "#000000",
  },
};

export interface KaraokeHighlightProps extends CaptionStyleProps {
  /** Color scheme preset. Default: "gold" */
  scheme?: KaraokeSchemeName;
  /** Custom color scheme (used when scheme="custom") */
  colorScheme?: Partial<KaraokeColorScheme>;
  /** Show background pill behind text. Default: true */
  showPill?: boolean;
  /** Frosted glass effect on pill. Default: false */
  frostedGlass?: boolean;
  /** Stagger word entrance on page change. Default: true */
  staggeredEntrance?: boolean;
  /** Stagger delay per word in frames. Default: 1 */
  staggerDelayFrames?: number;
  /** Max width as fraction of frame width. Default: 0.8 */
  maxWidthPercent?: number;
  /** Crossfade duration in frames. Default: 4 */
  crossfadeDurationFrames?: number;
}
