import type { Meta, StoryObj } from "@storybook/web-components";


const meta: Meta = {
  component: "gx-floating-window",
};
export default meta;

type Story = StoryObj<{
  mainTitle: string;
  resizeWindow: boolean;
  isUnlocked: boolean;
  isMinimized: boolean;
  expandedSize: string;
}>;

export const Sidebar: Story = {
  args: {
    mainTitle: "Title",
    resizeWindow: true,
    isUnlocked: true,
    isMinimized: true,
    expandedSize: "300px"
  },
};
