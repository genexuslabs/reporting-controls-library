import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Listen,
  Method,
  Prop,
  Watch,
  h
} from "@stencil/core";
import { Component as GxComponent } from "../../../common/interfaces";
import { KEY_CODES } from "../../../common/reserverd-names";
import { GxQueryItem } from "../../../common/basic-types";

export type QueryMenuElement = {
  id: number;
  title: string;
  fixed: boolean;
  modified: string;
};

type KeyEvents =
  | typeof KEY_CODES.EDIT_KEY
  | typeof KEY_CODES.ENTER
  | typeof KEY_CODES.ESCAPE;

@Component({
  tag: "gx-query-menu-item",
  styleUrl: "query-menu-item.scss",
  shadow: true
})
export class QueryMenuItem implements GxComponent {
  private inputRef!: HTMLGxEditElement;
  private editControlId: string;
  private backupInputValue: string;

  @Element() element: HTMLGxQueryMenuItemElement;

  /**
   * Toggle edit mode
   */
  @Prop({ reflect: true, mutable: true }) editMode = false;
  /**
   * Id of item active
   */
  @Prop({ reflect: true }) readonly isActive: boolean = false;
  /**
   * This property specify the title of the item.
   */
  @Prop() readonly item: GxQueryItem;

  /**
   * Trigger the action to delete the item
   */
  @Event() deleteItem: EventEmitter;
  /**
   * Trigger the action to delete the item
   */
  @Event() renameItem: EventEmitter;
  /**
   * Trigger the action to select an item
   */
  @Event() selectItem: EventEmitter;

  @Watch("isActive")
  focusItem(newValue: boolean) {
    if (newValue) {
      this.element.focus();
    }
  }

  @Listen("keydown", { capture: true })
  handleKeyDown(event: KeyboardEvent) {
    const keyHandler = this.keyDownEvents[event.key];
    if (keyHandler) {
      keyHandler(event);
    }
  }

  /**
   *
   */
  @Method()
  async setFocus() {
    this.element.setAttribute("aria-selected", "true");
    this.element.setAttribute("tabindex", "0");
    this.element.focus();
  }

  componentWillLoad() {
    this.backupInputValue = this.item.name;
    this.editControlId = `edit-control-${this.item.id}`;
  }

  componentDidRender() {
    if (this.editMode) {
      if (this.inputRef) {
        this.inputRef.click();
      } else {
        this.element.focus();
      }
    }
  }

  private keyDownEvents: {
    [key in KeyEvents]: (event: KeyboardEvent) => void;
  } = {
    [KEY_CODES.ESCAPE]: event => {
      event.preventDefault();
      if (this.editMode) {
        this.handlerCancel();
      }
    },
    [KEY_CODES.EDIT_KEY]: event => {
      event.preventDefault();
      if (!this.editMode && this.isActive) {
        this.handlerEdit();
      }
    },
    [KEY_CODES.ENTER]: event => {
      event.preventDefault();
      if (!this.editMode) {
        this.handlerSelect();
      } else {
        this.handlerRename();
      }
    }
  };

  private toggleEditMode = () => {
    this.editMode = !this.editMode;
  };

  private handlerCancel = () => {
    // Reset item value
    this.inputRef.value = this.backupInputValue;
    this.toggleEditMode();
  };

  private handlerDelete = () => {
    this.deleteItem.emit(this.item);
  };

  private handlerEdit = () => {
    this.toggleEditMode();
  };

  private handlerRename = () => {
    // Save backup input value
    this.backupInputValue = this.inputRef.value;
    this.renameItem.emit({
      ...this.item,
      Name: this.inputRef.value
    } as GxQueryItem);
    this.toggleEditMode();
  };

  private handlerSelect = () => {
    this.selectItem.emit(this.item);
  };

  render() {
    let template: HTMLGxEditElement | HTMLSpanElement;

    if (this.editMode) {
      template = (
        <gx-edit
          ref={el => (this.inputRef = el) && el.click()}
          value={this.item.name}
          tabIndex={0}
        ></gx-edit>
      );
    } else {
      template = <span>{this.item.name}</span>;
    }

    return (
      <Host tabindex="0" onClick={!this.editMode ? this.handlerSelect : null}>
        <li class="item" part={`item ${this.isActive ? 'active' : ''}`} role="option">
          <div
            aria-controls={this.editControlId}
            aria-expanded={this.editMode ? "true" : "false"}
            class="label"
            part="label"
          >
            {template}
          </div>
          <div class="controls" id={this.editControlId} part="controls">
            {!this.editMode
              ? [
                  <button
                    class="btn btn-edit"
                    onClick={this.handlerEdit}
                    tabIndex={0}
                  >
                    Edit title
                  </button>,
                  <button
                    class="btn btn-delete"
                    onClick={this.handlerDelete}
                    tabIndex={0}
                  >
                    Delete title
                  </button>
                ]
              : [
                  <button
                    aria-name="Confirm edition"
                    class="btn btn-done"
                    onClick={this.handlerRename}
                    tabIndex={0}
                  >
                    Confirm
                  </button>,
                  <button
                    aria-name="Cancel edition"
                    class="btn btn-cancel"
                    onClick={this.handlerCancel}
                    tabIndex={0}
                  >
                    Cancel
                  </button>
                ]}
          </div>
        </li>
      </Host>
    );
  }
}
