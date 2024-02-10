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
  h
} from "@stencil/core";

import {
  DeleteQueryServiceResponse,
  RenameQueryServiceResponse,
  asyncDeleteQuery,
  asyncGetListQuery,
  asyncRenameQuery
} from "@genexus/reporting-api";
import {
  GxQueryItem,
  GxQueryListResponse,
  GxQueryOptions
} from "@genexus/reporting-api";
import { differenceInDays, endOfMonth, format } from "date-fns";
import { Component as GxComponent } from "../../../common/interfaces";
import { KEY_CODES } from "../../../common/reserverd-names";
import { GxQueryMenuItemCustomEvent } from "../../../components";
import { compareModifiedAttr } from "../../../utils/date";

type KeyEvents =
  | typeof KEY_CODES.ARROW_UP_KEY
  | typeof KEY_CODES.ARROW_DOWN_KEY
  | typeof KEY_CODES.TAB;

type GroupedItemList = {
  label: string;
  ariaLabel?: string;
  items: GxQueryItem[];
};

@Component({
  tag: "gx-query-menu",
  styleUrl: "query-menu.scss",
  shadow: true
})
export class QueryMenu implements GxComponent {
  private today = new Date();
  private itemToRename: GxQueryItem;
  private itemToDelete: GxQueryItem;

  @Element() element: HTMLGxQueryMenuElement;

  @State() queryItems: GxQueryItem[] = [];
  @State() groupedItemList: GroupedItemList[] = [];
  @State() loading = true;
  @State() active = "";

  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  @Prop() readonly accessibleName = "Query list";
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
  @Prop() readonly useGxquery = true;
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
   * Use this property to pass a query obtained from GXquery.
   * This disabled the call to GxQuery API:
   *    Id: string;
   *    Name: string;
   *    Description: string;
   *    Expression: string;
   *    Modified: string;
   */
  @Prop() readonly serializedObject: string;

  @Listen("keydown", { capture: true })
  handleKeyDown(event: KeyboardEvent) {
    const keyHandler = this.keyDownEvents[event.key];
    if (keyHandler) {
      keyHandler(event);
    }
  }

  @Watch("queryItems")
  applyFilters(newItems: GxQueryItem[]) {
    const filteredItems: typeof this.groupedItemList = [];
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
    this.groupedItemList = [...filteredItems];
  }

  /**
   * Select a query
   */
  @Event({ bubbles: true, composed: true, cancelable: false })
  gxQuerySelect: EventEmitter<GxQueryItem>;
  /**
   * Delete query
   */
  @Event({ bubbles: true, composed: true, cancelable: false })
  gxQueryDelete: EventEmitter<GxQueryItem>;
  /**
   * Rename query
   */
  @Event({ bubbles: true, composed: true, cancelable: false })
  gxQueryRename: EventEmitter<GxQueryItem>;

  /**
   * Add a new query item
   * @param item GxQueryItem
   */
  @Method()
  async gxAddQuery(item: GxQueryItem) {
    const items = [...this.queryItems];
    // Find if it exist in the query list
    const index = items.findIndex(i => i.id === item.id);
    if (index > 0) {
      delete items[index];
    }
    this.queryItems = [...items, item];
  }

