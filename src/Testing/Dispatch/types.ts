import type { CaptionStyleProps } from "../../types/captions";

export interface DispatchContextLine {
  /** The context/attribution text (e.g., "based on 2024 data"). */
  text: string;
  /** When this context line appears (ms). */
  appearAtMs: number;
  /** When this context line disappears (ms). */
  disappearAtMs: number;
}

export interface DispatchProps extends CaptionStyleProps {
  /** Keywords that receive teal highlight + animated underline. */
  keywords?: string[];
  /** Primary text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Keyword highlight color. Default: "#4A90D9" (cool teal) */
  keywordColor?: string;
  /** Primary font size in px. Default: 72 */
  primaryFontSize?: number;
  /** Primary font weight. Default: 700 */
  primaryFontWeight?: number;
  /** Text transform for primary text. Default: "uppercase" */
  textTransform?: "uppercase" | "none" | "capitalize";
  /** Letter spacing for primary text. Default: "0.04em" */
  letterSpacing?: string;
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Gap between lines in px. Default: 8 */
  lineGap?: number;
  /** Gap between words in px. Default: 12 */
  wordGap?: number;
  /** Underline thickness in px. Default: 3 */
  underlineThickness?: number;
  /** Context lines data. Default: [] */
  contextLines?: DispatchContextLine[];
  /** Context line font size in px. Default: 36 */
  contextFontSize?: number;
  /** Context line color. Default: "rgba(255,255,255,0.6)" */
  contextColor?: string;
  /** Gap between caption and context line in px. Default: 18 */
  contextGap?: number;
  /** Text shadow. Default: "0 2px 10px rgba(0,0,0,0.6)" */
  textShadow?: string;
}
