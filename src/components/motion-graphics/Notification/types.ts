import type { MGTimingProps } from "../shared/types";

// Supported app identifiers for the notification's icon slot.
export type NotificationApp =
  | "apple-pay"
  | "venmo"
  | "stripe"
  | "imessage"
  | "instagram"
  | "email"
  | "bank";

export interface NotificationProps extends MGTimingProps {
  // Controls the platform-specific visual language (default "ios").
  platform?: "ios" | "android";
  // Which app icon + look to render.
  app: NotificationApp;
  // App name shown on the top row, left side (e.g. "Apple Pay").
  appName: string;
  // Timestamp shown on the top row, right side. Defaults to "now".
  timestamp?: string;
  // Headline text (e.g. "Payment Received").
  title: string;
  // Supporting body text. Truncates at 2 lines.
  body: string;
}
