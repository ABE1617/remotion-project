import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Glitch } from "../components/transitions/Glitch";
const SRC = staticFile("sample-video.mp4");
export const GlitchTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={400}>
    {({ progress }) => (
      <Glitch clipA={SRC} clipB={SRC} progress={progress} intensity="soft" />
    )}
  </TransitionDemoWrapper>
);
