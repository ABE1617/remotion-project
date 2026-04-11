import type { CaptionStyleProps } from "../../types/captions";

export interface ChromaticGradientSweepProps extends CaptionStyleProps {
  /**
   * Array of [startColor, endColor] pairs cycled per word.
   * Defaults to a vibrant chromatic palette.
   */
  gradientPairs?: [string, string][];
  /** Text color for past words (fully revealed, settled) — default "rgba(255,255,255,0.62)" */
  pastTextColor?: string;
  /** Shimmer frequency in Hz for the active word — default 1.4 */
  shimmerHz?: number;
  /** Letter spacing in em — default 0.02 */
  letterSpacing?: number;
  /** All caps — default true */
  allCaps?: boolean;
  /** Max words per line — default 3 */
  maxWordsPerLine?: number;
  /** Gap between lines — default 14 */
  lineGap?: number;
  /** Gap between words — default 20 */
  wordGap?: number;
}
