import { add } from "date-fns";

import {
  QueryViewerDataType,
  QueryViewerTrendPeriod
} from "../../common/basic-types";
import {
  QueryViewerServiceData,
  QueryViewerServiceDataRow,
  QueryViewerServiceMetaDataData
} from "../../services/types/service-result";
import { dateToString } from "../../utils/general";

function analyzeMain(
  start: number,
  regressionStart: number,
  xDataField: string,
  yDataField: string,
  rows: QueryViewerServiceDataRow[],
  xDataType: QueryViewerDataType
) {
  let minValue = null;
  let maxValue = null;
  let minWhen = null;
  let maxWhen = null;
  const chartSeriesData = [];

  const linearRegression: {
    AnyTrend: boolean;
    Slope?: number;
    Intercept?: number;
    R2?: number;
  } = { AnyTrend: false };

  if (!xDataField) {
    return {
      LinearRegression: linearRegression,
      MinValue: minValue,
      MinWhen: minWhen,
      MaxValue: maxValue,
      MaxWhen: maxWhen,
      ChartSeriesData: []
    };
  }

  /**
   * Amount of defined rows
   */
  let n = 0;

  const sums = {
    x: 0,
    y: 0,
    xy: 0,
    xx: 0,
    yy: 0
  };
  let regressionStartDate = null;
  let regressionStartY = null;
  const end = rows.length - 1;

  for (let i = start; i <= end; i++) {
    const rowXDataField = rows[i][xDataField];
    const rowYDataField = rows[i][yDataField];

    if (rowXDataField && rowYDataField) {
      n += 1;
      const date = new gx.date.gxdate(rowXDataField, "Y4MD");
      const yValue = parseFloat(rowYDataField);

      chartSeriesData.push({
        x: date.Value.getTime() - date.Value.getTimezoneOffset() * 60000,
        y: yValue
      });

      // Initialize the max and min values
      if (minValue == null && maxValue == null) {
        minWhen = rowXDataField;
        maxWhen = rowXDataField;
        minValue = yValue;
        maxValue = yValue;
      }
      // Update max value
      else if (yValue > maxValue) {
        maxWhen = rowXDataField;
        maxValue = yValue;
      }
      // Update min value
      else if (yValue < minValue) {
        minWhen = rowXDataField;
        minValue = yValue;
      }

      if (i >= regressionStart) {
        if (regressionStartDate === null && regressionStartY === null) {
          regressionStartDate = date;
          regressionStartY = yValue;
        }
        // Change of variable to not handle such large numbers
        const x =
          xDataType === QueryViewerDataType.Date
            ? gx.date.daysDiff(date, regressionStartDate)
            : gx.date.secDiff(date, regressionStartDate);
        const y = yValue - regressionStartY;

        sums.x += x;
        sums.y += y;
        sums.xy += x * y;
        sums.xx += x * x;
        sums.yy += y * y;
      }
    }
  }

  linearRegression.AnyTrend = n > 1;

  linearRegression["Slope"] =
    (n * sums.xy - sums.x * sums.y) / (n * sums.xx - sums.x * sums.x);

  linearRegression["Intercept"] =
    (sums.y - linearRegression.Slope * sums.x) / n;

  linearRegression["R2"] = Math.pow(
    (n * sums.xy - sums.x * sums.y) /
      Math.sqrt(
        (n * sums.xx - sums.x * sums.x) * (n * sums.yy - sums.y * sums.y)
      ),
    2
  );

  return {
    LinearRegression: linearRegression,
    MinValue: minValue,
    MinWhen: minWhen,
    MaxValue: maxValue,
    MaxWhen: maxWhen,
    ChartSeriesData: chartSeriesData
  };
}

// Exclude the QueryViewerTrendPeriod.SinceTheBeginning value
type RegressionTrendPeriod = Exclude<
  QueryViewerTrendPeriod,
  QueryViewerTrendPeriod.SinceTheBeginning
>;

const trendPeriodToStartDate: {
  [key in RegressionTrendPeriod]: (date: Date) => Date;
} = {
  [QueryViewerTrendPeriod.LastYear]: (date: Date) => add(date, { years: -1 }),
  [QueryViewerTrendPeriod.LastSemester]: (date: Date) =>
    add(date, { months: -6 }),
  [QueryViewerTrendPeriod.LastQuarter]: (date: Date) =>
    add(date, { months: -3 }),
  [QueryViewerTrendPeriod.LastMonth]: (date: Date) => add(date, { months: -1 }),
  [QueryViewerTrendPeriod.LastWeek]: (date: Date) => add(date, { weeks: -1 }),
  [QueryViewerTrendPeriod.LastDay]: (date: Date) => add(date, { days: -1 }),
  [QueryViewerTrendPeriod.LastHour]: (date: Date) => add(date, { hours: -1 }),
  [QueryViewerTrendPeriod.LastMinute]: (date: Date) =>
    add(date, { minutes: -1 }),
  [QueryViewerTrendPeriod.LastSecond]: (date: Date) =>
    add(date, { seconds: -1 })
};

function getRegressionStartDateStr(
  trendPeriod: RegressionTrendPeriod,
  xDataType: QueryViewerDataType
) {
  const currentDate = new Date();
  const startDate = trendPeriodToStartDate[trendPeriod](currentDate);

  return dateToString(startDate, xDataType === QueryViewerDataType.DateTime);
}

/**
 * Look for an axis of type date or datetime.
 */
export function analyzeSeries(
  qViewer: {
    includeMaxAndMin: boolean;
    includeSparkline: boolean;
    includeTrend: boolean;
    trendPeriod: QueryViewerTrendPeriod;
  },
  serviceData: QueryViewerServiceData,
  datum: QueryViewerServiceMetaDataData,
  xDataField: string,
  xDataType: QueryViewerDataType
) {
  let regressionStart =
    qViewer.includeTrend &&
    qViewer.trendPeriod === QueryViewerTrendPeriod.SinceTheBeginning
      ? 0
      : serviceData.Rows.length - 1; // Start = End so it doesn't calculate linear regression

  if (
    qViewer.includeTrend &&
    qViewer.trendPeriod !== QueryViewerTrendPeriod.SinceTheBeginning
  ) {
    const trendStartDate = getRegressionStartDateStr(
      qViewer.trendPeriod as RegressionTrendPeriod,
      xDataType
    );

    for (let i = serviceData.Rows.length - 2; i >= 0; i--) {
      const currentDate = serviceData.Rows[i][xDataField];
      if (currentDate < trendStartDate) {
        break;
      }
      regressionStart = i;
    }
  }

  const start =
    qViewer.includeSparkline || qViewer.includeMaxAndMin ? 0 : regressionStart;

  return analyzeMain(
    start,
    regressionStart,
    xDataField,
    datum.DataField,
    serviceData.Rows,
    xDataType
  );
}
