export {
  SPRING_SNAPPY,
  SPRING_BOUNCY,
  SPRING_GENTLE,
  SPRING_ELASTIC,
  fadeIn,
  fadeOut,
  slideIn,
  scaleSpring,
  staggeredDelay,
} from "./animations";

export {
  PALETTES,
  hexToRgba,
  interpolateColor,
} from "./colors";

export {
  FONT_FAMILIES,
  getFontFamily,
} from "./fonts";
export type { FontName } from "./fonts";

export {
  framesToMs,
  msToFrames,
  secondsToFrames,
  getCurrentTimeMs,
} from "./timing";

export {
  clamp,
  lerp,
  mapRange,
  normalize,
} from "./math";
