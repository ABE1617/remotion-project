import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { MaskWipe } from "../components/transitions/MaskWipe";
const SRC = staticFile("sample-video.mp4");
export const MaskWipeTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3000} transitionDurationMs={600}>
    {({ progress }) => <MaskWipe clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
