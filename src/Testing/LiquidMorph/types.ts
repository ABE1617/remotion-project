import type { CaptionStyleProps } from "../../types/captions";

export interface LiquidMorphProps extends CaptionStyleProps {
  /** Duration of liquid morph transition between pages in ms. Default: 300 */
  transitionDurationMs?: number;
  /** Peak SVG feDisplacementMap scale value. Default: 80 */
  distortionIntensity?: number;
  /** feTurbulence baseFrequency for liquid noise. Default: 0.015 */
  turbulenceFrequency?: number;
  /** feTurbulence numOctaves for noise detail. Default: 3 */
  turbulenceOctaves?: number;
  /** Color of the currently-spoken word. Default: "#FFD700" */
  activeWordColor?: string;
  /** Color of already-spoken words. Default: "#FFFFFF" */
  pastWordColor?: string;
  /** Color of not-yet-spoken words. Default: "rgba(255,255,255,0.5)" */
  upcomingWordColor?: string;
  /** Force uppercase text. Default: true */
  allCaps?: boolean;
  /** Letter spacing in em. Default: 0.05 */
  letterSpacing?: number;
  /** Max words displayed per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Text drop shadow for readability. Default: "0 3px 10px rgba(0,0,0,0.8)" */
  textShadow?: string;
  /** Blur amount at peak distortion in px. Default: 3 */
  transitionBlur?: number;
}
