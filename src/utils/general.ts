import {
  DateTimePicture,
  QueryViewerAggregationType,
  QueryViewerChartSerie,
  QueryViewerChartType,
  // QueryViewerConditionOperator,
  QueryViewerDataType,
  QueryViewerOutputType
} from "@genexus/reporting-api";
import { ChartTypes } from "../components/query-viewer-chart/controller/chart-types";
import { ChartMetadataAndData } from "../components/query-viewer-chart/controller/processDataAndMetadata";
// import { QueryViewerAxisConditionalStyle } from "@genexus/reporting-api/dist/types/json";
import {
  QueryViewerServiceDataRow,
  QueryViewerServiceMetaData,
  QueryViewerServiceMetaDataAxis,
  QueryViewerServiceMetaDataData
} from "@genexus/reporting-api";
import { TooltipFormatterContextObject } from "highcharts";

export function parseNumericPicture(
  dataType: QueryViewerDataType,
  picture: string
): {
  DecimalPrecision: number;
  UseThousandsSeparator: boolean;
  Prefix: string;
  Suffix: string;
} {
  // @todo Check if picture can be undefined
  if (picture === "") {
    return {
      DecimalPrecision: dataType === QueryViewerDataType.Integer ? 0 : 2,
      UseThousandsSeparator: false,
      Prefix: "",
      Suffix: ""
    };
  }

  let decimalPrecision;
  let useThousandsSeparator;
  let prefix = "";
  let suffix = "";

  // - - - - - Extract the data from the picture - - - - -
  // It has neither a semicolon nor a comma
  if (picture.indexOf(".") < 0 && picture.indexOf(",") < 0) {
    decimalPrecision = 0;
    useThousandsSeparator = false;
  }
  // Has only point
  else if (picture.indexOf(".") >= 0 && picture.indexOf(",") < 0) {
    decimalPrecision =
      dataType === QueryViewerDataType.Integer
        ? 0
        : picture.length - picture.indexOf(".") - 1;
    useThousandsSeparator = false;
  }
  // Has only comma
  else if (picture.indexOf(".") < 0 && picture.indexOf(",") >= 0) {
    decimalPrecision = 0;
    useThousandsSeparator = true;
  }
  // Has a semicolon
  else {
    decimalPrecision =
      dataType === QueryViewerDataType.Integer
        ? 0
        : picture.length - picture.indexOf(".") - 1;
    useThousandsSeparator = true;
  }

  // - - - - -  Get prefix and suffix - - - - -
  // pictureArea = 1 (prefix), 2 (number) o 3 (suffix)
  let pictureArea = 1;
  for (let i = 0; i < picture.length; i++) {
    const chr = picture.substr(i, 1);
    if (
      (chr === "." || chr === "," || chr === "9" || chr === "Z") &&
      pictureArea === 1
    ) {
      pictureArea = 2;
    }

    if (
      chr !== "." &&
      chr !== "," &&
      chr !== "9" &&
      chr !== "Z" &&
      pictureArea === 2
    ) {
      pictureArea = 3;
    }
    switch (pictureArea) {
      case 1:
        prefix += chr;
        break;
      case 3:
        suffix += chr;
        break;
    }
  }

  return {
    DecimalPrecision: decimalPrecision,
    UseThousandsSeparator: useThousandsSeparator,
    Prefix: prefix,
    Suffix: suffix
  };
}

function evaluate(
  formula: string,
  baseName: string,
  variables: string[]
): string {
  for (let i = 1; i <= variables.length; i++) {
    formula = formula.replace(baseName + i.toString(), variables[i - 1]);
  }
  return eval(formula);
}

const aggregateMap: {
  [key in QueryViewerAggregationType]: (
    values: number[],
    quantities: number[]
  ) => number;
} = {
  [QueryViewerAggregationType.Sum]: (
    values: number[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _quantities: number[]
  ) => {
    let sumValues: number = null;

    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        sumValues += values[i];
      }
    }
    return sumValues;
  },

  [QueryViewerAggregationType.Average]: (
    values: number[],
    quantities: number[]
  ) => {
    let sumValues: number = null;
    let sumQuantities: number = null;

    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        sumValues += values[i];
        sumQuantities += quantities[i];
      }
    }
    return sumValues != null ? sumValues / sumQuantities : null;
  },

  [QueryViewerAggregationType.Count]: (
    _values: number[],
    quantities: number[]
  ) => quantities.reduce((a, b) => a + b, 0),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [QueryViewerAggregationType.Max]: (values: number[], _quantities: number[]) =>
    values.length === 0 ? null : Math.max(...values),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [QueryViewerAggregationType.Min]: (values: number[], _quantities: number[]) =>
    values.length === 0 ? null : Math.min(...values)
};

