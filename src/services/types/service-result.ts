import {
  QueryViewerAggregationType,
  QueryViewerAxisOrderType,
  QueryViewerDataType,
  QueryViewerExpandCollapseType,
  QueryViewerFilterType,
  QueryViewerSubtotals,
  QueryViewerVisible
} from "../../common/basic-types";
import {
  QueryViewerAxisConditionalStyle,
  QueryViewerAxisValueStyle
} from "./json";

export type QueryViewerServiceResponse = {
  MetaData: QueryViewerServiceMetaData;
  Data: QueryViewerServiceData;
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
