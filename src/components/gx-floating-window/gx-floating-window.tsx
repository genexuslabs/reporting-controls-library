import { Component, Element, Host, Prop, getAssetPath, h } from '@stencil/core';

const SIDEBAR_WIDTH = "--gx-sidebar-with";

@Component({
  tag: 'gx-floating-window',
  styleUrl: 'gx-floating-window.scss',
  shadow: true,
  assetsDirs: ["assets"]
})
export class GxFloatingWindow {

  @Element() element: HTMLGxFloatingWindowElement;

  /**
   * This property specifies the items of the chat.
   */
  @Prop() readonly mainTitle: string;
  /**
   * Determines if the menu can be unlocked or minimize
   */
  @Prop() readonly resizeWindow: boolean = true;
  /**
   * Determines if the menu is unlocked
   */
  @Prop({ reflect: true, mutable: true }) isUnlocked = false;
  /**
   * Determines if the menu is minimized
   */
  @Prop({ reflect: true, mutable: true }) isMinimized = false;
  /**
   * Width of expanded window. Default 300px
   */
  @Prop() readonly expandedSize = "300px";

  componentWillLoad() {
    this.element.style.setProperty(SIDEBAR_WIDTH, this.expandedSize);
  }

  private toggleUnlocked = () => {
    if (this.resizeWindow) {
      this.isUnlocked = !this.isUnlocked;
    }
  };

  private toggleMinimized = () => {
    if (this.resizeWindow) {
      this.isMinimized = !this.isMinimized;
    }
  };

  render() {
    return (
      <Host role="application" aria-label="GxQuery Chat">
        <header part="header" role="banner" class="header">
          <h1 part="title" class="header__title">{this.mainTitle}</h1>
          {this.resizeWindow && (
            <div part="controls" class="header__controls" aria-hidden="true">
              <gx-button
                css-class="controls-btn"
                tabindex="0"
                role="button"
                accessible-name={this.isUnlocked ? "locked" : "unlocked"}
                main-image-src={getAssetPath("assets/undock.svg")}
                image-position="below"
                onClick={this.toggleUnlocked}
              ></gx-button>
              <gx-button
                css-class="controls-btn"
                tabindex="0"
                role="button"
                accessible-name={this.isMinimized ? "maximize" : "minimize"}
                main-image-src={
                  this.isMinimized
                    ? getAssetPath("assets/maximize.svg")
                    : getAssetPath("assets/minimize.svg")
                }
                image-position="below"
                onClick={this.toggleMinimized}
              ></gx-button>
            </div>
          )}
        </header>
        <main part="container" class="main-wrapper" aria-hidden={this.isMinimized}>
          <slot></slot>
        </main>
      </Host>
    );
  }

}
