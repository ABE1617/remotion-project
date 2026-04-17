import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { MotionBlurSlide } from "../components/transitions/MotionBlurSlide";
const SRC = staticFile("sample-video.mp4");
export const MotionBlurSlideTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3000} transitionDurationMs={550}>
    {({ progress }) => <MotionBlurSlide clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
