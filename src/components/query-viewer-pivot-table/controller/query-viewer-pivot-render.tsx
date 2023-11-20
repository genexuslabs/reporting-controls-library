import { Component, h, Prop, Host, Element } from "@stencil/core";

import { QueryViewerServiceResponsePivotTable } from "../../../services/types/service-result";
import {
  QueryViewerOutputType,
  QueryViewerPivotCollection,
  QueryViewerPivotParameters,
  // QueryViewerAutoResizeType,
  // QueryViewerChartType,
  // QueryViewerContinent,
  // QueryViewerCountry,
  // QueryViewerOrientation,
  // QueryViewerOutputType,
  // QueryViewerPivotCollection,
  // QueryViewerPivotParameters,
  // QueryViewerPlotSeries,
  // QueryViewerShowDataAs,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal,
  QueryViewerTranslations
  // QueryViewerTrendPeriod
} from "../../../common/basic-types";

let autoId = 0;
@Component({
  tag: "gx-query-viewer-pivot-render",
  styleUrl: "query-viewer-pivot-render.scss"
})
export class QueryViewerPivotTableRender {
  private controllerId: string;
  private ucId: string;

  @Element() element: HTMLGxQueryViewerPivotRenderElement;

  /**
   * Response Attribute Values
   */
  @Prop() readonly attributeValuesForPivotTableXml: string;

  /**
   * Allowing elements order to change
   */
  @Prop() readonly allowElementsOrderChange: boolean;

  /**
   * Allow selection
   */
  @Prop() readonly allowSelection: boolean;

  /**
   * Response Attribute Values
   */
  @Prop()
  readonly calculatePivottableDataXml: string;

  /**
   * A CSS class to set as the `gx-query-viewer-pivot-controller` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Allowing or not Column sort
   */
  @Prop() readonly disableColumnSort: boolean;

  /**
   * This attribute lets you define a title for the pivot table.
   */
  @Prop() readonly pivotTitle: string;

  /**
   * Response Page Data
   */
  @Prop() readonly pageDataForPivotTable: string;

  /**
   * This attribute lets you determinate whether there will be paging buttons.
   */
  @Prop() readonly paging: boolean;

  /**
   * Enables you to define the number of rows that will be shown when the Paging property is activated
   */
  @Prop() readonly pageSize: number;

  /**
   * For timeline for remembering layout
   */
  @Prop() readonly rememberLayout: boolean;

  /**
   * It allows to indicate how you want to display the Data elements of the Query object.
   */
  @Prop() readonly showDataLabelsIn: QueryViewerShowDataLabelsIn;

  /**
   * Specifies the metadata and data that the control will use to render.
   */
  @Prop() readonly serviceResponse: QueryViewerServiceResponsePivotTable;

  /**
   * Determines whether to show a total of all values in the pivot table rows.
   */
  @Prop() readonly totalForRows: QueryViewerTotal;

  /**
   * Determines whether to show a total of all values in the pivot table columns.
   */
  @Prop() readonly totalForColumns: QueryViewerTotal;

  /**
   * For translate the labels of the outputs
   */
  @Prop() readonly translations: QueryViewerTranslations;

  // private pivotCollection: QueryViewerPivotCollection;

