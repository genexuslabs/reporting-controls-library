import { Component, h, Prop, Host, Element } from "@stencil/core";
import {
  // QueryViewerServiceDataRow,
  // QueryViewerServiceMetaDataData,
  QueryViewerServiceResponse
} from "../../../services/types/service-result";
import {
  QueryViewerChartType,
  QueryViewerDataType,
  QueryViewerOutputType,
  QueryViewerPlotSeries,
  QueryViewerSliderRange,
  QueryViewerTranslations,
  QueryViewerXAxisLabels
} from "../../../common/basic-types";
import {
  ChartMetadataAndData,
  XAxisDataType,
  processDataAndMetadata
} from "./processDataAndMetadata";
import { getAllHighchartOptions, getChartGroup } from "./chart-utils";

import {
  // GroupAndCompareTimeline,
  fillHeaderAndFooter
} from "./highcharts-options";
import { Options } from "highcharts";
import { ChartTypes } from "./chart-types";

@Component({
  tag: "gx-query-viewer-chart-controller",
  styleUrl: "query-viewer-chart-controller.scss"
})
export class QueryViewerChart {
  private chartMetadataAndData: {
    error: string;
    chart: ChartMetadataAndData;
    chartTypes: ChartTypes;
  };

  // private timelineCompareWith = false;
  private chartComponent: HTMLGxQueryViewerChartElement;

  @Element() el: HTMLGxQueryViewerChartControllerElement;
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
    this.chartMetadataAndData = processDataAndMetadata(
      this.serviceResponse,
      QueryViewerOutputType.Chart,
      this.chartType,
      this.plotSeries,
      this.translations
    );
    const chartGroupLower = getChartGroup(this.chartType);
    if (this.chartMetadataAndData.error) {
      return null;
    }

