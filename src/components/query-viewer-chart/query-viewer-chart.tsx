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

import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsFunnel from "highcharts/modules/funnel";
import HighchartsSolidGauge from "highcharts/modules/solid-gauge";

import {
  QueryViewerTranslations,
  // QueryViewerTranslationsLabels,
  QueryViewerChartType,
  QueryViewerPlotSeries,
  QueryViewerXAxisLabels
} from "../../common/basic-types";

@Component({
  tag: "gx-query-viewer-chart",
  styleUrl: "query-viewer-chart.scss",
  shadow: true
})
export class QueryViewerChart {
  private chartContainer: HTMLDivElement;
  private chartHC: Chart;

  @Element() element: HTMLGxQueryViewerChartElement;

  /**
   * Title that will be displayed on top of the query
   */
  @Prop() readonly chartOptions: ChartOptions;

  /**
   * Name of the element
   */
  @Prop() readonly chartTitle: TitleOptions;

  /**
   * Option of the chartType used to visualize and represent data.
   */
  @Prop() readonly chartType: QueryViewerChartType;

  /**
   * Options of the tooltip, the tooltip appears when hovering over a point in a series.
   */
  @Prop() readonly legendOptions: LegendOptions;

  /**
   * Options of the legend, the legend displays the series in a chart with a predefined symbol and the name of the series.
   */
  @Prop() readonly plotOptions: PlotOptions;

  /**
   * Specifies if the chart series are plotted together in the same chart or alone in separate charts.
   */
  @Prop() readonly plotSeries: QueryViewerPlotSeries;

  /**
   * Options of the X axis (usually this is the horizontal axis).
   */
  @Prop() readonly seriesOptions: SeriesOptionsType[];

  /**
   * Specifies whether the values for the data elements are shown in the chart or not.
   */
  @Prop() readonly showValues: boolean;

  /**
   * Options of the chart.
   */
  @Prop() readonly tooltipOptions: TooltipOptions;

  /**
   * For translate the labels of the outputs
   */
  @Prop() readonly translations: QueryViewerTranslations;

  /**
   * Specifies whether the X axis intersects the Y axis at zero or the intersection point is automatically calculated.
   */
  @Prop() readonly xAxisIntersectionAtZero: boolean;

  /**
   * Specifies if the labels in the X axis of a chart are shown horizontally or vertically.
   */
  @Prop() readonly xAxisLabels: QueryViewerXAxisLabels;

  /**
   * Options of the Y axis (usually this is the vertical axis).
   */
  @Prop() readonly xaxisOptions: XAxisOptions | XAxisOptions[];

  /**
   * X axis title, if specified.
   */
  @Prop() readonly xAxisTitle: string;

  /**
   * Options of the plot for each series type chart.
   */
  @Prop() readonly yaxisOptions: YAxisOptions | YAxisOptions[];

  /**
   * Y axis title, if specified.
   */
  @Prop() readonly yAxisTitle: string;

  componentDidRender() {
    Highcharts3d(Highcharts);
    HighchartsMore(Highcharts);
    HighchartsFunnel(Highcharts);
    HighchartsSolidGauge(Highcharts);

    this.chartHC = new Highcharts.Chart(
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

  render() {
    return (
      <Host>
        <div ref={el => (this.chartContainer = el as HTMLDivElement)}> </div>
      </Host>
    );
  }
}
