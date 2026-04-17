import type { CaptionStyleProps } from "../../types/captions";

export interface WarmGlowProps extends CaptionStyleProps {
  /** Words that get the yellow highlight. */
  keywords?: string[];
  /** Default text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Keyword highlight color. Default: "#FFD700" */
  highlightColor?: string;
  /** 3D block extrusion color. Default: "#CC5500" */
  extrusionColor?: string;
  /** Extrusion depth in px. Default: 10 */
  extrusionDepth?: number;
  /** Max words per line. Default: 8 */
  maxWordsPerLine?: number;
  /** Word gap in px. Default: 16 */
  wordGap?: number;
}
