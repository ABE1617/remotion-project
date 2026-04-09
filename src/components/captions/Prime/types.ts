import type { CaptionStyleProps } from "../shared/types";

export interface PrimeProps extends CaptionStyleProps {
  /** Color of line 1 / top line (default: "#FFFFFF") */
  line1Color?: string;
  /** Color of line 2 / bottom line (default: "#3BA5FF") */
  line2Color?: string;
  /** Font size of line 1 in px (default: 52) */
  line1FontSize?: number;
  /** Font size of line 2 in px (default: 66) */
  line2FontSize?: number;
  /** Font weight of line 1 (default: 600) */
  line1FontWeight?: number | string;
  /** Font weight of line 2 (default: 800) */
  line2FontWeight?: number | string;
  /** Max words per line (default: 3) */
  maxWordsPerLine?: number;
  /** CSS letter-spacing (default: "0.01em") */
  letterSpacing?: string;
  /** Gap between lines in px (default: 6) */
  lineGap?: number;
  /** Text shadow for readability (default: "0 2px 8px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.4)") */
  textShadow?: string;
  /** Left padding as % of frame width (default: "6%") */
  leftPadding?: string;
  /** Words displayed in italic serif font (case-insensitive match) */
  specialWords?: string[];
  /** Font family for special words (default: dmSerifDisplay) */
  specialFontFamily?: string;
  /** Color for special words (default: "#3BA5FF") */
  specialColor?: string;
  /** Title text displayed at top anchor in special font */
  titleText?: string;
  /** When the title appears (ms) */
  titleAppearAtMs?: number;
  /** When the title disappears (ms) */
  titleDisappearAtMs?: number;
  /** Title font size (default: 160) */
  titleFontSize?: number;
  /** Title color (default: same as specialColor) */
  titleColor?: string;
  /** Echo text overlay entries */
  echoOverlays?: EchoOverlayEntry[];
}

export interface EchoOverlayEntry {
  /** The word to echo */
  text: string;
  /** When the echo appears (ms) */
  appearAtMs: number;
  /** When the echo disappears (ms) */
  disappearAtMs: number;
  /** Number of echo copies (default: 5) */
  copies?: number;
  /** Color of the hero text (default: "#5CE6D6") */
  color?: string;
  /** Font size (default: 140) */
  fontSize?: number;
  /** Vertical offset between copies in px (default: 70) */
  verticalOffset?: number;
  /** Background color (default: "#0F0F1A") */
  bgColor?: string;
}