export const aggregate = (
  aggregation: QueryViewerAggregationType,
  values: number[],
  quantities: number[]
) =>
  aggregateMap[aggregation || QueryViewerAggregationType.Sum](
    values,
    quantities
  );

function aggregateDatum(
  datum: QueryViewerServiceMetaDataData,
  rows: QueryViewerServiceDataRow[]
): string {
  const currentYValues = [];
  const currentYQuantities = [];
  const variables: number[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (datum.isFormula) {
      let j = 0;
      let value = row[datum.dataField + "_1"];

      do {
        j++;
        value = row[datum.dataField + "_" + j.toString()];

        if (value) {
          const floatValue = parseFloat(value);

          if (i === 0) {
            variables.push(floatValue);
          } else {
            variables[j - 1] += floatValue;
          }
        }
      } while (value);
    } else {
      let yValue;
      let yQuantity;

      if (datum.aggregation === QueryViewerAggregationType.Count) {
        yValue = 0; // Not used
        yQuantity = parseFloat(row[datum.dataField]);
      } else if (datum.aggregation === QueryViewerAggregationType.Average) {
        yValue = parseFloat(row[datum.dataField + "_N"]);
        yQuantity = parseFloat(row[datum.dataField + "_D"]);
      } else {
        yValue = parseFloat(row[datum.dataField]);
        yQuantity = 1;
      }
      currentYValues.push(yValue);
      currentYQuantities.push(yQuantity);
    }
  }

  return datum.isFormula
    ? evaluate(datum.formula, datum.dataField + "_", variables.map(toString))
    : aggregate(
        datum.aggregation,
        currentYValues,
        currentYQuantities
      ).toString();
}

export function aggregateData(
  data: QueryViewerServiceMetaDataData[],
  rows: QueryViewerServiceDataRow[]
): QueryViewerServiceDataRow {
  const newRow: QueryViewerServiceDataRow = {};

  data.forEach(datum => {
    const aggValue = aggregateDatum(datum, rows);
    newRow[datum.dataField] = aggValue;
  });
  return newRow;
}

// export function parseDateTimePicture(
//   dataType: QueryViewerDataType,
//   picture: string
// ): DateTimePicture {
//   let dateFormat = ""; // gx.DateFormat ver como obtener eso
//   let includeHours: boolean,
//     includeMinutes: boolean,
//     includeSeconds: boolean,
//     includeMilliseconds: boolean;
//   includeHours =
//     includeMinutes =
//     includeSeconds =
//     includeMilliseconds =
//       dataType === QueryViewerDataType.DateTime;

//   if (picture !== "") {
//     if (picture.indexOf("9999") >= 0 && dateFormat.indexOf("Y4") < 0) {
//       dateFormat = dateFormat.replace("Y", "Y4");
//     } else if (picture.indexOf("9999") < 0 && dateFormat.indexOf("Y4") >= 0) {
//       dateFormat = dateFormat.replace("Y4", "Y");
//     }
//     if (dataType === QueryViewerDataType.DateTime) {
//       const posSeparator = picture.indexOf(" ");
//       if (posSeparator >= 0) {
//         const timePart = picture.slice(
//           posSeparator + 1,
//           picture.length - posSeparator
//         );
//         includeHours = timePart.length >= 2;
//         includeMinutes = timePart.length >= 5;
//         includeSeconds = timePart.length >= 8;
//         includeMilliseconds = timePart.length === 12;
//       } else {
//         includeHours =
//           includeMinutes =
//           includeSeconds =
//           includeMilliseconds =
//             false;
//       }
//     }
//   }
//   return {
//     DateFormat: dateFormat,
//     IncludeHours: includeHours,
//     IncludeMinutes: includeMinutes,
//     IncludeSeconds: includeSeconds,
//     IncludeMilliseconds: includeMilliseconds
//   };
// }

