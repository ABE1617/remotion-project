import type { MGTimingProps } from "../shared/types";
import type { MGPositionProps } from "../shared/positioning";

export interface TypingIndicatorProps extends MGTimingProps, MGPositionProps {
  // Bubble side — "incoming" (default) shows the tail on bottom-left
  // (iMessage contact-is-typing look); "outgoing" flips it to bottom-right.
  side?: "incoming" | "outgoing";
  // Bubble background color. Default "#2C2C2E" — iMessage dark-mode incoming.
  bubbleColor?: string;
  // Dot color. Default "#8E8E93" — iMessage medium grey.
  dotColor?: string;
  // Render the small corner tail pointing off the bubble. Default true.
  showTail?: boolean;
}
