import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  State,
  getAssetPath,
  h
} from "@stencil/core";

import {
  GxChatMessage,
  GxChatMessageResponse,
  GxQueryItem,
  GxQueryOptions
} from "../../../common/basic-types";
import { Component as GxComponent } from "../../../common/interfaces";
import { KEY_CODES } from "../../../common/reserverd-names";
import { asyncNewChatMessage } from "../../../services/services-manager";


export type QueryRequest = {
  message: string;
};

const PART_PREFIX = "query-chat__";

@Component({
  tag: "gx-query-chat",
  styleUrl: "query-chat.scss",
  shadow: true,
  assetsDirs: ["assets"]
})
export class QueryChat implements GxComponent {
  private inputElement!: HTMLGxEditElement;
  private hasTriggerButton: boolean;

  @Element() element: HTMLGxQueryChatElement;

  @State() waitingResponse = false;
  @State() showRegenerate = false;
  @State() lastQuestion = "";
  @State() queryItems: GxChatMessage[] = [];
  @State() suggested: string[] = [];

  /**
   * This property specifies the items of the chat.
   */
  @Prop() readonly mainTitle: string;
  /**
   * Text that appears in the input control when it has no value set
   */
  @Prop() readonly placeholder: string = "Ask me question";
  /**
   * Determines if the menu can be unlocked or minimize
   */
  @Prop() readonly resizewindow: boolean = true;
  /**
   * Determines if the menu is unlocked
   */
  @Prop({ reflect: true, mutable: true }) isUnlocked = false;
  /**
   * Determines if the menu is minimized
   */
  @Prop({ reflect: true, mutable: true }) isMinimized = false;
  /**
   * Specify the size of the icon messages. ex 50px
   */
  @Prop({ reflect: true, mutable: true }) messageIconSize = "50px";
  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop() readonly metadataName = "ReportingShowcase";

  /**
   * Fired each time the user make a question
   */
  @Event({ bubbles: true, composed: true })
  queryChatRequest: EventEmitter<QueryRequest>;

  /**
   * Fired when receive a question answer
   */
  @Event({ bubbles: true, composed: true, cancelable: false })
  gxQuerySelect: EventEmitter<GxQueryItem>;

  /**
   * Reset chat when QueryId was trigger by another component
   * @param event query item selected
   */
  @Listen("gxQuerySelect", { target: "window" })
  checkQuerySelect(event: CustomEvent<GxQueryItem>) {
    const lastQuery = this.queryItems.length - 1;
    const chatItemId = lastQuery > 0 ? this.queryItems[lastQuery].id : "";
    if (chatItemId !== event.detail.Id) {
      this.resetChat(true);
    }
  }

  /**
   * Create a new chat
   */
  @Listen("gxQueryNewChat", { target: "window" })
  newChat() {
    this.resetChat(true);
  }

  componentWillLoad() {
    const trigger = this.element.querySelector("[slot='trigger-content']");
    this.hasTriggerButton = !!trigger;
  }

  componentDidUpdate(): void {
    // TODO: fix scroll down before add item to the history. Tried to use gx-loading
    const h = this.element.shadowRoot.querySelector(".history").clientHeight;
    this.element.shadowRoot.querySelector(".scroll").scrollTo(0, h);
  }

  /**
   * Information for GXquery service
   * @returns Query options
   */
  private queryOptions(): GxQueryOptions {
    return {
      baseUrl: process.env.BASE_URL,
      metadataName: this.metadataName
    };
  }

  /**
   * Callback that receive the response to chat
   * @param data GxQuery response
   */
  private chatResponseCallback = (data: GxChatMessageResponse): void => {
    const { ChatMessage, Query, Errors } = data;
    if (Errors.length > 0) {
      console.error(Errors);
    } else {
      this.queryItems = [...this.queryItems, ChatMessage];
      if (Query?.Id) {
        this.gxQuerySelect.emit(Query);
      }
    }
    this.resetChat();
  };

  private toggleUnlocked = () => {
    if (this.resizewindow) {
      this.isUnlocked = !this.isUnlocked;
    }
  };

  private toggleMinimized = () => {
    if (this.resizewindow) {
      this.isMinimized = !this.isMinimized;
    }
  };

  private request(question?: string) {
    this.inputElement.value = "";
    this.waitingResponse = true;
    if (question) {
      this.lastQuestion = question;
      this.queryItems.push({
        id: "",
        messageType: "user",
        expression: "",
        content: this.lastQuestion
      });
    }
    this.queryChatRequest.emit({ message: this.lastQuestion });
    const options = this.queryOptions();
    asyncNewChatMessage(options, this.queryItems, this.chatResponseCallback);
  }

