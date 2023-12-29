import { parseDataXML, parseMetadataXML } from "@genexus/reporting-api";
import type { Meta, StoryObj } from "@storybook/web-components";

// "id": "29fa1936-2db2-4f00-baeb-80e4946e5be6",
// "name": "MultipleDataChart",
const serviceResponseChartMock = JSON.stringify({
  MetaData: parseMetadataXML("<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<OLAPCube Version=\"2\" format=\"compact\" decimalSeparator=\".\" thousandsSeparator=\",\" dateFormat=\"MDY\" textForNullValues=\"\" forceDefaultView=\"yes\" ShowDataLabelsIn=\"\">\n\t<OLAPDimension name=\"Element2\" displayName=\"Country\" description=\"Country\" dataField=\"F1\" visible=\"Yes\" axis=\"Rows\" canDragToPages=\"true\" summarize=\"yes\" align=\"left\" picture=\"\" dataType=\"character\" format=\"\">\n\t\t<include>\n\t\t\t<value>TOTAL</value>\n\t\t</include>\n\t</OLAPDimension>\n\t<OLAPMeasure name=\"Element5\" displayName=\"Population with age &gt;= 65\" description=\"Population with age &gt;= 65\" dataField=\"F2\" visible=\"Yes\" aggregation=\"\" align=\"right\" picture=\"ZZZ,ZZZ,ZZZ,ZZ9\" targetValue=\"0\" maximumValue=\"0\" formula=\"(F2_1*F2_2)/100\" dataType=\"real\" format=\"\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"Element1\" displayName=\"Population with age &lt; 65\" description=\"Population with age &lt; 65\" dataField=\"F3\" visible=\"Yes\" aggregation=\"\" align=\"right\" picture=\"ZZZ,ZZZ,ZZZ,ZZ9\" targetValue=\"0\" maximumValue=\"0\" formula=\"(F3_1*(100-F3_2))/100\" dataType=\"real\" format=\"\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"F2_1\" displayName=\"F2_1\" description=\"F2_1\" dataField=\"F2_1\" visible=\"Never\" aggregation=\"\" align=\"right\" picture=\"\" targetValue=\"0\" maximumValue=\"0\" dataType=\"integer\" format=\"\" raiseItemClick=\"false\" isComponent=\"true\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"F2_2\" displayName=\"F2_2\" description=\"F2_2\" dataField=\"F2_2\" visible=\"Never\" aggregation=\"\" align=\"right\" picture=\"\" targetValue=\"0\" maximumValue=\"0\" dataType=\"real\" format=\"\" raiseItemClick=\"false\" isComponent=\"true\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"F3_1\" displayName=\"F3_1\" description=\"F3_1\" dataField=\"F3_1\" visible=\"Never\" aggregation=\"\" align=\"right\" picture=\"\" targetValue=\"0\" maximumValue=\"0\" dataType=\"integer\" format=\"\" raiseItemClick=\"false\" isComponent=\"true\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"F3_3\" displayName=\"F3_3\" description=\"F3_3\" dataField=\"F3_3\" visible=\"Never\" aggregation=\"\" align=\"right\" picture=\"\" targetValue=\"0\" maximumValue=\"0\" dataType=\"real\" format=\"\" raiseItemClick=\"false\" isComponent=\"true\">\n\t</OLAPMeasure>\n</OLAPCube>\n"),
  Data: parseDataXML("<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<Recordset RecordCount=\"10\" PageCount=\"1\">\n\t<Page PageNumber=\"1\">\n\t\t<Record>\n\t\t\t<F1>China                                   </F1>\n\t\t\t<F2>153679035.41382</F2>\n\t\t\t<F3>1290537066.58618</F3>\n\t\t\t<F2_1>1444216102</F2_1>\n\t\t\t<F2_2>10.641</F2_2>\n\t\t\t<F3_1>1444216102</F3_1>\n\t\t\t<F3_3>10.641</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>India                                   </F1>\n\t\t\t<F2>83451266.98637</F2>\n\t\t\t<F3>1309957766.01363</F3>\n\t\t\t<F2_1>1393409033</F2_1>\n\t\t\t<F2_2>5.989</F2_2>\n\t\t\t<F3_1>1393409033</F3_1>\n\t\t\t<F3_3>5.989</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>United States                           </F1>\n\t\t\t<F2>51312200.35562</F2>\n\t\t\t<F3>281602873.64438</F3>\n\t\t\t<F2_1>332915074</F2_1>\n\t\t\t<F2_2>15.413</F2_2>\n\t\t\t<F3_1>332915074</F3_1>\n\t\t\t<F3_3>15.413</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>Indonesia                               </F1>\n\t\t\t<F2>14699683.50372</F2>\n\t\t\t<F3>261662104.49628</F3>\n\t\t\t<F2_1>276361788</F2_1>\n\t\t\t<F2_2>5.319</F2_2>\n\t\t\t<F3_1>276361788</F3_1>\n\t\t\t<F3_3>5.319</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>Pakistan                                </F1>\n\t\t\t<F2>10122736.80855</F2>\n\t\t\t<F3>215077192.19145</F3>\n\t\t\t<F2_1>225199929</F2_1>\n\t\t\t<F2_2>4.495</F2_2>\n\t\t\t<F3_1>225199929</F3_1>\n\t\t\t<F3_3>4.495</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>Brazil                                  </F1>\n\t\t\t<F2>18300719.07432</F2>\n\t\t\t<F3>195692721.92568</F3>\n\t\t\t<F2_1>213993441</F2_1>\n\t\t\t<F2_2>8.552</F2_2>\n\t\t\t<F3_1>213993441</F3_1>\n\t\t\t<F3_3>8.552</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>Nigeria                                 </F1>\n\t\t\t<F2>5815633.36704</F2>\n\t\t\t<F3>205585070.63296</F3>\n\t\t\t<F2_1>211400704</F2_1>\n\t\t\t<F2_2>2.751</F2_2>\n\t\t\t<F3_1>211400704</F3_1>\n\t\t\t<F3_3>2.751</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>Bangladesh                              </F1>\n\t\t\t<F2>8478152.12412</F2>\n\t\t\t<F3>157825341.87588</F3>\n\t\t\t<F2_1>166303494</F2_1>\n\t\t\t<F2_2>5.098</F2_2>\n\t\t\t<F3_1>166303494</F3_1>\n\t\t\t<F3_3>5.098</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>Russia                                  </F1>\n\t\t\t<F2>20687406.47916</F2>\n\t\t\t<F3>125224615.52084</F3>\n\t\t\t<F2_1>145912022</F2_1>\n\t\t\t<F2_2>14.178</F2_2>\n\t\t\t<F3_1>145912022</F3_1>\n\t\t\t<F3_3>14.178</F3_3>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>Mexico                                  </F1>\n\t\t\t<F2>8932080.4254</F2>\n\t\t\t<F3>121330139.5746</F3>\n\t\t\t<F2_1>130262220</F2_1>\n\t\t\t<F2_2>6.857</F2_2>\n\t\t\t<F3_1>130262220</F3_1>\n\t\t\t<F3_3>6.857</F3_3>\n\t\t</Record>\n\t</Page>\n</Recordset>\n")
});

