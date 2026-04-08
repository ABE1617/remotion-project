/**
 * Shared position/padding constants for all caption styles.
 *
 * Bottom position uses a "social-media safe zone" — extra bottom padding
 * to clear username/description text, and wider side padding to avoid
 * the like/comment/share buttons on TikTok, Reels, and Shorts.
 */

export const CAPTION_PADDING = {
  /** Padding above captions when position="top" */
  top: 160,
  /** Side padding for top/center positions */
  sides: 60,
  /** Bottom padding — clears social media username/description area */
  bottomSafe: 300,
  /** Side padding for bottom position — avoids like/comment/share buttons */
  sidesSafe: 200,
} as const;

/**
 * Returns full padding + justifyContent for a caption position.
 * Bottom position includes social-media safe zone padding.
 */
export function getCaptionPositionStyle(
  position: "top" | "center" | "bottom",
): React.CSSProperties {
  switch (position) {
    case "top":
      return {
        justifyContent: "flex-start",
        paddingTop: CAPTION_PADDING.top,
        paddingLeft: CAPTION_PADDING.sides,
        paddingRight: CAPTION_PADDING.sides,
      };
    case "bottom":
      return {
        justifyContent: "flex-end",
        paddingBottom: CAPTION_PADDING.bottomSafe,
        paddingLeft: CAPTION_PADDING.sidesSafe,
        paddingRight: CAPTION_PADDING.sidesSafe,
      };
    case "center":
    default:
      return {
        justifyContent: "center",
        paddingLeft: CAPTION_PADDING.sides,
        paddingRight: CAPTION_PADDING.sides,
      };
  }
}
