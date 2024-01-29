import { QueryViewerAggregationType, QueryViewerDataType, QueryViewerVisible } from "@common/basic-types";
import { QueryViewerServiceMetaData } from "../../types/service-result";

import { parseMetadataXML } from "../../xml-parser/metadata-parser";

describe('parseMetadataXML', () => {
  test('should be defined', () => {
    expect(parseMetadataXML).toBeDefined();
  })

  test('should return a undefined when a empty string was given', () => {
    expect(parseMetadataXML("")).toEqual(undefined);
  })

  test('should return a metadata object when a xml was given', () => {
    const data = "<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<OLAPCube Version=\"2\" format=\"compact\" decimalSeparator=\".\" thousandsSeparator=\",\" dateFormat=\"MDY\" textForNullValues=\"\" forceDefaultView=\"yes\" ShowDataLabelsIn=\"\">\n\t<OLAPMeasure name=\"Element1\" displayName=\"Average of Country Life Expectancy\" description=\"Average of Country Life Expectancy\" dataField=\"F1\" visible=\"Yes\" aggregation=\"average\" align=\"right\" picture=\"ZZZZZZZZZZZZZZ9.99 years\" targetValue=\"0\" maximumValue=\"0\" dataType=\"real\" format=\"\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"F1_N\" displayName=\"F1_N\" description=\"F1_N\" dataField=\"F1_N\" visible=\"Never\" aggregation=\"sum\" align=\"right\" picture=\"\" targetValue=\"0\" maximumValue=\"0\" dataType=\"real\" format=\"\" raiseItemClick=\"false\" isComponent=\"true\">\n\t</OLAPMeasure>\n\t<OLAPMeasure name=\"F1_D\" displayName=\"F1_D\" description=\"F1_D\" dataField=\"F1_D\" visible=\"Never\" aggregation=\"count\" align=\"right\" picture=\"\" targetValue=\"0\" maximumValue=\"0\" dataType=\"integer\" format=\"\" raiseItemClick=\"false\" isComponent=\"true\">\n\t</OLAPMeasure>\n</OLAPCube>\n";
    const result: QueryViewerServiceMetaData = {
      axes: [],
      data: [
        {
          aggregation: QueryViewerAggregationType['Average'],
          conditionalStyles: [],
          dataField: "F1",
          dataType: QueryViewerDataType.Real,
          formula: "",
          isComponent: false,
          isFormula: false,
          maximumValue: 100,
          name: "Element1",
          picture: "ZZZZZZZZZZZZZZ9",
          raiseItemClick: true,
          style: "",
          targetValue: 100,
          title: "Average of Country Life Expectancy",
          visible: QueryViewerVisible.Yes,
        },
        {
          aggregation: QueryViewerAggregationType['Sum'],
          conditionalStyles: [],
          dataField: "F1_N",
          dataType: QueryViewerDataType.Real,
          formula: "",
          isComponent: true,
          isFormula: false,
          maximumValue: 100,
          name: "F1_N",
          picture: "ZZZZZZZZZZZZZZ9.99",
          raiseItemClick: false,
          style: "",
          targetValue: 100,
          title: "F1_N",
          visible: QueryViewerVisible.Never,
        },
        {
          aggregation: QueryViewerAggregationType['Count'],
          conditionalStyles: [],
          dataField: "F1_D",
          dataType: QueryViewerDataType.Integer,
          formula: "",
          isComponent: true,
          isFormula: false,
          maximumValue: 100,
          name: "F1_D",
          picture: "ZZZZZZZZZZZZZZ9",
          raiseItemClick: false,
          style: "",
          targetValue: 100,
          title: "F1_D",
          visible: QueryViewerVisible.Never,
        },
      ],
      textForNullValues: "",
    };

    expect(parseMetadataXML(data)).toEqual(result);
  })

  test('should return a metadata object when an empty xml was given', () => {
    const data = "<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<OLAPCube Version=\"2\" format=\"compact\" >\n</OLAPCube>\n";
    const result: QueryViewerServiceMetaData = {
      axes: [],
      data: [],
      textForNullValues: null,
    };

    expect(parseMetadataXML(data)).toEqual(result);
  })
})
