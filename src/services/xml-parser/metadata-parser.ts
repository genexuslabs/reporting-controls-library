import {
  QueryViewerAxisOrderType,
  QueryViewerConditionOperator,
  QueryViewerDataType,
  QueryViewerExpandCollapseType,
  QueryViewerFilterType,
  QueryViewerSubtotals
} from "../../common/basic-types";
import {
  QueryViewerAxisConditionalStyle,
  QueryViewerAxisValueStyle
} from "../types/json";
import {
  QueryViewerServiceDataAxis,
  QueryViewerServiceMetaData,
  QueryViewerServiceMetaDataAxis
} from "../types/service-result";
import {
  getBooleanAttribute,
  getCharacterAttribute,
  getMultipleElementsByTagName,
  getSingleElementByTagName,
  xmlToDocument
} from "./utils/dom";
import { ServicesVersionOK, capitalize, trimUtil } from "./utils/general";

type XMLStyleOperator =
  | "equal"
  | "less"
  | "greater"
  | "lessequal"
  | "greaterequal"
  | "notequal";

type ValuesGroup = {
  GroupFound: boolean;
  TotalValueFound?: boolean;
  Values?: string[];
};

// Subtract required types to implement the mapping
type QueryViewerDataTypeToPicture = Extract<
  | QueryViewerDataType.Integer
  | QueryViewerDataType.Real
  | QueryViewerDataType.Date
  | QueryViewerDataType.DateTime
  | QueryViewerDataType.GUID,
  QueryViewerDataType
>;

const AXIS_TAG_NAME = "OLAPDimension";
const DATUM_TAG_NAME = "OLAPMeasure";

const translateStyleOperatorDictonary: { [key in XMLStyleOperator]: string } = {
  equal: QueryViewerConditionOperator.Equal,
  less: QueryViewerConditionOperator.LessThan,
  greater: QueryViewerConditionOperator.GreaterThan,
  lessequal: QueryViewerConditionOperator.LessOrEqual,
  greaterequal: QueryViewerConditionOperator.GreaterOrEqual,
  notequal: QueryViewerConditionOperator.NotEqual
};

const dataTypeToPictureDictionary: {
  [key in QueryViewerDataTypeToPicture]: string;
} = {
  [QueryViewerDataType.Integer]: "ZZZZZZZZZZZZZZ9",
  [QueryViewerDataType.Real]: "ZZZZZZZZZZZZZZ9.99",
  [QueryViewerDataType.Date]: "99/99/9999",
  [QueryViewerDataType.DateTime]: "99/99/9999 99:99:99",
  [QueryViewerDataType.GUID]: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
};

const translateStyleOperator = (op1: XMLStyleOperator, op2: XMLStyleOperator) =>
  op1 === "greaterequal" && op2 === "lessequal"
    ? QueryViewerConditionOperator.Interval
    : translateStyleOperatorDictonary[op1];

function getValuesGroup(
  parentElement: Document | Element,
  groupTag: string,
  valueTag: string,
  searchTotalValue: boolean
) {
  const groupElement = getSingleElementByTagName(parentElement, groupTag);
  if (!groupElement) {
    return { GroupFound: false };
  }

  const group: ValuesGroup = {
    GroupFound: true,
    TotalValueFound: false,
    Values: []
  };
  const valuesNode = getMultipleElementsByTagName(groupElement, valueTag);

  Array.from(valuesNode).forEach(valueNode => {
    const actualValue = valueNode.firstChild
      ? valueNode.firstChild.nodeValue
      : "";

    if (searchTotalValue && actualValue === "TOTAL") {
      group.TotalValueFound = true;
    } else {
      group.Values.push(actualValue);
    }
  });

  return group;
}

function getValuesStyles(
  parentElement: Document | Element
): QueryViewerAxisValueStyle[] {
  const formatValueParent = getSingleElementByTagName(
    parentElement,
    "formatValues"
  );

  const valuesStylesElements = formatValueParent
    ? Array.from(getMultipleElementsByTagName(formatValueParent, "value"))
    : [];

  return valuesStylesElements.map(valueStyleElement => ({
    Value: trimUtil(
      valueStyleElement.firstChild ? valueStyleElement.firstChild.nodeValue : ""
    ),

    StyleOrClass: removeCSSReplaceMarker(
      valueStyleElement.getAttribute("format")
    ),

    ApplyToRowOrColumn: valueStyleElement.getAttribute("recursive") === "yes"
  }));
}

