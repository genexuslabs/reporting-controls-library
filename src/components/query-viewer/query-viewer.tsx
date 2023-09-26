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
  QueryViewerBase,
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
  QueryViewerTranslations,
  QueryViewerTrendPeriod,
  QueryViewerXAxisLabels
} from "../../common/basic-types";
import { QueryViewerServiceResponse } from "../../services/types/service-result";

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
  @Prop({ mutable: true }) chartType: QueryViewerChartType;

  /**
   * A CSS class to set as the `gx-query-viewer` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Version of data
   */
  @Prop() readonly dataVersionId: number;

  /**
   * Allowing or not Column sort
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
  @Prop({ mutable: true }) includeMaxMin: boolean;

  /**
   * Specifies whether to include a sparkline chart for the values or not.
   */
  @Prop({ mutable: true }) includeSparkline: boolean;

  /**
   * Specifies whether to include a trend mark for the values or not.
   */
  @Prop({ mutable: true }) includeTrend: boolean;

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
  @Prop({ mutable: true }) orientation: QueryViewerOrientation;

  /**
   * If paging true, number of items for a single page
   */
  @Prop({ mutable: true }) pageSize: number;

  /**
   * If type == PivotTable or Table, if true there is paging, else everything in one table
   */
  @Prop({ mutable: true }) paging: boolean;

  /**
   * Timeline
   */
  @Prop({ mutable: true }) plotSeries: QueryViewerPlotSeries;

  /**
   * Specifies the metadata and data that the control will use to render.
   */
  @Prop({ mutable: true }) serviceResponse: QueryViewerServiceResponse;

  /**
   * Title of the QueryViewer
   */
  @Prop({ mutable: true }) queryTitle: string;

  /**
   * For timeline for remembering layout
   */
  @Prop() readonly rememberLayout: boolean;

  /**
   * Specifies whether to show the actual values, the values as a percentage of
   * the target values, or both.
   */
  @Prop({ mutable: true }) showDataAs: QueryViewerShowDataAs;

  /**
   * Ax to show data labels
   */
  @Prop({ mutable: true }) showDataLabelsIn: QueryViewerShowDataLabelsIn;

  /**
   * True if grand total is shown for all table rows
   */
  @Prop({ mutable: true }) totalForRows: QueryViewerTotal;

  /**
   * True if grand total is shown for all table columns
   */
  @Prop({ mutable: true }) totalForColumns: QueryViewerTotal;

  /**
   * if true show values on the graph
   */
  @Prop({ mutable: true }) showValues: boolean;

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
  @Prop() readonly trendPeriod: QueryViewerTrendPeriod;

  /**
   * Type of the QueryViewer: Table, PivotTable, Chart, Card
   */
  @Prop({ mutable: true }) type: QueryViewerOutputType;

  /**
   * if true the x Axes intersect at zero
   */
  @Prop({ mutable: true }) xAxisIntersectionAtZero: boolean;

  /**
   * Labels for XAxis
   */
  @Prop({ mutable: true }) xAxisLabels: QueryViewerXAxisLabels;

  /**
   * X Axis title
   */
  @Prop({ mutable: true }) xAxisTitle: string;

  /**
   * Y Axis title
   */
  @Prop({ mutable: true }) yAxisTitle: string;

  /**
   * If type == Map, this is the map type: Choropleth or Bubble
   */
  @Prop({ mutable: true }) mapType: QueryViewerMapType;

  /**
   * If type == Map, this is the region to display in the map
   */
  @Prop({ mutable: true }) region: QueryViewerRegion;

  /**
   * If type == Map and region = Continent, this is the continent to display in the map
   */
  @Prop({ mutable: true }) continent: QueryViewerContinent;

  /**
   * If type == Map and region = Country, this is the country to display in the map
   */
  @Prop({ mutable: true }) country: QueryViewerCountry;

  @Listen("queryViewerServiceResponse")
  handleServiceResponse(event: CustomEvent<QueryViewerServiceResponse>) {
    this.serviceResponse = event.detail;
    this.setQueryViewerProperties(event.detail.Properties);
  }

  /**
   * Set QueryViewer properties with values from the query obtained from the server (unless explicitly set in the web component)
   */
  private setQueryViewerProperties(properties: QueryViewerBase) {
    if (!properties) {
      return;
    }

    this.type ??= properties.OutputType;
    this.queryTitle ??= properties.Title;
    this.showValues ??= properties.ShowValues;
    if (this.type === QueryViewerOutputType.Card) {
      this.showDataAs ??= properties.ShowDataAs;
      this.orientation ??= properties.Orientation;
      this.includeTrend ??= properties.IncludeTrend;
      this.includeSparkline ??= properties.IncludeSparkline;
      this.includeMaxMin ??= properties.IncludeMaxAndMin;
    } else if (this.type === QueryViewerOutputType.Chart) {
      this.chartType ??= properties.ChartType;
      this.plotSeries ??= properties.PlotSeries;
      this.xAxisLabels ??= properties.XAxisLabels;
      this.xAxisIntersectionAtZero ??= properties.XAxisIntersectionAtZero;
      this.xAxisTitle ??= properties.XAxisTitle;
      this.yAxisTitle ??= properties.YAxisTitle;
    } else if (this.type === QueryViewerOutputType.Map) {
      this.mapType ??= properties.MapType;
      this.region ??= properties.Region;
      this.continent ??= properties.Continent;
      this.country ??= properties.Country;
    } else {
      this.paging ??= properties.Paging;
      this.pageSize ??= properties.PageSize;
      this.showDataLabelsIn ??= properties.ShowDataLabelsIn;
      this.totalForRows ??= properties.TotalForRows;
      this.totalForColumns ??= properties.TotalForColumns;
    }
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

  private chartRender(serviceResponse: QueryViewerServiceResponse) {
    return (
      <gx-query-viewer-chart-controller
        allowSelection={this.allowSelection}
        cssClass={this.cssClass}
        chartType={this.chartType}
        plotSeries={this.plotSeries}
        queryTitle={this.queryTitle}
        serviceResponse={serviceResponse}
        showValues={this.showValues}
        translations={DUMMY_TRANSLATIONS}
        xAxisIntersectionAtZero={this.xAxisIntersectionAtZero}
        xAxisLabels={this.xAxisLabels}
        yAxisTitle={this.yAxisTitle}
      ></gx-query-viewer-chart-controller>
    );
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
