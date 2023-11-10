import { Component, Element, Host, Prop, State, h } from "@stencil/core";

// import { asyncGetQueryProperties } from "reporting-controls-api/dist/services-manager";
import { QueryViewerTrendPeriod } from "@genexus/reporting-controls-api";
import { parseDataXML, parseMetadataXML } from "@genexus/reporting-controls-api/dist";
import { QueryViewerServiceData, QueryViewerServiceMetaData, QueryViewerServiceResponse } from "@genexus/reporting-controls-api/dist/types/service-result";
import { GeneratorType, QueryViewerBase, QueryViewerOutputType } from "../../../common/basic-types";
import { Component as GxComponent } from "../../../common/interfaces";

enum MissionOuputType {
  Missing = "missing"
}

// type SerializedObject = {
//   Id: string;
//   Title: string;
//   ChartType: QueryViewerChartType;
//   ShowValues: boolean;
// };

type QueryResponseOutputType = QueryViewerOutputType | MissionOuputType;

@Component({
  tag: "gx-query-render",
  styleUrl: "query-render.scss",
  shadow: true
})
export class GxQueryRender implements GxComponent {

  @Element() element: HTMLGxQueryRenderElement;

  @State() loading = true;
  @State() serviceResponse: QueryViewerServiceResponse = {
    Data: null,
    MetaData: null,
    Properties: null
  };

  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop() readonly metadataName = process.env.METADATA_NAME;
  /**
   * Base URL of the server
   */
  @Prop() readonly baseUrl = process.env.BASE_URL;
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
   * Data of
   */
  @Prop() readonly data: QueryViewerServiceData | string;
  /**
   * Data of
   */
  @Prop() readonly metadata: QueryViewerServiceMetaData | string; // QueryViewerServiceMetaData
  // serviceResponseMetadata: QueryViewerServiceMetaData,

  componentWillLoad(): void {
    this.loading = false;
    this.makeServiceResponse();
  }

  private makeServiceResponse = () => {
    this.serviceResponse = {
      Data: (typeof this.data === "string") ? parseDataXML(this.data): this.data,
      MetaData: (typeof this.metadata === "string") ? parseMetadataXML(this.metadata): this.metadata,
      Properties: this.query
    }
  }

  /**
   * Render message unimplemented query
   * @returns HTMLDivElement
   */
  private notImplementedRender() {
    const { OutputType, Name } = this.query;
    return (<div>
      <span>{`Graph ${OutputType} is not implemented (${Name})`}</span>
    </div>);
  }

  /**
   * Render when query couldn't be rendered
   * @returns HTMLDivElement
   */
  private missingDataRender() {
    return (<div>
      <span>No data</span>
    </div>);
  }

  /**
   * Render QueryViewer component
   * @returns HTMLGxQueryViewerElement
   */
  private implementedRender = (query: QueryViewerBase) => (
    <gx-query-viewer
      queryTitle={query.Title}
      type={query.OutputType}
      chartType={query.ChartType}
      includeSparkline={query.IncludeSparkline}
      includeTrend={query.IncludeTrend}
      includeMaxMin={query.IncludeMaxAndMin}
      trendPeriod={'SinceTheBeginning' as QueryViewerTrendPeriod}
      showDataAs={query.ShowDataAs}
      orientation={query.Orientation}
      plotSeries={query.PlotSeries}
      showDataLabelsIn={query.ShowDataLabelsIn}
      xAxisIntersectionAtZero={query.XAxisIntersectionAtZero}
      xAxisLabels={query.XAxisLabels}
      xAxisTitle={query.XAxisTitle}
      yAxisTitle={query.YAxisTitle}
      serviceResponse={this.serviceResponse}
    >
    </gx-query-viewer>
  );


  private rendersDictionary: {
    [key in QueryResponseOutputType]: (query: QueryViewerBase) => HTMLDivElement | HTMLGxQueryViewerElement;
  } = {
    [QueryViewerOutputType.Card]: (query) => this.implementedRender(query),
    [QueryViewerOutputType.Chart]: (query) => this.implementedRender(query),
    [QueryViewerOutputType.Map]: () => this.notImplementedRender(),
    [QueryViewerOutputType.PivotTable]: () => this.notImplementedRender(),
    [QueryViewerOutputType.Table]: () => this.notImplementedRender(),
    [QueryViewerOutputType.Default]: () => this.notImplementedRender(),

    [MissionOuputType.Missing]: () => this.missingDataRender()
  };

  render() {
    return (
      <Host>
        {
          this.loading
            ? <slot name="loading"><gx-loading presented={this.loading}></gx-loading></slot>
            : this.rendersDictionary[this.query?.OutputType || MissionOuputType.Missing](this.query)
        }
      </Host>
    );
  }
}
