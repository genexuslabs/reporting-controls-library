/* eslint-disable @typescript-eslint/no-var-requires */
import { Component, h, Method, Prop, Watch, Listen } from "@stencil/core";
import {
  renderJSPivot,
  OAT,
  setAttributeValuesForPivotTable,
  setPivottableDataCalculation,
  setPageDataForPivotTable,
  setDataSynForPivotTable,
  getDataXML,
  getFilteredDataXML,
  moveToNextPage,
  moveToFirstPage,
  moveToPreviousPage,
  moveToLastPage,
  setAttributeForTable,
  setPageDataForTable,
  setDataSynForTable
} from "jspivottable";
import {
  QueryViewerOutputType,
  QueryViewerPivotCollection,
  QueryViewerPivotParameters,
  QueryViewerPivotTable,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal,
  QueryViewerPageDataForTable,
  QueryViewerPageDataForPivot
} from "@genexus/reporting-api";

const PIVOT_PAGE = (ucId: string) => `${ucId}_GeneralQuery1_pivot_page`;
const PIVOT_CONTENT = (ucId: string) => `${ucId}_GeneralQuery1_pivot_content`;
@Component({
  tag: "gx-query-viewer-pivot",
  styleUrl: "query-viewer-pivot.scss",
  shadow: false
})
export class QueryViewerPivot {
  private queryViewerContainer: HTMLDivElement;
  private queryViewerConfiguration: QueryViewerPivotTable = undefined;
  private shouldReRenderPivot = false;
  private pageSizeChangeWasCommittedByTheUser = false;

  /**
   * Response Attribute Values
   */
  @Prop() readonly attributeValuesForPivotTableXml: string;
  @Watch("attributeValuesForPivotTableXml")
  handleAttributesValuesForPivotTableChange(newValue: string) {
    setAttributeValuesForPivotTable(
      this.queryViewerConfiguration.oat_element,
      newValue
    );
  }

  /**
   * Response Page Data
   */
  @Prop() readonly pageDataForPivotTable: string;
  @Watch("pageDataForPivotTable")
  handlePageDataForPivotTableChange(newPageData: string) {
    setPageDataForPivotTable(
      this.queryViewerConfiguration.oat_element,
      newPageData
    );
  }

  /**
   * Response calculation PivotTable Data
   */
  @Prop() readonly calculatePivottableDataXml: string;
  @Watch("calculatePivottableDataXml")
  handleCalculatePivottableDataChange(newValue: string) {
    setPivottableDataCalculation(
      this.queryViewerConfiguration.oat_element,
      newValue
    );
  }

  /**
   * Response PivotTable Data Sync
   */
  @Prop() readonly pivotTableDataSyncXml: string;
  @Watch("pivotTableDataSyncXml")
  handlePivottableDataSyncChange(newValue: string) {
    setDataSynForPivotTable(
      this.queryViewerConfiguration.oat_element,
      newValue
    );
  }

  /**
   * Response Page Data
   */
  @Prop() readonly pageDataForTable: string;
  @Watch("pageDataForTable")
  handlePageDataForTableChange(newValue: string, oldValue: string) {
    if (!oldValue) {
      return;
    }
    // This is a WA since the Table does not refresh its pageSize if we don't update
    // the pageData previously
    setPageDataForTable(this.queryViewerConfiguration.oat_element, newValue);
    this.renderPivot();
  }

  /**
   * Response Attribute Values
   */
  @Prop() readonly attributeValuesForTableXml: string;
  @Watch("attributeValuesForTableXml")
  handleAttributesValuesForTableChange(newValue: string) {
    setAttributeForTable(this.queryViewerConfiguration.oat_element, newValue);
  }

  /**
   * Response Table Data Sync
   */
  @Prop() readonly tableDataSyncXml: string;
  @Watch("tableDataSyncXml")
  handleTableDataSyncChange(newValue: string) {
    setDataSynForTable(this.queryViewerConfiguration.oat_element, newValue);
  }

  /**
   * if true will shrink the table
   */
  @Prop() readonly autoResize: boolean;
  @Watch("autoResize")
  autoResizeChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * pivotParameters
   */
  @Prop() readonly pivotParameters: QueryViewerPivotParameters;

  /**
   * pivotCollection
   */
  @Prop() readonly pivotCollection: QueryViewerPivotCollection;

