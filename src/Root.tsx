import "./index.css";
import { Composition, Folder } from "remotion";
import { Placeholder } from "./compositions/Placeholder";

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
