import { aggregatePoints } from "./processDataAndMetadata";

import {
  QueryViewerAggregationType,
  QueryViewerChartSerie,
  QueryViewerVisible,
  QueryViewerDataType
} from "@genexus/reporting-api";

describe("aggregatePoints", () => {
  it("should aggregate points using the Count aggregation type", () => {
    const chartSerie: QueryViewerChartSerie = {
      Points: [
        { Value: "1", Value_N: "", Value_D: "" },
        { Value: "2", Value_N: "", Value_D: "" },
        { Value: "3", Value_N: "", Value_D: "" }
      ],
      Aggregation: QueryViewerAggregationType.Count,
      NegativeValues: false,
      PositiveValues: false,
      MinValue: 0,
      MaxValue: 0,
      FieldName: "",
      Name: "",
      Visible: QueryViewerVisible.Always,
      DataType: QueryViewerDataType.Integer,
      Picture: "",
      DataFields: [],
      Color: "",
      TargetValue: 0,
      MaximumValue: 0,
      NumberFormat: {
        DecimalPrecision: 0,
        UseThousandsSeparator: false,
        Prefix: "",
        Suffix: ""
      }
    };

    aggregatePoints(chartSerie);

    expect(chartSerie.Points).toEqual([
      { Value: "6", Value_N: "6", Value_D: "1" }
    ]);
  });

  it("should aggregate points using the Average aggregation type", () => {
    const chartSerie: QueryViewerChartSerie = {
      Points: [
        { Value: "1", Value_N: "1", Value_D: "1" },
        { Value: "2", Value_N: "2", Value_D: "1" },
        { Value: "3", Value_N: "3", Value_D: "1" }
      ],
      Aggregation: QueryViewerAggregationType.Average,
      NegativeValues: false,
      PositiveValues: false,
      MinValue: 0,
      MaxValue: 0,
      FieldName: "",
      Name: "",
      Visible: QueryViewerVisible.Always,
      DataType: QueryViewerDataType.Integer,
      Picture: "",
      DataFields: [],
      Color: "",
      TargetValue: 0,
      MaximumValue: 0,
      NumberFormat: {
        DecimalPrecision: 0,
        UseThousandsSeparator: false,
        Prefix: "",
        Suffix: ""
      }
    };

    aggregatePoints(chartSerie);

    expect(chartSerie.Points).toEqual([
      { Value: "2", Value_N: "2", Value_D: "1" }
    ]);
  });

  it("should aggregate points using the Sum aggregation type", () => {
    const chartSerie: QueryViewerChartSerie = {
      Points: [
        { Value: "1", Value_N: "", Value_D: "" },
        { Value: "2", Value_N: "", Value_D: "" },
        { Value: "3", Value_N: "", Value_D: "" }
      ],
      Aggregation: QueryViewerAggregationType.Sum,
      NegativeValues: false,
      PositiveValues: false,
      MinValue: 0,
      MaxValue: 0,
      FieldName: "",
      Name: "",
      Visible: QueryViewerVisible.Always,
      DataType: QueryViewerDataType.Integer,
      Picture: "",
      DataFields: [],
      Color: "",
      TargetValue: 0,
      MaximumValue: 0,
      NumberFormat: {
        DecimalPrecision: 0,
        UseThousandsSeparator: false,
        Prefix: "",
        Suffix: ""
      }
    };

    aggregatePoints(chartSerie);

    expect(chartSerie.Points).toEqual([
      { Value: "6", Value_N: "6", Value_D: "1" }
    ]);
  });
});