export function getPictureProperties(
  dataType: QueryViewerDataType,
  picture: string
): DateTimePicture {
  let pictureProperties;
  if (
    dataType === QueryViewerDataType.Integer ||
    dataType === QueryViewerDataType.Real
  ) {
    pictureProperties === parseNumericPicture(dataType, picture);
  } else if (
    dataType === QueryViewerDataType.Date ||
    dataType === QueryViewerDataType.DateTime
  ) {
    // pictureProperties = parseDateTimePicture(dataType, picture);
  } else {
    pictureProperties = null;
  }
  return pictureProperties;
}

export function getAxisByDataField(
  Metadata: QueryViewerServiceMetaData,
  dataField: string
): QueryViewerServiceMetaDataAxis[] {
  const axes: QueryViewerServiceMetaDataAxis[] = null;
  Metadata.axes.forEach(axis => {
    if (axis.dataField === dataField) {
      axes.push(axis);
    }
  });
  return axes;
}

// function GetColorFromStyle(style: string, isBackgroundColor: boolean) {
//   if (!style) {
//     return [false, ""];
//   }
//   let color = "";
//   let colorFound = false;
//   const colorKey = isBackgroundColor ? "backgroundcolor" : "color";
//   const keyValuePairs = style.split(";");

//   for (let i = 0; i < keyValuePairs.length; i++) {
//     const keyValuePairStr = keyValuePairs[i];
//     const keyValuePair = keyValuePairStr.split(":");
//     if (keyValuePair.length === 2) {
//       const key = trimUtil(keyValuePair[0]);
//       const value = trimUtil(keyValuePair[1]);
//       if (key.toLowerCase() === colorKey) {
//         color = value;
//         colorFound = value !== "";
//         break;
//       }
//     }
//   }
//   if (colorFound && color.slice(0, 1) === "#") {
//     color = color.replace("#", "");
//   }

//   return [colorFound, color];
// }

// function ExistColors(
//   styles: QueryViewerAxisValueStyle[] | QueryViewerAxisConditionalStyle[]
// ) {
//   // Verifica si hay colores a partir de Styles condicionales
//   let existColors = false;
//   for (let i = 0; i < styles.length; i++) {
//     const style = styles[i];
//     const arr = GetColorFromStyle(style.StyleOrClass, false);
//     const colorFound = arr[0];
//     if (colorFound) {
//       existColors = true;
//       break;
//     }
//   }
//   return existColors;
// }

export function IsMulticoloredSerie(
  type: QueryViewerOutputType,
  chartType: QueryViewerChartType,
  chartTypes: ChartTypes,
  chartMetadataAndData: ChartMetadataAndData
  // datum: QueryViewerServiceMetaDataData,
  // uniqueAxis: QueryViewerServiceMetaDataAxis
) {
  if (
    type === QueryViewerOutputType.Chart &&
    (chartTypes.SingleSerie ||
      (chartType === QueryViewerChartType.PolarArea &&
        chartMetadataAndData.Series.DataFields.length === 1))
  ) {
    return true;
  }
  // Estos tipos de gráfica tienen que dibujar sí o sí cada valor con un color diferente
  if (
    type === QueryViewerOutputType.Chart &&
    (chartTypes.Area ||
      chartTypes.Line ||
      chartType === QueryViewerChartType.Radar ||
      chartType === QueryViewerChartType.FilledRadar)
  ) {
    return false;
  }
  // Estos tipos de gráfica no pueden ser multicolores porque son líneas o áreas y no estamos dejando pintar partes de una linea o area de colores diferentes
  if (
    type === QueryViewerOutputType.Chart &&
    chartMetadataAndData.Series.DataFields.length > 1 &&
    !chartTypes.Splitted
  ) {
    return false;
  }

  let multicoloredSerie;

  // Multi series: al haber más de una serie hay una leyenda indicando el color de cada serie, por lo tanto todos los valores tienen que tener el mismo color
  // else {
  //   // Single series
  //   const existConditionalColors = ExistColors(datum.ConditionalStyles);
  //   let existValuesColors = false;
  //   if (uniqueAxis != null) {
  //     existValuesColors = ExistColors(uniqueAxis.ValuesStyles);
  //   } // Si tengo una sola categoria tambien se puede hacer por valor si corresponde
  //   multicoloredSerie = existConditionalColors || existValuesColors; // Es multicolor si existen colores condicionales o colores por valor
  // }}

  return multicoloredSerie;
}

