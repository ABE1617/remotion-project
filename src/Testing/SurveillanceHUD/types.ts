import type { CaptionStyleProps } from "../../types/captions";

export interface SurveillanceHUDProps extends CaptionStyleProps {
  /** Active word / locked-in text color — default "#00FF41" */
  activeColor?: string;
  /** Past (logged) word color — default "#00B830" */
  pastColor?: string;
  /** Upcoming (unresolved) word color — default "#003D10" */
  idleColor?: string;
  /** How many frames the decode scramble lasts per word — default 10 */
  decodeFrames?: number;
  /** Show HUD corner brackets — default true */
  showBrackets?: boolean;
  /** Show animated scan line — default true */
  showScanLine?: boolean;
  /** Letter spacing in em — default 0.06 */
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