function removeCSSReplaceMarker(className: string) {
  const replaceMarker = "gxpl_cssReplace(";

  if (className.indexOf(replaceMarker) === 0) {
    const posIni = className.indexOf(replaceMarker);
    const posFin = className.indexOf(")", posIni);
    className = className.substring(posIni + replaceMarker.length, posFin);
  }
  return className;
}

function getConditionalStyles(
  parentElement: Document | Element
): QueryViewerAxisConditionalStyle[] {
  const conditionalFormatParent = getSingleElementByTagName(
    parentElement,
    "conditionalFormats"
  );

  const conditionalStylesElements = conditionalFormatParent
    ? Array.from(getMultipleElementsByTagName(conditionalFormatParent, "rule"))
    : [];

  return conditionalStylesElements.map(conditionalStylesElement => {
    const conditionalStyle: QueryViewerAxisConditionalStyle = {
      Operator: translateStyleOperator(
        conditionalStylesElement.getAttribute("op1") as XMLStyleOperator,
        conditionalStylesElement.getAttribute("op2") as XMLStyleOperator
      ),

      Value1: parseFloat(conditionalStylesElement.getAttribute("value1")),

      StyleOrClass: removeCSSReplaceMarker(
        conditionalStylesElement.getAttribute("format")
      )
    };

    if (conditionalStyle.Operator === QueryViewerConditionOperator.Interval) {
      conditionalStyle["Value2"] = parseFloat(
        conditionalStylesElement.getAttribute("value2")
      );
    }
    return conditionalStyle;
  });
}

function getMetaDataSubtotals(axis: Element, excludeGroup: ValuesGroup) {
  if (axis.getAttribute("summarize") === "no") {
    return QueryViewerSubtotals.No;
  }

  if (excludeGroup.GroupFound && excludeGroup.TotalValueFound) {
    return QueryViewerSubtotals.Hidden;
  }

  return QueryViewerSubtotals.Yes;
}

function getMetaDataFilter(
  includeGroup: ValuesGroup,
  excludeGroup: ValuesGroup
): {
  Type: QueryViewerFilterType;
  Values: string[];
} {
  if (
    !includeGroup.GroupFound &&
    (!excludeGroup.GroupFound ||
      (excludeGroup.Values.length === 0 && excludeGroup.TotalValueFound))
  ) {
    return { Type: QueryViewerFilterType.ShowAllValues, Values: [] };
  }

  if (
    includeGroup.GroupFound &&
    !excludeGroup.GroupFound &&
    includeGroup.Values.length === 0
  ) {
    return { Type: QueryViewerFilterType.HideAllValues, Values: [] };
  }

  return {
    Type: QueryViewerFilterType.ShowSomeValues,
    Values: includeGroup.Values
  };
}

function getMetaDataExpandCollapse(expandGroup: ValuesGroup): {
  Type: QueryViewerExpandCollapseType;
  Values: string[];
} {
  if (!expandGroup.GroupFound) {
    return {
      Type: QueryViewerExpandCollapseType.ExpandAllValues,
      Values: []
    };
  }

  if (expandGroup.Values.length === 0) {
    return {
      Type: QueryViewerExpandCollapseType.CollapseAllValues,
      Values: []
    };
  }

  return {
    Type: QueryViewerExpandCollapseType.ExpandSomeValues,
    Values: expandGroup.Values
  };
}

function getMetaDataOrder(
  axis: Element,
  customOrderGroup: ValuesGroup
): {
  Type: QueryViewerAxisOrderType;
  Values: string[];
} {
  const order = axis.getAttribute("order");

  if (!order) {
    return { Type: QueryViewerAxisOrderType.None, Values: [] };
  }

  const orderType = capitalize(order) as QueryViewerAxisOrderType;

  return {
    Type: orderType,
    Values:
      orderType === QueryViewerAxisOrderType.Custom
        ? customOrderGroup.Values
        : []
  };
}

