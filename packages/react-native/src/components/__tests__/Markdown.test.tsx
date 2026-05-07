import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock react-native since we're in jsdom
vi.mock("react-native", () => ({
  StyleSheet: {
    create: <T extends Record<string, any>>(styles: T): T => styles,
    flatten: (style: any) => style,
  },
  View: "View",
  Text: "Text",
}));

// Capture the props passed to MarkdownDisplay
let lastMarkdownProps: any = null;

vi.mock("react-native-markdown-display", () => ({
  __esModule: true,
  default: function MockMarkdownDisplay(props: any) {
    lastMarkdownProps = props;
    return React.createElement("div", { "data-testid": "markdown" }, props.children);
  },
}));

// Import after mocks
import { CopilotMarkdown, defaultMarkdownStyles } from "../Markdown";

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("CopilotMarkdown", () => {
  beforeEach(() => {
    lastMarkdownProps = null;
  });

  it("renders without crashing", () => {
    const { container } = render(<CopilotMarkdown content="Hello world" />);
    expect(container).toBeTruthy();
  });

  it("passes content as children to MarkdownDisplay", () => {
    render(<CopilotMarkdown content="# Title" />);
    expect(lastMarkdownProps).not.toBeNull();
    expect(lastMarkdownProps.children).toBe("# Title");
  });

  it("uses default styles when no custom style is provided", () => {
    render(<CopilotMarkdown content="test" />);
    expect(lastMarkdownProps.style).toBe(defaultMarkdownStyles);
  });

  it("merges custom styles with defaults", () => {
    const customStyle = { body: { fontSize: 20, color: "#000" } };
    render(<CopilotMarkdown content="test" style={customStyle} />);

    // Custom should override the body style
    expect(lastMarkdownProps.style.body).toEqual({ fontSize: 20, color: "#000" });
    // Other defaults should still be present
    expect(lastMarkdownProps.style.heading1).toEqual(defaultMarkdownStyles.heading1);
    expect(lastMarkdownProps.style.code_block).toEqual(defaultMarkdownStyles.code_block);
  });

  it("renders safely with empty content", () => {
    const { container } = render(<CopilotMarkdown content="" />);
    expect(container).toBeTruthy();
    expect(lastMarkdownProps.children).toBe("");
  });

  it("enables mergeStyle on the underlying MarkdownDisplay", () => {
    render(<CopilotMarkdown content="test" />);
    expect(lastMarkdownProps.mergeStyle).toBe(true);
  });
});

describe("defaultMarkdownStyles", () => {
  it("exports a style object with expected keys", () => {
    expect(defaultMarkdownStyles.body).toBeDefined();
    expect(defaultMarkdownStyles.heading1).toBeDefined();
    expect(defaultMarkdownStyles.heading2).toBeDefined();
    expect(defaultMarkdownStyles.heading3).toBeDefined();
    expect(defaultMarkdownStyles.strong).toBeDefined();
    expect(defaultMarkdownStyles.em).toBeDefined();
    expect(defaultMarkdownStyles.link).toBeDefined();
    expect(defaultMarkdownStyles.blockquote).toBeDefined();
    expect(defaultMarkdownStyles.code_inline).toBeDefined();
    expect(defaultMarkdownStyles.code_block).toBeDefined();
    expect(defaultMarkdownStyles.fence).toBeDefined();
    expect(defaultMarkdownStyles.list_item).toBeDefined();
    expect(defaultMarkdownStyles.bullet_list).toBeDefined();
    expect(defaultMarkdownStyles.ordered_list).toBeDefined();
    expect(defaultMarkdownStyles.paragraph).toBeDefined();
  });
});
