import { parseDataXML, parseMetadataXML } from "@genexus/reporting-api";
import {
  DUMMY_TRANSLATIONS,
  QueryViewerChartType,
  QueryViewerContinent,
  QueryViewerCountry,
  QueryViewerMapType,
  QueryViewerOrientation,
  QueryViewerOutputType,
  QueryViewerPlotSeries,
  QueryViewerRegion,
  QueryViewerShowDataAs,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal,
  QueryViewerTrendPeriod,
  QueryViewerXAxisLabels
} from "../../common/basic-types";
import { QueryViewerServiceResponse } from "../../services/types/service-result";
import type { Meta, StoryObj } from "@storybook/web-components";

const serviceCardMock = JSON.stringify({
  MetaData: {
    textForNullValues: "",
    axes: [
      {
        name: "Element4",
        title: "Booleano",
        dataField: "F4",
        dataType: "boolean",
        visible: "Yes",
        axis: "Rows",
        canDragToPages: true,
        raiseItemClick: true,
        isComponent: false,
        style: "",
        subtotals: "Yes",
        filter: {
          type: "ShowAllValues",
          values: []
        },
        expandCollapse: {
          type: "ExpandAllValues",
          values: []
        },
        order: {
          type: "None",
          values: []
        },
        valuesStyles: []
      },
      {
        name: "Element5",
        title: "Fecha",
        dataField: "F5",
        dataType: "date",
        visible: "Yes",
        axis: "Rows",
        picture: "99/99/99",
        canDragToPages: true,
        raiseItemClick: true,
        isComponent: false,
        style: "",
        subtotals: "Yes",
        filter: {
          type: "ShowAllValues",
          values: []
        },
        expandCollapse: {
          type: "ExpandAllValues",
          values: []
        },
        order: {
          type: "None",
          values: []
        },
        valuesStyles: []
      },
      {
        name: "Element6",
        title: "Fecha Hora",
        dataField: "F6",
        dataType: "datetime",
        visible: "Yes",
        axis: "Rows",
        picture: "99/99/99 99:99",
        canDragToPages: true,
        raiseItemClick: true,
        isComponent: false,
        style: "",
        subtotals: "Yes",
        filter: {
          type: "ShowAllValues",
          values: []
        },
        expandCollapse: {
          type: "ExpandAllValues",
          values: []
        },
        order: {
          type: "None",
          values: []
        },
        valuesStyles: []
      }
    ],
    data: [
      {
        name: "Element1",
        title: "Entero",
        dataField: "F1",
        aggregation: "",
        dataType: "integer",
        visible: "Yes",
        picture: "ZZZZZZZZZZZZZZ9",
        raiseItemClick: true,
        isComponent: false,
        targetValue: 100,
        maximumValue: 100,
        style: "",
        conditionalStyles: [],
        isFormula: false,
        formula: ""
      },
      {
        name: "Element2",
        title: "Decimal",
        dataField: "F2",
        aggregation: "",
        dataType: "real",
        visible: "Yes",
        picture: "ZZZZZZZZZZZZZZ9",
        raiseItemClick: true,
        isComponent: false,
        targetValue: 100,
        maximumValue: 100,
        style: "",
        conditionalStyles: [],
        isFormula: false,
        formula: ""
      }
    ]
  },
  Data: {
    rows: [
      {
        F4: "False",
        F5: "2022-02-02",
        F6: "2022-02-02 02:02:02",
        F1: "2",
        F2: "2.22",
        F3: "BR                  "
      },
      {
        F4: "False",
        F5: "2022-03-03",
        F6: "2022-03-03 03:03:03",
        F1: "3",
        F2: "3.33",
        F3: "BR                  "
      },
      {
        F4: "False",
        F5: "2022-04-04",
        F6: "2022-04-04 04:04:04",
        F1: "4",
        F2: "4.44",
        F3: "PY                  "
      },
      {
        F4: "True",
        F5: "2022-01-01",
        F6: "2022-01-01 01:01:01",
        F1: "1",
        F2: "1.11",
        F3: "UY                  "
      },
      {
        F4: "True",
        F5: "2022-05-05",
        F6: "2022-05-05 05:05:05",
        F1: "5",
        F2: "5.55",
        F3: "CL                  "
      },
      {
        F4: "True",
        F5: "2022-06-06",
        F6: "2022-06-06 06:06:06",
        F1: "6",
        F2: "6.66",
        F3: "BO                  "
      }
    ]
  }
});

