import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { FilmStrip } from "../components/transitions/FilmStrip";
const SRC = staticFile("sample-video.mp4");
export const FilmStripTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={1450}>
    {({ progress }) => (
      <FilmStrip clipA={SRC} clipB={SRC} progress={progress} />
    )}
  </TransitionDemoWrapper>
);
