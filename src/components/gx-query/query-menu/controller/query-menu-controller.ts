import { Component, Prop } from "@stencil/core";
import {
  GeneratorType,
  GxQueryListResponse,
  GxQueryOptions
} from "../../../../common/basic-types";

@Component({
  tag: "gx-query-menu-controller",
  shadow: false
})
export class QueryMenuController {
  /**
   * Base URL of the server
   */
  @Prop() readonly baseUrl: string;
  /**
   * Environment of the project: java or net
   */
  @Prop() readonly environment: GeneratorType;
  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop() readonly metadataName: string;
  /**
   * True to tell the controller to connect use GXquery as a queries repository
   */
  @Prop() readonly useGxquery: boolean;

  connectedCallback() {
    // const options = this.queryOptions();
    // asyncGetListQuery(options, this.listQueriesCallback);
  }

  private queryOptions(): GxQueryOptions {
    return {
      baseUrl: this.baseUrl,
      metadataName: this.metadataName
    };
  }

  private listQueriesCallback = (data: GxQueryListResponse) => {
    const { Errors, Queries } = data;
    console.log(Queries, Errors);
  };
}
