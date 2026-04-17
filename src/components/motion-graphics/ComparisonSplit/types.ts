import type { MGTimingProps } from "../shared/types";

// Content descriptor for each half of the comparison.
// `desaturate` dials back saturation/brightness for the "before/wrong" side
// to reinforce the comparison emotionally without going fully monochrome.
export type ComparisonContent =
  | { type: "image"; src: string; desaturate?: boolean }
  | { type: "video"; src: string; desaturate?: boolean }
  | {
      type: "text";
      text: string;
      color?: string;
      bgColor?: string;
      desaturate?: boolean;
    }
  | { type: "color"; color: string; desaturate?: boolean };

export interface ComparisonSplitProps extends MGTimingProps {
  // "vertical" (default) = left vs right, divider runs top-to-bottom.
  // "horizontal" = top vs bottom, divider runs left-to-right.
  orientation?: "vertical" | "horizontal";
  // Tuple: first entry is the leading side (left for vertical, top for horizontal),
  // second entry is the trailing side.
  sides: [ComparisonContent, ComparisonContent];
  // Labels rendered in each side's label chip.
  labels: [string, string];
  // Divider color — default pure white with a subtle glow.
  dividerColor?: string;
  // Optional "VS" pill rendered at the geometric center of the divider.
  showVsPill?: boolean;
}
