import type { SpringConfig } from "remotion";
import type { CaptionStyleProps } from "../../types/captions";

export interface EmphasisWord {
  /** Word to match (case-insensitive, punctuation-stripped) */
  text: string;
  /** 1 = normal, 2 = medium (mediumScale), 3 = large (largeScale). Default: 2 */
  weight?: 1 | 2 | 3;
  /** Optional override color for this word */
  color?: string;
}

export interface DynamicAIEmphasisProps extends CaptionStyleProps {
  /** Words to render at larger sizes with optional color overrides */
  emphasisWords?: EmphasisWord[];
  /** Color applied to emphasis words when no per-word color is set. Default: "#FFFFFF" */
  emphasisColor?: string;
  /** Scale factor for weight-2 words relative to base fontSize. Default: 1.8 */
  mediumScale?: number;
  /** Scale factor for weight-3 words relative to base fontSize. Default: 2.5 */
  largeScale?: number;
  /** Letter spacing in em units. Default: 0.02 */
  letterSpacing?: number;
  /** Spring config for emphasis word entrance. Default: bouncy pop */
  emphasisSpring?: SpringConfig;
  /** Spring config for normal word entrance. Default: quick gentle slide */
  normalSpring?: SpringConfig;
  /** Max words per line before wrapping. Default: 4 */
  maxWordsPerLine?: number;
  /** Force uppercase text. Default: true */
  allCaps?: boolean;
  /** Horizontal gap between words in px. Default: 10 */
  wordGap?: number;
  /** Vertical gap between lines in px. Default: 4 */
  lineGap?: number;
}
