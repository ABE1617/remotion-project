import type { CaptionStyleProps } from "../shared/types";

export interface WeightShiftCaptionProps extends CaptionStyleProps {
  /** Light (upcoming/inactive) weight. Default: 300 */
  lightWeight?: number;
  /** Bold (spoken/active) weight. Default: 700 */
  boldWeight?: number;
  /** Text color. Default: "#FFFFFF" */
  textColor?: string;
  /** Page fade-in duration in ms. Default: 150 */
  fadeInDurationMs?: number;
  /** Page fade-out duration in ms. Default: 150 */
  fadeOutDurationMs?: number;
  /** Per-word weight shift duration in ms. Default: 200 */
  weightShiftDurationMs?: number;
  /** Letter spacing. Default: "0.02em" */
  letterSpacing?: string;
  /** Line height. Default: 1.3 */
  lineHeight?: number;
  /** Force lowercase. Default: true */
  lowercase?: boolean;
  /** Subtle text shadow for readability. Default: true */
  enableShadow?: boolean;
}
