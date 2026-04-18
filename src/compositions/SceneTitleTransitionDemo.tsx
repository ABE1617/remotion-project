import React from "react";
import { staticFile } from "remotion";
import { TransitionDemoWrapper } from "./TransitionDemoWrapper";
import { SceneTitle } from "../components/transitions/SceneTitle";

const SRC = staticFile("sample-video.mp4");

export const SceneTitleTransitionDemo: React.FC = () => (
  <TransitionDemoWrapper transitionStartMs={2500} transitionDurationMs={2500}>
    {({ progress }) => (
      <SceneTitle
        clipA={SRC}
        clipB={SRC}
        progress={progress}
        label="PART 02"
        title={"THE\nHOOK"}
        variant="full"
        theme="dark"
        accentColor="#C8551F"
      />
    )}
  </TransitionDemoWrapper>
);