export function NormalizeTargetAndMaximumValues(serie: QueryViewerChartSerie) {
  if (serie.TargetValue <= 0) {
    serie.TargetValue = 100;
  }
  if (serie.MaximumValue <= 0) {
    serie.MaximumValue = 100;
  }
  if (serie.MaximumValue < serie.TargetValue) {
    serie.MaximumValue = serie.TargetValue;
  }
}

// export function GetColorObject(colorStr: string) {
//   return { IsDefault: false, Color: colorStr, ColorIndex: "-1" };
// }

// export function CalculatePlotBands(qViewer: any, datum: any) {
//   for (let j = 0; j < datum.ConditionalStyles.length; j++) {
//     const conditionalStyle = datum.ConditionalStyles[j];
//     const arr = GetColorFromStyle(conditionalStyle.StyleOrClass, true);
//     const colorFound = arr[0];
//     const backgroundColor = arr[1];
//     if (colorFound) {
//       plotBand = {};
//       plotBand.Color = GetColorObject(backgroundColor);
//       if (conditionalStyle.Operator === QueryViewerConditionOperator.Interval) {
//         plotBand.From = parseFloat(conditionalStyle.Value1);
//         plotBand.To = parseFloat(conditionalStyle.Value2);
//       } else if (
//         conditionalStyle.Operator === QueryViewerConditionOperator.Equal
//       ) {
//         plotBand.From = parseFloat(conditionalStyle.Value1);
//         plotBand.To = parseFloat(conditionalStyle.Value1);
//       } else if (
//         conditionalStyle.Operator ===
//           QueryViewerConditionOperator.GreaterOrEqual ||
//         conditionalStyle.Operator === QueryViewerConditionOperator.GreaterThan
//       ) {
//         plotBand.From = parseFloat(conditionalStyle.Value1);
//       } else if (
//         conditionalStyle.Operator ===
//           QueryViewerConditionOperator.LessOrEqual ||
//         conditionalStyle.Operator === QueryViewerConditionOperator.LessThan
//       ) {
//         plotBand.To = parseFloat(conditionalStyle.Value1);
//       }
//       plotBand.SeriesName = datum.Title !== "" ? datum.Title : datum.Name;
//       qViewer.Chart.PlotBands.push(plotBand);
//     }
//   }
// }

// function GetValueStyleColor(
//   axis: QueryViewerServiceMetaDataAxis,
//   value: string
// ) {
//   // Obtiene el color que corresponde al valor según el ValueStyle
//   let arr = [false, ""];
//   for (let i = 0; i < axis.ValuesStyles.length; i++) {
//     const valueStyle = axis.ValuesStyles[i];
//     if (valueStyle.Value === value) {
//       arr = GetColorFromStyle(valueStyle.StyleOrClass, false);
//       break;
//     }
//   }
//   return arr;
// }
// const conditionalStyleDictionary: {
//   [key in QueryViewerConditionOperator]: (
//     value: string,
//     conditionalStyle: QueryViewerAxisConditionalStyle
//   ) => boolean;
// } = {
//   [QueryViewerConditionOperator.Equal]: (value, conditionalStyle) =>
//     value === conditionalStyle.Value1,
//   [QueryViewerConditionOperator.GreaterThan]: (value, conditionalStyle) =>
//     value > conditionalStyle.Value1,
//   [QueryViewerConditionOperator.LessThan]: (value, conditionalStyle) =>
//     value < conditionalStyle.Value1,
//   [QueryViewerConditionOperator.GreaterOrEqual]: (value, conditionalStyle) =>
//     value >= conditionalStyle.Value1,
//   [QueryViewerConditionOperator.LessOrEqual]: (value, conditionalStyle) =>
//     value <= conditionalStyle.Value1,
//   [QueryViewerConditionOperator.NotEqual]: (value, conditionalStyle) =>
//     value !== conditionalStyle.Value1,
//   [QueryViewerConditionOperator.Interval]: (value, conditionalStyle) =>
//     conditionalStyle.Value1 && value <= conditionalStyle.Value2
// };

