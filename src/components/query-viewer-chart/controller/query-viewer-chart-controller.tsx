import { Component, h, Prop, Host } from "@stencil/core";
import {
  // QueryViewerServiceDataRow,
  // QueryViewerServiceMetaDataData,
  QueryViewerServiceResponse
} from "../../../services/types/service-result";
import {
  QueryViewerChartType,
  QueryViewerOutputType,
  QueryViewerPlotSeries,
  QueryViewerTranslations,
  QueryViewerXAxisLabels
} from "../../../common/basic-types";
import { processDataAndMetadata } from "./processDataAndMetadata";
import { IS_CHART_TYPE } from "./chart-types";
import { getAllHighchartOptions, getChartGroup } from "./chart-utils";

@Component({
  tag: "gx-query-viewer-chart-controller",
  styleUrl: "query-viewer-chart-controller.scss"
})
export class QueryViewerChart {
  /**
   * Allow selection
   */
  @Prop() readonly allowSelection: boolean;

  /**
   * If type == Chart, this is the chart type: Bar, Pie, Timeline, etc...
   */
  @Prop() readonly chartType: QueryViewerChartType;

  /**
   * A CSS class to set as the `gx-query-viewer-chart-controller` element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Timeline
   */
  @Prop() readonly plotSeries: QueryViewerPlotSeries;

  /**
   * Specifies the metadata and data that the control will use to render.
   */
  @Prop() readonly serviceResponse: QueryViewerServiceResponse;
  // @Watch("serviceResponse")
  // handleServiceResponseChange(newResponse: QueryViewerServiceResponse) {}

  /**
   * For translate the labels of the outputs
   */
  @Prop() readonly translations: QueryViewerTranslations;

  /**
   * if true show values on the graph
   */
  @Prop() readonly showValues: boolean;
  /**
   * Title of the QueryViewer
   */
  @Prop() readonly queryTitle: string;

  /**
   * Labels for XAxis
   */
  @Prop() readonly xAxisLabels: QueryViewerXAxisLabels;
  /**
   * if true the x Axes intersect at zero
   */
  @Prop() readonly xAxisIntersectionAtZero: boolean;

  /**
   * Y Axis title
   */
  @Prop() readonly yAxisTitle: string;

  connectedCallback() {
    // this.chartToRender = this.getChartsToRender(this.serviceResponse);
  }

  private getChartsConfiguration() {
    if (!this.serviceResponse) {
      return [];
    }

    const chartTypes = IS_CHART_TYPE(this.chartType, null, this.plotSeries);
    const chartMetadataAndData = processDataAndMetadata(
      this.serviceResponse,
      QueryViewerOutputType.Chart,
      this.chartType,
      chartTypes,
      this.translations
    );
    const chartGroupLower = getChartGroup(this.chartType);
    if (chartMetadataAndData.error) {
      return null;
    }

    // splitChartContainer(qViewer);
    const arrOptions = getAllHighchartOptions(
      chartMetadataAndData.chart,
      this.serviceResponse.MetaData,
      QueryViewerOutputType.Chart,
      this.chartType, // WA to fix undefined prop
      chartTypes,
      chartGroupLower,
      this.allowSelection,
      this.showValues,
      this.xAxisLabels || QueryViewerXAxisLabels.Horizontally, // WA to fix undefined prop
      this.xAxisIntersectionAtZero,
      this.yAxisTitle,
      this.queryTitle,
      // ToDo: add implementation for RTL
      false
    );
    // AddHighchartsCSSRules(qViewer);
    // ToDo: Add translations
    // SetHighchartsOptions();
    // const HCCharts = [];
    // for (let serie = 0; serie < arrOptions.length; serie++) {
    // HCChart = new highcharts.Chart(
    //   arrOptions[serie]
    //   // ToDo: Add support for ItemClick
    //   // HCFinishedLoadingCallback
    // );
    // HCCharts.push(HCChart);
    // }
    // qViewer.Charts = HCCharts;
    // if (IsTimelineChart(qViewer)) {
    //   FillHeaderAndFooter(HCCharts, arrOptions);
    // }
    // qViewer._ControlRenderedTo = qViewer.RealType;
    // qv.util.hideActivityIndicator(qViewer);
    return arrOptions;
  }

  render() {
    const charts = this.getChartsConfiguration();

    return (
      <Host>
        {charts.map(
          ({
            chart,
            // credits,
            legend,
            title,
            // subtitle,
            // pane,
            xAxis,
            yAxis,
            plotOptions,
            tooltip,
            series
          }) => (
            <gx-query-viewer-chart
              class={{ [`${this.cssClass}__chart`]: !!this.cssClass }}
              // translations={this.translations}
              chartTitle={title}
              chartOptions={chart}
              seriesOptions={series}
              tooltipOptions={tooltip}
              legendOptions={legend}
              plotOptions={plotOptions}
              yaxisOptions={yAxis}
              xaxisOptions={xAxis}
            ></gx-query-viewer-chart>
          )
        )}
      </Host>
    );
  }
}
