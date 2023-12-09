/* eslint-disable @typescript-eslint/naming-convention */
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
  QueryViewerAutoResizeType,
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
import {
  QueryViewerAttributesValuesForTable,
  QueryViewerAttributesValuesForPivot,
  QueryViewerPageDataForPivot,
  QueryViewerPageDataForTable,
  QueryViewerServiceResponse,
  QueryViewerServiceResponsePivotTable,
  QueryViewerCalculatePivottableData,
  QueryViewerPivotTableDataSync
} from "../../services/types/service-result";

@Component({
  tag: "gx-query-viewer",
  styleUrl: "query-viewer.scss",
  shadow: false,
  assetsDirs: ["assets"]
})
export class QueryViewer implements GxComponent {
  [memberName: string]: any;

  /**
   * Dictionary for each type of Query Viewer. Maps Query Viewer types to their
   * corresponding render.
   */
  private rendersDictionary: {
    [key in QueryViewerOutputType]: (
      serviceResponse: QueryViewerServiceResponse,
      serviceResponsePivotTable: QueryViewerServiceResponsePivotTable
    ) => any;
  } = {
    [QueryViewerOutputType.Card]: response => this.cardRender(response),

    [QueryViewerOutputType.Chart]: response => this.chartRender(response),
    [QueryViewerOutputType.Map]: response =>
      this.notImplementedRender(response),
    [QueryViewerOutputType.PivotTable]: (_, pivotResponse) =>
      this.pivotRender(pivotResponse),
    [QueryViewerOutputType.Table]: (_, pivotResponse) =>
      this.tableRender(pivotResponse),

    // @todo Update this option to depend on the assigned object
    [QueryViewerOutputType.Default]: response =>
      this.notImplementedRender(response)
  };

  private controller: HTMLGxQueryViewerControllerElement;

  @Element() element: HTMLGxQueryViewerElement;

  @State() parameters: string;
  @State() elements: string;

  /**
   * Response Attribute Values for Table
   */
  @Prop({ mutable: true })
  attributeValuesForPivotTableXml: string;

  /**
   * Response Attribute Values for Pivot Table
   */
  @Prop({ mutable: true })
  attributeValuesForTableXml: string;

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
  @Prop() readonly autoResizeType: QueryViewerAutoResizeType;

  /**
   * Response Pivot Table Data Calculation
   */
  @Prop({ mutable: true })
  calculatePivottableDataXml: string;

  /**
   * Response Pivot Table Data Sync
   */
  @Prop({ mutable: true })
  pivottableDataSyncXml: string;

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
   * Specifies the metadata that the control will use to render the pivotTable.
   */
  @Prop({ mutable: true })
  serviceResponsePivotTable: QueryViewerServiceResponsePivotTable;

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

  /**
   * Response Page Data
   */
  @Prop({ mutable: true }) pageDataForPivotTable: string;

  /**
   * Response Page Data
   */
  @Prop({ mutable: true }) pageDataForTable: string;

  @Listen("queryViewerServiceResponse")
  handleServiceResponse(event: CustomEvent<QueryViewerServiceResponse>) {
    this.serviceResponse = event.detail;
    this.setQueryViewerProperties(event.detail.Properties);
  }

  /** Servicios de la Pivot  **/

  @Listen("queryViewerServiceResponsePivotTable")
  handleServiceResponsePivotTable(
    event: CustomEvent<QueryViewerServiceResponsePivotTable>
  ) {
    this.serviceResponsePivotTable = event.detail;
    this.setQueryViewerProperties(event.detail.Properties);
  }

  @Listen("RequestPageDataForPivotTable", { target: "document" })
  handleRequestPageDataForPivotTable(
    event: CustomEvent<QueryViewerPageDataForPivot>
  ) {
    if (this.controller) {
      event.stopPropagation();
      this.controller.getPageDataForPivotTable(
        (event as any).parameter,
        this.paging,
        this.totalForColumns,
        this.totalForRows
      );
    }
  }

  @Listen("RequestAttributeValuesForPivotTable")
  handleAttributeValuesForPivotTable(
    event: CustomEvent<QueryViewerAttributesValuesForPivot>
  ) {
    if (this.controller) {
      this.controller.getAttributeValues(event.detail);
    }
  }

  @Listen("RequestCalculatePivottableData")
  handleRequestCalculatePivottableData(
    event: CustomEvent<QueryViewerCalculatePivottableData>
  ) {
    if (this.controller) {
      this.controller.getCalculatePivottableData(event.detail);
    }
  }

  @Listen("RequestDataSynForPivotTable")
  handleRequestRequestDataSynForPivotTable(
    event: CustomEvent<QueryViewerPivotTableDataSync>
  ) {
    if (this.controller) {
      this.controller.getPivottableDataSync(event.detail);
    }
  }

