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
  moveToLastPage
} from "jspivottable";
import {
  QueryViewerPivotCollection,
  QueryViewerPivotParameters,
  QueryViewerPivotTable
} from "../../common/basic-types";

const PIVOT_PAGE = "QUERYVIEWER1_Queryviewer1_GeneralQuery1_pivot_page";
const PIVOT_CONTENT = "QUERYVIEWER1_Queryviewer1_GeneralQuery1_pivot_content";
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
  @Prop() readonly getPivottableDataSyncXml: string;
  @Watch("getPivottableDataSyncXml")
  handleGetPivottableDataSyncChange(newValue: string) {
    setDataSynForPivotTable(this.qViewer.oat_element, newValue);
  }

  /**
   * pivotParameters
   */
  @Prop()
  readonly pivotParameters: QueryViewerPivotParameters;

  /**
   * pivotCollection
   */
  @Prop() readonly pivotCollection: QueryViewerPivotCollection;

  /**
   * data
   */
  @Prop() readonly data: string;

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
    GXPL_QViewerJSDropFiltersHere: "Drop her filters",
    GXPL_QViewerPopupTitle: "Title p",
    GXPL_QViewerJSVisibleColumns: "Visible columns",
    GXPL_QViewerContextMenuExportXml: "Export to XML",
    GXPL_QViewerContextMenuExportHtml: "To Html",
    GXPL_QViewerContextMenuExportPdf: "To PDF",
    GXPL_QViewerContextMenuExportXls2003: "To xls",
    GXPL_QViewerContextMenuExportXlsx: "To Xlsx",
    GXPL_QViewerJSMeasures: "Measures",
    GXPL_QViewerJSValue: "Value",
    GXPL_QViewerJSTotal: "Grand Total",
    GXPL_QViewerJSTotalFor: "Total for",
    GXPL_QViewerJSPerPage: "Roes:",
    GXPL_QViewerJSPage: "Pags:",
    GXPL_QViewerJSOf: "of",
    GXPL_QViewerJSMoveColumnToLeft: "to left",
    GXPL_QViewerJSMoveColumnToRight: "to right"
  };

  /**
   * Returns an XML on a string variable containing all the data for the attributes loaded in the Pivot Table.
   */
  @Method()
  async getDataXML(serverData: any) {
    return getDataXML(this.qViewer.oat_element, serverData);
  }

  /**
   * Returns an XML on a string variable containing the data which is being visualized at the moment (the difference with the GetData() method it's seen on the Pivot Table, data can be different because of filters application).
   */
  @Method()
  async getFilteredDataPivot() {
    return getFilteredDataXML(
      this.qViewer.oat_element,
      this.getPivottableDataSyncXml
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

  componentDidLoad() {
    this.qViewer = {
      xml: { metadata: this.pivotParameters.metadata },
      pivotParams: {
        page: PIVOT_PAGE,
        content: PIVOT_CONTENT,
        container: this.queryViewerContainer,
        RealType: "PivotTable" as any,
        ObjectName: "General.Query1",
        ControlName: "Queryviewer1",
        PageSize: 20,
        metadata: this.pivotParameters.metadata,
        UcId: "QUERYVIEWER1_Queryviewer1",
        AutoResize: false,
        DisableColumnSort: false,
        RememberLayout: true,
        ShowDataLabelsIn: "Columns" as any,
        ServerPaging: true,
        ServerPagingPivot: true,
        ServerPagingCacheSize: 0,
        UseRecordsetCache: true,
        AllowSelection: false,
        SelectLine: true,
        TotalForColumns: "Yes" as any,
        TotalForRows: undefined,
        Title: ""
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
        <div id={PIVOT_PAGE} class="pivot_filter_div"></div>
        <div id={PIVOT_CONTENT} class="conteiner_table_div"></div>
      </div>
    );
  }
}
