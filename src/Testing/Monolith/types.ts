import type { CaptionStyleProps } from "../../types/captions";

export interface MonolithProps extends CaptionStyleProps {
  /** Keywords that get size/color emphasis. */
  keywords?: string[];
  /** Max words visible in the vertical stack. Default: 3 */
  maxWordsVisible?: number;
  /** Text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Keyword color (warm accent). Default: "#E8DCC8" */
  keywordColor?: string;
  /** Keyword scale multiplier. Default: 1.3 */
  keywordScale?: number;
  /** Line height multiplier (tight). Default: 0.85 */
  lineHeightMultiplier?: number;
}
