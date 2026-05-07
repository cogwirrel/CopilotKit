/**
 * Stub: replaced by B2 at integration merge.
 */
import React from "react";
import { Text, View, StyleSheet } from "react-native";

export interface AssistantMessageProps {
  content: string;
  isLoading?: boolean;
}

export function AssistantMessage({ content, isLoading }: AssistantMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isLoading ? "..." : content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F0F0",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: "#1A1A1A",
  },
});
