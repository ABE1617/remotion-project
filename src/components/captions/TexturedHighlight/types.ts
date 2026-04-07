import type { SpringConfig } from "remotion";
import type { CaptionStyleProps } from "../shared/types";

export interface TexturePreset {
  /** Gradient fill for the painted word */
  gradient: string;
  /** Glow color */
  glowColor: string;
}

export const TEXTURE_PRESETS: Record<string, TexturePreset> = {
  forest: {
    gradient: "linear-gradient(145deg, #0c4a0c 0%, #1e8a1e 35%, #2db82d 65%, #0f5c0f 100%)",
    glowColor: "#45d145",
  },
  ocean: {
    gradient: "linear-gradient(145deg, #082e55 0%, #1272b0 35%, #1a90d4 65%, #0a3f6e 100%)",
    glowColor: "#30b0e8",
  },
  ember: {
    gradient: "linear-gradient(145deg, #6b1800 0%, #c45500 35%, #e87a00 65%, #802000 100%)",
    glowColor: "#ff9922",
  },
  royal: {
    gradient: "linear-gradient(145deg, #250860 0%, #5e22b8 35%, #7e40e0 65%, #301070 100%)",
    glowColor: "#a066f5",
  },
};

export interface TexturedHighlightWord {
  /** Word text to match (case-insensitive) */
  text: string;
  /** Texture preset name */
  texture?: string;
}

export interface TexturedHighlightProps extends CaptionStyleProps {
  /** Words that get the painted fill */
  highlightWords?: TexturedHighlightWord[];
  /** Default texture preset. Default: "forest" */
  texturePreset?: string;
  /** Spring config for pop-in */
  springConfig?: SpringConfig;
  /** Stagger delay in frames. Default: 1 */
  staggerDelayFrames?: number;
  /** Y translate for pop-in. Default: 8 */
  translateY?: number;
  /** Max words per line. Default: 4 */
  maxWordsPerLine?: number;
  /** Letter spacing in em for normal words. Default: 0.04 */
  letterSpacing?: number;
  /** Enable glow on painted words. Default: true */
  enableGlow?: boolean;
}
