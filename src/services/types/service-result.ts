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
  TextForNullValues: string;
  Axes: QueryViewerServiceMetaDataAxis[];
  Data: QueryViewerServiceMetaDataData[];
};

export type QueryViewerServiceMetaDataAxis = {
  Name: string;
  Title: string;
  DataField: string;
  DataType: QueryViewerDataType;
  Visible: string;
  Axis: string;
  Picture: string;
  CanDragToPages: boolean;
  RaiseItemClick: boolean;
  IsComponent: boolean;

  Style: string;

  Subtotals: QueryViewerSubtotals;

  Filter: {
    Type: QueryViewerFilterType;
    Values: string[];
  };

  ExpandCollapse: {
    Type: QueryViewerExpandCollapseType;
    Values: string[];
  };

  Order: {
    Type: QueryViewerAxisOrderType;
    Values: string[];
  };

  ValuesStyles: QueryViewerAxisValueStyle[];
};

export type QueryViewerServiceMetaDataData = {
  Name: string;
  Title: string;
  DataField: string;
  Aggregation: QueryViewerAggregationType;
  DataType: QueryViewerDataType;
  Visible: QueryViewerVisible;
  Picture: string;
  RaiseItemClick: boolean;
  IsComponent: boolean;

  TargetValue: number;
  MaximumValue: number;

  Style: string;

  ConditionalStyles: QueryViewerAxisConditionalStyle[];

  IsFormula: boolean;
  Formula: string;
};

// Data
export type QueryViewerServiceData = {
  Rows: QueryViewerServiceDataRow[];
};

export type QueryViewerServiceDataRow = { [key: string]: string };

// PageDataPivot
export type QueryViewerPageDataForPivot = {
  PageNumber: number;
  PageSize: number;
  ReturnTotPages: boolean;
  AxesInfo: QueryViewerAxesInfo[];
  DataInfo: QueryViewerDataInfo[];
  Filters: QueryViewerFilter[];
  ExpandCollapse: QueryViewerExpandCollapse[];
  LayoutChange: string;
  QueryviewerId: number;
};

// AttributeValuesForPivotTable
export type QueryViewerAttributesValuesForPivot = {
  DataField: string;
  Page: number;
  PageSize: number;
  PageNumber: number;
  Filter: QueryViewerFilter[];
  FilterText: string;
  QueryviewerId: number;
};

// CalculatePivottableData
export type QueryViewerCalculatePivottableData = {
  QueryviewerId: number;
};

// PivotTableDataSync
export type QueryViewerPivotTableDataSync = {
  QueryviewerId: number;
};

// TableDataSync
export type QueryViewerTableDataSync = QueryViewerPivotTableDataSync;

// PageDataForTable
export type QueryViewerPageDataForTable = {
  PageNumber: number;
  PageSize: number;
  RecalculateCantPages: boolean;
  ReturnTotPages: boolean;
  DataFieldOrder: string;
  OrderType: string;
  Filters: QueryViewerFilter[];
  LayoutChange: string;
  QueryviewerId: number;
};

// AttributeForTable
export type QueryViewerAttributesValuesForTable =
  QueryViewerAttributesValuesForPivot;
