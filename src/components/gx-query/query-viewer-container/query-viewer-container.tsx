import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";
import {
  GeneratorType,
  GxCommonErrorResponse,
  GxQueryItem,
  GxQueryOptions
} from "../../../common/basic-types";
import { transformGxQueryItemToQVProperties } from "../../../services/query-transformations";
import {
  ServicesContext,
  asyncGetProperties,
  asyncUpdateQuery
} from "../../../services/services-manager";
import { QueryViewerServiceProperties } from "../../../services/types/service-result";

const PART_PREFIX = "query-viewer__";

enum QVStatus {
  none,
  init,
  pending,
  failed,
  complete
}

@Component({
  tag: "gx-query-viewer-container",
  styleUrl: "query-viewer-container.scss",
  shadow: true,
  assetsDirs: ["assets"]
})
export class QueryViewerContainer {
  private menuList: HTMLDivElement;
  private openMenu = false;

  @Element() element: HTMLGxQueryViewerContainerElement;

  /**
   * This property specifies the title
   */
  @Prop() readonly mainTitle: string;
  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop() readonly metadataName = process.env.METADATA_NAME;
  /**
   * Base URL
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
   * Name of the Query or Data provider assigned
   */
  @State() objectName: string;
  /**
   * This specifies the query id
   */
  @State() query: GxQueryItem;
  /**
   * This specifies the query properties
   */
  @State() queryProperties: QueryViewerServiceProperties;
  /**
   * Disabled button actions
   */
  @State() disabledActions = true;
  /**
   * Query viewer status
   */
  @State() queryViewerStatus: QVStatus = QVStatus.none;
  /**
   * Query viewer error message
   */
  @State() queryViewerErrorDescription = "";
  /**
   * Loading status
   */
  @State() loading = false;
  /**
   *
   */
  @Event({ composed: true })
  gxQuerySaveQuery: EventEmitter<GxQueryItem>;

  @Watch("queryViewerStatus")
  changeQueryViewerStatus(newValue: QVStatus) {
    switch (newValue) {
      case QVStatus.init:
        this.disabledActions = true;
        this.loading = true;
        break;
      case QVStatus.pending:
        this.disabledActions = true;
        this.loading = true;
        break;
      case QVStatus.complete:
        this.disabledActions = false;
        this.loading = false;
        break;
      default:
        this.disabledActions = false;
        this.loading = false;
        break;
    }
  }

  @Listen("gxQuerySelect", { target: "window" })
  selectQuery(event: CustomEvent<GxQueryItem>) {
    console.log("Select Query");
    // Avoid apply query already selected
    if (event.detail?.Id === this.query?.Id) {
      return;
    }

    this.query = event.detail;
    this.queryViewerStatus = QVStatus.init;
    if (this.query.ChartType === "") {
      console.log("Chart type defined");
      const context = this.getContext(this.query.Name);
      asyncGetProperties(context, this.callbackQueryProperties);
    } else {
      console.log("Fetch properties");
      const properties = transformGxQueryItemToQVProperties(this.query);
      this.callbackQueryProperties(properties);
    }
  }

  @Listen("gxQueryNewChat", { target: "window" })
  createNewChat() {
    this.query = null;
    this.queryViewerStatus = QVStatus.none;
  }

  @Listen("queryViewerServiceResponse", { target: "window" })
  queryViewerServiceResponse() {
    console.log("queryViewerServiceResponse");
    this.queryViewerStatus = QVStatus.complete;
  }

  @Listen("queryViewerErrorResponse", { target: "window" })
  queryViewerErrorResponse(event: CustomEvent<string>) {
    console.log("queryViewerErrorResponse", event.detail);
    this.queryViewerStatus = QVStatus.failed;
    this.queryViewerErrorDescription = event.detail;
  }

  private callbackQueryProperties = (
    properties: QueryViewerServiceProperties
  ) => {
    this.queryProperties = properties;
    this.queryViewerStatus = QVStatus.pending;
  };

  private updateCallback = (response: GxCommonErrorResponse) => {
    if (response.Errors.length > 0) {
      console.error(response.Errors);
      this.queryViewerStatus = QVStatus.failed;
    } else {
      this.gxQuerySaveQuery.emit(this.query);
    }
    this.disabledActions = !this.query;
  };

  private handleSave = () => {
    if (!this.disabledActions) {
      const options = this.queryOptions();
      asyncUpdateQuery(
        options,
        this.query,
        this.queryProperties,
        this.updateCallback
      );
    }
  };

  private handleExport = (format: string) => {
    console.log(`Export Query as ${format}`);
    this.menuList.classList.remove("active");
  };

