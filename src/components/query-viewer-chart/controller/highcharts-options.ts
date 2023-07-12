import {
  QueryViewerChartSerie,
  QueryViewerChartType,
  QueryViewerOutputType,
  QueryViewerVisible,
  QueryViewerXAxisLabels
} from "../../../common/basic-types";
import {
  Options as HighChartOptions,
  ChartOptions,
  //   SelectEventObject,
  LegendOptions,
  SubtitleOptions,
  XAxisOptions,
  YAxisOptions,
  YAxisPlotLinesOptions,
  AlignValue,
  PlotOptions,
  PointMarkerOptionsObject,
  TooltipOptions,
  TooltipFormatterContextObject,
  SeriesOptionsType,
  PaneOptions
} from "highcharts";
import { ChartTypes } from "./chart-types";
import { ChartGroupLower, getChartGroup } from "./chart-utils";
import { ChartMetadataAndData } from "./processDataAndMetadata";
import {
  QueryViewerServiceMetaData,
  QueryViewerServiceMetaDataData
} from "../../../services/types/service-result";
import { SelectionAllowed, TooltipFormatter } from "../../../utils/general";
import { trimUtil } from "../../../services/xml-parser/utils/general";

const DEFAULTCHARTSPACING = 10;
const getSpacing = (chartTypes: ChartTypes) =>
  chartTypes.Timeline
    ? [DEFAULTCHARTSPACING, 0, DEFAULTCHARTSPACING, 0] // top, right, bottom, left
    : [
        DEFAULTCHARTSPACING,
        DEFAULTCHARTSPACING,
        DEFAULTCHARTSPACING,
        DEFAULTCHARTSPACING
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
  if (XAxisTitle) {
    return XAxisTitle;
  }

  const xAxisTitles: string[] = [];
  // Se concatenan los títulos
  serviceResponseMetadata.Axes.forEach(axis => {
    if (
      axis.Visible === QueryViewerVisible.Yes ||
      axis.Visible === QueryViewerVisible.Always
    ) {
      xAxisTitles.push(axis.Title);
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
  // dataType: QueryViewerDataType
): XAxisOptions {
  const xAxis: XAxisOptions = {
    tickWidth: 1,
    tickLength: 10,
    reversed: isRTL || undefined
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
        serviceResponseMetadata.Data[0].Title,
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
    if (
      type === QueryViewerChartType.LinearGauge ||
      type === QueryViewerChartType.Sparkline
    ) {
      xAxis.tickPositions = [];
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

  //   if (type === QueryViewerChartType.LinearGauge) {
  //     let widths;
  //     if (IsSplittedChart(qViewer)) {
  //       widths = linearGaugeWidths(1, 1);
  //     }
  //     xAxis.plotBands = [];
  //     for (var i = 0; i < qViewer.Chart.Series.ByIndex.length; i++) {
  //       if (!IsSplittedChart(qViewer) || i === serieIndex) {
  //         const chartSerie = qViewer.Chart.Series.ByIndex[i];
  //         if (!IsSplittedChart(qViewer)) {
  //           widths = linearGaugeWidths(
  //             qViewer.Chart.Series.DataFields.length,
  //             i + 1
  //           );
  //         }
  //         plotBand = {};
  //         var color;
  //         if (!qv.util.IsNullColor(chartSerie.Color)) {
  //           color = chartSerie.Color;
  //         } else {
  //           color = chartSerie.Points[0].Color;
  //         }
  //         SetHighchartsColor(qViewer, plotBand, color, false);
  //         plotBand.from = widths.LowerExtreme;
  //         plotBand.to = widths.UpperExtreme;
  //         xAxis.plotBands.push(plotBand);
  //       }
  //     }
  //   }
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
    // ToDo: Para la timeline
    // if (
    //   dataType === QueryViewerDataType.Date &&
    //   chartMetadataAndData.Categories.MaxValue != null &&
    //   chartMetadataAndData.Categories.MinValue != null
    // ) {
    //   const minDate = new gx.date.gxdate(
    //     chartMetadataAndData.Categories.MinValue,
    //     "Y4MD"
    //   );
    //   const maxDate = new gx.date.gxdate(
    //     chartMetadataAndData.Categories.MaxValue,
    //     "Y4MD"
    //   );
    //   if (
    //     maxDate.Value.getTime() - minDate.Value.getTime() <
    //     10 * 24 * 3600 * 1000
    //   ) {
    //     xAxis.tickInterval = 24 * 3600 * 1000;
    //   }
    // }
  }
  //   if (chartTypes.Polar) {
  //     xAxis.className = "highcharts-no-axis-line highcharts-yes-grid-line";
  //   } // Clases no estándar de Highcharts
  //   else if (type === QueryViewerChartType.Sparkline) {
  //     xAxis.className = "highcharts-no-axis-line highcharts-no-grid-line";
  //   } // Clases no estándar de Highcharts

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
  for (let i = 1; i < metadata.Data.length; i++) {
    if (metadata.Data[i].DataField === dataField) {
      return metadata.Data[i];
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
    ).Title;
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
  xAxisIntersectionAtZero: boolean
): YAxisOptions {
  const yAxis: YAxisOptions = {
    plotLines: [],
    plotBands: [],
    title: null
  };
  if (type === QueryViewerChartType.Sparkline) {
    yAxis["visible"] = false;
    return yAxis;
  }

  let yAxisName = null;
  if (type !== QueryViewerChartType.CircularGauge) {
    yAxisName = chartTypes.Splitted
      ? chartSerie.Name
      : YAxisTitle(chartMetadataAndData, yAxisTitle, result);
  }

  if (chartTypes.Combination && !chartTypes.Splitted) {
    // ToDo: Refactor this because the type is wrong
    // yAxis = [
    //   { title: { text: yAxisName } },
    //   { title: { text: "" }, opposite: true } // El eje secundario por ahora no es posible setearle titulo
    // ];
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
    // for (
    //   let seriesIndexAux = 0;
    //   seriesIndexAux < chartMetadataAndData.Series.ByIndex.length;
    //   seriesIndexAux++
    // ) {
    //   if (!chartTypes.Splitted || seriesIndexAux === seriesIndex) {
    //     const chartSerieAux =
    //       chartMetadataAndData.Series.ByIndex[seriesIndexAux];
    //     yAxis.max = Math.max(
    //       yAxis.max,
    //       (100 * chartSerieAux.MaximumValue) / chartSerieAux.TargetValue
    //     );
    //   }
    // }
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
    yAxis.className = "highcharts-no-axis-line highcharts-no-grid-line"; // Clases no estándar de Highcharts
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
      // ToDo: Check wrong type
      //   yAxis[0].min = 0;
      //   yAxis[1].min = 0;
      //   yAxis[0].max = 1;
      //   yAxis[1].max = 1;
    } else {
      yAxis.min = 0;
      yAxis.max = 1;
    }
  } else if (xAxisIntersectionAtZero) {
    if (!anyNegativeValue) {
      if (chartTypes.Combination && !chartTypes.Splitted) {
        // ToDo: Check wrong type
        // yAxis[0].min = 0;
        // yAxis[1].min = 0;
      } else {
        yAxis.min = 0;
      }
    }
    if (!anyPositiveValue) {
      if (chartTypes.Combination && !chartTypes.Splitted) {
        // ToDo: Check wrong type
        // yAxis[0].max = 0;
        // yAxis[1].max = 0;
      } else {
        yAxis.max = 0;
      }
    }
  }

  return yAxis;
}

// ToDo: implement this
// function LinearGaugePlotHeight(qViewer) {
//   let marginBottom;
//   if (
//     IsSplittedChart(qViewer) ||
//     qViewer.Chart.Series.DataFields.length === 1
//   ) {
//     marginBottom = 23 * NumberOfCharts(qViewer);
//   } // por el título del eje Y
//   else {
//     marginBottom = 29;
//   } // por la leyenda
//   return qViewer.getContainerControl().offsetHeight - marginBottom;
// }

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
// function connector90degrees(labelPosition, connectorPosition, options) {
//   const connectorPadding = options.connectorPadding,
//     touchingSliceAt = connectorPosition.touchingSliceAt,
//     alignment = labelPosition.alignment;
//   return [
//     "M",
//     labelPosition.x + (alignment === "left" ? 1 : -1) * connectorPadding,
//     labelPosition.y,
//     "L",
//     touchingSliceAt.x,
//     labelPosition.y,
//     "L",
//     touchingSliceAt.x,
//     touchingSliceAt.y
//   ];
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
      if (chartType === QueryViewerChartType.StackedBar) {
        plotOptions.series.stacking = "normal";
        plotOptions.bar.stacking = "normal";
      } else if (chartType === QueryViewerChartType.StackedBar100) {
        plotOptions.series.stacking = "percent";
        plotOptions.bar.stacking = "percent";
      }
      if (chartType === QueryViewerChartType.LinearGauge) {
        // const widths = linearGaugeWidths(
        //   qViewer.Chart.Series.DataFields.length,
        //   1
        // );
        // const width = widths.Width * LinearGaugePlotHeight(qViewer);
        // plotOptions.bar.pointWidth = width;
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
        // const minLength = minValue * qViewer.getContainerControl().offsetWidth;
        // plotOptions.bar.borderRadius = Math.min(width / 2, minLength / 2);
      }
      break;
    case "column":
      plotOptions.column = {};
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
      plotOptions.pie = {};
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
        connectorColor: "#c3c4c8"
        // connectorShape: connector90degrees
      };
      plotOptions.pie.showInLegend = true;
      break;
    case "solidgauge":
      plotOptions.solidgauge = {};
      plotOptions.solidgauge.showInLegend = true;
      plotOptions.solidgauge.rounded = true;
      break;
    case "funnel":
      plotOptions.funnel = {};
      plotOptions.funnel.showInLegend = true;
      plotOptions.funnel.dataLabels = {
        enabled: showValues,
        connectorColor: "#c3c4c8"
        // connectorShape: connector90degrees
      };
      break;
    case "pyramid":
      plotOptions.pyramid = {};
      plotOptions.pyramid.showInLegend = true;
      plotOptions.pyramid.dataLabels = {
        enabled: showValues,
        connectorColor: "#c3c4c8"
        // connectorShape: connector90degrees
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
    ? "%" +
        percentage +
        "<b>: " +
        (evArg.point.name !== "" ? evArg.point.name : evArg.series.name) +
        "</b>"
    : "<b>" +
        (evArg.point.name !== "" ? evArg.point.name : evArg.series.name) +
        "</b>: " +
        percentage +
        "%";
}

// ToDo: implement this
// function DateTimeTooltipFormatter(evArg, chartSeries) {
//   let hoverPoints;
//   const viewerId = evArg.points[0].series.chart.options.qv.viewerId;
//   const qViewer = qv.collection[viewerId];
//   if (IsSplittedChart(qViewer)) {
//     hoverPoints = getHoverPoints(qViewer, evArg.points[0].point.index);
//   } else {
//     hoverPoints = [];
//     jQuery.each(evArg.points, function (index, point) {
//       hoverPoints.push(point.point);
//     });
//   }
//   // Agrupa la lista de puntos por índice de la serie
//   const points_by_strIndex = {};
//   const compare = gx.dom.el(viewerId + "_options_compare_enable").checked;
//   for (let i = 0; i < hoverPoints.length; i++) {
//     const index = compare
//       ? Math.trunc(hoverPoints[i].series.index / 2)
//       : hoverPoints[i].series.index;
//     var strIndex = index.toString();
//     if (points_by_strIndex[strIndex] == undefined) {
//       points_by_strIndex[strIndex] = [];
//     }
//     points_by_strIndex[strIndex].push(hoverPoints[i]);
//   }
//   let res = "";
//   let currentTotal = 0;
//   let previousTotal = 0;
//   let oldUtc;
//   let oldSeriesName;
//   for (var strIndex in points_by_strIndex) {
//     const seriesIndex = parseInt(strIndex);
//     const serie = chartSeries[seriesIndex];
//     const seriesName = serie.Name;
//     const points = points_by_strIndex[strIndex];
//     for (let ind = 0; points[ind] != undefined; ind++) {
//       const p = points[ind];
//       const utc = parseInt(p.real_x ? p.real_x : p.x);
//       if (p.real_x) {
//         previousTotal += p.y;
//       } else {
//         currentTotal += p.y;
//       }
//       if (compare) {
//         if (oldSeriesName != seriesName) {
//           qv.util.isRTL(qViewer)
//             ? (res += GetBoldRightText(seriesName) + "<br/>")
//             : (res += GetBoldText(seriesName) + "<br/>");
//           oldSeriesName = seriesName;
//         }
//       } else if (oldUtc != utc) {
//         qv.util.isRTL(qViewer)
//           ? (res += GetBoldRightText(p.name) + "<br/>")
//           : (res += GetBoldText(p.name) + "<br/>");
//         oldUtc = utc;
//       }
//       const duration =
//         qViewer.RealChartType == QueryViewerChartType.StepTimeline
//           ? GetDuration(p)
//           : "";
//       var keySpan;
//       const valueSpan = qv.util.dom.createSpan(
//         null,
//         "",
//         "",
//         "",
//         {},
//         null,
//         qv.util.formatNumber(
//           p.y,
//           serie.NumberFormat.DecimalPrecision,
//           serie.Picture,
//           false
//         )
//       ).outerHTML;

//       qv.util.isRTL(qViewer)
//         ? (keySpan = qv.util.dom.createSpan(
//             null,
//             "",
//             "",
//             "",
//             {},
//             null,
//             ": " + (compare ? p.name : seriesName)
//           ).outerHTML)
//         : (keySpan = qv.util.dom.createSpan(
//             null,
//             "",
//             "",
//             "",
//             {},
//             null,
//             (compare ? p.name : seriesName) + ": "
//           ).outerHTML);
//       qv.util.isRTL(qViewer)
//         ? (res += duration + valueSpan + keySpan + "<br/>")
//         : (res += keySpan + valueSpan + duration + "<br/>");
//     }
//   }
//   return res;
// }

function getTooltipObject(
  chartType: QueryViewerChartType,
  chartTypes: ChartTypes,
  isRTL: boolean
): TooltipOptions {
  const tooltip: TooltipOptions = {};
  //   if (chartTypes.Timeline) {
  //     tooltip.borderRadius = 1;
  //     tooltip.shadow = true;
  //     tooltip.shared = metadata.Data.length > 1;
  //     tooltip.formatter = function () {
  //       if (metadata.Data.length === 1) {
  //         return TooltipFormatter(this, chartTypes.Splitted, isRTL, chartTypes);
  //       }
  //       // else {
  //       // return DateTimeTooltipFormatter(
  //       //   this,
  //       //   chartMetadataAndData.Series.ByIndex
  //       // );
  //       // }
  //     };
  //   } else
  if (
    chartType === QueryViewerChartType.StackedColumn100 ||
    chartType === QueryViewerChartType.StackedBar100 ||
    chartType === QueryViewerChartType.StackedArea100 ||
    chartType === QueryViewerChartType.StackedLine100
  ) {
    tooltip.formatter = function () {
      return Stacked100TooltipFormatter(this, isRTL);
    };

    //   else if (chartTypes.Circular) {
    //     tooltip.formatter = function () {
    //       return PieTooltipFormatter(this, chartTypes.Splitted);
    //     };
    //   } else if (chartType === QueryViewerChartType.CircularGauge) {
    //     tooltip.enabled =
    //       (chartMetadataAndData.Series.DataFields.length > 1 || !showValues) &&
    //       !chartTypes.Splitted;
    //     tooltip.formatter = function () {
    //       return CircularGaugeTooltipAndDataLabelFormatter(this, qViewer);
    //     };
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

function getIndividualSerieObject(
  chartTypes: ChartTypes,
  chartType: QueryViewerChartType,
  chartMetadataAndData: ChartMetadataAndData,
  _serieIndex: number,
  chartSerie: QueryViewerChartSerie
): SeriesOptionsType {
  // ToDo: check the correct type
  const serie: SeriesOptionsType = { type: "line" };
  serie.type = undefined; // WA to remove TypeScript error
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
    // serie.name = chartSerie.Name;
    // serie.data = [];
    // serie.turboThreshold = 0;
    // // if (!qv.util.IsNullColor(chartSerie.Color)) {
    // //   SetHighchartsColor(qViewer, serie, chartSerie.Color, true);
    // // }
    // const points = groupPoints(
    //   qViewer.Chart.Categories,
    //   chartSerie.Points,
    //   qv.util.XAxisDataType(qViewer),
    //   chartSerie.Aggregation,
    //   groupOption
    // );
    // for (j = 0; j < points.length; j++) {
    //   const name = points[j].name;
    //   const xValue = points[j].x;
    //   const value = points[j].y;
    //   const date = new gx.date.gxdate(xValue, "Y4MD");
    //   serie.data[j] = {
    //     x: date.Value.getTime() - date.Value.getTimezoneOffset() * 60000,
    //     y: value,
    //     name: name
    //   };
    //   if (qv.util.IsNullColor(chartSerie.Color)) {
    //     SetHighchartsColor(
    //       qViewer,
    //       serie.data[j],
    //       chartSerie.Points[j].Color,
    //       true
    //     );
    //   }
    // }
  } else {
    // let widths;
    // if (chartType === QueryViewerChartType.CircularGauge) {
    //   if (chartTypes.Splitted) {
    //     widths = circularGaugeWidths(1, 1);
    //   } else {
    //     widths = circularGaugeWidths(
    //       chartMetadataAndData.Series.DataFields.length,
    //       serieIndex + 1
    //     );
    //   }
    // }
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
      //   if (chartTypes.DatetimeXAxis) {
      // var xValue = qViewer.Chart.Categories.Values[j].Value;
      // var date = new gx.date.gxdate(xValue, "Y4MD");
      // serie.data[j].x =
      //   date.Value.getTime() - date.Value.getTimezoneOffset() * 60000;
      // serie.data[j].id = date;
      //   }
      //   if (chartType === QueryViewerChartType.CircularGauge) {
      //     serie.data[j].radius = widths.UpperExtreme.toString() + "%";
      //     serie.data[j].innerRadius = widths.LowerExtreme.toString() + "%";
      //   }
      //   if (type == QueryViewerChartType.CircularGauge) {
      //     var color;
      //     if (!qv.util.IsNullColor(chartSerie.Color)) {
      //       color = chartSerie.Color;
      //     } else {
      //       color = chartSerie.Points[0].Color;
      //     }
      //     //SetHighchartsColor(qViewer, serie.data[j], color, true);
      //   } else if (qv.util.IsNullColor(chartSerie.Color)) {
      //     SetHighchartsColor(
      //       qViewer,
      //       serie.data[j],
      //       chartSerie.Points[j].Color,
      //       true
      //     );
      //   }
    });
  }
  return serie;
}

function getSeriesObject(
  chartTypes: ChartTypes,
  chartMetadataAndData: ChartMetadataAndData,
  serieIndex: number,
  chartType: QueryViewerChartType
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
        chartSerie
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

function getPaneObject(chartType: QueryViewerChartType): PaneOptions {
  if (chartType !== QueryViewerChartType.CircularGauge) {
    return {};
  }
  const pane: PaneOptions = { background: [] };
  //   let widths;
  //   if (chartTypes.Splitted) {
  //     widths = circularGaugeWidths(1, 1);
  //   }
  //   for (
  //     let seriesIndexAux = 0;
  //     seriesIndexAux < qViewer.Chart.Series.ByIndex.length;
  //     seriesIndexAux++
  //   ) {
  //     if (!chartTypes.Splitted || seriesIndexAux === serieIndex) {
  //       const chartSerie = qViewer.Chart.Series.ByIndex[seriesIndexAux];
  //       const oneBackground = {};
  //       if (!chartTypes.Splitted) {
  //         widths = circularGaugeWidths(
  //           qViewer.Chart.Series.DataFields.length,
  //           seriesIndexAux + 1
  //         );
  //       }
  //       oneBackground.outerRadius = widths.UpperExtreme.toString() + "%";
  //       oneBackground.innerRadius = widths.LowerExtreme.toString() + "%";
  //       var color;
  //       if (!qv.util.IsNullColor(chartSerie.Color)) {
  //         color = chartSerie.Color;
  //       } else {
  //         color = chartSerie.Points[0].Color;
  //       }
  //       SetHighchartsColor(qViewer, oneBackground, color, false);
  //       oneBackground.borderWidth = 0;
  //       pane.background.push(oneBackground);
  //     }
  //   }

  return pane;
}

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
  //   const groupOption =
  //     XAxisDataType(serviceResponseMetadata) === QueryViewerDataType.Date
  //       ? "Days"
  //       : "Seconds";

  const options: HighChartOptions = {
    chart: getChartObject(chartType, chartTypes),
    credits: getNoCreditsObject(),
    legend: getLegendObject(chartMetadataAndData, chartTypes, isRTL),
    title: getTitleObject(queryTitle, serieIndex),
    subtitle: getSubtitleObject(chartType, chartSerie?.Name, chartTypes, isRTL), // chartSerie is undefined unless chartTypes.Splitted === true
    pane: getPaneObject(chartType),
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
      xAxisIntersectionAtZero
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
    tooltip: getTooltipObject(chartType, chartTypes, isRTL),
    series: getSeriesObject(
      chartTypes,
      chartMetadataAndData,
      serieIndex,
      chartType
    )
  };
  //   options.qv = {};
  //   options.qv.viewerId = qViewer.userControlId(); // Almacena el identificador del control en las opciones de la grafica
  //   options.qv.seriesIndex = serieIndex;

  return options;
}
