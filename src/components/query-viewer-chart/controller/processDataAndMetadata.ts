import {
  QueryViewerDataType,
  QueryViewerOutputType,
  QueryViewerTranslations,
  QueryViewerVisible
} from "../../../common/basic-types";
import {
  QueryViewerServiceMetaData,
  QueryViewerServiceMetaDataData,
  QueryViewerServiceResponse
} from "../../../services/types/service-result";
import { ChartTypes } from "./chart-types";

type ChartMetadataAndData = {
  Categories: {
    DataFields: string[];
    MinValue: number;
    MaxValue: number;
    Values: number[];
  };
  Series: { DataFields: string[] };
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
    Series: { DataFields: [] }
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

function GetAxesByDataFieldObj(qViewer) {
  const axesByDataField = {};
  for (let i = 0; i < qViewer.Metadata.Axes.length; i++) {
    const axis = qViewer.Metadata.Axes[i];
    const pictureProperties = qv.util.GetPictureProperties(
      axis.DataType,
      axis.Picture
    );
    axesByDataField[axis.DataField] = {
      Picture: axis.Picture,
      DataType: axis.DataType,
      PictureProperties: pictureProperties,
      Filter: axis.Filter
    };
  }
  return axesByDataField;
}

// function GetDataByDataFieldObj(qViewer, uniqueAxis) {

//     function IsMulticoloredSerie(qViewer, datum, uniqueAxis) {

//         function ExistColors(styles) {
//             // Verifica si hay colores a partir de Styles condicionales
//             var existColors = false;
//             for (var i = 0; i < styles.length; i++) {
//                 var style = styles[i];
//                 var arr = GetColorFromStyle(style.StyleOrClass, false);
//                 var colorFound = arr[0];
//                 if (colorFound) {
//                     existColors = true;
//                     break;
//                 }
//             }
//             return existColors;
//         }

//         var multicoloredSerie;
//         if (qViewer.RealType == QueryViewerOutputType.Map && ((qViewer.MapType == QueryViewerMapType.Choropleth && qViewer.Chart.colorAxis != "") || (qViewer.MapType == QueryViewerMapType.Bubble && qViewer.Chart.colorAxis != "")))
//             multicoloredSerie = false;					// Estos tipos de gráfica tienen que dibujar sí o sí cada valor de referencia con un color diferente
//         else if (qViewer.RealType == QueryViewerOutputType.Map && ((qViewer.MapType == QueryViewerMapType.Choropleth && (qViewer.Chart.colorAxis.dataClasses.length == 0)) || (qViewer.MapType == QueryViewerMapType.Bubble && (qViewer.Chart.colorAxis.dataClasses.length == 0))))
//             multicoloredSerie = true;				// En este tipo de mapas todos los valores van a ir del mismo color
//         if (qViewer.RealType == QueryViewerOutputType.Chart && (qv.chart.IsSingleSerieChart(qViewer) || (qViewer.RealChartType == QueryViewerChartType.PolarArea && qViewer.Chart.Series.DataFields.length == 1)))
//             multicoloredSerie = true;					// Estos tipos de gráfica tienen que dibujar sí o sí cada valor con un color diferente
//         else if (qViewer.RealType == QueryViewerOutputType.Chart && (qv.chart.IsAreaChart(qViewer) || qv.chart.IsLineChart(qViewer) || qViewer.RealChartType == QueryViewerChartType.Radar || qViewer.RealChartType == QueryViewerChartType.FilledRadar))
//             multicoloredSerie = false;					// Estos tipos de gráfica no pueden ser multicolores porque son líneas o áreas y no estamos dejando pintar partes de una linea o area de colores diferentes
//         else if (qViewer.RealType == QueryViewerOutputType.Chart && (qViewer.Chart.Series.DataFields.length > 1 && !qv.chart.IsSplittedChart(qViewer)))
//             multicoloredSerie = false;					// Multi series: al haber más de una serie hay una leyenda indicando el color de cada serie, por lo tanto todos los valores tienen que tener el mismo color
//         else {
//             // Single series
//             var existConditionalColors = ExistColors(datum.ConditionalStyles);
//             var existValuesColors = false;
//             if (uniqueAxis != null)
//                 existValuesColors = ExistColors(uniqueAxis.ValuesStyles);	// Si tengo una sola categoria tambien se puede hacer por valor si corresponde
//             multicoloredSerie = (existConditionalColors || existValuesColors);	// Es multicolor si existen colores condicionales o colores por valor
//         }
//         return multicoloredSerie;
//     }

//     var dataByDataField = {};
//     var totData = TotData(qViewer.Metadata.Data);
//     for (var i = 0; i < qViewer.Metadata.Data.length; i++) {
//         var datum = qViewer.Metadata.Data[i];
//         if (VisibleDatum(totData, datum)) {
//             var multicolored = IsMulticoloredSerie(qViewer, datum, uniqueAxis)
//             dataByDataField[datum.DataField] = { Datum: datum, Multicolored: multicolored };
//         }
//     }
//     return dataByDataField;

// }

// function GetColorFromStyle(style, isBackgroundColor) {
//     var color = "";
//     var colorFound = false;
//     var colorKey = isBackgroundColor ? "backgroundcolor" : "color";
//     if (style != "") {
//         var keyValuePairs = style.split(";");
//         for (var i = 0; i < keyValuePairs.length; i++) {
//             var keyValuePairStr = keyValuePairs[i];
//             var keyValuePair = keyValuePairStr.split(":");
//             if (keyValuePair.length == 2) {
//                 var key = qv.util.trim(keyValuePair[0]);
//                 var value = qv.util.trim(keyValuePair[1]);
//                 if (key.toLowerCase() == colorKey) {
//                     color = value;
//                     colorFound = (value != "");
//                     break;
//                 }
//             }
//         }
//         if (colorFound && color.substr(0, 1) == "#")
//             color = color.replace("#", "");
//     }
//     return [colorFound, color];
// }

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

// function AddCategoryValue(qViewer, row, valueIndex, axesByDataField) {

//     function GetCategoryLabel(qViewer, row, axesByDataField) {

//         var label = "";
//         var labelWithPicture = "";
//         for (var i = 0; i < qViewer.Chart.Categories.DataFields.length; i++) {
//             var dataField = qViewer.Chart.Categories.DataFields[i];
//             var value;
//             var valueWithPicture;
//             if (row[dataField] != undefined) {
//                 value = qv.util.trim(row[dataField]);
//                 valueWithPicture = qv.util.ApplyPicture(value, axesByDataField[dataField].Picture, axesByDataField[dataField].DataType, axesByDataField[dataField].PictureProperties);
//             }
//             else {
//                 value = qViewer.Metadata.TextForNullValues;
//                 valueWithPicture = qViewer.Metadata.TextForNullValues;
//             }
//             label += (label == "" ? "" : ", ") + value;
//             labelWithPicture += (labelWithPicture == "" ? "" : ", ") + valueWithPicture;
//         }
//         return [label, labelWithPicture];
//     }

//     var arr = GetCategoryLabel(qViewer, row, axesByDataField);
//     var categoryValue = {};
//     categoryValue.Value = arr[0];
//     categoryValue.ValueWithPicture = arr[1];
//     qViewer.Chart.Categories.Values.push(categoryValue);
//     if (valueIndex == 0) {
//         qViewer.Chart.Categories.MinValue = categoryValue.Value;
//         qViewer.Chart.Categories.MaxValue = categoryValue.Value;
//     }
//     else {
//         if (categoryValue.Value > qViewer.Chart.Categories.MaxValue)
//             qViewer.Chart.Categories.MaxValue = categoryValue.Value;
//         if (categoryValue.Value < qViewer.Chart.Categories.MinValue)
//             qViewer.Chart.Categories.MinValue = categoryValue.Value;
//     }

// }

// function AddSeriesValues(qViewer, row, valueIndex, dataByDataField, uniqueAxis) {
//     for (var i = 0; i < qViewer.Chart.Series.DataFields.length; i++) {
//         var serie = qViewer.Chart.Series.ByIndex[i]
//         var dataField = qViewer.Chart.Series.DataFields[i];
//         var value = row[dataField] != undefined ? row[dataField] : null;
//         var point = {};
//         point.Value = value;
//         var datum = dataByDataField[dataField].Datum;
//         var multicoloredSerie = dataByDataField[dataField].Multicolored;
//         if (datum.Aggregation == QueryViewerAggregationType.Average) {
//             var value_N = row[dataField + "_N"];
//             var value_D = row[dataField + "_D"];
//             if (value_N == undefined && value_D == undefined) {
//                 // Caso de un dataprovider donde se le asigna agregación = Average por código
//                 value_N = value;
//                 value_D = "1";
//             }
//             point.Value_N = value_N;
//             point.Value_D = value_D;
//         }
//         if (multicoloredSerie)
//             point.Color = GetColor(multicoloredSerie, datum, uniqueAxis, 0, valueIndex, qViewer.Chart.Categories.Values[valueIndex].Value, value);
//         else
//             point.Color = qv.util.GetNullColor();
//         serie.Points.push(point);
//         if (point.Value > 0) serie.PositiveValues = true;
//         if (point.Value < 0) serie.NegativeValues = true;
//         if (valueIndex === 0) {
//             serie.MinValue = parseFloat(point.Value);
//             serie.MaxValue = parseFloat(point.Value);
//         }
//         else {
//             if (parseFloat(point.Value) > serie.MaxValue)
//                 serie.MaxValue = parseFloat(point.Value);
//             if (parseFloat(point.Value) < serie.MinValue)
//                 serie.MinValue = parseFloat(point.Value);
//         }

//     }
// }

// function CalculatePlotBands(qViewer, datum) {
//     for (var j = 0; j < datum.ConditionalStyles.length; j++) {
//         var conditionalStyle = datum.ConditionalStyles[j];
//         var arr = GetColorFromStyle(conditionalStyle.StyleOrClass, true);
//         var colorFound = arr[0];
//         var backgroundColor = arr[1];
//         if (colorFound) {
//             plotBand = {};
//             plotBand.Color = qv.util.GetColorObject(backgroundColor);
//             if (conditionalStyle.Operator == QueryViewerConditionOperator.Interval) {
//                 plotBand.From = parseFloat(conditionalStyle.Value1);
//                 plotBand.To = parseFloat(conditionalStyle.Value2);
//             } else if (conditionalStyle.Operator == QueryViewerConditionOperator.Equal) {
//                 plotBand.From = parseFloat(conditionalStyle.Value1);
//                 plotBand.To = parseFloat(conditionalStyle.Value1);
//             }
//             else if (conditionalStyle.Operator == QueryViewerConditionOperator.GreaterOrEqual || conditionalStyle.Operator == QueryViewerConditionOperator.GreaterThan)
//                 plotBand.From = parseFloat(conditionalStyle.Value1);
//             else if (conditionalStyle.Operator == QueryViewerConditionOperator.LessOrEqual || conditionalStyle.Operator == QueryViewerConditionOperator.LessThan)
//                 plotBand.To = parseFloat(conditionalStyle.Value1);
//             plotBand.SeriesName = datum.Title != "" ? datum.Title : datum.Name;
//             qViewer.Chart.PlotBands.push(plotBand);
//         }
//     }
// }

// function IsFilteredRow(qViewer, row) {
//     var filtered = false;
//     for (var i = 0; i < qViewer.Metadata.Axes.length; i++) {
//         var axis = qViewer.Metadata.Axes[i];
//         if (axis.Visible == QueryViewerVisible.Yes || axis.Visible == QueryViewerVisible.Always) {
//             var value = qv.util.trim(row[axis.DataField]);
//             // Controlo contra la propiedad Filter
//             if (axis.Filter.Type == QueryViewerFilterType.HideAllValues) {
//                 filtered = true;
//                 break;
//             }
//             else if (axis.Filter.Type == QueryViewerFilterType.ShowSomeValues) {
//                 if (axis.Filter.Values.indexOf(value) < 0) {
//                     filtered = true;
//                     break;
//                 }
//             }
//             if (qViewer.RealType === QueryViewerOutputType.Map && axis.DataType === QueryViewerDataType.Character) {
//                 // En mapas de Continent y Country filtro los países o estados que quedan fuera del mapa
//                 if (qViewer.Region === QueryViewerRegion.Country) {
//                     if (!qv.util.startsWith(value.toUpperCase(), qViewer.Country + "-")) {
//                         filtered = true;
//                         break;
//                     }
//                 } else if (qViewer.Region === QueryViewerRegion.Continent) {
//                     switch (qViewer.Continent) {
//                         case QueryViewerContinent.Africa:
//                             filtered = !qv.map.IsAfricanCountry(value.toUpperCase());
//                             break;
//                         case QueryViewerContinent.Asia:
//                             filtered = !qv.map.IsAsianCountry(value.toUpperCase());
//                             break;
//                         case QueryViewerContinent.Europe:
//                             filtered = !qv.map.IsEuropeanCountry(value.toUpperCase());
//                             break;
//                         case QueryViewerContinent.NorthAmerica:
//                             filtered = !qv.map.IsNorthAmericanCountry(value.toUpperCase());
//                             break;
//                         case QueryViewerContinent.Oceania:
//                             filtered = !qv.map.IsOceanianCountry(value.toUpperCase());
//                             break;
//                         case QueryViewerContinent.SouthAmerica:
//                             filtered = !qv.map.IsSouthAmericanCountry(value.toUpperCase());
//                             break;
//                         default:
//                             filtered = true;
//                             break;
//                     }
//                 }
//             }
//         }
//     }
//     return filtered;
// }

function XAxisDataTypeOK(
  serviceResponse: QueryViewerServiceResponse,
  type: QueryViewerOutputType,
  chartTypes: ChartTypes,
  translations: QueryViewerTranslations
) {
  const dataType = XAxisDataType(serviceResponse.MetaData);
  switch (type) {
    case QueryViewerOutputType.Chart:
      return {
        IsOK: chartTypes.DatetimeXAxis
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

// function aggregatePoints(chartSerie) {
//     var currentYValues = [];
//     var currentYQuantities = [];
//     var firstColor = "";
//     for (var i = 0; i < chartSerie.Points.length; i++) {
//         var yValue;
//         var yQuantity;
//         if (chartSerie.Aggregation == QueryViewerAggregationType.Count) {
//             yValue = 0;		// No se utiliza
//             yQuantity = parseFloat(qv.util.trim(chartSerie.Points[i].Value));
//         }
//         else {
//             if (chartSerie.Aggregation == QueryViewerAggregationType.Average) {
//                 yValue = parseFloat(qv.util.trim(chartSerie.Points[i].Value_N));
//                 yQuantity = parseFloat(qv.util.trim(chartSerie.Points[i].Value_D));
//             }
//             else {
//                 yValue = parseFloat(qv.util.trim(chartSerie.Points[i].Value));
//                 yQuantity = 1;
//             }
//         }
//         currentYValues.push(yValue);
//         currentYQuantities.push(yQuantity);
//         if (firstColor == "") firstColor = chartSerie.Points[i].Color;
//     }
//     var value = qv.util.aggregate(chartSerie.Aggregation, currentYValues, currentYQuantities).toString();
//     chartSerie.Points = [{ Value: value, Value_N: value, Value_D: "1", Color: firstColor }];
//     chartSerie.NegativeValues = value < 0;
//     chartSerie.PositiveValues = value > 0;
// }

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
  chartTypes: ChartTypes,
  translations: QueryViewerTranslations
) {
  const xAxisDataTypeStatus = XAxisDataTypeOK(
    serviceResponse,
    type,
    chartTypes,
    translations
  );
  if (!xAxisDataTypeStatus.IsOK) {
    return xAxisDataTypeStatus.Error;
  }

  // Obtengo DataFields de categorias y series
  const result: ChartMetadataAndData = GetCategoriesAndSeriesDataFields(
    serviceResponse.MetaData,
    type
  );

  const axesByDataField = GetAxesByDataFieldObj(qViewer);

  // Inicializo series
  result.Series.ByIndex = [];
  const uniqueAxis =
    result.Categories.DataFields.length == 1
      ? qv.util.GetAxisByDataField(qViewer, result.Categories.DataFields[0])
      : null;
  const dataByDataField = GetDataByDataFieldObj(qViewer, uniqueAxis);
  result.PlotBands = [];
  for (var i = 0; i < result.Series.DataFields.length; i++) {
    const dataField = result.Series.DataFields[i];
    const datum = dataByDataField[dataField].Datum;
    const multicoloredSerie = dataByDataField[dataField].Multicolored;

    var serie = {};
    serie.MinValue = null; // Minimum value for the serie from the dataset
    serie.MaxValue = null; // Maximum value for the serie from the dataset
    serie.FieldName = datum.Name; // Nombre del field correspondiente a serie
    serie.Name = datum.Title;
    serie.Visible = datum.Visible;
    serie.DataType = datum.DataType;
    serie.Aggregation = datum.Aggregation;

    const picture = datum.Picture;
    serie.Picture =
      picture == ""
        ? serie.DataType == QueryViewerDataType.Integer
          ? "ZZZZZZZZZZZZZZ9"
          : "ZZZZZZZZZZZZZZ9.99"
        : picture;
    serie.NumberFormat = qv.util.ParseNumericPicture(
      serie.DataType,
      serie.Picture
    );
    if (!multicoloredSerie) {
      serie.Color = GetColor(multicoloredSerie, datum, uniqueAxis, i, 0, "", 0);
    } else {
      serie.Color = qv.util.GetNullColor();
    }
    serie.TargetValue = datum.TargetValue;
    serie.MaximumValue = datum.MaximumValue; // MaximumValue property value (not the maximum value for the serie from the dataset)
    NormalizeTargetAndMaximumValues(serie);
    serie.PositiveValues = false;
    serie.NegativeValues = false;
    serie.Points = [];
    qViewer.Chart.Series.ByIndex.push(serie);
    // Si el dato tiene estilos condicionales, agrego las PlotBands correspondientes
    if (qViewer.RealType == QueryViewerOutputType.Chart) {
      CalculatePlotBands(qViewer, datum);
    }
    // Calculo colores segun los ConditionalStyles para las leyendas del mapa
    if (qViewer.RealType == QueryViewerOutputType.Map) {
      CalculateColorAxis(qViewer, datum);
    }
  }

  // Recorro valores y lleno categorías y series
  let valueIndex = 0;
  for (var i = 0; i < qViewer.Data.Rows.length; i++) {
    const row = qViewer.Data.Rows[i];
    if (!IsFilteredRow(qViewer, row)) {
      AddCategoryValue(qViewer, row, valueIndex, axesByDataField);
      AddSeriesValues(qViewer, row, valueIndex, dataByDataField, uniqueAxis);
      valueIndex++;
    }
  }

  if (
    qViewer.RealType == QueryViewerOutputType.Chart &&
    qv.chart.IsGaugeChart(qViewer)
  ) {
    for (var i = 0; i < qViewer.Chart.Series.DataFields.length; i++) {
      var serie = qViewer.Chart.Series.ByIndex[i];
      aggregatePoints(serie); // Sólo puede haber un punto por serie para el Gauge
    }
  }

  return "";
}
