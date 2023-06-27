import {
  Component,
  Element,
  Host,
  Listen,
  Prop,
  State,
  h
} from "@stencil/core";

// import { SeriesOptionsType } from "highcharts";
import { Component as GxComponent } from "../../common/interfaces";
import {
  DUMMY_TRANSLATIONS,
  QueryViewerChartType,
  QueryViewerOutputType,
  QueryViewerShowDataAs,
  QueryViewerTranslations,
  QueryViewerTrendPeriod
} from "../../common/basic-types";
import { QueryViewerServiceResponse } from "../../services/types/service-result";

// const TITLE_OPTION = {
//   text: ""
// };

// const CHART_OPTION = {
//   margin: [0, 0, 0, 0],
//   renderTo: "container",
//   type: "pie",
//   plotShadow: false
// };

// const TOOLTIP_OPTION = {
//   pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
// };

// const LEGEND_OPTION = {
//   enabled: false
// };

// const PLOT_OPTION = {
//   pie: {
//     allowPointSelect: true,
//     cursor: "pointer",
//     dataLabels: {
//       enabled: true,
//       format: "<b>{point.name}</b>: {point.percentage:.1f} %"
//     }
//   }
// };

// const YAXIS_OPTION = {};

// const XAXIS_OPTION = {};

// const SERIES_OPTION = [
//   {
//     name: "Brands",
//     colorByPoint: true,
//     data: [
//       {
//         name: "Chrome",
//         y: 70.67,
//         sliced: true,
//         selected: true
//       },
//       {
//         name: "Edge",
//         y: 14.77
//       },
//       {
//         name: "Firefox",
//         y: 4.86
//       },
//       {
//         name: "Safari",
//         y: 2.63
//       },
//       {
//         name: "Internet Explorer",
//         y: 1.53
//       },
//       {
//         name: "Opera",
//         y: 1.4
//       },
//       {
//         name: "Sogou Explorer",
//         y: 0.84
//       },
//       {
//         name: "QQ",
//         y: 0.51
//       },
//       {
//         name: "Other",
//         y: 2.6
//       }
//     ]
//   }
// ];

@Component({
  tag: "gx-query-viewer",
  styleUrl: "query-viewer.scss",
  shadow: false,
  assetsDirs: ["assets"]
})
export class QueryViewer implements GxComponent {
  /**
   * Dictionary for each type of Query Viewer. Maps Query Viewer types to their
   * corresponding render.
   */
  private rendersDictionary: {
    [key in QueryViewerOutputType]: (
      serviceResponse: QueryViewerServiceResponse
    ) => any;
  } = {
    [QueryViewerOutputType.Card]: response => this.cardRender(response),

    [QueryViewerOutputType.Chart]: response =>
      this.notImplementedRender(response),
    [QueryViewerOutputType.Map]: response =>
      this.notImplementedRender(response),
    [QueryViewerOutputType.PivotTable]: response =>
      this.notImplementedRender(response),
    [QueryViewerOutputType.Table]: response =>
      this.notImplementedRender(response),

    // @todo Update this option to depend on the assigned object
    [QueryViewerOutputType.Default]: response =>
      this.notImplementedRender(response)
  };

  @Element() element: HTMLGxQueryViewerElement;

  @State() parameters: string;
  @State() elements: string;

  /**
   * Allowing elements order to change
   */
  @Prop() readonly allowElementsOrderChange: boolean;

  /**
   * Allow selection
   */
  @Prop() readonly allowSelection: boolean;

  /**
   * Auto refresh group
   */
  @Prop() readonly autoRefreshGroup: string;

  /**
   * If type== PivotTable or Table, if true will shrink the table
   */
  @Prop() readonly autoResize: boolean;

  /**
   * If autoResize, in here select the type, Width, height, or both
   */
  @Prop() readonly autoResizeType: "Both" | "Vertical" | "Horizontal";

  /**
   * If type == Chart, this is the chart type: Bar, Pie, Timeline, etc...
   */
  @Prop() readonly chartType: QueryViewerChartType;

  /**
   * A CSS class to set as the `gx-query-viewer` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Version of data
   */
  @Prop() readonly dataVersionId: number;

  /**
   * Allowing or not Comlumn sort
   */
  @Prop() readonly disableColumnSort: boolean;

  /**
   * If type== PivotTable or Table allow to export to HTML
   */
  @Prop() readonly exportToHTML: boolean;

  /**
   * If type== PivotTable or Table allow to export to XLS
   */
  @Prop() readonly exportToXLS: boolean;

  /**
   * If type== PivotTable or Table allow to export to XLSX
   */
  @Prop() readonly exportToXLSX: boolean;

  /**
   * If type== PivotTable or Table allow to export to PDF
   */
  @Prop() readonly exportToPDF: boolean;

