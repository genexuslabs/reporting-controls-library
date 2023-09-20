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
  | "GXPL_QViewerCardMaximum"
  | "GXPL_QViewerNoDatetimeAxis"
  | "GXPL_QViewerNoMapAxis";

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
  GXPL_QViewerLastYearTrend: "Trend Last Year",
  GXPL_QViewerNoDatetimeAxis: "No Datetime Axis",
  GXPL_QViewerNoMapAxis: "No Map Axis"
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

export enum QueryViewerConditionOperatorSymbol {
  Equal = "=",
  LessThan = "<",
  GreaterThan = ">",
  LessOrEqual = "≤",
  GreaterOrEqual = "≥",
  NotEqual = "<>",
  Interval = "-"
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

export enum QueryViewerTotal {
  Yes = "Yes",
  No = "No"
}

export enum QueryViewerShowDataLabelsIn {
  Rows = "Rows",
  Columns = "Columns"
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

export enum QueryViewerPlotSeries {
  InTheSameChart = "InTheSameChart",
  InSeparateCharts = "InSeparateCharts"
}

export enum QueryViewerXAxisLabels {
  Horizontally = "Horizontally",
  Rotated30 = "Rotated30",
  Rotated45 = "Rotated45",
  Rotated60 = "Rotated60",
  Vertically = "Vertically"
}

export enum QueryViewerMapType {
  Bubble = "Bubble",
  Choropleth = "Choropleth"
}

export enum QueryViewerRegion {
  World = "World",
  Country = "Country",
  Continent = "Continent"
}

export enum QueryViewerContinent {
  Africa = "Africa",
  Antarctica = "Antarctica",
  Asia = "Asia",
  Europe = "Europe",
  NorthAmerica = "NorthAmerica",
  Oceania = "Oceania",
  SouthAmerica = "SouthAmerica"
}

export enum QueryViewerCountry {
  Afghanistan = "AF",
  Albania = "AL",
  Algeria = "DZ",
  Andorra = "AD",
  Angola = "AO",
  Anguilla = "AI",
  AntiguaAndBarbuda = "AG",
  Argentina = "AR",
  Armenia = "AM",
  Australia = "AU",
  Austria = "AT",
  Azerbaijan = "AZ",
  Bahrain = "BH",
  Bangladesh = "BD",
  Barbados = "BB",
  Belarus = "BY",
  Belgium = "BE",
  Belize = "BZ",
  Benin = "BJ",
  Bermuda = "BM",
  Bhutan = "BT",
  Bolivia = "BO",
  BosniaAndHerzegovina = "BA",
  Botswana = "BW",
  Brazil = "BR",
  BritishVirginIslands = "VG",
  Brunei = "BN",
  Bulgaria = "BG",
  BurkinaFaso = "BF",
  Burundi = "BI",
  Cambodia = "KH",
  Cameroon = "CM",
  Canada = "CA",
  CapeVerde = "CV",
  CentralAfricanRepublic = "CF",
  Chad = "TD",
  Chile = "CL",
  China = "CN",
  Colombia = "CO",
  Comoros = "KM",
  CookIslands = "CK",
  CostaRica = "CR",
  Croatia = "HR",
  Cuba = "CU",
  Cyprus = "CY",
  CzechRepublic = "CZ",
  DemocraticRepublicOfTheCongo = "CD",
  Denmark = "DK",
  Djibouti = "DJ",
  Dominica = "DM",
  DominicanRepublic = "DO",
  EastTimor = "TL",
  Ecuador = "EC",
  Egypt = "EG",
  ElSalvador = "SV",
  EquatorialGuinea = "GQ",
  Eritrea = "ER",
  Estonia = "EE",
  Eswatini = "SZ",
  Ethiopia = "ET",
  FaroeIslands = "FO",
  Fiji = "FJ",
  Finland = "FI",
  France = "FR",
  Gabon = "GA",
  Gambia = "GM",
  Georgia = "GE",
  Germany = "DE",
  Ghana = "GH",
  Greece = "GR",
  Greenland = "GL",
  Grenada = "GD",
  Guatemala = "GT",
  Guinea = "GN",
  GuineaBissau = "GW",
  Guyana = "GY",
  Haiti = "HT",
  Honduras = "HN",
  Hungary = "HU",
  Iceland = "IS",
  India = "IN",
  Indonesia = "ID",
  Iran = "IR",
  Iraq = "IQ",
  Ireland = "IE",
  Israel = "IL",
  Italy = "IT",
  IvoryCoast = "CI",
  Jamaica = "JM",
  Japan = "JP",
  Jordan = "JO",
  Kazakhstan = "KZ",
  Kenya = "KE",
  Kiribati = "KI",
  Kosovo = "XK",
  Kuwait = "KW",
  Kyrgyzstan = "KG",
  Laos = "LA",
  Latvia = "LV",
  Lebanon = "LB",
  Lesotho = "LS",
  Liberia = "LR",
  Libya = "LY",
  Liechtenstein = "LI",
  Lithuania = "LT",
  Luxembourg = "LU",
  Madagascar = "MG",
  Malawi = "MW",
  Malaysia = "MY",
  Maldives = "MV",
  Mali = "ML",
  Malta = "MT",
  MarshallIslands = "MH",
  Mauritania = "MR",
  Mauritius = "MU",
  Mexico = "MX",
  Micronesia = "FM",
  Moldova = "MD",
  Monaco = "MC",
  Mongolia = "MN",
  Montenegro = "ME",
  Morocco = "MA",
  Mozambique = "MZ",
  Myanmar = "MM",
  Namibia = "NA",
  Nauru = "NR",
  Nepal = "NP",
  Netherlands = "NL",
  NewZealand = "NZ",
  Nicaragua = "NI",
  Niger = "NE",
  Nigeria = "NG",
  NorthKorea = "KP",
  NorthMacedonia = "MK",
  Norway = "NO",
  Oman = "OM",
  Pakistan = "PK",
  Palau = "PW",
  Panama = "PA",
  Palestine = "PS",
  PapuaNewGuinea = "PG",
  Paraguay = "PY",
  Peru = "PE",
  Philippines = "PH",
  Poland = "PL",
  Portugal = "PT",
  PuertoRico = "PR",
  Qatar = "QA",
  RepublicOfTheCongo = "CG",
  Romania = "RO",
  Russia = "RU",
  Rwanda = "RW",
  SaintKittsAndNevis = "KN",
  SaintLucia = "LC",
  SaintVincentAndTheGrenadines = "VC",
  Samoa = "WS",
  SanMarino = "SM",
  SaoTomeAndPrincipe = "ST",
  SaudiArabia = "SA",
  Senegal = "SN",
  Serbia = "RS",
  Seychelles = "SC",
  SierraLeone = "SL",
  Singapore = "SG",
  Slovakia = "SK",
  Slovenia = "SI",
  SolomonIslands = "SB",
  Somalia = "SO",
  SouthAfrica = "ZA",
  SouthKorea = "KR",
  SouthSudan = "SS",
  Spain = "ES",
  SriLanka = "LK",
  Sudan = "SD",
  Suriname = "SR",
  Sweden = "SE",
  Switzerland = "CH",
  Syria = "SY",
  Taiwan = "TW",
  Tajikistan = "TJ",
  Tanzania = "TZ",
  Thailand = "TH",
  TheBahamas = "BS",
  Togo = "TG",
  Tokelau = "TK",
  Tonga = "TO",
  TrinidadAndTobago = "TT",
  Tunisia = "TN",
  Turkey = "TR",
  Turkmenistan = "TM",
  Tuvalu = "TV",
  Uganda = "UG",
  Ukraine = "UA",
  UnitedArabEmirates = "AE",
  UnitedKingdom = "GB",
  UnitedStatesOfAmerica = "US",
  Uruguay = "UY",
  Uzbekistan = "UZ",
  Vanuatu = "VU",
  VaticanCity = "VA",
  Venezuela = "VE",
  Vietnam = "VN",
  WesternSahara = "EH",
  Yemen = "YE",
  Zambia = "ZM",
  Zimbabwe = "ZW"
}

export type DateTimePicture = {
  DateFormat: string;
  IncludeHours: boolean;
  IncludeMinutes: boolean;
  IncludeSeconds: boolean;
  IncludeMilliseconds: boolean;
};

export type QueryViewerChartSerie = {
  MinValue: number;
  MaxValue: number;
  FieldName: string;
  Name: string;
  Visible: QueryViewerVisible;
  DataType: QueryViewerDataType;
  Aggregation: QueryViewerAggregationType;
  Picture: string;
  DataFields: string[];
  Color: string;
  TargetValue: number;
  MaximumValue: number;
  PositiveValues: boolean;
  NegativeValues: boolean;
  Points: QueryViewerChartPoint[];
  NumberFormat: {
    DecimalPrecision: number;
    UseThousandsSeparator: boolean;
    Prefix: string;
    Suffix: string;
  };
};

export type QueryViewerChartCategories = {
  DataFields: string[];
  MinValue: string;
  MaxValue: string;
  Values: QueryViewerCategoryValue[];
};

export type QueryViewerCategoryValue = {
  Value: string;
  ValueWithPicture: string;
};

export type QueryViewerChartPoint = {
  Value: string;
  Value_N: string;
  Value_D: string;
};

export type QueryViewerSliderRange = {
  start: number;
  end: number;
};
