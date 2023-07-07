import {
  DateTimePicture,
  QueryViewerAggregationType,
  QueryViewerCategoryValue,
  QueryViewerChartCategories,
  QueryViewerChartPoint,
  QueryViewerChartSerie,
  QueryViewerChartType,
  QueryViewerDataType,
  QueryViewerFilterType,
  QueryViewerOutputType,
  QueryViewerTranslations,
  QueryViewerVisible
} from "../../../common/basic-types";
import {
  QueryViewerServiceDataRow,
  QueryViewerServiceMetaData,
  QueryViewerServiceMetaDataData,
  QueryViewerServiceResponse
} from "../../../services/types/service-result";
import { trimUtil } from "../../../services/xml-parser/utils/general";
import {
  IsMulticoloredSerie,
  NormalizeTargetAndMaximumValues,
  getPictureProperties,
  parseNumericPicture
} from "../../../utils/general";
import { ChartTypes, IS_CHART_TYPE } from "./chart-types";

export type ChartMetadataAndData = {
  Categories: QueryViewerChartCategories;
  Series: {
    // ByIndex: { [key: number]: QueryViewerChartSerie[] };
    // DataFields: { [key: string]: QueryViewerChartSerie[] };
    ByIndex: QueryViewerChartSerie[];
    DataFields: string[];
  };
  PlotBands?: [];
};

function TotData(data: QueryViewerServiceMetaDataData[]) {
  let totData = 0;
  data.forEach(datum => {
    if (datum.DataField !== "F0") {
      // Quantity
      totData++;
    }
  });
  return totData;
}

function XAxisDataType(
  Metadata: QueryViewerServiceMetaData
): QueryViewerDataType {
  let cantRowsOrColumns = 0;
  let dataType = QueryViewerDataType.Character;
  Metadata.Axes.forEach(axis => {
    if (
      axis.Visible === QueryViewerVisible.Yes ||
      axis.Visible === QueryViewerVisible.Always
    ) {
      cantRowsOrColumns++;
      dataType = axis.DataType;
    }
  });
  return cantRowsOrColumns === 1 ? dataType : QueryViewerDataType.Character; // Pues se concatenan los valores
}

const VisibleDatum = (totData: number, datum: QueryViewerServiceMetaDataData) =>
  totData === 1
    ? datum.Visible === QueryViewerVisible.Yes ||
      datum.Visible === QueryViewerVisible.Always
    : datum.Visible !== QueryViewerVisible.Never;

function GetCategoriesAndSeriesDataFields(
  Metadata: QueryViewerServiceMetaData,
  type: QueryViewerOutputType
) {
  const result: ChartMetadataAndData = {
    Categories: { DataFields: [], MinValue: null, MaxValue: null, Values: [] },
    Series: {
      ByIndex: null,
      DataFields: null
      //   MinValue: null,
      //   MaxValue: null,
      //   FieldName: "",
      //   Name: "",
      //   Visible: null,
      //   DataType: null,
      //   Aggregation: null,
      //   Picture: "",
      //   DataFields: "",
      //   NumberFormat: "",
      //   Color: "",
      //   TargetValue: null,
      //   MaximumValue: null,
      //   PositiveValues: null,
      //   NegativeValues: null,
      //   Points: null
    },
    PlotBands: []
  };
  Metadata.Axes.forEach(axis => {
    if (
      (axis.Visible === QueryViewerVisible.Yes ||
        axis.Visible === QueryViewerVisible.Always) &&
      (type !== QueryViewerOutputType.Map ||
        axis.DataType === QueryViewerDataType.Character)
    ) {
      // only character dimensions are valid for Maps
      result.Categories.DataFields.push(axis.DataField);
    }
  });

  const totData = TotData(Metadata.Data);
  Metadata.Data.forEach(datum => {
    if (VisibleDatum(totData, datum)) {
      result.Series.DataFields.push(datum.DataField);
    }
  });
  return result;
}

// function GetAxesByDataFieldObj(
//   Metadata: QueryViewerServiceMetaData
// ): QueryViewerServiceMetaDataAxis[] {
//   const axesByDataField: QueryViewerServiceMetaDataAxis[] = [];
//   Metadata.Axes.forEach(axis => {
//     const pictureProperties = getPictureProperties(axis.DataType, axis.Picture);
//     axesByDataField.append({
//       Picture: axis.Picture,
//       DataType: axis.DataType,
//       PictureProperties: pictureProperties,
//       Filter: axis.Filter
//     });
//   });