// const satisfyStyle = (
//   value: string,
//   conditionalStyle: QueryViewerAxisConditionalStyle
// ): boolean =>
//   conditionalStyleDictionary[conditionalStyle.Operator](
//     value,
//     conditionalStyle
//   );

// function GetConditionalColor(
//   datum: QueryViewerServiceMetaDataData,
//   value: string
// ) {
//   // Obtiene el color que corresponde al valor según el Style condicional
//   let arr = [false, ""];
//   let conditionSatisfied = false;
//   for (let i = 0; i < datum.ConditionalStyles.length; i++) {
//     const conditionalStyle = datum.ConditionalStyles[i];
//     conditionSatisfied = satisfyStyle(value, conditionalStyle);
//     if (conditionSatisfied) {
//       arr = GetColorFromStyle(conditionalStyle.StyleOrClass, false);
//       break;
//     }
//   }
//   return arr;
// }

// export function GetColor(
//   multicoloredSerie: any,
//   datum: any,
//   uniqueAxis: any,
//   seriesIndex: any,
//   colorIndex: any,
//   categoryLabel: any,
//   value: any
// ) {
//   const HIGHCHARTS_MAX_COLORS = 36;
//   let color;
//   let colorIndexAux = -1;
//   let isDefaultColor = false;
//   let arr;
//   if (multicoloredSerie) {
//     // Cada valor de la serie tiene un color diferente
//     var colorFound = false;
//     if (uniqueAxis != null) {
//       arr = GetValueStyleColor(uniqueAxis, categoryLabel); // Busco primero en los style por valor
//       colorFound = arr[0];
//       color = arr[1];
//     }
//     if (!colorFound) {
//       arr = GetConditionalColor(datum, value); // Busco luego en los styles condicionales
//       colorFound = arr[0];
//       color = arr[1];
//       if (!colorFound) {
//         colorIndexAux = colorIndex % HIGHCHARTS_MAX_COLORS;
//         isDefaultColor = true;
//       }
//     }
//   } else {
//     // Todos los valores de la serie con el mismo valor
//     arr = GetColorFromStyle(datum.Style, false);
//     colorFound = arr[0];
//     color = arr[1];
//     if (!colorFound) {
//       colorIndexAux = seriesIndex % HIGHCHARTS_MAX_COLORS;
//       isDefaultColor = true;
//     }
//   }
//   return { IsDefault: isDefaultColor, Color: color, ColorIndex: colorIndexAux };
// }

// export function GetNullColor() {
//   return GetColorObject("");
// }

// export function CalculateColorAxis(qViewer: any, datum: any) {
//   qViewer.Chart.colorAxis = qViewer.Chart.colorAxis || {};
//   qViewer.Chart.colorAxis.dataClasses =
//     qViewer.Chart.colorAxis.dataClasses || [];

//   for (let j = 0; j < datum.ConditionalStyles.length; j++) {
//     const conditionalStyle = datum.ConditionalStyles[j];
//     colorAxis = {};
//     colorAxis.dataClasses = [];
//     const dataclasses = {};
//     dataclasses.color = conditionalStyle.StyleOrClass.replace("color:", "");

