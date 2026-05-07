/**
 * Stub: replaced by B3 at integration merge.
 */
import React, { createContext, useContext } from "react";

type ToolRenderer = React.ComponentType<{ toolCall: any }>;

const RenderToolContext = createContext<Map<string, ToolRenderer>>(new Map());

export function useRenderToolContext(): Map<string, ToolRenderer> {
  return useContext(RenderToolContext);
}

export { RenderToolContext };
