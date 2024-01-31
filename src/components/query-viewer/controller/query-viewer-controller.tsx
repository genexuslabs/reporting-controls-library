import {
  Component,
  Event,
  EventEmitter,
  Method,
  Prop,
  Watch
} from "@stencil/core";

import {
  ServicesContext,
  getMetadataAndData,
  getPivotTableMetadata,
  makeRequestForPivotTable,
  makeRequestForSyncServicesPivotTable,
  makeRequestForTable
} from "@genexus/reporting-api/dist";
import {
  GeneratorType,
  QueryViewerBase,
  QueryViewerChartType,
  QueryViewerOrientation,
  QueryViewerOutputType,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal
} from "@genexus/reporting-api/dist/types/basic-types";
import {
  QueryViewer,
  QueryViewerCard
} from "@genexus/reporting-api/dist/types/json";
import {
  QueryViewerAttributesValuesForPivot,
  QueryViewerCalculatePivottableData,
  QueryViewerPageDataForPivot,
  QueryViewerPageDataForTable,
  QueryViewerPivotTableDataSync,
  QueryViewerServiceMetaData,
  QueryViewerServiceResponse,
  QueryViewerServiceResponsePivotTable
} from "@genexus/reporting-api/dist/types/service-result";

@Component({
  tag: "gx-query-viewer-controller",
  shadow: false
})
export class QueryViewerController {
  private recordSetCacheActualKey: string;
  private recordSetCacheOldKey: string;
  private shouldRequestData = false;
  /**
   * @todo Add description
   */
  @Prop() readonly allowElementsOrderChange: boolean = false;

  /**
   * Determines the application namespace where the program is generated and compiled.
   */
  @Prop() readonly applicationNamespace: string;

  /**
   * Base URL of the server
   */
  @Prop() readonly baseUrl: string;

  /**
   * When `type == Chart`, specifies the chart type: Bar, Pie, Timeline, etc...
   */
  @Prop() readonly chartType: QueryViewerChartType;

  /**
   * Environment of the project: java or net
   */
  @Prop() readonly environment: GeneratorType;

  /**
   * Name of the Query or Data provider assigned
   */
  @Prop() readonly objectName: string;

  @Watch("objectName")
  handleObjectNameChange() {
    this.shouldRequestData = true;
  }

  /**
   * Include sparkline
   */
  @Prop() readonly includeSparkline: boolean = false;

  /**
   * If true includes trend on the graph
   */
  @Prop() readonly includeTrend: boolean = false;

  /**
   * Specified the orientation when have more than one card
   */
  @Prop() readonly orientation: QueryViewerOrientation;

  /**
   * If type == PivotTable or Table, if true there is paging, else everything in one table
   */
  @Prop() readonly paging: boolean;
  @Watch("paging")
  handlePagingChange() {
    if (this.type === QueryViewerOutputType.PivotTable) {
      this.shouldRequestData = true;
    }
  }

  /**
   * If paging true, number of items for a single page
   */
  @Prop() readonly pageSize: number;
  @Watch("pageSize")
  handlePageSizeChange() {
    if (this.type === QueryViewerOutputType.PivotTable) {
      this.shouldRequestData = this.paging;
    }
  }

  /**
   * For timeline for remembering layout
   */
  @Prop() readonly rememberLayout: boolean = true;

  /**
   * @todo Add description
   */
  @Prop() readonly returnSampleData: boolean = false;
  /**
   * Title of the QueryViewer
   */
  @Prop() readonly queryTitle: string;
  @Watch("queryTitle")
  handleQueryTitleChange() {
    if (this.type === QueryViewerOutputType.PivotTable) {
      this.shouldRequestData = true;
    }
  }

  /**
   * True if grand total is shown for all table rows
   */
  @Prop() readonly totalForRows: QueryViewerTotal;
  @Watch("totalForRows")
  handleTotalForRowsChange() {
    if (this.type === QueryViewerOutputType.PivotTable) {
      this.shouldRequestData = true;
    }
  }

  /**
   * True if grand total is shown for all table columns
   */
  @Prop() readonly totalForColumns: QueryViewerTotal;
  @Watch("totalForColumns")
  handleTotalForColumnsChange() {
    if (this.type === QueryViewerOutputType.PivotTable) {
      this.shouldRequestData = true;
    }
  }

  /**
   * @todo Add description and improve type
   */
  @Prop() readonly translationType: string = "None"; // @todo Verify the values that Angular provides

  /**
   * Type of the QueryViewer: Table, PivotTable, Chart, Card
   */
  @Prop() readonly type: QueryViewerOutputType;

