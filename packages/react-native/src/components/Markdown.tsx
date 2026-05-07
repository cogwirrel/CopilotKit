/**
 * Stub for CopilotMarkdown — the real implementation is built by B1.
 * This file exists so that AssistantMessage's import resolves during
 * development and testing. The integration merge will replace this
 * with the full component from B1's branch.
 */
import React from "react";
import { Text } from "react-native";

export interface CopilotMarkdownProps {
  content: string;
}

export function CopilotMarkdown({ content }: CopilotMarkdownProps) {
  return <Text>{content}</Text>;
}
