import {
  Component,
  Event,
  h,
  Prop,
  EventEmitter,
  Host,
  Element
} from "@stencil/core";
import { SeriesOptionsType } from "highcharts";

import { TrendIcon } from "../../common/basic-types";

let autoQueryViewerCardId = 0;

const TITLE_OPTION = {
  text: ""
};

const CHART_OPTION = {
  width: "100",
  height: "50",
  backgroundColor: "transparent",
  margin: [0, 0, 0, 0],
  renderTo: "container"
};

const TOOLTIP_OPTION = {
  enabled: false
};

const LEGEND_OPTION = {
  enabled: false
};

const PLOT_OPTION = {
  series: {
    enableMouseTracking: false,
    lineWidth: 1,
    lineColor: "#182f53",
    shadow: false,
    states: {
      hover: {
        lineWidth: 1
      }
    },
    marker: {
      radius: 0
    }
  }
};

const YAXIS_OPTION = {
  maxPadding: 0,
  minPadding: 0,
  gridLineWidth: 0,
  endOnTick: false,
  labels: {
    enabled: false
  }
};

const XAXIS_OPTION = {
  labels: {
    enabled: false
  }
};

const SERIES_OPTION = [
  {
    type: "spline",
    data: [
      [1352740844000, 12],
      [1352741744000, 10],
      [1352742644000, 20],
      [1352743544000, 40],
      [1352744444000, 50]
    ]
  }
];

@Component({
  tag: "gx-query-viewer-card",
  styleUrl: "query-viewer-card.scss",
  shadow: true
})
export class QueryViewerCard {
  private queryViewerCardId: string;

  @Element() element: HTMLGxQueryViewerCardElement;

  /**
   * Value, specifies the value to show in the card.
   */
  @Prop() readonly value: string;

  /**
   * Description, describe the content or purpose of the element set as Datum in the query object.
   */
  @Prop() readonly description: string;

  /**
   * IncludeTrend, specifies whether to include a trend mark for the values or not.
   */
  @Prop() readonly includeTrend: boolean = false;

  /**
   * IncludeSparkline, specifies whether to include a sparkline chart for the values or not.
   */
  @Prop() readonly includeSparkline: boolean = false;

  /**
   * Specifies whether to include the maximum and minimum values in the series.
   */
  @Prop() readonly includeMaxMin: boolean = false;

  /**
   * maxValue, specifies the maximum value in the series.
   */
  @Prop() readonly maxValue: string = "3905.71"; // @todo Find the default maxValue

  /**
   * minValue, specifies the minimum value in the series.
   */
  @Prop() readonly minValue: string = "1802.52"; // @todo Find the default minValue

  /**
   * Specifies the trend used for the trend icon.
   */
  @Prop() readonly trendIcon: TrendIcon = "drag_handle";

  /**
   * ItemClickEvent, executes actions when this event is triggered after clicking on a query element.
   */
  @Event() itemClickEvent: EventEmitter;

  componentWillLoad() {
    // Sets IDs
    if (!this.queryViewerCardId) {
      this.queryViewerCardId =
        this.element.id ||
        `gx-query-viewer-card-auto-id-${autoQueryViewerCardId++}`;
    }
  }

  render() {
    return (
      <Host
        role="article"
        aria-labelledby={this.queryViewerCardId}
        class={{
          "gx-query-viewer-card-include-sparkline":
            this.includeSparkline && this.includeTrend
        }}
      >
        <span class="value" part="value">
          {this.value}
        </span>
        <h1 class="title" part="title" id={this.queryViewerCardId}>
          {this.description}
        </h1>

        {this.includeSparkline && (
          <gx-query-viewer-chart
            class="card-sparkline"
            chartTitle={TITLE_OPTION}
            chartOptions={CHART_OPTION}
            seriesOptions={SERIES_OPTION as SeriesOptionsType[]}
            tooltipOptions={TOOLTIP_OPTION}
            legendOptions={LEGEND_OPTION}
            plotOptions={PLOT_OPTION}
            yaxisOptions={YAXIS_OPTION}
            xaxisOptions={XAXIS_OPTION}
          ></gx-query-viewer-chart>
        )}

        {this.includeTrend && (
          <i class="trend" part="trend" aria-hidden="true">
            {this.trendIcon}
          </i>
        )}

        {this.includeMaxMin && (
          <div class="values-container">
            <div class="div-value">
              <span class="max-min-value" part="max-min-value">
                {this.minValue}
              </span>
              <span class="max-min-value" part="max-min-value">
                {this.maxValue}
              </span>
            </div>
            <div class="div-title">
              <span class="max-min-title" part="max-min-title">
                Min.
              </span>
              <span class="max-min-title" part="max-min-title">
                Max.
              </span>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
