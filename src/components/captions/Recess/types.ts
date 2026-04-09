import type { CaptionStyleProps } from "../shared/types";

export interface RecessProps extends CaptionStyleProps {
  /** Default text color (default: "#FFFFFF") */
  textColor?: string;
  /** Background color of the active word pill (default: "#3B8C7F") */
  pillColor?: string;
  /** Text color inside the active pill (default: "#FFFFFF") */
  pillTextColor?: string;
  /** Pill border radius in px (default: 10) */
  pillRadius?: number;
  /** Pill horizontal padding in px (default: 16) */
  pillPaddingX?: number;
  /** Pill vertical padding in px (default: 6) */
  pillPaddingY?: number;
  /** Max words per line (default: 3) */
  maxWordsPerLine?: number;
  /** Display text in all caps (default: true) */
  allCaps?: boolean;
  /** CSS letter-spacing value (default: "0.02em") */
  letterSpacing?: string;
  /** Line height multiplier (default: 1.05) */
  lineHeight?: number;
  /** Gap between lines in px (default: 8) */
  lineGap?: number;
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
