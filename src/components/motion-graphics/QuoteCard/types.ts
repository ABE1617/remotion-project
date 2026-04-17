import type { MGTimingProps } from "../shared/types";

export interface QuoteCardProps extends MGTimingProps {
  quote: string;
  // e.g. "Steve Jobs, 2005" — rendered beneath the quote, prefixed with em-dash.
  attribution: string;
  // Default "#0A0A0A". Must remain fully opaque — client rejects semi-transparent backgrounds.
  cardColor?: string;
  // Default "#FFFFFF".
  quoteColor?: string;
  // Default "#B8B8B8".
  attributionColor?: string;
  // Default "#FFD60A" — drives the giant decorative quote-mark color.
  accentColor?: string;
  // Defaults to FONT_FAMILIES.playfairDisplay. Caller can override for other editorial serifs.
  quoteFont?: string;
  // Default 64. Callers can shrink for longer quotes.
  quoteFontSize?: number;
}
