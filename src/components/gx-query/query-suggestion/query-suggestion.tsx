import { Component, Event, EventEmitter, Host, Prop, h } from "@stencil/core";

@Component({
  tag: "gx-query-suggestion",
  styleUrl: "query-suggestion.css",
  shadow: true
})
export class QuerySuggestion {
  /**
   * Declare the header of the component
   */
  @Prop() readonly header: string = "Suggested queries:";
  /**
   * Declare the list of items to display
   */
  @Prop() readonly items: string[] = [];
  /**
   * Emitted when the option is selected.
   */
  @Event() gxSuggestionSelect: EventEmitter<string>;

  private handleSelect = async (item: string) => {
    this.gxSuggestionSelect.emit(item);
  };

  render() {
    return (
      <Host style={{ display: this.items.length === 0 ? "none" : "block" }}>
        <h3>{this.header}</h3>
        <ul role="list" aria-label="Suggestions list">
          {this.items.map((item, index) => (
            <li
              key={`suggestion${index}`}
              role="listitem"
              onClick={() => this.handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </Host>
    );
  }
}
