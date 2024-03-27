import { html } from 'lit-html';
import type { Meta, StoryObj } from "@storybook/web-components";
import { QueryViewerChartType, QueryViewerOrientation, QueryViewerOutputType, QueryViewerTotal } from "@genexus/reporting-api";

const meta: Meta<HTMLGxQueryViewerControllerElement> = {
  component: "gx-query-viewer-controller",
  decorators: [(story, context) => html`
    <div style="height: 200px; margin: 40px; display: flex; width: 100%">
      <gx-query-viewer-slider start-slider-value="50" end-slider-value="80">
        <gx-query-viewer
          control-name="gx1"
          type="${context.args.type}"
          slot="content"
          chart-type="Line"
          allow-selection="false"
          plot-series="InTheSameChart"
          show-data-labels-in="Columns"
          query-title="4 - Single data chart - with slider"
          x-axis-intersection-at-zero="false"
          x-axis-labels=""
          x-axis-title=""
          y-axis-title=""
        >${story()}</gx-query-viewer>
      </gx-query-viewer-slider>
    </div>
  `],
  argTypes: {
    type: {
      options: [
        QueryViewerOutputType.Chart,
        QueryViewerOutputType.Card,
        QueryViewerOutputType.Map,
        QueryViewerOutputType.PivotTable,
        QueryViewerOutputType.Table
      ],
      control: {
        type: 'select'
      },
    },
    chartType: {
      options: [
        QueryViewerChartType.Area,
        QueryViewerChartType.Bar,
        QueryViewerChartType.CircularGauge,
        QueryViewerChartType.Column,
        QueryViewerChartType.Column3D,
        QueryViewerChartType.Column3DLine,
        QueryViewerChartType.ColumnLine,
        QueryViewerChartType.Doughnut,
        QueryViewerChartType.Doughnut3D,
        QueryViewerChartType.FilledRadar,
        QueryViewerChartType.Funnel,
        QueryViewerChartType.Line,
        QueryViewerChartType.LinearGauge,
        QueryViewerChartType.Pie,
        QueryViewerChartType.Pie3D,
        QueryViewerChartType.PolarArea,
        QueryViewerChartType.Pyramid,
        QueryViewerChartType.Radar,
        QueryViewerChartType.SmoothArea,
        QueryViewerChartType.SmoothLine,
        QueryViewerChartType.SmoothTimeline,
        QueryViewerChartType.Sparkline,
        QueryViewerChartType.StackedArea,
        QueryViewerChartType.StackedArea100,
        QueryViewerChartType.StackedBar,
        QueryViewerChartType.StackedBar100,
        QueryViewerChartType.StackedColumn,
        QueryViewerChartType.StackedColumn100,
        QueryViewerChartType.StackedColumn3D,
        QueryViewerChartType.StackedLine,
        QueryViewerChartType.StackedLine100,
        QueryViewerChartType.StepArea,
        QueryViewerChartType.StepLine,
        QueryViewerChartType.StepTimeline,
        QueryViewerChartType.Timeline,
      ],
      control: 'select',
      defaultValue: QueryViewerChartType.Column
    },
    environment: {
      options: [
        "net",
        "java"
      ],
      control: 'select'
    },
    orientation: {
      options: [QueryViewerOrientation.Vertical, QueryViewerOrientation.Horizontal],
      control: {
        type: 'radio'
      },
      defaultValue: "Vertical"
    },
    totalForRows: {
      options: [ QueryViewerTotal.Yes, QueryViewerTotal.No ],
      control: {
        type: 'radio'
      },
      defaultValue: QueryViewerTotal.No
    }
  },
  args: {
    baseUrl: import.meta.env.STORYBOOK_QUERY_URL,
    apiKey: import.meta.env.STORYBOOK_API_KEY,
    saiaToken: import.meta.env.STORYBOOK_SAIA_TOKEN,
    saiaUserId: import.meta.env.STORYBOOK_SAIA_USER_ID,
    allowElementsOrderChange: true,
    applicationNamespace: "",
    chartType: QueryViewerChartType.Column,
    includeSparkline: false,
    includeTrend: false,
    metadataName: import.meta.env.STORYBOOK_METADATA_NAME,
    orientation: QueryViewerOrientation.Vertical,
    pageSize: 10,
    paging: true,
    queryTitle: "",
    totalForRows: QueryViewerTotal.No,
    useGxquery: true,
  },
  parameters: {
    controls: { exclude: ['baseUrl', 'apiKey', 'saiaToken', 'saiaUserId'] }
  }
};
export default meta;

type Story = StoryObj<HTMLGxQueryViewerControllerElement>;

export const Slider: Story = {
  name: "Slider",
  args: {
    useGxquery: true,
    metadataName: import.meta.env.STORYBOOK_METADATA_NAME,
    objectName: 'UruguayHarvardIndex',
    type: QueryViewerOutputType.Chart
  }
};
