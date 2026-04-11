import type { CaptionStyleProps } from "../../types/captions";

export interface ParticleDissolveProps extends CaptionStyleProps {
  /** Active word glow color — default "#FF6B35" */
  accentColor?: string;
  /** Past word opacity (after dissolve-out) — default 0.42 */
  pastOpacity?: number;
  /** Max particle displacement in px at word entry — default 58 */
  entryDisplacement?: number;
  /** Max blur at entry peak — default 4 */
  entryBlur?: number;
  /** Peak exit displacement for brief dissolve-out — default 16 */
  exitDisplacement?: number;
  /** Letter spacing in em — default 0.02 */
  letterSpacing?: number;
  /** All caps — default true */
  allCaps?: boolean;
  /** Max words per line — default 3 */
  maxWordsPerLine?: number;
  /** Gap between lines — default 14 */
  lineGap?: number;
  /** Gap between words — default 20 */
  wordGap?: number;
}
