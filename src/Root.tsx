import "./index.css";
import { Composition, Folder } from "remotion";
import { Placeholder } from "./compositions/Placeholder";
import { HormoziPopInDemo } from "./compositions/HormoziPopInDemo";
import { TypewriterRevealDemo } from "./compositions/TypewriterRevealDemo";
import { GlitchHighlightDemo } from "./compositions/GlitchHighlightDemo";
import { EmojiPopDemo } from "./compositions/EmojiPopDemo";
import { NegativeFlashDemo } from "./compositions/NegativeFlashDemo";
import { PaperIIDemo } from "./compositions/PaperIIDemo";
import { ClarityDemo } from "./compositions/ClarityDemo";
import { RecessDemo } from "./compositions/RecessDemo";
import { PrimeDemo } from "./compositions/PrimeDemo";
import { PrismDemo } from "./compositions/PrismDemo";
import { DynamicAIEmphasisDemo } from "./Testing/DynamicAIEmphasis/DynamicAIEmphasisDemo";
import { HormoziEvolvedDemo } from "./Testing/HormoziEvolved/HormoziEvolvedDemo";
import { CinematicLetterpressDemo } from "./Testing/CinematicLetterpress/CinematicLetterpressDemo";
import { GradientGlassMorphDemo } from "./Testing/GradientGlassMorph/GradientGlassMorphDemo";
import { ParallaxPop3DDemo } from "./Testing/ParallaxPop3D/ParallaxPop3DDemo";
import { NeonPulseDemo } from "./Testing/NeonPulse/NeonPulseDemo";
import { GlitchDecodeDemo } from "./Testing/GlitchDecode/GlitchDecodeDemo";
import { KineticScatterDemo } from "./Testing/KineticScatter/KineticScatterDemo";
import { BeatBounceDemo } from "./Testing/BeatBounce/BeatBounceDemo";
import { LiquidMorphDemo } from "./Testing/LiquidMorph/LiquidMorphDemo";
import { ElasticStretchDemo } from "./Testing/ElasticStretch/ElasticStretchDemo";
import { SplitColorKaraokeDemo } from "./Testing/SplitColorKaraoke/SplitColorKaraokeDemo";
import { BoxedWordStackDemo } from "./Testing/BoxedWordStack/BoxedWordStackDemo";
import { MagazineCutoutDemo } from "./Testing/MagazineCutout/MagazineCutoutDemo";
import { SurveillanceHUDDemo } from "./Testing/SurveillanceHUD/SurveillanceHUDDemo";
import { ChromaticGradientSweepDemo } from "./Testing/ChromaticGradientSweep/ChromaticGradientSweepDemo";
import { StaggerWaveDemo } from "./Testing/StaggerWave/StaggerWaveDemo";
import { RetroVHSDemo } from "./Testing/RetroVHS/RetroVHSDemo";
import { ParticleDissolveDemo } from "./Testing/ParticleDissolve/ParticleDissolveDemo";
import { RunawayDemo } from "./Testing/Runaway/RunawayDemo";
import { CoveDemo } from "./Testing/Cove/CoveDemo";
import { QuintessenceDemo } from "./Testing/Quintessence/QuintessenceDemo";

// Video config constants
const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 150; // 5 seconds

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Captions">
        <Composition
          id="caption-placeholder"
          component={Placeholder}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={DURATION}
          defaultProps={{ label: "Caption styles go here" }}
        />
        <Composition
          id="caption-hormozi-pop-in"
          component={HormoziPopInDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={330}
        />
        <Composition
          id="caption-typewriter-reveal"
          component={TypewriterRevealDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={380}
        />
        <Composition
          id="caption-glitch-highlight"
          component={GlitchHighlightDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={340}
        />
        <Composition
          id="caption-emoji-pop"
          component={EmojiPopDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={660}
        />
        <Composition
          id="caption-negative-flash"
          component={NegativeFlashDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={420}
        />
        <Composition
          id="caption-paper-ii"
          component={PaperIIDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={330}
        />
        <Composition
          id="caption-clarity"
          component={ClarityDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={360}
        />
        <Composition
          id="caption-prime"
          component={PrimeDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={210}
        />
        <Composition
          id="caption-prism"
          component={PrismDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={420}
        />
        <Composition
          id="caption-dynamic-ai-emphasis"
          component={DynamicAIEmphasisDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={270}
        />
        <Composition
          id="caption-cinematic-letterpress"
          component={CinematicLetterpressDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={310}
        />
        <Composition
          id="caption-gradient-glass-morph"
          component={GradientGlassMorphDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={270}
        />
        <Composition
          id="caption-parallax-3d"
          component={ParallaxPop3DDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={210}
        />
        <Composition
          id="caption-neon-pulse"
          component={NeonPulseDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={180}
        />
        <Composition
          id="caption-glitch-decode"
          component={GlitchDecodeDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={280}
        />
        <Composition
          id="caption-liquid-morph"
          component={LiquidMorphDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={280}
        />
        <Composition
          id="caption-boxed-word-stack"
          component={BoxedWordStackDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={280}
        />
        <Composition
          id="caption-magazine-cutout"
          component={MagazineCutoutDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={275}
        />
        <Composition
          id="caption-surveillance-hud"
          component={SurveillanceHUDDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={275}
        />
        <Composition
          id="caption-stagger-wave"
          component={StaggerWaveDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={285}
        />
        <Composition
          id="caption-runaway"
          component={RunawayDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={285}
        />
        <Composition
          id="caption-cove"
          component={CoveDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={285}
        />
        <Composition
          id="caption-quintessence"
          component={QuintessenceDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={270}
        />
      </Folder>
      <Folder name="Zoom-Effects">
        <Composition
          id="zoom-placeholder"
          component={Placeholder}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={DURATION}
          defaultProps={{ label: "Zoom effects go here" }}
        />
      </Folder>
      <Folder name="Transitions">
        <Composition
          id="transition-placeholder"
          component={Placeholder}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={DURATION}
          defaultProps={{ label: "Transitions go here" }}
        />
      </Folder>
      <Folder name="Motion-Graphics">
        <Composition
          id="mg-placeholder"
          component={Placeholder}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={DURATION}
          defaultProps={{ label: "Motion graphics go here" }}
        />
      </Folder>
      <Folder name="Color-Effects">
        <Composition
          id="color-placeholder"
          component={Placeholder}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={DURATION}
          defaultProps={{ label: "Color effects go here" }}
        />
      </Folder>
      <Folder name="Pro-Elements">
        <Composition
          id="pro-placeholder"
          component={Placeholder}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={DURATION}
          defaultProps={{ label: "Pro elements go here" }}
        />
      </Folder>
    </>
  );
};
