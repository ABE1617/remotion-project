import type { SpringConfig } from "remotion";
import type { CaptionStyleProps } from "../shared/types";

export interface BounceKineticProps extends CaptionStyleProps {
  /** Cycling colors for words. Default: ["#FFFFFF", "#FFD700", "#FF4444"] */
  colors?: string[];
  /** Spring config for bounce entrance. */
  springConfig?: SpringConfig;
  /** Enable rotation wobble on entry. Default: true */
  enableRotation?: boolean;
  /** Max rotation in degrees (+/-). Default: 3 */
  rotationRange?: number;
  /** Letter spacing in em. Default: 0.02 */
  letterSpacing?: number;
}
