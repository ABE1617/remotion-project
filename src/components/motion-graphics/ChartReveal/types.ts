import type { MGTimingProps } from "../shared/types";

export interface DataPoint {
  // Category label (x-axis). Used directly on bar charts; for line charts only
  // the first and last point labels are rendered as anchor axis labels.
  label?: string;
  // Raw numeric value. Scale is computed automatically across the series.
  value: number;
}

export interface ChartHighlight {
  // Index into the `data` array to attach the callout marker to.
  index: number;
  // Text shown inside the floating label above the marker.
  label: string;
}

export interface ChartRevealProps extends MGTimingProps {
  // "line" draws a smoothed single-series curve; "bar" renders vertical bars
  // with rounded tops. Default "line".
  chartType?: "line" | "bar";
  // Data series (minimum 2 points for a line chart).
  data: DataPoint[];
  // Optional title rendered above the chart. Upper-case-styled by caller.
  title?: string;
  // Total card width in pixels. Default 720.
  width?: number;
  // Chart plot-area height (not including title / axis labels / padding). Default 480.
  height?: number;
  // Solid card background variant. Default "light".
  cardStyle?: "light" | "dark";
  // Line / bar color. Default "#FF3B30".
  accentColor?: string;
  // Line-chart only — fade in a soft gradient fill under the curve. Default false.
  fillBelow?: boolean;
  // Optional callout that scales in last with a pointer label + marker dot.
  highlight?: ChartHighlight;
}
