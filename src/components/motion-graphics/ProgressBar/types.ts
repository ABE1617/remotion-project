import type { MGTimingProps } from "../shared/types";
import type { MGPositionProps } from "../shared/positioning";

export interface ProgressBarMilestone {
  // Position along the track, 0–1 (e.g. 0.5 = halfway).
  at: number;
  // Optional small label above the marker.
  label?: string;
}

interface ProgressBarBase extends MGTimingProps, MGPositionProps {
  label?: string;
  width?: number;
  trackHeight?: number;
  // "dark" (default) → white fill on translucent-white track, cream-family
  // text; "light" → ink fill on translucent-ink track for bright footage.
  theme?: "dark" | "light";
  // Color of the progress fill itself. Defaults to the theme's fillColor.
  fillColor?: string;
  // Accent for the eyebrow label + hairline rule. Defaults to the theme's
  // accentColor (gold on dark, rust on light).
  accentColor?: string;
  trackColor?: string;
  milestones?: ProgressBarMilestone[];
  // Override the right-side counter text (receives current numeric value during count-up).
  formatValue?: (current: number) => string;
}

export interface ProgressBarValueProps extends ProgressBarBase {
  // Drive the bar from value/total. Right-side counter will display
  // `${formatValue(value)} / ${formatValue(total)}` by default.
  value: number;
  total: number;
  percentage?: never;
}

export interface ProgressBarPercentProps extends ProgressBarBase {
  // Drive the bar from a 0–100 percentage. Right-side counter will display
  // `${Math.round(current)}%` by default.
  percentage: number;
  value?: never;
  total?: never;
}

export type ProgressBarProps = ProgressBarValueProps | ProgressBarPercentProps;
