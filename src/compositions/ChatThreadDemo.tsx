import React from "react";
import { ChatThread } from "../components/motion-graphics/ChatThread";
import { MGDemoStage } from "./shared/MGDemoStage";

export const ChatThreadDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <ChatThread
        header={{
          name: "Alex",
          subtitle: "iMessage",
          initials: "A",
          avatarColor: "#C8551F",
        }}
        messages={[
          { sender: "them", text: "Hey — saw your last launch.", typingMs: 800 },
          { sender: "me", text: "Oh yeah? What did you think?" },
          {
            sender: "them",
            text: "Honestly? Best work I've seen from you.",
            typingMs: 1100,
          },
          { sender: "me", text: "Means a lot man 🙏" },
          {
            sender: "them",
            text: "Want to run something similar for us next quarter.",
            typingMs: 1300,
          },
        ]}
        startMs={400}
        durationMs={8500}
      />
    </MGDemoStage>
  );
};
