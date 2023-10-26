import { Component, h, Prop, Host, Element } from "@stencil/core";

import { QueryViewerServiceResponse } from "../../../services/types/service-result";
import {
  QueryViewerOutputType,
  QueryViewerPivotParameters,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal,
  QueryViewerTranslations
} from "../../../common/basic-types";

@Component({
  tag: "gx-query-viewer-pivot-controller",
  styleUrl: "query-viewer-pivot-controller.scss"
})
export class QueryViewerCard {
  @Element() element: HTMLGxQueryViewerPivotControllerElement;

  /**
   * Allow selection
   */
  @Prop() readonly allowSelection: boolean;

  /**
   * A CSS class to set as the `gx-query-viewer-pivot-controller` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * This attribute lets you define a title for the pivot table.
   */
  @Prop() readonly pivotTitle: string;

  /**
   * This attribute lets you determinate whether there will be paging buttons.
   */
  @Prop() readonly paging: boolean;

  /**
   * Enables you to define the number of rows that will be shown when the Paging property is activated
   */
  @Prop() readonly pageSize: number;

  /**
   * It allows to indicate how you want to display the Data elements of the Query object.
   */
  @Prop() readonly showDataLabelsIn: QueryViewerShowDataLabelsIn;

  /**
   * Specifies the metadata and data that the control will use to render.
   */
  @Prop() readonly serviceResponse: QueryViewerServiceResponse;

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

  private pivotParameters: QueryViewerPivotParameters;

  private pivotCollections: any;

