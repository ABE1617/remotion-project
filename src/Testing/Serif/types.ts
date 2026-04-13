import type { CaptionStyleProps } from "../../types/captions";

export interface SerifProps extends CaptionStyleProps {
  /** Keywords displayed in DM Serif Display italic. */
  keywords?: string[];
  /** Body text color. Default: "#F0EEE9" (cream) */
  textColor?: string;
  /** Keyword accent color. Default: "#8B2252" (burgundy) */
  keywordColor?: string;
  /** Body font size in px. Default: 62 */
  bodyFontSize?: number;
  /** Keyword font size multiplier. Default: 1.25 */
  keywordSizeMultiplier?: number;
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Gap between lines in px. Default: 14 */
  lineGap?: number;
  /** Gap between words in px. Default: 16 */
  wordGap?: number;
  /** Letter spacing for body. Default: "0.01em" */
  letterSpacing?: string;
  /** Letter spacing for keywords. Default: "-0.02em" */
  keywordLetterSpacing?: string;
  /** Text shadow. Default: "0 2px 12px rgba(0,0,0,0.6)" */
  textShadow?: string;
  /** Scale entrance start value. Default: 0.96 */
  scaleFrom?: number;
}
