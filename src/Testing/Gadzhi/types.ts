import type { CaptionStyleProps } from "../../types/captions";

export interface GadzhiProps extends CaptionStyleProps {
  /** Light weight (upcoming words). Default: 300 */
  lightWeight?: number;
  /** Bold weight (spoken words). Default: 700 */
  boldWeight?: number;
  /** Text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Word gap in px. Default: 10 */
  wordGap?: number;
}
