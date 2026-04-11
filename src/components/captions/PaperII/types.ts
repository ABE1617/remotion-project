import type { CaptionStyleProps } from "../shared/types";

export interface PaperIIHighlightWord {
  text: string;
  color: string;
}

export interface TornPaperEntry {
  /** Top line text */
  topText: string;
  /** Bottom line text */
  bottomText: string;
  /** When the torn paper appears (ms) */
  appearAtMs: number;
  /** When the torn paper disappears (ms) */
  disappearAtMs: number;
  /** Background color of the text strips (default: "#1A1A1A") */
  stripColor?: string;
  /** Text color on the strips (default: "#FFFFFF") */
  stripTextColor?: string;
  /** Font family for strip text (default: oswald) */
  stripFontFamily?: string;
  /** Font size for strip text (default: 72) */
  stripFontSize?: number;
  /** Font weight for strip text (default: 700) */
  stripFontWeight?: number | string;
  /** Letter spacing for strip text (default: "0.06em") */
  stripLetterSpacing?: string;
  /** Color of the offset shadow square behind each strip (default: "#4CAF50") */
  shadowColor?: string;
  /** Horizontal offset of the shadow square in px (default: 10) */
  shadowOffsetX?: number;
  /** Vertical offset of the shadow square in px (default: 9) */
  shadowOffsetY?: number;
  /** Padding inside each strip as [vertical, horizontal] in px (default: [14, 32]) */
  stripPadding?: [number, number];
  /** Gap between the two strips in px (default: 120) */
  stripGap?: number;
  /** Vertical position of strips container as CSS top % (default: "25%") */
  stripsPositionTop?: string;
  /** Rotation of top strip in degrees (default: -10) */
  topStripRotation?: number;
  /** Rotation of bottom strip in degrees (default: 7) */
  bottomStripRotation?: number;
}

export interface NewspaperTransitionEntry {
  /** When the transition starts (ms) */
  atMs: number;
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
  /** Text shadow for readability (default: heavy shadow) */
  textShadow?: string;
  /** Torn paper overlay entries (separate from captions) */
  tornPapers?: TornPaperEntry[];
  /** Newspaper transition entries */
  newspaperTransitions?: NewspaperTransitionEntry[];
}
