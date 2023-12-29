import { parseDataXML, parseMetadataXML } from "@genexus/reporting-api/dist";
import { TrendIcon } from "@genexus/reporting-api/dist/types/basic-types";
import type { Meta, StoryObj } from "@storybook/web-components";

const serviceResponseCardMock = JSON.stringify({
  Data: parseDataXML("<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<Recordset RecordCount=\"1\" PageCount=\"1\">\n\t<Page PageNumber=\"1\">\n\t\t<Record>\n\t\t\t<F1>72.3845</F1>\n\t\t\t<F1_N>14476.9</F1_N>\n\t\t\t<F1_D>200</F1_D>\n\t\t</Record>\n\t</Page>\n</Recordset>\n"),
  Metadata: parseMetadataXML("<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<OLAPCube Version=\"2\" format=\"compact\" decimalSeparator=\".\" thousandsSeparator=\",\" dateFormat=\"MDY\" textForNullValues=\"\" forceDefaultView=\"yes\" ShowDataLabelsIn=\"\">\n\t<OLAPMeasure name=\"Element1\" displayName=\"Average of Country Life Expectancy\" description=\"Average of Country Life Expectancy\" dataField=\"F1\" visible=\"Yes\" aggregation=\"average\" align=\"right\" picture=\"ZZZZZZZZZZZZZZ9.99 years\" targetValue=\"0\" maximumValue=\"0\" dataType=\"real\" format=\"\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"F1_N\" displayName=\"F1_N\" description=\"F1_N\" dataField=\"F1_N\" visible=\"Never\" aggregation=\"sum\" align=\"right\" picture=\"\" targetValue=\"0\" maximumValue=\"0\" dataType=\"real\" format=\"\" raiseItemClick=\"false\" isComponent=\"true\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"F1_D\" displayName=\"F1_D\" description=\"F1_D\" dataField=\"F1_D\" visible=\"Never\" aggregation=\"count\" align=\"right\" picture=\"\" targetValue=\"0\" maximumValue=\"0\" dataType=\"integer\" format=\"\" raiseItemClick=\"false\" isComponent=\"true\">\n\t</OLAPMeasure>\n</OLAPCube>\n"),
})

const meta: Meta<{
  serviceResponse: any,
  type: string,
  trendPeriod?: string,
  orientation?: string
}> = {
  component: "gx-query-viewer-card",
  argTypes: {
    type: {
      table: {
        disable: true,
      },
    },
    orientation: {
      options: ["Vertical", "Horizontal"],
      control: {
        type: 'select'
      },
      defaultValue: "Vertical"
    },
    trendPeriod: {
      options: [
        "SinceTheBeginning",
        "LastYear",
        "LastSemester",
        "LastQuarter",
        "LastMonth",
        "LastWeek",
        "LastDay",
        "LastHour",
        "LastMinute",
        "LastSecond"
      ],
      control: {
        type: 'select'
      },
    }
  },
  args: {
    serviceResponse: JSON.parse(serviceResponseCardMock),
  }
};
export default meta;

type CardStory = StoryObj<{
  type: "Card",
  value: string;
  description: string;
  includeMaxMin: boolean;
  includeSparkline: boolean;
  includeTrend: boolean;
  orientation: string,
  serviceResponse: any
  showDataAs: string;
  trendPeriod: string;
  seriesData: number[][];
  trendIcon: TrendIcon;
}>;

export const Card: CardStory = {
  args: {
    type: "Card",
    includeSparkline: false,
    value: 'string',
    description: 'Average Life Expectancy',
    includeTrend: false,
    includeMaxMin: true,
    showDataAs: "Values",
    orientation: "Horizontal",
    seriesData: []
  },
  parameters: {
    controls: { exclude: ['chartType'] }
  }
};
