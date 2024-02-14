import {
  QueryViewerServiceMetaData,
  QueryViewerServiceMetaDataData
} from "@genexus/reporting-api";
import { trimUtil } from "@genexus/reporting-api";
import { getDay, getHours, getMinutes, getMonth, getYear } from "date-fns";
import {
  AlignValue,
  ChartOptions,
  ExtremesObject,
  Options as HighChartOptions,
  //   SelectEventObject,
  LegendOptions,
  Options,
  PaneBackgroundOptions,
  PaneOptions,
  PlotOptions,
  PointMarkerOptionsObject,
  SeriesLineOptions
  // ExtremesObject,
  // SeriesLineOptions
  ,
  SeriesOptionsType,
  SubtitleOptions,
  TooltipFormatterContextObject,
  TooltipOptions,
  XAxisOptions,
  XAxisPlotBandsOptions,
  YAxisOptions,
  YAxisPlotLinesOptions
} from "highcharts";
import {
  QueryViewerAggregationType,
  QueryViewerChartSerie,
  QueryViewerChartType,
  QueryViewerDataType,
  QueryViewerOutputType,
  QueryViewerVisible,
  QueryViewerXAxisLabels
} from "@genexus/reporting-api";
import { fromDateToString, fromStringToDateISO } from "../../../utils/date";
import {
  SelectionAllowed,
  TooltipFormatter,
  aggregate
} from "../../../utils/general";
import { ChartTypes, IS_CHART_TYPE } from "./chart-types";
import {
  ChartGroupLower,
  PieConnectorPosition,
  PieDataLabelsOptions,
  PieLabelPosition,
  getChartGroup
} from "./chart-utils";
import { ChartMetadataAndData, XAxisDataType } from "./processDataAndMetadata";

const DEFAULT_CHART_SPACING = 10;
export const HOURS_PER_DAY = 24;
export const SECONDS_PER_HOUR = 3600;
export const MILLISECONDS_PER_HOUR = 1000;
export const AVERAGE_DAYS_PER_MONTH = 30.42;
const AVERAGE_DAYS_PER_TWO_MONTHS = 60.83;
const AVERAGE_DAYS_PER_THREE_MONTHS = 91.25;
const AVERAGE_DAYS_PER_SIX_MONTHS = 182.5;
const AVERAGE_DAYS_PER_YEAR = 365;

