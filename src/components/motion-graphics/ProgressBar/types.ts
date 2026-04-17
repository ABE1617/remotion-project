import type { MGTimingProps } from "../shared/types";

export interface ProgressBarMilestone {
  // Position along the track, 0–1 (e.g. 0.5 = halfway).
  at: number;
  // Optional small label above the marker.
  label?: string;
}

interface ProgressBarBase extends MGTimingProps {
  label?: string;
  width?: number;
  trackHeight?: number;
  accentColor?: string;
  trackColor?: string;
  position?: "top" | "center" | "bottom";
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
