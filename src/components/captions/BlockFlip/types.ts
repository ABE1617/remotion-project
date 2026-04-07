import type { SpringConfig } from "remotion";
import type { CaptionStyleProps } from "../shared/types";

export interface BlockFlipProps extends CaptionStyleProps {
  /** Cycling block background colors. */
  blockColors?: string[];
  /** Text color on blocks. Default: "#FFFFFF" */
  textColor?: string;
  /** Border radius on blocks in px. Default: 6 */
  borderRadius?: number;
  /** Gap between blocks in px. Default: 10 */
  gap?: number;
  /** Horizontal padding inside each block. Default: 18 */
  paddingX?: number;
  /** Vertical padding inside each block. Default: 10 */
  paddingY?: number;
  /** Spring config for flip animation. */
  springConfig?: SpringConfig;
  /** Max width of the word container as fraction of screen width. Default: 0.85 */
  maxWidthPercent?: number;
  /** Page fade in duration in ms. Default: 150 */
  fadeInDurationMs?: number;
  /** Page fade out duration in ms. Default: 200 */
  fadeOutDurationMs?: number;
}
