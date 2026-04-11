import type { CaptionStyleProps } from "../../types/captions";

export interface ElasticStretchProps extends CaptionStyleProps {
  /** Accent color for active-word pill and text. Default: "#FF6B35" */
  accentColor?: string;
  /** Pill color for past words. Default: "rgba(255,255,255,0.15)" */
  pastPillColor?: string;
  /** Letter spacing in em units. Default: 0.02 */
  letterSpacing?: number;
  /** Force uppercase text. Default: true */
  allCaps?: boolean;
  /** Max words per line before wrapping. Default: 3 */
  maxWordsPerLine?: number;
  /** Vertical gap between lines in px. Default: 16 */
  lineGap?: number;
  /** Horizontal gap between words in px. Default: 24 */
  wordGap?: number;
  /** Horizontal padding inside word pill in px. Default: 14 */
  pillPaddingX?: number;
  /** Vertical padding inside word pill in px. Default: 6 */
  pillPaddingY?: number;
  /** Border radius of word pill in px. Default: 10 */
  pillBorderRadius?: number;
  /** Text shadow. Default: subtle drop shadow */
  textShadow?: string;
}
