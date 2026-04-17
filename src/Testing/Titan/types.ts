import type { CaptionStyleProps } from "../../types/captions";

export interface TitanProps extends CaptionStyleProps {
  /** Default text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Keyword highlight color. Default: "#F5C518" */
  highlightColor?: string;
  /** Words that get the yellow highlight. */
  keywords?: string[];
  /** Max words per line. Default: 2 */
  maxWordsPerLine?: number;
  /** Word gap in px. Default: 14 */
  wordGap?: number;
}