  /**
   * Specifies whether the render output is PivotTable or Table
   */
  @Prop() readonly tableType:
    | QueryViewerOutputType.PivotTable
    | QueryViewerOutputType.Table;
  @Watch("tableType")
  tableTypeChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * Determines whether to show a total of all values in the pivot table columns.
   */
  @Prop() readonly totalForColumns: QueryViewerTotal;
  @Watch("totalForColumns")
  totalForColumnsChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * Determines whether to show a total of all values in the pivot table rows.
   */
  @Prop() readonly totalForRows: QueryViewerTotal;
  @Watch("totalForRows")
  totalForRowsChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * This attribute lets you define a title for the pivot table.
   */
  @Prop() readonly pivotTitle: string;
  @Watch("pivotTitle")
  queryTitleChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * It allows to indicate how you want to display the Data elements of the Query object.
   */
  @Prop() readonly showDataLabelsIn: QueryViewerShowDataLabelsIn;
  @Watch("showDataLabelsIn")
  showDataLabelsInChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * This attribute lets you determinate whether there will be paging buttons.
   */
  @Prop() readonly paging: boolean;
  @Watch("paging")
  pagingInChange() {
    if (
      this.pageSizeChangeWasCommittedByTheUser &&
      this.tableType !== QueryViewerOutputType.Table
    ) {
      this.pageSizeChangeWasCommittedByTheUser = false;
      return;
    }
    this.shouldReRenderPivot = true;
  }

  /**
   * Enables you to define the number of rows that will be shown when the Paging property is activated
   */
  @Prop() readonly pageSize: number;
  @Watch("pageSize")
  pageSizeInChange() {
    if (
      this.pageSizeChangeWasCommittedByTheUser &&
      this.tableType !== QueryViewerOutputType.Table
    ) {
      this.pageSizeChangeWasCommittedByTheUser = false;
      return;
    }
    this.shouldReRenderPivot = true;
  }

  /**
   * For timeline for remembering layout
   */
  @Prop() readonly rememberLayout: boolean;
  @Watch("rememberLayout")
  rememberLayoutChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * Name of the Query or Data provider assigned
   */
  @Prop() readonly objectName: string;
  @Watch("objectName")
  objectNameChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * metadata
   */
  @Prop() readonly metadata: string;
  @Watch("metadata")
  metadataChange() {
    this.shouldReRenderPivot = true;
  }

  /**
   * QueryViewerTranslations
   */
  @Prop() readonly QueryViewerTranslations = {
    GXPL_QViewerSinceTheBeginningTrend: "Trend Since The Beginning",
    GXPL_QViewerLastDayTrend: "Trend Last Day",
    GXPL_QViewerLastHourTrend: "Trend Last hour",
    GXPL_QViewerJSAllOption: "All option",
    GXPL_QViewerJSAscending: "Ascending",
    GXPL_QViewerJSDescending: "Descending",
    GXPL_QViewerJSSubtotals: "Subtotal",
    GXPL_QViewerJSRestoreDefaultView: "Restore default view",
    GXPL_QViewerJSPivotDimensionToColumn: "Move to columns",
    GXPL_QViewerJSPivotDimensionToRow: "Move to rows",
    GXPL_QViewerJSMoveToFilterBar: "To Filters",
    GXPL_QViewerJSAll: "ALL",
    GXPL_QViewerJSNone: "NONE",
    GXPL_QViewerJSReverse: "REVERT",
    GXPL_QViewerSearch: "Search",
    GXPL_QViewerInfoUser:
      "Use this area to define filters that apply to the entire table. First drag and drop here any element contained in the rows or columns axes and then select a value for that element to apply that filter.",
    GXPL_QViewerJSDropFiltersHere: "Drop filters here",
    GXPL_QViewerPopupTitle: "Options",
    GXPL_QViewerJSVisibleColumns: "Visible columns",
    GXPL_QViewerContextMenuExportXml: "Export to XML",
    GXPL_QViewerContextMenuExportHtml: "To Html",
    GXPL_QViewerContextMenuExportPdf: "To PDF",
    GXPL_QViewerContextMenuExportXls2003: "To xls",
    GXPL_QViewerContextMenuExportXlsx: "To Xlsx",
    GXPL_QViewerJSMeasures: "Measures",
    GXPL_QViewerJSValue: "Value",
    GXPL_QViewerJSTotal: "Total",
    GXPL_QViewerJSTotalFor: "Total for",
    GXPL_QViewerJSPerPage: "Per page",
    GXPL_QViewerJSPage: "Page",
    GXPL_QViewerJSOf: "of",
    GXPL_QViewerJSMoveColumnToLeft: "Move column to left",
    GXPL_QViewerJSMoveColumnToRight: "Move column to right"
  };