const getSpacing = (chartTypes: ChartTypes) =>
  chartTypes.Timeline
    ? [DEFAULT_CHART_SPACING, 0, DEFAULT_CHART_SPACING, 0] // top, right, bottom, left
    : [
        DEFAULT_CHART_SPACING,
        DEFAULT_CHART_SPACING,
        DEFAULT_CHART_SPACING,
        DEFAULT_CHART_SPACING
      ];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function selectionEventHandler(_event: SelectEventObject): void {
//   //   if (typeof _avoidSelectionEventHandler === "undefined") {
//   //     _avoidSelectionEventHandler = false;
//   //   }
//   //   if (!_avoidSelectionEventHandler) {
//   //     // Desmarca el botón de zoom seleccionado cuando se hace un zoom seleccionando puntos en la gráfica
//   //     deselectZoom(prevClickedZoomId);
//   //     prevClickedZoomId = null;
//   //     if (event.xAxis) {
//   //       const qvOptions = event.target.options.qv;
//   //       var xAxis = event.xAxis[0];
//   //       const minPercent =
//   //         ((xAxis.min - qvOptions.dataMin) /
//   //           (qvOptions.dataMax - qvOptions.dataMin)) *
//   //         100;
//   //       const maxPercent =
//   //         ((xAxis.max - qvOptions.dataMin) /
//   //           (qvOptions.dataMax - qvOptions.dataMin)) *
//   //         100;
//   //       InitializeSlider(
//   //         event.target.options.qv.viewerId,
//   //         minPercent,
//   //         maxPercent
//   //       );
//   //     } else {
//   //       InitializeSlider(event.target.options.qv.viewerId, 0, 100);
//   //     }
//   //     const qViewer = qv.collection[event.target.options.qv.viewerId];
//   //     if (IsSplittedChart(qViewer)) {
//   //       let containers;
//   //       const containerId = qViewer.getContainerControl().id;
//   //       containers = jQuery("[id^=" + containerId + "_chart]");
//   //       const charts = [];
//   //       jQuery.each(containers, function (index, div) {
//   //         if (div.id != event.target.renderTo.id) {
//   //           const chart = jQuery("#" + div.id).highcharts();
//   //           charts.push(chart);
//   //         }
//   //       });
//   //       jQuery.each(charts, function (index, chart) {
//   //         if (event.xAxis) {
//   //           chart.get("xaxis").setExtremes(xAxis.min, xAxis.max);
//   //         } else {
//   //           _avoidSelectionEventHandler = true;
//   //           chart.zoomOut();
//   //           _avoidSelectionEventHandler = false;
//   //         }
//   //       });
//   //     }
//   //   }
// }

function getChartObject(
  type: QueryViewerChartType,
  chartTypes: ChartTypes
): ChartOptions {
  const chart: ChartOptions = {
    styledMode: true,
    spacing: getSpacing(chartTypes)
  };
  // ToDo: render container
  //   if (chartTypes.Splitted) {
  //     const viewerId = qViewer.userControlId();
  //     let baseId;
  //     if (IsTimelineChart(qViewer)) {
  //       baseId = centerId(viewerId);
  //     } else {
  //       baseId = viewerId;
  //     }
  //     chart.renderTo = document.getElementById(
  //       baseId + "_chart" + serieIndex.toString()
  //     );
  //   } else if (!IsTimelineChart(qViewer)) {
  //     chart.renderTo = qViewer.getContainerControl();
  //   } else {
  //     chart.renderTo = document.getElementById(centerId(qViewer.userControlId()));
  //   }

  if (!chartTypes.Combination) {
    chart.type = getChartGroup(type);
  }
  if (
    type === QueryViewerChartType.Radar ||
    type === QueryViewerChartType.FilledRadar ||
    type === QueryViewerChartType.PolarArea
  ) {
    chart.polar = true;
  } else if (
    type === QueryViewerChartType.Column3D ||
    type === QueryViewerChartType.StackedColumn3D ||
    type === QueryViewerChartType.Column3DLine
  ) {
    chart.options3d = {
      enabled: true,
      alpha: 15,
      beta: 15,
      depth: 50,
      viewDistance: 25
    };
  } else if (
    type === QueryViewerChartType.Pie3D ||
    type === QueryViewerChartType.Doughnut3D
  ) {
    chart.options3d = { enabled: true, alpha: 45, beta: 0 };
  } else if (chartTypes.Timeline) {
    // @ts-expect-error : ZoomType is not defined in the ChartOptions interface
    chart.zoomType = "x";
    chart.resetZoomButton = { theme: { display: "none" } };
    chart.events = {};
    // chart.events.selection = selectionEventHandler;
  }
  return chart;
}

function getNoCreditsObject() {
  return { enabled: false };
}

function getLegendObject(
  chartMetadataAndData: ChartMetadataAndData,
  chartTypes: ChartTypes,
  isRTL: boolean
): LegendOptions {
  return {
    enabled:
      (chartMetadataAndData.Series.DataFields.length > 1 &&
        !chartTypes.Splitted) ||
      chartTypes.SingleSerie,
    margin: 0,
    rtl: isRTL
  };
}

function getSubtitleObject(
  type: QueryViewerChartType,
  chartSerieName: string,
  chartTypes: ChartTypes,
  isRTL: boolean
): SubtitleOptions {
  if (
    chartTypes.Splitted &&
    (chartTypes.SingleSerie || type === QueryViewerChartType.CircularGauge)
  ) {
    return {
      text: chartSerieName,
      floating: true,
      align: isRTL ? "right" : "left",
      verticalAlign: "middle"
    };
  }
  return {};
}

function XAxisTitle(
  XAxisTitle: string,
  serviceResponseMetadata: QueryViewerServiceMetaData
) {
  if (XAxisTitle === "") {
    return XAxisTitle;
  }

  const xAxisTitles: string[] = [];
  // Se concatenan los títulos
  serviceResponseMetadata.axes.forEach(axis => {
    if (
      axis.visible === QueryViewerVisible.Yes ||
      axis.visible === QueryViewerVisible.Always
    ) {
      xAxisTitles.push(axis.title);
      // ToDo: Add translation to axis Title
    }
  });

  return xAxisTitles.join(", ");
}

function getXAxisObject(
  chartMetadataAndData: ChartMetadataAndData,
  serviceResponseMetadata: QueryViewerServiceMetaData,
  serieIndex: number,
  isRTL: boolean,
  type: QueryViewerChartType,
  chartTypes: ChartTypes,
  XAxisLabels: QueryViewerXAxisLabels
): XAxisOptions {
  const xAxis: XAxisOptions = {
    tickWidth: 1,
    tickLength: 10,
    reversed: isRTL
  };

  if (type === QueryViewerChartType.CircularGauge) {
    return xAxis;
  }

  const isDatetimeXAxis = chartTypes.DatetimeXAxis;
  if (
    type !== QueryViewerChartType.Radar &&
    type !== QueryViewerChartType.FilledRadar &&
    type !== QueryViewerChartType.PolarArea &&
    type !== QueryViewerChartType.LinearGauge &&
    type !== QueryViewerChartType.Sparkline
  ) {
    xAxis.title = {
      text: XAxisTitle(
        serviceResponseMetadata.data[0].title,
        serviceResponseMetadata
      )
    };
  } else {
    if (type === QueryViewerChartType.Sparkline && chartTypes.Splitted) {
      xAxis.title = {
        text: chartMetadataAndData.Series.ByIndex[serieIndex].Name
      };
    }
    xAxis.lineWidth = 0;
    if (type === QueryViewerChartType.Sparkline) {
      xAxis.tickPositions = [];
      xAxis.visible = false;
    }
    if (
      type === QueryViewerChartType.Radar ||
      type === QueryViewerChartType.FilledRadar
    ) {
      xAxis.tickmarkPlacement = "on";
    } else {
      xAxis.tickmarkPlacement = "between";
    }
  }

  if (type === QueryViewerChartType.LinearGauge) {
    // xAxis.visible = false;
    let widths;
    if (chartTypes.Splitted) {
      widths = linearGaugeWidths(1, 1);
    }
    xAxis.plotBands = [];
    for (let i = 0; i < chartMetadataAndData.Series.ByIndex.length; i++) {
      if (!chartTypes.Splitted || i === serieIndex) {
        // const chartSerie = chartMetadataAndData.Series.ByIndex[i];
        // eslint-disable-next-line max-depth
        if (!chartTypes.Splitted) {
          widths = linearGaugeWidths(
            chartMetadataAndData.Series.DataFields.length,
            i + 1
          );
        }
        const plotBand: XAxisPlotBandsOptions = {};
        // var color;
        // if (!qv.util.IsNullColor(chartSerie.Color)) {
        //   color = chartSerie.Color;
        // } else {
        //   color = chartSerie.Points[0].Color;
        // }
        // SetHighchartsColor(qViewer, plotBand, color, false);
        plotBand.from = widths.LowerExtreme;
        plotBand.to = widths.UpperExtreme;
        xAxis.plotBands.push(plotBand);
      }
    }
  }
  if (!isDatetimeXAxis) {
    xAxis.categories = [];
  }
  let anyCategoryLabel = false;

  chartMetadataAndData.Categories.Values.forEach((value, index) => {
    if (value.ValueWithPicture !== "") {
      anyCategoryLabel = true;
    }
    if (!isDatetimeXAxis) {
      xAxis.categories[index] = value.ValueWithPicture || value.Value; // WA TODO: UPDATE THIS TO ONLY BE "value.ValueWithPicture"
    }
  });

  if (!isDatetimeXAxis) {
    anyCategoryLabel = true;
    xAxis.labels = { enabled: anyCategoryLabel };

    if (
      XAxisLabels !== QueryViewerXAxisLabels.Horizontally &&
      !chartTypes.Bar &&
      !chartTypes.Polar
    ) {
      let angle;
      let offsetY;
      if (XAxisLabels === QueryViewerXAxisLabels.Vertically) {
        angle = 90;
        offsetY = 5;
      } else {
        angle = parseInt(XAxisLabels.replace("Rotated", ""));
        offsetY = 10;
      }
      xAxis.labels.rotation = 360 - angle;
      xAxis.labels.y = offsetY;
      xAxis.labels.align = "right";
    }
  } else {
    xAxis.type = "datetime";
    xAxis.id = "xaxis";
    xAxis.minRange = 1; // 1ms máximo zoom (el default es demasiado grande)
    const dataType = XAxisDataType(serviceResponseMetadata);
    if (
      dataType === QueryViewerDataType.Date &&
      chartMetadataAndData.Categories.MaxValue != null &&
      chartMetadataAndData.Categories.MinValue != null
    ) {
      const minDateX = fromStringToDateISO(
        chartMetadataAndData.Categories.MinValue
      );
      const maxDateX = fromStringToDateISO(
        chartMetadataAndData.Categories.MaxValue
      );
      if (
        maxDateX.getTime() - minDateX.getTime() <
        10 * HOURS_PER_DAY * SECONDS_PER_HOUR * MILLISECONDS_PER_HOUR
      ) {
        // Si el rango de fechas es menor a 10 dias, setea el intervalo del eje X cada un dia
        xAxis.tickInterval =
          HOURS_PER_DAY * SECONDS_PER_HOUR * MILLISECONDS_PER_HOUR;
      }
    }
  }

  // if (chartTypes.Polar) {
  //   xAxis.className = "highcharts-no-axis-line highcharts-yes-grid-line";
  // } // Clases no estándar de Highcharts
  // else if (type === QueryViewerChartType.Sparkline) {
  //   xAxis.className = "highcharts-no-axis-line highcharts-no-grid-line";
  // } // Clases no estándar de Highcharts

  if (
    type === QueryViewerChartType.Bar ||
    type === QueryViewerChartType.StackedBar ||
    type === QueryViewerChartType.StackedBar100
  ) {
    xAxis.opposite = isRTL;
  }

  return xAxis;
}

function SamePicture(chartMetadataAndData: ChartMetadataAndData) {
  if (chartMetadataAndData.Series.ByIndex.length === 0) {
    return false;
  }

  const picture = chartMetadataAndData.Series.ByIndex[0].Picture;

  for (let i = 1; i < chartMetadataAndData.Series.ByIndex.length; i++) {
    if (chartMetadataAndData.Series.ByIndex[i].Picture !== picture) {
      return false;
    }
  }
  return true;
}

function GetDatumByDataField(
  metadata: QueryViewerServiceMetaData,
  dataField: string
): QueryViewerServiceMetaDataData {
  for (let i = 0; i < metadata.data.length; i++) {
    if (metadata.data[i].dataField === dataField) {
      return metadata.data[i];
    }
  }
  return null;
}

function YAxisTitle(
  chartMetadataAndData: ChartMetadataAndData,
  yAxisTitle: string,
  result: QueryViewerServiceMetaData
): string {
  if (
    yAxisTitle === "" &&
    chartMetadataAndData.Series.DataFields.length === 1
  ) {
    return GetDatumByDataField(
      result,
      chartMetadataAndData.Series.DataFields[0]
    ).title;
  }
  return yAxisTitle;
}

// const HasYAxis = (chartTypes: ChartTypes) =>
//   !chartTypes.Circular && !chartTypes.Funnel && !chartTypes.Gauge;

function getYAxisObject(
  chartMetadataAndData: ChartMetadataAndData,
  result: QueryViewerServiceMetaData,
  chartSerie: QueryViewerChartSerie,
  isRTL: boolean,
  type: QueryViewerChartType,
  chartTypes: ChartTypes,
  yAxisTitle: string,
  xAxisIntersectionAtZero: boolean,
  seriesIndex: number
): YAxisOptions | YAxisOptions[] {
  const yAxis: YAxisOptions = {
    plotLines: [],
    plotBands: [],
    title: null
  };
  let yAxisArray: YAxisOptions[] = [];
  if (type === QueryViewerChartType.Sparkline) {
    yAxis["visible"] = false;
    return yAxis;
  }
  if (type === QueryViewerChartType.LinearGauge) {
    // yAxis["visible"] = false;
    // yAxis.grid = { enabled: false };
  }
  let yAxisName = null;
  if (type !== QueryViewerChartType.CircularGauge) {
    yAxisName = chartTypes.Splitted
      ? chartSerie.Name
      : YAxisTitle(chartMetadataAndData, yAxisTitle, result);
  }

  if (chartTypes.Combination && !chartTypes.Splitted) {
    yAxisArray = [
      { title: { text: yAxisName } },
      { title: { text: "" }, opposite: true } // El eje secundario por ahora no es posible setearle titulo
    ];
  } else {
    yAxis.title = { text: yAxisName };
  }
  // if (HasYAxis(chartTypes)) {
  // chartMetadataAndData.PlotBands.forEach(chartPlotBand => {
  //   if (chartSerie == null || chartSerie.Name === chartPlotBand.SeriesName) {
  //     if (
  //       chartPlotBand.From === chartPlotBand.To &&
  //       chartPlotBand.From != null
  //     ) {
  //       const plotLine = {
  //         value: chartPlotBand.From,
  //         width: 1,
  //         zIndex: 3
  //       };
  //       SetHighchartsColor(qViewer, plotLine, chartPlotBand.Color, false);
  //       yAxis.plotLines.push(plotLine);
  //     } else {
  //       const plotBand = {};
  //       SetHighchartsColor(qViewer, plotBand, chartPlotBand.Color, false);
  //       plotBand.from = !chartPlotBand.From
  //         ? Number.MIN_VALUE
  //         : chartPlotBand.From;
  //       plotBand.to = !chartPlotBand.To ? Number.MAX_VALUE : chartPlotBand.To;
  //       yAxis.plotBands.push(plotBand);
  //     }
  //   }
  // });

  if (
    chartTypes.Splitted ||
    chartMetadataAndData.Series.ByIndex.length === 1 ||
    SamePicture(chartMetadataAndData)
  ) {
    //   const firstSerie = chartTypes.Splitted
    //     ? chartSerie
    //     : chartMetadataAndData.Series.ByIndex[0];
    yAxis.labels = { formatter: ref => `${ref.value}` }; // TODO: Update this
    // ToDo: implement this
    //   yAxis.labels.formatter = () =>
    //     formatNumber(
    //       this.value,
    //       firstSerie.NumberFormat.DecimalPrecision,
    //       firstSerie.Picture,
    //       true
    //     );
  }

  if (
    type === QueryViewerChartType.Radar ||
    type === QueryViewerChartType.FilledRadar ||
    type === QueryViewerChartType.PolarArea
  ) {
    yAxis.min = 0;
    yAxis.gridLineInterpolation =
      type === QueryViewerChartType.Radar ||
      type === QueryViewerChartType.FilledRadar
        ? "polygon"
        : "circle";
  }
  if (chartTypes.Gauge) {
    yAxis.min = 0;
    yAxis.max = 0;
    // ToDo: Find the way to implement this
    for (
      let seriesIndexAux = 0;
      seriesIndexAux < chartMetadataAndData.Series.ByIndex.length;
      seriesIndexAux++
    ) {
      if (!chartTypes.Splitted || seriesIndexAux === seriesIndex) {
        const chartSerieAux =
          chartMetadataAndData.Series.ByIndex[seriesIndexAux];
        yAxis.max = Math.max(
          yAxis.max,
          (100 * chartSerieAux.MaximumValue) / chartSerieAux.TargetValue
        );
      }
    }
    if (type === QueryViewerChartType.LinearGauge || yAxis.max !== 100) {
      const plotLine: YAxisPlotLinesOptions = { value: 100 };
      // ToDo: check if this style works
      // plotLine.className = "highcharts-dashed-plot-line"; // Clase no estándar de Highcharts
      if (
        chartTypes.Splitted ||
        chartMetadataAndData.Series.DataFields.length === 1
      ) {
        const cs = chartTypes.Splitted
          ? chartSerie
          : chartMetadataAndData.Series.ByIndex[0];
        let y = 15;
        let x = 0;
        let align: AlignValue = "center";
        if (type === QueryViewerChartType.LinearGauge) {
          y = -10;
          x = -5;
          align = "right";
        }
        plotLine.label = {
          text: cs.TargetValue.toString(),
          verticalAlign: "bottom",
          rotation: 0,
          y: y,
          x: x,
          align: align
        };
      }
      yAxis.plotLines.push(plotLine);
    }
  }

  if (type === QueryViewerChartType.LinearGauge) {
    // yAxis.className = "highcharts-no-axis-line highcharts-no-grid-line"; // Clases no estándar de Highcharts
    yAxis.labels = { enabled: false };
  } else if (type === QueryViewerChartType.CircularGauge) {
    yAxis.lineWidth = 0;
    yAxis.tickPositions = [];
  }

  // Check the direction
  if (
    type === QueryViewerChartType.Bar ||
    type === QueryViewerChartType.StackedBar ||
    type === QueryViewerChartType.StackedBar100 ||
    type === QueryViewerChartType.LinearGauge
  ) {
    yAxis.reversed = isRTL;
  } else {
    yAxis.opposite = isRTL;
  }

  // Check series min and max values
  let anyPositiveValue = false;
  let anyNegativeValue = false;

  chartMetadataAndData.Series.ByIndex.forEach(chartSerieAux => {
    if (chartSerieAux.PositiveValues) {
      anyPositiveValue = true;
    }
    if (chartSerieAux.NegativeValues) {
      anyNegativeValue = true;
    }
  });
  if (!anyNegativeValue && !anyPositiveValue) {
    if (chartTypes.Combination && !chartTypes.Splitted) {
      yAxisArray = [
        { min: 0, max: 1 },
        { min: 0, max: 1 }
      ];
    } else {
      yAxis.min = 0;
      yAxis.max = 1;
    }
  } else if (xAxisIntersectionAtZero) {
    if (!anyNegativeValue) {
      if (chartTypes.Combination && !chartTypes.Splitted) {
        yAxisArray = [{ min: 0 }, { min: 0 }];
      } else {
        yAxis.min = 0;
      }
    }
    if (!anyPositiveValue) {
      if (chartTypes.Combination && !chartTypes.Splitted) {
        yAxisArray = [{ max: 0 }, { max: 0 }];
      } else {
        yAxis.max = 0;
      }
    }
  }
  return chartTypes.Combination && !chartTypes.Splitted ? yAxisArray : yAxis;
}

function NumberOfCharts(
  chartTypes: ChartTypes,
  chartMetadataAndData: ChartMetadataAndData
) {
  return chartTypes.Splitted
    ? chartMetadataAndData.Series.DataFields.length
    : 1;
}

function LinearGaugePlotHeight(
  chartTypes: ChartTypes,
  chartMetadataAndData: ChartMetadataAndData
) {
  let marginBottom;
  if (
    chartTypes.Splitted ||
    chartMetadataAndData.Series.DataFields.length === 1
  ) {
    // ToDo: improve this
    marginBottom = 60 * NumberOfCharts(chartTypes, chartMetadataAndData);
  } // por el título del eje Y
  else {
    // ToDo: improve this
    marginBottom = 80;
  } // por la leyenda

  // ToDo: implement this that change in function of the fontsize
  return marginBottom;
}

function getMarker(
  allowSelection: boolean,
  type: QueryViewerOutputType,
  chartType: QueryViewerChartType
): PointMarkerOptionsObject {
  const marker: PointMarkerOptionsObject = {
    radius: 3,
    symbol: "circle",
    states: { hover: { radius: 4 } }
  };
  if (SelectionAllowed(allowSelection, type, chartType)) {
    marker.states["select"] = { radius: 5, lineWidth: 1 };
  }
  return marker;
}

// ToDo: implement this, check the parameters
function connector90degrees(
  labelPosition: PieLabelPosition,
  connectorPosition: PieConnectorPosition,
  options: PieDataLabelsOptions
) {
  const connectorPadding = options.connectorPadding,
    touchingSliceAt = connectorPosition.touchingSliceAt,
    alignment = labelPosition.alignment;
  return [
    "M",
    labelPosition.x + (alignment === "left" ? 1 : -1) * connectorPadding,
    labelPosition.y,
    "L",
    touchingSliceAt.x,
    labelPosition.y,
    "L",
    touchingSliceAt.x,
    touchingSliceAt.y
  ];
}

function linearGaugeWidths(chartSeriesCount: number, serieNumber: number) {
  const width = 1 / chartSeriesCount / 2;
  const center = -0.5 + (serieNumber - 0.5) / chartSeriesCount;
  const lowerExtreme = 1;
  const upperExtreme = 1;
  return {
    Width: width,
    Center: center,
    LowerExtreme: lowerExtreme,
    UpperExtreme: upperExtreme
  };
}

// ToDo: implement this
// function CircularGaugeTooltipAndDataLabelFormatter(
//   evArg: any
//  chartTypes: ChartTypes,
//  chartMetadataAndData: ChartMetadataAndData
// ) {
// const seriesIndex = chartTypes.Splitted
//   ? evArg.series.chart.options.qv.seriesIndex
//   : evArg.series.index;
// const serie = chartMetadataAndData.Series.ByIndex[seriesIndex];
// const chartSize =
//   Math.min(
//     qViewer.getContainerControl().offsetHeight,
//     qViewer.getContainerControl().offsetWidth
//   ) / NumberOfCharts(qViewer);
// const fontSize = chartSize / 13;
// return qv.util.dom.createSpan(
//   null,
//   "",
//   "",
//   "",
//   {
//     color: GetColorStringFromHighchartsObject(qViewer, evArg),
//     fontSize: fontSize + "px"
//   },
//   null,
//   qv.util.formatNumber(evArg.point.y, 2, "ZZZZZZZZZZZZZZ9.99", true) + "%"
// ).outerHTML;
//   return evArg.point.y + "%";
// }

function getPlotOptionsObject(
  chartType: QueryViewerChartType,
  showValues: boolean,
  chartTypes: ChartTypes,
  chartGroupLower: ChartGroupLower,
  chartMetadataAndData: ChartMetadataAndData,
  allowSelection: boolean,
  type: QueryViewerOutputType
) {
  const plotOptions: PlotOptions = { series: { events: {} } };
  if (chartType === QueryViewerChartType.CircularGauge) {
    plotOptions.series.dataLabels = {
      enabled:
        (chartMetadataAndData.Series.DataFields.length === 1 && showValues) ||
        chartTypes.Splitted,
      y: 0,
      borderWidth: 0

      // ToDo: implement this
      // formatter: () => CircularGaugeTooltipAndDataLabelFormatter(this, qViewer)
    };
    plotOptions.series.marker = { enabled: false };
  } else if (showValues) {
    plotOptions.series.dataLabels = {
      enabled: true
      // ToDo: implement this
      // connectorColor: "#000000",
      // ToDo: implement this when picture will available
      // formatter: () => DataLabelFormatter(this, qViewer)
    };

    if (chartType === QueryViewerChartType.LinearGauge) {
      plotOptions.series.dataLabels.inside = true;
    }
  }
  if (chartTypes.Splitted && chartType !== QueryViewerChartType.CircularGauge) {
    plotOptions.series.point = {};
    plotOptions.series.point.events = {};
    // const highlightIfVisible = chartType !== QueryViewerChartType.LinearGauge;
    // ToDo: implement this
    // plotOptions.series.point.events.mouseOver = function () {
    //   syncPoints(
    //     qViewer,
    //     this.series.chart.container,
    //     this.index,
    //     true,
    //     highlightIfVisible
    //   );
    //  };
    // plotOptions.series.point.events.mouseOut = function () {
    //   syncPoints(
    //     qViewer,
    //     this.series.chart.container,
    //     this.index,
    //     false,
    //     highlightIfVisible
    //   );
    // };
  }
  // ToDo: implement this
  //   if (qViewer.ItemClick || qViewer.SelectionAllowed()) {
  //     plotOptions.series.events.click = onHighchartsItemClickEventHandler;
  //   } // Asocia el manejador para el evento click de la chart
  switch (chartGroupLower) {
    case "bar":
      plotOptions.bar = {};
      plotOptions.bar.borderRadius = 0;
      if (chartType === QueryViewerChartType.StackedBar) {
        plotOptions.series.stacking = "normal";
        plotOptions.bar.stacking = "normal";
      } else if (chartType === QueryViewerChartType.StackedBar100) {
        plotOptions.series.stacking = "percent";
        plotOptions.bar.stacking = "percent";
      }
      if (chartType === QueryViewerChartType.LinearGauge) {
        const widths = linearGaugeWidths(
          chartMetadataAndData.Series.DataFields.length,
          1
        );
        const width =
          widths.Width *
          LinearGaugePlotHeight(chartTypes, chartMetadataAndData);
        plotOptions.bar.pointWidth = width;
        plotOptions.bar.pointPadding = 0;
        plotOptions.bar.groupPadding = 0;
        let minValue = Number.MAX_VALUE;
        for (
          let i = 0;
          i < chartMetadataAndData.Series.DataFields.length;
          i++
        ) {
          const chartSerie = chartMetadataAndData.Series.ByIndex[i];
          const value =
            Number(chartSerie.Points[0].Value) / chartSerie.TargetValue;
          if (value < minValue) {
            minValue = value;
          }
        }
        // ToDo: implement this
        const minLength = minValue * 100;
        plotOptions.bar.borderRadius = Math.min(width / 2, minLength / 2);
      }
      break;
    case "column":
      plotOptions.column = {};
      plotOptions.column.borderRadius = 0;
      if (
        chartType === QueryViewerChartType.StackedColumn ||
        chartType === QueryViewerChartType.StackedColumn3D ||
        chartType === QueryViewerChartType.PolarArea
      ) {
        plotOptions.series.stacking = "normal";
        plotOptions.column.stacking = "normal";
      } else if (chartType === QueryViewerChartType.StackedColumn100) {
        plotOptions.series.stacking = "percent";
        plotOptions.column.stacking = "percent";
      }
      if (chartType === QueryViewerChartType.PolarArea) {
        plotOptions.column.pointPadding = 0;
        plotOptions.column.groupPadding = 0;
      }
      break;
    case "area":
      plotOptions.area = {};
      if (chartType === QueryViewerChartType.StepArea) {
        plotOptions.area.step = "center";
      }
      plotOptions.area.marker = getMarker(allowSelection, type, chartType);
      if (chartType === QueryViewerChartType.StackedArea) {
        plotOptions.area.stacking = "normal";
      } else if (chartType === QueryViewerChartType.StackedArea100) {
        plotOptions.area.stacking = "percent";
      }
      break;
    case "areaspline":
      plotOptions.areaspline = {};
      plotOptions.areaspline.marker = getMarker(
        allowSelection,
        type,
        chartType
      );
      break;
    case "line":
      plotOptions.line = {};
      plotOptions.line.marker = getMarker(allowSelection, type, chartType);
      if (chartType === QueryViewerChartType.StepLine) {
        plotOptions.line.step = "center";
      } else if (chartType === QueryViewerChartType.StepTimeline) {
        plotOptions.line.step = "left";
      }
      if (chartTypes.Timeline) {
        plotOptions.series.connectNulls = true;
      }
      // Para el caso de la time se setea esta configuracion para que la
      // Highcharts interpole los datos, evitando que se generen saltos (gaps)
      // en la la linea graficada. Cuando se tienen datos faltantes para el
      // eje x (fechas para las cuales no se obtuvieron datos)
      else if (chartType === QueryViewerChartType.StackedLine) {
        plotOptions.line.stacking = "normal";
      } else if (chartType === QueryViewerChartType.StackedLine100) {
        plotOptions.line.stacking = "percent";
      }
      break;
    case "spline":
      plotOptions.spline = {};
      plotOptions.spline.marker = getMarker(allowSelection, type, chartType);
      break;
    case "pie":
      plotOptions.pie = {
        borderRadius: 0
      };
      if (
        chartType === QueryViewerChartType.Doughnut ||
        chartType === QueryViewerChartType.Doughnut3D
      ) {
        plotOptions.pie.innerSize = "35%";
      }
      if (
        chartType === QueryViewerChartType.Pie3D ||
        chartType === QueryViewerChartType.Doughnut3D
      ) {
        plotOptions.pie.depth = 35;
      }
      plotOptions.pie.dataLabels = {
        enabled: showValues,
        connectorColor: "#c3c4c8",
        connectorShape: connector90degrees,
        format: "{point.y}"
      };
      plotOptions.pie.showInLegend = true;
      break;
    case "solidgauge":
      plotOptions.solidgauge = {};
      plotOptions.solidgauge.showInLegend = true;
      plotOptions.solidgauge.rounded = true;
      plotOptions.solidgauge.lineWidth = 1;
      break;
    case "funnel":
      plotOptions.funnel = {};
      plotOptions.funnel.showInLegend = true;
      plotOptions.funnel.dataLabels = {
        enabled: showValues,
        connectorColor: "#c3c4c8",
        connectorShape: connector90degrees
      };
      break;
    case "pyramid":
      plotOptions.pyramid = {};
      plotOptions.pyramid.showInLegend = true;
      plotOptions.pyramid.dataLabels = {
        enabled: showValues,
        connectorColor: "#c3c4c8",
        connectorShape: connector90degrees
      };
      break;
  }
  return plotOptions;
}

function Stacked100TooltipFormatter(
  evArg: TooltipFormatterContextObject,
  isRTL: boolean
) {
  const percentage = Math.round(evArg.point.percentage * 100) / 100;
  return isRTL
    ? `%${percentage}<b>: ${evArg.point.name || evArg.series.name}</b>`
    : `<b>${evArg.point.name || evArg.series.name}</b>: ${percentage}%`;
}

// ToDo: implement this
function PieTooltipFormatter(
  evArg: any,
  sharedTooltip: boolean,
  isRTL: boolean
) {
  // const qViewer = qv.collection[evArg.point.series.chart.options.qv.viewerId];
  if (!sharedTooltip) {
    const percentage = Math.round(evArg.point.percentage * 100) / 100;
    return isRTL
      ? "%" +
          percentage +
          "<b>: " +
          (evArg.point.name !== ""
            ? evArg.point.name
            : evArg.point.series.name) +
          "</b>"
      : "<b>" +
          (evArg.point.name !== ""
            ? evArg.point.name
            : evArg.point.series.name) +
          "</b>: " +
          percentage +
          "%";
  } else {
    // const hoverPoints = getHoverPoints(qViewer, evArg.point.index);
    // const x = hoverPoints.length > 0 ? hoverPoints[0].id : "";
    // const hasTitle = x !== "";
    const res = "";
    // if (hasTitle) {
    //   isRTL ? (res += GetBoldRightText(x)) : (res += GetBoldText(x));
    // }
    // for (let i = 0; i < hoverPoints.length; i++) {
    //   const point = hoverPoints[i];
    //   let percentage = Math.round(point.percentage * 100) / 100;
    //   if (isRTL) {
    //     res += (hasTitle || i > 0 ? "<br/>" : "") + "%" + percentage;
    //     res += " :" + point.series.name;
    //   } else {
    //     res += (hasTitle || i > 0 ? "<br/>" : "") + point.series.name + ": ";
    //     res += percentage + "%";
    //   }
    // }
    return res;
  }
}

// function secondsToText(seconds: number) {
//   let text;
//   // let picture = "ZZZZZZZZZZZZZZ9";
//   // let decimalPrecision = 0;
//   if (seconds < 60) {
//     // less than 1 minute
//     text = Math.round(seconds);
//     // qv.util.formatNumber(
//     //   Math.round(seconds),
//     //   decimalPrecision,
//     //   picture,
//     //   false
//     // ) +
//     // " " +
//     // qv.util.decapitalize(gx.getMessage("GXPL_QViewerSeconds"));
//   } else if (seconds < 60 * 60) {
//     // less than 1 hour
//     text = Math.round(seconds / 60);
//     // qv.util.formatNumber(
//     //   Math.round(seconds / 60),
//     //   decimalPrecision,
//     //   picture,
//     //   false
//     // ) +
//     // " " +
//     // qv.util.decapitalize(gx.getMessage("GXPL_QViewerMinutes"));
//   } else if (seconds < 60 * 60 * 24) {
//     // less than 1 day
//     text = Math.round(seconds / 60 / 60);
//     // qv.util.formatNumber(
//     //   Math.round(seconds / 60 / 60),
//     //   decimalPrecision,
//     //   picture,
//     //   false
//     // ) +
//     // " " +
//     // qv.util.decapitalize(gx.getMessage("GXPL_QViewerHours"));
//   } else if (seconds < 60 * 60 * 24 * 30.44) {
//     // less than 1 month
//     text = Math.round(seconds / 60 / 60 / 24);
//     // qv.util.formatNumber(
//     //   Math.round(seconds / 60 / 60 / 24),
//     //   decimalPrecision,
//     //   picture,
//     //   false
//     // ) +
//     // " " +
//     // qv.util.decapitalize(gx.getMessage("GXPL_QViewerDays"));
//   } else if (seconds < 60 * 60 * 24 * 365.25) {
//     // less than 1 year
//     text = Math.round(seconds / 60 / 60 / 24 / 30.44);
//     // qv.util.formatNumber(
//     //   Math.round(seconds / 60 / 60 / 24 / 30.44),
//     //   decimalPrecision,
//     //   picture,
//     //   false
//     // ) +
//     // " " +
//     // qv.util.decapitalize(gx.getMessage("GXPL_QViewerMonths"));
//   }
//   // more than 1 year
//   else {
//     text = Math.round(seconds / 60 / 60 / 24 / 365.25);
//     // qv.util.formatNumber(
//     //   Math.round(seconds / 60 / 60 / 24 / 365.25),
//     //   decimalPrecision,
//     //   picture,
//     //   false
//     // ) +
//     // " " +
//     // qv.util.decapitalize(gx.getMessage("GXPL_QViewerYears"));
//   }
//   return text.toString();
// }

// function GetDuration(point: any) {
//   const value = point.y;
//   const points = point.series.data;
//   const index = point.index;
//   let duration = "";
//   let max = index;
//   for (let i = index + 1; i < points.length; i++) {
//     if (points[i].y !== value) {
//       break;
//     }
//     max = i;
//   }
//   if (max < points.length - 1) {
//     max++;
//   }
//   let min = index;
//   for (let i = index - 1; i >= 0; i--) {
//     if (points[i].y !== value) {
//       break;
//     }
//     min = i;
//   }
//   const seconds = (points[max].x - points[min].x) / 1000;
//   duration = secondsToText(seconds);
//   // " (" +
//   // gx.getMessage("GXPL_QViewerDuration") +
//   // ": " +
//   // seconsdToText(seconds);
//   // + ")";
//   return duration;
// }

// ToDo: implement this
// function getHoverPoints(qViewer: any, index: number) {
//   let points = [];
//   for (let i = 0; i < qViewer.Charts.length; i++) {
//     for (let j = 0; j < qViewer.Charts[i].series.length; j++) {
//       let point = qViewer.Charts[i].series[j].data[index];
//       points.push(point);
//     }
//   }
//   return points;
// }

function DateTimeTooltipFormatter() {
  // evArg: any,
  // chartSeries: any,
  // chartTypes: ChartTypes,
  // chartType: QueryViewerChartType,
  // isRTL: boolean
  // let hoverPoints;
  // const viewerId = evArg.points[0].series.chart.options.qv.viewerId;
  // const qViewer = qv.collection[viewerId];
  // if (chartTypes.Splitted) {
  //   hoverPoints = getHoverPoints(qViewer, evArg.points[0].point.index);
  // } else {
  //   hoverPoints = [];
  // jQuery.each(evArg.points, function (index, point) {
  //   hoverPoints.push(point.point);
  // });
  // }
  // Agrupa la lista de puntos por índice de la serie
  // const pointsByStrIndex: any = {};
  // const compare = false;
  // const compare = gx.dom.el(viewerId + "_options_compare_enable").checked;
  // for (let i = 0; i < hoverPoints.length; i++) {
  //   const index = compare
  //     ? Math.trunc(hoverPoints[i].series.index / 2)
  //     : hoverPoints[i].series.index;
  //   let strIndex = index.toString();
  //   if (pointsByStrIndex[strIndex] === undefined) {
  //     pointsByStrIndex[strIndex] = [];
  //   }
  //   pointsByStrIndex[strIndex].push(hoverPoints[i]);
  // }
  const res = "";
  // let currentTotal = 0;
  // let previousTotal = 0;
  // let oldUtc;
  // let oldSeriesName;
  // for (let strIndex in pointsByStrIndex) {
  //   const seriesIndex = parseInt(strIndex);
  //   const serie = chartSeries[seriesIndex];
  //   const seriesName = serie.Name;
  //   const points = pointsByStrIndex[strIndex];
  //   for (let ind = 0; points[ind] !== undefined; ind++) {
  //     const p = points[ind];
  //     const utc = parseInt(p.real_x ? p.real_x : p.x);
  //     // if (p.real_x) {
  //     //   previousTotal += p.y;
  //     // } else {
  //     //   currentTotal += p.y;
  //     // }
  //     if (compare) {
  //       // eslint-disable-next-line max-depth
  //       if (oldSeriesName !== seriesName) {
  //         // isRTL
  //         //   ? (res += GetBoldRightText(seriesName) + "<br/>")
  //         //   : (res += GetBoldText(seriesName) + "<br/>");
  //         res += seriesName + "<br/>";
  //         oldSeriesName = seriesName;
  //       }
  //     } else if (oldUtc !== utc) {
  //       // isRTL
  //       //   ? (res += GetBoldRightText(p.name) + "<br/>")
  //       //   : (res += GetBoldText(p.name) + "<br/>");
  //       res += p.name + "<br/>";
  //       oldUtc = utc;
  //     }
  //     const duration =
  //       chartType === QueryViewerChartType.StepTimeline ? GetDuration(p) : "";
  //     let keySpan;
  //     const valueSpan = p.y;
  //     // const valueSpan = qv.util.dom.createSpan(
  //     //   null,
  //     //   "",
  //     //   "",
  //     //   "",
  //     //   {},
  //     //   null,
  //     //   formatNumber(
  //     //     p.y,
  //     //     serie.NumberFormat.DecimalPrecision,
  //     //     serie.Picture,
  //     //     false
  //     //   )
  //     // ).outerHTML;

  //     isRTL
  //       ? (keySpan = ": " + (compare ? p.name : seriesName))
  //       : (keySpan = (compare ? p.name : seriesName) + ": ");

  //     // (keySpan = qv.util.dom.createSpan(
  //     //     null,
  //     //     "",
  //     //     "",
  //     //     "",
  //     //     {},
  //     //     null,
  //     //     ": " + (compare ? p.name : seriesName)
  //     //   ).outerHTML)
  //     //
  //     // (keySpan = qv.util.dom.createSpan(
  //     //   null,
  //     //   "",
  //     //   "",
  //     //   "",
  //     //   {},
  //     //   null,
  //     //   (compare ? p.name : seriesName) + ": "
  //     // ).outerHTML);
  //     isRTL
  //       ? (res += duration + valueSpan + keySpan + "<br/>")
  //       : (res += keySpan + valueSpan + duration + "<br/>");
  //   }
  // }
  return res;
}

function getTooltipObject(
  chartType: QueryViewerChartType,
  chartTypes: ChartTypes,
  isRTL: boolean,
  showValues: boolean,
  chartMetadataAndData: ChartMetadataAndData,
  metadata: QueryViewerServiceMetaData
): TooltipOptions {
  const tooltip: TooltipOptions = {};
  if (chartTypes.Timeline) {
    tooltip.borderRadius = 1;
    tooltip.shadow = true;
    tooltip.shared = metadata.data.length > 1;
    tooltip.formatter = function () {
      if (metadata.data.length === 1) {
        return TooltipFormatter(this, chartTypes.Splitted, isRTL, chartTypes);
      } else {
        return DateTimeTooltipFormatter();
      }
    };
  } else if (
    chartType === QueryViewerChartType.StackedColumn100 ||
    chartType === QueryViewerChartType.StackedBar100 ||
    chartType === QueryViewerChartType.StackedArea100 ||
    chartType === QueryViewerChartType.StackedLine100
  ) {
    tooltip.formatter = function () {
      return Stacked100TooltipFormatter(this, isRTL);
    };
  } else if (chartTypes.Circular) {
    tooltip.formatter = function () {
      return PieTooltipFormatter(this, tooltip.shared, isRTL);
    };
  } else if (chartType === QueryViewerChartType.CircularGauge) {
    tooltip.enabled =
      (chartMetadataAndData.Series.DataFields.length > 1 || !showValues) &&
      !chartTypes.Splitted;
    // tooltip.formatter = function () {
    //   return CircularGaugeTooltipAndDataLabelFormatter(this);
    // };
    tooltip.valueSuffix = "%";
    tooltip.pointFormat =
      '<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>';

    tooltip.positioner = function (labelWidth) {
      return {
        x: (this.chart.plotWidth - labelWidth) / 2,
        y: this.chart.plotHeight / 2
      };
    };
  } else {
    tooltip.formatter = function () {
      return TooltipFormatter(this, chartTypes.Splitted, isRTL, chartTypes);
    };
  }
  tooltip.useHTML = isRTL;
  return tooltip;
}

function yearWith4Digits(xAxisDataType: QueryViewerDataType, name: string) {
  return xAxisDataType === QueryViewerDataType.Date
    ? name.length === 10
    : name.charAt(10) === " ";
}

function formatDate(
  dateStr: string,
  dateFormat: string,
  yearWith4Digits: boolean,
  includeMonth: boolean,
  includeDay: boolean
) {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(5, 2);
  const day = dateStr.slice(8, 2);
  let date = dateFormat;
  if (!includeMonth) {
    date = date.replace("M", "");
  }
  if (!includeDay) {
    date = date.replace("D", "");
  }
  let newDate = "";
  for (let i = 0; i < date.length; i++) {
    newDate += i === 0 ? "" : "/";
    newDate += date.charAt(i);
  }
  date = newDate.replace("Y", yearWith4Digits ? year : year.slice(2, 2));
  if (includeMonth) {
    date = date.replace("M", month);
  }
  if (includeDay) {
    date = date.replace("D", day);
  }
  return date;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getGroupStartPoint(
  dateStr: string,
  name: string,
  xAxisDataType: QueryViewerDataType,
  dateFormat: string,
  groupOption: string // Check this
) {
  let dateStrStartPoint;
  let nameStartPoint;
  if (dateStr !== "") {
    groupOption =
      groupOption ||
      (xAxisDataType === QueryViewerDataType.Date ? "Days" : "Seconds");
    let startingMonth = "";
    switch (groupOption) {
      case "Years":
        dateStrStartPoint = dateStr.slice(0, 4) + "-01-01";
        nameStartPoint = formatDate(
          dateStrStartPoint,
          dateFormat,
          yearWith4Digits(xAxisDataType, name),
          false,
          false
        );
        break;
      case "Months":
        dateStrStartPoint = dateStr.slice(0, 7) + "-01";
        nameStartPoint = formatDate(
          dateStrStartPoint,
          dateFormat,
          yearWith4Digits(xAxisDataType, name),
          true,
          false
        );
        break;
      case "Semesters":
        startingMonth = dateStr.slice(5, 2) <= "06" ? "01" : "07";
        dateStrStartPoint = dateStr.slice(0, 5) + startingMonth + "-01";
        const semester = dateStr.slice(5, 2) <= "06" ? "01" : "02";
        const dateStrSemester = dateStr.slice(0, 5) + semester + "-01";
        nameStartPoint = formatDate(
          dateStrSemester,
          dateFormat,
          yearWith4Digits(xAxisDataType, name),
          true,
          false
        );
        break;
      case "Quarters":
        startingMonth =
          dateStr.slice(5, 2) <= "03"
            ? "01"
            : dateStr.slice(5, 2) <= "06"
            ? "04"
            : dateStr.slice(5, 2) <= "09"
            ? "07"
            : "10";
        dateStrStartPoint = dateStr.slice(0, 5) + startingMonth + "-01";
        const quarter =
          dateStr.slice(5, 2) <= "03"
            ? "01"
            : dateStr.slice(5, 2) <= "06"
            ? "02"
            : dateStr.slice(5, 2) <= "09"
            ? "03"
            : "04";
        const dateStrQuarter = dateStr.slice(0, 5) + quarter + "-01";
        nameStartPoint = formatDate(
          dateStrQuarter,
          dateFormat,
          yearWith4Digits(xAxisDataType, name),
          true,
          false
        );
        break;
      case "Weeks":
        let date = fromStringToDateISO(dateStr);
        const dow = date.getDay();
        date = addDays(date, -86400 * dow);
        dateStrStartPoint = fromDateToString(date, false);
        nameStartPoint = formatDate(
          dateStrStartPoint,
          dateFormat,
          yearWith4Digits(xAxisDataType, name),
          true,
          true
        );
        break;
      case "Days":
        dateStrStartPoint =
          xAxisDataType === QueryViewerDataType.Date
            ? dateStr
            : dateStr.slice(0, 10);
        nameStartPoint =
          xAxisDataType === QueryViewerDataType.Date ? name : name.slice(0, 10);
        break;
      case "Hours":
        dateStrStartPoint = dateStr.slice(0, 13) + ":00:00";
        nameStartPoint = name.slice(0, 13) + ":00";
        break;
      case "Minutes":
        dateStrStartPoint = dateStr.slice(0, 16) + ":00";
        nameStartPoint = name.slice(0, 16);
        break;
      case "Seconds":
        dateStrStartPoint = dateStr;
        nameStartPoint = name;
        break;
    }
  } else {
    dateStrStartPoint = "";
    nameStartPoint = "";
  }
  return { dateStr: dateStrStartPoint, name: nameStartPoint };
}

function groupPoints(
  chartmetadataAndData: ChartMetadataAndData,
  chartSeriePoints: QueryViewerChartSerie,
  xAxisDataType: QueryViewerDataType,
  aggregation: QueryViewerAggregationType,
  groupOption: string
) {
  let lastStartPoint: { dateStr: string; name: string } = {
    dateStr: null,
    name: null
  };
  let pointAdd: { x: string; y: number; name: string };
  let currentYValues: number[] = [];
  let currentYQuantities: number[] = [];
  const points = [];
  chartSeriePoints.Points.forEach((point, index) => {
    const name = chartmetadataAndData.Categories.Values[index].ValueWithPicture;
    const xValue = chartmetadataAndData.Categories.Values[index].Value;
    let yValue;
    let yQuantity;
    if (point.Value != null) {
      if (aggregation === QueryViewerAggregationType.Count) {
        yValue = 0; // No se utiliza
        yQuantity = parseFloat(trimUtil(point.Value));
      } else if (aggregation === QueryViewerAggregationType.Average) {
        yValue = parseFloat(trimUtil(point.Value_N));
        yQuantity = parseFloat(trimUtil(point.Value_D));
      } else {
        yValue = parseFloat(trimUtil(point.Value));
        yQuantity = 1;
      }
    } else {
      yValue = null;
      yQuantity = 0;
    }
    const currentStartPoint = getGroupStartPoint(
      xValue,
      name,
      xAxisDataType,
      "", // ToDo: ver como obtener esto: gx.dateFormat,
      groupOption
    );
    if (currentStartPoint.dateStr === lastStartPoint.dateStr || index === 0) {
      if (yValue != null) {
        currentYValues.push(yValue);
        currentYQuantities.push(yQuantity);
      }
      if (index === 0) {
        lastStartPoint = currentStartPoint;
      }
    } else {
      pointAdd = {
        x: lastStartPoint.dateStr,
        y: aggregate(aggregation, currentYValues, currentYQuantities),
        name: lastStartPoint.name
      };
      points.push(pointAdd);
      lastStartPoint = currentStartPoint;
      currentYValues = [yValue];
      currentYQuantities = [yQuantity];
    }
  });
  if (currentYValues.length > 0 && currentYQuantities.length > 0) {
    pointAdd = {
      x: lastStartPoint.dateStr,
      y: aggregate(aggregation, currentYValues, currentYQuantities),
      name: lastStartPoint.name
    };
    points.push(pointAdd);
  }
  return points;
}

function getIndividualSerieObject(
  chartTypes: ChartTypes,
  chartType: QueryViewerChartType,
  chartMetadataAndData: ChartMetadataAndData,
  _serieIndex: number,
  chartSerie: QueryViewerChartSerie,
  metadata: QueryViewerServiceMetaData,
  groupOption: string
): SeriesOptionsType {
  // ToDo: check the correct type
  // const serie: SeriesOptionsType = { type: "line" };
  const serie: any = { type: undefined }; // WA to remove TypeScript error
  // if (chartTypes.Gauge) {
  //   serie = { type: "gauge" };
  // } else {
  //   serie = { type: "line" };
  // }
  // ToDo: implement this
  //   if (qViewer.ItemClick && qViewer.Metadata.Data[serieIndex].RaiseItemClick) {
  //     serie.className = "highcharts-drilldown-point";
  //   }
  serie.visible =
    chartSerie.Visible === QueryViewerVisible.Yes ||
    chartSerie.Visible === QueryViewerVisible.Always;
  // ToDo: implement this with the events
  //   serie.events = {
  //     legendItemClick: function (e) {
  //       if (chartSerie.Visible == QueryViewerVisible.Always) {
  //         e.preventDefault();
  //       } else {
  //         const runtimeElements = qv.chart.GetRuntimeMetadata(qViewer);
  //         const elementName =
  //           qViewer.Chart.Series.ByIndex[e.target.index].FieldName;
  //         const runtimeElement = qv.util.GetElementInCollection(
  //           runtimeElements,
  //           "Name",
  //           elementName
  //         );
  //         runtimeElement.Hidden = !runtimeElement.Hidden;
  //         qv.util.autorefresh.UpdateLayoutSameGroup(
  //           qViewer,
  //           runtimeElements,
  //           false
  //         );
  //       }
  //     }
  //   };
  if (chartTypes.Timeline) {
    serie.name = chartSerie.Name;
    serie.data = [];
    serie.turboThreshold = 0;
    // if (!qv.util.IsNullColor(chartSerie.Color)) {
    //   SetHighchartsColor(qViewer, serie, chartSerie.Color, true);
    // }
    const dataType = XAxisDataType(metadata);
    const points = groupPoints(
      chartMetadataAndData,
      chartSerie,
      dataType,
      chartSerie.Aggregation,
      groupOption
    );
    points.forEach((point, index) => {
      const name = point.name;
      const xValue = point.x;
      const value = point.y;
      const date = fromStringToDateISO(xValue);
      serie.data[index] = {
        x: date.getTime() - date.getTimezoneOffset() * 60000,
        y: value,
        name: name
      };
      // if (IsNullColor(chartSerie.Color)) {
      //   SetHighchartsColor(
      //     qViewer,
      //     serie.data[j],
      //     chartSerie.point.Color,
      //     true
      //   );
      // }
    });
  } else {
    let widths: {
      Width: number;
      Center: number;
      LowerExtreme: number;
      UpperExtreme: number;
    };
    if (chartType === QueryViewerChartType.CircularGauge) {
      if (chartTypes.Splitted) {
        widths = circularGaugeWidths(1, 1);
      } else {
        widths = circularGaugeWidths(
          chartMetadataAndData.Series.DataFields.length,
          _serieIndex + 1
        );
      }
    }
    serie.name = chartSerie.Name;
    serie.data = [];
    serie.turboThreshold = 0;
    // if (!qv.util.IsNullColor(chartSerie.Color)) {
    //   SetHighchartsColor(qViewer, serie, chartSerie.Color, true);
    // }
    if (
      chartType === QueryViewerChartType.Radar ||
      chartType === QueryViewerChartType.FilledRadar ||
      chartType === QueryViewerChartType.PolarArea
    ) {
      serie.pointPlacement =
        chartType === QueryViewerChartType.Radar ||
        chartType === QueryViewerChartType.FilledRadar
          ? "on"
          : null;
    }

    chartSerie.Points.forEach((point, index) => {
      let name = "";
      let value = point.Value
        ? parseFloat(trimUtil(point.Value).replace(",", "."))
        : null;

      if (chartTypes.Gauge) {
        value = (value / chartSerie.TargetValue) * 100;
      } else {
        // name = chartMetadataAndData.Categories.Values[index].ValueWithPicture;
        name = chartMetadataAndData.Categories.Values[index].Value; // WA TODO: UPDATE THIS TO ONLY BE "....ValueWithPicture"
      }

      serie.data[index] = {
        id: name,
        name: name,
        y: value
      };
      if (chartTypes.DatetimeXAxis) {
        const xValue = chartMetadataAndData.Categories.Values[index].Value;
        const date = fromStringToDateISO(xValue);
        serie.data[index].x = date.getTime() - date.getTimezoneOffset() * 60000;
        serie.data[index].id = date;
      }
      if (chartType === QueryViewerChartType.CircularGauge) {
        serie.data[index].radius = widths.UpperExtreme.toString() + "%";
        serie.data[index].innerRadius = widths.LowerExtreme.toString() + "%";
      }
      // if (chartType == QueryViewerChartType.CircularGauge) {
      //   let color;
      //   if (!qv.util.IsNullColor(chartSerie.Color)) {
      //     color = chartSerie.Color;
      //   } else {
      //     color = chartSerie.Points[0].Color;
      //   }
      //   // SetHighchartsColor(qViewer, serie.data[j], color, true);
      // } else if (qv.util.IsNullColor(chartSerie.Color)) {
      //   SetHighchartsColor(
      //     qViewer,
      //     serie.data[j],
      //     chartSerie.Points[j].Color,
      //     true
      //   );
      // }
    });
  }
  return serie;
}

function getSeriesObject(
  chartTypes: ChartTypes,
  chartMetadataAndData: ChartMetadataAndData,
  serieIndex: number,
  chartType: QueryViewerChartType,
  metadata: QueryViewerServiceMetaData,
  groupOption: string
): Array<SeriesOptionsType> {
  const series: SeriesOptionsType[] = [];
  for (
    let seriesIndexAux = 0;
    seriesIndexAux < chartMetadataAndData.Series.ByIndex.length;
    seriesIndexAux++
  ) {
    if (!chartTypes.Splitted || seriesIndexAux === serieIndex) {
      const chartSerie = chartMetadataAndData.Series.ByIndex[seriesIndexAux];
      const serie = getIndividualSerieObject(
        chartTypes,
        chartType,
        chartMetadataAndData,
        seriesIndexAux,
        chartSerie,
        metadata,
        groupOption
      );
      const k = serieIndex != null ? serieIndex : seriesIndexAux;
      if (chartTypes.Combination) {
        if (k % 2 === 0) {
          serie.type = "column";
          serie.yAxis = 0;
        } else {
          serie.type = "line";
          serie.yAxis = chartTypes.Splitted ? 0 : 1;
        }
      }
      series.push(serie);
    }
  }

  return series;
}

function circularGaugeWidths(chartSeriesCount: number, serieNumber: number) {
  const width = chartSeriesCount <= 3 ? 24 : 50 / (chartSeriesCount - 1) - 1; // Para que no pase más del 50% del Gauge hacia adentro;
  const center = 100 - (width + 1) * (serieNumber - 1);
  const lowerExtreme = center - width / 2;
  const upperExtreme = center + width / 2;

  return {
    Width: width,
    Center: center,
    LowerExtreme: lowerExtreme,
    UpperExtreme: upperExtreme
  };
}

function getPaneObject(
  chartType: QueryViewerChartType,
  chartTypes: ChartTypes,
  chartmetadataAndData: ChartMetadataAndData,
  serieIndex: number
): PaneOptions {
  if (chartType !== QueryViewerChartType.CircularGauge) {
    return {};
  }
  let widths;
  const pane: PaneOptions = { background: [] };
  if (chartTypes.Splitted) {
    widths = circularGaugeWidths(1, 1);
  }
  for (
    let seriesIndexAux = 0;
    seriesIndexAux < chartmetadataAndData.Series.ByIndex.length;
    seriesIndexAux++
  ) {
    if (!chartTypes.Splitted || seriesIndexAux === serieIndex) {
      // const chartSerie = chartmetadataAndData.Series.ByIndex[seriesIndexAux];
      const oneBackground: PaneBackgroundOptions = {};
      if (!chartTypes.Splitted) {
        widths = circularGaugeWidths(
          chartmetadataAndData.Series.DataFields.length,
          seriesIndexAux + 1
        );
      }
      oneBackground.outerRadius = widths.UpperExtreme.toString() + "%";
      oneBackground.innerRadius = widths.LowerExtreme.toString() + "%";
      // let color;
      // if (IsNullColor(chartSerie.Color)) {
      //   color = chartSerie.Color;
      // } else {
      //   color = chartSerie.Points[0].Color;
      // }
      // SetHighchartsColor(qViewer, oneBackground, color, false);
      oneBackground.borderWidth = 0;
      pane.background.push(oneBackground);
    }
  }
  return pane;
}

/** ********** Comienzo Timeline **********/

function getTimelineFooterChartOptions(
  chartType: QueryViewerChartType,
  arrOptions: Options[]
) {
  const groupChart = IS_CHART_TYPE(chartType, null, null);
  const series: SeriesOptionsType[] = [];
  if (!groupChart.Splitted) {
    arrOptions[0].series.forEach(serie => {
      series.push(serie);
    });
  } else {
    arrOptions.forEach(option => {
      series.push(option.series[0]);
    });
  }
  return series;
}

function getTimeValue(
  zoom: string,
  extremes: ExtremesObject,
  tmpDate: Date
): number {
  const zoomMapping: Record<string, (date: Date) => number> = {
    "1m": date => date.setMonth(date.getMonth() + 1),
    "2m": date => date.setMonth(date.getMonth() + 2),
    "3m": date => date.setMonth(date.getMonth() + 3),
    "6m": date => date.setMonth(date.getMonth() + 6),
    "12m": date => date.setFullYear(date.getFullYear() + 1)
  };

  return zoomMapping[zoom]
    ? zoomMapping[zoom](tmpDate)
    : tmpDate.getTime() + (extremes.max - extremes.min);
}

export async function GroupAndCompareTimeline(
  chart: HTMLGxQueryViewerChartElement,
  compare: boolean,
  period: string,
  groupBy: string,
  chartmetadataAndData: ChartMetadataAndData,
  // chartTypes: ChartTypes,
  metadata: QueryViewerServiceMetaData
) {
  // Obtiene el tipo de periodo contra el que se quiere comparar
  const extremes: ExtremesObject = await chart.getExtremes();
  // ToDo: check if this fixed applied
  if (extremes.userMin !== undefined) {
    extremes.min = extremes.userMin;
  } // Sin esto, la llamada a setextremes (con redraw en false) realizado en el zoom no actualiza el min hasta el próximo dibujado.
  if (extremes.userMax !== undefined) {
    extremes.max = extremes.userMax;
  } // Sin esto, la llamada a setextremes (con redraw en false) realizado en el zoom no actualiza el min hasta el próximo dibujado.

  let minDateCompare: any;
  let maxDateCompare: any;

  if (compare) {
    if (period === "PrevPeriod") {
      maxDateCompare = new Date(extremes.min);
      minDateCompare = new Date(extremes.min - (extremes.max - extremes.min));
    } else if (period === "PrevYear") {
      minDateCompare = new Date(extremes.min);
      minDateCompare = new Date(
        minDateCompare.setFullYear(minDateCompare.getFullYear() - 1)
      );
      maxDateCompare = new Date(extremes.max);
      maxDateCompare = new Date(
        maxDateCompare.setFullYear(maxDateCompare.getFullYear() - 1)
      );
    }
    minDateCompare = minDateCompare.getTime();
    maxDateCompare = maxDateCompare.getTime();

    // hideZoom(viewerId + "_Zoom_0m"); // Si esta habilitada la comparación oculto el zoom all
  } else {
    // showZoom(viewerId + "_Zoom_0m");
  }

  // Elimina todas las series existentes de la grafica
  // jQuery.each(charts, function (index, chart) {
  //   const series_colorIndexes = [];
  //   while (chart.series.length > 0) {
  //     if (!chart.options.qv.colorIndexesUsed) {
  //       series_colorIndexes.push(chart.series[0].colorIndex);
  //     }
  //     chart.series[0].remove(true);
  //   }
  //   if (!chart.options.qv.colorIndexesUsed) {
  //     chart.options.qv.colorIndexesUsed = series_colorIndexes;
  //   }
  // });

  // Carga las series con los datos que correspondan
  chartmetadataAndData.Series.ByIndex.forEach(async (_seriesIndex, index) => {
    const chartSerie = chartmetadataAndData.Series.ByIndex[index];
    const seriesName = chartSerie.Name;
    let serieColorIndex;
    // if (chartTypes.Splitted) {
    // chart = charts[index];
    // serieColorIndex = chart.options.qv.colorIndexesUsed[0];
    // } else {
    // chart = charts[0];
    // serieColorIndex = chart.options.qv.colorIndexesUsed[index];
    // }

    // Serie con el periodo seleccionado por el usuario
    const serieOfUser: SeriesLineOptions = {
      type: "line",
      turboThreshold: 0,
      colorIndex: serieColorIndex,
      id: seriesName + "1",
      name: seriesName,
      data: []
    };

    let serieToCompare: SeriesLineOptions;

    if (compare) {
      // Serie con el periodo contra el que se va a comparar
      serieToCompare = {
        className: "highcharts-dashed-series-line",
        type: "line",
        turboThreshold: 0,
        colorIndex: serieColorIndex,
        id: seriesName + "2",
        name: seriesName,
        data: []
      };
    }

    const points = groupPoints(
      chartmetadataAndData,
      chartSerie,
      XAxisDataType(metadata),
      chartSerie.Aggregation,
      groupBy
    );

    points.forEach(point => {
      const value = point.y;
      const date = fromStringToDateISO(point.x);
      const name = point.name;
      const timeValue1 = date.getTime() - date.getTimezoneOffset() * 60000;

      let timeValue2;
      const originalTimeValue =
        date.getTime() - date.getTimezoneOffset() * 60000;
      if (compare) {
        let addToSerie1 = false;
        let addToSerie2 = false;
        if (timeValue1 <= extremes.max && timeValue1 >= extremes.min) {
          addToSerie1 = true;
        }
        if (timeValue1 <= maxDateCompare && timeValue1 >= minDateCompare) {
          addToSerie2 = true;
          const tmpDate = new Date(timeValue1);
          if (period === "PrevPeriod") {
            timeValue2 = getTimeValue("", extremes, tmpDate);
          } else if (period === "PrevYear") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            timeValue2 = tmpDate.setFullYear(tmpDate.getFullYear() + 1);
          }
        }
        if (addToSerie1) {
          const point = { x: timeValue1, y: value, name: name };
          serieOfUser.data.push(point);
        }
        if (addToSerie2) {
          const point = {
            x: timeValue2,
            y: value,
            name: name,
            real_x: originalTimeValue
          };
          serieToCompare.data.push(point);
        }
      } else {
        serieOfUser.data.push({ x: timeValue1, y: value, name: name });
      }
    });
    await chart.addSeries(serieOfUser);
    if (compare) {
      await chart.addSeries(serieToCompare);
    }
  });
}

export async function optionsHeaderSelect(
  chart: HTMLGxQueryViewerChartElement
) {
  const extremes = await chart.getExtremes();

  const winTime = extremes.dataMax - extremes.dataMin;

  const minDate = fromStringToDateISO("");
  const maxDate = fromStringToDateISO("");
  minDate.setTime(extremes.dataMin + minDate.getTimezoneOffset() * 60000);
  maxDate.setTime(extremes.dataMax + maxDate.getTimezoneOffset() * 60000);

  const include1m =
    winTime >
    AVERAGE_DAYS_PER_MONTH *
      HOURS_PER_DAY *
      SECONDS_PER_HOUR *
      MILLISECONDS_PER_HOUR;
  const include2m =
    winTime >
    AVERAGE_DAYS_PER_TWO_MONTHS *
      HOURS_PER_DAY *
      SECONDS_PER_HOUR *
      MILLISECONDS_PER_HOUR;
  const include3m =
    winTime >
    AVERAGE_DAYS_PER_THREE_MONTHS *
      HOURS_PER_DAY *
      SECONDS_PER_HOUR *
      MILLISECONDS_PER_HOUR;
  const include6m =
    winTime >
    AVERAGE_DAYS_PER_SIX_MONTHS *
      HOURS_PER_DAY *
      SECONDS_PER_HOUR *
      MILLISECONDS_PER_HOUR;
  const include1y =
    winTime >
    AVERAGE_DAYS_PER_YEAR *
      HOURS_PER_DAY *
      SECONDS_PER_HOUR *
      MILLISECONDS_PER_HOUR;

  const showYears = getYear(minDate) !== getYear(maxDate);
  const showSemesters = getMonth(minDate) <= 6 && getMonth(maxDate) >= 7;
  const showQuarters =
    (getMonth(minDate) <= 3 && getMonth(maxDate) >= 4) ||
    (getMonth(minDate) <= 6 && getMonth(maxDate) >= 7) ||
    (getMonth(minDate) <= 9 && getMonth(maxDate) >= 10);
  const showMonths = getMonth(minDate) !== getMonth(maxDate);
  const showWeeks =
    minDate.getDate() - minDate.getDay() !==
    maxDate.getDate() - maxDate.getDay();
  const showDays = getDay(minDate) !== getDay(maxDate);
  const showHours = getHours(minDate) !== getHours(maxDate);
  const showMinutes = getMinutes(minDate) !== getMinutes(maxDate);

  return {
    include1m,
    include2m,
    include3m,
    include6m,
    include1y,
    showYears,
    showSemesters,
    showQuarters,
    showMonths,
    showWeeks,
    showDays,
    showHours,
    showMinutes
  };
}

export function fillHeaderAndFooter(
  chartType: QueryViewerChartType,
  charts: Options[]
) {
  ////////////////////////////////////////////////////////////////////////////////////////////
  // Event handlers para las opciones de "compare to past"
  ////////////////////////////////////////////////////////////////////////////////////////////

  // gx.dom.el(divOptions.id + "_compare_enable").onclick = function () {
  //   GroupAndCompareTimeline(charts);
  // };
  // gx.dom.el(divOptions.id + "_compare_options").onchange = function () {
  //   if (gx.dom.el(divOptions.id + "_compare_enable").checked) {
  //     GroupAndCompareTimeline(charts);
  //   }
  // };
  // gx.dom.el(divOptions.id + "_group_options").onchange = function () {
  //   GroupAndCompareTimeline(charts);
  // };

  // doZoom(zoomFactor);

  // //////////////////////////////////////////////////////////////////////////////////////////
  // Carga los links de zooms con los event handlers necesarios
  // Zoom automatico a x meses
  // const array_zooms = [0, 1, 2, 3, 6, 12];
  // for (const index in array_zooms) {
  //   const x = array_zooms[index];
  //   const zoomXm = gx.dom.el(viewerId + "_Zoom_" + x + "m");
  //   if (zoomXm) {
  //     zoomXm.onclick = doZoom.closure(zoomXm, [x]);
  //   }
  // }
  ////////////////////////////////////////////////////////////////////////////////////////////

  // Al final, se muestra un rango de fechas que despliegue un máximo de 20 puntos
  // const zoomFactor = getSuitableZoomFactor(firstChart.series[0].points, 20);
  // triggerZoom(zoomFactor);

  return getTimelineFooterChartOptions(chartType, charts);
}
/** **********  Fin Timeline **********/

const getTitleObject = (queryTitle: string, serieIndex: number) => ({
  text: (!serieIndex ? queryTitle : null) || null
});

export function getHighchartOptions(
  chartMetadataAndData: ChartMetadataAndData,
  serviceResponseMetadata: QueryViewerServiceMetaData,
  chartSerie: QueryViewerChartSerie,
  type: QueryViewerOutputType,
  chartType: QueryViewerChartType,
  chartTypes: ChartTypes,
  chartGroupLower: ChartGroupLower,
  serieIndex: number,
  allowSelection: boolean,
  showValues: boolean,
  xAxisLabels: QueryViewerXAxisLabels,
  xAxisIntersectionAtZero: boolean,
  yAxisTitle: string,
  queryTitle: string,
  isRTL: boolean
) {
  const groupOption =
    XAxisDataType(serviceResponseMetadata) === QueryViewerDataType.Date
      ? "Days"
      : "Seconds";

  const options: HighChartOptions = {
    chart: getChartObject(chartType, chartTypes),
    credits: getNoCreditsObject(),
    legend: getLegendObject(chartMetadataAndData, chartTypes, isRTL),
    title: getTitleObject(queryTitle, serieIndex),
    subtitle: getSubtitleObject(chartType, chartSerie?.Name, chartTypes, isRTL), // chartSerie is undefined unless chartTypes.Splitted === true
    pane: getPaneObject(
      chartType,
      chartTypes,
      chartMetadataAndData,
      serieIndex
    ),
    xAxis: getXAxisObject(
      chartMetadataAndData,
      serviceResponseMetadata,
      serieIndex,
      isRTL,
      chartType,
      chartTypes,
      xAxisLabels
    ),
    yAxis: getYAxisObject(
      chartMetadataAndData,
      serviceResponseMetadata,
      chartSerie,
      isRTL,
      chartType,
      chartTypes,
      yAxisTitle,
      xAxisIntersectionAtZero,
      serieIndex
    ),
    plotOptions: getPlotOptionsObject(
      chartType,
      showValues,
      chartTypes,
      chartGroupLower,
      chartMetadataAndData,
      allowSelection,
      type
    ),
    tooltip: getTooltipObject(
      chartType,
      chartTypes,
      isRTL,
      showValues,
      chartMetadataAndData,
      serviceResponseMetadata
    ),
    series: getSeriesObject(
      chartTypes,
      chartMetadataAndData,
      serieIndex,
      chartType,
      serviceResponseMetadata,
      groupOption
    )
  };

  return options;
}
