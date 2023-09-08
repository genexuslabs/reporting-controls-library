import {
  QueryViewerConditionOperator,
  QueryViewerOutputType
} from "../../common/basic-types";
import { Query, QueryOutputProperty } from "../gxquery-connector";

export type QueryViewerSDTWithValues = {
  Type: string;
  Values?: string[];
};

export type QueryViewerBasicInfo = {
  ApplicationNamespace: string;
  ObjectName?: string;

  /**
   * Useful when the ObjectName is not defined. Otherwise, if `ObjectName` is
   * defined, this property isn't required
   */
  Alt_ObjectType?: string;

  /**
   * Useful when the ObjectName is not defined. Otherwise, if `ObjectName` is
   * defined, this property isn't required
   */
  Alt_ObjectId?: string;
};

export type QueryViewerBaseInfo = QueryViewerBasicInfo & {
  OutputType: string;
  AllowElementsOrderChange: boolean;
  ReturnSampleData: any;
  TranslationType: string;
  RecordsetCacheInfo: QueryViewerRecordSetCache;
  QueryInfo?: any;
  AppSettings?: any;
  RuntimeParameters?: QueryViewerRuntimeParameter[];
  RuntimeFields?: QueryViewerRuntimeField[];
};

export type QueryViewerRecordSetCache = {
  ActualKey: string;
  OldKey: string;
  MinutesToKeep: number;
  MaximumSize: number;
};

export type QueryViewerRuntimeParameter = {
  Name?: string;
  Value: string;
};

export type QueryViewerRuntimeFieldFormat = {
  Picture: string;
  TargetValue: number;
  MaximumValue: number;
  Style: string;
  Subtotals: string;
  CanDragToPages: boolean;
};

export type QueryViewerRuntimeFieldAnalytics = {
  ShowValuesAs: string;
  RollingAverageType: string;
  RollingAverageTerms: number;
  DifferenceFrom: string;
  ShowAsPercentage: string;
};

export type QueryViewerValueStyle = {
  Value: string;
  Style: string;
  Propagate: boolean;
};

export type QueryViewerConditionalStyle = {
  Operator: string;
  Value1: string;
  Value2?: string;
  Style: string;
};

export type QueryViewerGrouping = {
  GroupByYear: boolean;
  YearTitle: string;
  GroupBySemester: boolean;
  SemesterTitle: string;
  GroupByQuarter: boolean;
  QuarterTitle: string;
  GroupByMonth: boolean;
  MonthTitle: string;
  GroupByDayOfWeek: boolean;
  DayOfWeekTitle: string;
  HideValue: boolean;
};

export type QueryViewerRuntimeField = {
  Name: string;
  Caption: string;
  Aggregation: string;
  Visible: string;
  Type: string;
  Axis: string;
} & QueryViewerRuntimeFieldFormat & {
    RaiseItemClick: boolean;
    Analytics?: QueryViewerRuntimeFieldAnalytics;
    Order?: QueryViewerSDTWithValues;
    ExpandCollapse?: QueryViewerSDTWithValues;
    Filter?: QueryViewerSDTWithValues;
    ValuesStyles?: QueryViewerValueStyle[];
    ConditionalStyles?: QueryViewerConditionalStyle[];
    Grouping?: QueryViewerGrouping;
  };

// - - - - - - - - - - - - - - - - - - - - -
//               Output types
// - - - - - - - - - - - - - - - - - - - - -
export type QueryViewerMetaData = QueryViewerBaseInfo & {
  RememberLayout: boolean;
  ShowDataLabelsIn: string;
};

export type QueryViewerData = QueryViewerBaseInfo & {
  SortAscendingForced: boolean;
};

export type QueryViewerAttributeValues = QueryViewerBaseInfo & {
  DataField: string;
  PageNumber: number;
  PageSize: number;
  Filter: string;
};

// - - - - - - - - - - - - - - - - - - - - -
//                Input types
// - - - - - - - - - - - - - - - - - - - - -
export type QueryViewer = {
  // Basic info
  ApplicationNamespace: string;
  Object?: any; // @todo Check if is necessary
  ObjectName?: string;

  /**
   * Determine if the query object is a DataProvider or a Query Viewer.
   */
  ObjectType?: string;

  ObjectId?: string;
  RealType: QueryViewerOutputType;
  AllowElementsOrderChange: boolean;
  ReturnSampleData: any;
  TranslationType: string;

  // Metadata (Separate in a different type)
  RememberLayout?: boolean;
  ShowDataLabelsIn?: string;

  /**
   * `true` when `RealType === "PivotTable"` or `RealType === "Table"`
   */
  UseRecordsetCache: boolean;

  /**
   * Only defined when `UseRecordsetCache == true`
   */
  RecordsetCache?: {
    ActualKey: string;
    OldKey: string;
    MinutesToKeepInRecordsetCache: number;
    MaximumCacheSize: number;
  };

  // Runtime parameters
  Parameters: {
    Name: string;
    Value: string;
  }[];

  // Runtime fields
  Axes: QueryViewerAxis[];

  QueryInfo?: any;
  AppSettings?: any;

  // GXquery
  QueryObj?: Query;
  Properties?: Record<QueryOutputProperty, string | number | boolean>;
};

export type QueryViewerAxis = {
  Name: string;
  Title: string;
  Aggregation: string;
  Visible: string; // Indeed, it's a string
  Type: "Axis" | "Datum";
  Axis: string;

  Format?: {
    Picture: string;
    TargetValue: number;
    MaximumValue: number;
    Style: string;
    Subtotals: string;
    CanDragToPages: boolean;

    ValuesStyles?: QueryViewerAxisValueStyle[];
    ConditionalStyles?: QueryViewerAxisConditionalStyle[];
  };

  Actions?: {
    RaiseItemClick: boolean;
  };

  Analytics?: {
    ShowValuesAs: "NoCalculation" | string; // @todo TODO: Improve the type
    RollingAverageType: "Simple" | string; // @todo TODO: Improve the type
    RollingAverageTerms: number;
    DifferenceFrom: "PreviousValue" | string; // @todo TODO: Improve the type
    ShowAsPercentage: "No" | string; // @todo TODO: Improve the type
  };

  Grouping?: {
    GroupByYear: boolean;
    YearTitle: string;
    GroupBySemester: boolean;
    SemesterTitle: string;
    GroupByQuarter: boolean;
    QuarterTitle: string;
    GroupByMonth: boolean;
    MonthTitle: string;
    GroupByDayOfWeek: boolean;
    DayOfWeekTitle: string;
    HideValue: boolean;
  };

  AxisOrder?: {
    Type?: string;
    Values: string[];
  };

  ExpandCollapse?: {
    Type?: "ExpandAllValues" | string; // @todo TODO: Improve the type
    Values: string[];
  };

  Filter?: {
    Type?: "ShowAllValues" | string; // @todo TODO: Improve the type
    Values: string[];
  };
};

export type QueryViewerAxisValueStyle = {
  Value: string | number | boolean; // @todo TODO: Improve the type
  StyleOrClass: string;
  ApplyToRowOrColumn: boolean;
};

export type QueryViewerAxisConditionalStyle = {
  Operator: QueryViewerConditionOperator;
  Value1: string | number | boolean; // @todo TODO: Improve the type
  Value2?: string | number | boolean; // @todo TODO: Improve the type
  StyleOrClass: string;
};

export type QueryViewerCard = QueryViewer & {
  IncludeSparkline: boolean;
  IncludeTrend: boolean;
};

export type QueryViewerChart = QueryViewer & {
  RealChartType: string;
};
