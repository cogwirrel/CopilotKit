/**
 * @copilotkit/react-native
 *
 * React Native bindings for CopilotKit. Provides a lightweight provider
 * and re-exports platform-agnostic hooks from @copilotkit/react-core.
 *
 * Polyfills (DOMException, ReadableStream, TextEncoder, etc.) are
 * auto-imported when this module loads -- no manual
 * `import "@copilotkit/react-native/polyfills"` needed.
 *
 * Quick start:
 * ```tsx
 * import { CopilotKitProvider, useAgent, useCopilotKit } from "@copilotkit/react-native";
 * ```
 */

// Auto-install polyfills so consumers don't need a manual import.
// Must run before any CopilotKit code that relies on ReadableStream / fetch streaming.
import "./polyfills";

// React Native provider (no web dependencies)
export { CopilotKitProvider } from "./CopilotKitProvider";
export type { CopilotKitNativeProviderProps } from "./CopilotKitProvider";

// Provider props alias (mirrors web's CopilotKitProviderProps)
export type { CopilotKitNativeProviderProps as CopilotKitProviderProps } from "./CopilotKitProvider";

// Headless chat components (no DOM, consumer provides UI)
export { CopilotChat } from "./CopilotChat";
export type { CopilotChatProps } from "./CopilotChat";
export { CopilotModal } from "./CopilotModal";
export type { CopilotModalProps } from "./CopilotModal";

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
  useRenderTool,
  type UseAgentUpdate,
} from "@copilotkit/react-core/v2/headless";

// Re-export core types commonly needed
export type {
  CopilotKitCoreRuntimeConnectionStatus,
  CopilotKitCoreErrorCode,
  Suggestion,
  FrontendTool,
  ToolCallStatus,
} from "@copilotkit/core";

// Re-export AG-UI types for consumer convenience (matches web SDK surface)
export type {
  Message,
  AssistantMessage,
  ToolCall,
  ToolMessage,
  AbstractAgent,
  AgentCapabilities,
} from "@ag-ui/client";
