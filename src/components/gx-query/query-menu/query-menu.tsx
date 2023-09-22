import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Prop,
  State,
  Watch,
  getAssetPath,
  h
} from "@stencil/core";

import { differenceInDays, endOfMonth, format } from "date-fns";
import {
  GxQueryItem,
  GxQueryListResponse,
  GxQueryOptions
} from "../../../common/basic-types";
import { Component as GxComponent } from "../../../common/interfaces";
import { KEY_CODES } from "../../../common/reserverd-names";
import { GxQueryMenuItemCustomEvent } from "../../../components";
import {
  DeleteQueryServiceResponse,
  RenameQueryServiceResponse
} from "../../../services/gxquery-connector";
import {
  asyncDeleteQuery,
  asyncGetListQuery,
  asyncRenameQuery
} from "../../../services/services-manager";

const PART_PREFIX = "query-menu__";

type KeyEvents =
  | typeof KEY_CODES.ARROW_UP_KEY
  | typeof KEY_CODES.ARROW_DOWN_KEY
  | typeof KEY_CODES.TAB;

@Component({
  tag: "gx-query-menu",
  styleUrl: "query-menu.scss",
  shadow: true,
  assetsDirs: ["../assets"]
})
export class QueryMenu implements GxComponent {
  private showHeader = false;
  private today = new Date();
  private itemToRename: GxQueryItem;
  private itemToDelete: GxQueryItem;

  @Element() element: HTMLGxQueryMenuElement;

  /**
   * Determines if the menu can be collapsed
   */
  @Prop() readonly collapsible: boolean = true;
  /**
   * Determines if the menu is collapsed
   */
  @Prop({ reflect: true, mutable: true }) isCollapsed = false;
  /**
   * Label to show in the collapsed button
   */
  @Prop() readonly collapsedSidebarLabel = "collapse sidebar";
  /**
   * Label to show in the collapsed button
   */
  @Prop() readonly expandSidebarLabel = "expand sidebar";
  /**
   * New Chat button caption
   */
  @Prop() readonly newChatCaption = "New Chat";
  /**
   * Dates to group queries
   */
  @Prop() readonly rangeOfDays: { days: number; label: string }[] = [
    { days: 0, label: "Today" },
    { days: 1, label: "Yesterday" },
    { days: 3, label: "Previous 3 days" },
    { days: 5, label: "Previous 5 Days" },
    { days: 7, label: "Previous 7 Days" },
    { days: 10, label: "Previous 10 Days" }
  ];
  /**
   * Show queries items group by month
   */
  @Prop() readonly groupItemsByMonth = true;

  /**
   * True to tell the controller to connect use GXquery as a queries repository
   */
  @Prop() readonly useGxquery: boolean;

  /**
   * This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true.
   * In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property)
   */
  @Prop() readonly metadataName = process.env.METADATA_NAME;
  /**
   * Sanitized qiery items list
   */
  @State() _items: GxQueryItem[] = [];
  /**
   *
   */
  @State() _filteredItems: {
    label: string;
    ariaLabel?: string;
    items: GxQueryItem[];
  }[] = [];
  /**
   *
   */
  @State() loading = true;
  /**
   *
   */
  @State() active = "";

  @Listen("gxQuerySaveQuery", { target: "window" })
  saveQuery(event: CustomEvent<GxQueryItem>) {
    console.log("gxQuerySaveQuery", event.detail);
    // const index = this._items.findIndex(i => i.id === id);
    // console.log("remove: ", id, index);
    // if (event.detail) {
    //   this._items = [...this._items, event.detail];
    // }
  }

  @Listen("keydown", { capture: true })
  handleKeyDown(event: KeyboardEvent) {
    const keyHandler = this.keyDownEvents[event.key];
    if (keyHandler) {
      keyHandler(event);
    }
  }

  @Watch("_items")
  applyFilters(newItems: GxQueryItem[]) {
    // const newItemsSanitized = [...newItems];
    const filteredItems: typeof this._filteredItems = [];
    const rangeOfDays = this.generateGroups(newItems);
    newItems.forEach(item => {
      const selected = this.findItemInGroup(rangeOfDays, item.differenceInDays);
      if (selected) {
        const itemIndex = filteredItems.findIndex(
          f => f.label === selected.label
        );
        if (itemIndex > -1) {
          filteredItems[itemIndex].items.push(item);
        } else {
          filteredItems.push({ label: selected.label, items: [item] });
        }
      }
    });
    this._filteredItems = [...filteredItems];
  }

