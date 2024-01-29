import {
  QueryViewerConditionOperator,
  QueryViewerElementType,
  QueryViewerOutputType,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal
} from "../../common/basic-types";

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

export type QueryViewerPostInfoAttributeValues = QueryViewerBaseInfo & {
  DataField: string;
  PageNumber: number;
  PageSize: number;
  Filter: string;
};

export type QueryViewerPostInfoCalculatePivottableData = QueryViewerBaseInfo & {
  SortAscendingForced: boolean;
  QueryViewerId: number;
};

export type QueryViewerPostInfoFilter = QueryViewerFilter;

export type QueryViewerPostInfoExpandCollapse = QueryViewerExpandCollapse;

export type QueryViewerPostInfoDataInfo = {
  DataField: string;
  Visible: boolean;
  Position: number;
};

export type QueryViewerPostInfoAxesInfo = {
  DataField: string;
  Visible: boolean;
  Axis: string;
  Position: number;
  Order: string;
  Subtotals: number | boolean;
};

export type QueryViewerPostInfoPivotPageData = QueryViewerBasicInfo & {
  PageNumber: number;
  PageSize: number;
  ReturnTotPages: boolean;
  ShowDataLabelsIn: QueryViewerShowDataLabelsIn;
  TotalForRows: QueryViewerTotal;
  TotalForColumns: QueryViewerTotal;
  AxesInfo?: QueryViewerPostInfoAxesInfo[];
  DataInfo?: QueryViewerPostInfoDataInfo[];
  Filters?: QueryViewerPostInfoFilter[];
  ExpandCollapse?: QueryViewerPostInfoExpandCollapse[];
  AppSettings?: any;
  RuntimeParameters: QueryViewerRuntimeParameter[];
  RuntimeFields: QueryViewerRuntimeField[];
  AllowElementsOrderChange: boolean;
  RecordsetCacheInfo: QueryViewerRecordSetCache;
  LayoutChanged: any;
  ReturnSampleData: boolean;
  TranslationType: string;
};

export type QueryViewerPostInfoTablePageData = QueryViewerBasicInfo & {
  PageNumber: number;
  PageSize: number;
  ReturnTotPages: boolean;
  Order: {
    DataField: string;
    Type: QueryViewerOutputType;
  };
  Filters?: QueryViewerPostInfoFilter[];
  AppSettings?: any;
  RuntimeParameters: QueryViewerRuntimeParameter[];
  RuntimeFields: QueryViewerRuntimeField[];
  AllowElementsOrderChange: boolean;
  RecordsetCacheInfo: QueryViewerRecordSetCache;
  LayoutChanged: any;
  ReturnSampleData: boolean;
  TranslationType: string;
};

// - - - - - - - - - - - - - - - - - - - - -
//                Input types
// - - - - - - - - - - - - - - - - - - - - -
export type QueryViewer = {
  // Basic info
  ApplicationNamespace: string;

  AppSettings?: any;

  // Runtime fields
  Axes: QueryViewerAxis[];
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
  ShowDataLabelsIn?: QueryViewerShowDataLabelsIn;

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

  /**
   * Use when `RealType === "PivotTable"` or `RealType === "Table"`
   */
  Paging?: boolean;
  PageSize?: number;
  // Runtime parameters
  Parameters: {
    Name: string;
    Value: string;
  }[];

  /**
   * Use when `RealType === "PivotTable"` or `RealType === "Table"`
   */
  TotalForRows?: QueryViewerTotal;

  /**
   * Use when `RealType === "PivotTable"` or `RealType === "Table"`
   */
  TotalForColumns?: QueryViewerTotal;

  QueryInfo?: any;
};

export type QueryViewerAxis = {
  Name: string;
  Title: string;
  Aggregation: string;
  Visible: string; // Indeed, it's a string
  Type: QueryViewerElementType;
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

export type QueryViewerFilter = {
  DataField: string;
  NullIncluded: boolean;
  NotNullValues: {
    DefaultAction: string;
    Included?: string[];
    Excluded?: string[];
  };
};

export type QueryViewerExpandCollapse = {
  DataField: string;
  NullExpanded: boolean;
  NotNullValues: {
    DefaultAction: string;
    Expanded?: string[];
    Collapsed?: string[];
  };
};

export type QueryViewerDataInfo = {
  DataField: string;
  Hidden: boolean;
  Position: number;
};

export type QueryViewerAxesInfo = {
  DataField: string;
  Hidden: boolean;
  Axis: {
    Type: string;
    Position: number;
  };
  Order: string;
  Subtotals: number | boolean;
};
