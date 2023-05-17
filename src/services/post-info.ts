import { getBaseInfo } from "./utils/post-parameters";
import {
  QueryViewer,
  QueryViewerMetaData,
  QueryViewerData,
  QueryViewerAttributeValues
} from "./types/json";
import { sortAscendingForced } from "./utils/common";

export function metaData(qViewer: QueryViewer): QueryViewerMetaData {
  const baseInfo = getBaseInfo(qViewer);

  return {
    ...baseInfo,
    RememberLayout: qViewer.RememberLayout,
    ShowDataLabelsIn: qViewer.ShowDataLabelsIn // @todo Only used in PivotTable. Check if necessary
  };
}

export function data(qViewer: QueryViewer): QueryViewerData {
  const baseInfo = getBaseInfo(qViewer);

  return {
    ...baseInfo,
    SortAscendingForced: sortAscendingForced(qViewer)
  };
}

export function attributeValues(
  qViewer: QueryViewer,
  DataField: string,
  PageNumber: number,
  PageSize: number,
  Filter: string
): QueryViewerAttributeValues {
  const baseInfo = getBaseInfo(qViewer);

  return {
    ...baseInfo,
    DataField: DataField,
    PageNumber: PageNumber,
    PageSize: PageSize,
    Filter: Filter
  };
}
