/* eslint-disable @typescript-eslint/no-var-requires */
import { Component, Element, h, Host, Prop } from "@stencil/core";
import {
  QueryViewerPivotParameters,
  QueryViewerTranslations
} from "../../common/basic-types";

import { renderJSPivot } from "jspivottable";

@Component({
  tag: "gx-query-viewer-pivot",
  styleUrl: "query-viewer-pivot.scss",
  shadow: true
})
export class QueryViewerPivot {
  @Element() el: HTMLGxQueryViewerPivotElement;

  /**
   * A CSS class to set as the `gx-query-viewer-pivot-controller` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * For translate the labels of the outputs
   */
  @Prop() readonly translations: QueryViewerTranslations;

  /**
   * Specifies the parameters that the pivot need to render.
   */
  @Prop() readonly pivotParameters: QueryViewerPivotParameters;

  /**
   * Specifies the collections that the pivot need to render.
   */
  @Prop() readonly pivotCollections: any = {};

  /**
   * Ver si es necesario.
   */
  @Prop() readonly qViewer: any = {};

  render() {
    return (
      <Host role="article">
        {renderJSPivot(
          this.pivotParameters,
          this.pivotCollections,
          this.translations,
          this.qViewer
        )}
      </Host>
    );
  }
}
