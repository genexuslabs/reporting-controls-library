import { QueryViewerChartType } from "../../../common/basic-types";
import { ChartTypes } from "./chart-types";
import { ChartMetadataAndData } from "./processDataAndMetadata";

export type ChartGroupLower =
  | "column"
  | "bar"
  | "area"
  | "areaspline"
  | "line"
  | "spline"
  | "pie"
  | "funnel"
  | "pyramid"
  | "solidgauge"
  | "line";

export function getChartType(chartType: QueryViewerChartType): ChartGroupLower {
  switch (chartType) {
    case QueryViewerChartType.Column:
    case QueryViewerChartType.Column3D:
    case QueryViewerChartType.ColumnLine:
    case QueryViewerChartType.Column3DLine:
    case QueryViewerChartType.StackedColumn:
    case QueryViewerChartType.StackedColumn3D:
    case QueryViewerChartType.StackedColumn100:
    case QueryViewerChartType.PolarArea:
      return "column";
    case QueryViewerChartType.Bar:
    case QueryViewerChartType.StackedBar:
    case QueryViewerChartType.StackedBar100:
    case QueryViewerChartType.LinearGauge:
      return "bar";
    case QueryViewerChartType.Area:
    case QueryViewerChartType.StackedArea:
    case QueryViewerChartType.StackedArea100:
    case QueryViewerChartType.FilledRadar:
    case QueryViewerChartType.StepArea:
      return "area";
    case QueryViewerChartType.SmoothArea:
      return "areaspline";
    case QueryViewerChartType.Line:
    case QueryViewerChartType.StackedLine:
    case QueryViewerChartType.StackedLine100:
    case QueryViewerChartType.Radar:
    case QueryViewerChartType.Timeline:
    case QueryViewerChartType.StepTimeline:
    case QueryViewerChartType.Sparkline:
    case QueryViewerChartType.StepLine:
      return "line";
    case QueryViewerChartType.SmoothLine:
    case QueryViewerChartType.SmoothTimeline:
      return "spline";
    case QueryViewerChartType.Pie:
    case QueryViewerChartType.Pie3D:
    case QueryViewerChartType.Doughnut:
    case QueryViewerChartType.Doughnut3D:
      return "pie";
    case QueryViewerChartType.Funnel:
      return "funnel";
    case QueryViewerChartType.Pyramid:
      return "pyramid";
    case QueryViewerChartType.CircularGauge:
      return "solidgauge";
    default:
      return "line";
  }
}

function getAllHighchartOptions(
  chartTypes: ChartTypes,
  chartMetadataAndData: ChartMetadataAndData
) {
  const arrOptions = [];
  if (chartTypes.Splitted) {
    for (
      let seriesIndex = 0;
      seriesIndex < chartMetadataAndData.Series.ByIndex.length;
      seriesIndex++
    ) {
      const chartSerie = chartMetadataAndData.Series.ByIndex[seriesIndex];
      var options = getHighchartOptions(qViewer, chartSerie, seriesIndex);
      arrOptions.push(options);
    }
  } else {
    var options = getHighchartOptions(qViewer, null, null);
    arrOptions.push(options);
  }
  return arrOptions;
}