//   return axesByDataField;
// }

function GetAxesByDataFieldObj(Metadata: QueryViewerServiceMetaData): {
  [key: string]: {
    Picture: string;
    DataType: QueryViewerDataType;
    PictureProperties: DateTimePicture;
    Filter: {
      Type: QueryViewerFilterType;
      Values: string[];
    };
  };
} {
  const axesByDataField: {
    [key: string]: {
      Picture: string;
      DataType: QueryViewerDataType;
      PictureProperties: DateTimePicture;
      Filter: {
        Type: QueryViewerFilterType;
        Values: string[];
      };
    };
  } = {};
  Metadata.Axes.forEach(axis => {
    const pictureProperties = getPictureProperties(axis.DataType, axis.Picture);
    axesByDataField[axis.DataField] = {
      Picture: axis.Picture,
      DataType: axis.DataType,
      PictureProperties: pictureProperties,
      Filter: axis.Filter
    };
  });

  return axesByDataField;
}

function GetDataByDataFieldObj(
  Metadata: QueryViewerServiceMetaData,
  type: QueryViewerOutputType,
  chartType: QueryViewerChartType,
  chartTypes: ChartTypes,
  chartMetadataAndData: ChartMetadataAndData
): {
  [key: string]: {
    Datum: QueryViewerServiceMetaDataData;
    Multicolored: boolean;
  };
} {
  const dataByDataField: {
    [key: string]: {
      Datum: QueryViewerServiceMetaDataData;
      Multicolored: boolean;
    };
  } = {};
  const totData = TotData(Metadata.Data);

  Metadata.Data.forEach(datum => {
    if (VisibleDatum(totData, datum)) {
      dataByDataField[datum.DataField] = {
        Datum: datum,
        Multicolored: IsMulticoloredSerie(
          type,
          chartType,
          chartTypes,
          chartMetadataAndData
        )
      };
    }
  });
  return dataByDataField;
}

// function GetColor(multicoloredSerie, datum, uniqueAxis, seriesIndex, colorIndex, categoryLabel, value) {

//     function GetValueStyleColor(axis, value) {
//         // Obtiene el color que corresponde al valor según el ValueStyle
//         var arr = [false, ""];
//         for (var i = 0; i < axis.ValuesStyles.length; i++) {
//             var valueStyle = axis.ValuesStyles[i];
//             if (valueStyle.Value == value) {
//                 arr = GetColorFromStyle(valueStyle.StyleOrClass, false);
//                 break;
//             }
//         }
//         return arr;
//     }

//     function GetConditionalColor(datum, value) {
//         // Obtiene el color que corresponde al valor según el Style condicional
//         var arr = [false, ""];
//         var conditionSatisfied = false;
//         for (var i = 0; i < datum.ConditionalStyles.length; i++) {
//             var conditionalStyle = datum.ConditionalStyles[i];
//             conditionSatisfied = qv.util.satisfyStyle(value, conditionalStyle);
//             if (conditionSatisfied) {
//                 arr = GetColorFromStyle(conditionalStyle.StyleOrClass, false);
//                 break;
//             }
//         }
//         return arr;
//     }

//     var color;
//     var colorIndexAux = -1;
//     var isDefaultColor = false;
//     var arr;
//     if (multicoloredSerie) {		// Cada valor de la serie tiene un color diferente
//         var colorFound = false;
//         if (uniqueAxis != null) {
//             arr = GetValueStyleColor(uniqueAxis, categoryLabel);	// Busco primero en los style por valor
//             colorFound = arr[0];
//             color = arr[1];
//         }
//         if (!colorFound) {
//             arr = GetConditionalColor(datum, value)	// Busco luego en los styles condicionales
//             colorFound = arr[0];
//             color = arr[1];
//             if (!colorFound) {
//                 colorIndexAux = colorIndex % HIGHCHARTS_MAX_COLORS;
//                 isDefaultColor = true;
//             }
//         }
//     }
//     else {		// Todos los valores de la serie con el mismo valor
//         arr = GetColorFromStyle(datum.Style, false);
//         colorFound = arr[0];
//         color = arr[1];
//         if (!colorFound) {
//             colorIndexAux = seriesIndex % HIGHCHARTS_MAX_COLORS;
//             isDefaultColor = true;
//         }
//     }
//     return { IsDefault: isDefaultColor, Color: color, ColorIndex: colorIndexAux };
// }

