import { QueryViewerServiceResponsePivotTable } from "@genexus/reporting-api/dist/types/service-result";
import {
  QueryViewerAxisType,
  QueryViewerElementType
} from "../../common/basic-types";
import {
  QueryViewerContextElement,
  QueryViewerDragAndDropData,
  QueryViewerEventFilters,
  QueryViewerFilterChangedData,
  // QueryViewerFilterChangedData,
  QueryViewerItemClickData,
  QueryViewerItemExpandAndCollapseData
} from "../../global/types";
import {
  selectXPathNode,
  xmlToDocument
} from "@genexus/reporting-api/dist/xml-parser/utils/dom";

export function itemClickDataForPivotTable(
  qViewer: any,
  data: string
  //   isDoubleClick: boolean
): QueryViewerItemClickData {
  // if ((qViewer.ItemClick && !isDoubleClick) || (qViewer.ItemDoubleClick && isDoubleClick)) {
  //     eventData = (isDoubleClick ? eventData = qViewer.ItemDoubleClickData : qViewer.ItemClickData);
  const xmlDoc = xmlToDocument(data);
  const dataItemNode = selectXPathNode(xmlDoc, "/DATA/ITEM");
  const excludedItems = getComponentItems(qViewer);
  const contextRelatedNode = selectXPathNode(xmlDoc, "/DATA/CONTEXT/RELATED");
  const dataContextFilters = selectXPathNode(xmlDoc, "/DATA/CONTEXT/FILTERS");
  const eventData: QueryViewerItemClickData = {
    Name: (dataItemNode as Element).getAttribute("name"),
    Type: undefined,
    Axis: undefined,
    Value:
      dataItemNode.firstChild != null ? dataItemNode.firstChild.nodeValue : "",
    Selected: (dataItemNode as Element).getAttribute("selected") === "true",
    Context: loadContextItems(contextRelatedNode, excludedItems),
    Filters: loadContextItems(dataContextFilters, excludedItems)
  };
  const location = (dataItemNode as Element).getAttribute("location");
  switch (location) {
    case "rows":
      eventData.Type = QueryViewerElementType.Axis;
      eventData.Axis = QueryViewerAxisType.Rows;
      break;
    case "columns":
      eventData.Type = QueryViewerElementType.Axis;
      eventData.Axis = QueryViewerAxisType.Columns;
      break;
    case "pages":
      eventData.Type = QueryViewerElementType.Axis;
      eventData.Axis = QueryViewerAxisType.Pages;
      break;
    default:
      eventData.Type = QueryViewerElementType.Datum;
      eventData.Axis = QueryViewerAxisType.Default;
      break;
  }
  //   if (isDoubleClick) {
  //     qViewer.ItemDoubleClick();
  //   } else {
  //     qViewer.ItemClick();
  //   }
  return eventData;
}

function getComponentItems(
  serviceResponse: QueryViewerServiceResponsePivotTable
): string[] {
  const componentItems: string[] = [];
  serviceResponse.MetaData.Axes.forEach(axis => {
    if (axis.IsComponent) {
      componentItems.push(axis.Name);
    }
  });
  serviceResponse.MetaData.Data.forEach(data => {
    if (data.IsComponent) {
      componentItems.push(data.Name);
    }
  });
  return componentItems;
}

function loadContextItems(
  node: Node,
  excludedItems: string[]
): QueryViewerEventFilters[] | QueryViewerContextElement[] {
  const items: QueryViewerContextElement[] = [];
  if (Node === null) {
    return null;
  }
  let itemIndex = -1;
  node.childNodes.forEach(child => {
    if (child.nodeName !== "ITEM") {
      return null;
    }
    const itemName = (child as Element).getAttribute("name");
    if (excludedItems.indexOf(itemName) < 0) {
      itemIndex++;
      items[itemIndex] = {
        Name: itemName,
        Values: []
      };
      let valueIndex = -1;
      // Seek VALUES node
      let valuesNode = child; // ITEM
      child.childNodes.forEach(secondChild => {
        if (secondChild.nodeName === "VALUES") {
          valuesNode = secondChild;
          //   break;
        }
      });
      // Seek VALUE nodes
      valuesNode.childNodes.forEach(valueChild => {
        if (valueChild.nodeName === "VALUE") {
          valueIndex++;
          items[itemIndex].Values[valueIndex] =
            valueChild.firstChild != null
              ? valueChild.firstChild.nodeValue
              : "";
        }
      });
    }
  });

  return items;
}

export function itemExpandCollapsePivotTableEvent(
  qViewer: any,
  data: string,
  isCollapse: boolean
): QueryViewerItemExpandAndCollapseData {
  //   if (IsQueryObjectPreview()) {
  //     window.external.SendText(qViewer.ControlName, data);
  //   }
  if (
    (qViewer.ItemExpand && !isCollapse) ||
    (qViewer.ItemCollapse && isCollapse)
  ) {
    const eventData: QueryViewerItemExpandAndCollapseData = isCollapse
      ? qViewer.ItemCollapseData
      : qViewer.ItemExpandData;
    const xmlDoc = xmlToDocument(data);
    const dataItemNode = selectXPathNode(xmlDoc, "/DATA/ITEM");
    const expandedValuesNode = selectXPathNode(
      xmlDoc,
      "/DATA/CONTEXT/EXPANDEDVALUES"
    );
    eventData.Name = (dataItemNode as Element).getAttribute("name");
    eventData.Value = dataItemNode.firstChild.nodeValue;
    eventData.ExpandedValues = [{ Item: "" }];
    let valueIndex = -1;
    expandedValuesNode.childNodes.forEach(child => {
      if (child.nodeName !== "VALUE") {
        return null;
      }
      valueIndex++;
      eventData.ExpandedValues[valueIndex] = {
        Item: child.firstChild.nodeValue
      };
    });

    return eventData;
  } else {
    return null;
  }
}

const getAxisType = (axis: string) => {
  let axisType: QueryViewerAxisType = QueryViewerAxisType.Default;
  switch (axis) {
    case "rows":
      axisType = QueryViewerAxisType.Rows;
      break;
    case "columns":
      axisType = QueryViewerAxisType.Columns;
      break;
    default:
      axisType = QueryViewerAxisType.Pages;
      break;
  }
  return axisType;
};

export function dragAndDropPivotTableEvent(
  _qViewer: any,
  data: string
): QueryViewerDragAndDropData {
  //   if (qViewer.RealType === QueryViewerOutputType.PivotTable) {
  // if (IsQueryObjectPreview())
  // 	window.external.SendText(qViewer.ControlName, data);
  // if (qViewer.DragAndDrop) {
  const xmlDoc = xmlToDocument(data);
  const node = selectXPathNode(xmlDoc, "/DATA");
  const dragAndDropData: QueryViewerDragAndDropData = {
    Name: (node as Element).getAttribute("name"),
    Type: QueryViewerElementType.Axis,
    Axis: undefined,
    Position: undefined
  };
  const axis = (node as Element).getAttribute("axis");
  dragAndDropData.Axis = getAxisType(axis);
  dragAndDropData.Position = (node as Element).getAttribute("position");
  // ToDo: check how to implement this
  //   qViewer.DragAndDrop();
  return dragAndDropData;
}
//   }
// }

// ToDo: complete this implementation
export function onFilterChangedPivotTableEvent(
  qViewerId: number,
  filterChangedData: string
): QueryViewerFilterChangedData {
  if (qViewerId !== undefined) {
    return;
  }
  const filterChanged: QueryViewerFilterChangedData = {
    Name: "",
    SelectedValues: { Item: filterChangedData }
  };
  return filterChanged;
}
