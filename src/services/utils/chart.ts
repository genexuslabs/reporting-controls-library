import { QueryViewerChartType } from "@common/basic-types";
import { QueryViewerChart } from "../types/json";

export class ChartTypes {
  public static IsTimeline = (qViewer: QueryViewerChart) =>
    qViewer.RealChartType === QueryViewerChartType.Timeline ||
    qViewer.RealChartType === QueryViewerChartType.SmoothTimeline ||
    qViewer.RealChartType === QueryViewerChartType.StepTimeline;

  public static IsDatetimeXAxis = (qViewer: QueryViewerChart) =>
    this.IsTimeline(qViewer) ||
    qViewer.RealChartType === QueryViewerChartType.Sparkline;
}
