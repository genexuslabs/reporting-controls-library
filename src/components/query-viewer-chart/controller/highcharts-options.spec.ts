/* eslint-disable camelcase */
import { groupPoints } from "./highcharts-options";
import { ChartMetadataAndData } from "./processDataAndMetadata";

import {
  QueryViewerVisible,
  QueryViewerDataType,
  QueryViewerAggregationType
} from "@genexus/reporting-api";
describe("groupPoints", () => {
  // TODO: Fix the test
  const chartMetadataAndData: ChartMetadataAndData = {
    Categories: {
      DataFields: ["F1"],
      MinValue: "Recife",
      MaxValue: "Brasilia",
      Values: [
        { Value: "Rio de Janeiro", ValueWithPicture: "" },
        { Value: "Lima", ValueWithPicture: "" },
        { Value: "Belo Horizonte", ValueWithPicture: "" },
        { Value: "Porto Alegre", ValueWithPicture: "" },
        { Value: "Brasilia", ValueWithPicture: "" },
        { Value: "Recife", ValueWithPicture: "" }
      ]
    },
    Series: {
      ByIndex: [
        {
          MinValue: 3305,
          MaxValue: 11748000,
          FieldName: "Element5",
          Name: "Population",
          Visible: QueryViewerVisible.Yes,
          DataType: QueryViewerDataType.Integer,
          Aggregation: QueryViewerAggregationType.Count,
          DataFields: null,
          Color: "",
          Picture: "ZZZZZZZZZZZZZZ9",
          TargetValue: 100,
          MaximumValue: 100,
          PositiveValues: true,
          NegativeValues: false,
          NumberFormat: {
            DecimalPrecision: 0,
            UseThousandsSeparator: false,
            Prefix: "",
            Suffix: ""
          },
          Points: [
            { Value: "11748000", Value_N: "", Value_D: "" },
            { Value: "3297000", Value_N: "", Value_D: "" },
            { Value: "2985000", Value_N: "", Value_D: "" },
            { Value: "2514000", Value_N: "", Value_D: "" },
            { Value: "2254000", Value_N: "", Value_D: "" },
            { Value: "2102998", Value_N: "", Value_D: "" }
          ]
        }
      ],
      DataFields: ["F2"]
    },
    PlotBands: []
  };

  it("should group points by start point when groupOption is 'start'", () => {
    const aggregation = QueryViewerAggregationType.Sum;
    const groupOption = "start";

    const result = groupPoints(
      chartMetadataAndData,
      chartMetadataAndData.Series.ByIndex[0],
      QueryViewerDataType.Date,
      aggregation,
      groupOption
    );

    expect(result).toEqual([
      { x: "2022-01-01", y: 100, name: "January 2022" },
      { x: "2022-02-01", y: 60, name: "February 2022" },
      { x: "2022-03-01", y: 40, name: "March 2022" },
      { x: "2022-04-01", y: 40, name: "April 2022" }
    ]);
  });

  it.skip("should group points by end point when groupOption is 'end'", () => {
    const aggregation = QueryViewerAggregationType.Sum;
    const groupOption = "end";

    const result = groupPoints(
      chartMetadataAndData,
      chartMetadataAndData.Series.ByIndex[0],
      QueryViewerDataType.Date,
      aggregation,
      groupOption
    );

    expect(result).toEqual([
      { x: "2022-01-01", y: 10, name: "January 2022" },
      { x: "2022-02-01", y: 30, name: "February 2022" },
      { x: "2022-03-01", y: 60, name: "March 2022" },
      { x: "2022-04-01", y: 100, name: "April 2022" }
    ]);
  });

  it.skip("should group points by average when aggregation is 'Average'", () => {
    const aggregation = QueryViewerAggregationType.Average;
    const groupOption = "start";

    const result = groupPoints(
      chartMetadataAndData,
      chartMetadataAndData.Series.ByIndex[0],
      QueryViewerDataType.Date,
      aggregation,
      groupOption
    );

    expect(result).toEqual([
      { x: "2022-01-01", y: 5, name: "January 2022" },
      { x: "2022-02-01", y: 10, name: "February 2022" },
      { x: "2022-03-01", y: 15, name: "March 2022" },
      { x: "2022-04-01", y: 20, name: "April 2022" }
    ]);
  });
});
