import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  h
} from "@stencil/core";
import { QueryViewerSliderRange } from "@genexus/reporting-api";

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;

const SLIDER_START_WIDTH = "--slider-start-width";
const SLIDER_END_WIDTH = "--slider-end-width";
const SLIDER_START_VALUE = "--slider-start-value";
const SLIDER_END_VALUE = "--slider-end-value";

@Component({
  tag: "gx-query-viewer-slider",
  styleUrl: "query-viewer-slider.scss",
  shadow: true
})
export class QueryViewerSlider {
  @Element() el: HTMLGxQueryViewerSliderElement;

  /**
   * This property determines the value of the end position slider.
   */
  @Prop({ mutable: true }) endSliderValue = DEFAULT_MAX_VALUE;

  /**
   * This property determines the value of the start position slider.
   */
  @Prop({ mutable: true }) startSliderValue = DEFAULT_MIN_VALUE;

  /**
   * This attribute lets you define the steps for each slider.
   */
  @Prop() readonly step: number = 0.1;

  /**
   * Fired when a new range of the control is committed by the user.
   */
  @Event() change: EventEmitter<QueryViewerSliderRange>;

  private updateStartSlider = (event: InputEvent) => {
    event.stopPropagation();

    const startInputValue = Number((event.target as HTMLInputElement).value);
    this.updateCustomVars(this.startSliderValue, startInputValue);
  };

  private updateEndSlider = (event: InputEvent) => {
    event.stopPropagation();

    const endInputValue = Number((event.target as HTMLInputElement).value);
    this.updateCustomVars(endInputValue, this.endSliderValue);
  };

  private updateCustomVars(startSliderValue: number, endSliderValue: number) {
    const elStyle = this.el.style;

    const startSliderWidth = endSliderValue;
    const endSliderWidth = 100 - startSliderValue;

    elStyle.setProperty(SLIDER_START_WIDTH, startSliderWidth.toString());
    elStyle.setProperty(SLIDER_END_WIDTH, endSliderWidth.toString());
    elStyle.setProperty(SLIDER_START_VALUE, `${startSliderValue}`);
    elStyle.setProperty(SLIDER_END_VALUE, `${endSliderValue}`);
  }

  private syncStartSlider = (event: InputEvent) => {
    event.stopPropagation();

    const startInputValue = Number((event.target as HTMLInputElement).value);
    this.startSliderValue = startInputValue;

    this.change.emit({ start: startInputValue, end: this.endSliderValue });
  };

  private syncEndSlider = (event: InputEvent) => {
    event.stopPropagation();

    const endInputValue = Number((event.target as HTMLInputElement).value);
    this.endSliderValue = endInputValue;

    this.change.emit({ start: this.startSliderValue, end: endInputValue });
  };

  componentWillLoad() {
    this.updateCustomVars(this.startSliderValue, this.endSliderValue);
  }

  render() {
    return (
      <Host>
        <slot name="content" />

        <div class="invisible-slider-container">
          <input
            class="input-slider end"
            part="invisible-slider end"
            type="range"
            step={this.step}
            min={this.startSliderValue}
            max={DEFAULT_MAX_VALUE}
            value={this.endSliderValue}
            onInput={this.updateStartSlider}
            onChange={this.syncEndSlider}
          />

          <input
            class="input-slider start"
            part="invisible-slider start"
            type="range"
            step={this.step}
            min={DEFAULT_MIN_VALUE}
            max={this.endSliderValue}
            value={this.startSliderValue}
            onInput={this.updateEndSlider}
            onChange={this.syncStartSlider}
          />
        </div>

        <div class="thumb start-thumb" part="thumb start-thumb"></div>
        <div class="mask" part="mask"></div>
        <div class="thumb end-thumb" part=" thumb end-thumb"></div>
      </Host>
    );
  }
}
