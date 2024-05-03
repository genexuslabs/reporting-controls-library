import {
  QueryViewerServiceDataRow,
  QueryViewerServiceMetaData,
  QueryViewerServiceMetaDataData,
  QueryViewerServiceResponse
} from "@genexus/reporting-api";
import { trimUtil } from "@genexus/reporting-api";
import {
  //   DateTimePicture,
  QueryViewerAggregationType,
  QueryViewerCategoryValue,
  QueryViewerChartCategories,
  QueryViewerChartPoint,
  QueryViewerChartSerie,
  QueryViewerChartType,
  QueryViewerDataType,
  QueryViewerFilterType,
  QueryViewerOutputType,
  QueryViewerPlotSeries,
  QueryViewerTranslations,
  QueryViewerVisible
} from "@genexus/reporting-api";
import {
  IsMulticoloredSerie,
  NormalizeTargetAndMaximumValues,
  aggregate,
  //   getPictureProperties,
  parseNumericPicture
} from "../../../utils/general";
import { ChartTypes, IS_CHART_TYPE, isDatetimeXAxis } from "./chart-types";
import { GxBigNumber } from "@genexus/web-standard-functions/dist/lib/types/gxbignumber";

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
    if (datum.dataField !== "F0") {
      // Quantity
      totData++;
    }
  });
  return totData;
}

export function XAxisDataType(
  Metadata: QueryViewerServiceMetaData
): QueryViewerDataType {
  let cantRowsOrColumns = 0;
  let dataType = QueryViewerDataType.Character;
  Metadata.axes.forEach(axis => {
    if (
      axis.visible === QueryViewerVisible.Yes ||
      axis.visible === QueryViewerVisible.Always
    ) {
      cantRowsOrColumns++;
      dataType = axis.dataType;
    }
  });
  return cantRowsOrColumns === 1 ? dataType : QueryViewerDataType.Character; // Pues se concatenan los valores
}

const VisibleDatum = (totData: number, datum: QueryViewerServiceMetaDataData) =>
  totData === 1
    ? datum.visible === QueryViewerVisible.Yes ||
      datum.visible === QueryViewerVisible.Always
    : datum.visible !== QueryViewerVisible.Never;

