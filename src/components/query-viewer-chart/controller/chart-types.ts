import {
  QueryViewerChartType,
  QueryViewerPlotSeries
} from "../../../common/basic-types";

export type IsChartTypes =
  | "Timeline"
  | "DatetimeXAxis"
  | "Stacked"
  | "Circular"
  | "Funnel"
  | "Polar"
  | "SingleSerie"
  | "Combination"
  | "Gauge"
  | "Area"
  | "Line"
  | "Bar"
  | "HasYAxis"
  | "Splitted";

export type ChartTypes = { [key in IsChartTypes]: boolean };

export type IsChartTypesFunction = (
  type: QueryViewerChartType,
  qViewer: any
) => ChartTypes;

export const IS_CHART_TYPE: IsChartTypesFunction = (
  type: QueryViewerChartType,
  qViewer
) => ({
  Timeline:
    type === QueryViewerChartType.Timeline ||
    type === QueryViewerChartType.SmoothTimeline ||
    type === QueryViewerChartType.StepTimeline,

  DatetimeXAxis:
    IS_CHART_TYPE(type, qViewer).Timeline ||
    type === QueryViewerChartType.Sparkline,

  Stacked:
    type === QueryViewerChartType.StackedColumn ||
    type === QueryViewerChartType.StackedColumn3D ||
    type === QueryViewerChartType.StackedColumn100 ||
    type === QueryViewerChartType.StackedBar ||
    type === QueryViewerChartType.StackedBar100 ||
    type === QueryViewerChartType.StackedArea ||
    type === QueryViewerChartType.StackedArea100 ||
    type === QueryViewerChartType.StackedLine ||
    type === QueryViewerChartType.StackedLine100,

  Circular:
    type === QueryViewerChartType.Pie ||
    type === QueryViewerChartType.Pie3D ||
    type === QueryViewerChartType.Doughnut ||
    type === QueryViewerChartType.Doughnut3D,

  Funnel:
    type === QueryViewerChartType.Funnel ||
    type === QueryViewerChartType.Pyramid,

  Polar:
    type === QueryViewerChartType.Radar ||
    type === QueryViewerChartType.FilledRadar ||
    type === QueryViewerChartType.PolarArea,

  SingleSerie:
    IS_CHART_TYPE(type, qViewer).Circular ||
    IS_CHART_TYPE(type, qViewer).Funnel,

  Combination:
    (type === QueryViewerChartType.ColumnLine ||
      type === QueryViewerChartType.Column3DLine) &&
    qViewer.Chart.Series.DataFields.length > 1,

  Gauge:
    type === QueryViewerChartType.CircularGauge ||
    type === QueryViewerChartType.LinearGauge,

  Area:
    type === QueryViewerChartType.Area ||
    type === QueryViewerChartType.StackedArea ||
    type === QueryViewerChartType.StackedArea100 ||
    type === QueryViewerChartType.SmoothArea ||
    type === QueryViewerChartType.StepArea,

  Line:
    type === QueryViewerChartType.Line ||
    type === QueryViewerChartType.StackedLine ||
    type === QueryViewerChartType.StackedLine100 ||
    type === QueryViewerChartType.SmoothLine ||
    type === QueryViewerChartType.StepLine ||
    type === QueryViewerChartType.Sparkline ||
    IS_CHART_TYPE(type, qViewer).Timeline,

  Bar:
    type === QueryViewerChartType.Bar ||
    type === QueryViewerChartType.StackedBar ||
    type === QueryViewerChartType.StackedBar100,

  HasYAxis:
    !IS_CHART_TYPE(type, qViewer).Circular &&
    !IS_CHART_TYPE(type, qViewer).Funnel &&
    !IS_CHART_TYPE(type, qViewer).Gauge,

  Splitted: IsSplittedChart(type, qViewer)
});

export function IsSplittedChart(
  type: QueryViewerChartType,
  qViewer: any
): boolean {
  // Para las gráficas Stacked no tiene sentido separar en varias gráficas pues dejan de apilarse las series
  if (IS_CHART_TYPE(type, qViewer).Stacked) {
    return false;
  }

  // Fuerzo gráficas separadas para este tipo de gráficas porque sino no se pueden dibujar
  return (
    (qViewer.PlotSeries === QueryViewerPlotSeries.InSeparateCharts ||
      IS_CHART_TYPE(type, qViewer).SingleSerie) &&
    qViewer.Chart.Series.DataFields.length > 1
  );
}

// const IsTimelineChart2 = (type: QueryViewerChartType) =>
//   type === QueryViewerChartType.Timeline ||
//   type === QueryViewerChartType.SmoothTimeline ||
//   type === QueryViewerChartType.StepTimeline;

// function IsTimelineChart(qViewer) {
//   return (
//     qViewer.RealChartType == QueryViewerChartType.Timeline ||
//     qViewer.RealChartType == QueryViewerChartType.SmoothTimeline ||
//     qViewer.RealChartType == QueryViewerChartType.StepTimeline
//   );
// }