  /**
   * True to tell the controller to connect use GXquery as a queries repository
   */
  @Prop() readonly useGxquery: boolean;

  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop() readonly metadataName: string;

  /**
   * Use this property to pass a query obtained from GXquery, when useGxquery = true (ignored if objectName is specified, because this property has a greater precedence)
   */
  @Prop() readonly serializedObject: string;

  /**
   * Ax to show data labels
   */
  @Prop() readonly showDataLabelsIn: QueryViewerShowDataLabelsIn;

  @Watch("showDataLabelsIn")
  handleShowDataLabelsInChange() {
    if (this.type === QueryViewerOutputType.PivotTable) {
      this.shouldRequestData = true;
    }
  }
  /**
   * Fired when new metadata and data is fetched
   */
  @Event() queryViewerServiceResponse: EventEmitter<QueryViewerServiceResponse>;

  /**
   * Fired when new metadata and data is fetched
   */
  @Event()
  queryViewerServiceResponsePivotTable: EventEmitter<QueryViewerServiceResponsePivotTable>;

  /**
   * Fired when new page data is ready to use in the PivotTable
   */
  @Event() pageDataForPivotTable: EventEmitter<string>;

  /**
   * Fired when new page data is ready to use in the PivotTable
   */
  @Event() attributeValuesForPivotTable: EventEmitter<string>;

  /**
   * Fired when new page data is ready to use in the PivotTable
   */
  @Event() calculatePivottableData: EventEmitter<string>;

  /**
   * Fired when new page data is ready to use in the PivotTable
   */
  @Event() pageDataForTable: EventEmitter<string>;

  /**
   * Fired when data is ready to use in the PivotTable
   */
  @Event() syncPivotTableData: EventEmitter<string>;

  /**
   *  ItemClickEvent, executes actions when this event is triggered after clicking on a pivot table element.
   */
  @Event() itemClickPivotTable: EventEmitter<string>;

  /**
   * PivotTable's Method for PivotTable Page Data
   */
  @Method()
  async getPageDataForPivotTable(
    properties: QueryViewerPageDataForPivot,
    paging: boolean,
    totalForColumns: QueryViewerTotal,
    totalForRows: QueryViewerTotal
  ) {
    const qvInfo = this.getQueryViewerInformation(this.objectName);
    const servicesInfo = this.getServiceContext();
    const callbackWhenSuccess = (xml: string) => {
      this.pageDataForPivotTable.emit(xml);
    };
    qvInfo.Paging = paging;
    qvInfo.PageSize = this.pageSize;
    qvInfo.TotalForRows = totalForRows;
    qvInfo.TotalForColumns = totalForColumns;
    qvInfo.ShowDataLabelsIn = this.showDataLabelsIn;

    makeRequestForPivotTable(
      qvInfo,
      { pageData: properties },
      servicesInfo,
      "pivotTablePageData",
      callbackWhenSuccess
    );
  }

  /**
   * PivotTable's Method for Attributes Values
   */
  @Method()
  async getAttributeValues(properties: QueryViewerAttributesValuesForPivot) {
    const qvInfo = this.getQueryViewerInformation(this.objectName);
    const servicesInfo = this.getServiceContext();
    const callbackWhenSuccess = (xml: string) => {
      this.attributeValuesForPivotTable.emit(xml);
    };

    makeRequestForPivotTable(
      qvInfo,
      { attributeValues: properties },
      servicesInfo,
      "attributeValues",
      callbackWhenSuccess
    );
  }

  /**
   * PivotTable's Method for Calculate PivotTable Data
   */
  @Method()
  async getCalculatePivottableData(
    properties: QueryViewerCalculatePivottableData
  ) {
    const qvInfo = this.getQueryViewerInformation(this.objectName);
    const servicesInfo = this.getServiceContext();
    const callbackWhenSuccess = (xml: string) => {
      this.calculatePivottableData.emit(xml);
    };

    makeRequestForPivotTable(
      qvInfo,
      { calculatePivottableData: properties },
      servicesInfo,
      "calculatePivottableData",
      callbackWhenSuccess
    );
  }

  /**
   * PivotTable's Method for PivotTable Data Sync Response
   */
  @Method()
  async getPivottableDataSync(properties: QueryViewerPivotTableDataSync) {
    const qvInfo = this.getQueryViewerInformation(this.objectName);
    const servicesInfo = this.getServiceContext();

    const responseXml = makeRequestForSyncServicesPivotTable(
      qvInfo,
      { getPivottableDataSync: properties },
      servicesInfo,
      "getPivottableDataSync"
    );

    this.syncPivotTableData.emit(responseXml);
  }

