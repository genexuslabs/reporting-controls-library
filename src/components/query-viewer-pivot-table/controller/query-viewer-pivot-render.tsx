import {
  Component,
  h,
  Prop,
  Host,
  Element,
  Method,
  Watch
} from "@stencil/core";

import { QueryViewerServiceResponsePivotTable } from "@genexus/reporting-api";
import {
  QueryViewerAxisOrderType,
  QueryViewerOutputType,
  QueryViewerPivotCollection,
  QueryViewerPivotParameters,
  QueryViewerShowDataLabelsIn,
  QueryViewerTableParameters,
  QueryViewerTotal,
  QueryViewerTranslations
} from "@genexus/reporting-api";
import { OAT } from "jspivottable";

@Component({
  tag: "gx-query-viewer-pivot-render",
  styleUrl: "query-viewer-pivot-render.scss"
})
export class QueryViewerPivotTableRender {
  private pivotRef: HTMLGxQueryViewerPivotElement;
  private mustWaitInitialPageDataForTable = true;

  @Element() element: HTMLGxQueryViewerPivotRenderElement;

  /**
   * Response Attribute Values
   */
  @Prop() readonly attributeValuesForPivotTableXml: string;

  /**
   * Response Attribute Values for Table
   */
  @Prop() readonly attributeValuesForTableXml: string;

  /**
   * Allowing elements order to change
   */
  @Prop() readonly allowElementsOrderChange: boolean;

  /**
   * Allow selection
   */
  @Prop() readonly allowSelection: boolean;

  /**
   * if true will shrink the table
   */
  @Prop() readonly autoResize: boolean;

  /**
   * Response Attribute Values
   */
  @Prop() readonly calculatePivottableDataXml: string;

  /**
   * Specifies the name of the control used in the pivot and Table outputs
   * types
   */
  @Prop() readonly controlName!: string;

  /**
   * Response Pivot Table Data Sync
   */
  @Prop() readonly pivotTableDataSyncXml: string;

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
  @Watch("paging")
  pagingChange() {
    if (this.tableType === QueryViewerOutputType.Table) {
      this.requestInitialPageDataForTable();
    }
  }

  /**
   * Enables you to define the number of rows that will be shown when the Paging property is activated
   */
  @Prop() readonly pageSize: number;
  @Watch("pageSize")
  pageSizeChange() {
    if (this.tableType === QueryViewerOutputType.Table) {
      this.requestInitialPageDataForTable();
    }
  }

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

  @Watch("serviceResponse")
  serviceResponseChanged(newValue: QueryViewerServiceResponsePivotTable) {
    if (newValue) {
      this.mustWaitInitialPageDataForTable = true;
    }
  }

  /**
   * Specifies whether the render output is PivotTable or Table
   */
  @Prop() readonly tableType:
    | QueryViewerOutputType.PivotTable
    | QueryViewerOutputType.Table;

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

  /**
   * Response Page Data
   */
  @Prop() readonly pageDataForTable: string;
  @Watch("pageDataForTable")
  pageDataForTableChange() {
    this.mustWaitInitialPageDataForTable = false;
  }

  /**
   * Response Table Data Sync
   */
  @Prop() readonly tableDataSyncXml: string;

  /**
   * Returns an XML on a string variable containing all the data for the attributes loaded in the Pivot Table.
   */
  @Method()
  async getDataPivot(serverData: string) {
    return this.pivotRef.getDataXML(serverData);
  }

  /**
   * Returns an XML on a string variable containing the data which is being visualized at the moment (the difference with the GetData() method it's seen on the Pivot Table, data can be different because of filters application).
   */
  @Method()
  async getFilteredDataPivot(serverData: string) {
    return this.pivotRef.getFilteredDataPivot(serverData);
  }

  /**
   * Method to navigate to the next page.
   */
  @Method()
  async nextPage() {
    return this.pivotRef.nextPage();
  }

