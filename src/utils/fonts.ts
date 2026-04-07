import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadSpaceMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadPermanentMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadCaveatBrush } from "@remotion/google-fonts/CaveatBrush";

// Load all caption fonts at module scope so they're available immediately
const montserrat = loadMontserrat();
const inter = loadInter();
const poppins = loadPoppins();
const oswald = loadOswald();
const bebasNeue = loadBebasNeue();
const anton = loadAnton();
const spaceMono = loadSpaceMono();
const permanentMarker = loadPermanentMarker();
const caveatBrush = loadCaveatBrush();

export const FONT_FAMILIES = {
  montserrat: montserrat.fontFamily,
  inter: inter.fontFamily,
  poppins: poppins.fontFamily,
  oswald: oswald.fontFamily,
  bebasNeue: bebasNeue.fontFamily,
  anton: anton.fontFamily,
  spaceMono: spaceMono.fontFamily,
  permanentMarker: permanentMarker.fontFamily,
  caveatBrush: caveatBrush.fontFamily,
} as const;

export type FontName = keyof typeof FONT_FAMILIES;

export function getFontFamily(name: FontName): string {
  return FONT_FAMILIES[name];
}
