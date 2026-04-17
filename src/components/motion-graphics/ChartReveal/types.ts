import type { MGTimingProps } from "../shared/types";
import type { MGPositionProps } from "../shared/positioning";

export interface DataPoint {
  // Category label (x-axis). Shown below each bar; for line charts only the
  // first and last labels are rendered as anchor marks.
  label?: string;
  // Raw numeric value. Scale is computed automatically across the series.
  value: number;
}

export interface ChartHighlight {
  // Index into the `data` array to attach the peak callout to.
  index: number;
  // Display label — if omitted, derived from the data point's value using
  // the global prefix/suffix.
  label?: string;
}

export interface ChartRevealProps extends MGTimingProps, MGPositionProps {
  // "bar" (default) — the viral short-form format, bars with values on top.
  // "line" — clean single-series curve with optional dot markers.
  chartType?: "line" | "bar";
  // Data series (minimum 2 points).
  data: DataPoint[];
  // Optional headline above the chart (e.g. "Monthly Revenue").
  title?: string;
  // Optional prefix applied to all value labels (e.g. "$").
  prefix?: string;
  // Optional suffix applied to all value labels (e.g. "K", "%", "M").
  suffix?: string;
  // Decimals in the rendered value (default 0).
  decimals?: number;
  // Overall chart size. Chart centers on the frame.
  width?: number;
  height?: number;
  // "dark" (default) — light text + drop shadows for dark video backgrounds.
  // "light" — ink text + soft white halos for bright backgrounds.
  theme?: "dark" | "light";
  // Line / bar color. Default "#C8551F" (rust).
  accentColor?: string;
  // Color for the peak bar / peak line dot. Defaults to the theme's text color.
  peakColor?: string;
  // Optional peak callout — scales in last near the highlighted point.
  highlight?: ChartHighlight;
}
