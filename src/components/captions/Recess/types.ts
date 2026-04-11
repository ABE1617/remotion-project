import type { CaptionStyleProps } from "../shared/types";

export interface RecessProps extends CaptionStyleProps {
  /** Default text color (default: "#FFFFFF") */
  textColor?: string;
  /** Color of the active/highlighted word (default: "#FFD700") */
  highlightColor?: string;
  /** Max words per line (default: 2) */
  maxWordsPerLine?: number;
  /** Display text in all caps (default: true) */
  allCaps?: boolean;
  /** CSS letter-spacing value (default: "0.06em") */
  letterSpacing?: string;
  /** Line height multiplier (default: 1.0) */
  lineHeight?: number;
  /** Gap between lines in px (default: 4) */
  lineGap?: number;
  /** Text shadow for readability (default: heavy shadow) */
  textShadow?: string;
  /** Show dark gradient at bottom for readability (default: true) */
  showGradient?: boolean;
  /** Words that get displayed alone at a bigger size (case-insensitive match) */
  emphasisWords?: string[];
  /** Font size multiplier for emphasis words (default: 1.6) */
  emphasisScale?: number;
  /** Image overlay entries */
  imageOverlays?: ImageOverlayEntry[];
}

export interface ImageOverlayEntry {
  /** Image source (staticFile path) */
  src: string;
  /** When the image appears (ms) */
  appearAtMs: number;
  /** When the image disappears (ms) */
  disappearAtMs: number;
  /** Height of the image as CSS value (default: "40%") */
  height?: string;
  /** Border radius of the image container in px (default: 20) */
  borderRadius?: number;
  /** Caption position when overlay is active as CSS top % (default: "59%") */
  captionPosition?: string;
}
