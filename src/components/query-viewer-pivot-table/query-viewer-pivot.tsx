/* eslint-disable @typescript-eslint/no-var-requires */
import { Component, h, Method, Prop, Watch } from "@stencil/core";
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
  QueryViewerPivotTable
} from "../../common/basic-types";

const PIVOT_PAGE = (ucId: string) => `${ucId}_GeneralQuery1_pivot_page`;
const PIVOT_CONTENT = (ucId: string) => `${ucId}_GeneralQuery1_pivot_content`;
@Component({
  tag: "gx-query-viewer-pivot",
  styleUrl: "query-viewer-pivot.scss",
  shadow: false
})
export class QueryViewerPivot {
  private queryViewerContainer: HTMLDivElement;
  private qViewer: QueryViewerPivotTable = undefined;
  /**
   * Response Attribute Values
   */
  @Prop() readonly attributeValuesForPivotTableXml: string;
  @Watch("attributeValuesForPivotTableXml")
  handleAttributesValuesForPivotTableChange(newValue: string) {
    setAttributeValuesForPivotTable(this.qViewer.oat_element, newValue);
  }

  /**
   * Response Page Data
   */
  @Prop() readonly pageDataForPivotTable: string;
  @Watch("pageDataForPivotTable")
  handlePageDataForPivotTableChange(newValue: string) {
    setPageDataForPivotTable(this.qViewer.oat_element, newValue);
  }

  /**
   * Response calculation PivotTable Data
   */
  @Prop() readonly calculatePivottableDataXml: string;
  @Watch("calculatePivottableDataXml")
  handleCalculatePivottableDataChange(newValue: string) {
    setPivottableDataCalculation(this.qViewer.oat_element, newValue);
  }

  /**
   * Response PivotTable Data Sync
   */
  @Prop() readonly pivotTableDataSyncXml: string;
  @Watch("pivotTableDataSyncXml")
  handlePivottableDataSyncChange(newValue: string) {
    setDataSynForPivotTable(this.qViewer.oat_element, newValue);
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
    setPageDataForTable(this.qViewer.oat_element, newValue);
  }

  /**
   * Response Attribute Values
   */
  @Prop() readonly attributeValuesForTableXml: string;
  @Watch("attributeValuesForTableXml")
  handleAttributesValuesForTableChange(newValue: string) {
    setAttributeForTable(this.qViewer.oat_element, newValue);
  }

  /**
   * Response Table Data Sync
   */
  @Prop() readonly tableDataSyncXml: string;
  @Watch("tableDataSyncXml")
  handleTableDataSyncChange(newValue: string) {
    setDataSynForTable(this.qViewer.oat_element, newValue);
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
   * data
   */
  @Prop() readonly data: string;

  /**
   * Specifies whether the render output is PivotTable or Table
   */
  @Prop() readonly tableType:
    | QueryViewerOutputType.PivotTable
    | QueryViewerOutputType.Table;

  /**
   * QueryViewerTranslations
   */
  @Prop() readonly QueryViewerTranslations = {
    GXPL_QViewerSinceTheBeginningTrend: "Trend Since The Beginning",
    GXPL_QViewerLastDayTrend: "Trend Last Day",
    GXPL_QViewerLastHourTrend: "Trend Last hour",
    GXPL_QViewerJSAllOption: "Todos",
    GXPL_QViewerJSAscending: "Ascending",
    GXPL_QViewerJSDescending: "Descendiente",
    GXPL_QViewerJSSubtotals: "Subtotal",
    GXPL_QViewerJSRestoreDefaultView: "Restore",
    GXPL_QViewerJSPivotDimensionToColumn: "To COlumns",
    GXPL_QViewerJSPivotDimensionToRow: "To Dimensions",
    GXPL_QViewerJSMoveToFilterBar: "To Filters",
    GXPL_QViewerJSAll: "ALL",
    GXPL_QViewerJSNone: "NONE",
    GXPL_QViewerJSReverse: "Revert",
    GXPL_QViewerSearch: "Search",
    GXPL_QViewerInfoUser: "User Info",
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
    GXPL_QViewerJSPerPage: "Rows:",
    GXPL_QViewerJSPage: "Pags:",
    GXPL_QViewerJSOf: "of",
    GXPL_QViewerJSMoveColumnToLeft: "to left",
    GXPL_QViewerJSMoveColumnToRight: "to right"
  };

  /**
   * Returns an XML on a string variable containing all the data for the attributes loaded in the Pivot Table.
   */
  @Method()
  async getDataXML(serverData: string) {
    return getDataXML(this.qViewer.oat_element, serverData);
  }

  /**
   * Returns an XML on a string variable containing the data which is being visualized at the moment (the difference with the GetData() method it's seen on the Pivot Table, data can be different because of filters application).
   */
  @Method()
  async getFilteredDataPivot(serverData: string) {
    return getFilteredDataXML(this.qViewer.oat_element, serverData);
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

  componentDidRender() {
    this.qViewer = {
      xml: {
        metadata: this.pivotParameters.metadata
      },
      pivotParams: {
        page: PIVOT_PAGE(this.pivotParameters.UcId),
        content: PIVOT_CONTENT(this.pivotParameters.UcId),
        container: this.queryViewerContainer,
        RealType: this.tableType,
        ObjectName: this.pivotParameters.ObjectName,
        ControlName: "Queryviewer1",
        metadata: this.pivotParameters.metadata,
        PageSize: this.pivotParameters.PageSize,
        UcId: this.pivotParameters.UcId,
        AutoResize: false,
        DisableColumnSort: false,
        RememberLayout: true,
        ShowDataLabelsIn: this.pivotParameters.ShowDataLabelsIn,
        ServerPaging: true,
        ServerPagingPivot: this.pivotParameters.ServerPagingPivot,
        ServerPagingCacheSize: 0,
        UseRecordsetCache: true,
        AllowSelection: false,
        SelectLine: true,
        TotalForColumns: this.pivotParameters.TotalForColumns,
        TotalForRows: this.pivotParameters.TotalForRows,
        Title: this.pivotParameters.Title,
        data:
          this.tableType === QueryViewerOutputType.Table
            ? this.pageDataForTable
            : undefined
      },
      oat_element: undefined
    };
    // this.qViewer = {
    //   xml: { metadata: this.pivotParameters.metadata },
    //   pivotParams: {
    //     page: PIVOT_PAGE,
    //     content: PIVOT_CONTENT,
    //     container: this.queryViewerContainer,
    //     ...this.pivotParameters
    //   },
    //   oat_element: undefined
    // };

    // eslint-disable-next-line eqeqeq
    if (OAT.Loader != undefined) {
      renderJSPivot(
        this.qViewer.pivotParams,
        this.pivotCollection.collection,
        this.QueryViewerTranslations,
        this.qViewer
      );
    } else {
      OAT.Loader.addListener(function () {
        renderJSPivot(
          this.qViewer.pivotParams,
          this.pivotCollection.collection,
          this.QueryViewerTranslations,
          this.qViewer
        );
      });
    }
  }
  render() {
    return (
      <div
        class="gx_usercontrol qv-pivottable QueryViewer-pivottable"
        id="QUERYVIEWER1Container"
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
