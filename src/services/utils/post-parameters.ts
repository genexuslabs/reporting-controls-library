import {
  QueryViewerAxisOrderType,
  QueryViewerExpandCollapseType,
  QueryViewerFilterType
} from "@common/basic-types";
import { QueryViewerConditionOperator } from "../types/constants";
import {
  QueryViewer,
  QueryViewerAxesInfo,
  QueryViewerAxis,
  QueryViewerBaseInfo,
  QueryViewerBasicInfo,
  QueryViewerConditionalStyle,
  QueryViewerDataInfo,
  QueryViewerExpandCollapse,
  QueryViewerFilter,
  QueryViewerGrouping,
  QueryViewerPostInfoAxesInfo,
  QueryViewerPostInfoDataInfo,
  QueryViewerPostInfoExpandCollapse,
  QueryViewerPostInfoFilter,
  QueryViewerRecordSetCache,
  QueryViewerRuntimeField,
  QueryViewerRuntimeFieldAnalytics,
  QueryViewerRuntimeFieldFormat,
  QueryViewerRuntimeParameter,
  QueryViewerSDTWithValues,
  QueryViewerValueStyle
} from "../types/json";

// export function getObjectNameFromObjectProperty(propValue: string): string {
//   const array: string[] = eval(propValue);
//   return array[1].replace(/\\/g, ".");
// }

export function getValuesStyles(
  axis: QueryViewerAxis
): QueryViewerValueStyle[] | undefined {
  const axisFormat = axis.Format;

  if (!axisFormat || !axisFormat.ValuesStyles) {
    return undefined;
  }

  return axisFormat.ValuesStyles.map(axisFormatVS => ({
    Value: encodeURIComponent(axisFormatVS.Value),
    Style: encodeURIComponent(axisFormatVS.StyleOrClass),
    Propagate: !!axisFormatVS.ApplyToRowOrColumn
  }));
}

export function getConditionalStyles(
  axis: QueryViewerAxis
): QueryViewerConditionalStyle[] | undefined {
  const axisFormat = axis.Format;

  if (!axisFormat || !axisFormat.ConditionalStyles) {
    return undefined;
  }

  const conditionalStyles: QueryViewerConditionalStyle[] = [];

  axisFormat.ConditionalStyles.forEach(axisFormatCS => {
    const conditionalStyle: QueryViewerConditionalStyle = {
      Operator: axisFormatCS.Operator,
      Value1: encodeURIComponent(axisFormatCS.Value1),
      Style: encodeURIComponent(axisFormatCS.StyleOrClass)
    };

    if (axisFormatCS.Operator === QueryViewerConditionOperator.Interval) {
      conditionalStyle["Value2"] = encodeURIComponent(axisFormatCS.Value2);
    }

    conditionalStyles.push(conditionalStyle);
  });

  return conditionalStyles;
}

export function getGrouping(
  axis: QueryViewerAxis
): QueryViewerGrouping | undefined {
  const axisGrouping = axis.Grouping;

  return axisGrouping
    ? {
        GroupByYear: !!axisGrouping.GroupByYear,
        YearTitle: axisGrouping.YearTitle,
        GroupBySemester: !!axisGrouping.GroupBySemester,
        SemesterTitle: axisGrouping.SemesterTitle,
        GroupByQuarter: !!axisGrouping.GroupByQuarter,
        QuarterTitle: axisGrouping.QuarterTitle,
        GroupByMonth: !!axisGrouping.GroupByMonth,
        MonthTitle: axisGrouping.MonthTitle,
        GroupByDayOfWeek: !!axisGrouping.GroupByDayOfWeek,
        DayOfWeekTitle: axisGrouping.DayOfWeekTitle,
        HideValue: !!axisGrouping.HideValue
      }
    : undefined;
}

