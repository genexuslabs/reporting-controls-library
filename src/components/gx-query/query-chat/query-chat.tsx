import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch,
  getAssetPath,
  h
} from "@stencil/core";

import {
  asyncNewChatMessage,
  QueryViewerBase,
  GxChatMessage,
  GxChatMessageResponse,
  GxQueryOptions
} from "@genexus/reporting-api";
import { Component as GxComponent } from "../../../common/interfaces";
import { KEY_CODES } from "../../../common/reserverd-names";

export type QueryRequest = {
  message: string;
};

@Component({
  tag: "gx-query-chat",
  styleUrl: "query-chat.scss",
  shadow: true,
  assetsDirs: ["assets"]
})
export class QueryChat implements GxComponent {
  private inputElement!: HTMLGxEditElement;
  private hasTriggerButton: boolean;
  private chatElement!: HTMLDivElement;

  @Element() element: HTMLGxQueryChatElement;

  @State() waitingResponse = false;
  @State() showRegenerate = false;
  @State() lastQuestion = "";
  @State() queryItems: GxChatMessage[] = [];

  /**
   * Text that appears in the input control when it has no value set
   */
  @Prop() readonly placeholder: string = "Ask me question";
  /**
   * Specify the size of the icon messages. ex 50px
   */
  @Prop({ reflect: true, mutable: true }) messageIconSize = "40px";
  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop() readonly metadataName = "";
  /**
   * API base URL
   */
  @Prop() readonly baseUrl: string = "";
  /**
   * This is GxQuery authentication key. It will required when property useGxQuery = true
   */
  @Prop() readonly apiKey: string = "";
  /**
   * This is GxQuery Saia Token. It will required when property useGxQuery = true
   */
  @Prop() readonly saiaToken: string = "";
  /**
   * This is GxQuery Saia User ID (optional). It will use when property useGxQuery = true
   */
  @Prop() readonly saiaUserId: string = "";

  /**
   * Fired each time the user make a question
   */
  @Event({ bubbles: true, composed: true })
  gxUserRequest: EventEmitter<QueryRequest>;

  /**
   * Fired when receive a question answer
   */
  @Event({ bubbles: true, composed: true, cancelable: false })
  gxAssistantResponse: EventEmitter<QueryViewerBase>;

  /**
   * Reset chat when QueryId was trigger by another component
   * @param event query item selected
   */
  @Listen("gxAssistantResponse", { target: "window" })
  checkQuerySelect(event: CustomEvent<QueryViewerBase>) {
    const lastQuery = this.queryItems.length - 1;
    const chatItemId = lastQuery > 0 ? this.queryItems[lastQuery].id : "";
    if (chatItemId !== event.detail.id) {
      this.resetChat(true);
    }
  }

  /**
   * Clean chat
   */
  @Method()
  async gxCleanChat() {
    this.resetChat(true);
  }

  @Watch("queryItems")
  @Watch("waitingResponse")
  scrollChat() {
    if (this.chatElement) {
      this.chatElement.scrollTop = this.chatElement.scrollHeight;
    }
  }

  componentWillLoad() {
    const trigger = this.element.querySelector("[slot='trigger-content']");
    this.hasTriggerButton = !!trigger;
  }

  componentDidUpdate(): void {
    this.scrollChat();
  }

  /**
   * Information for GXquery service
   * @returns Query options
   */
  private queryOptions(): GxQueryOptions {
    return {
      baseUrl: this.baseUrl,
      metadataName: this.metadataName,
      apiKey: this.apiKey,
      saiaToken: this.saiaToken,
      saiaUserId: this.saiaUserId
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
      if (Query?.id) {
        this.gxAssistantResponse.emit(Query);
      }
    }
    this.resetChat();
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
    this.gxUserRequest.emit({ message: this.lastQuestion });
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
   * @param clearQueryHistory clear entire chat history
   */
  private resetChat = (clearQueryHistory = false): void => {
    this.waitingResponse = false;
    this.inputElement.value = "";
    if (clearQueryHistory) {
      this.queryItems = [];
    }
    const [lastQuery] = [...this.queryItems].reverse();
    this.showRegenerate =
      this.queryItems.length > 0 && lastQuery?.messageType === "assistant";
    this.inputElement.focus();
  };

  private renderLoading = () => {
    if (!this.waitingResponse) {
      return null;
    }
    return (
      <li>
        <gx-loading presented={this.waitingResponse}></gx-loading>
      </li>
    );
  };

  render() {
    return (
      <Host role="application" aria-label="GxQuery Chat">
        <div class="chat-wrapper">
          <div
            ref={el => (this.chatElement = el)}
            aria-busy={this.waitingResponse}
            aria-label="Chat history"
            aria-live="polite"
            class="chat-history scroll"
            part="chat-history"
          >
            <ul slot="grid-content" class="chat-messages">
              {this.queryItems.map(({ id, content, messageType }) => (
                <li
                  key={id}
                  aria-label={`Message of ${messageType}`}
                  class={`chat-history__message chat-history__message--${messageType}`}
                  part={`${messageType}-message`}
                >
                  <gx-icon
                    aria-hidden="true"
                    class="chat-message__avatar"
                    style={{ "--gx-icon-size": this.messageIconSize }}
                    type={`message_${messageType}`}
                  ></gx-icon>

                  <gx-textblock
                    format="Text"
                    innerHTML={content}
                  ></gx-textblock>
                </li>
              ))}
              {this.renderLoading()}
            </ul>
          </div>

          <div class="chat-form">
            {this.showRegenerate && (
              <gx-button
                css-class="regenerate-btn"
                caption="Regenerate answer"
                image-position="before"
                main-image-src={getAssetPath("assets/reload.svg")}
                style={{ "--gx-button-image-margin": "10px" }}
                onClick={this.handleRegenerateAnswer}
              ></gx-button>
            )}
            <fom class="chat-question" part={`question`}>
              <gx-edit
                css-class="chat-input"
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
                  <gx-icon
                    aria-hidden="true"
                    slot="trigger-content"
                    type="sent"
                  >
                    Send question
                  </gx-icon>
                )}
              </gx-edit>
            </fom>
          </div>
        </div>
      </Host>
    );
  }
}