export function parseMetadataXML(
  metaData: string
): QueryViewerServiceMetaData | undefined {
  if (!metaData) {
    return undefined;
  }

  const xmlDoc = xmlToDocument(metaData);
  const rootElement = getSingleElementByTagName(xmlDoc, "OLAPCube");
  const servicesVersion = rootElement.getAttribute("Version");

  if (!ServicesVersionOK(servicesVersion)) {
    // qViewer.Metadata.ParserResult = ParserResult(
    //   false,
    //   gx
    //     .getMessage("GXPL_QViewerWrongMetadataVersion")
    //     .replace("{0}", METADATA_VERSION)
    // );
    return undefined;
  }

  const axes = Array.from(
    getMultipleElementsByTagName(rootElement, AXIS_TAG_NAME)
  );

  // Axes
  const serviceMetaDataAxes: QueryViewerServiceMetaDataAxis[] = axes.map(
    axis => {
      const includeGroup = getValuesGroup(axis, "include", "value", true);
      const excludeGroup = getValuesGroup(axis, "exclude", "value", true);
      const expandGroup = getValuesGroup(axis, "expand", "value", false);
      const customOrderGroup = getValuesGroup(
        axis,
        "customOrder",
        "Value",
        false
      );

      const dataType = axis.getAttribute("dataType");

      return {
        Name: axis.getAttribute("name"),
        Title: axis.getAttribute("displayName"),
        DataField: axis.getAttribute("dataField"),
        DataType: dataType,
        Visible: axis.getAttribute("visible"),
        Axis: axis.getAttribute("axis"),
        Picture:
          axis.getAttribute("picture") ||
          dataTypeToPictureDictionary[dataType as QueryViewerDataTypeToPicture],

        CanDragToPages: getBooleanAttribute(axis, "canDragToPages", true),
        RaiseItemClick: getBooleanAttribute(axis, "raiseItemClick", true),
        IsComponent: getBooleanAttribute(axis, "isComponent", false),

        Style: axis.getAttribute("format"),

        Subtotals: getMetaDataSubtotals(axis, excludeGroup),

        Filter: getMetaDataFilter(includeGroup, excludeGroup),

        ExpandCollapse: getMetaDataExpandCollapse(expandGroup),

        Order: getMetaDataOrder(axis, customOrderGroup),

        ValuesStyles: getValuesStyles(axis)
      };
    }
  );

  // Datum
  const datas = Array.from(
    getMultipleElementsByTagName(rootElement, DATUM_TAG_NAME)
  );

  const serviceMetaDataDatums: QueryViewerServiceDataAxis[] = datas.map(
    data => {
      const dataType = data.getAttribute("dataType");
      const targetValue = parseFloat(data.getAttribute("targetValue"));
      const maximumValue = parseFloat(data.getAttribute("maximumValue"));
      const formula = getCharacterAttribute(data, "formula", "");

      return {
        Name: data.getAttribute("name"),
        Title: data.getAttribute("displayName"),
        DataField: data.getAttribute("dataField"),
        Aggregation: capitalize(data.getAttribute("aggregation")),
        DataType: dataType,
        Visible: data.getAttribute("visible"),
        Picture:
          data.getAttribute("picture") ||
          dataType === QueryViewerDataType.Integer
            ? "ZZZZZZZZZZZZZZ9"
            : "ZZZZZZZZZZZZZZ9.99",

        RaiseItemClick: getBooleanAttribute(data, "raiseItemClick", true),
        IsComponent: getBooleanAttribute(data, "isComponent", false),

        TargetValue: targetValue <= 0 ? 100 : targetValue,
        MaximumValue: maximumValue <= 0 ? 100 : maximumValue,

        Style: data.getAttribute("format"),

        ConditionalStyles: getConditionalStyles(data),

        IsFormula: !!formula,
        Formula: formula
      };
    }
  );

  return {
    // Get general properties
    TextForNullValues: rootElement.getAttribute("textForNullValues"),
    Axes: serviceMetaDataAxes,
    Data: serviceMetaDataDatums
  };
}
