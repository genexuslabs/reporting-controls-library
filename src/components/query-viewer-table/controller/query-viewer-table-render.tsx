import { Component, h, Prop, Host, Element } from "@stencil/core";

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
  tag: "gx-query-viewer-table-render",
  styleUrl: "query-viewer-table-render.scss"
})
export class QueryViewerPivotTableRender {
  private controllerId: string;
  private ucId: string;

  @Element() element: HTMLGxQueryViewerTableRenderElement;

  /**
   * Allow selection
   */
  @Prop() readonly allowSelection: boolean;

  /**
   * Allowing elements order to change
   */
  @Prop() readonly allowElementsOrderChange: boolean;

  /**
   * Response Attribute Values for Pivot Table
   */
  @Prop() readonly attributeValuesForTableXml: string;

  /**
   * A CSS class to set as the `gx-query-viewer-pivot-controller` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Allowing or not Column sort
   */
  @Prop() readonly disableColumnSort: boolean;

  /**
   * This attribute lets you define a title for the table.
   */
  @Prop() readonly tableTitle: string;

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
   * Response Page Data
   */
  @Prop() readonly pageDataForTable: string;

  /**
   * For timeline for remembering layout
   */
  @Prop() readonly rememberLayout: boolean;

  /**
   * Response Table Data Sync
   */
  @Prop() readonly getTableDataSyncXml: string;

  private getPivotTableParms(): QueryViewerPivotParameters | undefined {
    if (!this.serviceResponse) {
      return undefined;
    }
    return {
      RealType: QueryViewerOutputType.Table,
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
      Title: this.tableTitle,
      data: this.pageDataForTable
    };
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
        Axes: this.serviceResponse.MetaData.Axes,
        Data: this.serviceResponse.MetaData.Data
      }
    };

    return qv;
  }

  componentWillLoad() {
    this.ucId = `gx_query_viewer_user_controller_${autoId}`;
    this.controllerId = `gx-query-viewer-pivot-controller-${autoId}`;
    autoId++;
  }

  render() {
    const pivotParameters = this.getPivotTableParms();
    const pivotCollection = this.getPivotTableCollection();
    return (
      <Host>
        {this.serviceResponse != null && (
          <gx-query-viewer-table
            pivotCollection={pivotCollection}
            pivotParameters={pivotParameters}
            pageDataForTable={this.pageDataForTable}
            attributeValuesForTableXml={this.attributeValuesForTableXml}
            getTableDataSyncXml={this.getTableDataSyncXml}
          ></gx-query-viewer-table>
        )}
      </Host>
    );
  }
}