  /**
   * Table's Method for Table Page Data
   */
  @Method()
  async getPageDataForTable(
    properties: QueryViewerPageDataForTable,
    paging: boolean,
    totalForColumns: QueryViewerTotal,
    totalForRows: QueryViewerTotal
  ) {
    const qvInfo = this.getQueryViewerInformation(this.objectName);
    const servicesInfo = this.getServiceContext();
    const callbackWhenSuccess = (xml: string) => {
      this.pageDataForTable.emit(xml);
    };
    qvInfo.Paging = paging;
    qvInfo.PageSize = this.pageSize;
    qvInfo.TotalForRows = totalForRows;
    qvInfo.TotalForColumns = totalForColumns;
    qvInfo.ShowDataLabelsIn = this.showDataLabelsIn;

    makeRequestForTable(
      qvInfo,
      { pageData: properties },
      servicesInfo,
      "tablePageData",
      callbackWhenSuccess
    );
  }

  private getQueryViewerInformation(objectName: string): QueryViewer {
    const useRecordsetCache =
      this.type === QueryViewerOutputType.PivotTable ||
      this.type === QueryViewerOutputType.Table;

    const queryViewerObject: QueryViewer = {
      ApplicationNamespace: this.applicationNamespace,
      AllowElementsOrderChange: this.allowElementsOrderChange,
      Axes: undefined, // @todo Add Axes support
      ObjectName: objectName,
      Parameters: [], // @todo Add Parameters support
      RealType: this.type,
      RememberLayout: this.rememberLayout,
      ReturnSampleData: this.returnSampleData,
      TranslationType: this.translationType,
      UseRecordsetCache: useRecordsetCache
    };

    if (this.type === QueryViewerOutputType.Card) {
      (queryViewerObject as QueryViewerCard).IncludeTrend = this.includeTrend;

      (queryViewerObject as QueryViewerCard).IncludeSparkline =
        this.includeSparkline;
    }

    if (
      this.type === QueryViewerOutputType.PivotTable ||
      this.type === QueryViewerOutputType.Table
    ) {
      queryViewerObject.ShowDataLabelsIn = this.showDataLabelsIn;
      queryViewerObject.Paging = this.paging;
      queryViewerObject.PageSize = this.pageSize;
    }

    return queryViewerObject;
  }

  private getPropertiesMetadataAndData() {
    // In some lifecycles this variable is undefined and a couple of ms after,
    // it's defined
    if (!this.baseUrl) {
      return;
    }

    // WA to avoid requests to unimplemented outputs
    if (
      this.type !== QueryViewerOutputType.Card &&
      this.type !== QueryViewerOutputType.Chart
      //this.type !== QueryViewerOutputType.PivotTable &&
      //this.type !== QueryViewerOutputType.Table
    ) {
      return;
    }

    const queryViewerObject = this.getQueryViewerInformation(this.objectName);

    const servicesInfo = this.getServiceContext();

    const callbackWhenPivotTableSuccess = (
      actualKey: string,
      oldKey: string,
      metadata: QueryViewerServiceMetaData,
      metadataXML: string,
      queryViewerBaseProperties: QueryViewerBase
    ) => {
      this.recordSetCacheActualKey = actualKey;
      this.recordSetCacheOldKey = oldKey;

      queryViewerObject.PageSize = this.pageSize;
      queryViewerObject.Paging = this.paging;

      // Emit service response
      this.queryViewerServiceResponsePivotTable.emit({
        MetaData: metadata,
        metadataXML: metadataXML,
        Properties: queryViewerBaseProperties,
        objectName: this.objectName,
        useGxQuery: this.useGxquery
      });
    };
    if (queryViewerObject.UseRecordsetCache) {
      getPivotTableMetadata(
        queryViewerObject,
        servicesInfo,
        callbackWhenPivotTableSuccess
      );
    } else {
      getMetadataAndData(
        queryViewerObject,
        servicesInfo,
        (metadata, data, queryViewerBaseProperties) => {
          // Emit service response
          this.queryViewerServiceResponse.emit({
            MetaData: metadata,
            Data: data,
            Properties: queryViewerBaseProperties
          });
        }
      );
    }
  }

  private getServiceContext(): ServicesContext {
    return {
      actualKey: this.recordSetCacheActualKey,
      oldKey: this.recordSetCacheOldKey,
      useGXquery: this.useGxquery,
      baseUrl: this.baseUrl,
      generator: this.environment,
      metadataName: this.metadataName,
      objectName: this.objectName,
      serializedObject: this.serializedObject
    };
  }

  connectedCallback() {
    this.getPropertiesMetadataAndData();
  }

  componentWillUpdate() {
    if (this.shouldRequestData) {
      this.getPropertiesMetadataAndData();
      this.shouldRequestData = false;
    }
  }
}