export function getSDTWithValuesJSON(
  actualType: string,
  typeWithValues: string,
  values: string[],
  encodeValues: boolean
): QueryViewerSDTWithValues | undefined {
  if (!actualType) {
    return undefined;
  }

  const sdtWithValue: QueryViewerSDTWithValues = { Type: actualType };

  // No need to add the Values property in the result
  if (actualType !== typeWithValues || values.length === 0) {
    return sdtWithValue;
  }

  // Clone the values array and encode it if necessary
  const sdtValues: string[] = encodeValues
    ? values.map(encodeURIComponent)
    : [...values];

  sdtWithValue["Values"] = sdtValues;
  return sdtWithValue;
}

export function getRuntimeFields(
  qViewer: QueryViewer,
  encodeValuesCollection: boolean
): QueryViewerRuntimeField[] | undefined {
  if (!qViewer.Axes) {
    return undefined;
  }

  const runtimeFields: QueryViewerRuntimeField[] = [];

  qViewer.Axes.forEach(axis => {
    const qViewerAxesFormat = axis.Format;
    const qViewerAxesAnalytics = axis.Analytics;

    // Format
    const runtimeFieldFormat: QueryViewerRuntimeFieldFormat = qViewerAxesFormat
      ? {
          Picture: encodeURIComponent(qViewerAxesFormat.Picture || ""),
          TargetValue: qViewerAxesFormat.TargetValue || 0,
          MaximumValue: qViewerAxesFormat.MaximumValue || 0,
          Style: qViewerAxesFormat.Style || "",
          Subtotals: qViewerAxesFormat.Subtotals || "",
          CanDragToPages: qViewerAxesFormat.CanDragToPages ?? true
        }
      : {
          Picture: "",
          TargetValue: 0,
          MaximumValue: 0,
          Style: "",
          Subtotals: "",
          CanDragToPages: true
        };

    const runtimeField: QueryViewerRuntimeField = {
      Name: encodeURIComponent(axis.Name),
      Caption: encodeURIComponent(axis.Title),
      Aggregation: axis.Aggregation,
      Visible: axis.Visible,
      Type: axis.Type,
      Axis: axis.Axis,

      ...runtimeFieldFormat,

      RaiseItemClick: axis.Actions ? axis.Actions.RaiseItemClick : true
    };

    // Analytics
    if (qViewerAxesAnalytics) {
      const runtimeFieldAnalytics: QueryViewerRuntimeFieldAnalytics = {
        ShowValuesAs: qViewerAxesAnalytics.ShowValuesAs,
        RollingAverageType: qViewerAxesAnalytics.RollingAverageType,
        RollingAverageTerms: qViewerAxesAnalytics.RollingAverageTerms,
        DifferenceFrom: qViewerAxesAnalytics.DifferenceFrom,
        ShowAsPercentage: qViewerAxesAnalytics.ShowAsPercentage
      };

      runtimeField["Analytics"] = runtimeFieldAnalytics;
    }

    // AxisOrder
    const axisOrder = axis.AxisOrder;

    if (axisOrder && axisOrder.Type) {
      const sdtOrderType = getSDTWithValuesJSON(
        axisOrder.Type,
        QueryViewerAxisOrderType.Custom,
        axisOrder.Values,
        encodeValuesCollection
      );

      if (sdtOrderType) {
        runtimeField["Order"] = sdtOrderType;
      }
    }

    // ExpandCollapse
    const expandCollapse = axis.ExpandCollapse;

    if (expandCollapse && expandCollapse.Type) {
      const sdtExpandCollapseType = getSDTWithValuesJSON(
        expandCollapse.Type,
        QueryViewerExpandCollapseType.ExpandSomeValues,
        expandCollapse.Values,
        encodeValuesCollection
      );

      if (sdtExpandCollapseType) {
        runtimeField["ExpandCollapse"] = sdtExpandCollapseType;
      }
    }

    // Filter
    const filter = axis.Filter;
    const filterType = filter.Type ?? QueryViewerFilterType.ShowSomeValues;

    if (filter && filterType && filter.Values) {
      const sdtFilterType = getSDTWithValuesJSON(
        filterType,
        QueryViewerFilterType.ShowSomeValues,
        filter.Values,
        encodeValuesCollection
      );

      if (sdtFilterType) {
        runtimeField["Filter"] = sdtFilterType;
      }
    }

    // ValuesStyles
    const valuesStyles = getValuesStyles(axis);
    if (valuesStyles) {
      runtimeField["ValuesStyles"] = valuesStyles;
    }

    // ConditionalStyles
    const conditionalStyles = getConditionalStyles(axis);
    if (conditionalStyles) {
      runtimeField["ConditionalStyles"] = conditionalStyles;
    }

    // Grouping
    const grouping = getGrouping(axis);
    if (grouping) {
      runtimeField["Grouping"] = grouping;
    }

    runtimeFields.push(runtimeField);
  });

  return runtimeFields;
}

