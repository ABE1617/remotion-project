import type { CaptionStyleProps } from "../../types/captions";

export interface QuintessenceProps extends CaptionStyleProps {
  /** Gold/yellow text color. Default: "#E8D44D" */
  color?: string;
  /** Vertical stretch multiplier. Default: 1.6 */
  stretchY?: number;
}