  private setPivotParameters() {
    this.pivotParameters = {
      AllowSelection: this.allowSelection,
      AutoResize: false,
      ControlName: "Queryviewer1",
      DisableColumnSort: false,
      ObjectName: "QueryTest",
      PageSize: this.pageSize,
      RealType: QueryViewerOutputType.PivotTable,
      RememberLayout: true,
      SelectLine: true,
      ServerPaging: null, // Se asigna luego en JSPivotTable
      ServerPagingCacheSize: 0,
      ServerPagingPivot: this.paging,
      ShowDataLabelsIn: this.showDataLabelsIn,
      Title: this.pivotTitle,
      TotalForColumns: this.totalForColumns,
      TotalForRows: this.totalForRows,
      UcId: "QUERYVIEWER1_Queryviewer1",
      UseRecordsetCache: true,
      data: undefined,
      // this.serviceResponse.Data,
      // metadata: this.serviceResponse.MetaData,
      metadata:
        '<?xml version = "1.0" encoding = "UTF-8"?><OLAPCube Version="2" format="compact" decimalSeparator="." thousandsSeparator="," dateFormat="MDY" textForNullValues="" ShowDataLabelsIn="Columns"><OLAPDimension name="Element2" displayName="Compra Date" description="Compra Date" dataField="F2" visible="Yes" axis="Rows" canDragToPages="true" summarize="yes" align="left" picture="99/99/99" dataType="date" format=""></OLAPDimension><OLAPMeasure name="Element1" displayName="Compra Price" description="Compra Price" dataField="F1" visible="Yes" aggregation="" align="right" picture="ZZZ9" targetValue="0" maximumValue="0" dataType="integer" format=""></OLAPMeasure></OLAPCube>',

      page: "QUERYVIEWER1_Queryviewer1_QueryTest_pivot_page"
    };

    this.pivotCollections = {
      AllowElementsOrderChange: false,
      AllowSelection: false,
      AppSettings: "",
      ApplicationNamespace: "GeneXus.Programs",
      AutoRefreshGroup: "",
      AutoResize: false,
      AutoResizeType: "",
      AvoidAutomaticShow: false,
      Axes: [],
      AxesSelectors: "",
      ChartType: "",
      Class: "QueryViewer",
      ContainerName: "QUERYVIEWER1Container",
      Continent: "",
      ControlId: 6,
      ControlLvl: 0,
      ControlName: "Queryviewer1",
      Country: "",
      DesignContainerName: "QUERYVIEWER1Container",
      DesignRenderOutputType: "",
      DisableColumnSort: false,
      DragAndDropData: { Name: "", Type: "", Axis: "", Position: 0 },
      Enabled: true,
      ExecuteShow: false,
      ExportToHTML: true,
      ExportToPDF: true,
      ExportToXLS: false,
      ExportToXLSX: true,
      ExportToXML: false,
      ExternalQueryResult: "",
      FilterChangedData: { Name: "" },
      FontFamily: "",
      GenType: "net",
      GridId: 0,
      GridRow: "",
      Height: "100%",
      IncludeMaxAndMin: false,
      IncludeSparkline: false,
      IncludeTrend: false,
      IsExternalQuery: false,
      IsPostBack: false,
      ItemClickData: {
        Name: "",
        Type: "",
        Axis: "",
        Value: "",
        Selected: false
      },
      ItemCollapseData: { Name: "", Value: "" },
      ItemDoubleClickData: { Name: "", Type: "", Axis: "", Value: "" },
      ItemExpandData: { Name: "", Value: "" },
      LabelForAttValue: "QUERYVIEWER1",
      LastIdBefore: 0,
      MapLibrary: "ECharts",
      MapType: "",
      MaximumCacheSize: 100,
      Metadata:
        '<?xml version = "1.0" encoding = "UTF-8"?><OLAPCube Version="2" format="compact" decimalSeparator="." thousandsSeparator="," dateFormat="MDY" textForNullValues="" ShowDataLabelsIn="Columns"><OLAPDimension name="Element2" displayName="Compra Date" description="Compra Date" dataField="F2" visible="Yes" axis="Rows" canDragToPages="true" summarize="yes" align="left" picture="99/99/99" dataType="date" format=""></OLAPDimension><OLAPMeasure name="Element1" displayName="Compra Price" description="Compra Price" dataField="F1" visible="Yes" aggregation="" align="right" picture="ZZZ9" targetValue="0" maximumValue="0" dataType="integer" format=""></OLAPMeasure></OLAPCube>',
      MinutesToKeepInRecordsetCache: 5,
      Object: "",
      ObjectId: "4",
      ObjectInfo: "",
      ObjectName: "QueryTest",
      ObjectType: "Query",
      Orientation: "",
      PageSize: 20,
      Paging: true,
      Parameters: [],
      ParentPanel: "",
      PlotSeries: "",
      QueryInfo: "",
      RealChartType: "",
      RealType: "PivotTable",
      RecordsetCache: {
        LastServiceCallKey: {},
        OldKey: "",
        ActualKey: "c7bcdc21-ea1c-4155-9e39-fc6188b55d14"
      },
      Region: "",
      RememberLayout: true,
      ReturnSampleData: false,
      ServerPagingForPivotTable: true,
      ServerPagingForTable: true,
      ServiceUrl: "",
      ShowDataAs: "",
      ShowDataLabelsIn: "Columns",
      ShowValues: false,
      ShrinkToFit: false,
      Title: "",
      TotalForColumns: "Yes",
      TotalForRows: "Yes",
      TranslationType: "None",
      TrendPeriod: "",
      Type: "PivotTable",
      UseRecordsetCache: true,
      Visible: true,
      Width: "100%",
      XAxisIntersectionAtZero: false,
      XAxisLabels: "",
      XAxisTitle: "",
      YAxisTitle: "",
      oat_element: "",
      recordsetCacheKey: "c7bcdc21-ea1c-4155-9e39-fc6188b55d14"
    };
  }

  render() {
    console.log("Aca va el service response de la pivot controller");
    console.log(this.serviceResponse);
    this.setPivotParameters();
    return (
      <Host role="article">
        {this.serviceResponse != null && (
          <gx-query-viewer-pivot
            pivotParameters={this.pivotParameters}
            pivotCollections={this.pivotCollections}
          ></gx-query-viewer-pivot>
        )}
      </Host>
    );
  }
}
