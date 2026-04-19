import type { CaptionStyleProps } from "../../types/captions";

export interface OverprintProps extends CaptionStyleProps {
  /** Keywords — rendered on their own line in dramatic italic. */
  keywords?: string[];
  /** Base "ink" color. Default: "#F5F0E5" (warm ivory for dark footage) */
  inkColor?: string;
  /** Accent "second plate" color. Default: "#C84B31" (editorial brick) */
  plateColor?: string;
  /** Body font size in px. Default: 92 */
  bodyFontSize?: number;
  /** Keyword (pull-line) size multiplier. Default: 1.55 */
  keywordSizeMultiplier?: number;
  /** Max words per body line (excluding keywords which break to own line). Default: 4 */
  maxWordsPerLine?: number;
  /** Container max width as fraction of video width. Default: 0.82 */
  maxWidthPercent?: number;
  /** Gap between lines in px. Default: 14 */
  lineGap?: number;
  /** Gap between words in px. Default: 20 */
  wordGap?: number;
  /** Initial misregistration offset in px. Default: 24 */
  registrationTravelPx?: number;
  /** Settled offset for body words in px. Default: 4 */
  settledOffsetPx?: number;
  /** Settled offset for keywords in px. Default: 11 */
  keywordOffsetPx?: number;
  /** Registration lock-in duration per word in ms. Default: 260 */
  lockInDurationMs?: number;
  /** Angle of the plate offset in degrees. Default: 28 */
  plateAngleDeg?: number;
  /** Enable subtle plate drift wobble during hold for hand-pressed feel. Default: true */
  plateDrift?: boolean;
}
