import {
  getAxesInfo,
  getBaseInfo,
  getDataInfo,
  getExpandCollapse,
  getFilters,
  getObjectBasicInfo,
  getRecordSetCacheInfo,
  getRuntimeFields,
  getRuntimeParameters
} from "./utils/post-parameters";
import {
  QueryViewer,
  QueryViewerMetaData,
  QueryViewerData,
  QueryViewerPostInfoAttributeValues,
  QueryViewerPostInfoPivotPageData,
  QueryViewerPostInfoCalculatePivottableData,
  QueryViewerPostInfoTablePageData
} from "./types/json";
import { sortAscendingForced } from "./utils/common";
import {
  QueryViewerAttributesValuesForPivot,
  QueryViewerCalculatePivottableData,
  QueryViewerPageDataForPivot,
  QueryViewerPageDataForTable
} from "./types/service-result";

export const metaData = (qViewer: QueryViewer): QueryViewerMetaData => ({
  ...getBaseInfo(qViewer),
  RememberLayout: qViewer.RememberLayout,
  ShowDataLabelsIn: qViewer.ShowDataLabelsIn // @todo Only used in PivotTable. Check if necessary
});

export const data = (qViewer: QueryViewer): QueryViewerData => ({
  ...getBaseInfo(qViewer),
  SortAscendingForced: sortAscendingForced(qViewer)
});

export const recordSetCache = getObjectBasicInfo;

export const attributeValues = (
  qViewer: QueryViewer,
  attributeValues: QueryViewerAttributesValuesForPivot
): QueryViewerPostInfoAttributeValues => {
  const runtimeParametersJSON = getRuntimeParameters(qViewer);
  const runtimeFieldsJSON = getRuntimeFields(qViewer, true);
  return {
    ...getBaseInfo(qViewer),
    DataField: attributeValues.DataField,
    PageNumber: attributeValues.PageNumber,
    PageSize: attributeValues.PageSize,
    Filter: undefined, // check this
    AppSettings: qViewer.AppSettings ? qViewer.AppSettings : undefined,
    RuntimeParameters:
      runtimeParametersJSON.length > 0 ? runtimeParametersJSON : undefined,
    RuntimeFields: runtimeFieldsJSON,
    // OutputType:, ToDo: check if it is necessary
    AllowElementsOrderChange: qViewer.AllowElementsOrderChange,
    RecordsetCacheInfo: getRecordSetCacheInfo(qViewer),
    ReturnSampleData: qViewer.ReturnSampleData,
    TranslationType: qViewer.TranslationType
  };
};

export const pivotTablePageData = (
  qViewer: QueryViewer,
  pageDataProperties: QueryViewerPageDataForPivot
): QueryViewerPostInfoPivotPageData => {
  const runtimeParametersJSON = getRuntimeParameters(qViewer);
  const runtimeFieldsJSON = getRuntimeFields(qViewer, true);
  const axesInfoJSON = getAxesInfo(pageDataProperties.AxesInfo);
  const dataInfoJSON = getDataInfo(pageDataProperties.DataInfo);
  const filtersJSON = getFilters(pageDataProperties.Filters);
  const expandCollapseJSON = getExpandCollapse(
    pageDataProperties.ExpandCollapse
  );

  return {
    ...getObjectBasicInfo(qViewer),
    PageNumber: pageDataProperties.PageNumber,
    PageSize: qViewer.Paging === true ? pageDataProperties.PageSize : 0,
    ReturnTotPages: pageDataProperties.ReturnTotPages,
    ShowDataLabelsIn: qViewer.ShowDataLabelsIn,
    TotalForRows: qViewer.TotalForRows,
    TotalForColumns: qViewer.TotalForColumns,
    AxesInfo: axesInfoJSON,
    DataInfo: dataInfoJSON,
    Filters: filtersJSON,
    ExpandCollapse: expandCollapseJSON,
    AppSettings: qViewer.AppSettings ? qViewer.AppSettings : undefined,
    RuntimeParameters:
      runtimeParametersJSON.length > 0 ? runtimeParametersJSON : undefined,
    RuntimeFields: runtimeFieldsJSON,
    AllowElementsOrderChange: qViewer.AllowElementsOrderChange,
    RecordsetCacheInfo: getRecordSetCacheInfo(qViewer),
    LayoutChanged: pageDataProperties.LayoutChange,
    ReturnSampleData: qViewer.ReturnSampleData,
    TranslationType: qViewer.TranslationType
  };
};

export const calculatePivottableData = (
  qViewer: QueryViewer,
  calculatePivottableData: QueryViewerCalculatePivottableData
): QueryViewerPostInfoCalculatePivottableData => {
  const runtimeParametersJSON = getRuntimeParameters(qViewer);
  const runtimeFieldsJSON = getRuntimeFields(qViewer, true);
  return {
    ...getBaseInfo(qViewer),
    AppSettings: qViewer.AppSettings ? qViewer.AppSettings : undefined,
    RuntimeParameters:
      runtimeParametersJSON.length > 0 ? runtimeParametersJSON : undefined,
    RuntimeFields: runtimeFieldsJSON,
    SortAscendingForced: qViewer.AllowElementsOrderChange,
    // OutputType: qViewer.RealType,  ToDo: check if it is necessary
    AllowElementsOrderChange: qViewer.AllowElementsOrderChange,
    RecordsetCacheInfo: getRecordSetCacheInfo(qViewer),
    ReturnSampleData: qViewer.ReturnSampleData,
    TranslationType: qViewer.TranslationType,
    QueryViewerId: calculatePivottableData.QueryviewerId
  };
};

export const tablePageData = (
  qViewer: QueryViewer,
  pageDataProperties: QueryViewerPageDataForTable
): QueryViewerPostInfoTablePageData => {
  const runtimeParametersJSON = getRuntimeParameters(qViewer);
  const runtimeFieldsJSON = getRuntimeFields(qViewer, true);
  const filtersJSON = getFilters(pageDataProperties.Filters);
  return {
    ...getObjectBasicInfo(qViewer),
    PageNumber: pageDataProperties.PageNumber,
    PageSize: qViewer.Paging === true ? pageDataProperties.PageSize : 0,
    ReturnTotPages: pageDataProperties.ReturnTotPages,
    Order: {
      DataField: pageDataProperties.DataFieldOrder,
      Type: qViewer.RealType
    },
    Filters: filtersJSON,
    AppSettings: qViewer.AppSettings ? qViewer.AppSettings : undefined,
    RuntimeParameters:
      runtimeParametersJSON.length > 0 ? runtimeParametersJSON : undefined,
    RuntimeFields: runtimeFieldsJSON,
    AllowElementsOrderChange: qViewer.AllowElementsOrderChange,
    RecordsetCacheInfo: getRecordSetCacheInfo(qViewer),
    LayoutChanged: pageDataProperties.LayoutChange,
    ReturnSampleData: qViewer.ReturnSampleData,
    TranslationType: qViewer.TranslationType
  };
};
