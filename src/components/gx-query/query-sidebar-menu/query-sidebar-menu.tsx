import { Component, Element, Host, Prop, h } from "@stencil/core";

import { Component as GxComponent } from "../../../common/interfaces";

@Component({
  tag: "gx-query-sidebar-menu",
  styleUrl: "query-sidebar-menu.scss",
  shadow: true
})
export class QuerySidebarMenu implements GxComponent {
  private hasHeader = false;

  @Element() element: HTMLGxQuerySidebarMenuElement;

  /**
   * This attribute lets you determine if the control is expanded or collapsed.
   */
  @Prop() readonly expanded: boolean = true;

  componentWillLoad() {
    this.hasHeader = !!this.element.querySelector(":scope>[slot='header']");
  }

  render() {
    return (
      <Host>
        {this.hasHeader && <slot name="header" />}

        <slot name="items" />
      </Host>
    );
  }
}
