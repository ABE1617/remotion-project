import type { CaptionStyleProps } from "../shared/types";

export interface CRTHighlightProps extends CaptionStyleProps {
  /** Color for the active/current word. Default: "#FFFFFF" */
  activeColor?: string;
  /** Color for inactive/past words. Default: "rgba(255,255,255,0.7)" */
  inactiveColor?: string;
  /** Color for CRT keyword effect. Default: "#FFD700" (yellow) */
  crtColor?: string;
  /** Max width as fraction of frame width. Default: 0.85 */
  maxWidthPercent?: number;
}