const serviceMock: QueryViewerServiceResponse = {
  MetaData: parseMetadataXML("<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<OLAPCube Version=\"2\" format=\"compact\" decimalSeparator=\".\" thousandsSeparator=\",\" dateFormat=\"MDY\" textForNullValues=\"\" forceDefaultView=\"yes\" ShowDataLabelsIn=\"\">\n\t<OLAPMeasure name=\"Element2\" displayName=\"World Population\" description=\"World Population\" dataField=\"F1\" visible=\"Yes\" aggregation=\"sum\" align=\"right\" picture=\"ZZZ,ZZZ,ZZZ,ZZ9\" targetValue=\"0\" maximumValue=\"0\" dataType=\"integer\" format=\"\">\n\t</OLAPMeasure>\n</OLAPCube>\n"),
  Data: parseDataXML("<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<Recordset RecordCount=\"1\" PageCount=\"1\">\n\t<Page PageNumber=\"1\">\n\t\t<Record>\n\t\t\t<F1>7835329187</F1>\n\t\t</Record>\n\t</Page>\n</Recordset>\n"),
  Properties: {
    "id": "0f1b5ae4-7d15-4c13-b3aa-8ce1bddf12fc",
    "name": "WorldPopulation",
    "description": "World Population",
    "expression": "Query WorldPopulation [OutputType='Card']\r\n{\r\n\tSum(CountryPopulation) [Name='Element2', Description='World Population']\r\n}",
    "modified": "2023-12-28T20:34:09",
    "removeDuplicates": false,
    "maxRows": "",
    "textForNullValues": "",
    "outputType": QueryViewerOutputType.Map,
    "title": "",
    "showValues": true,
    "showDataAs": QueryViewerShowDataAs.Values,
    "orientation": QueryViewerOrientation.Horizontal,
    "includeTrend": false,
    "includeSparkline": false,
    "includeMaxAndMin": false,
    "chartType": QueryViewerChartType.Column,
    "plotSeries": QueryViewerPlotSeries.InTheSameChart,
    "xAxisLabels": QueryViewerXAxisLabels.Horizontally,
    "xAxisIntersectionAtZero": false,
    "xAxisTitle": "",
    "yAxisTitle": "",
    "mapType": QueryViewerMapType.Choropleth,
    "region": QueryViewerRegion.World,
    "continent": QueryViewerContinent.NorthAmerica,
    "country": QueryViewerCountry.UnitedStatesOfAmerica,
    "paging": true,
    "pageSize": 20,
    "showDataLabelsIn": QueryViewerShowDataLabelsIn.Columns,
    "totalForRows": QueryViewerTotal.Yes,
    "totalForColumns": QueryViewerTotal.Yes,
  }
};


const meta: Meta<HTMLGxQueryViewerElement> = {
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
    },
    translations: {
      options: ["GXPL_QViewerSinceTheBeginningTrend", "GXPL_QViewerLastYearTrend", "GXPL_QViewerLastSemesterTrend", "GXPL_QViewerLastQuarterTrend", "GXPL_QViewerLastMonthTrend", "GXPL_QViewerLastWeekTrend", "GXPL_QViewerLastDayTrend", "GXPL_QViewerLastHourTrend", "GXPL_QViewerLastMinuteTrend", "GXPL_QViewerLastSecondTrend", "GXPL_QViewerCardMinimum", "GXPL_QViewerCardMaximum", "GXPL_QViewerNoDatetimeAxis", "GXPL_QViewerNoMapAxis"],
      control: {
        type: 'select'
      },
    }
  },
  args: {
    type: QueryViewerOutputType.Card,
    serviceResponse: serviceMock,
  }
};
export default meta;

type CardStory = StoryObj<HTMLGxQueryViewerCardElement>;

type CardStory3 = StoryObj<{
  type: string,
  includeMaxMin: boolean;
  includeSparkline: boolean;
  includeTrend: boolean;
  orientation: string,
  serviceResponse: any
  showDataAs: string;
  trendPeriod: string;
  translations: any;
}>;

export const Card: CardStory = {
  name: "Show Min Max",
  args: {
    description: 'Title',
    value: '32000',
    minValue: '10000',
    maxValue: '45000',
    includeMaxMin: true,
    includeSparkline: true,
    includeTrend: true,
    translations: DUMMY_TRANSLATIONS,
    trendPeriod: QueryViewerTrendPeriod.SinceTheBeginning,
  },
  parameters: {
    controls: { exclude: ['chartType'] },
  }
};

export const Card2: CardStory = {
  name: "Simple card",
  args: {
    includeSparkline: false,
    value: '123',
    description: 'Description',
    minValue: 'Min',
    maxValue: 'Max',
    includeTrend: false,
    includeMaxMin: false,
    trendPeriod: QueryViewerTrendPeriod.LastMinute,
    title: "Card Title",
    seriesData: [[1, 2, 9, 3], [4, 6]]
  },
  parameters: {
    controls: { exclude: ['chartType'] }
  }
};

export const Card3: CardStory3 = {
  name: "Graph",
  args: {
    type: "Card",
    includeSparkline: true,
    includeTrend: true,
    includeMaxMin: true,
    trendPeriod: "SinceTheBeginningTrend",
    showDataAs: "Values",
    orientation: "Vertical",
    translations: DUMMY_TRANSLATIONS,
    serviceResponse: JSON.parse(serviceCardMock),
  },
  parameters: {
    controls: { exclude: ['chartType'] }
  }
}