    // splitChartContainer(qViewer);
    const arrOptions = getAllHighchartOptions(
      this.chartMetadataAndData.chart,
      this.serviceResponse.MetaData,
      QueryViewerOutputType.Chart,
      this.chartType, // WA to fix undefined prop
      this.chartMetadataAndData.chartTypes,
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

  private handlePeriodChange = (event: CustomEvent<{ value: string }>) => {
    console.log(event.detail.value);
    return event;
  };

  private handleGroupBy = (event: CustomEvent) => {
    console.log(event);
    return event;
  };

  private handleCompareChange = (event: CustomEvent) => {
    console.log(event);
    return event;
  };

  private updateZoom = async (event: CustomEvent<QueryViewerSliderRange>) => {
    const minPercent = event.detail.start;
    const maxPercent = event.detail.end;
    if (minPercent === 0 && maxPercent === 100) {
      this.chartComponent.zoomOut();
    } else {
      const extremes = this.chartComponent.getExtremes();
      const minDate =
        (await extremes).dataMin +
        (minPercent / 100) *
          ((await extremes).dataMax - (await extremes).dataMin);
      const maxDate =
        (await extremes).dataMin +
        (maxPercent / 100) *
          ((await extremes).dataMax - (await extremes).dataMin);
      // const redraw = !this.handleCompareChange;
      this.chartComponent.setExtremes(minDate, maxDate, true);
    }
    if (this.handleCompareChange) {
      // GroupAndCompareTimeline(
      //   this.chartComponent,
      //   this.handleCompareChange,
      //   this.handlePeriodChange,
      //   this.handleGroupBy,
      //   this.chartMetadataAndData,
      //   this.chartMetadataAndData.chartTypes,
      //   this.serviceResponse.MetaData
      // );
    }
    // if (sliderResizingRight || sliderResizingLeft) {
    //   deselectZoom(prevClickedZoomId);
    //   prevClickedZoomId = null;
    // }
  };

  private changeZoomOptions = (event: CustomEvent) => {
    console.log((event.target as HTMLInputElement).value);
  };

  private renderZoomOptions(options: {
    include1m: boolean;
    include2m: boolean;
    include3m: boolean;
    include6m: boolean;
    include1y: boolean;
  }) {
    return (
      <div class="gx-query-viewer-chart-controller__header-zoom-options">
        <span>Zoom</span>
        <gx-radio-group>
          {options.include1m && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class="gx-query-viewer-chart-controller__header-zoom-button"
              caption="1m"
              value="1m"
            ></gx-radio-option>
          )}
          {options.include2m && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class="gx-query-viewer-chart-controller__header-zoom-button"
              caption="2m"
              value="2m"
            ></gx-radio-option>
          )}
          {options.include3m && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class="gx-query-viewer-chart-controller__header-zoom-button"
              caption="3m"
              value="3m"
            ></gx-radio-option>
          )}
          {options.include6m && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class="gx-query-viewer-chart-controller__header-zoom-button"
              caption="6m"
              value="6m"
            ></gx-radio-option>
          )}
          {options.include1y && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class="gx-query-viewer-chart-controller__header-zoom-button"
              caption="1y"
              value="1y"
            ></gx-radio-option>
          )}
          <gx-radio-option
            onInput={this.changeZoomOptions}
            class="gx-query-viewer-chart-controller__header-zoom-button"
            caption="All"
            value="All"
          ></gx-radio-option>
        </gx-radio-group>
      </div>
    );
  }

  private renderGroupByCombo(options: {
    showYears: boolean;
    showSemesters: boolean;
    showQuarters: boolean;
    showMonths: boolean;
    showWeeks: boolean;
    showDays: boolean;
    showHours: boolean;
    showMinutes: boolean;
  }) {
    const dataType = XAxisDataType(this.serviceResponse.MetaData);

    return (
      (options.showDays || dataType === QueryViewerDataType.Date) && (
        <gx-form-field
          class="gx-query-viewer-chart-controller__header-form-field"
          labelCaption="Group by"
          labelPosition="left"
        >
          <gx-select onInput={this.handleGroupBy}>
            <gx-select-option selected>Days</gx-select-option>
            {options.showWeeks && <gx-select-option>Weeks</gx-select-option>}
            {options.showMonths && <gx-select-option>Months</gx-select-option>}
            {options.showQuarters && (
              <gx-select-option>Quarters</gx-select-option>
            )}
            {options.showSemesters && (
              <gx-select-option>Semesters</gx-select-option>
            )}
            {options.showYears && <gx-select-option>Years</gx-select-option>}
          </gx-select>
        </gx-form-field>
      )
    );
  }

  private renderTimeline =
    (charts: Options[]) =>
    ({
      chart,
      // credits,
      legend,
      title,
      subtitle,
      pane,
      xAxis,
      yAxis,
      plotOptions,
      tooltip,
      series
    }: Options) =>
      [
        <header class="gx-query-viewer-chart-controller__header">
          {this.renderZoomOptions({
            include1m: true,
            include2m: true,
            include3m: true,
            include6m: true,
            include1y: true
          })}
          {this.renderGroupByCombo({
            showYears: true,
            showSemesters: true,
            showQuarters: true,
            showMonths: true,
            showWeeks: true,
            showDays: true,
            showHours: true,
            showMinutes: true
          })}
          <div class="gx-query-viewer-chart-controller__header-compare-container">
            <gx-checkbox
              checked={false}
              accessibleName="Compare"
              onInput={this.handleCompareChange}
            ></gx-checkbox>

            <gx-form-field
              class="gx-query-viewer-chart-controller__header-form-field"
              labelCaption="Compare with"
              labelPosition="left"
            >
              <gx-select onInput={this.handlePeriodChange}>
                <gx-select-option selected>Previous period</gx-select-option>
                <gx-select-option>Previous year</gx-select-option>
              </gx-select>
            </gx-form-field>
          </div>
        </header>,
        <gx-query-viewer-chart
          ref={el => (this.chartComponent = el)}
          class={{ [`${this.cssClass}__chart`]: !!this.cssClass }}
          // translations={this.translations}
          chartTitle={title}
          subtitleOptions={subtitle}
          chartOptions={chart}
          seriesOptions={series}
          tooltipOptions={tooltip}
          paneOptions={pane}
          legendOptions={legend}
          plotOptions={plotOptions}
          yaxisOptions={yAxis}
          xaxisOptions={xAxis}
        ></gx-query-viewer-chart>,
        <footer>
          <gx-query-viewer-slider onChange={this.updateZoom}>
            <gx-query-viewer-chart
              slot="content"
              class={"gx-query-viewer-chart_timeline-footer"}
              // translations={this.translations}
              chartTitle={{ text: "" }}
              subtitleOptions={{ text: "" }}
              chartOptions={{ type: "line", height: 80 }}
              seriesOptions={fillHeaderAndFooter(this.chartType, charts)}
              tooltipOptions={{ enabled: false }}
              paneOptions={pane}
              legendOptions={{ enabled: false }}
              plotOptions={plotOptions}
              yaxisOptions={{ visible: false }}
              xaxisOptions={{ visible: false }}
            ></gx-query-viewer-chart>
          </gx-query-viewer-slider>
        </footer>
      ];

  render() {
    const charts = this.getChartsConfiguration();

    return (
      <Host>
        {this.chartMetadataAndData?.chartTypes.Timeline
          ? charts.map(this.renderTimeline(charts))
          : charts.map(
              ({
                chart,
                // credits,
                legend,
                title,
                subtitle,
                pane,
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
                  subtitleOptions={subtitle}
                  chartOptions={chart}
                  seriesOptions={series}
                  tooltipOptions={tooltip}
                  paneOptions={pane}
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