  /**
   * Select a query
   */
  @Event({ bubbles: true, composed: true, cancelable: false })
  gxQuerySelect: EventEmitter<GxQueryItem>;

  /**
   * Crear a new chat
   */
  @Event({ bubbles: true, composed: true, cancelable: false })
  gxQueryNewChat: EventEmitter<null>;

  connectedCallback() {
    const options = this.queryOptions();
    asyncGetListQuery(options, this.listQueriesCallback);
  }

  componentWillLoad() {
    const headerElement = this.element.querySelector("[slot='header']");
    this.showHeader = !!headerElement;
  }

  private keyDownEvents: {
    [key in KeyEvents]: (event: KeyboardEvent) => void;
  } = {
    [KEY_CODES.ARROW_UP_KEY]: event => {
      event.preventDefault();
      this.selectPreviewItem();
    },
    [KEY_CODES.ARROW_DOWN_KEY]: event => {
      event.preventDefault();
      this.selectNextItem();
    }
  };

  private listQueriesCallback = (data: GxQueryListResponse) => {
    const { Errors, Queries } = data;
    if (Errors.length === 0) {
      this._items = [...Queries].sort(this.sortByDate);
    } else {
      console.error(Errors);
    }
    this.loading = false;
  };

  private renameQueryCallback = (err: RenameQueryServiceResponse) => {
    if (err.Errors.length === 0) {
      const { Id, Name } = this.itemToRename;
      const data = [...this._items];
      const index = data.findIndex(i => i.Id === Id);
      const today = new Date();
      const item = {
        ...data[index],
        Modified: today,
        Name: Name,
        differenceInDays: 0
      };
      data.splice(index, 1);
      const items = [item, ...data].sort(this.sortByDate);
      this._items = items;
    } else {
      console.error(err);
    }
    this.loading = false;
  };

  private deleteQueryCallback = (err: DeleteQueryServiceResponse) => {
    if (err.Errors.length === 0) {
      const index = this._items.findIndex(i => i.Id === this.itemToDelete.Id);
      if (index > -1) {
        const items = [...this._items];
        items.splice(index, 1);
        this._items = items;
      }
    } else {
      console.error(err);
    }
    this.loading = false;
  };

  private queryOptions(): GxQueryOptions {
    return {
      baseUrl: process.env.BASE_URL,
      metadataName: this.metadataName
    };
  }

  private findQueryMenuItemSelected = () => {
    const element = this.element.shadowRoot.activeElement;
    const active =
      element.tagName === "UL"
        ? element.querySelector("gx-query-menu-item[aria-selected='true']") ||
          element.querySelector("gx-query-menu-item")
        : element;

    return active as HTMLGxQueryMenuItemElement;
  };

  private clearSelectedMenuItem = (activeId?: string) => {
    const items =
      this.element.shadowRoot.querySelectorAll<HTMLGxQueryMenuItemElement>(
        "gx-query-menu-item[aria-selected='true']"
      );
    items.forEach(item => {
      if (activeId !== item.item.Id && item.item.Id !== this.active) {
        item.setAttribute("aria-selected", "false");
        item.setAttribute("tabindex", "-1");
      }
    });
  };

  private findQueryMenuItem = (order: number) => {
    const queryMenuItem = this.findQueryMenuItemSelected();
    if (
      queryMenuItem.getAttribute("aria-selected") === "false" &&
      order === 1
    ) {
      return queryMenuItem;
    }
    const allMenuItems =
      this.element.shadowRoot.querySelectorAll("gx-query-menu-item");
    const index = Array.from(allMenuItems).findIndex(
      ({ item }) => item.Id === queryMenuItem.item.Id
    );
    const newIndex = index + order;
    if (order === 1 && newIndex === allMenuItems.length - 1) {
      return allMenuItems[0];
    }
    if (order === -1 && newIndex < 0) {
      return allMenuItems[allMenuItems.length - 1];
    }

    return allMenuItems[newIndex];
  };

  private selectPreviewItem = () => {
    const prevItem = this.findQueryMenuItem(-1);
    this.clearSelectedMenuItem();

    prevItem.setFocus();
  };

  private selectNextItem = () => {
    const nextItem = this.findQueryMenuItem(1);
    this.clearSelectedMenuItem();

    nextItem.setFocus();
  };

