import React from "react";
import { Notification } from "../components/motion-graphics/Notification";
import { MGDemoStage } from "./shared/MGDemoStage";

export const NotificationDemo: React.FC = () => {
  return (
    <MGDemoStage>
      <Notification
        platform="ios"
        app="apple-pay"
        appName="Apple Pay"
        timestamp="now"
        title="Payment Received"
        body="$5,000.00 from Stripe Inc."
        startMs={500}
        durationMs={4000}
      />
    </MGDemoStage>
  );
};
