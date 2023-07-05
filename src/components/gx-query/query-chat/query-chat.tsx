import { Component, Element, Host, Prop, Watch, h } from "@stencil/core";

import { Component as GxComponent } from "../../../common/interfaces";

export type QueryChatItem = {
  content: string;
  messageType: "user" | "assistant";
};

const PART_PREFIX = "query-chat__";

@Component({
  tag: "gx-query-chat",
  styleUrl: "query-chat.scss",
  shadow: true
})
export class QueryChat implements GxComponent {
  private itemsCount = 0;

  @Element() element: HTMLGxQueryChatElement;

  /**
   * This property specifies the items of the chat.
   */
  @Prop() readonly items: QueryChatItem[];
  @Watch("items")
  handleItemsChange(newValue: QueryChatItem[]) {
    this.itemsCount = newValue.length;
  }

  render() {
    return (
      <Host>
        <gx-grid-smart-css direction="vertical">
          {this.items && (
            <div slot="grid-content">
              {this.items.map(({ content, messageType }) => (
                <gx-grid-smart-cell>
                  <div class="cell" part={`${PART_PREFIX}${messageType}`}>
                    <gx-image
                      auto-grow="false"
                      alt=""
                      src="https://www.genexus.com/media/images/genexusbyglobant_large.svg?timestamp=20220921163437"
                    ></gx-image>

                    <gx-textblock
                      format="HTML"
                      innerHTML={content}
                    ></gx-textblock>
                  </div>
                </gx-grid-smart-cell>
              ))}

              <gx-grid-smart-cell>
                <div class="cell--last" part={`${PART_PREFIX}info`}>
                  <gx-button>Regenerate answer</gx-button>
                </div>
              </gx-grid-smart-cell>

              <gx-grid-infinite-scroll
                position="top"
                record-count={this.itemsCount}
              ></gx-grid-infinite-scroll>
            </div>
          )}
        </gx-grid-smart-css>
      </Host>
    );
  }
}
