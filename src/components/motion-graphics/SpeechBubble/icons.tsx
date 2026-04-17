import React from "react";

// ---------------------------------------------------------------------------
// Shared SVG icons for SpeechBubble variants.
//
// The icons are line-art silhouettes at a normalized 24x24 viewBox so the
// caller can choose any render size without losing stroke fidelity. Colors
// default to Twitter/X's `#536471` neutral gray — most platforms use a
// similarly desaturated tone for inactive interaction icons.
// ---------------------------------------------------------------------------

interface SizedIconProps {
  size: number;
  color?: string;
}

// --- Verified checkmark -----------------------------------------------------
// Twitter's recognizable starburst badge: a jagged 12-point star with a
// white checkmark inside. The points are drawn as a single closed path by
// alternating an outer and inner radius around the center.
export const VerifiedIcon: React.FC<SizedIconProps> = ({
  size,
  color = "#1D9BF0",
}) => {
  // Compose the 12-point starburst path once. Center (12,12), outer r=11,
  // inner r=8.8 — tuned to match the proportions of Twitter's badge.
  const points: string[] = [];
  const cx = 12;
  const cy = 12;
  const outerR = 11;
  const innerR = 8.8;
  const count = 12;
  for (let i = 0; i < count * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    // Rotate by -90° so the first point sits at the top, matching the badge.
    const angle = (i / (count * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const starPath = points.join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d={starPath} fill={color} />
      {/* Inner checkmark — stroke-only so it reads as a white cutout */}
      <path
        d="M7.5 12.3 L10.6 15.3 L16.5 9"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// --- Reply (speech bubble outline) -----------------------------------------
export const ReplyIcon: React.FC<SizedIconProps> = ({
  size,
  color = "#536471",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M4 5 C4 3.9 4.9 3 6 3 L18 3 C19.1 3 20 3.9 20 5 L20 15 C20 16.1 19.1 17 18 17 L13.5 17 L9 21 L9 17 L6 17 C4.9 17 4 16.1 4 15 Z"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Repost (two curved arrows forming a cycle) -----------------------------
export const RepostIcon: React.FC<SizedIconProps> = ({
  size,
  color = "#536471",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    {/* Top arrow: right-pointing */}
    <path
      d="M4 8 L4 6 C4 4.9 4.9 4 6 4 L17 4 L14 1 M17 4 L14 7"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bottom arrow: left-pointing */}
    <path
      d="M20 16 L20 18 C20 19.1 19.1 20 18 20 L7 20 L10 23 M7 20 L10 17"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Heart (outline or filled) ----------------------------------------------
interface HeartProps extends SizedIconProps {
  filled?: boolean;
}
export const HeartIcon: React.FC<HeartProps> = ({
  size,
  color = "#536471",
  filled = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 21 C12 21 3 15 3 8.5 C3 5.5 5.2 3.5 7.8 3.5 C9.6 3.5 11.1 4.5 12 6 C12.9 4.5 14.4 3.5 16.2 3.5 C18.8 3.5 21 5.5 21 8.5 C21 15 12 21 12 21 Z"
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Views (bar chart) ------------------------------------------------------
export const ViewsIcon: React.FC<SizedIconProps> = ({
  size,
  color = "#536471",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M5 20 L5 14 M11 20 L11 9 M17 20 L17 4"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// --- Send arrow (paper-plane triangle) --------------------------------------
export const SendIcon: React.FC<SizedIconProps> = ({
  size,
  color = "#FFFFFF",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M2 12 L22 3 L18 12 L22 21 Z"
      fill={color}
      stroke="none"
    />
  </svg>
);

// --- Bookmark (Twitter's 4th slot alt — unused by default) ------------------
// kept here so future platforms (Bluesky/Threads) can reuse the icon set.
export const BookmarkIcon: React.FC<SizedIconProps> = ({
  size,
  color = "#536471",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M6 3 L18 3 C18.5 3 19 3.5 19 4 L19 21 L12 16.5 L5 21 L5 4 C5 3.5 5.5 3 6 3 Z"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);
