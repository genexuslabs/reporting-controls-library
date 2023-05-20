import { QueryViewerAggregationType } from "../../common/basic-types";
import {
  QueryViewerServiceDataRow,
  QueryViewerServiceMetaDataData
} from "../../services/types/service-result";

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