const meta: Meta<{
  type: string,
  serviceResponse: any,
  chartType: string,
  trendPeriod?: string,
  orientation?: string
}> = {
  component: "gx-query-viewer-chart",
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
    chartType: {
      options: ["Column", "Column3D"],
      control: {
        type: 'select'
      },
      defaultValue: "Column"
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
    serviceResponse: JSON.parse(serviceResponseChartMock),
  }
};
export default meta;

type ChartStory = StoryObj<{
  type: "Chart",
  allowSelection: false,
  cssClass: string,
  chartType: string,
  plotSeries: string,
  queryTitle: string,
  serviceResponse: any
  showDataLabelsIn: string,
  showValues: boolean,
  xAxisIntersectionAtZero: boolean,
  xAxisLabels: string,
  xAxisTitle: string,
  yAxisTitle: string,
}>;

export const Chart: ChartStory = {
  name: "Chart with column",
  args: {
    type: "Chart",
    chartType: "Column",
    allowSelection: false,
    plotSeries: "InTheSameChart",
    showDataLabelsIn: "Columns",
    queryTitle: "Single data chart",
    xAxisIntersectionAtZero: false,
    xAxisLabels: "",
    xAxisTitle: "",
    yAxisTitle: "",
  },
  parameters: {
    controls: { exclude: ['orientation', 'trendPeriod'] }
  }
};

export const Chart3D: ChartStory = {
  name: "Chart with column 3D",
  args: {
    type: "Chart",
    chartType: "Column3D",
    allowSelection: false,
    plotSeries: "InTheSameChart",
    showDataLabelsIn: "Columns",
    queryTitle: "Single data chart",
    xAxisIntersectionAtZero: false,
    xAxisLabels: "",
    xAxisTitle: "",
    yAxisTitle: "",
  },
  parameters: {
    controls: { exclude: ['orientation', 'trendPeriod'] }
  }
};
