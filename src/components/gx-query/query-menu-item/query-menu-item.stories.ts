import type { Meta, StoryObj } from "@storybook/web-components";
import { GxQueryItem } from "../../../common/basic-types";

const meta: Meta<{ item: GxQueryItem }> = {
  component: "gx-query-menu-item"
};
export default meta;

type Story = StoryObj<{ item: GxQueryItem }>;

const modified = new Date();
export const Primary: Story = {
  args: {
    item: {
      Id: "123",
      Name: "Query item 1",
      Description: "string",
      Expression: "string",
      Modified: modified,
      differenceInDays: 1
    } as GxQueryItem
  }
};
