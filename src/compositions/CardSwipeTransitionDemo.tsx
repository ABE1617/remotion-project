import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { CardSwipe } from "../components/transitions/CardSwipe";
const SRC = staticFile("sample-video.mp4");
export const CardSwipeTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1500}>
    {({ progress }) => <CardSwipe clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
