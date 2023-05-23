import { getBaseInfo } from "./utils/post-parameters";
import {
  QueryViewer,
  QueryViewerMetaData,
  QueryViewerData,
  QueryViewerAttributeValues
} from "./types/json";
import { sortAscendingForced } from "./utils/common";

export const metaData = (qViewer: QueryViewer): QueryViewerMetaData => ({
  ...getBaseInfo(qViewer),
  RememberLayout: qViewer.RememberLayout,
  ShowDataLabelsIn: qViewer.ShowDataLabelsIn // @todo Only used in PivotTable. Check if necessary
});

export const data = (qViewer: QueryViewer): QueryViewerData => ({
  ...getBaseInfo(qViewer),
  SortAscendingForced: sortAscendingForced(qViewer)
});

export const attributeValues = (
  qViewer: QueryViewer,
  DataField: string,
  PageNumber: number,
  PageSize: number,
  Filter: string
): QueryViewerAttributeValues => ({
  ...getBaseInfo(qViewer),
  DataField: DataField,
  PageNumber: PageNumber,
  PageSize: PageSize,
  Filter: Filter
});
