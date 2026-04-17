import type { MGTimingProps } from "../shared/types";

export interface StatCardProps extends MGTimingProps {
  // Target number to count up to (the hero value).
  value: number;
  // Start value for the count-up. Default 0.
  fromValue?: number;
  // Optional prefix rendered before the number (e.g. "$").
  prefix?: string;
  // Optional suffix rendered after the number (e.g. "%", "K", "M", "+").
  suffix?: string;
  // If set, display with N decimal places (e.g. 1 → "98.7"). Otherwise renders
  // as an integer with thousands separators via toLocaleString().
  decimals?: number;
  // Descriptive label below the number (e.g. "INCREASE IN CONVERSION").
  label: string;
  // Optional understated source citation at the bottom (trust signal).
  source?: string;
  // Light (off-white) or dark card background. Default "light".
  cardStyle?: "light" | "dark";
  // Accent color driving the 1px top border on the dark variant. Default "#FF3B30".
  accentColor?: string;
}
