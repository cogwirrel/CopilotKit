import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import MarkdownDisplay from "react-native-markdown-display";
import type { MarkdownProps } from "react-native-markdown-display";

/**
 * Props for the CopilotMarkdown component.
 */
export interface CopilotMarkdownProps {
  /** Markdown string to render. */
  content: string;
  /** Optional style overrides merged on top of the defaults. */
  style?: MarkdownProps["style"];
}

/**
 * Default markdown styles tuned for chat bubble display.
 *
 * Exported so consumers can spread and extend:
 * ```ts
 * import { defaultMarkdownStyles } from "@copilotkit/react-native";
 * const custom = { ...defaultMarkdownStyles, heading1: { fontSize: 28 } };
 * ```
 */
export const defaultMarkdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1a1a1a",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold" as const,
    marginTop: 12,
    marginBottom: 8,
    color: "#111111",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginTop: 10,
    marginBottom: 6,
    color: "#111111",
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginTop: 8,
    marginBottom: 4,
    color: "#222222",
  },
  strong: {
    fontWeight: "bold" as const,
  },
  em: {
    fontStyle: "italic" as const,
  },
  link: {
    color: "#0066cc",
    textDecorationLine: "underline" as const,
  },
  blockquote: {
    backgroundColor: "#f5f5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#cccccc",
    paddingLeft: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontFamily: "monospace",
    fontSize: 14,
  },
  code_block: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    fontFamily: "monospace",
    fontSize: 14,
    marginVertical: 8,
  },
  fence: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    fontFamily: "monospace",
    fontSize: 14,
    marginVertical: 8,
  },
  list_item: {
    marginVertical: 2,
  },
  bullet_list: {
    marginVertical: 4,
  },
  ordered_list: {
    marginVertical: 4,
  },
  paragraph: {
    marginVertical: 4,
  },
});

/**
 * Renders markdown content using `react-native-markdown-display` with
 * pre-configured styles suited for CopilotKit chat bubbles.
 *
 * Custom styles are merged on top of the defaults so callers only need
 * to override what they want to change.
 */
export function CopilotMarkdown({ content, style }: CopilotMarkdownProps) {
  const mergedStyles = useMemo(() => {
    if (!style) return defaultMarkdownStyles;
    return { ...defaultMarkdownStyles, ...style };
  }, [style]);

  return (
    <MarkdownDisplay style={mergedStyles} mergeStyle>
      {content}
    </MarkdownDisplay>
  );
}