  @Listen("RequestPageDataForPivotTable", {
    capture: true
  })
  @Listen("RequestPageDataForTable", { capture: true })
  handleRequestPageDataForTable(event) {
    const pageData: QueryViewerPageDataForTable | QueryViewerPageDataForPivot =
      (event as any).parameter;
    this.pageSizeChangeWasCommittedByTheUser =
      this.pageSize !== pageData.PageSize;
  }

  /**
   * Returns an XML on a string variable containing all the data for the attributes loaded in the Pivot Table.
   */
  @Method()
  async getDataXML(serverData: string) {
    return getDataXML(this.queryViewerConfiguration.oat_element, serverData);
  }

  /**
   * Returns an XML on a string variable containing the data which is being visualized at the moment (the difference with the GetData() method it's seen on the Pivot Table, data can be different because of filters application).
   */
  @Method()
  async getFilteredDataPivot(serverData: string) {
    return getFilteredDataXML(
      this.queryViewerConfiguration.oat_element,
      serverData
    );
  }

  /**
   * Method to navigate to the next page.
   */
  @Method()
  async nextPage() {
    return moveToNextPage();
  }

  /**
   * Method to navigate to the first page.
   */
  @Method()
  async firstPage() {
    return moveToFirstPage();
  }

  /**
   * Method to navigate to the previous page.
   */
  @Method()
  async previousPage() {
    return moveToPreviousPage();
  }

  /**
   * Method to navigate to the last page.
   */
  @Method()
  async lastPage() {
    return moveToLastPage();
  }

  private renderPivot() {
    this.queryViewerConfiguration = {
      xml: {
        metadata: this.pivotParameters.metadata
      },
      pivotParams: {
        page: PIVOT_PAGE(this.pivotParameters.UcId),
        content: PIVOT_CONTENT(this.pivotParameters.UcId),
        container: this.queryViewerContainer,
        RealType: this.tableType,
        ObjectName: this.objectName,
        ControlName: this.pivotParameters.ControlName,
        metadata: this.metadata,
        PageSize: this.paging ? this.pageSize : undefined,
        UcId: this.pivotParameters.UcId,
        AutoResize: this.autoResize,
        DisableColumnSort: false,
        RememberLayout: this.rememberLayout,
        ShowDataLabelsIn: this.showDataLabelsIn,
        ServerPaging: true, // PivotTable and Table outputs always have ServerPaging enabled, because client-side paging is no longer supported. If in GeneXus Paging = false, we should send the PageSize property with undefined so that the PivotTable and the Table know that pagination is not configured.
        ServerPagingPivot: true,
        ServerPagingCacheSize: 0,
        UseRecordsetCache: true,
        AllowSelection: false,
        SelectLine: true,
        TotalForColumns: this.totalForColumns,
        TotalForRows: this.totalForRows,
        // This is a WA since the PivotTable does not refresh its title in runtime
        Title:
          this.tableType === QueryViewerOutputType.Table
            ? this.pivotTitle
            : undefined,
        data:
          this.tableType === QueryViewerOutputType.Table
            ? this.pageDataForTable
            : undefined
      },
      oat_element: undefined
    };
    if (OAT.Loader) {
      renderJSPivot(
        this.queryViewerConfiguration.pivotParams,
        this.pivotCollection.collection,
        this.QueryViewerTranslations,
        this.queryViewerConfiguration
      );
    }
  }

  componentDidLoad() {
    this.renderPivot();
  }

  componentDidRender() {
    if (this.shouldReRenderPivot) {
      this.shouldReRenderPivot = false;
      this.renderPivot();
    }
  }

  render() {
    // This is a WA since the PivotTable does not refresh its title in runtime
    if (this.tableType !== QueryViewerOutputType.Table) {
      return (
        <div
          class="gx-query-viewer-pivot-container"
          id={this.pivotParameters.UcId}
          ref={el => (this.queryViewerContainer = el)}
        >
          <span class="pivot_title">{this.pivotTitle}</span>
          <div
            id={PIVOT_PAGE(this.pivotParameters.UcId)}
            class="pivot_filter_div"
          ></div>
          <div
            id={PIVOT_CONTENT(this.pivotParameters.UcId)}
            class="conteiner_table_div"
          ></div>
        </div>
      );
    }
    return (
      <div
        class="gx-query-viewer-pivot-container"
        id={this.pivotParameters.UcId}
        ref={el => (this.queryViewerContainer = el)}
      >
        <div
          id={PIVOT_PAGE(this.pivotParameters.UcId)}
          class="pivot_filter_div"
        ></div>
        <div
          id={PIVOT_CONTENT(this.pivotParameters.UcId)}
          class="conteiner_table_div"
        ></div>
      </div>
    );
  }
}
