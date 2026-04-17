import { loadFont as loadLocalFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadSpaceMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadPermanentMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadCaveatBrush } from "@remotion/google-fonts/CaveatBrush";
import { loadFont as loadDMSerifDisplay } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadCormorantGaramond } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadSacramento } from "@remotion/google-fonts/Sacramento";
import { loadFont as loadMrDafoe } from "@remotion/google-fonts/MrDafoe";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadBarlowCondensed } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadFiraSansCondensed } from "@remotion/google-fonts/FiraSansCondensed";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadTeko } from "@remotion/google-fonts/Teko";

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
const dmSerifDisplay = loadDMSerifDisplay();
const playfairDisplay = loadPlayfairDisplay();
const lora = loadLora();
const cormorantGaramond = loadCormorantGaramond();
const sacramento = loadSacramento();
const mrDafoe = loadMrDafoe();
const roboto = loadRoboto();
const outfit = loadOutfit();
const barlowCondensed = loadBarlowCondensed();
const dmSans = loadDMSans();
const firaSansCondensed = loadFiraSansCondensed();
const jetBrainsMono = loadJetBrainsMono();
const teko = loadTeko();

loadLocalFont({
  family: "Hey August",
  url: staticFile("HeyAugust.ttf"),
});

loadLocalFont({
  family: "Feeling Passionate",
  url: staticFile("FeelingPassionate.ttf"),
});

loadLocalFont({
  family: "Mitha Script",
  url: staticFile("MithaScript.otf"),
});

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
  dmSerifDisplay: dmSerifDisplay.fontFamily,
  playfairDisplay: playfairDisplay.fontFamily,
  lora: lora.fontFamily,
  cormorantGaramond: cormorantGaramond.fontFamily,
  sacramento: sacramento.fontFamily,
  mrDafoe: mrDafoe.fontFamily,
  heyAugust: "Hey August",
  roboto: roboto.fontFamily,
  outfit: outfit.fontFamily,
  barlowCondensed: barlowCondensed.fontFamily,
  dmSans: dmSans.fontFamily,
  firaSansCondensed: firaSansCondensed.fontFamily,
  jetBrainsMono: jetBrainsMono.fontFamily,
  teko: teko.fontFamily,
  feelingPassionate: "Feeling Passionate",
  mithaScript: "Mitha Script",
} as const;

export type FontName = keyof typeof FONT_FAMILIES;

export function getFontFamily(name: FontName): string {
  return FONT_FAMILIES[name];
}
