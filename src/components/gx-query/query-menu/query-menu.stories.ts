import type { Meta, StoryObj } from "@storybook/web-components";

const serializedObjectMock = [
  {
    Id: "422fcc61-dfdf-4282-b14d-85c28636042e",
    Name: "AmericanCountriesWithMoreCases",
    Description: "American Countries With More Cases",
    Expression: "",
    Modified: "2023-10-05T21:18:07"
  },
  {
    Id: "87ff9cc8-6196-4cfa-811a-4a154082274f",
    Name: "AverageCountriesGDPPerCapita",
    Description: "Average Countries GDPPer Capita",
    Expression: "",
    Modified: "2022-10-31T20:12:21"
  },
  {
    Id: "94892cdc-665e-4768-a9ea-a376d6905f20",
    Name: "AverageCountryExtremePoverty",
    Description: "Average Country Extreme Poverty",
    Expression: "",
    Modified: "2023-01-04T14:33:27"
  },
  {
    Id: "4bf29a4a-b79b-45af-9277-7bc87704df79",
    Name: "AverageLifeExpectancy",
    Description: "Average Life Expectancy",
    Expression: "",
    Modified: "2023-05-04T18:09:55"
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