export const getRecordSetCacheInfo = (
  qViewer: QueryViewer
): QueryViewerRecordSetCache =>
  qViewer.UseRecordsetCache
    ? {
        ActualKey: qViewer.RecordsetCache.ActualKey,
        OldKey: qViewer.RecordsetCache.OldKey,
        MinutesToKeep: qViewer.RecordsetCache.MinutesToKeepInRecordsetCache,
        MaximumSize: qViewer.RecordsetCache.MaximumCacheSize
      }
    : {
        ActualKey: "",
        OldKey: "",
        MinutesToKeep: 0,
        MaximumSize: 0
      };

export function getRuntimeParameters(
  qViewer: QueryViewer
): QueryViewerRuntimeParameter[] {
  if (qViewer.Object) {
    // Arrays have better performance compared to sets when only using push
    // operations
    const runtimeParameters: QueryViewerRuntimeParameter[] = [];
    const array = eval(qViewer.Object);

    for (let i = 2; i < array.length; i++) {
      runtimeParameters.push({ Value: encodeURIComponent(array[i]) });
    }

    return runtimeParameters;
  }

  return qViewer.Parameters.map((parameter: QueryViewerRuntimeParameter) => ({
    Name: parameter.Name,
    Value: encodeURIComponent(parameter.Value)
  }));
}

/**
 * Adds the basic information to determine the query viewer object.
 * If `ObjectName` is specified, there is no need to use the `Alt_ObjectType` and
 * `Alt_ObjectId` properties. Otherwise, those properties will be used to
 * determine the query viewer object.
 */
export const getObjectBasicInfo = (
  qViewer: QueryViewer
): QueryViewerBasicInfo =>
  qViewer.ObjectName
    ? {
        ApplicationNamespace: qViewer.ApplicationNamespace,
        ObjectName: qViewer.ObjectName
      }
    : {
        ApplicationNamespace: qViewer.ApplicationNamespace,
        Alt_ObjectType: qViewer.ObjectType,
        Alt_ObjectId: qViewer.ObjectId
      };

export function getBaseInfo(qViewer: QueryViewer): QueryViewerBaseInfo {
  const basicInfo = getObjectBasicInfo(qViewer);
  const recordSetCache = getRecordSetCacheInfo(qViewer);
  const runtimeParameters = getRuntimeParameters(qViewer);
  const runtimeFields = getRuntimeFields(qViewer, true);

  const baseInfo: QueryViewerBaseInfo = {
    ...basicInfo,
    OutputType: qViewer.RealType,
    AllowElementsOrderChange: qViewer.AllowElementsOrderChange,
    ReturnSampleData: qViewer.ReturnSampleData,
    TranslationType: qViewer.TranslationType,
    RecordsetCacheInfo: recordSetCache
  };

  if (qViewer.QueryInfo) {
    baseInfo["QueryInfo"] = qViewer.QueryInfo;
  }
  if (qViewer.AppSettings) {
    baseInfo["AppSettings"] = qViewer.AppSettings;
  }
  if (runtimeParameters.length > 0) {
    baseInfo["RuntimeParameters"] = runtimeParameters;
  }
  if (runtimeFields) {
    baseInfo["RuntimeFields"] = runtimeFields;
  }

  return baseInfo;
}

