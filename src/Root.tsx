import "./index.css";
import { Composition, Folder } from "remotion";
import { Placeholder } from "./compositions/Placeholder";
import { HormoziPopInDemo } from "./compositions/HormoziPopInDemo";
import { TypewriterRevealDemo } from "./compositions/TypewriterRevealDemo";
import { GlitchHighlightDemo } from "./compositions/GlitchHighlightDemo";
import { EmojiPopDemo } from "./compositions/EmojiPopDemo";
import { NegativeFlashDemo } from "./compositions/NegativeFlashDemo";
import { PaperIIDemo } from "./compositions/PaperIIDemo";


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
