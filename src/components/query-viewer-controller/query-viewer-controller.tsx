import { Component, Event, EventEmitter, Prop } from "@stencil/core";
import { QueryViewer, QueryViewerCard } from "../../services/types/json";
import { GeneratorType, QueryViewerOutputType } from "../../common/basic-types";
import { asyncServerCall } from "../../services/services-manager";
import { parseMetadataXML } from "../../services/xml-parser/metadata-parser";
import { parseDataXML } from "../../services/xml-parser/data-parser";
import {
  QueryViewerServiceData,
  QueryViewerServiceMetaData
} from "../../services/types/service-result";

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
  @Prop() readonly chartType:
    | "Column"
    | "Column3D"
    | "StackedColumn"
    | "StackedColumn3D"
    | "StackedColumn100"
    | "Bar"
    | "StackedBar"
    | "StackedBar100"
    | "Area"
    | "StackedArea"
    | "StackedArea100"
    | "SmoothArea"
    | "StepArea"
    | "Line"
    | "StackedLine"
    | "StackedLine100"
    | "SmoothLine"
    | "StepLine"
    | "Pie"
    | "Pie3D"
    | "Doughnut"
    | "Doughnut3D"
    | "LinearGauge"
    | "CircularGauge"
    | "Radar"
    | "FilledRadar"
    | "PolarArea"
    | "Funnel"
    | "Pyramid"
    | "ColumnLine"
    | "Column3DLine"
    | "Timeline"
    | "SmoothTimeline"
    | "StepTimeline"
    | "Sparkline";

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
  @Prop() readonly translationType: string = "None";

  /**
   * Type of the QueryViewer: Table, PivotTable, Chart, Card
   */
  @Prop() readonly type: QueryViewerOutputType;

  /**
   * Fired when new metadata is fetched
   */
  @Event() queryViewerMetadata: EventEmitter<QueryViewerServiceMetaData>;

  /**
   * Fired when new data is fetched
   */
  @Event() queryViewerData: EventEmitter<QueryViewerServiceData>;

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
    }

    return queryViewerObject;
  }

  private metaDataCallback =
    (queryViewerObject: QueryViewer) => (xml: string) => {
      if (!xml) {
        return;
      }

      const serviceMetaData: QueryViewerServiceMetaData = parseMetadataXML(xml);
      this.queryViewerMetadata.emit(serviceMetaData);

      // When success, make an async server call for data
      asyncServerCall(
        queryViewerObject,
        this.baseUrl,
        this.environment,
        "data",
        this.dataCallback
      );
    };

  private dataCallback = (xml: string) => {
    if (!xml) {
      return;
    }

    const serviceData: QueryViewerServiceData = parseDataXML(xml);
    this.queryViewerData.emit(serviceData);
  };

  componentWillLoad() {
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
