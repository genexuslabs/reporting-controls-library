import {
  // QueryViewerServiceDataRow,
  // QueryViewerServiceMetaDataData,
  QueryViewerServiceResponse
} from "@genexus/reporting-api";
import { Component, Element, Host, Prop, State, h } from "@stencil/core";
import {
  QueryViewerChartType,
  // QueryViewerDataType,
  QueryViewerOutputType,
  QueryViewerPlotSeries,
  QueryViewerSliderRange,
  QueryViewerTranslations,
  QueryViewerXAxisLabels
} from "@genexus/reporting-api";
import { getAllHighchartOptions, getChartGroup } from "./chart-utils";
import {
  ChartMetadataAndData,
  // XAxisDataType,
  processDataAndMetadata
} from "./processDataAndMetadata";

import { Options } from "highcharts";
import { ChartTypes } from "./chart-types";
import {
  AVERAGE_DAYS_PER_MONTH,
  GroupAndCompareTimeline,
  HOURS_PER_DAY,
  MILLISECONDS_PER_HOUR,
  SECONDS_PER_HOUR,
  // GroupAndCompareTimeline,
  fillHeaderAndFooter
} from "./highcharts-options";

const HEADER_ZOOM_BUTTON_CLASS =
  "gx-query-viewer-chart-controller__header-zoom-button";
