import type { CaptionStyleProps } from "../shared/types";

export interface PaperIIHighlightWord {
  text: string;
  color: string;
}

export interface PaperIIProps extends CaptionStyleProps {
  /** Background color of the strip (default: "#FFFFFF") */
  paperColor?: string;
  /** Color for words not yet spoken (default: "#B0B0B0") */
  upcomingColor?: string;
  /** Color for the currently active and past words (default: "#1A1A1A") */
  activeColor?: string;
  /** Max words per strip line (default: 4) */
  maxWordsPerLine?: number;
  /** Display text in all caps (default: true) */
  allCaps?: boolean;
  /** CSS letter-spacing value (default: "0.03em") */
  letterSpacing?: string;
  /** Horizontal padding inside each strip in px (default: 28) */
  stripPaddingX?: number;
  /** Vertical padding inside each strip in px (default: 14) */
  stripPaddingY?: number;
  /** Vertical gap between stacked strips in px (default: 10) */
  stripGap?: number;
  /** Border radius in px (default: 14) */
  borderRadius?: number;
  /** Slide-up distance in px for strip entrance (default: 20) */
  slideDistance?: number;
  /** Duration of color transition per word in ms (default: 60) */
  colorTransitionMs?: number;
}
