import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { PanelStack } from "../components/transitions/PanelStack";
const SRC = staticFile("sample-video.mp4");
export const PanelStackTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={3500} transitionDurationMs={700}>
    {({ progress }) => (
      <PanelStack clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
