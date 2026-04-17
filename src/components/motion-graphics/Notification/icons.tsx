import React from "react";
import { FaApple, FaEnvelope, FaLandmark } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { SiInstagram, SiStripe, SiVenmo } from "react-icons/si";
import type { NotificationApp } from "./types";

// ---------------------------------------------------------------------------
// App icons — colored brand tiles with proper glyphs from `react-icons`.
// Each icon fills its passed `size` square; the parent clips to rounded
// corners (squircle), so these render the brand background + mark only.
// ---------------------------------------------------------------------------

interface IconProps {
  size: number;
}

interface TileProps {
  size: number;
  background: string;
  children: React.ReactNode;
  color?: string;
  glyphScale?: number;
}

// Tile wrapper — fills the container with the brand color and centers the
// glyph. `glyphScale` lets each brand sit at its preferred optical size.
const Tile: React.FC<TileProps> = ({
  size,
  background,
  children,
  color = "#FFFFFF",
  glyphScale = 0.58,
}) => (
  <div
    style={{
      width: size,
      height: size,
      background,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color,
      fontSize: size * glyphScale,
      lineHeight: 0,
    }}
  >
    {children}
  </div>
);

// --- Apple Pay --------------------------------------------------------------
// Black tile + Apple glyph (the user asked for just the Apple logo).
const ApplePayIcon: React.FC<IconProps> = ({ size }) => (
  <Tile
    size={size}
    background="#000000"
    color="#FFFFFF"
    glyphScale={0.62}
  >
    {/* Slight upward optical shift — the Apple glyph sits low in its box */}
    <FaApple style={{ marginTop: -size * 0.04 }} />
  </Tile>
);

// --- Venmo ------------------------------------------------------------------
const VenmoIcon: React.FC<IconProps> = ({ size }) => (
  <Tile size={size} background="#3D95CE" glyphScale={0.56}>
    <SiVenmo />
  </Tile>
);

// --- Stripe -----------------------------------------------------------------
const StripeIcon: React.FC<IconProps> = ({ size }) => (
  <Tile
    size={size}
    background="linear-gradient(135deg, #7A73FF 0%, #553ACF 100%)"
    glyphScale={0.5}
  >
    <SiStripe />
  </Tile>
);

// --- iMessage ---------------------------------------------------------------
const IMessageIcon: React.FC<IconProps> = ({ size }) => (
  <Tile
    size={size}
    background="linear-gradient(180deg, #5BE368 0%, #30C040 100%)"
    glyphScale={0.66}
  >
    <IoChatbubbleEllipses />
  </Tile>
);

// --- Instagram --------------------------------------------------------------
const InstagramIcon: React.FC<IconProps> = ({ size }) => (
  <Tile
    size={size}
    background="linear-gradient(45deg, #FEDA77 0%, #F58529 25%, #DD2A7B 55%, #8134AF 85%, #515BD4 100%)"
    glyphScale={0.58}
  >
    <SiInstagram />
  </Tile>
);

// --- Email (Apple Mail) -----------------------------------------------------
const EmailIcon: React.FC<IconProps> = ({ size }) => (
  <Tile
    size={size}
    background="linear-gradient(180deg, #30B8FF 0%, #0A84FF 100%)"
    glyphScale={0.52}
  >
    <FaEnvelope />
  </Tile>
);

// --- Bank -------------------------------------------------------------------
const BankIcon: React.FC<IconProps> = ({ size }) => (
  <Tile
    size={size}
    background="linear-gradient(180deg, #4A5560 0%, #1E242C 100%)"
    glyphScale={0.58}
  >
    <FaLandmark />
  </Tile>
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
