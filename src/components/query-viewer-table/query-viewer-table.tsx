/* eslint-disable @typescript-eslint/no-var-requires */
import { Component, h, Prop, Watch } from "@stencil/core";
import {
  renderJSPivot,
  OAT,
  setPageDataForTable,
  setAttributeForTable,
  setDataSynForTable
} from "jspivottable";
import {
  QueryViewerPivotCollection,
  QueryViewerPivotParameters,
  QueryViewerPivotTable
} from "../../common/basic-types";

const TABLE_PAGE = "QUERYVIEWER1_Queryviewer1_GeneralQuery1_pivot_page";
const TABLE_CONTENT = "QUERYVIEWER1_Queryviewer1_GeneralQuery1_pivot_content";

@Component({
  tag: "gx-query-viewer-table",
  styleUrl: "query-viewer-table.scss",
  shadow: false
})
export class QueryViewerTable {
  private queryViewerContainer: HTMLDivElement;
  private qViewer: QueryViewerPivotTable = undefined;

  /**
   * Response Page Data
   */
  @Prop({ mutable: true }) pageDataForTable: string;
  @Watch("pageDataForTable")
  handlePageDataForTableChange(newValue: string) {
    console.log("pageData", newValue);
    setPageDataForTable(this.qViewer.oat_element, newValue);
  }

  /**
   * Response Attribute Values
   */
  @Prop() readonly attributeValuesForTableXml: string;
  @Watch("attributeValuesForTableXml")
  handleAttributesValuesForTableChange(newValue: string) {
    console.log("attributeValues", newValue);
    setAttributeForTable(this.qViewer.oat_element, newValue);
  }

  /**
   * Response Table Data Sync
   */
  @Prop() readonly getTableDataSyncXml: string;
  @Watch("getTableDataSyncXml")
  handleGetTableDataSyncChange(newValue: string) {
    setDataSynForTable(this.qViewer.oat_element, newValue);
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

  componentDidLoad() {
    this.qViewer = {
      xml: { metadata: this.pivotParameters.metadata },
      pivotParams: {
        page: TABLE_PAGE,
        content: TABLE_CONTENT,
        container: this.queryViewerContainer,
        RealType: "Table" as any,
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
        Title: "",
        data: this.pageDataForTable
      },
      oat_element: undefined
    };

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
        class="gx_usercontrol qv-table QueryViewer-table"
        id="QUERYVIEWER1Container"
        ref={el => (this.queryViewerContainer = el)}
      >
        <div id={TABLE_PAGE} class="pivot_filter_div"></div>
        <div id={TABLE_CONTENT} class="conteiner_table_div"></div>
      </div>
    );
  }
}
