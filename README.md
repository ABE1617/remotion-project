# Motion Graphics Kit

Plug-and-play motion-graphics components for Remotion — built for short-form
video (9:16, 1080×1920). Every component ships with:

- A shared positioning API (`anchor`, `offsetX`, `offsetY`, `scale`)
- A shared timing API (`startMs`, `durationMs`, optional `enterFrames` / `exitFrames`)
- Entrance + exit animations (no hard cuts)
- Customizable colors, fonts, text-shadows
- A unified palette (ink gradient + rust/gold accent + cream type)

## Quick start

```bash
npm install
npm run dev          # Remotion studio — preview every component
npx remotion render  # Render your composition
```

## Importing a component

```tsx
import { LowerThird, StatCard, ChatThread } from "./components/motion-graphics";
```

## Shared props

Every component accepts these:

### `MGTimingProps`
| Prop          | Type     | Required | Default        | What                              |
|---------------|----------|----------|----------------|-----------------------------------|
| `startMs`     | `number` | ✅       | —              | When the component starts, in ms  |
| `durationMs`  | `number` | ✅       | —              | Total time on screen              |
| `enterFrames` | `number` | —        | per-component  | Override entrance length          |
| `exitFrames`  | `number` | —        | per-component  | Override exit length              |

### `MGPositionProps`
| Prop       | Type                        | Default  | What                                       |
|------------|-----------------------------|----------|--------------------------------------------|
| `anchor`   | `"center"` \| `"top"` \| `"bottom"` \| `"left"` \| `"right"` \| `"top-left"` \| `"top-right"` \| `"bottom-left"` \| `"bottom-right"` | per-component | Preset anchor on the frame         |
| `offsetX`  | `number`                    | `0`      | Fine-tune horizontally (positive = right)  |
| `offsetY`  | `number`                    | `0`      | Fine-tune vertically (positive = down)     |
| `scale`    | `number`                    | `1`      | Uniform scale multiplier                   |

## Component catalogue

### `LowerThird` — speaker name/title card
```tsx
<LowerThird
  name="Zac Alexander"
  title="Founder · Alexander Media"
  theme="dark"                 // or "light"
  accentColor="#C8551F"
  startMs={400}
  durationMs={4500}
/>
```

### `SceneTitle` — chapter-break panel (full / half-top / half-bottom)
```tsx
<SceneTitle
  label="Part 01"
  title={"The\nHook"}          // \n breaks the line
  variant="full"
  theme="dark"
  startMs={300}
  durationMs={3500}
/>
```

### `AnnotationArrow` — hand-drawn SVG arrow pointing at a spot
```tsx
<AnnotationArrow
  start={{ x: 180, y: 1500 }}
  end={{ x: 760, y: 720 }}
  pathType="straight"          // or "curved-arc" | "j-shape" | "custom"
  color="#C8551F"
  startMs={500}
  durationMs={3500}
/>
```

### `BRollFrame` — framed image/video (1-3 photo stack)
```tsx
<BRollFrame
  src={[
    staticFile("stage1.jpg"),
    staticFile("stage2.jpg"),
    staticFile("stage3.jpg"),
  ]}
  variant="polaroid"           // or "clean" | "white-border"
  caption={["2023", "2024", "2025"]}
  startMs={400}
  durationMs={4000}
/>
```

### `QuoteCard` — editorial pull quote
```tsx
<QuoteCard
  quote="The people who are crazy enough to think they can change the world are the ones who do."
  attribution="Steve Jobs, 2005"
  theme="dark"
  startMs={400}
  durationMs={5000}
/>
```

### `StatCard` — big-number stat reveal (count-up + pulse)
```tsx
<StatCard
  value={500000}
  prefix="$"
  label="In 90 days"
  startMs={400}
  durationMs={4500}
/>
```