function GetCategoryLabel(
  result: ChartMetadataAndData,
  metadata: QueryViewerServiceMetaData,
  row: QueryViewerServiceDataRow
  // axesByDataField: string[]
) {
  let value;
  // let valueWithPicture;
  let label = "";
  let labelWithPicture = "";
  result.Categories.DataFields.forEach(dataField => {
    if (row[dataField] !== undefined) {
      value = trimUtil(row[dataField]);
      // valueWithPicture = ApplyPicture(
      //   value,
      //   axesByDataField[dataField].Picture,
      //   axesByDataField[dataField].DataType,
      //   axesByDataField[dataField].PictureProperties
      // );
    } else {
      value = metadata.TextForNullValues;
      // valueWithPicture = metadata.TextForNullValues;
    }
    label += (label === "" ? "" : ", ") + value;
    labelWithPicture += labelWithPicture === "" ? "" : ", "; // + valueWithPicture;
  });

  return [label, labelWithPicture];
}

function AddCategoryValue(
  result: ChartMetadataAndData,
  metadata: QueryViewerServiceMetaData,
  row: QueryViewerServiceDataRow,
  valueIndex: number
) {
  const arr = GetCategoryLabel(result, metadata, row);
  let categoryValue: QueryViewerCategoryValue;

  categoryValue.Value = arr[0];
  categoryValue.ValueWithPicture = arr[1];
  result.Categories.Values.push(categoryValue);
  if (valueIndex === 0) {
    result.Categories.MinValue = categoryValue.Value;
    result.Categories.MaxValue = categoryValue.Value;
  } else {
    if (categoryValue.Value > result.Categories.MaxValue) {
      result.Categories.MaxValue = categoryValue.Value;
    }
    if (categoryValue.Value < result.Categories.MinValue) {
      result.Categories.MinValue = categoryValue.Value;
    }
  }
}

function AddSeriesValues(
  result: ChartMetadataAndData,
  row: QueryViewerServiceDataRow,
  valueIndex: number,
  dataByDataField: {
    [key: string]: {
      Datum: QueryViewerServiceMetaDataData;
      Multicolored: boolean;
    };
  }
) {
  for (let i = 0; i < result.Series.DataFields.length; i++) {
    const serie = result.Series.ByIndex[i];
    const dataField = result.Series.DataFields[i];
    const value = row[dataField] !== undefined ? row[dataField] : null;
    const point: QueryViewerChartPoint = {
      Value: "",
      Value_N: "",
      Value_D: ""
    };
    point.Value = value;
    const datum = dataByDataField[dataField].Datum;
    // var multicoloredSerie = dataByDataField[dataField].Multicolored;
    if (datum.Aggregation === QueryViewerAggregationType.Average) {
      let value_N = row[dataField + "_N"];
      let value_D = row[dataField + "_D"];
      if (value_N === undefined && value_D === undefined) {
        // Caso de un dataprovider donde se le asigna agregación = Average por código
        value_N = value;
        value_D = "1";
      }
      point.Value_N = value_N;
      point.Value_D = value_D;
    }
    // if (multicoloredSerie)
    //     point.Color = GetColor(multicoloredSerie, datum, uniqueAxis, 0, valueIndex, result.Categories.Values[valueIndex].Value, value);
    // else
    //     point.Color = qv.util.GetNullColor();
    serie.Points.push(point);
    if (parseFloat(point.Value) > 0) {
      serie.PositiveValues = true;
    }
    if (parseFloat(point.Value) < 0) {
      serie.NegativeValues = true;
    }
    if (valueIndex === 0) {
      serie.MinValue = parseFloat(point.Value);
      serie.MaxValue = parseFloat(point.Value);
    } else {
      if (parseFloat(point.Value) > serie.MaxValue) {
        serie.MaxValue = parseFloat(point.Value);
      }
      if (parseFloat(point.Value) < serie.MinValue) {
        serie.MinValue = parseFloat(point.Value);
      }
    }
  }
}

