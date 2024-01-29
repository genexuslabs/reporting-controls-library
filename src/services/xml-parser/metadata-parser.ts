import {
  QueryViewerAggregationType,
  QueryViewerAxisOrderType,
  QueryViewerConditionOperator,
  QueryViewerDataType,
  QueryViewerExpandCollapseType,
  QueryViewerFilterType,
  QueryViewerSubtotals,
  QueryViewerVisible
} from "@common/basic-types";
import {
  QueryViewerAxisConditionalStyle,
  QueryViewerAxisValueStyle
} from "../types/json";
import {
  QueryViewerServiceMetaData,
  QueryViewerServiceMetaDataAxis,
  QueryViewerServiceMetaDataData
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

const translateStyleOperatorDictonary: {
  [key in XMLStyleOperator]: QueryViewerConditionOperator;
} = {
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
  type: QueryViewerFilterType;
  values: string[];
} {
  if (
    !includeGroup.GroupFound &&
    (!excludeGroup.GroupFound ||
      (excludeGroup.Values.length === 0 && excludeGroup.TotalValueFound))
  ) {
    return { type: QueryViewerFilterType.ShowAllValues, values: [] };
  }

  if (
    includeGroup.GroupFound &&
    !excludeGroup.GroupFound &&
    includeGroup.Values.length === 0
  ) {
    return { type: QueryViewerFilterType.HideAllValues, values: [] };
  }

  return {
    type: QueryViewerFilterType.ShowSomeValues,
    values: includeGroup.Values
  };
}

function getMetaDataExpandCollapse(expandGroup: ValuesGroup): {
  type: QueryViewerExpandCollapseType;
  values: string[];
} {
  if (!expandGroup.GroupFound) {
    return {
      type: QueryViewerExpandCollapseType.ExpandAllValues,
      values: []
    };
  }

  if (expandGroup.Values.length === 0) {
    return {
      type: QueryViewerExpandCollapseType.CollapseAllValues,
      values: []
    };
  }

  return {
    type: QueryViewerExpandCollapseType.ExpandSomeValues,
    values: expandGroup.Values
  };
}

function getMetaDataOrder(
  axis: Element,
  customOrderGroup: ValuesGroup
): {
  type: QueryViewerAxisOrderType;
  values: string[];
} {
  const order = axis.getAttribute("order");

  if (!order) {
    return { type: QueryViewerAxisOrderType.None, values: [] };
  }

  const orderType = capitalize(order) as QueryViewerAxisOrderType;

  return {
    type: orderType,
    values:
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

      const dataType = axis.getAttribute("dataType") as QueryViewerDataType;

      return {
        name: axis.getAttribute("name"),
        title: axis.getAttribute("displayName"),
        dataField: axis.getAttribute("dataField"),
        dataType,
        visible: axis.getAttribute("visible"),
        axis: axis.getAttribute("axis"),
        picture:
          axis.getAttribute("picture") ||
          dataTypeToPictureDictionary[dataType as QueryViewerDataTypeToPicture],

        canDragToPages: getBooleanAttribute(axis, "canDragToPages", true),
        raiseItemClick: getBooleanAttribute(axis, "raiseItemClick", true),
        isComponent: getBooleanAttribute(axis, "isComponent", false),

        style: axis.getAttribute("format"),

        subtotals: getMetaDataSubtotals(axis, excludeGroup),

        filter: getMetaDataFilter(includeGroup, excludeGroup),

        expandCollapse: getMetaDataExpandCollapse(expandGroup),

        order: getMetaDataOrder(axis, customOrderGroup),

        valuesStyles: getValuesStyles(axis)
      };
    }
  );

  // Datum
  const datas = Array.from(
    getMultipleElementsByTagName(rootElement, DATUM_TAG_NAME)
  );

  const serviceMetaDataDatums: QueryViewerServiceMetaDataData[] = datas.map(
    data => {
      const dataType = data.getAttribute("dataType") as QueryViewerDataType;
      const targetValue = parseFloat(data.getAttribute("targetValue"));
      const maximumValue = parseFloat(data.getAttribute("maximumValue"));
      const formula = getCharacterAttribute(data, "formula", "");

      return {
        name: data.getAttribute("name"),
        title: data.getAttribute("displayName"),
        dataField: data.getAttribute("dataField"),
        aggregation: capitalize(
          data.getAttribute("aggregation")
        ) as QueryViewerAggregationType,
        dataType: dataType,
        visible: data.getAttribute("visible") as QueryViewerVisible,
        picture:
          data.getAttribute("picture") ||
          dataType === QueryViewerDataType.Integer
            ? "ZZZZZZZZZZZZZZ9"
            : "ZZZZZZZZZZZZZZ9.99",

        raiseItemClick: getBooleanAttribute(data, "raiseItemClick", true),
        isComponent: getBooleanAttribute(data, "isComponent", false),

        targetValue: targetValue <= 0 ? 100 : targetValue,
        maximumValue: maximumValue <= 0 ? 100 : maximumValue,

        style: data.getAttribute("format"),

        conditionalStyles: getConditionalStyles(data),

        isFormula: !!formula,
        formula: formula
      };
    }
  );

  return {
    // Get general properties
    textForNullValues: rootElement.getAttribute("textForNullValues"),
    axes: serviceMetaDataAxes,
    data: serviceMetaDataDatums
  };
}
