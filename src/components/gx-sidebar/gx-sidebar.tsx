import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  Watch,
  h
} from "@stencil/core";

const SIDEBAR_EXPANDED = "--gx-sidebar-expanded";
const SIDEBAR_COLLAPSED = "--gx-sidebar-collapsed";

@Component({
  tag: "gx-sidebar",
  styleUrl: "gx-sidebar.scss",
  shadow: true
})
export class GxSidebar {
  private controlElement!: Element;
  private showHeader = false;
  private showControl = false;

  @Element() element: HTMLGxSidebarElement;

  /**
   * Determines if the sidebar can be collapsed
   */
  @Prop() readonly collapsible = true;
  /**
   * Determines if should display the actions controls
   */
  @Prop() readonly controls = true;
  /**
   * Determines if the sidebar is collapsed
   */
  @Prop({ reflect: true, mutable: true }) isCollapsed = false;
  /**
   * Width of expanded window. Default 300px
   */
  @Prop() readonly expandedSize = "300px";
  /**
   * Width of expanded window. Default 300px
   */
  @Prop() readonly collapsedSize = "40px";
  /**
   * Label for collapse button
   */
  @Prop({ mutable: true, reflect: true }) collapseLabel = "Collapse window";
  /**
   * Label for expand button
   */
  @Prop({ mutable: true, reflect: true }) expandLabel = "Expand window";
  /**
   * Label for expand button
   */
  @Prop() newChatLabel = "New Chat";
  /**
   *
   */
  @State() buttonLabel: string;

  /**
   * Crear a new chat
   */
  @Event({ bubbles: true, composed: true, cancelable: false })
  gxQueryNewChat: EventEmitter<null>;

  @Watch("isCollapsed")
  collapsibleChange(newValue: boolean) {
    this.buttonLabel = newValue
      ? this.expandLabel
      : this.collapseLabel;
  }

  componentWillLoad() {
    this.element.style.setProperty(SIDEBAR_EXPANDED, this.expandedSize);
    this.element.style.setProperty(SIDEBAR_COLLAPSED, this.collapsedSize);
    //
    this.validateSlotHeader();
    this.validateSlotNewChat();
  }

  private validateSlotHeader = () => {
    const headerElement = this.element.querySelector("[slot='header']");
    this.showHeader = !!headerElement;
  };

  private validateSlotNewChat = () => {
    this.controlElement = this.element.querySelector("[slot='new-chat']");
    if (!!this.controlElement) {
      this.showControl = !!this.controlElement;
      this.controlElement.addEventListener("click", this.handleNewChat);
    }
  };

  private toggleView = () => {
    this.isCollapsed = !this.isCollapsed;
  };

  private handleCollapseWindow = () => {
    this.toggleView();
  };
  private handleNewChat = () => {
    this.gxQueryNewChat.emit();
  };

  private controlsRender(): HTMLDivElement | null {
    if (!this.controls) {
      return null;
    }
    return this.showControl ? (
      <div>
        <slot name="new-chat"></slot>
      </div>
    ) : (
      <div>
        <button
          class="btn btn-new-chat"
          onClick={this.handleNewChat}
          type="button"
        >
          {this.newChatLabel}
        </button>
      </div>
    );
  }

  render() {
    return (
      <Host id="wrapper">
        <div class="wrapper">
          {this.showHeader && <slot name="header"></slot>}

          <section part="menu" class="main-wrapper">
            <slot></slot>
          </section>
        </div>

        <footer part="footer" class="footer-wrapper">
          <button
            aria-expanded={this.isCollapsed ? "false" : "true"}
            aria-controls="wrapper"
            class={{
              "btn btn-resize": true,
              "btn-resize--expanded": this.isCollapsed
            }}
            type="button"
            onClick={this.handleCollapseWindow}
          >
            {this.buttonLabel}
          </button>

          {this.controlsRender()}
        </footer>
      </Host>
    );
  }
}
