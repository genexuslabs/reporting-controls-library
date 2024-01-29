import { Component, Element, Host, Prop, State, Watch, h } from "@stencil/core";

import { parseDataXML } from "../../../services/xml-parser/data-parser";
import { parseMetadataXML } from "../../../services/xml-parser/metadata-parser";
import {
  GeneratorType,
  QueryViewerBase,
  QueryViewerOutputType,
  QueryViewerTrendPeriod
} from "../../../common/basic-types";
import {
  QueryViewerServiceData,
  QueryViewerServiceMetaData
} from "../../../services/types/service-result";
import { Component as GxComponent } from "../../../common/interfaces";

enum MissionOuputType {
  Missing = "missing"
}

type QueryResponseOutputType = QueryViewerOutputType | MissionOuputType;

@Component({
  tag: "gx-query-render",
  styleUrl: "query-render.scss",
  shadow: true
})
export class GxQueryRender implements GxComponent {
  @Element() element: HTMLGxQueryRenderElement;

  @State() loading = false;
  @State() serviceData: QueryViewerServiceData;
  @State() serviceMetadata: QueryViewerServiceMetaData;

  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop() readonly metadataName = process.env.GENEXUS_METADATA_NAME;
  /**
   * Base URL of the server
   */
  @Prop() readonly baseUrl = process.env.GENEXUS_QUERY_URL;
  /**
   * Environment of the project: java or net
   */
  @Prop() readonly environment: GeneratorType = "net";
  /**
   * True to tell the controller to connect use GXquery as a queries repository
   */
  @Prop() readonly useGxquery = true;
  /**
   * Provide the Query properties
   */
  @Prop() readonly query: QueryViewerBase;
  /**
   * Data for query viewer
   */
  @Prop() readonly data: QueryViewerServiceData | string;
  /**
   * Metadata for query viewer
   */
  @Prop() readonly metadata: QueryViewerServiceMetaData | string;
  /**
   *
   */
  @Prop() readonly noDataLabel = "No Data";
  /**
   *
   */
  @Prop() readonly fetchingDataLabel = "Fetching data";

  @Watch("query")
  watchQuery(newValue: QueryViewerBase | null) {
    this.loading = !!newValue;
  }

  @Watch("data")
  watchData(newValue: typeof this.data) {
    this.serviceData =
      typeof newValue === "string" ? parseDataXML(newValue) : newValue;
  }

  @Watch("metadata")
  watchMetadata(newValue: typeof this.metadata) {
    this.serviceMetadata =
      typeof newValue === "string" ? parseMetadataXML(newValue) : newValue;
  }

  @Watch("serviceMetadata")
  @Watch("serviceData")
  completeServiceData() {
    if (!!this.serviceData && !!this.serviceMetadata) {
      this.loading = false;
    }
  }

  /**
   * Render message unimplemented query
   * @returns HTMLDivElement
   */
  private notImplementedRender() {
    const { outputType, name } = this.query;
    return <div>{`Graph ${outputType} is not implemented (${name})`}</div>;
  }

  /**
   * Render when query couldn't be rendered
   * @returns HTMLDivElement
   */
  private missingDataRender() {
    return (
      <div class="message" part="message-nodata">
        {this.noDataLabel}
      </div>
    );
  }
  /**
   * Render
   * @returns HTMLDivElement
   */
  private fetchingDataRender() {
    return (
      <div class="message" part="message-fetching">
        {this.fetchingDataLabel}
      </div>
    );
  }

  /**
   * Render QueryViewer component
   * @returns HTMLGxQueryViewerElement
   */
  private implementedRender = (query: QueryViewerBase) =>
    !!this.serviceData && !!this.serviceMetadata ? (
      <gx-query-viewer
        queryTitle={query.title}
        type={query.outputType}
        chartType={query.chartType}
        includeSparkline={query.includeSparkline}
        includeTrend={query.includeTrend}
        includeMaxMin={query.includeMaxAndMin}
        trendPeriod={"SinceTheBeginning" as QueryViewerTrendPeriod}
        showDataAs={query.showDataAs}
        orientation={query.orientation}
        plotSeries={query.plotSeries}
        showDataLabelsIn={query.showDataLabelsIn}
        xAxisIntersectionAtZero={query.xAxisIntersectionAtZero}
        xAxisLabels={query.xAxisLabels}
        xAxisTitle={query.xAxisTitle}
        yAxisTitle={query.yAxisTitle}
        serviceResponse={{
          Data: this.serviceData,
          MetaData: this.serviceMetadata,
          Properties: this.query
        }}
      ></gx-query-viewer>
    ) : (
      this.fetchingDataRender()
    );

  private rendersDictionary: {
    [key in QueryResponseOutputType]: (
      query: QueryViewerBase
    ) => HTMLDivElement | HTMLGxQueryViewerElement;
  } = {
    [QueryViewerOutputType.Card]: query => this.implementedRender(query),
    [QueryViewerOutputType.Chart]: query => this.implementedRender(query),
    [QueryViewerOutputType.Map]: () => this.notImplementedRender(),
    [QueryViewerOutputType.PivotTable]: () => this.notImplementedRender(),
    [QueryViewerOutputType.Table]: () => this.notImplementedRender(),
    [QueryViewerOutputType.Default]: () => this.notImplementedRender(),

    [MissionOuputType.Missing]: () => this.missingDataRender()
  };

  render() {
    return (
      <Host>
        <div class="wrapper" part="wrapper">
          <div>
            {
              <slot name="spinner">
                <gx-loading presented={this.loading}></gx-loading>
              </slot>
            }
            {this.rendersDictionary[
              this.query?.outputType || MissionOuputType.Missing
            ](this.query)}
          </div>
        </div>
      </Host>
    );
  }
}