  // private setPivotParameters() {
  //   this.pivotParameters = {
  //     AllowSelection: this.allowSelection,
  //     AutoResize: false,
  //     ControlName: "Queryviewer1",
  //     DisableColumnSort: false,
  //     ObjectName: "QueryTest",
  //     PageSize: this.pageSize,
  //     RealType: QueryViewerOutputType.PivotTable,
  //     RememberLayout: true,
  //     SelectLine: true,
  //     ServerPaging: null, // Se asigna luego en JSPivotTable
  //     ServerPagingCacheSize: 0,
  //     ServerPagingPivot: this.paging,
  //     ShowDataLabelsIn: this.showDataLabelsIn,
  //     Title: this.pivotTitle,
  //     TotalForColumns: this.totalForColumns,
  //     TotalForRows: this.totalForRows,
  //     UcId: "QUERYVIEWER1_Queryviewer1",
  //     UseRecordsetCache: true,
  //     data: '<?xml version = "1.0" encoding = "UTF-8"?><OLAPCube Version="2" format="compact" decimalSeparator="." thousandsSeparator="," dateFormat="MDY" textForNullValues="" ShowDataLabelsIn="Columns"><OLAPDimension name="Element2" displayName="Compra Date" description="Compra Date" dataField="F2" visible="Yes" axis="Rows" canDragToPages="true" summarize="yes" align="left" picture="99/99/99" dataType="date" format=""></OLAPDimension><OLAPMeasure name="Element1" displayName="Compra Price" description="Compra Price" dataField="F1" visible="Yes" aggregation="" align="right" picture="ZZZ9" targetValue="0" maximumValue="0" dataType="integer" format=""></OLAPMeasure></OLAPCube>',
  //     // this.serviceResponse.Data,
  //     // metadata: this.serviceResponse.MetaData,
  //     metadata:
  //       '<?xml version = "1.0" encoding = "UTF-8"?><OLAPCube Version="2" format="compact" decimalSeparator="." thousandsSeparator="," dateFormat="MDY" textForNullValues="" ShowDataLabelsIn="Columns"><OLAPDimension name="Element2" displayName="Compra Date" description="Compra Date" dataField="F2" visible="Yes" axis="Rows" canDragToPages="true" summarize="yes" align="left" picture="99/99/99" dataType="date" format=""></OLAPDimension><OLAPMeasure name="Element1" displayName="Compra Price" description="Compra Price" dataField="F1" visible="Yes" aggregation="" align="right" picture="ZZZ9" targetValue="0" maximumValue="0" dataType="integer" format=""></OLAPMeasure></OLAPCube>',

  //     page: "QUERYVIEWER1_Queryviewer1_QueryTest_pivot_page"
  //   };

