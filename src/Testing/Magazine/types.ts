import type { CaptionStyleProps } from "../../types/captions";

export interface MagazineProps extends CaptionStyleProps {
  /** Keywords that get editorial emphasis. */
  keywords?: string[];
  /** Max words per line. Default: 3 */
  maxWordsPerLine?: number;
  /** Line gap. Default: 16 */
  lineGap?: number;
  /** Word gap. Default: 14 */
  wordGap?: number;
  /** Normal text color (off-white). Default: "#FAFAF5" */
  textColor?: string;
  /** Keyword accent color (deep burgundy). Default: "#6B2D3E" */
  accentColor?: string;
  /** Show horizontal rule beside keywords. Default: true */
  showRule?: boolean;
  /** Focus pull blur range in px. Default: 3 */
  blurRange?: number;
}
