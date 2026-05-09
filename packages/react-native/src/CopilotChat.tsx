import React, { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useAgent } from "@copilotkit/react-core/v2/headless";
import { useCopilotKit } from "@copilotkit/react-core/v2/context";
import { DEFAULT_AGENT_ID } from "@copilotkit/shared";
import type { CopilotKitCoreErrorCode } from "@copilotkit/core";

export interface CopilotChatProps {
  /**
   * The agent ID to use for this chat session.
   * Matches the web SDK's CopilotChat `agentId` prop.
   *
   * Resolution order: `agentId` > `agentName` > `"default"`
   */
  agentId?: string;

  /**
   * @deprecated Use `agentId` instead. `agentName` is kept for backwards
   * compatibility and will be removed in a future release.
   */
  agentName?: string;

  /**
   * Thread ID for this chat session. When provided, the chat will resume
   * the specified thread. Matches the web SDK's CopilotChat `threadId` prop.
   */
  threadId?: string;

  /**
   * Error handler scoped to this chat's agent. Fires in addition to the
   * provider-level onError (does not suppress it). Receives only errors
   * whose context.agentId matches this chat's agent.
   */
  onError?: (event: {
    error: Error;
    code: CopilotKitCoreErrorCode;
    context: Record<string, any>;
  }) => void | Promise<void>;

  /**
   * Throttle interval (in milliseconds) for re-renders triggered by message
   * change notifications. Overrides the provider-level `defaultThrottleMs`
   * for this chat instance. Forwarded to the internal `useAgent()` hook.
   *
   * @default undefined -- inherits from provider `defaultThrottleMs`;
   * if that is also unset, re-renders are unthrottled.
   */
  throttleMs?: number;

  /**
   * Optional children rendered inside the chat context.
   */
  children?: ReactNode;

  /** Passthrough props are forwarded to consumers via the agent context. */
  [key: string]: unknown;
}

/**
 * Headless CopilotChat component for React Native.
 *
 * Wires up the `useAgent` hook with `agentId` resolution and renders children.
 * Unlike the web SDK's CopilotChat, this component does not render any UI
 * elements -- consumers provide their own React Native views.
 *
 * ```tsx
 * import { CopilotChat } from "@copilotkit/react-native";
 *
 * <CopilotChat agentId="my-agent">
 *   <MyChatUI />
 * </CopilotChat>
 * ```
 */
export function CopilotChat({
  agentId,
  agentName,
  threadId,
  onError,
  throttleMs,
  children,
  ..._rest
}: CopilotChatProps) {
  const resolvedAgentId = agentId ?? agentName ?? DEFAULT_AGENT_ID;

  // Deprecation warning (dev only, fires once per mount)
  const warnedRef = useRef(false);
  useEffect(() => {
    if (
      agentName !== undefined &&
      agentId === undefined &&
      !warnedRef.current
    ) {
      warnedRef.current = true;
      if (typeof __DEV__ === "undefined" || __DEV__) {
        console.warn(
          "[CopilotKit] agentName is deprecated, use agentId instead",
        );
      }
    }
  }, [agentName, agentId]);

  const { agent } = useAgent({ agentId: resolvedAgentId, throttleMs });

  // Set threadId on the agent when provided
  useEffect(() => {
    if (threadId) {
      agent.threadId = threadId;
    }
  }, [agent, threadId]);

  // onError subscription -- forward core errors scoped to this chat's agent
  const { copilotkit } = useCopilotKit();
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!onErrorRef.current) return;

    const subscription = copilotkit.subscribe({
      onError: (event) => {
        // Only forward errors that match this chat's agent
        if (
          event.context?.agentId === resolvedAgentId ||
          !event.context?.agentId
        ) {
          onErrorRef.current?.({
            error: event.error,
            code: event.code,
            context: event.context,
          });
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [copilotkit, resolvedAgentId]);

  return <>{children}</>;
}
