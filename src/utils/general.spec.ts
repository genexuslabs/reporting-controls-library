import { aggregateMap, aggregateDatum, calculate } from "./general";
import { GxBigNumber } from "@genexus/web-standard-functions/dist/lib/types/gxbignumber";
import {
  QueryViewerAggregationType,
  QueryViewerVisible,
  QueryViewerDataType
} from "@genexus/reporting-api";
describe("operations with aggregate", () => {
  it("aggregate when aggregationType is Sum works", () => {
    const result = aggregateMap["Sum"](
      [new GxBigNumber(1), new GxBigNumber(1), new GxBigNumber(1)],
      [new GxBigNumber(1)]
    );

    expect(result.toString()).toBe("3");
  });
  it("aggregate when aggregationType is Average works", () => {
    const result = aggregateMap["Average"](
      [
        new GxBigNumber(5),
        new GxBigNumber(4),
        new GxBigNumber(3),
        new GxBigNumber(2),
        new GxBigNumber(1)
      ],

      [
        new GxBigNumber(1),
        new GxBigNumber(1),
        new GxBigNumber(1),
        new GxBigNumber(1),
        new GxBigNumber(1)
      ]
    );

    expect(result.toString()).toBe("3");
  });
  it("aggregate when aggregationType is Count works", () => {
    const result = aggregateMap["Count"](
      [],

      [new GxBigNumber(2), new GxBigNumber(2), new GxBigNumber(1)]
    );

    expect(result.toString()).toBe("5");
  });

  it("aggregate when aggregationType is Max works", () => {
    const result = aggregateMap["Max"](
      [new GxBigNumber(1), new GxBigNumber(2), new GxBigNumber(3)],
      []
    );

    expect(result.toString()).toBe("3");
  });

  it("aggregate when aggregationType is Min works", () => {
    const result = aggregateMap["Min"](
      [new GxBigNumber(1), new GxBigNumber(2), new GxBigNumber(3)],
      []
    );
    expect(result.toString()).toBe("1");
  });
});
describe("aggregateDatum works when isFormula", () => {
  it("aggregateDatum works when is Sum", () => {
    const datum = {
      aggregation: QueryViewerAggregationType.Sum,
      conditionalStyles: [],
      dataField: "F2",
      dataType: QueryViewerDataType.Real,
      formula: "F2_1/F2_2*F2_3",
      isComponent: false,
      isFormula: true,
      maximumValue: 100,
      name: "Element2",
      picture: "ZZZZZZZZZZZZZZ9",
      raiseItemClick: true,
      style: "",
      targetValue: 100,
      title: "Sum(Measure) / Sum(Measure) * Sum(Measure)",
      visible: QueryViewerVisible.Yes
    };

    const rows = [
      {
        F1: "Value 202,400,000,000,123,797",
        F2: "202400000000123797",
        F2_1: "202400000000123797",
        F2_2: "202400000000123797",
        F2_3: "202400000000123797"
      },
      {
        F1: "Value 202,400,000,000,459,368",
        F2: "202400000000459368",
        F2_1: "202400000000459368",
        F2_2: "202400000000459368",
        F2_3: "202400000000459368"
      },
      {
        F1: "Value 202,400,000,000,778,122",
        F2: "202400000000778312",
        F2_1: "202400000000778312",
        F2_2: "202400000000778312",
        F2_3: "202400000000778312"
      },
      {
        F1: "Value 202,400,000,000,778,312",
        F2: "202400000000778399",
        F2_1: "202400000000778399",
        F2_2: "202400000000778399",
        F2_3: "202400000000778399"
      },
      {
        F1: "Value 202,400,000,000,778,353",
        F2: "202400000000778484",
        F2_1: "202400000000778484",
        F2_2: "202400000000778484",
        F2_3: "202400000000778484"
      },
      {
        F1: "Value 202,400,000,000,778,395",
        F2: "202400000000778399",
        F2_1: "202400000000778399",
        F2_2: "202400000000778399",
        F2_3: "202400000000778399"
      },
      {
        F1: "Value 202,400,000,000,778,452",
        F2: "202400000000778332",
        F2_1: "202400000000778332",
        F2_2: "202400000000778332",
        F2_3: "202400000000778332"
      }
    ];
    const result = aggregateDatum(datum, rows);

    expect(result.toString()).toBe("1416800000004475091");
  });
  it("aggregateDatum works when is Count", () => {
    const datum = {
      aggregation: QueryViewerAggregationType.Count,
      conditionalStyles: [],
      dataField: "F2",
      dataType: QueryViewerDataType.Real,
      formula: "F2_1/F2_2*F2_3",
      isComponent: false,
      isFormula: true,
      maximumValue: 100,
      name: "Element2",
      picture: "ZZZZZZZZZZZZZZ9",
      raiseItemClick: true,
      style: "",
      targetValue: 100,
      title: "Count(Measure) / Count(Measure) * Count(Measure)",
      visible: QueryViewerVisible.Yes
    };

    const rows = [
      {
        F1: "Value 202,400,000,000,123,797",
        F2: "1",
        F2_1: "1",
        F2_2: "1",
        F2_3: "1"
      },
      {
        F1: "Value 202,400,000,000,459,368",
        F2: "1",
        F2_1: "1",
        F2_2: "1",
        F2_3: "1"
      },
      {
        F1: "Value 202,400,000,000,778,122",
        F2: "1",
        F2_1: "1",
        F2_2: "1",
        F2_3: "1"
      },
      {
        F1: "Value 202,400,000,000,778,312",
        F2: "1",
        F2_1: "1",
        F2_2: "1",
        F2_3: "1"
      },
      {
        F1: "Value 202,400,000,000,778,353",
        F2: "1",
        F2_1: "1",
        F2_2: "1",
        F2_3: "1"
      },
      {
        F1: "Value 202,400,000,000,778,395",
        F2: "1",
        F2_1: "1",
        F2_2: "1",
        F2_3: "1"
      },
      {
        F1: "Value 202,400,000,000,778,452",
        F2: "1",
        F2_1: "1",
        F2_2: "1",
        F2_3: "1"
      }
    ];
    const result = aggregateDatum(datum, rows);

    expect(result.toString()).toBe("7");
  });
  it("calculate function works with different operations", () => {
    const result1 = calculate("10*10/10");
    const result2 = calculate("10+10-10");
    const result3 = calculate("10+10*10");
    const result4 = calculate("10+10/10");
    const result5 = calculate("10-10*10");
    const result6 = calculate("-10-10/10+10*10-10+10/10*10");

    expect(result1.toString()).toBe("10");
    expect(result2.toString()).toBe("10");
    expect(result3.toString()).toBe("110");
    expect(result4.toString()).toBe("11");
    expect(result5.toString()).toBe("-90");
    expect(result6.toString()).toBe("89");
  });
});

