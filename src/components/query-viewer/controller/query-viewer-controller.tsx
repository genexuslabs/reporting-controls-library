import { Component, Event, EventEmitter, Prop, Watch } from "@stencil/core";

import { QueryViewer, QueryViewerCard } from "../../../services/types/json";
import {
  GeneratorType,
  QueryViewerChartType,
  QueryViewerOrientation,
  QueryViewerOutputType
} from "../../../common/basic-types";
import {
  ServicesContext,
  asyncServerCall,
  asyncGetProperties
} from "../../../services/services-manager";
import { parseMetadataXML } from "../../../services/xml-parser/metadata-parser";
import { parseDataXML } from "../../../services/xml-parser/data-parser";
import {
  QueryViewerServiceData,
  QueryViewerServiceMetaData,
  QueryViewerServiceProperties,
  QueryViewerServiceResponse
} from "../../../services/types/service-result";
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

  private propertiesCallback =
    (objectName: string) => (properties: QueryViewerServiceProperties) => {
      // When success, make an async server call for metadata
      const queryViewerObject = this.getQueryViewerInformation(objectName);
      asyncServerCall(
        queryViewerObject,
        this.ServicesContext(),
        "metadata",
        this.metaDataCallback(queryViewerObject, properties)
      );
    };

  private metaDataCallback =
    (
      queryViewerObject: QueryViewer,
      properties: QueryViewerServiceProperties
    ) =>
    (xml: string) => {
      if (!xml) {
        return;
      }

      const serviceMetaData: QueryViewerServiceMetaData = parseMetadataXML(xml);

      // When success, make an async server call for data
      asyncServerCall(
        queryViewerObject,
        this.ServicesContext(),
        "data",
        this.dataCallback(properties, serviceMetaData)
      );
    };

  private dataCallback =
    (
      properties: QueryViewerServiceProperties,
      metaData: QueryViewerServiceMetaData
    ) =>
    (xml: string) => {
      if (!xml) {
        return;
      }

      const serviceData: QueryViewerServiceData = parseDataXML(xml);

      // Emit service response
      this.queryViewerServiceResponse.emit({
        MetaData: metaData,
        Data: serviceData,
        Properties: properties
      });
    };

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

    asyncGetProperties(
      this.ServicesContext(),
      this.propertiesCallback(objectName)
    );
  }

  private ServicesContext(): ServicesContext {
    return {
      UseGXquery: this.useGxquery,
      BaseUrl: this.baseUrl,
      Generator: this.environment,
      MetadataName: this.metadataName,
      ObjectName: this.objectName,
      SerializedObject: this.serializedObject
    };
  }

  connectedCallback() {
    this.getPropertiesMetadataAndData(this.objectName);
  }
}