  //   this.pivotCollection = {
  //     AllowElementsOrderChange: false,
  //     AllowSelection: false,
  //     AppSettings: "",
  //     ApplicationNamespace: "GeneXus.Programs",
  //     AutoRefreshGroup: "",
  //     AutoResize: false,
  //     AutoResizeType: QueryViewerAutoResizeType.Both,
  //     AvoidAutomaticShow: false,
  //     Axes: null,
  //     AxesSelectors: "",
  //     ChartType: QueryViewerChartType.Area,
  //     Class: "QueryViewer",
  //     ContainerName: "QUERYVIEWER1Container",
  //     Continent: QueryViewerContinent.SouthAmerica,
  //     ControlId: 6,
  //     ControlLvl: 0,
  //     ControlName: "Queryviewer1",
  //     Country: QueryViewerCountry.Uruguay,
  //     DesignContainerName: "QUERYVIEWER1Container",
  //     DesignRenderOutputType: "",
  //     DisableColumnSort: false,
  //     DragAndDropData: { Name: "", Type: "", Axis: "", Position: 0 },
  //     Enabled: true,
  //     ExecuteShow: false,
  //     ExportToHTML: true,
  //     ExportToPDF: true,
  //     ExportToXLS: false,
  //     ExportToXLSX: true,
  //     ExportToXML: false,
  //     ExternalQueryResult: "",
  //     FilterChangedData: { Name: "" },
  //     FontFamily: "",
  //     GenType: "net",
  //     GridId: 0,
  //     GridRow: "",
  //     Height: "100%",
  //     IncludeMaxAndMin: false,
  //     IncludeSparkline: false,
  //     IncludeTrend: false,
  //     IsExternalQuery: false,
  //     IsPostBack: false,
  //     ItemClickData: {
  //       Name: "",
  //       Type: "",
  //       Axis: "",
  //       Value: "",
  //       Selected: false
  //     },
  //     ItemCollapseData: { Name: "", Value: "" },
  //     ItemDoubleClickData: { Name: "", Type: "", Axis: "", Value: "" },
  //     ItemExpandData: { Name: "", Value: "" },
  //     LabelForAttValue: "QUERYVIEWER1",
  //     LastIdBefore: 0,
  //     MapLibrary: "ECharts",
  //     MapType: "",
  //     MaximumCacheSize: 100,
  //     Metadata:
  //       '<?xml version = "1.0" encoding = "UTF-8"?><OLAPCube Version="2" format="compact" decimalSeparator="." thousandsSeparator="," dateFormat="MDY" textForNullValues="" ShowDataLabelsIn="Columns"><OLAPDimension name="Element2" displayName="Compra Date" description="Compra Date" dataField="F2" visible="Yes" axis="Rows" canDragToPages="true" summarize="yes" align="left" picture="99/99/99" dataType="date" format=""></OLAPDimension><OLAPMeasure name="Element1" displayName="Compra Price" description="Compra Price" dataField="F1" visible="Yes" aggregation="" align="right" picture="ZZZ9" targetValue="0" maximumValue="0" dataType="integer" format=""></OLAPMeasure></OLAPCube>',
  //     MinutesToKeepInRecordsetCache: 5,
  //     Object: "",
  //     ObjectId: 4,
  //     ObjectInfo: "",
  //     ObjectName: "QueryTest",
  //     ObjectType: "Query",
  //     Orientation: QueryViewerOrientation.Horizontal,
  //     PageSize: 20,
  //     Paging: true,
  //     Parameters: [],
  //     ParentPanel: "",
  //     PlotSeries: QueryViewerPlotSeries.InSeparateCharts,
  //     QueryInfo: "",
  //     RealChartType: "",
  //     RealType: QueryViewerOutputType.PivotTable,
  //     RecordsetCache: {
  //       LastServiceCallKey: [],
  //       OldKey: "",
  //       ActualKey: "c7bcdc21-ea1c-4155-9e39-fc6188b55d14"
  //     },
  //     Region: "",
  //     RememberLayout: true,
  //     ReturnSampleData: false,
  //     ServerPagingForPivotTable: true,
  //     ServerPagingForTable: true,
  //     ServiceUrl: "",
  //     ShowDataAs: QueryViewerShowDataAs.Values,
  //     ShowDataLabelsIn: QueryViewerShowDataLabelsIn.Columns,
  //     ShowValues: false,
  //     ShrinkToFit: false,
  //     Title: "",
  //     TotalForColumns: QueryViewerTotal.Yes,
  //     TotalForRows: QueryViewerTotal.Yes,
  //     TranslationType: "None",
  //     TrendPeriod: QueryViewerTrendPeriod.SinceTheBeginning,
  //     Type: QueryViewerOutputType.PivotTable,
  //     UseRecordsetCache: true,
  //     Visible: true,
  //     Width: "100%",
  //     XAxisIntersectionAtZero: false,
  //     XAxisLabels: "",
  //     XAxisTitle: "",
  //     YAxisTitle: "",
  //     oat_element: "",
  //     recordsetCacheKey: "c7bcdc21-ea1c-4155-9e39-fc6188b55d14"
  //   };
  // }

