import type { SpringConfig } from "remotion";
import type { CaptionStyleProps } from "../../types/captions";

export const SIZE_PRESETS = {
  normal: 1,
  slightlyBig: 1.25,
  big: 1.5,
  tooBig: 1.9,
} as const;

export type SizePreset = keyof typeof SIZE_PRESETS;

export interface SizedWord {
  word: string;
  scale: number | SizePreset;
}

export interface ParallaxPop3DProps extends CaptionStyleProps {
  /** Words with custom size multipliers. e.g. [{ word: "GRIND", scale: 1.5 }] */
  sizedWords?: SizedWord[];
  /** Number of shadow layers at rest. Default: 6 */
  restingDepthLayers?: number;
  /** Number of shadow layers when active. Default: 12 */
  activeDepthLayers?: number;
  /** Pixel offset per layer at rest. Default: 1 */
  restingOffsetPerLayer?: number;
  /** Pixel offset per layer when active. Default: 1.2 */
  activeOffsetPerLayer?: number;
  /** Color of the 3D extrusion shadows. Default: "#2A2A2A" */
  extrusionColor?: string;
  /** Blur on the deepest ambient layer at rest (px). Default: 8 */
  restingAmbientBlur?: number;
  /** Blur on the deepest ambient layer when active (px). Default: 20 */
  activeAmbientBlur?: number;
  /** Opacity of the ambient shadow (0-1). Default: 0.4 */
  ambientShadowOpacity?: number;
  /** Scale multiplier of the active word. Default: 1.15 */
  activeScale?: number;
  /** Y translation when active (negative = up). Default: -8 */
  activeTranslateY?: number;
  /** Color of the active word. Default: "#FFD700" (gold) */
  activeColor?: string;
  /** Spring configuration for the pop animation */
  popSpringConfig?: SpringConfig;
  /** Max words per line. Default: 3 */
  maxWordsPerLine?: number;
  /** Force uppercase text. Default: true */
  allCaps?: boolean;
  /** CSS letter-spacing value. Default: "0.05em" */
  letterSpacing?: string;
  /** Gap between lines in px. Default: 12 */
  lineGap?: number;
  /** Opacity of past words. Default: 0.7 */
  pastWordOpacity?: number;
}