//     if (conditionalStyle.Operator === QueryViewerConditionOperator.Interval) {
//       dataclasses.from = parseFloat(conditionalStyle.Value1);
//       dataclasses.to = parseFloat(conditionalStyle.Value2);
//       dataclasses.Operator = QueryViewerConditionOperatorSymbol.Interval;
//     } else if (
//       conditionalStyle.Operator === QueryViewerConditionOperator.Equal
//     ) {
//       dataclasses.from = parseFloat(conditionalStyle.Value1);
//       dataclasses.Operator = QueryViewerConditionOperatorSymbol.Equal;
//     } else if (
//       conditionalStyle.Operator === QueryViewerConditionOperator.GreaterOrEqual
//     ) {
//       dataclasses.from = parseFloat(conditionalStyle.Value1);
//       dataclasses.Operator = QueryViewerConditionOperatorSymbol.GreaterOrEqual;
//     } else if (
//       conditionalStyle.Operator === QueryViewerConditionOperator.GreaterThan
//     ) {
//       dataclasses.from = parseFloat(conditionalStyle.Value1);
//       dataclasses.Operator = QueryViewerConditionOperatorSymbol.GreaterThan;
//     } else if (
//       conditionalStyle.Operator === QueryViewerConditionOperator.LessThan
//     ) {
//       dataclasses.to = parseFloat(conditionalStyle.Value1);
//       dataclasses.Operator = QueryViewerConditionOperatorSymbol.LessThan;
//     } else if (
//       conditionalStyle.Operator === QueryViewerConditionOperator.LessOrEqual
//     ) {
//       dataclasses.to = parseFloat(conditionalStyle.Value1);
//       dataclasses.Operator = QueryViewerConditionOperatorSymbol.LessOrEqual;
//     } else if (
//       conditionalStyle.Operator === QueryViewerConditionOperator.NotEqual
//     ) {
//       dataclasses.from = parseFloat(conditionalStyle.Value1);
//       dataclasses.Operator = QueryViewerConditionOperatorSymbol.NotEqual;
//     }
//     qViewer.Chart.colorAxis.dataClasses.push(dataclasses);
//   }
// }

// export function IsFilteredRow(qViewer: any, row: any) {
//   let filtered = false;
//   for (let i = 0; i < qViewer.Metadata.Axes.length; i++) {
//     const axis = qViewer.Metadata.Axes[i];
//     if (
//       axis.Visible === QueryViewerVisible.Yes ||
//       axis.Visible === QueryViewerVisible.Always
//     ) {
//       const value = trim(row[axis.DataField]);
//       // Controlo contra la propiedad Filter
//       if (axis.Filter.Type === QueryViewerFilterType.HideAllValues) {
//         filtered = true;
//         break;
//       } else if (axis.Filter.Type === QueryViewerFilterType.ShowSomeValues) {
//         if (axis.Filter.Values.indexOf(value) < 0) {
//           filtered = true;
//           break;
//         }
//       }
//     }
//   }
//   return filtered;
// }

// function ApplyPicture(
//   value: any,
//   picture: any,
//   dataType: any,
//   pictureProperties: any
// ) {
//   switch (dataType) {
//     case QueryViewerDataType.Integer:
//     case QueryViewerDataType.Real:
//       return formatNumber(
//         value,
//         pictureProperties.DecimalPrecision,
//         picture,
//         false
//       );
//     case QueryViewerDataType.Boolean:
//     case QueryViewerDataType.Character:
//     case QueryViewerDataType.GUID:
//     case QueryViewerDataType.GeoPoint:
//       return trim(value);
//     case QueryViewerDataType.Date:
//     case QueryViewerDataType.DateTime:
//       return formatDateTime(
//         value,
//         dataType,
//         pictureProperties.DateFormat,
//         pictureProperties.IncludeHours,
//         pictureProperties.IncludeMinutes,
//         pictureProperties.IncludeSeconds,
//         pictureProperties.IncludeMilliseconds
//       );
//   }
// }

// function GetCategoryLabel(qViewer: any, row: any, axesByDataField: any) {
//   let label = "";
//   let labelWithPicture = "";
//   for (let i = 0; i < qViewer.Chart.Categories.DataFields.length; i++) {
//     const dataField = qViewer.Chart.Categories.DataFields[i];
//     var value;
//     var valueWithPicture;
//     if (row[dataField] !== undefined) {
//       value = trim(row[dataField]);
//       valueWithPicture = ApplyPicture(
//         value,
//         axesByDataField[dataField].Picture,
//         axesByDataField[dataField].DataType,
//         axesByDataField[dataField].PictureProperties
//       );
//     } else {
//       value = qViewer.Metadata.TextForNullValues;
//       valueWithPicture = qViewer.Metadata.TextForNullValues;
//     }
//     label += (label === "" ? "" : ", ") + value;
//     labelWithPicture +=
//       (labelWithPicture === "" ? "" : ", ") + valueWithPicture;
//   }
//   return [label, labelWithPicture];
// }

