import type { CaptionStyleProps } from "../../types/captions";

export interface BoxedWordStackProps extends CaptionStyleProps {
  /** Box fill color for the active (currently spoken) word — default "#FFE600" */
  activeBoxColor?: string;
  /** Text color inside the active box — default "#000000" */
  activeTextColor?: string;
  /** Box fill color for past (already spoken) words — default "rgba(255,255,255,0.14)" */
  pastBoxColor?: string;
  /** Text color for past words — default "#FFFFFF" */
  pastTextColor?: string;
  /** Horizontal padding inside each word box — default 18 */
  boxPaddingX?: number;
  /** Vertical padding inside each word box — default 10 */
  boxPaddingY?: number;
  /** Box border radius — default 8 */
  boxRadius?: number;
  /** Letter spacing in em — default 0.04 */
  letterSpacing?: number;
  /** All caps — default true */
  allCaps?: boolean;
  /** Max words per line — default 3 */
  maxWordsPerLine?: number;
  /** Gap between lines — default 14 */
  lineGap?: number;
  /** Gap between word boxes — default 10 */
  wordGap?: number;
}