describe("aggregateDatum works and all its operations when not isFormula", () => {
  it("aggregateDatum works with aggregationType Count", () => {
    const datum = {
      aggregation: QueryViewerAggregationType.Count,
      conditionalStyles: [],
      dataField: "F2",
      dataType: QueryViewerDataType.Integer,
      formula: "",
      isComponent: false,
      isFormula: false,
      maximumValue: 100,
      name: "Element2",
      picture: "ZZZZZZZZZZZZZZ9",
      raiseItemClick: true,
      style: "",
      targetValue: 100,
      title: "Quantity of Measure",
      visible: QueryViewerVisible.Yes
    };
    const rows = [
      { F1: "Value 202,400,000,000,123,797", F2: "1" },
      { F1: "Value 202,400,000,000,459,368", F2: "1" },
      { F1: "Value 202,400,000,000,778,122", F2: "1" },
      { F1: "Value 202,400,000,000,778,312", F2: "1" },
      { F1: "Value 202,400,000,000,778,353", F2: "1" },
      { F1: "Value 202,400,000,000,778,395", F2: "1" },
      { F1: "Value 202,400,000,000,778,452", F2: "1" }
    ];
    const result = aggregateDatum(datum, rows);
    expect(result.toString()).toBe("7");
  });
  it("aggregateDatum works with aggregationType Sum", () => {
    const datum = {
      aggregation: QueryViewerAggregationType.Sum,
      conditionalStyles: [],
      dataField: "F2",
      dataType: QueryViewerDataType.Integer,
      formula: "",
      isComponent: false,
      isFormula: false,
      maximumValue: 100,
      name: "Element2",
      picture: "ZZZZZZZZZZZZZZ9",
      raiseItemClick: true,
      style: "",
      targetValue: 100,
      title: "Sum of Measures",
      visible: QueryViewerVisible.Yes
    };
    const rows = [
      { F1: "Measure1", F2: "10" },
      { F1: "Measure2", F2: "10" },
      { F1: "Measure3", F2: "10" },
      { F1: "Measure4", F2: "10" },
      { F1: "Measure5", F2: "10" },
      { F1: "Measure6", F2: "10" },
      { F1: "Measure7", F2: "10" }
    ];
    const result = aggregateDatum(datum, rows);
    expect(result.toString()).toBe("70");
  });

  it("aggregateDatum works with aggregationType Min", () => {
    const datum = {
      aggregation: QueryViewerAggregationType.Min,
      conditionalStyles: [],
      dataField: "F2",
      dataType: QueryViewerDataType.Integer,
      formula: "",
      isComponent: false,
      isFormula: false,
      maximumValue: 100,
      name: "Element2",
      picture: "ZZZZZZZZZZZZZZ9",
      raiseItemClick: true,
      style: "",
      targetValue: 100,
      title: "Sum of Measures",
      visible: QueryViewerVisible.Yes
    };
    const rows = [
      { F1: "Measure1", F2: "1" },
      { F1: "Measure2", F2: "2" },
      { F1: "Measure3", F2: "3" },
      { F1: "Measure4", F2: "4" },
      { F1: "Measure5", F2: "5" },
      { F1: "Measure6", F2: "6" },
      { F1: "Measure7", F2: "7" }
    ];
    const result = aggregateDatum(datum, rows);
    expect(result.toString()).toBe("1");
  });
  it("aggregateDatum works with aggregationType Max", () => {
    const datum = {
      aggregation: QueryViewerAggregationType.Max,
      conditionalStyles: [],
      dataField: "F2",
      dataType: QueryViewerDataType.Integer,
      formula: "",
      isComponent: false,
      isFormula: false,
      maximumValue: 100,
      name: "Element2",
      picture: "ZZZZZZZZZZZZZZ9",
      raiseItemClick: true,
      style: "",
      targetValue: 100,
      title: "Sum of Measures",
      visible: QueryViewerVisible.Yes
    };
    const rows = [
      { F1: "Measure1", F2: "1" },
      { F1: "Measure2", F2: "2" },
      { F1: "Measure3", F2: "3" },
      { F1: "Measure4", F2: "4" },
      { F1: "Measure5", F2: "5" },
      { F1: "Measure6", F2: "6" },
      { F1: "Measure7", F2: "7" }
    ];
    const result = aggregateDatum(datum, rows);
    expect(result.toString()).toBe("7");
  });

  it("aggregateDatum works with aggregationType Average", () => {
    const datum = {
      aggregation: QueryViewerAggregationType.Average,
      conditionalStyles: [],
      dataField: "F2",
      dataType: QueryViewerDataType.Integer,
      formula: "",
      isComponent: false,
      isFormula: false,
      maximumValue: 100,
      name: "Element2",
      picture: "ZZZZZZZZZZZZZZ9",
      raiseItemClick: true,
      style: "",
      targetValue: 100,
      title: "Average of Measures",
      visible: QueryViewerVisible.Yes
    };
    const rows = [
      { F1: "Measure1", F2: "1", F2_N: "1", F2_D: "1" },
      { F1: "Measure2", F2: "2", F2_N: "2", F2_D: "1" },
      { F1: "Measure3", F2: "3", F2_N: "3", F2_D: "1" },
      { F1: "Measure4", F2: "4", F2_N: "4", F2_D: "1" },
      { F1: "Measure5", F2: "5", F2_N: "5", F2_D: "1" },
      { F1: "Measure6", F2: "6", F2_N: "6", F2_D: "1" },
      { F1: "Measure7", F2: "7", F2_N: "7", F2_D: "1" }
    ];
    const result = aggregateDatum(datum, rows);
    expect(result.toString()).toBe("4");
  });
});
