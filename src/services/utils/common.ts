import { QueryViewerOutputType } from "../../common/basic-types";
import { QueryViewer, QueryViewerCard, QueryViewerChart } from "../types/json";
import { ChartTypes } from "./chart";

export const parseObjectToFormData = (object: { [key: string]: any }) =>
  "Data=" + encodeURIComponent(JSON.stringify(object));

export const sortAscendingForced = (qViewer: QueryViewer) =>
  (qViewer.RealType === QueryViewerOutputType.Chart &&
    ChartTypes.IsTimeline(qViewer as QueryViewerChart)) ||
  (qViewer.RealType === QueryViewerOutputType.Card &&
    ((qViewer as QueryViewerCard).IncludeSparkline ||
      (qViewer as QueryViewerCard).IncludeTrend));
