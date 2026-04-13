import type { CaptionStyleProps } from "../../types/captions";

export interface ContrastProps extends CaptionStyleProps {
  /** Keywords that get a muted gold accent when filled. */
  keywords?: string[];
  /** Light weight value. Default: 300 */
  lightWeight?: number;
  /** Heavy weight value. Default: 900 */
  heavyWeight?: number;
  /** Light/unfilled text color. Default: "rgba(245,245,240,0.35)" */
  lightColor?: string;
  /** Heavy/filled text color. Default: "#F5F5F0" */
  heavyColor?: string;
  /** Keyword filled color. Default: "#C9A96E" (muted gold) */
  keywordFilledColor?: string;
  /** Base font size in px. Default: 74 */
  baseFontSize?: number;
  /** Max words per line. Default: 3 */
  maxWordsPerLine?: number;
  /** Gap between lines in px. Default: 6 */
  lineGap?: number;
  /** Gap between words in px. Default: 16 */
  wordGap?: number;
  /** Letter spacing. Default: "-0.01em" */
  letterSpacing?: string;
  /** Weight transition duration in frames. Default: 10 (~333ms at 30fps) */
  fillDuration?: number;
  /** Text shadow for heavy layer. Default: "0 2px 16px rgba(0,0,0,0.5)" */
  textShadow?: string;
}
