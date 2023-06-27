/* eslint-disable camelcase */
export type GeneratorType = "net" | "java";

export type ServiceType = "metadata" | "data";

export type QueryViewerTranslations = {
  [key in QueryViewerTranslationsLabels]: string;
};

export type QueryViewerTranslationsLabels =
  | "GXPL_QViewerSinceTheBeginningTrend"
  | "GXPL_QViewerLastYearTrend"
  | "GXPL_QViewerLastSemesterTrend"
  | "GXPL_QViewerLastQuarterTrend"
  | "GXPL_QViewerLastMonthTrend"
  | "GXPL_QViewerLastWeekTrend"
  | "GXPL_QViewerLastDayTrend"
  | "GXPL_QViewerLastHourTrend"
  | "GXPL_QViewerLastMinuteTrend"
  | "GXPL_QViewerLastSecondTrend"
  | "GXPL_QViewerCardMinimum"
  | "GXPL_QViewerCardMaximum";

export const DUMMY_TRANSLATIONS: QueryViewerTranslations = {
  GXPL_QViewerCardMaximum: "Max.",
  GXPL_QViewerCardMinimum: "Min.",
  GXPL_QViewerSinceTheBeginningTrend: "Trend Since The Beginning",
  GXPL_QViewerLastDayTrend: "Trend Last Day",
  GXPL_QViewerLastHourTrend: "Trend Last hour",
  GXPL_QViewerLastMinuteTrend: "Trend Last Minute",
  GXPL_QViewerLastMonthTrend: "Trend Last Month",
  GXPL_QViewerLastQuarterTrend: "Trend Last Quarter",
  GXPL_QViewerLastSecondTrend: "Trend Last Second",
  GXPL_QViewerLastSemesterTrend: "Trend Last Semester",
  GXPL_QViewerLastWeekTrend: "Trend Last Week",
  GXPL_QViewerLastYearTrend: "Trend Last Year"
};

export enum QueryViewerOutputType {
  Card = "Card",
  Chart = "Chart",
  PivotTable = "PivotTable",
  Table = "Table",
  Map = "Map",
  Default = "Default"
}

export enum QueryViewerChartType {
  Column = "Column",
  Column3D = "Column3D",
  StackedColumn = "StackedColumn",
  StackedColumn3D = "StackedColumn3D",
  StackedColumn100 = "StackedColumn100",
  Bar = "Bar",
  StackedBar = "StackedBar",
  StackedBar100 = "StackedBar100",
  Area = "Area",
  StackedArea = "StackedArea",
  StackedArea100 = "StackedArea100",
  SmoothArea = "SmoothArea",
  StepArea = "StepArea",
  Line = "Line",
  StackedLine = "StackedLine",
  StackedLine100 = "StackedLine100",
  SmoothLine = "SmoothLine",
  StepLine = "StepLine",
  Pie = "Pie",
  Pie3D = "Pie3D",
  Doughnut = "Doughnut",
  Doughnut3D = "Doughnut3D",
  LinearGauge = "LinearGauge",
  CircularGauge = "CircularGauge",
  Radar = "Radar",
  FilledRadar = "FilledRadar",
  PolarArea = "PolarArea",
  Funnel = "Funnel",
  Pyramid = "Pyramid",
  ColumnLine = "ColumnLine",
  Column3DLine = "Column3DLine",
  Timeline = "Timeline",
  SmoothTimeline = "SmoothTimeline",
  StepTimeline = "StepTimeline",
  Sparkline = "Sparkline"
}

export type TrendIcon =
  | "keyboard_arrow_up"
  | "keyboard_arrow_down"
  | "drag_handle";

export enum QueryViewerAxisOrderType {
  None = "None",
  Ascending = "Ascending",
  Descending = "Descending",
  Custom = "Custom"
}

export enum QueryViewerConditionOperator {
  Equal = "EQ",
  LessThan = "LT",
  GreaterThan = "GT",
  LessOrEqual = "LE",
  GreaterOrEqual = "GE",
  NotEqual = "NE",
  Interval = "IN"
}

export enum QueryViewerDataType {
  Integer = "integer",
  Real = "real",
  Character = "character",
  Boolean = "boolean",
  Date = "date",
  DateTime = "datetime",
  GUID = "guid",
  GeoPoint = "geopoint"
}

export enum QueryViewerExpandCollapseType {
  ExpandAllValues = "ExpandAllValues",
  CollapseAllValues = "CollapseAllValues",
  ExpandSomeValues = "ExpandSomeValues"
}

export enum QueryViewerFilterType {
  ShowAllValues = "ShowAllValues",
  HideAllValues = "HideAllValues",
  ShowSomeValues = "ShowSomeValues"
}

export enum QueryViewerSubtotals {
  Yes = "Yes",
  Hidden = "Hidden",
  No = "No"
}

export enum QueryViewerAggregationType {
  Sum = "Sum",
  Average = "Average",
  Count = "Count",
  Max = "Max",
  Min = "Min"
}

export enum QueryViewerVisible {
  Always = "Always",
  Yes = "Yes",
  No = "No",
  Never = "Never"
}

export enum QueryViewerShowDataAs {
  Values = "Values",
  Percentages = "Percentages",
  ValuesAndPercentages = "ValuesAndPercentages"
}

export enum QueryViewerTrendPeriod {
  SinceTheBeginning = "SinceTheBeginning",
  LastYear = "LastYear",
  LastSemester = "LastSemester",
  LastQuarter = "LastQuarter",
  LastMonth = "LastMonth",
  LastWeek = "LastWeek",
  LastDay = "LastDay",
  LastHour = "LastHour",
  LastMinute = "LastMinute",
  LastSecond = "LastSecond"
}

export enum QueryViewerOrientation {
  Horizontal = "Horizontal",
  Vertical = "Vertical"
}
