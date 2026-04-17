import type { MGTimingProps } from "../shared/types";

export interface LowerThirdProps extends MGTimingProps {
  name: string;
  title: string;
  // Default "#FF3B30" — drives the vertical accent bar on the card's leading edge.
  accentColor?: string;
  // Optional circular avatar rendered to the left of the card.
  avatarSrc?: string;
  // Default "#0A0A0A". Must remain fully opaque — client rejects semi-transparent backgrounds.
  cardColor?: string;
}
