/**
 * CopilotChat stub — replaced by B4's real implementation during integration merge.
 *
 * This file exists so that CopilotModal can compile and tests can run in
 * isolation. The integration branch will resolve conflicts in favor of B4's
 * full implementation.
 */
import React from "react";
import { View } from "react-native";

export interface CopilotChatProps {
  agentName?: string;
  placeholder?: string;
  initialMessages?: string[];
  headerTitle?: string;
}

export function CopilotChat(_props: CopilotChatProps): React.JSX.Element {
  return <View />;
}
