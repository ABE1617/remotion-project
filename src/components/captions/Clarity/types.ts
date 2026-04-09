import type { CaptionStyleProps } from "../shared/types";

export interface StickyNoteConfig {
  color: string;
  rotation: number;
  text: string;
}

export interface StickyNotesGroup {
  notes: [StickyNoteConfig, StickyNoteConfig, StickyNoteConfig];
  appearAtMs: number;
  disappearAtMs: number;
}

export interface ToggleEntry {
  text: string;
  appearAtMs: number;
  activateAtMs: number;
  disappearAtMs: number;
}

export interface ClarityProps extends CaptionStyleProps {
  bgColor?: string;
  blurAmount?: number;
  activeColor?: string;
  borderRadius?: number;
  stripPaddingX?: number;
  stripPaddingY?: number;
  letterSpacing?: string;
  showPunctuation?: boolean;
  /** Sticky notes groups to show during the video */
  stickyNotes?: StickyNotesGroup[];
  /** Size of each sticky note in px (default: 150) */
  stickySize?: number;
  /** Font size on sticky notes (default: 28) */
  stickyFontSize?: number;
  /** Font family for sticky notes (default: caveatBrush) */
  stickyFontFamily?: string;
  /** Toggle switch entries */
  toggles?: ToggleEntry[];
  /** Toggle switch scale (default: 1.5) */
  toggleScale?: number;
  /** Toggle label font size (default: 48) */
  toggleFontSize?: number;
}
