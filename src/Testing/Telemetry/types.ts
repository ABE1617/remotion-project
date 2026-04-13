import type { CaptionStyleProps } from "../../types/captions";

export interface TelemetryAnnotation {
  /** Label text (e.g., "ELAPSED", "WORDS"). */
  label: string;
  /** Value: "timestamp" | "wordcount" | "wpm" | a static string. */
  value: "timestamp" | "wordcount" | "wpm" | string;
  /** Corner position. */
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface TelemetryProps extends CaptionStyleProps {
  /** Keywords that get bracket emphasis + functional red. */
  keywords?: string[];
  /** Primary text color. Default: "#F0EEE9" (warm off-white) */
  textColor?: string;
  /** Accent color for keywords, brackets, annotations. Default: "#C5432E" */
  accentColor?: string;
  /** Primary caption font size in px. Default: 64 */
  baseFontSize?: number;
  /** Primary font weight. Default: 500 */
  baseFontWeight?: number;
  /** Annotation font size in px. Default: 24 */
  annotationFontSize?: number;
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
  /** Show scanning line animation. Default: true */
  showScanLine?: boolean;
  /** Scan line color. Default: "rgba(197,67,46,0.15)" */
  scanLineColor?: string;
  /** Scan line cycle in frames. Default: 90 */
  scanLineCycle?: number;
  /** Corner annotations. */
  annotations?: TelemetryAnnotation[];
  /** Show thin border frame. Default: true */
  showFrame?: boolean;
  /** Frame border color. Default: "rgba(240,238,233,0.08)" */
  frameBorderColor?: string;
  /** Text shadow. Default: "0 1px 6px rgba(0,0,0,0.4)" */
  textShadow?: string;
}
