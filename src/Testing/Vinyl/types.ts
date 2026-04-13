import type { CaptionStyleProps } from "../../types/captions";

export interface VinylProps extends CaptionStyleProps {
  /** Keywords that get the underline wipe. */
  keywords?: string[];
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Line gap. Default: 14 */
  lineGap?: number;
  /** Word gap. Default: 14 */
  wordGap?: number;
  /** Normal text color (warm cream). Default: "#F5E6D3" */
  textColor?: string;
  /** Underline wipe color (warm brown). Default: "#8B7355" */
  underlineColor?: string;
  /** Underline thickness in px. Default: 3 */
  underlineHeight?: number;
  /** Show film grain overlay. Default: true */
  showGrain?: boolean;
  /** Wobble amplitude in px. Default: 2.5 */
  wobbleAmplitude?: number;
}
