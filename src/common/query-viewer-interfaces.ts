export interface ParameterValue {
  Value: string;
  Name: string;
}

export interface ElementValue {
  Name: string;
  Title: string;
  Visible: "Always" | "Yes" | "No" | "Never";
  Type: "Axis" | "Datum";
  Axis: "Rows" | "Columns" | "Pages";
  Aggregation: "Sum" | "Average" | "Count" | "Max" | "Min";
  DataField: string;
  AxisOrder?: {
    Type: "None" | "Ascending" | "Descending" | "Custom";
    Values?: string;
  };
  Filter?: {
    Type: "ShowAllValues" | "HideAllValues" | "ShowSomeValues";
    Values?: string;
  };
  ExpandCollapse?: {
    Type: "ExpandAllValues" | "CollapseAllValues" | "ExpandSomeValues";
    Values?: string;
  };
  Grouping?: Record<string, any>;
  Action?: {
    RaiseItemClick: boolean;
  };
  Format?: Format;
}

export interface Format {
  Picture: string;
  Subtotals: "Yes" | "No" | "Hidden";
  CanDragToPages: boolean;
  Style: string;
  TargetValue: string;
  MaximumValue: string;
  ValuesStyle?: ValueStyle[];
  ConditionalStyles?: ConditionalStyle[];
}

export interface ValueStyle {
  Value: string;
  ApplyToRowOrColumn: boolean;
  StyleOrClass: string;
}

export interface ConditionalStyle {
  Value1: string;
  Value2: string;
  Operator: "EQ" | "LT" | "GT" | "LE" | "GE" | "NE" | "IN";
  StyleOrClass: string;
}
