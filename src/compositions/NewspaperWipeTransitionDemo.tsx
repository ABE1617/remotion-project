import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { NewspaperWipe } from "../components/transitions/NewspaperWipe";
const SRC = staticFile("sample-video.mp4");
export const NewspaperWipeTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={700}>
    {({ progress }) => (
      <NewspaperWipe clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
