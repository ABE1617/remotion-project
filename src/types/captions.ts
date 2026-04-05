export interface CaptionToken {
  text: string;
  start: number;
  end: number;
}

export interface CaptionPage {
  text: string;
  startMs: number;
  durationMs: number;
  tokens: CaptionToken[];
}

export interface CaptionStyleProps {
  /** Array of caption pages with token-level timing */
  pages: CaptionPage[];
  /** Font family name */
  fontFamily?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight */
  fontWeight?: number | string;
  /** Primary color (active word) */
  primaryColor?: string;
  /** Secondary color (inactive words) */
  secondaryColor?: string;
  /** Vertical position */
  position?: "top" | "center" | "bottom";
  /** Optional stroke/outline color */
  strokeColor?: string;
  /** Stroke width in pixels */
  strokeWidth?: number;
}
