import type { Meta, StoryObj } from "@storybook/web-components";

const serializedObjectMock = [
  {
    id: "422fcc61-dfdf-4282-b14d-85c28636042e",
    name: "AmericanCountriesWithMoreCases",
    description: "American Countries With More Cases",
    expression: "",
    modified: "2023-10-05T21:18:07"
  },
  {
    id: "87ff9cc8-6196-4cfa-811a-4a154082274f",
    name: "AverageCountriesGDPPerCapita",
    description: "Average Countries GDPPer Capita",
    expression: "",
    modified: "2022-10-31T20:12:21"
  },
  {
    id: "94892cdc-665e-4768-a9ea-a376d6905f20",
    name: "AverageCountryExtremePoverty",
    description: "Average Country Extreme Poverty",
    expression: "",
    modified: "2023-01-04T14:33:27"
  },
  {
    id: "4bf29a4a-b79b-45af-9277-7bc87704df79",
    name: "AverageLifeExpectancy",
    description: "Average Life Expectancy",
    expression: "",
    modified: "2023-05-04T18:09:55"
  }
];

const meta: Meta<{ serializedObject: string }> = {
  component: "gx-query-menu"
};
export default meta;

type Story = StoryObj<{ serializedObject: string }>;

export const SerializedObject: Story = {
  args: {
    serializedObject: JSON.stringify(serializedObjectMock)
  }
};
