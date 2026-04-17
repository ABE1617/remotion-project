import React from "react";
import { SpeechBubble } from "../components/motion-graphics/SpeechBubble";
import { MGDemoStage } from "./shared/MGDemoStage";

// Showcases the Tweet variant — most "premium-feeling" of the four and the
// one most likely to prove the motion-graphic reads as a real screenshot.
export const SpeechBubbleDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <SpeechBubble
        platform="tweet"
        name="Naval"
        handle="@naval"
        timestamp="2h"
        initials="N"
        avatarColor="#1D9BF0"
        verified
        text="The most powerful skill you can develop is the ability to focus on one thing for a long time."
        stats={{
          replies: 247,
          reposts: 1820,
          likes: 18400,
          views: 920000,
        }}
        startMs={400}
        durationMs={4000}
      />
    </MGDemoStage>
  );
};
