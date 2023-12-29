import { GxQueryItem } from "@genexus/reporting-api/dist/types/basic-types";
import type { Meta, StoryObj } from "@storybook/web-components";

const meta: Meta<{ item: GxQueryItem }> = {
  component: "gx-query-menu-item"
};
export default meta;

type Story = StoryObj<{ item: GxQueryItem }>;

const modified = new Date();
export const Primary: Story = {
  args: {
    item: {
      id: "123",
      name: "Query item 1",
      description: "string",
      expression: "string",
      modified: modified,
      differenceInDays: 1
    } as GxQueryItem
  }
};
