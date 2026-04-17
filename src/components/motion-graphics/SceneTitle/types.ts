import type { MGTimingProps } from "../shared/types";

export interface SceneTitleProps extends MGTimingProps {
  // The main title. Include "\n" to split across lines — rendered as a
  // tightly-stacked block via lineHeight 0.92 + whiteSpace: "pre-line".
  title: string;
  // Optional small uppercase section label (e.g. "PART 01").
  label?: string;
  // Panel coverage: full-frame, top-half only, or bottom-half only.
  variant?: "full" | "half-top" | "half-bottom";
  // Solid panel background color. Default "#FF3B30". NEVER translucent.
  accentColor?: string;
  // Main title color. Default "#FFFFFF".
  titleColor?: string;
  // Section label + divider color. Default "#FFFFFF".
  labelColor?: string;
  // Whether to render the thin horizontal divider between label and title.
  // Only actually renders if `label` is also provided. Default true.
  showDivider?: boolean;
}
