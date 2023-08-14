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
import { GxQueryItem } from "../../../common/basic-types";
import { Component as GxComponent } from "../../../common/interfaces";
import { KEY_CODES } from "../../../common/reserverd-names";

export type QueryMenuElement = {
  id: number;
  title: string;
  fixed: boolean;
  modified: string;
};

const PART_PREFIX = "query-item__";

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

  @Element() element: HTMLGxQueryMenuItemElement;

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
  @Event() deleteItem: EventEmitter<GxQueryItem>;
  /**
   * Trigger the action to delete the item
   */
  @Event() renameItem: EventEmitter<GxQueryItem>;
  /**
   * Trigger the action to select an item
   */
  @Event() selectItem: EventEmitter<GxQueryItem>;
  /**
   * Toggle edit mode
   */
  @Prop({ reflect: true, mutable: true }) editMode = false;
  /**
   * Accessibility aria attribute
   */
  // @Prop({ reflect: true, mutable: true }) ariaSelected = false;
  /**
   * Input value
   */
  @State() currentTitle: string;

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
    console.log(`-- Name: ${this.item.Name} --`);

    this.element.setAttribute("aria-selected", "true");
    this.element.setAttribute("tabindex", "0");
    this.element.focus();
  }

  componentWillLoad() {
    this.currentTitle = this.item.Name;
    this.editControlId = `edit-control-${this.item.Id}`;
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
        this.toggleEdition();
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

  private handlerSelect = () => {
    this.selectItem.emit(this.item);
  };

  private handlerDelete = async () => {
    this.deleteItem.emit(this.item);
  };

  private handlerRename = async () => {
    this.currentTitle = this.inputRef.value;
    this.renameItem.emit({
      ...this.item,
      Name: this.inputRef.value
    } as GxQueryItem);
    this.toggleEdition();
  };

  private handlerCancel = async () => {
    this.inputRef.value = this.currentTitle;
    this.toggleEdition();
  };

  private toggleEdition = () => {
    this.editMode = !this.editMode;
  };

  render() {
    let template: HTMLGxEditElement | HTMLSpanElement;

    if (this.editMode) {
      template = (
        <gx-edit
          ref={el => (this.inputRef = el) && el.click()}
          value={this.currentTitle}
          tabIndex={0}
        ></gx-edit>
      );
    } else {
      template = <span>{this.currentTitle}</span>;
    }

    return (
      <Host tabindex="-1" onClick={!this.editMode ? this.handlerSelect : null}>
        <li part={`${PART_PREFIX}item`} role="option">
          <div
            part={`${PART_PREFIX}label`}
            aria-controls={this.editControlId}
            aria-expanded={this.editMode ? "true" : "false"}
          >
            {template}
          </div>
          <div
            part={`${PART_PREFIX}controls`}
            class="controls"
            id={this.editControlId}
          >
            {!this.editMode
              ? [
                  <gx-button
                    onClick={this.toggleEdition}
                    accessible-name="edit title"
                    main-image-srcset={getAssetPath(
                      "../assets/icons8-edit.svg"
                    )}
                    tabIndex={0}
                  ></gx-button>,
                  <gx-button
                    onClick={this.handlerDelete}
                    accessible-name="delete title"
                    main-image-srcset={getAssetPath(
                      "../assets/icons8-delete.svg"
                    )}
                    tabIndex={0}
                  ></gx-button>
                ]
              : [
                  <gx-button
                    onClick={this.handlerRename}
                    accessible-name="confirm"
                    main-image-srcset={getAssetPath(
                      "../assets/icons8-done.svg"
                    )}
                  ></gx-button>,
                  <gx-button
                    onClick={this.handlerCancel}
                    accessible-name="cancel"
                    main-image-srcset={getAssetPath(
                      "../assets/icons8-cancel.svg"
                    )}
                  ></gx-button>
                ]}
          </div>
        </li>
      </Host>
    );
  }
}
