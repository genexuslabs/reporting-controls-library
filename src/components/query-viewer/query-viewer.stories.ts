import { html } from 'lit-html';
import type { Meta, StoryObj } from "@storybook/web-components";
import { QueryViewerChartType, QueryViewerOrientation, QueryViewerOutputType, QueryViewerTotal } from "@genexus/reporting-api";

const meta: Meta<HTMLGxQueryViewerControllerElement> = {
  component: "gx-query-viewer-controller",
  decorators: [(story, context) => html`<gx-query-viewer type="${context.args.type}" control-name="gx1">${story()}</gx-query-viewer>`],
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
    metadataId: import.meta.env.STORYBOOK_METADATA_ID,
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

export const Chart: Story = {
  name: "Chart with serializationObject",
  args: {
    useGxquery: true,
    metadataId: import.meta.env.STORYBOOK_METADATA_ID,
    serializedObject: '{ "id": "72508bf7-d801-49cb-898c-7cbf4b700c03", "title": "Chart - with controller", "chartType":"Column", "showValues":"true" }',
    type: QueryViewerOutputType.Chart
  }
};
export const Chart2: Story = {
  name: "Chart with objectName",
  args: {
    useGxquery: true,
    metadataId: import.meta.env.STORYBOOK_METADATA_ID,
    objectName: 'CountriesByGDPPerCapita',
    type: QueryViewerOutputType.Chart
  },
  parameters: {
  }
};
export const PivotTable: Story = {
  name: "Pivot Table",
  args: {
    useGxquery: true,
    metadataId: import.meta.env.STORYBOOK_METADATA_ID,
    objectName: 'CountriesByGDPPerCapita',
    type: QueryViewerOutputType.PivotTable,
    pageSize: 5
  },
  parameters: {
  }
};


export const Table: Story = {
  name: "Table",
  args: {
    useGxquery: true,
    metadataId: import.meta.env.STORYBOOK_METADATA_ID,
    objectName: 'CountriesByGDPPerCapita',
    type: QueryViewerOutputType.Table
  },
  parameters: {
  }
};

export const MapChoropleth: Story = {
  name: "Map choropleth",
  args: {
    useGxquery: true,
    metadataId: import.meta.env.STORYBOOK_METADATA_ID,
    objectName: 'TotalCasesPerMillionMap',
    type: QueryViewerOutputType.Map
  },
  parameters: {
  }
};

export const MapBubble: Story = {
  name: "Map bubble",
  args: {
    useGxquery: true,
    metadataId: import.meta.env.STORYBOOK_METADATA_ID,
    objectName: 'PopulationByCountryBubbleMap',
    type: QueryViewerOutputType.Map
  },
  parameters: {
  }
};