// export function AddCategoryValue(
//   qViewer: any,
//   row: any,
//   valueIndex: any,
//   axesByDataField: any
// ) {
//   const arr = GetCategoryLabel(qViewer, row, axesByDataField);
//   const categoryValue = {};
//   categoryValue.Value = arr[0];
//   categoryValue.ValueWithPicture = arr[1];
//   qViewer.Chart.Categories.Values.push(categoryValue);
//   if (valueIndex === 0) {
//     qViewer.Chart.Categories.MinValue = categoryValue.Value;
//     qViewer.Chart.Categories.MaxValue = categoryValue.Value;
//   } else {
//     if (categoryValue.Value > qViewer.Chart.Categories.MaxValue) {
//       qViewer.Chart.Categories.MaxValue = categoryValue.Value;
//     }
//     if (categoryValue.Value < qViewer.Chart.Categories.MinValue) {
//       qViewer.Chart.Categories.MinValue = categoryValue.Value;
//     }
//   }
// }

// export function AddSeriesValues(
//   qViewer: any,
//   row: any,
//   valueIndex: any,
//   dataByDataField: any,
//   uniqueAxis: any
// ) {
//   for (let i = 0; i < qViewer.Chart.Series.DataFields.length; i++) {
//     const serie = qViewer.Chart.Series.ByIndex[i];
//     const dataField = qViewer.Chart.Series.DataFields[i];
//     const value = row[dataField] !== undefined ? row[dataField] : null;
//     const point = {};
//     point.Value = value;
//     const datum = dataByDataField[dataField].Datum;
//     const multicoloredSerie = dataByDataField[dataField].Multicolored;
//     if (datum.Aggregation === QueryViewerAggregationType.Average) {
//       let value_N = row[dataField + "_N"];
//       let value_D = row[dataField + "_D"];
//       if (value_N === undefined && value_D === undefined) {
//         // Caso de un dataprovider donde se le asigna agregación = Average por código
//         value_N = value;
//         value_D = "1";
//       }
//       point.Value_N = value_N;
//       point.Value_D = value_D;
//     }
//     if (multicoloredSerie) {
//       point.Color = GetColor(
//         multicoloredSerie,
//         datum,
//         uniqueAxis,
//         0,
//         valueIndex,
//         qViewer.Chart.Categories.Values[valueIndex].Value,
//         value
//       );
//     } else {
//       point.Color = GetNullColor();
//     }
//     serie.Points.push(point);
//     if (point.Value > 0) {
//       serie.PositiveValues = true;
//     }
//     if (point.Value < 0) {
//       serie.NegativeValues = true;
//     }
//     if (valueIndex === 0) {
//       serie.MinValue = parseFloat(point.Value);
//       serie.MaxValue = parseFloat(point.Value);
//     } else {
//       if (parseFloat(point.Value) > serie.MaxValue) {
//         serie.MaxValue = parseFloat(point.Value);
//       }
//       if (parseFloat(point.Value) < serie.MinValue) {
//         serie.MinValue = parseFloat(point.Value);
//       }
//     }
//   }
// }

export const SelectionAllowed = (
  allowSelection: boolean,
  type: QueryViewerOutputType,
  chartType: QueryViewerChartType
) =>
  allowSelection &&
  type !== QueryViewerOutputType.Card &&
  !(
    type === QueryViewerOutputType.Chart &&
    (chartType === QueryViewerChartType.CircularGauge ||
      chartType === QueryViewerChartType.LinearGauge)
  );
// Las gráficas gauge no tienen eje X

// export function formatNumber(
//   number,
//   decimalPrecision,
//   picture,
//   removeTrailingZeroes
// ) {
//   let formattedNumber = gx.num.formatNumber(
//     number,
//     decimalPrecision,
//     picture,
//     0,
//     true,
//     false
//   );
//   if (removeTrailingZeroes) {
//     if (formattedNumber.indexOf(gx.decimalPoint) >= 0) {
//       while (qv.util.endsWith(formattedNumber, "0")) {
//         formattedNumber = formattedNumber.slice(0, -1);
//       }
//       if (qv.util.endsWith(formattedNumber, gx.decimalPoint)) {
//         formattedNumber = formattedNumber.slice(0, -1);
//       }
//     }
//   }
//   return formattedNumber;
// }