function GetCategoriesAndSeriesDataFields(
  Metadata: QueryViewerServiceMetaData,
  type: QueryViewerOutputType
) {
  const result: ChartMetadataAndData = {
    Categories: { DataFields: [], MinValue: null, MaxValue: null, Values: [] },
    Series: {
      ByIndex: [],
      DataFields: []
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
  Metadata.axes.forEach(axis => {
    if (
      (axis.visible === QueryViewerVisible.Yes ||
        axis.visible === QueryViewerVisible.Always) &&
      (type !== QueryViewerOutputType.Map ||
        axis.dataType === QueryViewerDataType.Character)
    ) {
      // only character dimensions are valid for Maps
      result.Categories.DataFields.push(axis.dataField);
    }
  });

  const totData = TotData(Metadata.data);
  Metadata.data.forEach(datum => {
    if (VisibleDatum(totData, datum)) {
      result.Series.DataFields.push(datum.dataField);
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

// function GetAxesByDataFieldObj(Metadata: QueryViewerServiceMetaData): {
//   [key: string]: {
//     Picture: string;
//     DataType: QueryViewerDataType;
//     PictureProperties: DateTimePicture;
//     Filter: {
//       Type: QueryViewerFilterType;
//       Values: string[];
//     };
//   };
// } {
//   const axesByDataField: {
//     [key: string]: {
//       Picture: string;
//       DataType: QueryViewerDataType;
//       PictureProperties: DateTimePicture;
//       Filter: {
//         Type: QueryViewerFilterType;
//         Values: string[];
//       };
//     };
//   } = {};
//   Metadata.Axes.forEach(axis => {
//     const pictureProperties = getPictureProperties(axis.DataType, axis.Picture);
//     axesByDataField[axis.DataField] = {
//       Picture: axis.Picture,
//       DataType: axis.DataType,
//       PictureProperties: pictureProperties,
//       Filter: axis.Filter
//     };
//   });

//   return axesByDataField;
// }

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
  const totData = TotData(Metadata.data);

  Metadata.data.forEach(datum => {
    if (VisibleDatum(totData, datum)) {
      dataByDataField[datum.dataField] = {
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
  categories: QueryViewerChartCategories,
  metadata: QueryViewerServiceMetaData,
  row: QueryViewerServiceDataRow
  // axesByDataField: string[]
): QueryViewerCategoryValue {
  const labels: string[] = [];
  const labelsWithPicture: string[] = [];

  categories.DataFields.forEach(dataField => {
    let value: string;
    // let valueWithPicture;

    if (row[dataField] !== undefined) {
      value = trimUtil(row[dataField]);
      // valueWithPicture = ApplyPicture(
      //   value,
      //   axesByDataField[dataField].Picture,
      //   axesByDataField[dataField].DataType,
      //   axesByDataField[dataField].PictureProperties
      // );
    } else {
      value = metadata.textForNullValues;
      // valueWithPicture = metadata.TextForNullValues;
    }

    labels.push(value);
    // labelsWithPicture.push(valueWithPicture);
  });

  return {
    Value: labels.join(", "),
    ValueWithPicture: labelsWithPicture.join(", ")
  };
}

function AddCategoryValue(
  categories: QueryViewerChartCategories,
  metaData: QueryViewerServiceMetaData,
  row: QueryViewerServiceDataRow,
  valueIndex: number
) {
  const categoryValue = GetCategoryLabel(categories, metaData, row);
  categories.Values.push(categoryValue);

  if (valueIndex === 0) {
    categories.MinValue = categoryValue.Value;
    categories.MaxValue = categoryValue.Value;
  } else {
    if (categoryValue.Value > categories.MaxValue) {
      categories.MaxValue = categoryValue.Value;
    }
    if (categoryValue.Value < categories.MinValue) {
      categories.MinValue = categoryValue.Value;
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
    const value = row[dataField] ?? null;
    const point: QueryViewerChartPoint = {
      Value: "",
      Value_N: "",
      Value_D: ""
    };
    point.Value = value;
    const datum = dataByDataField[dataField].Datum;
    // var multicoloredSerie = dataByDataField[dataField].Multicolored;
    if (datum.aggregation === QueryViewerAggregationType.Average) {
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
  for (let i = 0; i < Metadata.axes.length; i++) {
    const axis = Metadata.axes[i];
    if (
      axis.visible === QueryViewerVisible.Yes ||
      axis.visible === QueryViewerVisible.Always
    ) {
      const value = trimUtil(row[axis.dataField]);
      // Controlo contra la propiedad Filter
      if (
        axis.filter.type === QueryViewerFilterType.HideAllValues ||
        (axis.filter.type === QueryViewerFilterType.ShowSomeValues &&
          axis.filter.values.indexOf(value) < 0)
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
  chartType: QueryViewerChartType,
  translations: QueryViewerTranslations
) {
  const dataType = XAxisDataType(serviceResponse.MetaData);

  switch (type) {
    case QueryViewerOutputType.Chart:
      return {
        IsOK: isDatetimeXAxis(chartType)
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
    currentYValues.map(val => new GxBigNumber(val)),
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

export function processDataAndMetadata(
  serviceResponse: QueryViewerServiceResponse,
  type: QueryViewerOutputType,
  chartType: QueryViewerChartType,
  plotSeries: QueryViewerPlotSeries,
  translations: QueryViewerTranslations
): { error: string; chart: ChartMetadataAndData; chartTypes: ChartTypes } {
  const xAxisDataTypeStatus = XAxisDataTypeOK(
    serviceResponse,
    type,
    chartType,
    translations
  );
  if (!xAxisDataTypeStatus.IsOK) {
    return {
      error: xAxisDataTypeStatus.Error,
      chart: undefined,
      chartTypes: undefined
    };
  }

  // Obtengo DataFields de categorias y series
  const metadataAndData: ChartMetadataAndData =
    GetCategoriesAndSeriesDataFields(serviceResponse.MetaData, type);

  const chartTypes = IS_CHART_TYPE(
    chartType,
    metadataAndData.Series.DataFields.length,
    plotSeries
  );
  // const axesByDataField = GetAxesByDataFieldObj(serviceResponse.MetaData);

  // Inicializo series
  // const uniqueAxis =
  //   metadataAndData.Categories.DataFields.length === 1
  //     ? getAxisByDataField(
  //         serviceResponse.MetaData,
  //         metadataAndData.Categories.DataFields[0]
  //       )
  //     : null;

  const dataByDataField = GetDataByDataFieldObj(
    serviceResponse.MetaData,
    type,
    chartType,
    chartTypes,
    metadataAndData
  );

  metadataAndData.Series.DataFields.forEach(dataField => {
    const datum = dataByDataField[dataField].Datum;
    // const multicoloredSerie = dataByDataField[dataField].Multicolored;

    const serie: QueryViewerChartSerie = {
      MinValue: null, // Minimum value for the serie from the dataset
      MaxValue: null, // Maximum value for the serie from the dataset
      FieldName: datum.name, // Nombre del field correspondiente a serie
      Name: datum.title,
      Visible: datum.visible,
      DataType: datum.dataType,
      Aggregation: datum.aggregation,
      DataFields: null,
      Color: "",
      Picture: null,
      TargetValue: datum.targetValue,
      MaximumValue: datum.maximumValue, // MaximumValue property value (not the maximum value for the serie from the dataset)
      PositiveValues: false,
      NegativeValues: false,
      NumberFormat: null,
      Points: []
    };

    serie.Picture =
      datum.picture || serie.DataType === QueryViewerDataType.Integer
        ? "ZZZZZZZZZZZZZZ9"
        : "ZZZZZZZZZZZZZZ9.99";

    serie.NumberFormat = parseNumericPicture(serie.DataType, serie.Picture);
    // if (!multicoloredSerie) {
    //   serie.Color = GetColor(multicoloredSerie, datum, uniqueAxis, i, 0, "", 0);
    // } else {
    //   serie.Color = GetNullColor();
    // }
    NormalizeTargetAndMaximumValues(serie);

    metadataAndData.Series.ByIndex.push(serie);
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
  serviceResponse.Data.rows.forEach(row => {
    if (!IsFilteredRow(serviceResponse.MetaData, row)) {
      AddCategoryValue(
        metadataAndData.Categories,
        serviceResponse.MetaData,
        row,
        valueIndex
      );
      AddSeriesValues(metadataAndData, row, valueIndex, dataByDataField);
      valueIndex++;
    }
  });

  if (type === QueryViewerOutputType.Chart && chartTypes.Gauge) {
    metadataAndData.Series.ByIndex.forEach(serie => {
      aggregatePoints(serie); // Sólo puede haber un punto por serie para el Gauge
    });
  }

  return { error: "", chart: metadataAndData, chartTypes: chartTypes };
}
