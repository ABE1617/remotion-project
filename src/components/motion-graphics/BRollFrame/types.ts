import type { MGTimingProps } from "../shared/types";

export type BRollFrameAspectRatio = "16:9" | "4:5" | "1:1" | "9:16";
export type BRollFramePosition =
  | "top-left"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-right";
export type BRollFrameVariant = "clean" | "white-border" | "polaroid";
export type BRollFrameMediaType = "image" | "video";

export interface BRollFrameProps extends MGTimingProps {
  // staticFile() URL — image or video
  src: string;
  // Default "image". Selects <Img> vs @remotion/media <Video>.
  mediaType?: BRollFrameMediaType;
  // Default "16:9". Drives the frame's height derivation from width.
  aspectRatio?: BRollFrameAspectRatio;
  // Default 540 (px at 1080-wide composition = 50% of frame width).
  width?: number;
  // Default "center". Anchors the frame with ~120px padding from each edge.
  position?: BRollFramePosition;
  // Default "clean". Governs border / shadow / caption treatment.
  variant?: BRollFrameVariant;
  // Optional label shown below the frame (or in the polaroid's bottom margin).
  caption?: string;
}
