import type { CaptionStyleProps } from "../../types/captions";

export interface RetroVHSProps extends CaptionStyleProps {
  /** Active word text color — default "#FFFFFF" */
  activeColor?: string;
  /** Past word text color — default "#B8B2A0" */
  pastColor?: string;
  /** Upcoming word text color — default "#6B6560" */
  upcomingColor?: string;
  /** Chromatic aberration offset in px for R/B channels — default 3 */
  chromaticOffset?: number;
  /** Show VHS scanlines overlay — default true */
  showScanlines?: boolean;
  /** Tracking noise amplitude in px — default 1.5 */
  trackingAmplitude?: number;
  /** Letter spacing in em — default 0.04 */
  letterSpacing?: number;
  /** All caps — default true */
  allCaps?: boolean;
  /** Max words per line — default 3 */
  maxWordsPerLine?: number;
  /** Gap between lines — default 14 */
  lineGap?: number;
  /** Gap between words — default 18 */
  wordGap?: number;
}
