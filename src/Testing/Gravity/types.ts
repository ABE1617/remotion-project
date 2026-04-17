import type { CaptionStyleProps } from "../../types/captions";

export interface GravityProps extends CaptionStyleProps {
  keywords?: string[];
  fontSize?: number;
  textColor?: string;
  maxWordsPerLine?: number;
}