// function CalculatePlotBands(qViewer, datum) {
//   for (let j = 0; j < datum.ConditionalStyles.length; j++) {
//     const conditionalStyle = datum.ConditionalStyles[j];
//     const arr = GetColorFromStyle(conditionalStyle.StyleOrClass, true);
//     const colorFound = arr[0];
//     const backgroundColor = arr[1];
//     if (colorFound) {
//       plotBand = {};
//       plotBand.Color = qv.util.GetColorObject(backgroundColor);
//       if (conditionalStyle.Operator == QueryViewerConditionOperator.Interval) {
//         plotBand.From = parseFloat(conditionalStyle.Value1);
//         plotBand.To = parseFloat(conditionalStyle.Value2);
//       } else if (
//         conditionalStyle.Operator == QueryViewerConditionOperator.Equal
//       ) {
//         plotBand.From = parseFloat(conditionalStyle.Value1);
//         plotBand.To = parseFloat(conditionalStyle.Value1);
//       } else if (
//         conditionalStyle.Operator ==
//           QueryViewerConditionOperator.GreaterOrEqual ||
//         conditionalStyle.Operator == QueryViewerConditionOperator.GreaterThan
//       ) {
//         plotBand.From = parseFloat(conditionalStyle.Value1);
//       } else if (
//         conditionalStyle.Operator == QueryViewerConditionOperator.LessOrEqual ||
//         conditionalStyle.Operator == QueryViewerConditionOperator.LessThan
//       ) {
//         plotBand.To = parseFloat(conditionalStyle.Value1);
//       }
//       plotBand.SeriesName = datum.Title != "" ? datum.Title : datum.Name;
//       qViewer.Chart.PlotBands.push(plotBand);
//     }
//   }
// }

function IsFilteredRow(
  Metadata: QueryViewerServiceMetaData,
  row: QueryViewerServiceDataRow
) {
  for (let i = 0; i < Metadata.Axes.length; i++) {
    const axis = Metadata.Axes[i];
    if (
      axis.Visible === QueryViewerVisible.Yes ||
      axis.Visible === QueryViewerVisible.Always
    ) {
      const value = trimUtil(row[axis.DataField]);
      // Controlo contra la propiedad Filter
      if (
        axis.Filter.Type === QueryViewerFilterType.HideAllValues ||
        (axis.Filter.Type === QueryViewerFilterType.ShowSomeValues &&
          axis.Filter.Values.indexOf(value) < 0)
      ) {
        return true;
      }
    }
  }
  return false;
}

function XAxisDataTypeOK(
  serviceResponse: QueryViewerServiceResponse,
  type: QueryViewerOutputType,
  chartTypes: QueryViewerChartType,
  translations: QueryViewerTranslations
) {
  const dataType = XAxisDataType(serviceResponse.MetaData);
  const qViewer: any = null;
  switch (type) {
    case QueryViewerOutputType.Chart:
      return {
        IsOK: IS_CHART_TYPE(chartTypes, qViewer).DatetimeXAxis
          ? dataType === QueryViewerDataType.Date ||
            dataType === QueryViewerDataType.DateTime
          : true,
        Error: translations.GXPL_QViewerNoDatetimeAxis
      };
    case QueryViewerOutputType.Map:
      return {
        IsOK:
          dataType === QueryViewerDataType.GeoPoint ||
          dataType === QueryViewerDataType.Character,
        Error: translations.GXPL_QViewerNoMapAxis
      };
  }
  return { IsOK: true, Error: "" };
}

// function NormalizeTargetAndMaximumValues(serie) {
//     if (serie.TargetValue <= 0)
//         serie.TargetValue = 100;
//     if (serie.MaximumValue <= 0)
//         serie.MaximumValue = 100;
//     if (serie.MaximumValue < serie.TargetValue)
//         serie.MaximumValue = serie.TargetValue;
// }

