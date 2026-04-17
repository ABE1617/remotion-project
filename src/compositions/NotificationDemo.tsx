import React from "react";
import { Notification } from "../components/motion-graphics/Notification";
import { MGDemoStage } from "./shared/MGDemoStage";

export const NotificationDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <Notification
        platform="ios"
        notifications={[
          {
            app: "stripe",
            appName: "Stripe",
            timestamp: "now",
            title: "Payment Received",
            body: "$5,000.00 — Customer: Acme Media",
          },
          {
            app: "apple-pay",
            appName: "Apple Pay",
            timestamp: "1m ago",
            title: "Payment Sent",
            body: "$42.80 to Blue Bottle Coffee",
          },
          {
            app: "imessage",
            appName: "Messages",
            timestamp: "2m ago",
            title: "Sarah",
            body: "Great work on the launch today — congrats!",
          },
        ]}
        startMs={400}
        durationMs={6500}
      />
    </MGDemoStage>
  );
};
