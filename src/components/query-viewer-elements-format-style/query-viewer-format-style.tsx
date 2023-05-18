import { Component, Event, EventEmitter, Prop } from "@stencil/core";

@Component({
  tag: "gx-query-viewer-format-style",
  shadow: false
})
export class QueryViewerFormatStyle {
  /**
   * Type of the element Conditional or Format
   */
  @Prop() readonly type: "Values" | "Conditional";

  /**
   * If Conditional Value to format
   */
  @Prop() readonly value: string;

  /**
   * If Conditional true for applying to row or column
   */
  @Prop() readonly applyToRowOrColumn: boolean;

  /**
   * Style or Css class
   */
  @Prop() readonly styleOrClass: string;

  /**
   * If Format the operator of the element
   */
  @Prop() readonly operator: "EQ" | "LT" | "GT" | "LE" | "GE" | "NE" | "IN";

  /**
   * If format first value
   */
  @Prop() readonly value1: string;

  /**
   * If format second value
   */
  @Prop() readonly value2: string;

  /**
   * Fired each time the properties of the control changes
   */
  @Event() elementChanged: EventEmitter;

  componentDidUpdate() {
    this.elementChanged.emit();
  }
}