function aggregate(
  aggregation: QueryViewerAggregationType,
  values: number[],
  quantities: number[]
) {
  let sumValues: number;
  let sumQuantities: number;
  let minValue: number;
  let maxValue: number;

  switch (aggregation) {
    case QueryViewerAggregationType.Sum:
      values.forEach(value => {
        if (value != null) {
          sumValues += value;
        }
      });
      return sumValues;
    case QueryViewerAggregationType.Average:
      for (let i = 0; i < values.length; i++) {
        if (values[i] != null) {
          sumValues += values[i];
          sumQuantities += quantities[i];
        }
      }
      return sumValues != null ? sumValues / sumQuantities : null;
    case QueryViewerAggregationType.Count:
      quantities.forEach(quantity => {
        sumQuantities += quantity;
      });
      return sumQuantities;
    case QueryViewerAggregationType.Max:
      values.forEach(value => {
        if (!maxValue) {
          maxValue = value;
        } else if (value > maxValue) {
          maxValue = value;
        }
      });
      return maxValue;
    case QueryViewerAggregationType.Min:
      values.forEach(value => {
        if (!minValue) {
          minValue = value;
        } else if (value < maxValue) {
          minValue = value;
        }
      });
      return minValue;
  }
}

function aggregatePoints(chartSerie: QueryViewerChartSerie) {
  const currentYValues: number[] = [];
  const currentYQuantities: number[] = [];
  // const firstColor = "";
  chartSerie.Points.forEach(point => {
    let yValue;
    let yQuantity;
    if (chartSerie.Aggregation === QueryViewerAggregationType.Count) {
      yValue = 0; // No se utiliza
      yQuantity = parseFloat(trimUtil(point.Value));
    } else if (chartSerie.Aggregation === QueryViewerAggregationType.Average) {
      yValue = parseFloat(trimUtil(point.Value_N));
      yQuantity = parseFloat(trimUtil(point.Value_D));
    } else {
      yValue = parseFloat(trimUtil(point.Value));
      yQuantity = 1;
    }
    currentYValues.push(yValue);
    currentYQuantities.push(yQuantity);
    //   if (firstColor === "") {
    //     firstColor = point.Color;
    //   }
  });

  const value = aggregate(
    chartSerie.Aggregation,
    currentYValues,
    currentYQuantities
  ).toString();
  chartSerie.Points = [{ Value: value, Value_N: value, Value_D: "1" }];
  chartSerie.NegativeValues = parseFloat(value) < 0;
  chartSerie.PositiveValues = parseFloat(value) > 0;
}

// function CalculateColorAxis(qViewer, datum) {

//     qViewer.Chart.colorAxis = qViewer.Chart.colorAxis || {};
//     qViewer.Chart.colorAxis.dataClasses = qViewer.Chart.colorAxis.dataClasses || [];

//     for (var j = 0; j < datum.ConditionalStyles.length; j++) {

//         var conditionalStyle = datum.ConditionalStyles[j];
//         colorAxis = {};
//         colorAxis.dataClasses = [];
//         var dataclasses = {};
//         dataclasses.color = conditionalStyle.StyleOrClass.replace("color:", "");

//         if (conditionalStyle.Operator == QueryViewerConditionOperator.Interval) {

//             dataclasses.from = parseFloat(conditionalStyle.Value1);
//             dataclasses.to = parseFloat(conditionalStyle.Value2);
//             dataclasses.Operator = QueryViewerConditionOperatorSymbol.Interval;

//         } else if (conditionalStyle.Operator == QueryViewerConditionOperator.Equal) {

//             dataclasses.from = parseFloat(conditionalStyle.Value1);
//             dataclasses.Operator = QueryViewerConditionOperatorSymbol.Equal;

//         } else if (conditionalStyle.Operator == QueryViewerConditionOperator.GreaterOrEqual) {

//             dataclasses.from = parseFloat(conditionalStyle.Value1);
//             dataclasses.Operator = QueryViewerConditionOperatorSymbol.GreaterOrEqual;

//         } else if (conditionalStyle.Operator == QueryViewerConditionOperator.GreaterThan) {

//             dataclasses.from = parseFloat(conditionalStyle.Value1);
//             dataclasses.Operator = QueryViewerConditionOperatorSymbol.GreaterThan;

//         } else if (conditionalStyle.Operator == QueryViewerConditionOperator.LessThan) {

//             dataclasses.to = parseFloat(conditionalStyle.Value1);
//             dataclasses.Operator = QueryViewerConditionOperatorSymbol.LessThan;

//         } else if (conditionalStyle.Operator == QueryViewerConditionOperator.LessOrEqual) {

//             dataclasses.to = parseFloat(conditionalStyle.Value1);
//             dataclasses.Operator = QueryViewerConditionOperatorSymbol.LessOrEqual;

//         }
//         else if (conditionalStyle.Operator == QueryViewerConditionOperator.NotEqual) {