### `Notification` — stack of 1-3 iOS / Android banner notifications
```tsx
<Notification
  platform="ios"
  notifications={[
    { app: "stripe", appName: "Stripe", timestamp: "now", title: "Payment Received", body: "$5,000.00 — Acme Media" },
    { app: "apple-pay", appName: "Apple Pay", timestamp: "1m ago", title: "Payment Sent", body: "$42.80 to Blue Bottle Coffee" },
    { app: "imessage", appName: "Messages", timestamp: "2m ago", title: "Sarah", body: "Congrats on the launch!" },
  ]}
  startMs={400}
  durationMs={6500}
/>
```
Supported apps: `"apple-pay" | "venmo" | "stripe" | "imessage" | "instagram" | "email" | "bank"`.

### `ComparisonSplit` — before/after split (stat / text / image / video / color)
```tsx
<ComparisonSplit
  orientation="vertical"
  sides={[
    { type: "stat", value: 2000,  prefix: "$", label: "Per month", desaturate: true },
    { type: "stat", value: 20000, prefix: "$", label: "Per month" },
  ]}
  labels={["Before", "After"]}
  startMs={400}
  durationMs={5500}
/>
```

### `ChartReveal` — animated bar / line chart (values count up)
```tsx
<ChartReveal
  chartType="bar"              // or "line"
  title="Monthly Revenue"
  prefix="$"
  suffix="K"
  data={[
    { label: "Jan", value: 12 },
    { label: "Feb", value: 18 },
    { label: "Mar", value: 25 },
    { label: "Apr", value: 31 },
    { label: "May", value: 48 },
    { label: "Jun", value: 72 },
  ]}
  highlight={{ index: 5 }}     // peak bar
  startMs={400}
  durationMs={5500}
/>
```

### `SpeechBubble` — social platform comment mocks (Tweet / Instagram / iMessage / TikTok)
```tsx
<SpeechBubble
  platform="tweet"
  name="Zac Alexander"
  handle="@zacalex"
  timestamp="2h"
  verified
  text="This is the single best creative kit I've seen this year."
  stats={{ replies: 240, reposts: 1200, likes: 18400, views: 420000 }}
  startMs={400}
  durationMs={5000}
/>
```

### `ProgressBar` — animated goal / progress tracker
```tsx
<ProgressBar
  label="Road to the goal"
  value={72000}
  total={100000}
  formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
  milestones={[
    { at: 0.25, label: "$25K" },
    { at: 0.5,  label: "$50K" },
    { at: 0.75, label: "$75K" },
  ]}
  startMs={400}
  durationMs={5000}
/>
```

### `ChatThread` — floating iMessage-screenshot card with typing indicators
```tsx
<ChatThread
  header={{ name: "Alex", subtitle: "iMessage", initials: "A" }}
  messages={[
    { sender: "them", text: "Hey — saw your last launch.", typingMs: 800 },
    { sender: "me",   text: "Oh yeah? What did you think?" },
    { sender: "them", text: "Honestly? Best work I've seen from you.", typingMs: 1100 },
    { sender: "me",   text: "Means a lot 🙏" },
    { sender: "them", text: "Want to run something similar for us next quarter.", typingMs: 1300 },
  ]}
  startMs={400}
  durationMs={8500}
/>
```

## Palette conventions

The kit uses one consistent palette across every component. You can override
anything per-instance, but the defaults are:

| Role           | Hex         | Notes                              |
|----------------|-------------|------------------------------------|
| Ink / black    | `#0A0A0A`   | Dark card gradient start           |
| Cream / bone   | `#F2E9D6`   | Light card gradient start          |
| Warm ink text  | `#16120E`   | Body text on cream                 |
| Warm cream text| `#F2E9D6`   | Body text on ink                   |
| Rust (accent)  | `#C8551F`   | Accent lines, eyebrows, dividers   |
| Gold (money)   | `#D4A12A`   | ProgressBar accent (revenue vibe)  |

## Examples in `src/compositions/`

Every component has a demo composition in `src/compositions/` — run `npm run dev`
and open the Remotion studio to see them all live. Each demo is a minimal,
client-ready example of how to use that component.

## License

Private / client delivery. Not licensed for redistribution.
