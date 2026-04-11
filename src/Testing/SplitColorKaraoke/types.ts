import type { CaptionStyleProps } from "../../types/captions";

export interface SplitColorKaraokeProps extends CaptionStyleProps {
  /** Fill color (accent) — default "#FF3CAC" */
  accentColor?: string;
  /** Unfilled / upcoming word color — default "rgba(255,255,255,0.35)" */
  baseColor?: string;
  /** Color for past (fully played) words — default same as accentColor */
  pastWordColor?: string;
  /** Letter spacing in em — default 0.02 */
  letterSpacing?: number;
  /** All caps — default true */
  allCaps?: boolean;
  /** Max words per line — default 3 */
  maxWordsPerLine?: number;
  /** Gap between lines in px — default 14 */
  lineGap?: number;
  /** Gap between words in px — default 20 */
  wordGap?: number;
}
