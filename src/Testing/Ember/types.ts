import type { CaptionStyleProps } from "../../types/captions";

export interface EmberProps extends CaptionStyleProps {
  /** Words that get the color temperature shift. */
  keywords?: string[];
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Line gap in px. Default: 14 */
  lineGap?: number;
  /** Word gap in px. Default: 16 */
  wordGap?: number;
  /** Normal text color (warm cream). Default: "#F5E6D3" */
  textColor?: string;
  /** Keyword start color (amber). Default: "#D4A24C" */
  keywordStartColor?: string;
  /** Keyword end color (burnt orange). Default: "#CC5500" */
  keywordEndColor?: string;
  /** Show dark radial gradient overlay. Default: true */
  showVignette?: boolean;
}
