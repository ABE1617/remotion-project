import type { CaptionStyleProps } from "../../types/captions";

export interface IlluminateProps extends CaptionStyleProps {
  keywords?: string[];
  fontSize?: number;
  textColor?: string;
  glowColor?: string;
  maxWordsPerLine?: number;
}
