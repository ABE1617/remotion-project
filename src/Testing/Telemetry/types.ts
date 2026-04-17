import type { CaptionStyleProps } from "../../types/captions";

export interface TelemetryProps extends CaptionStyleProps {
  /** Keywords that get bracket emphasis + functional red. */
  keywords?: string[];
  /** Primary text color. Default: "#F0EEE9" (warm off-white) */
  textColor?: string;
  /** Accent color for keywords + brackets. Default: "#C5432E" */
  accentColor?: string;
  /** Primary caption font size in px. Default: 64 */
  baseFontSize?: number;
  /** Primary font weight. Default: 500 */
  baseFontWeight?: number;
  /** Text transform. Default: "uppercase" */
  textTransform?: "uppercase" | "none";
  /** Letter spacing. Default: "0.04em" */
  letterSpacing?: string;
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Gap between lines in px. Default: 10 */
  lineGap?: number;
  /** Gap between words in px. Default: 12 */
  wordGap?: number;
  /** Text shadow. Default: "0 1px 6px rgba(0,0,0,0.4)" */
  textShadow?: string;
}