//             dataclasses.from = parseFloat(conditionalStyle.Value1);
//             dataclasses.Operator = QueryViewerConditionOperatorSymbol.NotEqual;

//         }
//         qViewer.Chart.colorAxis.dataClasses.push(dataclasses);
//     }
// }

export function ProcessDataAndMetadata(
  serviceResponse: QueryViewerServiceResponse,
  type: QueryViewerOutputType,
  chartType: QueryViewerChartType,
  chartTypes: ChartTypes,
  translations: QueryViewerTranslations
): { error: string; chart: ChartMetadataAndData } {
  const xAxisDataTypeStatus = XAxisDataTypeOK(
    serviceResponse,
    type,
    chartType,
    translations
  );
  if (!xAxisDataTypeStatus.IsOK) {
    return { error: xAxisDataTypeStatus.Error, chart: undefined };
  }

  // Obtengo DataFields de categorias y series
  const result: ChartMetadataAndData = GetCategoriesAndSeriesDataFields(
    serviceResponse.MetaData,
    type
  );

  // const axesByDataField = GetAxesByDataFieldObj(serviceResponse.MetaData);

  // Inicializo series
  // const uniqueAxis =
  //   result.Categories.DataFields.length === 1
  //     ? getAxisByDataField(
  //         serviceResponse.MetaData,
  //         result.Categories.DataFields[0]
  //       )
  //     : null;

  const dataByDataField = GetDataByDataFieldObj(
    serviceResponse.MetaData,
    type,
    chartType,
    chartTypes,
    result
  );

  result.Series.DataFields.forEach(dataField => {
    const datum = dataByDataField[dataField].Datum;
    // const multicoloredSerie = dataByDataField[dataField].Multicolored;

    const serie: QueryViewerChartSerie = {
      MinValue: null, // Minimum value for the serie from the dataset
      MaxValue: null, // Maximum value for the serie from the dataset
      FieldName: datum.Name, // Nombre del field correspondiente a serie
      Name: datum.Title,
      Visible: datum.Visible,
      DataType: datum.DataType,
      Aggregation: datum.Aggregation,
      DataFields: null,
      Color: "",
      Picture: null,
      TargetValue: datum.TargetValue,
      MaximumValue: datum.MaximumValue, // MaximumValue property value (not the maximum value for the serie from the dataset)
      PositiveValues: false,
      NegativeValues: false,
      NumberFormat: null,
      Points: []
    };

    serie.Picture =
      datum.Picture === ""
        ? serie.DataType === QueryViewerDataType.Integer
          ? "ZZZZZZZZZZZZZZ9"
          : "ZZZZZZZZZZZZZZ9.99"
        : datum.Picture;

    serie.NumberFormat = parseNumericPicture(serie.DataType, serie.Picture);
    // if (!multicoloredSerie) {
    //   serie.Color = GetColor(multicoloredSerie, datum, uniqueAxis, i, 0, "", 0);
    // } else {
    //   serie.Color = GetNullColor();
    // }
    NormalizeTargetAndMaximumValues(serie);

    result.Series.ByIndex.push(serie);
    // // Si el dato tiene estilos condicionales, agrego las PlotBands correspondientes
    // if (qViewer.RealType === QueryViewerOutputType.Chart) {
    //   CalculatePlotBands(qViewer, datum);
    // }
    // // Calculo colores segun los ConditionalStyles para las leyendas del mapa
    // if (qViewer.RealType === QueryViewerOutputType.Map) {
    //   CalculateColorAxis(qViewer, datum);
    // }
  });

  // Recorro valores y lleno categorías y series
  let valueIndex = 0;
  serviceResponse.Data.Rows.forEach(row => {
    if (!IsFilteredRow(serviceResponse.MetaData, row)) {
      AddCategoryValue(result, serviceResponse.MetaData, row, valueIndex);
      AddSeriesValues(result, row, valueIndex, dataByDataField);
      valueIndex++;
    }
  });

  if (
    type === QueryViewerOutputType.Chart &&
    IS_CHART_TYPE(chartType, null).Gauge
  ) {
    result.Series.ByIndex.forEach(serie => {
      aggregatePoints(serie); // Sólo puede haber un punto por serie para el Gauge
    });
  }

  return { error: "", chart: result };
}
