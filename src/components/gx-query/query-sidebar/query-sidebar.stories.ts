import type { Meta, StoryObj } from "@storybook/web-components";

const meta: Meta = {
  component: "gx-query-sidebar"
};
export default meta;

type Story = StoryObj<{
  collapsible: boolean;
  controls: boolean;
  isCollapsed: boolean;
  expandedSize: string;
  collapsedSize: string;
}>;

export const Sidebar: Story = {
  args: {
    collapsible: true,
    controls: true,
    isCollapsed: false,
    expandedSize: "300px",
    collapsedSize: "40px"
  }
};