export const getAxesInfo = (
  axesInfo: QueryViewerAxesInfo[]
): QueryViewerPostInfoAxesInfo[] | undefined => {
  if (axesInfo == null || axesInfo.length === 0) {
    return undefined;
  }

  // [...Object.values(axesInfo)] is a WA since the jspivottable in some cases
  // sends axesInfo as an object
  const postInfoAxesInfo: QueryViewerPostInfoAxesInfo[] = [
    ...Object.values(axesInfo)
  ].map(axis => ({
    DataField: axis.DataField,
    Visible: !axis.Hidden,
    Axis: axis.Axis.Type,
    Position: Number.isInteger(axis.Axis.Position) ? axis.Axis.Position : 0,
    Order: axis.Order,
    Subtotals: axis.Subtotals
  }));

  return postInfoAxesInfo;
};

export const getDataInfo = (
  dataInfo: QueryViewerDataInfo[]
): QueryViewerPostInfoDataInfo[] | undefined => {
  if (dataInfo == null || dataInfo.length === 0) {
    return undefined;
  }

  // [...Object.values(dataInfo)] is a WA since the jspivottable in some cases
  // sends axesInfo as an object
  const postInfoDataInfo: QueryViewerPostInfoDataInfo[] = [
    ...Object.values(dataInfo)
  ].map(data => ({
    DataField: data.DataField,
    Visible: !data.Hidden,
    Position: Number.isInteger(data.Position) ? data.Position : 0
  }));

  return postInfoDataInfo;
};

export function getExpandCollapse(
  expandCollapse: QueryViewerExpandCollapse[]
): QueryViewerPostInfoExpandCollapse[] | undefined {
  if (expandCollapse == null || expandCollapse.length === 0) {
    return undefined;
  }
  const postInfoExpandCollapse = expandCollapse.map(expandCollapse => {
    const postInfoExpandCollapse: QueryViewerPostInfoExpandCollapse = {
      DataField: expandCollapse.DataField,
      NullExpanded: expandCollapse.NullExpanded,
      NotNullValues: {
        DefaultAction: expandCollapse.NotNullValues.DefaultAction
      }
    };

    // If there are Expanded values
    if (expandCollapse.NotNullValues.Expanded?.length > 0) {
      postInfoExpandCollapse.NotNullValues.Expanded =
        expandCollapse.NotNullValues.Expanded.map(encodeURIComponent);
    }

    // If there are Collapsed values
    if (expandCollapse.NotNullValues.Collapsed?.length > 0) {
      postInfoExpandCollapse.NotNullValues.Collapsed =
        expandCollapse.NotNullValues.Collapsed.map(encodeURIComponent);
    }

    return postInfoExpandCollapse;
  });

  return postInfoExpandCollapse;
}

export function getFilters(
  filters: QueryViewerFilter[]
): QueryViewerPostInfoFilter[] | undefined {
  if (filters == null || filters.length === 0) {
    return undefined;
  }
  const postInfoFilters = filters.map(filter => {
    const postInfoFilter: QueryViewerPostInfoFilter = {
      DataField: filter.DataField,
      NullIncluded: filter.NullIncluded,
      NotNullValues: { DefaultAction: filter.NotNullValues.DefaultAction }
    };

    // If there are Included values
    if (filter.NotNullValues.Included?.length > 0) {
      postInfoFilter.NotNullValues.Included =
        filter.NotNullValues.Included.map(encodeURIComponent);
    }

    // If there are Excluded values
    if (filter.NotNullValues.Excluded?.length > 0) {
      postInfoFilter.NotNullValues.Excluded =
        filter.NotNullValues.Excluded.map(encodeURIComponent);
    }

    return postInfoFilter;
  });

  return postInfoFilters;
}
