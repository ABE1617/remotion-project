import type { CaptionStyleProps } from "../../types/captions";

export interface RunawayProps extends CaptionStyleProps {
  /** Max words visible at once (stacked vertically). Default: 3 */
  maxVisibleWords?: number;
  /** Horizontal padding inside black box (px). Default: 16 */
  boxPaddingX?: number;
  /** Vertical padding inside black box (px). Default: 8 */
  boxPaddingY?: number;
  /** Vertical gap between stacked words (px). Default: 10 */
  stackGap?: number;
  /** Max rotation angle in degrees (positive). Words rotate between -max and +max. Default: 12 */
  maxRotation?: number;
}
