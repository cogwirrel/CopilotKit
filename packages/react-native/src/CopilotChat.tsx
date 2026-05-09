import React, { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useAgent } from "@copilotkit/react-core/v2/headless";
import { DEFAULT_AGENT_ID } from "@copilotkit/shared";

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
  children,
  ...rest
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

  useAgent({ agentId: resolvedAgentId });

  return <>{children}</>;
}