  @Listen("pageDataForPivotTable")
  handlePageDataForPivotTable(event: CustomEvent<string>) {
    this.pageDataForPivotTable = event.detail;
  }

  @Listen("attributesValuesForPivotTable")
  handleAttributesValuesPivot(event: CustomEvent<string>) {
    this.attributeValuesForPivotTableXml = event.detail;
  }

  @Listen("calculatePivottableData")
  handleCalculatePivottableData(event: CustomEvent<string>) {
    this.calculatePivottableDataXml = event.detail;
  }

  @Listen("getPivottableDataSync")
  handleGetPivottableDataSync(event: CustomEvent<string>) {
    this.pivottableDataSyncXml = event.detail;
  }

  /**  Servicios de la Table  **/

  @Listen("RequestPageDataForTable", { target: "document" })
  handleRequestPageDataForTable(
    event: CustomEvent<QueryViewerPageDataForTable>
  ) {
    if (this.controller) {
      event.stopPropagation();
      // console.log("hola ", (event as any).parameter);
      this.controller.getPageDataForTable(
        (event as any).parameter,
        this.paging,
        this.totalForColumns,
        this.totalForRows
      );
    }
  }

  @Listen("pageDataForTable")
  handlePageDataForTable(event: CustomEvent<string>) {
    this.pageDataForTable = event.detail;
  }

  @Listen("RequestAttributeForTable")
  handleAttributeForTable(
    event: CustomEvent<QueryViewerAttributesValuesForTable>
  ) {
    if (this.controller) {
      this.controller.getAttributeValues(event.detail);
    }
  }

  @Listen("attributesValuesForTable")
  handleAttributesValuesTable(event: CustomEvent<string>) {
    this.attributeValuesForTableXml = event.detail;
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

  private pivotRender(
    serviceResponsePivotTable: QueryViewerServiceResponsePivotTable
  ) {
    return (
      <gx-query-viewer-pivot-render
        allowElementsOrderChange={this.allowElementsOrderChange}
        allowSelection={this.allowSelection}
        cssClass={this.cssClass}
        pivotTitle={this.queryTitle}
        paging={this.paging}
        pageSize={this.pageSize}
        showDataLabelsIn={this.showDataLabelsIn}
        serviceResponse={serviceResponsePivotTable}
        totalForRows={this.totalForRows}
        totalForColumns={this.totalForColumns}
        translations={DUMMY_TRANSLATIONS}
        disableColumnSort={this.disableColumnSort}
        rememberLayout={this.rememberLayout}
        pageDataForPivotTable={this.pageDataForPivotTable}
        attributeValuesForPivotTableXml={this.attributeValuesForPivotTableXml}
        calculatePivottableDataXml={this.calculatePivottableDataXml}
        getPivottableDataSyncXml={this.pivottableDataSyncXml}
      ></gx-query-viewer-pivot-render>
    );
  }

  private tableRender(
    serviceResponsePivotTable: QueryViewerServiceResponsePivotTable
  ) {
    return (
      <gx-query-viewer-table-render
        allowElementsOrderChange={this.allowElementsOrderChange}
        allowSelection={this.allowSelection}
        cssClass={this.cssClass}
        tableTitle={this.queryTitle}
        paging={this.paging}
        pageSize={this.pageSize}
        showDataLabelsIn={this.showDataLabelsIn}
        serviceResponse={serviceResponsePivotTable}
        totalForRows={this.totalForRows}
        totalForColumns={this.totalForColumns}
        translations={DUMMY_TRANSLATIONS}
        disableColumnSort={this.disableColumnSort}
        rememberLayout={this.rememberLayout}
        pageDataForTable={this.pageDataForTable}
        attributeValuesForTableXml={this.attributeValuesForTableXml}
      ></gx-query-viewer-table-render>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private notImplementedRender(_serviceResponse: QueryViewerServiceResponse) {
    return "";
  }

  componentWillLoad() {
    this.controller = this.element.querySelector("gx-query-viewer-controller");
    // this.serviceResponse = {
    //   Data: [] as any,
    //   MetaData: [] as any,
    //   Properties: undefined
    // };
    // this.serviceResponsePivotTable = {
    //   MetaData: undefined,
    //   Properties: undefined,
    //   metadataXML: undefined,
    //   objectName: "",
    //   useGxQuery: undefined
    // };
  }

  render() {
    console.log(this.type);
    return (
      <Host>
        {this.rendersDictionary[this.type](
          this.serviceResponse,
          this.serviceResponsePivotTable
        )}
      </Host>
    );
  }
}
