import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { Stack } from "../components/transitions/Stack";
const SRC = staticFile("sample-video.mp4");
export const StackTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1500}>
    {({ progress }) => <Stack clipA={SRC} clipB={SRC} progress={progress} />}
  </TransitionDemoWrapper>
);
