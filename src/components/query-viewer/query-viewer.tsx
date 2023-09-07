import {
  Component,
  Element,
  Host,
  Listen,
  Prop,
  State,
  h
} from "@stencil/core";

import { Component as GxComponent } from "../../common/interfaces";
import {
  DUMMY_TRANSLATIONS,
  QueryViewerChartType,
  QueryViewerOrientation,
  QueryViewerOutputType,
  QueryViewerPlotSeries,
  QueryViewerShowDataAs,
  QueryViewerTranslations,
  QueryViewerTrendPeriod,
  QueryViewerXAxisLabels
} from "../../common/basic-types";
import { QueryViewerServiceResponse } from "../../services/types/service-result";
import { queryOutputProperty } from "../../services/gxquery-connector";

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

    [QueryViewerOutputType.Chart]: response => this.chartRender(response),
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
  @Prop() readonly orientation: QueryViewerOrientation =
    QueryViewerOrientation.Horizontal;

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
  @Prop() readonly plotSeries: QueryViewerPlotSeries;

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
  @Prop() readonly xAxisLabels: QueryViewerXAxisLabels =
    QueryViewerXAxisLabels.Horizontally;

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
        includeMaxMin={this.includeMaxMin || this.getProperty(serviceResponse, "IncludeMaxAndMin") as boolean}
        includeSparkline={this.includeSparkline || this.getProperty(serviceResponse, "IncludeSparkline") as boolean}
        includeTrend={this.includeTrend || serviceResponse?.Properties["IncludeTrend"] as boolean}
        orientation={this.orientation || QueryViewerOrientation[this.getProperty(serviceResponse, "Orientation") as keyof typeof QueryViewerOrientation]}
        serviceResponse={serviceResponse}
        showDataAs={this.showDataAs || QueryViewerShowDataAs[this.getProperty(serviceResponse, "ShowDataAs") as keyof typeof QueryViewerShowDataAs]}
        translations={DUMMY_TRANSLATIONS}
        trendPeriod={this.trendPeriod}
      ></gx-query-viewer-card-controller>
    );
  }

  private chartRender(serviceResponse: QueryViewerServiceResponse) {
    return (
      <gx-query-viewer-chart-controller
        allowSelection={this.allowSelection}
        cssClass={this.cssClass}
        chartType={this.chartType || QueryViewerChartType[this.getProperty(serviceResponse, "ChartType") as keyof typeof QueryViewerChartType]}
        plotSeries={this.plotSeries || QueryViewerPlotSeries[this.getProperty(serviceResponse, "PlotSeries") as keyof typeof QueryViewerPlotSeries]}
        queryTitle={this.queryTitle || serviceResponse?.Properties["Title"] as string}
        serviceResponse={serviceResponse}
        showValues={this.showValues || this.getProperty(serviceResponse, "ShowValues") as boolean}
        translations={DUMMY_TRANSLATIONS}
        xAxisIntersectionAtZero={this.xAxisIntersectionAtZero || this.getProperty(serviceResponse, "XAxisIntersectionAtZero") as boolean}
        xAxisLabels={this.xAxisLabels || QueryViewerXAxisLabels[this.getProperty(serviceResponse, "XAxisLabels") as keyof typeof QueryViewerXAxisLabels]}
        yAxisTitle={this.yAxisTitle || this.getProperty(serviceResponse, "YAxisTitle") as string}
      ></gx-query-viewer-chart-controller>
    );
  }

  private getProperty(_serviceResponse: QueryViewerServiceResponse, property: queryOutputProperty): string | number | boolean {
    if (!_serviceResponse || !_serviceResponse.Properties)
      return undefined;
    else
      return _serviceResponse.Properties[property];
  }

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
