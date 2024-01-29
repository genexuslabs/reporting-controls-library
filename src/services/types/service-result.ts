import {
  QueryViewerAggregationType,
  QueryViewerAxisOrderType,
  QueryViewerBase,
  QueryViewerDataType,
  QueryViewerExpandCollapseType,
  QueryViewerFilterType,
  QueryViewerSubtotals,
  QueryViewerVisible
} from "../../common/basic-types";
import {
  QueryViewerAxisConditionalStyle,
  QueryViewerAxisValueStyle,
  QueryViewerAxesInfo,
  QueryViewerDataInfo,
  QueryViewerExpandCollapse,
  QueryViewerFilter
} from "./json";

export type QueryViewerServiceResponse = {
  MetaData: QueryViewerServiceMetaData;
  Data: QueryViewerServiceData;
  Properties: QueryViewerBase;
};

export type QueryViewerServiceResponsePivotTable = {
  MetaData: QueryViewerServiceMetaData;
  metadataXML: string;
  Properties: QueryViewerBase;
  objectName: string;
  useGxQuery: boolean;
};

// MetaData
export type QueryViewerServiceMetaData = {
  textForNullValues: string;
  axes: QueryViewerServiceMetaDataAxis[];
  data: QueryViewerServiceMetaDataData[];
};

export type QueryViewerServiceMetaDataAxis = {
  name: string;
  title: string;
  dataField: string;
  dataType: QueryViewerDataType;
  visible: string;
  axis: string;
  picture: string;
  canDragToPages: boolean;
  raiseItemClick: boolean;
  isComponent: boolean;

  style: string;

  subtotals: QueryViewerSubtotals;

  filter: {
    type: QueryViewerFilterType;
    values: string[];
  };

  expandCollapse: {
    type: QueryViewerExpandCollapseType;
    values: string[];
  };

  order: {
    type: QueryViewerAxisOrderType;
    values: string[];
  };

  valuesStyles: QueryViewerAxisValueStyle[];
};

export type QueryViewerServiceMetaDataData = {
  name: string;
  title: string;
  dataField: string;
  aggregation: QueryViewerAggregationType;
  dataType: QueryViewerDataType;
  visible: QueryViewerVisible;
  picture: string;
  raiseItemClick: boolean;
  isComponent: boolean;

  targetValue: number;
  maximumValue: number;

  style: string;

  conditionalStyles: QueryViewerAxisConditionalStyle[];

  isFormula: boolean;
  formula: string;
};

// Data
export type QueryViewerServiceData = {
  rows: QueryViewerServiceDataRow[];
};

export type QueryViewerServiceDataRow = { [key: string]: string };

// PageDataPivot
export type QueryViewerPageDataForPivot = {
  pageNumber: number;
  pageSize: number;
  returnTotPages: boolean;
  axesInfo: QueryViewerAxesInfo[];
  dataInfo: QueryViewerDataInfo[];
  filters: QueryViewerFilter[];
  expandCollapse: QueryViewerExpandCollapse[];
  layoutChange: string;
  queryviewerId: number;
};

// PivotTableDataSync
export type QueryViewerPivotTableDataSync = {
  queryviewerId: number;
};

// TableDataSync
export type QueryViewerTableDataSync = QueryViewerPivotTableDataSync;

// AttributeValuesForPivotTable
export type QueryViewerAttributesValuesForPivot = {
  dataField: string;
  page: number;
  pageSize: number;
  pageNumber: number;
  filter: QueryViewerFilter[];
  filterText: string;
  queryviewerId: number;
};

// CalculatePivottableData
export type QueryViewerCalculatePivottableData = {
  queryviewerId: number;
};

// PageDataForTable
export type QueryViewerPageDataForTable = {
  pageNumber: number;
  pageSize: number;
  recalculateCantPages: boolean;
  returnTotPages: boolean;
  dataFieldOrder: string;
  orderType: string;
  filters: QueryViewerFilter[];
  layoutChange: string;
  queryviewerId: number;
};

// AttributeForTable
export type QueryViewerAttributesValuesForTable =
  QueryViewerAttributesValuesForPivot;
