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
import {
  QueryViewerAttributesValuesForPivot,
  QueryViewerCalculatePivottableData,
  QueryViewerPageDataForPivot,
  QueryViewerPageDataForTable,
  QueryViewerPivotTableDataSync
} from "./types/service-result";
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

export const recordSetCache = getObjectBasicInfo;

export const attributeValues = (
  qViewer: QueryViewer,
  attributeValues: QueryViewerAttributesValuesForPivot
): QueryViewerPostInfoAttributeValues => {
  const runtimeParametersJSON = getRuntimeParameters(qViewer);
  const runtimeFieldsJSON = getRuntimeFields(qViewer, true);
  return {
    ...getBaseInfo(qViewer),
    DataField: attributeValues.dataField,
    PageNumber: attributeValues.pageNumber,
    PageSize: attributeValues.pageSize,
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
  const axesInfoJSON = getAxesInfo(pageDataProperties.axesInfo);
  const dataInfoJSON = getDataInfo(pageDataProperties.dataInfo);
  const filtersJSON = getFilters(pageDataProperties.filters);
  const expandCollapseJSON = getExpandCollapse(
    pageDataProperties.expandCollapse
  );

  return {
    ...getObjectBasicInfo(qViewer),
    PageNumber: pageDataProperties.pageNumber,
    PageSize: qViewer.Paging === true ? pageDataProperties.pageSize : 0,
    ReturnTotPages: pageDataProperties.returnTotPages,
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
    LayoutChanged: pageDataProperties.layoutChange,
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
    QueryViewerId: calculatePivottableData.queryviewerId
  };
};

export const tablePageData = (
  qViewer: QueryViewer,
  pageDataProperties: QueryViewerPageDataForTable
): QueryViewerPostInfoTablePageData => {
  const runtimeParametersJSON = getRuntimeParameters(qViewer);
  const runtimeFieldsJSON = getRuntimeFields(qViewer, true);
  const filtersJSON = getFilters(pageDataProperties.filters);
  return {
    ...getObjectBasicInfo(qViewer),
    PageNumber: pageDataProperties.pageNumber,
    PageSize: qViewer.Paging === true ? pageDataProperties.pageSize : 0,
    ReturnTotPages: pageDataProperties.returnTotPages,
    Order: {
      DataField: pageDataProperties.dataFieldOrder,
      Type: qViewer.RealType
    },
    Filters: filtersJSON,
    AppSettings: qViewer.AppSettings ? qViewer.AppSettings : undefined,
    RuntimeParameters:
      runtimeParametersJSON.length > 0 ? runtimeParametersJSON : undefined,
    RuntimeFields: runtimeFieldsJSON,
    AllowElementsOrderChange: qViewer.AllowElementsOrderChange,
    RecordsetCacheInfo: getRecordSetCacheInfo(qViewer),
    LayoutChanged: pageDataProperties.layoutChange,
    ReturnSampleData: qViewer.ReturnSampleData,
    TranslationType: qViewer.TranslationType
  };
};

// ToDo: check this implementation
export const getPivottableDataSync = (
  qViewer: QueryViewer,
  getPivottableDataSync: QueryViewerPivotTableDataSync
): QueryViewerPostInfoCalculatePivottableData => {
  const runtimeParametersJSON = getRuntimeParameters(qViewer);
  const runtimeFieldsJSON = getRuntimeFields(qViewer, true);
  return {
    ...getBaseInfo(qViewer),
    AppSettings: qViewer.AppSettings ? qViewer.AppSettings : undefined,
    RuntimeParameters:
      runtimeParametersJSON.length > 0 ? runtimeParametersJSON : undefined,
    RuntimeFields: runtimeFieldsJSON,
    OutputType: qViewer.RealType,
    SortAscendingForced: qViewer.AllowElementsOrderChange,
    AllowElementsOrderChange: qViewer.AllowElementsOrderChange,
    RecordsetCacheInfo: getRecordSetCacheInfo(qViewer),
    ReturnSampleData: qViewer.ReturnSampleData,
    TranslationType: qViewer.TranslationType,
    QueryViewerId: getPivottableDataSync.queryviewerId
  };
};
