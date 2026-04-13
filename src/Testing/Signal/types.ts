import type { CaptionStyleProps } from "../../types/captions";

export interface SignalProps extends CaptionStyleProps {
  /** Keywords that receive the desaturated teal color. */
  keywords?: string[];
  /** Body text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Keyword color. Default: "#6B9DAD" (desaturated teal) */
  keywordColor?: string;
  /** Base font size in px. Default: 60 */
  baseFontSize?: number;
  /** Body font weight. Default: 500 (Medium) */
  bodyFontWeight?: number;
  /** Keyword font weight. Default: 600 (SemiBold) */
  keywordFontWeight?: number;
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Letter spacing. Default: "0.06em" */
  letterSpacing?: string;
  /** Line height multiplier. Default: 1.0 */
  lineHeightMultiplier?: number;
  /** Gap between lines in px. Default: 8 */
  lineGap?: number;
  /** Gap between words in px. Default: 14 */
  wordGap?: number;
  /** Fade-in duration in frames for the whole page. Default: 8 */
  fadeInDuration?: number;
  /** Show thin separator line above text. Default: false */
  showSeparator?: boolean;
  /** Separator color. Default: "rgba(255,255,255,0.2)" */
  separatorColor?: string;
}
