import {
  Component,
  EventEmitter,
  Element,
  Event,
  Host,
  Listen,
  Prop,
  State,
  h,
  Method
} from "@stencil/core";

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
} from "@genexus/reporting-api";
import {
  dragAndDropPivotTableEvent,
  itemClickDataForPivotTable,
  itemExpandCollapsePivotTableEvent,
  onFilterChangedPivotTableEvent
  // onFilterChangedPivotTableEvent
} from "./utils";
import {
  PivotTableDragAndDrop,
  PivotTableExpandCollapse,
  PivotTableFilterChanged,
  PivotTableItemClick,
  PivotTablePageChange,
  QueryViewerDragAndDropData,
  QueryViewerFilterChangedData,
  QueryViewerItemClickData,
  QueryViewerItemExpandAndCollapseData,
  // TableFilterChanged,
  // TableItemClick,
  // TablePageChange,
  PivotTableNavigation,
  TableItemClick,
  TablePageChange,
  TableFilterChanged
} from "../../global/types";

import {
  QueryViewerServiceResponse,
  QueryViewerAttributesValuesForTable,
  QueryViewerAttributesValuesForPivot,
  QueryViewerPageDataForPivot,
  QueryViewerPageDataForTable,
  QueryViewerServiceResponsePivotTable,
  QueryViewerCalculatePivottableData,
  QueryViewerPivotTableDataSync,
  QueryViewerTableDataSync
} from "@genexus/reporting-api";

let autoId = 0;

@Component({
  tag: "gx-query-viewer",
  styleUrl: "query-viewer.scss",
  shadow: false,
  assetsDirs: ["assets"]
})
export class QueryViewer {
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
    [QueryViewerOutputType.Pivot_Table]: (_, pivotResponse) =>
      this.pivotRender(pivotResponse),
    [QueryViewerOutputType.Table]: (_, pivotResponse) =>
      this.pivotRender(pivotResponse),