  connectedCallback() {
    const options = this.queryOptions();
    asyncGetListQuery(options, this.serializedObject, this.listQueriesCallback);
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
      this.queryItems = [...Queries].sort(compareModifiedAttr);
    } else {
      console.error(Errors);
    }
    this.loading = false;
  };

  private renameQueryCallback = (err: RenameQueryServiceResponse) => {
    if (err.Errors.length === 0) {
      const { id, name } = this.itemToRename;
      const data = [...this.queryItems];
      const index = data.findIndex(i => i.id === id);
      const today = new Date();
      const item = {
        ...data[index],
        modified: today,
        name,
        differenceInDays: 0
      };
      data.splice(index, 1);
      this.queryItems = [item, ...data].sort(compareModifiedAttr);
      this.gxQueryRename.emit(this.itemToRename);
    } else {
      console.error(err);
    }
    this.loading = false;
  };

  private deleteQueryCallback = (err: DeleteQueryServiceResponse) => {
    if (err.Errors.length === 0) {
      const index = this.queryItems.findIndex(
        i => i.id === this.itemToDelete.id
      );
      if (index > -1) {
        const items = [...this.queryItems];
        items.splice(index, 1);
        this.queryItems = items;
        this.gxQueryDelete.emit(this.itemToDelete);
      }
    } else {
      console.error(err);
    }
    this.loading = false;
  };

  private queryOptions(): GxQueryOptions {
    return {
      baseUrl: this.baseUrl,
      metadataName: this.metadataName,
      apiKey: this.apiKey,
      saiaToken: this.saiaToken,
      saiaUserId: this.saiaUserId
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
      if (activeId !== item.item.id && item.item.id !== this.active) {
        item.setAttribute("aria-selected", "false");
        item.setAttribute("tabindex", "-1");
      }
    });
  };

  private findQueryMenuItem = (order: number) => {
    const queryMenuItem = this.findQueryMenuItemSelected();
    const allMenuItems =
      this.element.shadowRoot.querySelectorAll("gx-query-menu-item");
    const index = Array.from(allMenuItems).findIndex(
      ({ item }) => item.id === queryMenuItem.item.id
    );
    let newIndex = index + order;
    if (order === 1 && newIndex === allMenuItems.length) {
      newIndex = 0;
    }
    if (order === -1 && newIndex < 0) {
      newIndex = allMenuItems.length - 1;
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
      newItems.forEach(({ modified }) => {
        const firstDayOfMonth = endOfMonth(modified);
        const differenceDays = differenceInDays(this.today, firstDayOfMonth);

        const lastItemGroup = rangeOfDays.at(rangeOfDays.length - 1);
        if (lastItemGroup.days < differenceDays) {
          const label = format(modified, "yyyy MMMM");
          rangeOfDays.push({ days: differenceDays, label });
        }
      });
    }
    rangeOfDays.push({ days: Infinity, label: "more" });

    return rangeOfDays;
  }

  private deleteItem = (item: GxQueryMenuItemCustomEvent<GxQueryItem>) => {
    // eslint-disable-next-line no-alert
    if (confirm("Delete query?")) {
      this.loading = true;
      const options = this.queryOptions();
      this.itemToDelete = item.detail;
      asyncDeleteQuery(options, this.itemToDelete, this.deleteQueryCallback);
      // if (index > -1) {
      //   const items = [...this.queryItems];
      //   items.splice(index, 1);
      //   this.queryItems = items;
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
    this.clearSelectedMenuItem(item.detail.id);
    this.active = item.detail.id;
    this.gxQuerySelect.emit(item.detail);
  };

  private renderQueryList = (groupedItemList: GroupedItemList[]) => {
    return groupedItemList.map(({ label, items }, index) => (
      <div>
        <h2 id={`subtitle${index}`} part="menu-title" class="subtitle">
          {label}
        </h2>
        <ul role="listbox" tabindex="0" aria-labelledby={`subtitle${index}`}>
          {items.map(item => (
            <gx-query-menu-item
              aria-selected="false"
              isActive={this.active === item.id}
              onDeleteItem={this.deleteItem}
              onRenameItem={this.renameItem}
              onSelectItem={this.selectItem}
              item={item}
              exportparts="item,active,label,controls"
            ></gx-query-menu-item>
          ))}
        </ul>
      </div>
    ));
  };

  render() {
    return (
      <Host aria-label={this.accessibleName}>
        {this.loading && (
          <div class="loading-backdrop" part="loading">
            <gx-loading presented={this.loading}></gx-loading>
          </div>
        )}

        <nav part="list-item" class="list" tabIndex={0}>
          {this.renderQueryList(this.groupedItemList)}
        </nav>
      </Host>
    );
  }
}
