import React from "react";
import type { NotificationApp } from "./types";

// ---------------------------------------------------------------------------
// App icons — inline SVG simulacra of the real platform icons.
// Each icon is a self-contained rounded square at the requested `size`.
// They prioritize instant recognizability at small sizes over logo accuracy.
// ---------------------------------------------------------------------------

interface IconProps {
  size: number;
}

// --- Apple Pay --------------------------------------------------------------
const ApplePayIcon: React.FC<IconProps> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect width="100" height="100" rx="24" fill="#000000" />
    {/* Apple glyph (simplified) */}
    <path
      d="M50 28 C52 24 56 22 60 22 C60 26 58 30 55 32 C53 34 50 35 48 35 C48 31 49 29 50 28 Z"
      fill="#FFFFFF"
    />
    <path
      d="M66 55 C66 49 70 46 71 46 C68 42 64 42 62 42 C58 42 56 44 53 44 C50 44 47 42 43 42 C38 43 33 47 33 55 C33 63 39 75 44 75 C46 75 48 73 52 73 C56 73 57 75 60 75 C64 75 69 67 71 61 C67 60 66 56 66 55 Z"
      fill="#FFFFFF"
    />
    {/* "Pay" wordmark */}
    <text
      x="50"
      y="92"
      textAnchor="middle"
      fontFamily="-apple-system, system-ui, sans-serif"
      fontSize="14"
      fontWeight="700"
      fill="#FFFFFF"
    >
      Pay
    </text>
  </svg>
);

// --- Venmo ------------------------------------------------------------------
const VenmoIcon: React.FC<IconProps> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect width="100" height="100" rx="24" fill="#3D95CE" />
    {/* Stylized "v" — using Venmo's angular wordmark feel */}
    <path
      d="M32 28 L45 28 L52 62 L60 28 L72 28 L58 78 L42 78 Z"
      fill="#FFFFFF"
    />
  </svg>
);

// --- Stripe -----------------------------------------------------------------
const StripeIcon: React.FC<IconProps> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="stripeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#7A73FF" />
        <stop offset="100%" stopColor="#553ACF" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#stripeGrad)" />
    <text
      x="50"
      y="70"
      textAnchor="middle"
      fontFamily="-apple-system, system-ui, sans-serif"
      fontSize="56"
      fontWeight="800"
      fill="#FFFFFF"
      fontStyle="italic"
    >
      S
    </text>
  </svg>
);

// --- iMessage ---------------------------------------------------------------
const IMessageIcon: React.FC<IconProps> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="imessageGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5BE368" />
        <stop offset="100%" stopColor="#30C040" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#imessageGrad)" />
    {/* Speech bubble */}
    <path
      d="M50 24 C32 24 22 34 22 47 C22 55 27 62 35 66 C34 69 31 73 28 76 C27 77 28 79 30 78 C37 77 43 74 47 71 C48 71 49 71 50 71 C68 71 78 61 78 47 C78 34 68 24 50 24 Z"
      fill="#FFFFFF"
    />
  </svg>
);

// --- Instagram --------------------------------------------------------------
const InstagramIcon: React.FC<IconProps> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#FEDA77" />
        <stop offset="25%" stopColor="#F58529" />
        <stop offset="55%" stopColor="#DD2A7B" />
        <stop offset="85%" stopColor="#8134AF" />
        <stop offset="100%" stopColor="#515BD4" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#igGrad)" />
    {/* Camera frame */}
    <rect
      x="24"
      y="24"
      width="52"
      height="52"
      rx="14"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="5"
    />
    {/* Lens */}
    <circle
      cx="50"
      cy="50"
      r="12"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="5"
    />
    {/* Flash */}
    <circle cx="66" cy="34" r="3.5" fill="#FFFFFF" />
  </svg>
);

// --- Email (Apple Mail) -----------------------------------------------------
const EmailIcon: React.FC<IconProps> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="mailGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#30B8FF" />
        <stop offset="100%" stopColor="#0A84FF" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#mailGrad)" />
    {/* Envelope body */}
    <rect
      x="22"
      y="32"
      width="56"
      height="38"
      rx="5"
      fill="#FFFFFF"
    />
    {/* Envelope flap */}
    <path
      d="M24 34 L50 54 L76 34"
      fill="none"
      stroke="#0A84FF"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Bank -------------------------------------------------------------------
const BankIcon: React.FC<IconProps> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="bankGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4A5560" />
        <stop offset="100%" stopColor="#1E242C" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#bankGrad)" />
    {/* Roof */}
    <path d="M20 40 L50 22 L80 40 Z" fill="#FFFFFF" />
    {/* Floor */}
    <rect x="18" y="72" width="64" height="6" rx="1" fill="#FFFFFF" />
    {/* Columns */}
    <rect x="26" y="44" width="7" height="26" fill="#FFFFFF" />
    <rect x="40" y="44" width="7" height="26" fill="#FFFFFF" />
    <rect x="54" y="44" width="7" height="26" fill="#FFFFFF" />
    <rect x="68" y="44" width="7" height="26" fill="#FFFFFF" />
  </svg>
);

// ---------------------------------------------------------------------------
// Exported lookup map — indexed by `NotificationApp`.
// ---------------------------------------------------------------------------
export const APP_ICONS: Record<NotificationApp, React.FC<IconProps>> = {
  "apple-pay": ApplePayIcon,
  venmo: VenmoIcon,
  stripe: StripeIcon,
  imessage: IMessageIcon,
  instagram: InstagramIcon,
  email: EmailIcon,
  bank: BankIcon,
};