// ToDo: implement this when the picture is done
export function TooltipFormatter(
  evArg: TooltipFormatterContextObject,
  sharedTooltip: boolean,
  isRTL: boolean,
  chartTypes: ChartTypes
) {
  // let qViewer;
  const res = "";
  if (sharedTooltip) {
    // ToDo: implement this with the events
    // let firstPoint;
    // let index;
    // if (!evArg.points) {
    //   firstPoint = evArg.point;
    //   index = firstPoint.index;
    // } else {
    //   firstPoint = evArg.points[0];
    //   index = firstPoint.point.index;
    // }
    // qViewer = qv.collection[firstPoint.series.chart.options.qv.viewerId];
    // const hoverPoints = getHoverPoints(qViewer, index);
    // const x = !evArg.key ? (!evArg.x ? "" : evArg.x) : evArg.key;
    // const hasTitle =
    //   x !== "" && qViewer.RealChartType !== QueryViewerChartType.Sparkline; // en Sparkline la x no viene formateada
    // let res = "";
    // if (hasTitle) {
    //   isRTL ? (res += GetBoldRightText(x)) : (res += GetBoldText(x));
    // }
    // for (let i = 0; i < hoverPoints.length; i++) {
    //   const point = hoverPoints[i];
    //   const seriesIndex = point.series.chart.options.qv.seriesIndex;
    //   const serie = chartMetadataAndData.Series.ByIndex[seriesIndex];
    //   if (isRTL) {
    //     res +=
    //       (hasTitle || i > 0 ? "<br/>" : "") +
    //       formatNumber(
    //         point.y,
    //         serie.NumberFormat.DecimalPrecision,
    //         serie.Picture,
    //         false
    //       );
    //     res += " :" + point.series.name;
    //   } else {
    //     res += (hasTitle || i > 0 ? "<br/>" : "") + point.series.name + ": ";
    //     res += formatNumber(
    //       point.y,
    //       serie.NumberFormat.DecimalPrecision,
    //       serie.Picture,
    //       false
    //     );
    //   }
    // }
  } else {
    // qViewer = qv.collection[evArg.series.chart.options.qv.viewerId];
    // const seriesIndex = evArg.series.index;
    // const serie = chartMetadataAndData.Series.ByIndex[seriesIndex];
    // const picture = chartTypes.Gauge ? "ZZZZZZZZZZZZZZ9.99" : serie.Picture;
    // const decimalPrecision = chartTypes.Gauge
    //   ? 2
    //   : serie.NumberFormat.DecimalPrecision;
    // const removeTrailingZeroes = chartTypes.Gauge;
    return isRTL
      ? (chartTypes.Gauge ? "%" : "") +
          // formatNumber(
          //   evArg.point.y,
          //   decimalPrecision,
          //   picture,
          //   removeTrailingZeroes
          // )
          evArg.point.y +
          "<b>: " +
          (evArg.point.name !== "" ? evArg.point.name : evArg.series.name) +
          "<b>"
      : "<b>" +
          (evArg.point.name !== "" ? evArg.point.name : evArg.series.name) +
          "</b>: " +
          // formatNumber(
          //   evArg.point.y,
          //   decimalPrecision,
          //   picture,
          //   removeTrailingZeroes
          // )
          evArg.point.y +
          (chartTypes.Gauge ? "%" : "");
  }
  return res;
}

// export function GetDuration(point) {
//   const value = point.y;
//   const points = point.series.data;
//   const index = point.index;
//   let duration = "";
//   let max = index;
//   for (var i = index + 1; i < points.length; i++) {
//     if (points[i].y != value) {
//       break;
//     }
//     max = i;
//   }
//   if (max < points.length - 1) {
//     max++;
//   }
//   let min = index;
//   for (var i = index - 1; i >= 0; i--) {
//     if (points[i].y != value) {
//       break;
//     }
//     min = i;
//   }
//   const seconds = (points[max].x - points[min].x) / 1000;
//   duration =
//     " (" +
//     gx.getMessage("GXPL_QViewerDuration") +
//     ": " +
//     qv.util.seconsdToText(seconds) +
//     ")";
//   return duration;
// }
