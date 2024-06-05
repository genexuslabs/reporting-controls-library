/* eslint-disable camelcase */
import { groupPoints } from "./highcharts-options";
import { ChartMetadataAndData } from "./processDataAndMetadata";

import {
  QueryViewerVisible,
  QueryViewerDataType,
  QueryViewerAggregationType
} from "@genexus/reporting-api";
describe("groupPoints", () => {
  const chartMetadataAndData: ChartMetadataAndData = {
    Categories: {
      DataFields: ["F1"],
      MinValue: "Recife",
      MaxValue: "Rio de Janeiro",
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
          MinValue: 2102998,
          MaxValue: 11748123456789,
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
            { Value: "11748123456789", Value_N: "", Value_D: "" },
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

  it("should create point object correctly adding description property", () => {
    const aggregation = QueryViewerAggregationType.Sum;
    const groupOption = "Days";

    const result = groupPoints(
      chartMetadataAndData,
      chartMetadataAndData.Series.ByIndex[0],
      QueryViewerDataType.Date,
      aggregation,
      groupOption
    );

    expect(result).toEqual([
      {
        x: "Rio de Janeiro",
        y: 11748123456789,
        name: "",
        description: "11748123456789"
      },
      { x: "Lima", y: 3297000, name: "", description: "3297000" },
      { x: "Belo Horizonte", y: 2985000, name: "", description: "2985000" },
      { x: "Porto Alegre", y: 2514000, name: "", description: "2514000" },
      { x: "Brasilia", y: 2254000, name: "", description: "2254000" },
      { x: "Recife", y: 2102998, name: "", description: "2102998" }
    ]);
  });

  it("description value must a precise string representation of 'y' value", () => {
    const aggregation = QueryViewerAggregationType.Sum;
    const groupOption = "Days";

    chartMetadataAndData.Series.ByIndex[0].MaxValue = 202400000000123800;

    chartMetadataAndData.Series.ByIndex[0].Points[0].Value =
      "202400000000123797";

    const result = groupPoints(
      chartMetadataAndData,
      chartMetadataAndData.Series.ByIndex[0],
      QueryViewerDataType.Date,
      aggregation,
      groupOption
    );

    expect(result).toEqual([
      {
        x: "Rio de Janeiro",
        y: 202400000000123800,
        name: "",
        description: "202400000000123797"
      },
      { x: "Lima", y: 3297000, name: "", description: "3297000" },
      { x: "Belo Horizonte", y: 2985000, name: "", description: "2985000" },
      { x: "Porto Alegre", y: 2514000, name: "", description: "2514000" },
      { x: "Brasilia", y: 2254000, name: "", description: "2254000" },
      { x: "Recife", y: 2102998, name: "", description: "2102998" }
    ]);
  });
  // TODO: Currently not supported Average aggregation, errors are thrown before gxBigNumber support implementation
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
    console.log(result);
  });

  it("should group points by count when aggregation is 'Count'", () => {
    const aggregation = QueryViewerAggregationType.Count;
    const groupOption = "Days";
    chartMetadataAndData.Series.ByIndex[0].Points = [
      { Value: "1", Value_N: "", Value_D: "" },
      { Value: "1", Value_N: "", Value_D: "" },
      { Value: "1", Value_N: "", Value_D: "" },
      { Value: "1", Value_N: "", Value_D: "" },
      { Value: "1", Value_N: "", Value_D: "" },
      { Value: "1", Value_N: "", Value_D: "" }
    ];

    const result = groupPoints(
      chartMetadataAndData,
      chartMetadataAndData.Series.ByIndex[0],
      QueryViewerDataType.Date,
      aggregation,
      groupOption
    );

    expect(result).toEqual([
      { x: "Rio de Janeiro", y: 1, name: "", description: "1" },
      { x: "Lima", y: 1, name: "", description: "1" },
      { x: "Belo Horizonte", y: 1, name: "", description: "1" },
      { x: "Porto Alegre", y: 1, name: "", description: "1" },
      { x: "Brasilia", y: 1, name: "", description: "1" },
      { x: "Recife", y: 1, name: "", description: "1" }
    ]);
  });
});
