/* eslint-disable @typescript-eslint/no-var-requires */
import { Component, Listen, h, Prop } from "@stencil/core";
import { renderJSPivot, OAT, setPageDataForPivotTable } from "jspivottable";

@Component({
  tag: "gx-query-viewer-pivot",
  styleUrl: "query-viewer-pivot.scss",
  shadow: false
})
export class QueryViewerPivot {
  private queryViewerContainer: HTMLDivElement;
  /**
   * metadata
   */
  @Prop() readonly metadata =
    '<?xml version = "1.0" encoding = "UTF-8"?>\n\r\n<OLAPCube Version="2" format="compact" decimalSeparator="." thousandsSeparator="," dateFormat="MDY" textForNullValues="" ShowDataLabelsIn="Columns">\n\t<OLAPDimension name="Element1" displayName="Datos Dsc" description="Datos Dsc" dataField="F1" visible="Yes" axis="Rows" canDragToPages="true" summarize="yes" align="left" picture="" dataType="character" format="">\n\t</OLAPDimension>\n\t<OLAPDimension name="Element2" displayName="Datos Codigo" description="Datos Codigo" dataField="F2" visible="Yes" axis="Rows" canDragToPages="true" summarize="yes" align="left" picture="" dataType="character" format="">\n\t</OLAPDimension>\n\t<OLAPMeasure name="Element3" displayName="Datos Valor" description="Datos Valor" dataField="F3" visible="Yes" aggregation="" align="right" picture="ZZZ9" targetValue="0" maximumValue="0" dataType="integer" format="">\n\t</OLAPMeasure>\n</OLAPCube>\n';

  /**
   * data
   */
  @Prop() readonly data: string;

  /**
   * qv
   */
  @Prop() readonly qv = {
    collection: {
      QUERYVIEWER1_Queryviewer1: {
        AutoRefreshGroup: "",
        debugServices: false,
        ControlName: "Queryviewer1",
        Metadata: {
          Axes: [{ RaiseItemClick: true }, { RaiseItemClick: true }],
          Data: [{ RaiseItemClick: true }, { RaiseItemClick: true }]
        }
      }
    },
    fadeTimeouts: {}
  };

  /**
   * qViewer
   */
  @Prop({ mutable: true }) qViewer = undefined;

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

  @Listen("RequestPageDataForPivotTable", { target: "document" })
  handledataforpivottable() {
    console.log("entro al evento");
    const data =
      '<?xml version = "1.0" encoding = "UTF-8"?>\n\r\n<Recordset RecordCount="50" PageCount="3">\n\t<Page PageNumber="1">\n\t\t<Columns>\n\t\t\t<Header DataField="F3">\n\t\t\t</Header>\n\t\t</Columns>\n\t\t<Rows>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>151                 </F1>\n\t\t\t\t\t<F2>1129                </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>29</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>151                 </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>29</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>51                  </F1>\n\t\t\t\t\t<F2>15                  </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>15</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>51                  </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>15</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>51P                 </F1>\n\t\t\t\t\t<F2>156                 </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>1</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>51P                 </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>1</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>5P                  </F1>\n\t\t\t\t\t<F2>352                 </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>2</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>5P                  </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>2</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>89                  </F1>\n\t\t\t\t\t<F2>1895                </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>15</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>89                  </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>15</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>AAB                 </F1>\n\t\t\t\t\t<F2>A32                 </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>32</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>AAB                 </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>32</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>AAM                 </F1>\n\t\t\t\t\t<F2>31                  </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>31</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>AAM                 </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>31</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>AB36                </F1>\n\t\t\t\t\t<F2>36                  </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>36</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>AB36                </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>36</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>AC32                </F1>\n\t\t\t\t\t<F2>32                  </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>32</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>AC32                </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>32</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header>\n\t\t\t\t\t<F1>AC34                </F1>\n\t\t\t\t\t<F2>34                  </F2>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>34</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t\t<Row>\n\t\t\t\t<Header Subtotal="true">\n\t\t\t\t\t<F1>AC34                </F1>\n\t\t\t\t</Header>\n\t\t\t\t<Cells>\n\t\t\t\t\t<Cell>34</Cell>\n\t\t\t\t</Cells>\n\t\t\t</Row>\n\t\t</Rows>\n\t</Page>\n</Recordset>\n';

    // const resXML = data;
    setPageDataForPivotTable(this.qViewer.oat_element, data);

    // if (typeof e.parameter.callback === "function") {
    //   e.parameter.callback(resXML);
    // }
  }

  componentDidLoad() {
    this.qViewer = {
      xml: { metadata: this.metadata },
      pivotParams: {
        page: "QUERYVIEWER1_Queryviewer1_GeneralQuery1_pivot_page",
        content: "QUERYVIEWER1_Queryviewer1_GeneralQuery1_pivot_content",
        container: this.queryViewerContainer,
        RealType: "PivotTable",
        ObjectName: "General.Query1",
        ControlName: "Queryviewer1",
        PageSize: 20,
        metadata: this.metadata,
        UcId: "QUERYVIEWER1_Queryviewer1",
        AutoResize: false,
        DisableColumnSort: false,
        RememberLayout: true,
        ShowDataLabelsIn: "Columns",
        ServerPaging: true,
        ServerPagingPivot: true,
        ServerPagingCacheSize: 0,
        UseRecordsetCache: true,
        AllowSelection: false,
        SelectLine: true,
        TotalForColumns: "Yes",
        Title: ""
      }
    };
    // eslint-disable-next-line eqeqeq
    if (OAT.Loader != undefined) {
      renderJSPivot(
        this.qViewer.pivotParams,
        this.qv.collection,
        this.QueryViewerTranslations,
        this.qViewer
      );
    } else {
      OAT.Loader.addListener(function () {
        renderJSPivot(
          this.qViewer.pivotParams,
          this.qv.collection,
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
          id="QUERYVIEWER1_Queryviewer1_GeneralQuery1_pivot_page"
          class="pivot_filter_div"
        ></div>
        <div
          id="QUERYVIEWER1_Queryviewer1_GeneralQuery1_pivot_content"
          class="conteiner_table_div"
        ></div>
      </div>
    );
  }
}
