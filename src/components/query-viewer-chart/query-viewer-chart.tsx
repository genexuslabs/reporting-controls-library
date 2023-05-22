import { Component, Prop, h, Host, Element } from "@stencil/core";
import {
  Chart,
  TitleOptions,
  ChartOptions,
  SeriesOptionsType,
  TooltipOptions,
  LegendOptions,
  PlotOptions,
  YAxisOptions,
  XAxisOptions
} from "highcharts";

let autoQueryViewerChartId = 0;
@Component({
  tag: "gx-query-viewer-chart",
  shadow: true
})
export class QueryViewerChart {
  private queryViewerChartId: string;
  private chartContainer: HTMLDivElement;
  private chartHC: Chart;

  @Element() element: HTMLGxQueryViewerChartElement;

  /**
   * Name of the element
   */
  @Prop() readonly chartTitle: TitleOptions;

  /**
   * Title that will be displayed on top of the query
   */
  @Prop() readonly chartOptions: ChartOptions;

  /**
   * Options of the chart.
   */
  @Prop() readonly tooltipOptions: TooltipOptions;

  /**
   * Options of the tooltip, the tooltip appears when hovering over a point in a series.
   */
  @Prop() readonly legendOptions: LegendOptions;

  /**
   * Options of the legend, the legend displays the series in a chart with a predefined symbol and the name of the series.
   */
  @Prop() readonly plotOptions: PlotOptions;

  /**
   * Options of the plot for each series type chart.
   */
  @Prop() readonly yaxisOptions: YAxisOptions;

  /**
   * Options of the Y axis (usually this is the vertical axis).
   */
  @Prop() readonly xaxisOptions: XAxisOptions;

  /**
   * Options of the X axis (usually this is the horizontal axis).
   */
  @Prop() readonly seriesOptions: SeriesOptionsType[];

  componentDidLoad() {
    this.chartHC = new Chart(
      this.chartContainer,
      {
        chart: this.chartOptions,
        title: this.chartTitle,
        xAxis: this.xaxisOptions,
        yAxis: this.yaxisOptions,
        legend: this.legendOptions,
        tooltip: this.tooltipOptions,
        plotOptions: this.plotOptions,
        series: this.seriesOptions,
        credits: {
          enabled: false
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    );
    if (this.chartHC) {
      // console.log("Works");
    }
  }

  componentWillLoad() {
    // Sets IDs
    if (!this.queryViewerChartId) {
      this.queryViewerChartId =
        this.element.id ||
        `gx-query-viewer-card-auto-id-${autoQueryViewerChartId++}`;
    }
  }

  render() {
    return (
      <Host
        role="article"
        aria-labelledby={this.queryViewerChartId}
        class={"gx-query-viewer-chart"}
      >
        <div ref={el => (this.chartContainer = el as HTMLDivElement)}> </div>
      </Host>
    );
  }
}