  /**
   * Method to navigate to the first page.
   */
  @Method()
  async firstPage() {
    return this.pivotRef.firstPage();
  }

  /**
   * Method to navigate to the previous page.
   */
  @Method()
  async previousPage() {
    return this.pivotRef.previousPage();
  }

  /**
   * Method to navigate to the last page.
   */
  @Method()
  async lastPage() {
    return this.pivotRef.lastPage();
  }

  private getPivotTableParameters():
    | QueryViewerPivotParameters
    | QueryViewerTableParameters {
    if (!this.serviceResponse) {
      return undefined;
    }

    if (this.tableType === QueryViewerOutputType.PivotTable) {
      const pivotParameters: QueryViewerPivotParameters = {
        RealType: QueryViewerOutputType.PivotTable,
        ObjectName: this.serviceResponse.objectName,
        ControlName: this.controlName,
        PageSize: this.pageSize,
        metadata: this.serviceResponse.metadataXML,
        UcId: this.controlName,
        // ToDo: check if this property make sense with the AutoGrow implementation in the SD programming model
        AutoResize: true,
        DisableColumnSort: this.disableColumnSort,
        RememberLayout: this.rememberLayout,
        ShowDataLabelsIn: this.showDataLabelsIn,
        UseRecordsetCache: !this.serviceResponse.useGxQuery,
        AllowSelection: this.allowSelection,
        SelectLine: true,
        // PivotTable and Table outputs always have ServerPaging enabled, because client-side paging is no
        // longer supported. If in GeneXus Paging = false, we should send the PageSize property with undefined
        // so that the PivotTable and the Table know that pagination is not configured.
        ServerPaging: true,
        ServerPagingPivot: true,
        // ToDo: update this value
        ServerPagingCacheSize: 0,
        TotalForColumns: this.totalForColumns,
        TotalForRows: this.totalForRows,
        Title: this.pivotTitle
      };
      return pivotParameters;
    }
    const tableParameters: QueryViewerTableParameters = {
      RealType: QueryViewerOutputType.Table,
      ObjectName: this.serviceResponse.objectName,
      ControlName: this.controlName,
      PageSize: this.paging ? this.pageSize : undefined,
      metadata: this.serviceResponse.metadataXML,
      UcId: this.controlName,
      // ToDo: check if this property make sense with the AutoGrow implementation in the SD programming model
      AutoResize: true,
      DisableColumnSort: this.disableColumnSort,
      RememberLayout: this.rememberLayout,
      ShowDataLabelsIn: this.showDataLabelsIn,
      UseRecordsetCache: !this.serviceResponse.useGxQuery,
      AllowSelection: this.allowSelection,
      SelectLine: true,
      // PivotTable and Table outputs always have ServerPaging enabled, because client-side paging is no
      // longer supported. If in GeneXus Paging = false, we should send the PageSize property with undefined
      // so that the PivotTable and the Table know that pagination is not configured.
      ServerPaging: true,
      ServerPagingPivot: true,
      // ToDo: update this value
      ServerPagingCacheSize: 0,
      TotalForColumns: this.totalForColumns,
      TotalForRows: this.totalForRows,
      Title: this.pivotTitle,
      data: this.pageDataForTable
    };
    return tableParameters;
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

  private checkDataPaging() {
    if (this.paging && this.tableType === QueryViewerOutputType.Table) {
      // Tabla con paginado en el server
      const previousStateSave = OAT.getStateWhenServingPaging
        ? OAT.getStateWhenServingPaging(
            this.controlName,
            this.serviceResponse.objectName
          )
        : false;

      if (!previousStateSave || !this.rememberLayout) {
        this.requestInitialPageDataForTable();
      }
    } else {
      this.mustWaitInitialPageDataForTable = false;
    }
  }

  private getPivotTableCollection(): QueryViewerPivotCollection {
    const qv: QueryViewerPivotCollection = {
      collection: {},
      fadeTimeouts: {}
    };

    qv.collection[this.controlName] = {
      AutoRefreshGroup: "",
      debugServices: false,
      ControlName: this.controlName,
      Metadata: {
        Axes: this.serviceResponse.MetaData.axes,
        Data: this.serviceResponse.MetaData.data
      }
    };
    return qv;
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

  private getDataFieldAndOrder() {
    for (let i = 0; i < this.serviceResponse.MetaData.axes.length; i++) {
      const axis = this.serviceResponse.MetaData.axes[i];
      if (
        axis.order.type === QueryViewerAxisOrderType.Ascending ||
        axis.order.type === QueryViewerAxisOrderType.Descending
      ) {
        return { dataFieldOrder: axis.dataField, orderType: axis.order.type };
      }
    }
    return { dataFieldOrder: "", orderType: "" };
  }

  private requestInitialPageDataForTable() {
    const dataFieldAndOrder = this.getDataFieldAndOrder();
    const pageDataTableParameters = {
      PageNumber: 1,
      PageSize: this.paging ? this.pageSize : undefined,
      RecalculateCantPages: true,
      DataFieldOrder: dataFieldAndOrder.dataFieldOrder,
      OrderType: dataFieldAndOrder.orderType,
      Filters: [],
      LayoutChange: false,
      QueryviewerId: this.controlName
    };
    const requestPageDataEvent = new CustomEvent("RequestPageDataForTable", {
      bubbles: true
    });
    (requestPageDataEvent as any).parameter = pageDataTableParameters;
    this.element.dispatchEvent(requestPageDataEvent);
  }

  componentWillRender() {
    if (this.serviceResponse && this.mustWaitInitialPageDataForTable) {
      this.checkDataPaging();
    }
  }

  render() {
    if (this.serviceResponse == null || this.mustWaitInitialPageDataForTable) {
      return "";
    }

    const pivotParameters = this.getPivotTableParameters();
    const pivotCollection = this.getPivotTableCollection();

    if (this.tableType === QueryViewerOutputType.PivotTable) {
      return (
        <Host>
          <gx-query-viewer-pivot
            pivotCollection={pivotCollection}
            pivotParameters={pivotParameters}
            pageDataForPivotTable={this.pageDataForPivotTable}
            attributeValuesForPivotTableXml={
              this.attributeValuesForPivotTableXml
            }
            autoResize={this.autoResize}
            calculatePivottableDataXml={this.calculatePivottableDataXml}
            pivotTableDataSyncXml={this.pivotTableDataSyncXml}
            tableType={this.tableType}
            totalForColumns={this.totalForColumns}
            totalForRows={this.totalForRows}
            pivotTitle={this.pivotTitle}
            showDataLabelsIn={this.showDataLabelsIn}
            paging={this.paging}
            pageSize={this.pageSize}
            rememberLayout={this.rememberLayout}
            objectName={this.serviceResponse.objectName}
            metadata={this.serviceResponse.metadataXML}
            ref={el => (this.pivotRef = el)}
          ></gx-query-viewer-pivot>
        </Host>
      );
    }
    return (
      <Host>
        <gx-query-viewer-pivot
          pivotCollection={pivotCollection}
          pivotParameters={pivotParameters}
          pageDataForTable={this.pageDataForTable}
          attributeValuesForTableXml={this.attributeValuesForTableXml}
          tableDataSyncXml={this.tableDataSyncXml}
          tableType={this.tableType}
          autoResize={this.autoResize}
          totalForColumns={this.totalForColumns}
          totalForRows={this.totalForRows}
          pivotTitle={this.pivotTitle}
          showDataLabelsIn={this.showDataLabelsIn}
          paging={this.paging}
          pageSize={this.pageSize}
          rememberLayout={this.rememberLayout}
          objectName={this.serviceResponse.objectName}
          metadata={this.serviceResponse.metadataXML}
          ref={el => (this.pivotRef = el)}
        ></gx-query-viewer-pivot>
      </Host>
    );
  }
}
