import { Component, h, Prop, Host, Element, Method } from "@stencil/core";

import { QueryViewerServiceResponsePivotTable } from "@genexus/reporting-api/dist/types/service-result";
import {
  QueryViewerOutputType,
  QueryViewerPivotCollection,
  QueryViewerPivotParameters,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal,
  QueryViewerTranslations
} from "../../../common/basic-types";

let autoId = 0;
@Component({
  tag: "gx-query-viewer-pivot-render",
  styleUrl: "query-viewer-pivot-render.scss"
})
export class QueryViewerPivotTableRender {
  private controllerId: string;
  private ucId: string;
  private pivotRef: HTMLGxQueryViewerPivotElement;

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
  @Prop() readonly calculatePivottableDataXml: string;

  /**
   * Response Pivot Table Data Sync
   */
  @Prop() readonly getPivottableDataSyncXml: string;

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

  /**
   * Returns an XML on a string variable containing all the data for the attributes loaded in the Pivot Table.
   */
  @Method()
  async getDataPivot(serverData: any) {
    return this.pivotRef.getDataXML(serverData);
  }

  /**
   * Returns an XML on a string variable containing the data which is being visualized at the moment (the difference with the GetData() method it's seen on the Pivot Table, data can be different because of filters application).
   */
  @Method()
  async getFilteredDataPivot() {
    return this.pivotRef.getFilteredDataPivot();
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
    const qv: QueryViewerPivotCollection = {
      collection: {},
      fadeTimeouts: {}
    };

    qv.collection["QUERYVIEWER1_Queryviewer1"] = {
      AutoRefreshGroup: "",
      debugServices: false,
      Metadata: {
        Axes: this.serviceResponse.MetaData.axes,
        Data: this.serviceResponse.MetaData.data
      }
    };

    return qv;
  }

  // private getPivotTableCollection(): QueryViewerPivotCollection {
  //   const qv = { collection: {}, fadeTimeouts: {} };
  //   qv.collection["QUERYVIEWER1_Queryviewer1"] = {};
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].AutoRefreshGroup = "";
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].debugServices = false;
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata = {};
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Axes = [];
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Axes.push({
  //     RaiseItemClick: true
  //   });
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Axes.push({
  //     RaiseItemClick: true
  //   });
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Data = [];
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Data.push({
  //     RaiseItemClick: true
  //   });
  //   qv.collection["QUERYVIEWER1_Queryviewer1"].Metadata.Data.push({
  //     RaiseItemClick: true
  //   });

  //   return qv;
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
  // }

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
    if (this.serviceResponse == null) {
      return "";
    }

    const pivotParameters = this.getPivotTableParms();
    const pivotCollection = this.getPivotTableCollection();

    return (
      <Host>
        <gx-query-viewer-pivot
          pivotCollection={pivotCollection}
          pivotParameters={pivotParameters}
          pageDataForPivotTable={this.pageDataForPivotTable}
          attributeValuesForPivotTableXml={this.attributeValuesForPivotTableXml}
          calculatePivottableDataXml={this.calculatePivottableDataXml}
          getPivottableDataSyncXml={this.getPivottableDataSyncXml}
          ref={el => (this.pivotRef = el)}
        ></gx-query-viewer-pivot>
      </Host>
    );
  }
}
