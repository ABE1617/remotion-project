import type { CaptionStyleProps } from "../../types/captions";

export interface HushProps extends CaptionStyleProps {
  /** Keywords displayed in Cormorant Garamond italic. */
  keywords?: string[];
  /** Body text color. Default: "#F0EEE9" (warm ivory) */
  textColor?: string;
  /** Keyword accent color. Default: "#A47864" (Mocha Mousse) */
  keywordColor?: string;
  /** Body font size in px. Default: 58 */
  bodyFontSize?: number;
  /** Keyword font size multiplier. Default: 1.15 */
  keywordSizeMultiplier?: number;
  /** Max words per line. Default: 5 */
  maxWordsPerLine?: number;
  /** Gap between lines in px. Default: 10 */
  lineGap?: number;
  /** Gap between words in px. Default: 14 */
  wordGap?: number;
  /** Fade duration in ms per word. Default: 300 */
  fadeDurationMs?: number;
  /** Letter spacing for body text. Default: "0.03em" */
  letterSpacing?: string;
  /** Letter spacing for keywords. Default: "0.01em" */
  keywordLetterSpacing?: string;
  /** Text shadow. Default: "0 1px 6px rgba(0,0,0,0.4)" */
  textShadow?: string;
}