  private getPivotTableParms(): QueryViewerPivotParameters | undefined {
    if (!this.serviceResponse) {
      return undefined;
    }
    return {
      RealType: QueryViewerOutputType.PivotTable,
      ObjectName: this.serviceResponse.objectName,
      ControlName: this.controllerId,
      PageSize: this.paging === true ? this.pageSize : undefined,
      metadata: this.serviceResponse.metadataXML,
      UcId: this.ucId,
      // ToDo: check if this property make sense with the AutoGrow implementation in the SD programming model
      AutoResize: true,
      DisableColumnSort: this.disableColumnSort,
      RememberLayout: this.rememberLayout,
      ShowDataLabelsIn: this.showDataLabelsIn,
      UseRecordsetCache: !this.serviceResponse.useGxQuery,
      AllowSelection: this.allowSelection,
      SelectLine: true,
      // ToDo: update this value
      ServerPaging: true,
      // ToDo: update this value
      ServerPagingPivot: true,
      // ToDo: update this value
      ServerPagingCacheSize: 0,
      TotalForColumns: this.totalForColumns,
      TotalForRows: this.totalForRows,
      Title: this.pivotTitle
    };
    // ToDo: check if gx-query need this field
    // let data;
    // if (gx.lang.gxBoolean(qViewer.IsExternalQuery)) {
    //   data = qViewer.xml.data;
    // } else if (qViewer.RealType == QueryViewerOutputType.Table) {
    //   data = qViewer.ServerPagingForTable
    //     ? qViewer.xml.pageData
    //     : qViewer.xml.data;
    // } else {
    //   data = qViewer.ServerPagingForPivotTable
    //     ? qViewer.xml.pageData
    //     : qViewer.xml.data;
    // }
    // qViewer.pivotParams.data = data;

    // qViewer.pivotParams.ServerPaging =
    //   qViewer.ServerPagingForTable &&
    //   !gx.lang.gxBoolean(qViewer.IsExternalQuery);
    // qViewer.pivotParams.ServerPagingPivot =
    //   qViewer.ServerPagingForPivotTable &&
    //   !gx.lang.gxBoolean(qViewer.IsExternalQuery);
    //  qViewer.pivotParams.ServerPagingCacheSize = 0;
  }

  private getPivotTableCollection(): QueryViewerPivotCollection {
    const qv = { collection: {}, fadeTimeouts: {} };
    qv.collection["QUERYVIEWER1_Queryviewer1"] = {};
    qv.collection["QUERYVIEWER1_Queryviewer1"].AutoRefreshGroup = "";
    qv.collection["QUERYVIEWER1_Queryviewer1"].debugServices = false;
    qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata = {};
    qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Axes = [];
    qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Axes.push({
      RaiseItemClick: true
    });
    qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Axes.push({
      RaiseItemClick: true
    });
    qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Data = [];
    qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Data.push({
      RaiseItemClick: true
    });
    qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Data.push({
      RaiseItemClick: true
    });

    return qv;
    // return {
    //   collection: {
    //     [this.ucId]: {
    //       AllowElementsOrderChange: this.allowElementsOrderChange,
    //       AutoRefreshGroup: "",
    //       debugServices: false,
    //       ControlName: this.controllerId,
    //       Metadata: {
    //         Axes: this.serviceResponse.MetaData.Axes,
    //         Data: this.serviceResponse.MetaData.Data
    //       },
    //       RememberLayout: false
    //     }
    //   },
    //   fadeTimeouts: {}
    // };
  }

  // private UpdateQueryViewer(qViewer, sourceElements, allowElementsOrderChange) {
  //   // ToDo: check if this function is neccesary
  //   // UpdateTargetElementsAndParametersFromSourceElements(
  //   //   qViewer,
  //   //   sourceElements
  //   // );
  //   // ToDo: check this
  //   // qv.util.autorefresh.SaveAxesAndParametersState(qViewer);
  //   // qViewer._Autorefreshing = true;
  //   qViewer.realShow();
  // }

  componentWillLoad() {
    this.ucId = `gx_query_viewer_user_controller_${autoId}`;
    this.controllerId = `gx-query-viewer-pivot-controller-${autoId}`;
    autoId++;
  }

  render() {
    const pivotParameters = this.getPivotTableParms();
    const pivotCollection = this.getPivotTableCollection();
    console.log("Hola", this.serviceResponse);
    return (
      <Host role="article">
        {this.serviceResponse != null && (
          <gx-query-viewer-pivot
            pivotCollection={pivotCollection}
            pivotParameters={pivotParameters}
            pageDataForPivotTable={this.pageDataForPivotTable}
            attributeValuesForPivotTableXml={
              this.attributeValuesForPivotTableXml
            }
            calculatePivottableDataXml={this.calculatePivottableDataXml}
          ></gx-query-viewer-pivot>
        )}
      </Host>
    );
  }
}
