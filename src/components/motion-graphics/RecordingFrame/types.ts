import type { MGTimingProps } from "../shared/types";
import type { MGPositionProps } from "../shared/positioning";

export interface RecordingFrameAnnotation {
  // Small muted label (e.g. "ELAPSED", "CAM", "REC", "FORMAT").
  label: string;
  // Main value. Special value "timestamp" renders a live `T+N.Ns` counter
  // ticking from the component's startMs. Anything else renders as-is.
  value: string | "timestamp";
  // Which corner to place the annotation in.
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface RecordingFrameProps extends MGTimingProps, MGPositionProps {
  // Accent color for the live value readouts. Default rust "#C5432E".
  accentColor?: string;
  // Muted label color. Default warm off-white "#F0EEE9".
  textColor?: string;
  // Annotation value font size. Labels render at 0.75x this. Default 24.
  annotationFontSize?: number;

  // Thin inset border (the "camera viewfinder" edge). Default true.
  showFrame?: boolean;
  // Border color. Default "rgba(240,238,233,0.08)" (very faint off-white).
  frameBorderColor?: string;
  // How far the frame insets from the stage edge (px). Default 30.
  frameInset?: number;

  // Horizontal scan line cycling down the frame. Default true.
  showScanLine?: boolean;
  // Scan line color. Default accent at low alpha.
  scanLineColor?: string;
  // Frames per scan cycle (time for the line to travel top→bottom). Default 90.
  scanLineCycle?: number;

  // Corner annotations. Defaults to ELAPSED / CAM / FORMAT / REC quadrants.
  annotations?: RecordingFrameAnnotation[];
}
