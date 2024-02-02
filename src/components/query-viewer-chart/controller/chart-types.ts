import {
  QueryViewerChartType,
  QueryViewerPlotSeries
} from "@genexus/reporting-api/dist/types/basic-types";

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
  qViewer: any,
  plotSeries: QueryViewerPlotSeries
) => ChartTypes;

export const isTimeline = (type: QueryViewerChartType) =>
  type === QueryViewerChartType.Timeline ||
  type === QueryViewerChartType.SmoothTimeline ||
  type === QueryViewerChartType.StepTimeline;

const isStacked = (type: QueryViewerChartType) =>
  type === QueryViewerChartType.StackedColumn ||
  type === QueryViewerChartType.StackedColumn3D ||
  type === QueryViewerChartType.StackedColumn100 ||
  type === QueryViewerChartType.StackedBar ||
  type === QueryViewerChartType.StackedBar100 ||
  type === QueryViewerChartType.StackedArea ||
  type === QueryViewerChartType.StackedArea100 ||
  type === QueryViewerChartType.StackedLine ||
  type === QueryViewerChartType.StackedLine100;

const isCircular = (type: QueryViewerChartType) =>
  type === QueryViewerChartType.Pie ||
  type === QueryViewerChartType.Pie3D ||
  type === QueryViewerChartType.Doughnut ||
  type === QueryViewerChartType.Doughnut3D;

const isFunnel = (type: QueryViewerChartType) =>
  type === QueryViewerChartType.Funnel || type === QueryViewerChartType.Pyramid;

const isGauge = (type: QueryViewerChartType) =>
  type === QueryViewerChartType.CircularGauge ||
  type === QueryViewerChartType.LinearGauge;

export const isDatetimeXAxis = (type: QueryViewerChartType) =>
  isTimeline(type) || type === QueryViewerChartType.Sparkline;

export const IS_CHART_TYPE: IsChartTypesFunction = (
  type: QueryViewerChartType,
  DataFieldsLength: number,
  plotSeries: QueryViewerPlotSeries
) => ({
  Timeline: isTimeline(type),

  DatetimeXAxis: isDatetimeXAxis(type),

  Stacked: isStacked(type),

  Circular: isCircular(type),

  Funnel: isFunnel(type),

  Polar:
    type === QueryViewerChartType.Radar ||
    type === QueryViewerChartType.FilledRadar ||
    type === QueryViewerChartType.PolarArea,

  SingleSerie: isCircular(type) || isFunnel(type),

  Combination:
    (type === QueryViewerChartType.ColumnLine ||
      type === QueryViewerChartType.Column3DLine) &&
    DataFieldsLength > 1,

  Gauge: isGauge(type),

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
    isTimeline(type),

  Bar:
    type === QueryViewerChartType.Bar ||
    type === QueryViewerChartType.StackedBar ||
    type === QueryViewerChartType.StackedBar100,

  HasYAxis: !isCircular(type) && !isFunnel(type) && !isGauge(type),

  Splitted: IsSplittedChart(type, DataFieldsLength, plotSeries)
});

export function IsSplittedChart(
  type: QueryViewerChartType,
  DataFieldsLength: number,
  plotSeries: QueryViewerPlotSeries
): boolean {
  // Para las gráficas Stacked no tiene sentido separar en varias gráficas pues dejan de apilarse las series
  if (isStacked(type)) {
    return false;
  }

  // Fuerzo gráficas separadas para este tipo de gráficas porque sino no se pueden dibujar
  return (
    (plotSeries === QueryViewerPlotSeries.InSeparateCharts ||
      isCircular(type) || // SingleSerie condition
      isFunnel(type)) && // SingleSerie condition
    DataFieldsLength > 1
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
