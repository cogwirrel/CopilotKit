/**
 * @copilotkit/react-native
 *
 * React Native bindings for CopilotKit. Provides a lightweight provider
 * and re-exports platform-agnostic hooks from @copilotkit/react-core.
 *
 * Quick start:
 * ```tsx
 * import { CopilotKitProvider, useAgent, useCopilotKit } from "@copilotkit/react-native";
 * ```
 */

// React Native provider (no web dependencies)
export { CopilotKitProvider } from "./CopilotKitProvider";
export type { CopilotKitNativeProviderProps } from "./CopilotKitProvider";

// Re-export context and hooks from react-core (platform-agnostic)
export {
  useCopilotKit,
  useLicenseContext,
  CopilotKitContext,
  type CopilotKitContextValue,
} from "@copilotkit/react-core/v2/context";

// Re-export hooks that work without web deps
// These consume the CopilotKitContext which our provider sets
export {
  useAgent,
  useFrontendTool,
  useComponent,
  useHumanInTheLoop,
  useInterrupt,
  useSuggestions,
  useConfigureSuggestions,
  useAgentContext,
  useThreads,
  type UseAgentUpdate,
} from "@copilotkit/react-core/v2/headless";

// Re-export core types commonly needed
export {
  type CopilotKitCoreRuntimeConnectionStatus,
  type CopilotKitCoreErrorCode,
} from "@copilotkit/core";

// UI components
export { CopilotChat } from "./components/CopilotChat";
export type { CopilotChatProps } from "./components/CopilotChat";
export { CopilotModal } from "./components/CopilotModal";
export type {
  CopilotModalProps,
  CopilotModalRef,
} from "./components/CopilotModal";
export { AssistantMessage } from "./components/messages/AssistantMessage";
export type { AssistantMessageProps } from "./components/messages/AssistantMessage";
export { UserMessage } from "./components/messages/UserMessage";
export type { UserMessageProps } from "./components/messages/UserMessage";
export { CopilotMarkdown, defaultMarkdownStyles } from "./components/Markdown";
export type { CopilotMarkdownProps } from "./components/Markdown";

// Hooks
export { useRenderTool } from "./hooks/useRenderTool";
export {
  RenderToolProvider,
  useRenderToolRegistry,
} from "./hooks/RenderToolContext";
export type { RenderToolProps } from "./hooks/RenderToolContext";