  private toggleMenu = () => {
    this.menuList.classList.toggle("active");
    this.openMenu = this.menuList.classList.contains("active");
  };

  private queryOptions(): GxQueryOptions {
    return {
      baseUrl: this.baseUrl,
      metadataName: this.metadataName
    };
  }

  private getContext(
    objectName: string,
    serializedObject = ""
  ): ServicesContext {
    return {
      useGXquery: this.useGxquery,
      baseUrl: this.baseUrl,
      generator: this.environment,
      metadataName: this.metadataName,
      serializedObject,
      objectName
    };
  }

  /**
   * Render QueryViewer component
   * @returns HTMLGxQueryViewerElement
   */
  private renderQueryViewer = () => {
    console.log("renderQueryViewer", this.queryViewerStatus);
    if (
      [QVStatus.pending, QVStatus.complete].includes(this.queryViewerStatus)
    ) {
      return (
        <div>
          <gx-query-viewer type={this.queryProperties.Type}>
            <gx-query-viewer-controller
              base-url={this.baseUrl}
              chart-type={this.queryProperties.ChartType}
              include-max-min={this.queryProperties.IncludeMaxMin}
              include-sparkline={this.queryProperties.IncludeSparkline}
              include-trend={this.queryProperties.IncludeTrend}
              metadata-name={this.metadataName}
              object-name={this.queryProperties.Name}
              orientation={this.queryProperties.Orientation}
              plot-series={this.queryProperties.PlotSeries}
              query-title={this.queryProperties.QueryTitle}
              show-data-as={this.queryProperties.ShowDataAs}
              show-data-labels-in={this.queryProperties.ShowDataLabelsIn}
              type={this.queryProperties.Type}
              use-gxquery={this.useGxquery}
              x-axis-intersection-at-zero={
                this.queryProperties.XAxisIntersectionAtZero
              }
              x-axis-labels={this.queryProperties.XAxisLabels}
              x-axis-title={this.queryProperties.XAxisTitle}
              y-axis-title={this.queryProperties.YAxisTitle}
            ></gx-query-viewer-controller>
          </gx-query-viewer>
        </div>
      );
    }

    return <div></div>;
  };

  /**
   *
   * @returns HTMLDivElement
   */
  private renderQueryViewerStatus = () => {
    let message: HTMLDivElement;
    switch (this.queryViewerStatus) {
      case QVStatus.none:
        message = (
          <div class="viewer-message viewer-message--none">no graph</div>
        );
        break;

      case QVStatus.init:
        message = (
          <div class="viewer-message viewer-message--init">query selected</div>
        );
        break;

      case QVStatus.failed:
        message = (
          <div class="viewer-message viewer-message--danger">
            Error: {this.queryViewerErrorDescription}
          </div>
        );
        break;

      case QVStatus.pending:
        message = (
          <div class="viewer-message viewer-message--pending">
            building ({this.queryProperties.Type})...
          </div>
        );
        break;
    }

    return message;
  };

  render() {
    return (
      <Host>
        <div part={`${PART_PREFIX}wrap`}>
          {this.loading && (
            <div class="loading-backdrop">
              <gx-loading presented={this.loading}></gx-loading>
            </div>
          )}

          <header part={`${PART_PREFIX}header`}>
            {this.mainTitle && (
              <h1 part={`${PART_PREFIX}title`}>{this.mainTitle}</h1>
            )}
            <nav part={`${PART_PREFIX}controls`}>
              <div class="dropdown" ref={el => (this.menuList = el)}>
                <button
                  aria-expanded={this.openMenu ? "true" : "false"}
                  aria-haspopup="true"
                  class="control-item"
                  data-toggle="dropdown"
                  id="dropdownMenuButton"
                  onClick={this.toggleMenu}
                  type="button"
                >
                  EXPORT
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li class="">
                    <button
                      class="dropdown-menu__item dropdown-menu__item--jpg"
                      type="button"
                      onClick={() => this.handleExport("img")}
                      disabled={this.disabledActions}
                    >
                      Export as JPG
                    </button>
                  </li>
                  <li class="">
                    <button
                      class="dropdown-menu__item dropdown-menu__item--pdf"
                      type="button"
                      onClick={() => this.handleExport("pdf")}
                      disabled={this.disabledActions}
                    >
                      Export as PDF
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <button
                  class="control-item"
                  disabled={this.disabledActions}
                  id="saveButton"
                  onClick={this.handleSave}
                  type="button"
                >
                  SAVE
                </button>
              </div>
            </nav>
          </header>

          <div class="viewer">
            {this.renderQueryViewer()}
            {this.renderQueryViewerStatus()}
          </div>
        </div>
      </Host>
    );
  }
}
