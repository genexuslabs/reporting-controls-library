import {
  QueryViewerAggregationType,
  QueryViewerDataType
} from "../common/basic-types";
import {
  QueryViewerServiceDataRow,
  QueryViewerServiceMetaDataData
} from "../services/types/service-result";

export function parseNumericPicture(dataType: string, picture: string) {
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

// function formatNumber(number, decimalPrecision, picture, removeTrailingZeroes) {
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

// export function valueOrPercentage(
//   qViewer,
//   valueStr: string,
//   datum: QueryViewerServiceMetaDataDataAxis,
//   decimals: number
// ) {
//   let value;
//   let percentage;
//   if (valueStr != "") {
//     value = qv.util.formatNumber(
//       parseFloat(valueStr),
//       decimals,
//       datum.Picture,
//       false
//     );
//     percentage =
//       qv.util.formatNumber(
//         parseFloat((valueStr * 100) / datum.TargetValue),
//         2,
//         "ZZZZZZZZZZZZZZ9.99",
//         false
//       ) + "%";
//   } else {
//     value = "";
//     percentage = "";
//   }
//   switch (qViewer.ShowDataAs) {
//     case QueryViewerShowDataAs.Values:
//       return value;
//     case QueryViewerShowDataAs.Percentages:
//       return percentage;
//     case QueryViewerShowDataAs.ValuesAndPercentages:
//       return value + " (" + percentage + ")";
//     default:
//       return value;
//   }
// }

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

const aggregate = (
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

    if (datum.IsFormula) {
      let j = 0;
      let value = row[datum.DataField + "_1"];

      do {
        j++;
        value = row[datum.DataField + "_" + j.toString()];

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

      if (datum.Aggregation === QueryViewerAggregationType.Count) {
        yValue = 0; // Not used
        yQuantity = parseFloat(row[datum.DataField]);
      } else if (datum.Aggregation === QueryViewerAggregationType.Average) {
        yValue = parseFloat(row[datum.DataField + "_N"]);
        yQuantity = parseFloat(row[datum.DataField + "_D"]);
      } else {
        yValue = parseFloat(row[datum.DataField]);
        yQuantity = 1;
      }
      currentYValues.push(yValue);
      currentYQuantities.push(yQuantity);
    }
  }

  return datum.IsFormula
    ? evaluate(datum.Formula, datum.DataField + "_", variables.map(toString))
    : aggregate(
        datum.Aggregation,
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
    newRow[datum.DataField] = aggValue;
  });
  return newRow;
}
