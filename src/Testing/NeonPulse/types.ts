import type { CaptionStyleProps } from "../../types/captions";

export interface NeonColorScheme {
  /** Bright inner core color (near-white tinted) */
  core: string;
  /** Primary neon glow color */
  glow: string;
}

export const NEON_SCHEMES: Record<string, NeonColorScheme> = {
  electricBlue: { core: "#FFFFFF", glow: "#00D4FF" },
  hotPink: { core: "#FFE0F0", glow: "#FF1493" },
  neonGreen: { core: "#E0FFE0", glow: "#39FF14" },
  purple: { core: "#E8D0FF", glow: "#BF00FF" },
  amber: { core: "#FFF8E0", glow: "#FFAA00" },
};

export interface NeonPulseProps extends CaptionStyleProps {
  /** Key into NEON_SCHEMES. Default: "electricBlue" */
  colorScheme?: string;
  /** Subtle flicker on active word. Default: true */
  flickerEnabled?: boolean;
  /** Glow intensity multiplier 0.5-1.5. Default: 1 */
  glowIntensity?: number;
  /** Neon power-on flicker entrance per page. Default: true */
  powerOnEntrance?: boolean;
  /** Duration of power-on flicker in frames. Default: 10 */
  powerOnDurationFrames?: number;
  /** Dark gradient behind caption area. Default: true */
  darkOverlay?: boolean;
  /** Opacity of the dark overlay (0-1). Default: 0.6 */
  darkOverlayOpacity?: number;
  /** Letter spacing in em. Default: 0.06 */
  letterSpacing?: number;
  /** Pulse speed multiplier. Default: 1 */
  pulseSpeed?: number;
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Force uppercase text. Default: true */
  allCaps?: boolean;
}
