import {
  Component,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  State,
  h
} from "@stencil/core";
import { GxQueryItem, GxQueryOptions } from "../../../common/basic-types";
import { asyncUpdateQuery } from "../../../services/services-manager";

const PART_PREFIX = "query-viewer__";

@Component({
  tag: "gx-query-viewer-container",
  styleUrl: "query-viewer-container.scss",
  shadow: true
})
export class QueryViewerContainer {
  /**
   * This property specifies the items of the chat.
   */
  @Prop() readonly mainTitle: string;
  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop({ reflect: true }) readonly metadataName = process.env.METADATA_NAME;
  /**
   * This specifies the query id
   */
  @State() queryId: string;
  /**
   * This specifies the query id
   */
  @State() query: GxQueryItem;
  /**
   * Disabled button actions
   */
  @State() disabledActions = true;
  /**
   *
   */
  @Event({ composed: true })
  gxQuerySaveQuery: EventEmitter<GxQueryItem>;

  @Listen("gxQuerySelect", { target: "window" })
  selectQuery(event: CustomEvent<GxQueryItem>) {
    this.queryId = event.detail.Id;
    this.query = event.detail;
    this.disabledActions = false;
  }

  @Listen("gxQueryNewChat", { target: "window" })
  createNewChat() {
    this.queryId = "new query";
    this.disabledActions = true;
  }

  private updateCallback = (response: unknown) => {
    console.log(response);
    this.gxQuerySaveQuery.emit(this.query);
  };

  private handleSave = () => {
    console.log("Save Query");
    if (!this.disabledActions) {
      const options = this.queryOptions();
      asyncUpdateQuery(options, this.query, this.updateCallback);
    }
  };

  private handleExport = () => {
    console.log("Export Query");
  };

  private queryOptions(): GxQueryOptions {
    return {
      baseUrl: process.env.BASE_URL,
      metadataName: this.metadataName
    };
  }

  render() {
    return (
      <Host>
        <header part={`${PART_PREFIX}header`}>
          {this.mainTitle && (
            <h1 part={`${PART_PREFIX}title`}>{this.mainTitle}</h1>
          )}
          <nav part={`${PART_PREFIX}controls`}>
            <gx-button
              onClick={this.handleExport}
              disabled={this.disabledActions}
              caption="EXPORT"
            ></gx-button>
            <gx-button
              onClick={this.handleSave}
              disabled={this.disabledActions}
              caption="SAVE"
            ></gx-button>
          </nav>
        </header>

        <p class="subtile">{!!this.queryId && `Query Id: ${this.queryId}`}</p>

        <div class="viewer"></div>
      </Host>
    );
  }
}
