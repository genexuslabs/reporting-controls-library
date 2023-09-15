import {
  QueryViewerAggregationType,
  QueryViewerAxisOrderType,
  QueryViewerChartType,
  QueryViewerContinent,
  QueryViewerCountry,
  QueryViewerDataType,
  QueryViewerExpandCollapseType,
  QueryViewerFilterType,
  QueryViewerMapType,
  QueryViewerOrientation,
  QueryViewerOutputType,
  QueryViewerPlotSeries,
  QueryViewerRegion,
  QueryViewerShowDataAs,
  QueryViewerShowDataLabelsIn,
  QueryViewerSubtotals,
  QueryViewerTotal,
  QueryViewerVisible,
  QueryViewerXAxisLabels
} from "../../common/basic-types";
import {
  QueryViewerAxisConditionalStyle,
  QueryViewerAxisValueStyle
} from "./json";

export type QueryViewerServiceResponse = {
  MetaData: QueryViewerServiceMetaData;
  Data: QueryViewerServiceData;
  Properties: QueryViewerServiceProperties;
};

// MetaData
export type QueryViewerServiceMetaData = {
  TextForNullValues: string;
  Axes: QueryViewerServiceMetaDataAxis[];
  Data: QueryViewerServiceMetaDataData[];
};

export type QueryViewerServiceProperties = {
  Type: QueryViewerOutputType;
  QueryTitle: string;
  ShowValues: boolean;
  ShowDataAs: QueryViewerShowDataAs;
  Orientation: QueryViewerOrientation;
  IncludeTrend: boolean;
  IncludeSparkline: boolean;
  IncludeMaxMin: boolean;
  ChartType: QueryViewerChartType;
  PlotSeries: QueryViewerPlotSeries;
  XAxisLabels: QueryViewerXAxisLabels;
  XAxisIntersectionAtZero: boolean;
  XAxisTitle: string;
  YAxisTitle: string;
  MapType: QueryViewerMapType;
  Region: QueryViewerRegion;
  Continent: QueryViewerContinent;
  Country: QueryViewerCountry;
  Paging: boolean;
  PageSize: number;
  ShowDataLabelsIn: QueryViewerShowDataLabelsIn;
  TotalForRows: QueryViewerTotal;
  TotalForColumns: QueryViewerTotal;
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
