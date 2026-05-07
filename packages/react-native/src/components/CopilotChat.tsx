import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
  type ViewStyle,
} from "react-native";
import { useAgent } from "@copilotkit/react-core/v2/headless";
import { useCopilotKit } from "@copilotkit/react-core/v2/context";
import { AssistantMessage } from "./messages/AssistantMessage";
import { UserMessage } from "./messages/UserMessage";
import { useRenderToolContext } from "../hooks/RenderToolContext";

export interface CopilotChatProps {
  /** Agent ID to connect to. Defaults to 'default'. */
  agentName?: string;
  /** Placeholder text for the input field. */
  placeholder?: string;
  /** Suggestion pills shown in the empty state. */
  initialMessages?: string[];
  /** Title shown when there are no messages. */
  emptyStateTitle?: string;
  /** Subtitle shown when there are no messages. */
  emptyStateSubtitle?: string;
  /** Title for the optional header bar. */
  headerTitle?: string;
  /** Whether to show the header bar. Defaults to true. */
  showHeader?: boolean;
  /** Style override for the outermost container. */
  style?: ViewStyle;
  /** Style override for the message list container. */
  messageContainerStyle?: ViewStyle;
  /** Style override for the input bar container. */
  inputContainerStyle?: ViewStyle;
  /** Callback fired when the user sends a message. */
  onSendMessage?: (text: string) => void;
}

interface ChatListItem {
  id: string;
  type: "user" | "assistant" | "tool-call" | "loading";
  content?: string;
  toolCalls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
}

/**
 * Full-screen chat UI component for React Native.
 *
 * Connects to a CopilotKit agent via `useAgent` and renders messages
 * using platform-appropriate AssistantMessage / UserMessage components.
 *
 * Usage:
 * ```tsx
 * <CopilotChat agentName="my-agent" headerTitle="Assistant" />
 * ```
 */
export function CopilotChat({
  agentName = "default",
  placeholder = "Type a message...",
  initialMessages = [],
  emptyStateTitle = "How can I help?",
  emptyStateSubtitle = "Ask me anything or try a suggestion below.",
  headerTitle = "Chat",
  showHeader = true,
  style,
  messageContainerStyle,
  inputContainerStyle,
  onSendMessage,
}: CopilotChatProps) {
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const { copilotkit } = useCopilotKit();
  const { agent } = useAgent({ agentId: agentName });

  const messages: Message[] = agent?.messages ?? [];
  const isRunning = (agent as any)?.isRunning ?? false;

  const toolRenderers = useRenderToolContext();

  // Build flat list items from messages
  const listItems: ChatListItem[] = useMemo(() => {
    const items: ChatListItem[] = [];

    for (const msg of messages) {
      if (msg.role === "user") {
        items.push({
          id: msg.id,
          type: "user",
          content: typeof msg.content === "string" ? msg.content : "",
        });
      } else if (msg.role === "assistant") {
        const assistantMsg = msg as any;
        // Add text content if present
        if (assistantMsg.content) {
          items.push({
            id: msg.id,
            type: "assistant",
            content: assistantMsg.content,
          });
        }
        // Add tool calls if present
        if (assistantMsg.toolCalls && assistantMsg.toolCalls.length > 0) {
          for (const tc of assistantMsg.toolCalls) {
            items.push({
              id: `${msg.id}-tc-${tc.id}`,
              type: "tool-call",
              toolCalls: [tc],
            });
          }
        }
      }
    }

    // Show loading indicator when agent is running and the last message
    // is not already the assistant streaming
    if (isRunning) {
      const lastItem = items[items.length - 1];
      if (!lastItem || lastItem.type !== "assistant") {
        items.push({ id: "__loading__", type: "loading" });
      }
    }

    return items;
  }, [messages, isRunning]);

  // Send a message to the agent
  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isRunning || !agent) return;

    setInputText("");
    onSendMessage?.(text);

    agent.addMessage({
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    } as any);

    try {
      await copilotkit.runAgent({ agent });
    } catch (error) {
      console.error("[CopilotChat] runAgent failed:", error);
    }
  }, [inputText, isRunning, agent, copilotkit, onSendMessage]);

  // Handle suggestion pill press
  const handleSuggestion = useCallback(
    (text: string) => {
      if (isRunning || !agent) return;

      onSendMessage?.(text);

      agent.addMessage({
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
      } as any);

      copilotkit.runAgent({ agent }).catch((error: Error) => {
        console.error("[CopilotChat] runAgent failed:", error);
      });
    },
    [isRunning, agent, copilotkit, onSendMessage],
  );

  // Auto-scroll when content changes
  const handleContentSizeChange = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  // Render a single list item
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ChatListItem>) => {
      if (item.type === "user") {
        return <UserMessage content={item.content ?? ""} />;
      }

      if (item.type === "assistant") {
        return (
          <AssistantMessage
            content={item.content ?? ""}
            isLoading={isRunning && item === listItems[listItems.length - 1]}
          />
        );
      }

      if (item.type === "tool-call" && item.toolCalls) {
        const tc = item.toolCalls[0];
        const renderer = toolRenderers.get(tc.function.name);
        if (renderer) {
          const RendererComponent = renderer;
          return <RendererComponent toolCall={tc} />;
        }
        // Subtle indicator for unregistered tool calls
        return (
          <View style={styles.toolCallIndicator}>
            <Text style={styles.toolCallText}>
              Called: {tc.function.name}
            </Text>
          </View>
        );
      }

      if (item.type === "loading") {
        return <AssistantMessage content="" isLoading />;
      }

      return null;
    },
    [isRunning, listItems, toolRenderers],
  );

  const keyExtractor = useCallback(
    (item: ChatListItem) => item.id,
    [],
  );

  // Empty state component
  const emptyComponent = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{emptyStateTitle}</Text>
        <Text style={styles.emptySubtitle}>{emptyStateSubtitle}</Text>
        {initialMessages.map((suggestion, i) => (
          <Pressable
            key={`suggestion-${i}`}
            style={styles.suggestionPill}
            onPress={() => handleSuggestion(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </Pressable>
        ))}
      </View>
    ),
    [emptyStateTitle, emptyStateSubtitle, initialMessages, handleSuggestion],
  );

  const sendDisabled = !inputText.trim() || isRunning;

  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[styles.messageList, messageContainerStyle]}
        onContentSizeChange={handleContentSizeChange}
        ListEmptyComponent={emptyComponent}
      />

      <View style={[styles.inputContainer, inputContainerStyle]}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxNumberOfLines={4}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, sendDisabled && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={sendDisabled}
          testID="send-button"
        >
          <Text style={styles.sendButtonIcon}>{"↑"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  messageList: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 100,
    color: "#1A1A1A",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0066CC",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 16,
  },
  suggestionPill: {
    backgroundColor: "#E8F0FE",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  suggestionText: {
    color: "#0066CC",
    fontWeight: "600",
    fontSize: 14,
  },
  toolCallIndicator: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  toolCallText: {
    fontSize: 12,
    color: "#999999",
    fontStyle: "italic",
  },
});
