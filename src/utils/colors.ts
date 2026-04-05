import { interpolateColors } from "remotion";

// --- Curated palettes for short-form content ---

export const PALETTES = {
  energetic: ["#FF6B6B", "#FFE66D", "#4ECDC4", "#45B7D1"],
  minimal: ["#FFFFFF", "#000000", "#888888"],
  neon: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF0080"],
  warm: ["#FF8A65", "#FFB74D", "#FFD54F"],
  cool: ["#64B5F6", "#4FC3F7", "#4DD0E1"],
  sunset: ["#FF6B35", "#F7931E", "#FCCD00", "#FFE6A7"],
  midnight: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"],
  pastel: ["#FFB5E8", "#B5DEFF", "#E7FFAC", "#FFF5BA"],
} as const;

// --- Color utilities ---

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function interpolateColor(
  frame: number,
  inputRange: readonly number[],
  colors: readonly string[],
): string {
  return interpolateColors(frame, inputRange, colors);
}
