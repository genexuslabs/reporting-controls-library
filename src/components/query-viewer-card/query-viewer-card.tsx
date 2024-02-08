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

import {
  QueryViewerTranslations,
  QueryViewerTranslationsLabels,
  QueryViewerTrendPeriod,
  TrendIcon
} from "@genexus/reporting-api";

let autoQueryViewerCardId = 0;

const TITLE_OPTION = {
  text: ""
};

const CHART_OPTION = {
  width: "128",
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
    lineWidth: 2,
    lineColor: "var(--gx-query-viewer-card-sparkline-color)",
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

const seriesOption = (data: number[][]) => [
  {
    type: "spline",
    data: data
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
   * Specifies the value to show in the card.
   */
  @Prop() readonly value: string;

  /**
   * Describe the content or purpose of the element set as Datum in the query
   * object.
   */
  @Prop() readonly description: string;

  /**
   * Specifies whether to include a trend mark for the values or not.
   */
  @Prop() readonly includeTrend: boolean = false;

  /**
   * Specifies whether to include a sparkline chart for the values or not.
   */
  @Prop() readonly includeSparkline: boolean = false;

  /**
   * Specifies whether to include the maximum and minimum values in the series.
   */
  @Prop() readonly includeMaxMin: boolean = false;

  /**
   * Specifies the maximum value in the series.
   */
  @Prop() readonly maxValue: string = "";

  /**
   * Specifies the minimum value in the series.
   */
  @Prop() readonly minValue: string = "";

  /**
   * For translate the labels of the outputs
   */
  @Prop() readonly translations: QueryViewerTranslations;

  /**
   * Specifies the icon used for the trend.
   */
  @Prop() readonly trendIcon: TrendIcon = "drag_handle";

  /**
   * If `includeTrend == true`, this attribute specifies the period of time to
   * calculate the trend.
   */
  @Prop() readonly trendPeriod: QueryViewerTrendPeriod =
    QueryViewerTrendPeriod.SinceTheBeginning;

  /**
   * Specifies the data used for the series of the sparkline.
   */
  @Prop() readonly seriesData: number[][] = [];

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
          "gx-query-viewer-card--sparkline":
            this.includeSparkline && !this.includeTrend,
          "gx-query-viewer-card--trend":
            !this.includeSparkline && this.includeTrend
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
            part="sparkline"
            chartTitle={TITLE_OPTION}
            chartOptions={CHART_OPTION}
            seriesOptions={seriesOption(this.seriesData) as SeriesOptionsType[]}
            tooltipOptions={TOOLTIP_OPTION}
            legendOptions={LEGEND_OPTION}
            plotOptions={PLOT_OPTION}
            yaxisOptions={YAXIS_OPTION}
            xaxisOptions={XAXIS_OPTION}
          ></gx-query-viewer-chart>
        )}

        {this.includeTrend && (
          <span
            aria-label={
              this.translations[
                ("GXPL_QViewer" +
                  this.trendPeriod +
                  "Trend") as QueryViewerTranslationsLabels
              ]
            }
            class="trend"
            part="trend"
            title={
              this.translations[
                ("GXPL_QViewer" +
                  this.trendPeriod +
                  "Trend") as QueryViewerTranslationsLabels
              ]
            }
          >
            {this.trendIcon}
          </span>
        )}

        {this.includeMaxMin && (
          <div class="values-container">
            <span class="max-min-value" part="max-min-value">
              {this.minValue}
            </span>
            <span class="max-min-value" part="max-min-value">
              {this.maxValue}
            </span>
            <span class="max-min-title" part="max-min-title">
              {this.translations.GXPL_QViewerCardMinimum}
            </span>
            <span class="max-min-title" part="max-min-title">
              {this.translations.GXPL_QViewerCardMaximum}
            </span>
          </div>
        )}
      </Host>
    );
  }
}
