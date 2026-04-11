import type { SpringConfig } from "remotion";
import type { CaptionStyleProps } from "../../types/captions";

export interface KineticScatterProps extends CaptionStyleProps {
  /** Spring config for letter assembly animation. Default: elastic snap */
  springConfig?: SpringConfig;
  /** Total stagger spread (frames) across all letters in a word. Default: 4 */
  letterStaggerFrames?: number;
  /** Text shadow for readability. Default: dual-layer drop shadow */
  textShadow?: string;
  /** 0-1 multiplier for how far letters scatter from center. Default: 0.7 */
  scatterRange?: number;
  /** Force uppercase text. Default: true */
  allCaps?: boolean;
  /** Frames letters are visible in scattered state BEFORE assembly. Default: 12 */
  scatterVisibleFrames?: number;
}
