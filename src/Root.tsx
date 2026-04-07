import "./index.css";
import { Composition, Folder } from "remotion";
import { Placeholder } from "./compositions/Placeholder";
import { HormoziPopInDemo } from "./compositions/HormoziPopInDemo";
import { KaraokeHighlightDemo } from "./compositions/KaraokeHighlightDemo";
import { WeightShiftDemo } from "./compositions/WeightShiftDemo";
import { BounceKineticDemo } from "./compositions/BounceKineticDemo";
import { TypewriterRevealDemo } from "./compositions/TypewriterRevealDemo";
import { TexturedHighlightDemo } from "./compositions/TexturedHighlightDemo";
import { GlitchHighlightDemo } from "./compositions/GlitchHighlightDemo";
import { BlockFlipDemo } from "./compositions/BlockFlipDemo";

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
          id="caption-karaoke-highlight"
          component={KaraokeHighlightDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={600}
        />
        <Composition
          id="caption-weight-shift"
          component={WeightShiftDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={660}
        />
        <Composition
          id="caption-bounce-kinetic"
          component={BounceKineticDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={280}
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
          id="caption-textured-highlight"
          component={TexturedHighlightDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={300}
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
          id="caption-block-flip"
          component={BlockFlipDemo}
          width={WIDTH}
          height={HEIGHT}
          fps={FPS}
          durationInFrames={300}
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
