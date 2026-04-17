import type { MGTimingProps } from "../shared/types";
import type { MGPositionProps } from "../shared/positioning";

export interface StatCardProps extends MGTimingProps, MGPositionProps {
  // Target number to count up to (the hero value).
  value: number;
  // Start value for the count-up. Default 0.
  fromValue?: number;
  // Optional prefix rendered before the number (e.g. "$").
  prefix?: string;
  // Optional suffix rendered after the number (e.g. "%", "K", "M", "+").
  suffix?: string;
  // If set, display with N decimal places. Otherwise renders as an integer
  // with thousands separators via toLocaleString().
  decimals?: number;
  // Short descriptive label below the number (e.g. "IN 90 DAYS").
  label: string;
  // "dark" (default) → white text + rust accent for dark video backgrounds;
  // "light" → ink text + rust accent for bright video backgrounds.
  theme?: "dark" | "light";
  // Number color override. Defaults to the theme's text color.
  numberColor?: string;
  // Label color override. Defaults to the theme's text color.
  labelColor?: string;
  // Thin accent line drawn between number and label. Default "#C8551F" (rust).
  accentColor?: string;
}
