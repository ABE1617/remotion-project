import type { SpringConfig } from "remotion";
import type { CaptionStyleProps } from "../../types/captions";

export interface EvolvedHighlightWord {
  /** Word to match (case-insensitive, punctuation-stripped) */
  text: string;
  /** Color this word transitions to when active/past */
  color: string;
}

export interface HormoziEvolvedProps extends CaptionStyleProps {
  /** Words that get a colored highlight when spoken (karaoke trail) */
  highlightWords?: EvolvedHighlightWord[];
  /** Scale factor when word is the active (currently spoken) word. Default: 1.15 */
  activeScale?: number;
  /** Max words per line before wrapping. Default: 4 */
  maxWordsPerLine?: number;
  /** Force uppercase text. Default: true */
  allCaps?: boolean;
  /** Letter spacing in em units. Default: 0.05 */
  letterSpacing?: number;
  /** Spring config for the active word's scale + color pop. Default: snappy bounce */
  activeSpring?: SpringConfig;
  /** Text shadow applied to all words. Default: "0 14px 70px rgba(0,0,0,0.7)" */
  textShadow?: string;
  /** Color for upcoming (not yet spoken) words. Default: "#FFFFFF" */
  inactiveColor?: string;
  /** Slightly dim non-highlight past words. Default: false */
  dimPastWords?: boolean;
}
