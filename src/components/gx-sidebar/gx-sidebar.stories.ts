import type { Meta, StoryObj } from "@storybook/web-components";

const meta: Meta = {
  component: "gx-sidebar"
};
export default meta;

type Story = StoryObj<{
  collapsible: boolean;
  controls: boolean;
  isCollapsed: boolean;
  expandedSize: string;
  collapsedSize: string;
  collapseLabel: string;
  expandLabel: string;
  newChatLabel: string;
}>;

export const Sidebar: Story = {
  args: {
    collapsible: true,
    controls: true,
    isCollapsed: false,
    expandedSize: "300px",
    collapsedSize: "40px",
    collapseLabel: "Collapse window",
    expandLabel: "Expand window",
    newChatLabel: "New Chat"
  }
};