    // @todo Update this option to depend on the assigned object
    [QueryViewerOutputType.Default]: response =>
      this.notImplementedRender(response)
  };
  @Element() element: HTMLGxQueryViewerElement;

  // refs
  private controller: HTMLGxQueryViewerControllerElement;
  private pivotRenderRef: HTMLGxQueryViewerPivotRenderElement;

  private temporalId: string;

  @State() parameters: string;
  @State() elements: string;

  /**
   * Response Attribute Values for Table
   */
  @Prop({ mutable: true }) attributeValuesForPivotTableXml: string;

  /**
   * Response Attribute Values for Pivot Table
   */
  @Prop({ mutable: true }) attributeValuesForTableXml: string;

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
  @Prop({ mutable: true }) calculatePivottableDataXml: string;

  /**
   * If type == Chart, this is the chart type: Bar, Pie, Timeline, etc...
   */
  @Prop({ mutable: true }) chartType: QueryViewerChartType;

  /**
   * Specifies the name of the control used in the pivot and Table outputs
   * types
   */
  @Prop() readonly controlName!: string;

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
   * Response Pivot Table Data Sync
   */
  @Prop({ mutable: true }) pivottableDataSyncXml: string;

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
  // eslint-disable-next-line @stencil-community/decorators-style
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

  /**
   * Event fire when a user click an "actionable" element
   */
  @Event() itemClick: EventEmitter<QueryViewerItemClickData>;

  /**
   * Event fires when a user drops a "draggable" element into its target
   */
  @Event() dragAndDrop: EventEmitter<QueryViewerDragAndDropData>;

  /**
   * Event fired when a user collapses an item in the pivot table
   */
  @Event()
  itemCollapse: EventEmitter<QueryViewerItemExpandAndCollapseData>;

  /**
   * Event fired when a user expands an item in the pivot table
   */
  @Event()
  itemExpand: EventEmitter<QueryViewerItemExpandAndCollapseData>;

  /**
   * EEvent fired when a user changes pages in the pivot table
   */
  // ToDo: improve this type
  @Event() changePage: EventEmitter<any>;

  /**
   * Event fired when a user navigates to the first page in the pivot table
   */
  @Event() firstPage: EventEmitter<any>;

  /**
   * Event fired when a user navigates to the previous page in the pivot table
   */
  @Event() previousPage: EventEmitter<any>;

  /**
   * Event fired when a user navigates to the next page in the pivot table
   */
  @Event() nextPage: EventEmitter<any>;

  /**
   * Event fired when a user navigates to the last page in the pivot table
   */
  @Event() lastPage: EventEmitter<any>;
  /**
   * Event is triggered every time that values are removed from or added to the list of possible values for an attribute
   */
  @Event() filterChanged: EventEmitter<QueryViewerFilterChangedData>;

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

  @Listen("RequestPageDataForPivotTable")
  handleRequestPageDataForPivotTable(
    event: CustomEvent<QueryViewerPageDataForPivot>
  ) {
    this.setControllerRef();
    if (this.controller) {
      event.stopPropagation();
      const pageData: QueryViewerPageDataForPivot = (event as any).parameter;

      if (Number.isInteger(pageData.PageSize)) {
        this.pageSize = pageData.PageSize;
      }

      this.controller.getPageDataForPivotTable(pageData);
    }
  }

  @Listen("RequestAttributeValuesForPivotTable")
  handleAttributeValuesForPivotTable(
    event: CustomEvent<QueryViewerAttributesValuesForPivot>
  ) {
    this.setControllerRef();
    if (this.controller) {
      this.controller.getAttributeValues((event as any).parameter);
    }
  }

  @Listen("RequestCalculatePivottableData")
  handleRequestCalculatePivottableData(
    event: CustomEvent<QueryViewerCalculatePivottableData>
  ) {
    this.setControllerRef();
    if (this.controller) {
      this.controller.getCalculatePivottableData(event.detail);
    }
  }

  @Listen("RequestDataSynForPivotTable")
  handleRequestRequestDataSynForPivotTable(
    event: CustomEvent<QueryViewerPivotTableDataSync>
  ) {
    this.setControllerRef();
    if (this.controller) {
      this.controller.getPivottableDataSync(event.detail);
    }
  }

  @Listen("pageDataForPivotTable")
  handlePageDataForPivotTable(event: CustomEvent<string>) {
    this.pageDataForPivotTable = event.detail;
  }

  @Listen("attributeValuesForPivotTable")
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

  /** Table Services **/

  @Listen("RequestPageDataForTable")
  handleRequestPageDataForTable(
    event: CustomEvent<QueryViewerPageDataForTable>
  ) {
    this.setControllerRef();
    if (this.controller) {
      event.stopPropagation();
      const pageData: QueryViewerPageDataForTable = (event as any).parameter;

      if (Number.isInteger(pageData.PageSize)) {
        this.pageSize = pageData.PageSize;
      }

      this.controller.getPageDataForTable(pageData);
    }
  }

  @Listen("pageDataForTable")
  handlePageDataForTable(event: CustomEvent<string>) {
    // This method for updating the table isn't the best, but it work as a WA.
    // When the pageData remains the same as before, it indicates the need to
    // restore the view. To achieve this, the table must be re-rendered. Therefore,
    // we need to dispatch a change event that triggers the necessary re-render

    this.pageDataForTable =
      this.pageDataForTable === event.detail
        ? this.pageDataForTable + " "
        : event.detail;
  }

  @Listen("RequestAttributeForTable")
  handleAttributeForTable(
    event: CustomEvent<QueryViewerAttributesValuesForTable>
  ) {
    this.setControllerRef();
    if (this.controller) {
      this.controller.getAttributeValues((event as any).parameter);
    }
  }

  @Listen("attributesValuesForTable")
  handleAttributesValuesTable(event: CustomEvent<string>) {
    // This method for updating the table isn't the best, but it work as a WA.
    // When the attribute values remain the same as before, but we've applied
    // filters to the columns, it indicates the need to update this value in the
    // pivot component to request new page data with the applied filters.
    // To achieve this, the table needs to be re-rendered. Therefore, we must
    // dispatch a change event that triggers the necessary re-render

    this.attributeValuesForTableXml =
      this.attributeValuesForTableXml === event.detail
        ? this.attributeValuesForTableXml + " "
        : event.detail;
  }

  @Listen("requestDataSynForTable")
  handleRequestRequestDataSynForTable(
    event: CustomEvent<QueryViewerTableDataSync>
  ) {
    this.setControllerRef();
    if (this.controller) {
      this.controller.getPivottableDataSync(event.detail);
    }
  }

  /** User Events for Pivot Table*/

  @Listen("PivotTableOnItemClickEvent")
  handlePivotTableOnItemClickEvent(event: CustomEvent<PivotTableItemClick>) {
    const eventData = itemClickDataForPivotTable(
      (event as any).parameter.QueryviewerId,
      (event as any).parameter.Data
    );
    this.itemClick.emit(eventData);
  }

  @Listen("PivotTableOnDragundDropEvent")
  handlePivotTableOnDragundDropEvent(
    event: CustomEvent<PivotTableDragAndDrop>
  ) {
    const eventData = dragAndDropPivotTableEvent(
      (event as any).parameter.QueryviewerId,
      (event as any).parameter.Data
    );
    this.dragAndDrop.emit(eventData);
  }

  @Listen("PivotTableOnItemExpandCollapseEvent")
  handlePivotTableOnItemExpandCollapseEvent(
    event: CustomEvent<PivotTableExpandCollapse>
  ) {
    const eventData = itemExpandCollapsePivotTableEvent(
      (event as any).parameter.Queryviewer,
      (event as any).parameter.Data,
      (event as any).parameter.IsCollapse
    );

    if ((event as any).parameter.IsCollapse) {
      this.itemCollapse.emit(eventData);
    } else {
      this.itemExpand.emit(eventData);
    }
  }

  @Listen("PivotTableOnPageChangeEvent")
  handlePivotTableOnPageChangeEvent(event: CustomEvent<PivotTablePageChange>) {
    let eventData;

    switch ((event as any).parameter.Navigation) {
      case PivotTableNavigation.OnFirstPage:
        eventData = this.pivotRenderRef.firstPage();
        this.firstPage.emit(eventData);
        break;
      case PivotTableNavigation.OnLastPage:
        eventData = this.pivotRenderRef.lastPage();
        this.lastPage.emit(eventData);
        break;
      case PivotTableNavigation.OnNextPage:
        eventData = this.pivotRenderRef.nextPage();
        this.nextPage.emit(eventData);
        break;
      case PivotTableNavigation.OnPreviousPage:
        eventData = this.pivotRenderRef.previousPage();
        this.previousPage.emit(eventData);
        break;
    }
  }

  @Listen("PivotTableOnFilterChangedEvent")
  handlePivotTableOnFilterChangedEvent(
    event: CustomEvent<PivotTableFilterChanged>
  ) {
    const eventData = onFilterChangedPivotTableEvent(
      (event as any).parameter.QueryviewerId,
      (event as any).parameter.FilterChangedData
    );
    this.filterChanged.emit(eventData);
  }

  /** User Events for Table*/

  @Listen("TableOnItemClickEvent")
  handleTableOnItemClickEvent(event: CustomEvent<TableItemClick>) {
    const eventData = itemClickDataForPivotTable(
      (event as any).parameter.QueryviewerId,
      (event as any).parameter.Data
    );
    this.itemClick.emit(eventData);
  }

  @Listen("TableOnPageChangeEvent")
  async handleTableOnDragundDropEvent(event: CustomEvent<TablePageChange>) {
    let eventData;

    switch ((event as any).parameter.Navigation) {
      case PivotTableNavigation.OnFirstPage:
        eventData = await this.pivotRenderRef.firstPage();
        this.firstPage.emit(eventData);
        break;
      case PivotTableNavigation.OnLastPage:
        eventData = await this.pivotRenderRef.lastPage();
        this.lastPage.emit(eventData);
        break;
      case PivotTableNavigation.OnNextPage:
        eventData = await this.pivotRenderRef.nextPage();
        this.nextPage.emit(eventData);
        break;
      case PivotTableNavigation.OnPreviousPage:
        eventData = await this.pivotRenderRef.previousPage();
        this.previousPage.emit(eventData);
        break;
    }
  }

  @Listen("TableOnFilterChangedEvent")
  handleTableOnFilterChangedEvent(event: CustomEvent<TableFilterChanged>) {
    const eventData = onFilterChangedPivotTableEvent(
      (event as any).parameter.QueryviewerId,
      (event as any).parameter.FilterChangedData
    );
    this.filterChanged.emit(eventData);
  }

  /** GX User Events */

  /**
   * Returns an XML on a string variable containing all the data for the attributes loaded in the Pivot Table.
   */
  @Method()
  async getData() {
    this.setControllerRef();
    if (!this.controller) {
      return;
    }
    switch (this.type) {
      case QueryViewerOutputType.Card:
        // ToDo: implement this method to the output card
        return null;
      case QueryViewerOutputType.Chart:
        // ToDo: implement this method to the output chart
        return null;
      case QueryViewerOutputType.Map:
        // ToDo: implement this method to the output map
        return null;
      default: // PivotTable and Table
        const serverData = await this.pivotRenderRef.pivotTableDataSyncXml;
        return this.pivotRenderRef.getDataPivot(serverData);
    }
  }

  /**
   * Returns an XML on a string variable containing all the data for the attributes loaded in the Pivot Table.
   */
  @Method()
  async getFilteredData() {
    if (!this.controller) {
      return;
    }
    switch (this.type) {
      case QueryViewerOutputType.Card:
        // ToDo: implement this method to the output card
        return null;
      case QueryViewerOutputType.Chart:
        // ToDo: implement this method to the output chart
        return null;
      case QueryViewerOutputType.Map:
        // ToDo: implement this method to the output map
        return null;
      default: // PivotTable and Table
        const serverData = this.pivotRenderRef.pivotTableDataSyncXml;
        return this.pivotRenderRef.getFilteredDataPivot(serverData);
    }
  }

  /** AutoRefresh */
  // ToDo: implement this
  // @Listen("RequestUpdateLayoutSameGroup")
  // handlePivotTableAutorefresh(event: CustomEvent<any>) {}

  /**
   * Set QueryViewer properties with values from the query obtained from the server (unless explicitly set in the web component)
   */
  private setQueryViewerProperties(properties: QueryViewerBase) {
    if (!properties) {
      return;
    }
    this.type = properties.outputType;
    this.queryTitle ??= properties.title;
    this.showValues ??= properties.showValues;
    if (this.type === QueryViewerOutputType.Card) {
      this.showDataAs ??= properties.showDataAs;
      this.orientation ??= properties.orientation;
      this.includeTrend ??= properties.includeTrend;
      this.includeSparkline ??= properties.includeSparkline;
      this.includeMaxMin ??= properties.includeMaxAndMin;
    } else if (this.type === QueryViewerOutputType.Chart) {
      this.chartType ??= properties.chartType;
      this.plotSeries ??= properties.plotSeries;
      this.xAxisLabels ??= properties.xAxisLabels;
      this.xAxisIntersectionAtZero ??= properties.xAxisIntersectionAtZero;
      this.xAxisTitle ??= properties.xAxisTitle;
      this.yAxisTitle ??= properties.yAxisTitle;
    } else if (this.type === QueryViewerOutputType.Map) {
      this.mapType ??= properties.mapType;
      this.region ??= properties.region;
      this.continent ??= properties.continent;
      this.country ??= properties.country;
    } else {
      this.paging ??= properties.paging;
      this.pageSize ??= properties.pageSize;
      this.showDataLabelsIn ??= properties.showDataLabelsIn;
      this.totalForRows ??= properties.totalForRows;
      this.totalForColumns ??= properties.totalForColumns;
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
        autoResize={this.autoResize}
        controlName={this.controlName}
        cssClass={this.cssClass}
        pivotTitle={this.queryTitle}
        paging={this.paging}
        pageSize={this.pageSize}
        showDataLabelsIn={this.showDataLabelsIn}
        serviceResponse={serviceResponsePivotTable}
        totalForRows={this.totalForRows}
        totalForColumns={this.totalForColumns}
        translations={DUMMY_TRANSLATIONS}
        tableType={
          this.type.startsWith("Pivot")
            ? QueryViewerOutputType.PivotTable
            : QueryViewerOutputType.Table
        }
        disableColumnSort={this.disableColumnSort}
        rememberLayout={this.rememberLayout}
        pageDataForPivotTable={this.pageDataForPivotTable}
        attributeValuesForPivotTableXml={this.attributeValuesForPivotTableXml}
        calculatePivottableDataXml={this.calculatePivottableDataXml}
        pivotTableDataSyncXml={this.pivottableDataSyncXml}
        pageDataForTable={this.pageDataForTable}
        attributeValuesForTableXml={this.attributeValuesForTableXml}
        ref={el => (this.pivotRenderRef = el)}
      ></gx-query-viewer-pivot-render>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private notImplementedRender(_serviceResponse: QueryViewerServiceResponse) {
    return "";
  }

  private setControllerRef() {
    // this.controller = document.querySelector(
    //   `[id=${this.temporalId}] > gx-query-viewer-controller`
    // );
    this.controller = this.element.querySelector(`gx-query-viewer-controller`);
  }

  componentWillLoad() {
    this.temporalId = `gx-query-viewer-${autoId++}`;
  }

  componentDidLoad() {
    this.setControllerRef();
  }

  render() {
    return (
      <Host id={this.temporalId}>
        {this.rendersDictionary[this.type](
          this.serviceResponse,
          this.serviceResponsePivotTable
        )}
      </Host>
    );
  }
}
