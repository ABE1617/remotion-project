import type { CaptionStyleProps } from "../../types/captions";

export interface TrackProps extends CaptionStyleProps {
  keywords?: string[];
  fontSize?: number;
  textColor?: string;
  underlineColor?: string;
  maxWordsPerLine?: number;
}
