/**
 * Stub: replaced by B2 at integration merge.
 */
import React from "react";
import { Text, View, StyleSheet } from "react-native";

export interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    backgroundColor: "#0066CC",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: "#FFFFFF",
  },
});
