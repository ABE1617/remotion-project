import type { MGTimingProps } from "../shared/types";

export interface SceneTitleProps extends MGTimingProps {
  // The main title. Include "\n" to split across lines — rendered as a
  // tightly-stacked block via lineHeight 0.92 + whiteSpace: "pre-line".
  // Broadcast budget per line: ≤ 12 characters.
  title: string;
  // Optional small uppercase section label (e.g. "PART 01").
  // Broadcast budget: ≤ 20 characters.
  label?: string;
  // Panel coverage: full-frame, top-half only, or bottom-half only.
  variant?: "full" | "half-top" | "half-bottom";
  // "dark" (default) → ink-black gradient panel with warm cream type.
  // "light" → cream/bone gradient panel with warm ink type.
  theme?: "dark" | "light";
  // Accent color for the divider line. Default "#C8551F" (rust).
  accentColor?: string;
  // Title color override. Defaults to the theme's title color.
  titleColor?: string;
  // Label color override. Defaults to the theme's label color.
  labelColor?: string;
  // Whether to render the thin horizontal divider between label and title.
  // Only actually renders if `label` is also provided. Default true.
  showDivider?: boolean;
}
