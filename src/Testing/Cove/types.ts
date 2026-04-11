import type { CaptionStyleProps } from "../../types/captions";

export interface CoveProps extends CaptionStyleProps {
  /** Words that get the black box treatment (matched case-insensitive). */
  boxedWords?: string[];
  /** Max rotation angle for boxed words (degrees). Default: 5 */
  maxRotation?: number;
  /** Horizontal padding inside black box (px). Default: 14 */
  boxPaddingX?: number;
  /** Vertical padding inside black box (px). Default: 8 */
  boxPaddingY?: number;
  /** Max words per line. Default: 3 */
  maxWordsPerLine?: number;
  /** Gap between lines (px). Default: 12 */
  lineGap?: number;
  /** Gap between words in a line (px). Default: 14 */
  wordGap?: number;
  /** Text shadow for unboxed words. Default: "0 2px 8px rgba(0,0,0,0.7)" */
  nakedTextShadow?: string;
}