  private handleSendMessage = (event: KeyboardEvent) => {
    if (event.key !== KEY_CODES.ENTER || event.shiftKey) {
      return;
    }
    event.preventDefault();

    // const input = event.target as HTMLGxEditElement;
    if (!!this.inputElement.value) {
      this.request(this.inputElement.value);
    }
  };

  /** */
  private handleTriggerClick = () => {
    const event: KeyboardEvent = new KeyboardEvent("keydown", {
      key: KEY_CODES.ENTER
    });
    this.handleSendMessage(event);
  };

  private handleRegenerateAnswer = () => {
    const removeLastQuery = this.queryItems.slice(0, -1);
    if (removeLastQuery.find(i => i.messageType === "user")) {
      this.queryItems = removeLastQuery;
      this.request();
    }
  };

  /**
   * Reset chat fields
   * @param clearHistory clear entire chat history
   */
  private resetChat = (clearHistory = false): void => {
    this.waitingResponse = false;
    this.inputElement.value = "";
    if (clearHistory) {
      this.queryItems = [];
    }
    const [lastQuery] = [...this.queryItems].reverse();
    this.showRegenerate =
      this.queryItems.length > 0 && lastQuery?.messageType === "assistant";
    this.inputElement.focus();
  };

  render() {
    return (
      <Host role="application" aria-label="GxQuery Chat">
        <header role="banner" part={`${PART_PREFIX}header`}>
          <h1 part={`${PART_PREFIX}title`}>{this.mainTitle}</h1>
          <div part={`${PART_PREFIX}controls`}>
            {this.resizewindow && (
              <gx-button
                tabindex="0"
                role="button"
                accessible-name={this.isUnlocked ? "locked" : "unlocked"}
                main-image-src={getAssetPath("assets/undock.svg")}
                image-position="below"
                width="20px"
                height="20px"
                onClick={this.toggleUnlocked}
              ></gx-button>
            )}
            {this.resizewindow && (
              <gx-button
                tabindex="0"
                role="button"
                accessible-name={this.isMinimized ? "maximize" : "minimize"}
                main-image-src={
                  this.isMinimized
                    ? getAssetPath("assets/maximize.svg")
                    : getAssetPath("assets/minimize.svg")
                }
                image-position="below"
                width="20px"
                height="20px"
                onClick={this.toggleMinimized}
              ></gx-button>
            )}
          </div>
        </header>
        <main part={`${PART_PREFIX}container`} aria-hidden={this.isMinimized}>
          <div
            aria-busy={this.waitingResponse}
            aria-label="Chat history"
            aria-live="polite"
            class="scroll"
            role="list"
          >
            <div class="history" part={`${PART_PREFIX}history`}>
              <div slot="grid-content">
                {this.queryItems.map(({ content, messageType }) => (
                  <gx-grid-smart-cell
                    aria-label={`Message of ${messageType}`}
                    role="listitem"
                  >
                    <div
                      class="cell"
                      part={`${PART_PREFIX}${messageType}-message`}
                    >
                      <gx-icon
                        aria-hidden="true"
                        style={{ "--gx-icon-size": this.messageIconSize }}
                        type={`message_${messageType}`}
                      ></gx-icon>

                      <gx-textblock
                        format="Text"
                        innerHTML={content}
                      ></gx-textblock>
                    </div>
                  </gx-grid-smart-cell>
                ))}
              </div>

              <gx-loading presented={this.waitingResponse}></gx-loading>

              <gx-query-suggestion
                header="suggestions"
                items={this.suggested}
              ></gx-query-suggestion>

              {!this.waitingResponse && (
                <div class="cell--last" part={`${PART_PREFIX}regenerate`}>
                  {this.showRegenerate && (
                    <gx-button
                      cssClass="regenerate-btn"
                      caption="Regenerate answer"
                      image-position="before"
                      main-image-src={getAssetPath("assets/reload.svg")}
                      style={{ "--gx-button-image-margin": "10px" }}
                      onClick={this.handleRegenerateAnswer}
                    ></gx-button>
                  )}
                </div>
              )}
            </div>
          </div>

          <gx-form-field part={`${PART_PREFIX}question`}>
            <gx-edit
              css-class="input"
              area="field"
              disabled={this.waitingResponse}
              onKeyDown={this.handleSendMessage}
              placeholder={this.placeholder}
              ref={el => (this.inputElement = el)}
              multiline
              onGxTriggerClick={this.handleTriggerClick}
              show-trigger
            >
              {this.hasTriggerButton ? (
                <slot name="trigger-content" />
              ) : (
                <gx-icon aria-hidden="true" slot="trigger-content" type="sent">
                  Send question
                </gx-icon>
              )}
            </gx-edit>
          </gx-form-field>
        </main>
      </Host>
    );
  }
}
