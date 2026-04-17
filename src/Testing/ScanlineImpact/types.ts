import type { CaptionStyleProps } from "../../types/captions";

export interface ScanlineImpactProps extends CaptionStyleProps {
  /** Text color — acid yellow-green. Default: "#D4E000" */
  textColor?: string;
  /** Max words per line. Default: 3 */
  maxWordsPerLine?: number;
  /** Skew angle in degrees. Default: -12 */
  skewAngle?: number;
  /** Scanline scroll speed in px/sec. Default: 40 */
  scanlineSpeed?: number;
  /** Scanline stripe thickness in px. Default: 3 */
  scanlineWidth?: number;
  /** Scanline gap thickness in px. Default: 4 */
  scanlineGap?: number;
  /** Scanline darkness (0-1). Default: 0.45 */
  scanlineOpacity?: number;
}
