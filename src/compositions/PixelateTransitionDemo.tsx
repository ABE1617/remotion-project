import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Pixelate } from "../components/transitions/Pixelate";
const SRC = staticFile("sample-video.mp4");
export const PixelateTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={600}>
    {({ progress }) => (
      <Pixelate clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
