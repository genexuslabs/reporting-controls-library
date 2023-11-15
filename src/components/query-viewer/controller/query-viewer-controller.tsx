import { Component, Event, EventEmitter, Prop, Watch } from "@stencil/core";

import {
  ServicesContext,
  getMetadataAndData
} from "@genexus/reporting-api/dist";
import {
  GeneratorType,
  QueryViewerChartType,
  QueryViewerOrientation,
  QueryViewerOutputType
} from "@genexus/reporting-api/dist/types/basic-types";
import { QueryViewer, QueryViewerCard } from "@genexus/reporting-api/dist/types/json";
import { QueryViewerServiceResponse } from "@genexus/reporting-api/dist/types/service-result";
@Component({
  tag: "gx-query-viewer-controller",
  shadow: false
})
export class QueryViewerController {
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
  watchPropHandler(newValue: string) {
    this.getPropertiesMetadataAndData(newValue);
  }

  /**
   * Include spark line
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
   * For timeline for remembering layout
   */
  @Prop() readonly rememberLayout: boolean = true;

  /**
   * @todo Add description
   */
  @Prop() readonly returnSampleData: boolean = false;

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
   * Fired when new metadata and data is fetched
   */
  @Event() queryViewerServiceResponse: EventEmitter<QueryViewerServiceResponse>;

  private getQueryViewerInformation(objectName: string): QueryViewer {
    const queryViewerObject: QueryViewer = {
      ApplicationNamespace: this.applicationNamespace,
      AllowElementsOrderChange: this.allowElementsOrderChange,
      Axes: undefined, // @todo Add Axes support
      ObjectName: objectName,
      Parameters: [], // @todo Add Parameters support
      RealType: this.type,
      ReturnSampleData: this.returnSampleData,
      TranslationType: this.translationType,
      UseRecordsetCache:
        this.type === QueryViewerOutputType.PivotTable ||
        this.type === QueryViewerOutputType.Table
    };

    if (this.type === QueryViewerOutputType.Card) {
      (queryViewerObject as QueryViewerCard)["IncludeTrend"] =
        this.includeTrend;

      (queryViewerObject as QueryViewerCard)["IncludeSparkline"] =
        this.includeSparkline;
    }

    return queryViewerObject;
  }

  private getPropertiesMetadataAndData(objectName: string) {
    // In some lifecycles this variable is undefined and a couple of ms after,
    // it's defined
    if (!this.baseUrl) {
      return;
    }

    // WA to avoid requests to unimplemented outputs
    if (
      this.type !== QueryViewerOutputType.Card &&
      this.type !== QueryViewerOutputType.Chart
    ) {
      return;
    }

    const queryViewerObject = this.getQueryViewerInformation(objectName);
    const servicesInfo: ServicesContext = {
      useGXquery: this.useGxquery,
      baseUrl: this.baseUrl,
      generator: this.environment,
      metadataName: this.metadataName,
      objectName: this.objectName,
      serializedObject: this.serializedObject
    };

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

  connectedCallback() {
    this.getPropertiesMetadataAndData(this.objectName);
  }
}
