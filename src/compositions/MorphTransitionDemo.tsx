import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Morph } from "../components/transitions/Morph";
const SRC = staticFile("sample-video.mp4");
export const MorphTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1500}>
    {({ progress }) => <Morph clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
