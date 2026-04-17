import type { CaptionStyleProps } from "../../types/captions";

export interface AuraProps extends CaptionStyleProps {
  /** Words that get the glow + font swap treatment. */
  keywords?: string[];
  /** Base text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Keyword glow color. Default: "#D4A853" */
  glowColor?: string;
  /** Max words per line. Default: 3 */
  maxWordsPerLine?: number;
}
