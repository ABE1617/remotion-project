import type { CaptionStyleProps } from "../../types/captions";

export interface LumenProps extends CaptionStyleProps {
  /** Keywords that get the amber glow + serif switch. */
  keywords?: string[];
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Line gap. Default: 14 */
  lineGap?: number;
  /** Word gap. Default: 14 */
  wordGap?: number;
  /** Normal text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Keyword amber/gold color. Default: "#D4A24C" */
  keywordColor?: string;
  /** Show light leak overlay on keyword hits. Default: true */
  showLightLeak?: boolean;
  /** Hue shift for light leak (degrees toward amber). Default: 40 */
  lightLeakHueShift?: number;
  /** Duration of lens flare sweep in frames. Default: 15 */
  sweepDuration?: number;
}