const HEADER_ZOOM_BUTTON_CHECKED_CLASS =
  "gx-query-viewer-chart-controller__header-zoom-button--checked";

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

  private timelinePeriod: "PrevPeriod" | "PrevYear" = "PrevPeriod";
  private timelineGroupBy:
    | "Days"
    | "Weeks"
    | "Months"
    | "Quarters"
    | "Semesters"
    | "Years" = "Days";
  private timelineCompareWith = false;
  private chartComponent: HTMLGxQueryViewerChartElement;

  @Element() el: HTMLGxQueryViewerChartControllerElement;

  @State() zoom: number;

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

  private groupAndCompareTimeline() {
    GroupAndCompareTimeline(
      this.chartComponent,
      this.timelineCompareWith,
      this.timelinePeriod,
      this.timelineGroupBy,
      this.chartMetadataAndData.chart,
      this.serviceResponse.MetaData
    );
  }

  private handleComparePeriodChange = (event: CustomEvent) => {
    const value = event.detail.value;
    this.timelinePeriod = value;
    this.groupAndCompareTimeline();
  };

  // private handleGroupBy = (event: CustomEvent) => {
  //   const value = event.detail.value;
  //   this.timelineGroupBy = value;
  //   this.groupAndCompareTimeline();
  // };

  private handleCompareWithChange = (event: CustomEvent) => {
    const value: boolean = event.detail.target.checked;
    this.timelineCompareWith = value;
    this.groupAndCompareTimeline();
  };

  private updateCurrentPeriodZoom = async (
    event: CustomEvent<QueryViewerSliderRange>
  ) => {
    const minPercent = event.detail.start;
    const maxPercent = event.detail.end;
    if (minPercent === 0 && maxPercent === 100) {
      this.chartComponent.zoomOut();
    } else {
      const extremes = await this.chartComponent.getExtremes();
      const minDate =
        extremes.dataMin +
        (minPercent / 100) * (extremes.dataMax - extremes.dataMin);
      const maxDate =
        extremes.dataMin +
        (maxPercent / 100) * (extremes.dataMax - extremes.dataMin);
      // const redraw = !this.handleCompareChange;
      this.chartComponent.setExtremes(minDate, maxDate, true);
    }
    if (this.timelineCompareWith) {
      this.groupAndCompareTimeline();
    }
    // if (sliderResizingRight || sliderResizingLeft) {
    //   deselectZoom(prevClickedZoomId);
    //   prevClickedZoomId = null;
    // }
  };

  private changeZoomOptions = (event: CustomEvent) => {
    const zoomSelected = Number((event.target as HTMLInputElement).value);
    this.doZoom(zoomSelected);
  };

  private async doZoom(zoomFactor: number) {
    const extremes = await this.chartComponent.getExtremes();
    const maxDate = extremes.dataMax;
    let minDate;
    if (zoomFactor > 0) {
      minDate =
        maxDate -
        AVERAGE_DAYS_PER_MONTH *
          zoomFactor *
          HOURS_PER_DAY *
          SECONDS_PER_HOUR *
          MILLISECONDS_PER_HOUR;
    } else {
      minDate = extremes.dataMin;
      // ToDo: implement this
      // jQuery.each(charts, function (index, chart) {
      //   chart.zoomOut();
      // });
      // DisableCompareControls(firstChart.options.qv.viewerId, false);
    }
    // var redraw = (this.timelineCompareWith) ? false : true;
    await this.chartComponent.setExtremes(minDate, maxDate, true);
  }

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
              class={{
                [HEADER_ZOOM_BUTTON_CLASS]: true,
                [HEADER_ZOOM_BUTTON_CHECKED_CLASS]: this.zoom === 1
              }}
              caption="1m"
              value="1"
              name="zoom"
              checked={this.zoom === 1}
            ></gx-radio-option>
          )}
          {options.include2m && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class={{
                [HEADER_ZOOM_BUTTON_CLASS]: true,
                [HEADER_ZOOM_BUTTON_CHECKED_CLASS]: this.zoom === 2
              }}
              caption="2m"
              value="2"
              name="zoom"
              checked={this.zoom === 2}
            ></gx-radio-option>
          )}
          {options.include3m && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class={{
                [HEADER_ZOOM_BUTTON_CLASS]: true,
                [HEADER_ZOOM_BUTTON_CHECKED_CLASS]: this.zoom === 3
              }}
              caption="3m"
              value="3"
              name="zoom"
              checked={this.zoom === 3}
            ></gx-radio-option>
          )}
          {options.include6m && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class={{
                [HEADER_ZOOM_BUTTON_CLASS]: true,
                [HEADER_ZOOM_BUTTON_CHECKED_CLASS]: this.zoom === 6
              }}
              caption="6m"
              value="6"
              name="zoom"
              checked={this.zoom === 6}
            ></gx-radio-option>
          )}
          {options.include1y && (
            <gx-radio-option
              onInput={this.changeZoomOptions}
              class={{
                [HEADER_ZOOM_BUTTON_CLASS]: true,
                [HEADER_ZOOM_BUTTON_CHECKED_CLASS]: this.zoom === 12
              }}
              caption="1y"
              value="12"
              name="zoom"
              checked={this.zoom === 12}
            ></gx-radio-option>
          )}
          <gx-radio-option
            onInput={this.changeZoomOptions}
            class={{
              [HEADER_ZOOM_BUTTON_CLASS]: true,
              [HEADER_ZOOM_BUTTON_CHECKED_CLASS]: this.zoom === 0
            }}
            caption="All"
            value="0"
            name="zoom"
            checked={this.zoom === 0}
          ></gx-radio-option>
        </gx-radio-group>
      </div>
    );
  }

  // ToDo: Fix this function; it always returns the same graph when attempting to group by date
  // private renderGroupByCombo(options: {
  //   showYears: boolean;
  //   showSemesters: boolean;
  //   showQuarters: boolean;
  //   showMonths: boolean;
  //   showWeeks: boolean;
  //   showDays: boolean;
  //   showHours: boolean;
  //   showMinutes: boolean;
  // }) {
  //   const dataType = XAxisDataType(this.serviceResponse.MetaData);

  //   return (
  //     (options.showDays || dataType === QueryViewerDataType.Date) && (
  //       <gx-form-field
  //         class="gx-query-viewer-chart-controller__header-form-field"
  //         labelCaption="Group by"
  //         labelPosition="left"
  //       >
  //         <gx-select onInput={this.handleGroupBy}>
  //           <gx-select-option selected>Days</gx-select-option>
  //           {options.showWeeks && <gx-select-option>Weeks</gx-select-option>}
  //           {options.showMonths && <gx-select-option>Months</gx-select-option>}
  //           {options.showQuarters && (
  //             <gx-select-option>Quarters</gx-select-option>
  //           )}
  //           {options.showSemesters && (
  //             <gx-select-option>Semesters</gx-select-option>
  //           )}
  //           {options.showYears && <gx-select-option>Years</gx-select-option>}
  //         </gx-select>
  //       </gx-form-field>
  //     )
  //   );
  // }

  // ToDo: improve this implementation
  private renderFooter = (charts: Options[]) => [
    charts.map(({ pane, plotOptions }) => (
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
    ))
  ];

  private renderTimeline = (charts: Options[]) => [
    <header class="gx-query-viewer-chart-controller__header">
      {this.renderZoomOptions({
        include1m: true,
        include2m: true,
        include3m: true,
        include6m: true,
        include1y: true
      })}
      {/* {this.renderGroupByCombo({
        showYears: true,
        showSemesters: true,
        showQuarters: true,
        showMonths: true,
        showWeeks: true,
        showDays: true,
        showHours: true,
        showMinutes: true
      })} */}
      <div class="gx-query-viewer-chart-controller__header-compare-container">
        <gx-checkbox
          checked={false}
          accessibleName="Compare"
          onInput={this.handleCompareWithChange}
        ></gx-checkbox>

        <gx-form-field
          class="gx-query-viewer-chart-controller__header-form-field"
          labelCaption="Compare with"
          labelPosition="left"
        >
          <gx-select onInput={this.handleComparePeriodChange}>
            <gx-select-option selected>Previous period</gx-select-option>
            <gx-select-option>Previous year</gx-select-option>
          </gx-select>
        </gx-form-field>
      </div>
    </header>,
    <div class="gx-query-viewer-chart-controller__timeline-container">
      {charts.map(
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
            ref={el => (this.chartComponent = el)}
          ></gx-query-viewer-chart>
        )
      )}
    </div>,

    <footer>
      <gx-query-viewer-slider onChange={this.updateCurrentPeriodZoom}>
        {this.renderFooter(charts)}
      </gx-query-viewer-slider>
    </footer>
  ];

  render() {
    const charts = this.getChartsConfiguration();

    return (
      <Host
        class={{
          "gx-query-viewer-controller--timeline":
            this.chartMetadataAndData?.chartTypes.Timeline
        }}
        style={{ "--gx-query-viewer-chart-count": `${charts.length}` }}
      >
        {this.chartMetadataAndData?.chartTypes.Timeline
          ? this.renderTimeline(charts)
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