  /**
   * If type== PivotTable or Table allow to export to XML
   */
  @Prop() readonly exportToXML: boolean;

  /**
   * Specifies whether to include the maximum and minimum values in the series.
   */
  @Prop() readonly includeMaxMin: boolean;

  /**
   * Specifies whether to include a sparkline chart for the values or not.
   */
  @Prop() readonly includeSparkline: boolean;

  /**
   * Specifies whether to include a trend mark for the values or not.
   */
  @Prop() readonly includeTrend: boolean;

  /**
   * True if it is external query
   */
  @Prop() readonly isExternalQuery: boolean;

  /**
   * Language of the QueryViewer
   */
  @Prop() readonly language: string;

  /**
   * Object of QueryViewer
   */
  @Prop() readonly object: string;

  /**
   * Object type -> Query or DataProvider
   */
  @Prop() readonly objectType: string;

  /**
   * Orientation of the graph
   */
  @Prop() readonly orientation: "Horizontal" | "Vertical";

  /**
   * If paging true, number of items for a single page
   */
  @Prop() readonly pageSize: number;

  /**
   * If type == PivotTable or Table, if true there is paging, else everything in one table
   */
  @Prop() readonly paging: boolean;

  /**
   * Timeline
   */
  @Prop() readonly plotSeries: "InTheSameChart" | "InSeparateCharts";

  /**
   * Specifies the metadata and data that the control will use to render.
   */
  @Prop({ mutable: true }) serviceResponse: QueryViewerServiceResponse;

  /**
   * Title of the QueryViewer
   */
  @Prop() readonly queryTitle: string;

  /**
   * For timeline for remembering layout
   */
  @Prop() readonly rememberLayout: boolean;

  /**
   * Specifies whether to show the actual values, the values as a percentage of
   * the target values, or both.
   */
  @Prop() readonly showDataAs: QueryViewerShowDataAs =
    QueryViewerShowDataAs.Values;

  /**
   * Ax to show data labels
   */
  @Prop() readonly showDataLabelsIn: string;

  /**
   * if true show values on the graph
   */
  @Prop() readonly showValues: boolean;

  /**
   * Theme for showing the graph
   */
  @Prop() readonly theme: string;

  /**
   * For translate the labels of the outputs
   */
  @Prop() readonly translations: QueryViewerTranslations;

  /**
   * If `includeTrend == true`, this attribute specifies the period of time to
   * calculate the trend.
   */
  @Prop() readonly trendPeriod: QueryViewerTrendPeriod =
    QueryViewerTrendPeriod.SinceTheBeginning;

  /**
   * Type of the QueryViewer: Table, PivotTable, Chart, Card
   */
  @Prop() readonly type: QueryViewerOutputType;

  /**
   * if true the x Axes intersect at zero
   */
  @Prop() readonly xAxisIntersectionAtZero: boolean;

  /**
   * Labels for XAxis
   */
  @Prop() readonly xAxisLabels:
    | "Horizontally"
    | "Rotated30"
    | "Rotated45"
    | "Rotated60"
    | "Vertically";

  /**
   * X Axis title
   */
  @Prop() readonly xAxisTitle: string;

  /**
   * Y Axis title
   */
  @Prop() readonly yAxisTitle: string;

  @Listen("queryViewerServiceResponse")
  handleServiceResponse(event: CustomEvent<QueryViewerServiceResponse>) {
    this.serviceResponse = event.detail;
  }

  private cardRender(serviceResponse: QueryViewerServiceResponse) {
    return (
      <gx-query-viewer-card-controller
        cssClass={this.cssClass}
        includeMaxMin={this.includeMaxMin}
        includeSparkline={this.includeSparkline}
        includeTrend={this.includeTrend}
        orientation={this.orientation}
        serviceResponse={serviceResponse}
        showDataAs={this.showDataAs}
        translations={DUMMY_TRANSLATIONS}
        trendPeriod={this.trendPeriod}
      ></gx-query-viewer-card-controller>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // private chartRender(_serviceResponse: QueryViewerServiceResponse) {
  //   return (
  //     <gx-query-viewer-chart
  //       chartTitle={TITLE_OPTION}
  //       chartOptions={CHART_OPTION}
  //       seriesOptions={SERIES_OPTION as SeriesOptionsType[]}
  //       tooltipOptions={TOOLTIP_OPTION}
  //       legendOptions={LEGEND_OPTION}
  //       plotOptions={PLOT_OPTION}
  //       yaxisOptions={YAXIS_OPTION}
  //       xaxisOptions={XAXIS_OPTION}
  //     ></gx-query-viewer-chart>
  //   );
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private notImplementedRender(_serviceResponse: QueryViewerServiceResponse) {
    return "";
  }

  render() {
    return (
      <Host>{this.rendersDictionary[this.type](this.serviceResponse)}</Host>
    );
  }
}
