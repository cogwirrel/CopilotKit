# @copilotkit/react-native — Usage

## Quick Start

```tsx
import "@copilotkit/react-native/polyfills";
import { CopilotKitProvider, CopilotChat, useRenderTool } from "@copilotkit/react-native";

function App() {
  return (
    <CopilotKitProvider runtimeUrl="https://your-server/api/copilotkit">
      <ChatScreen />
    </CopilotKitProvider>
  );
}

function ChatScreen() {
  useRenderTool({
    name: "showWeather",
    description: "Show weather info",
    parameters: [{ name: "city", type: "string" }],
    render: ({ args }) => <WeatherCard city={args.city} />,
  });

  return <CopilotChat placeholder="Ask anything..." />;
}
```

## Available Components

### CopilotChat

Inline chat panel. Renders a message list with an input bar.

```tsx
import { CopilotChat } from "@copilotkit/react-native";

<CopilotChat placeholder="Type a message..." />
```

### CopilotModal

Modal chat overlay. Open/close programmatically via a ref.

```tsx
import { CopilotModal, type CopilotModalRef } from "@copilotkit/react-native";
import { useRef } from "react";

const modalRef = useRef<CopilotModalRef>(null);

<CopilotModal ref={modalRef} title="Assistant" />

// Open it:
modalRef.current?.open();
```

### CopilotMarkdown

Renders Markdown text with sensible React Native styling.

```tsx
import { CopilotMarkdown } from "@copilotkit/react-native";

<CopilotMarkdown content="**Hello** from CopilotKit!" />
```

### AssistantMessage / UserMessage

Individual message bubbles. Useful when building a custom chat UI.

```tsx
import { AssistantMessage, UserMessage } from "@copilotkit/react-native";

<UserMessage content="What's the weather?" />
<AssistantMessage content="It's sunny!" isLoading={false} />
```

## Hooks

### useRenderTool

Register a React Native component to render inline when the agent calls a tool.

```tsx
useRenderTool({
  name: "showChart",
  description: "Display a chart",
  parameters: [{ name: "data", type: "object" }],
  render: ({ args }) => <ChartView data={args.data} />,
});
```

## Alternative Import Path

Components can also be imported from the `/components` subpath:

```tsx
import { CopilotChat, CopilotModal } from "@copilotkit/react-native/components";
```
