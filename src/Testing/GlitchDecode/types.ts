import type { CaptionStyleProps } from "../../types/captions";

export const SCRAMBLE_CHARS =
  "░▒▓█▀▄■□◆◇○●/\\|{}[]<>0123456789!@#$%^&*";

export interface GlitchDecodeColorScheme {
  textColor: string;
  rgbRedColor: string;
  rgbBlueColor: string;
  placeholderColor: string;
}

export const GLITCH_DECODE_SCHEMES: Record<string, GlitchDecodeColorScheme> = {
  terminal: {
    textColor: "#33FF33",
    rgbRedColor: "#FF0040",
    rgbBlueColor: "#0066FF",
    placeholderColor: "#1A3A1A",
  },
  cyan: {
    textColor: "#00F0FF",
    rgbRedColor: "#FF0040",
    rgbBlueColor: "#0044FF",
    placeholderColor: "#0A2A2A",
  },
  amber: {
    textColor: "#FFB000",
    rgbRedColor: "#FF3300",
    rgbBlueColor: "#FF8800",
    placeholderColor: "#2A1A00",
  },
  matrix: {
    textColor: "#00FF41",
    rgbRedColor: "#FF0040",
    rgbBlueColor: "#00AAFF",
    placeholderColor: "#0A1A0A",
  },
};

export interface GlitchDecodeProps extends CaptionStyleProps {
  /** Key into GLITCH_DECODE_SCHEMES. Default: "terminal" */
  scheme?: string;
  /** Frames between each char resolving. Default: 2 */
  charStaggerFrames?: number;
  /** Frames of scramble before first char resolves. Default: 6 */
  scrambleDurationFrames?: number;
  /** RGB split px offset during decode. Default: 3 */
  rgbSplitOffset?: number;
  /** Show block chars for unspoken words. Default: true */
  showPlaceholders?: boolean;
  /** Faint scanline overlay. Default: true */
  enableScanlines?: boolean;
  /** Max words per line. Default: 3 */
  maxWordsPerLine?: number;
  /** Custom scramble character pool. Default: SCRAMBLE_CHARS */
  charPool?: string;
  /** Force uppercase text. Default: true */
  allCaps?: boolean;
}
