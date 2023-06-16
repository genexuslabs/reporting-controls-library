import { Component, Event, EventEmitter, Prop } from "@stencil/core";

import { QueryViewer, QueryViewerCard } from "../../../services/types/json";
import {
  GeneratorType,
  QueryViewerChartType,
  QueryViewerOrientation,
  QueryViewerOutputType
} from "../../../common/basic-types";
import { asyncServerCall } from "../../../services/services-manager";
import { parseMetadataXML } from "../../../services/xml-parser/metadata-parser";
import { parseDataXML } from "../../../services/xml-parser/data-parser";
import {
  QueryViewerServiceData,
  QueryViewerServiceMetaData,
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
   * Fired when new metadata and data is fetched
   */
  @Event() queryViewerServiceResponse: EventEmitter<QueryViewerServiceResponse>;

  private getQueryViewerInformation(): QueryViewer {
    const queryViewerObject: QueryViewer = {
      ApplicationNamespace: this.applicationNamespace,
      AllowElementsOrderChange: this.allowElementsOrderChange,
      Axes: undefined, // @todo Add Axes support
      ObjectName: this.objectName,
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

      (queryViewerObject as QueryViewerCard)["Orientation"] = this.orientation;
    }

    return queryViewerObject;
  }

  private metaDataCallback =
    (queryViewerObject: QueryViewer) => (xml: string) => {
      if (!xml) {
        return;
      }

      const serviceMetaData: QueryViewerServiceMetaData = parseMetadataXML(xml);

      // When success, make an async server call for data
      asyncServerCall(
        queryViewerObject,
        this.baseUrl,
        this.environment,
        "data",
        this.dataCallback(serviceMetaData)
      );
    };

  private dataCallback =
    (metaData: QueryViewerServiceMetaData) => (xml: string) => {
      if (!xml) {
        return;
      }

      const serviceData: QueryViewerServiceData = parseDataXML(xml);

      // Emit service response
      this.queryViewerServiceResponse.emit({
        MetaData: metaData,
        Data: serviceData
      });
    };

  connectedCallback() {
    // In some lifecycles this variable is undefined and a couple of ms after,
    // it's defined
    if (!this.baseUrl) {
      return;
    }

    // WA to avoid requests to unimplemented outputs
    if (this.type !== QueryViewerOutputType.Card) {
      return;
    }

    const queryViewerObject = this.getQueryViewerInformation();

    asyncServerCall(
      queryViewerObject,
      this.baseUrl,
      this.environment,
      "metadata",
      this.metaDataCallback(queryViewerObject)
    );
  }
}