  private findItemInGroup(
    rangeOfDays: { days: number; label: string }[],
    diffDays: number
  ) {
    return rangeOfDays.find((r, index, obj) => {
      const startDay = r.days;
      const endDay = obj[index + 1]?.days || Infinity;
      return startDay <= diffDays && endDay > diffDays;
    });
  }

  private generateGroups(newItems: GxQueryItem[]) {
    const rangeOfDays = [...this.rangeOfDays];

    if (this.groupItemsByMonth) {
      newItems.forEach(({ Modified }) => {
        const firstDayOfMonth = endOfMonth(Modified);
        const differenceDays = differenceInDays(this.today, firstDayOfMonth);

        const lastItemGroup = rangeOfDays.at(rangeOfDays.length - 1);
        if (lastItemGroup.days < differenceDays) {
          const label = format(Modified, "yyyy MMMM");
          rangeOfDays.push({ days: differenceDays, label });
        }
      });
    }
    rangeOfDays.push({ days: Infinity, label: "more" });

    return rangeOfDays;
  }

  private sortByDate = (a: GxQueryItem, b: GxQueryItem) => {
    const atime = new Date(a.Modified).getTime();
    const btime = new Date(b.Modified).getTime();
    if (atime < btime) {
      return 1;
    } else if (atime > btime) {
      return -1;
    }
    // a must be equal to b
    return 0;
  };

  private deleteItem = (item: GxQueryMenuItemCustomEvent<GxQueryItem>) => {
    if (confirm("Delete query?")) {
      this.loading = true;
      const options = this.queryOptions();
      this.itemToDelete = item.detail;
      asyncDeleteQuery(options, this.itemToDelete, this.deleteQueryCallback);
      // if (index > -1) {
      //   const items = [...this._items];
      //   items.splice(index, 1);
      //   this._items = items;
      // }
    }
  };

  private renameItem = (item: GxQueryMenuItemCustomEvent<GxQueryItem>) => {
    const query = item.detail;
    const options = this.queryOptions();
    this.itemToRename = query;
    this.loading = true;
    asyncRenameQuery(options, query, this.renameQueryCallback);
  };

  private selectItem = (item: GxQueryMenuItemCustomEvent<GxQueryItem>) => {
    this.clearSelectedMenuItem(item.detail.Id);
    this.active = item.detail.Id;
    this.gxQuerySelect.emit(item.detail);
  };

  private createNewChat = () => {
    this.gxQueryNewChat.emit();
  };

  private toggleView = () => {
    this.isCollapsed = !this.isCollapsed;
  };

  render() {
    const iconParams = this.isCollapsed
      ? { class: "sidebar-btn--expand", caption: this.expandSidebarLabel }
      : { class: "sidebar-btn--collapse", caption: this.collapsedSidebarLabel };

    return (
      <Host>
        <section part={`${PART_PREFIX}sidebar`}>
          {this.showHeader && <slot name="header" />}

          <nav part={`${PART_PREFIX}list`} aria-label="Chat history">
            <gx-loading presented={this.loading}></gx-loading>
            {this._filteredItems.map(({ label, items }, index) => (
              <div>
                <h2 id={`subtitle${index}`} part={`${PART_PREFIX}subtitle`}>
                  {label}
                </h2>
                <ul
                  role="listbox"
                  tabindex="0"
                  aria-labelledby={`subtitle${index}`}
                >
                  {items.map(item => (
                    <gx-query-menu-item
                      aria-selected="false"
                      isActive={this.active === item.Id}
                      onDeleteItem={this.deleteItem}
                      onRenameItem={this.renameItem}
                      onSelectItem={this.selectItem}
                      item={item}
                      exportparts="query-item__item,query-item__label,query-item__controls"
                    ></gx-query-menu-item>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </section>

        <footer part={`${PART_PREFIX}footer`}>
          <div>
            <gx-button
              onClick={this.toggleView}
              css-class={iconParams.class}
              image-position="before"
              invisible-mode="collapse"
              main-image-srcset={getAssetPath("../assets/arrow.svg")}
            ></gx-button>
          </div>
          <div>
            <gx-button
              onClick={this.createNewChat}
              css-class="new-chat-btn"
              caption={this.newChatCaption}
              image-position="before"
              disabled={this.loading}
              main-image-srcset={getAssetPath("../assets/speech-bubble.svg")}
            ></gx-button>
          </div>
        </footer>
      </Host>
    );
  }
}
