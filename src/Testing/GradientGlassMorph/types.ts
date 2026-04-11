import type { CaptionStyleProps } from "../../types/captions";

export interface GradientConfig {
  /** Gradient color stops. Default: ["#FF6B6B", "#4ECDC4", "#45B7D1"] */
  colors: string[];
  /** Gradient angle in degrees. Default: 90 */
  angle?: number;
}

export interface GlassConfig {
  /** Backdrop blur in px. Default: 20 */
  blurAmount?: number;
  /** Background tint color. Default: "rgba(255,255,255,0.1)" */
  tintColor?: string;
  /** Border color. Default: "rgba(255,255,255,0.2)" */
  borderColor?: string;
  /** Border radius in px. Default: 24 */
  borderRadius?: number;
}

export interface GradientGlassMorphProps extends CaptionStyleProps {
  /** Gradient config for the active word sweep. */
  gradient?: GradientConfig;
  /** Glass pill appearance config. */
  glass?: GlassConfig;
  /** Color for past (already-spoken) words. Default: "#FFFFFF" */
  pastWordColor?: string;
  /** Opacity for upcoming (not-yet-spoken) words. Default: 0.4 */
  upcomingOpacity?: number;
  /** Max words per line before wrapping. Default: 4 */
  maxWordsPerLine?: number;
  /** Letter spacing CSS value. Default: "0.02em" */
  letterSpacing?: string;
  /** Horizontal padding inside pill in px. Default: 40 */
  pillPaddingX?: number;
  /** Vertical padding inside pill in px. Default: 20 */
  pillPaddingY?: number;
  /** Force uppercase text. Default: false */
  allCaps?: boolean;
  /** Animate page entrance/exit transitions. Default: true */
  animatePageTransition?: boolean;
}
