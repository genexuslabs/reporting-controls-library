export type GeneratorType = "net" | "java";

export type ServiceType = "metadata" | "data";

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
