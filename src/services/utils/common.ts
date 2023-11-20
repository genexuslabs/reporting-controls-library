import { QueryViewerOutputType } from "../../common/basic-types";
import { QueryViewer, QueryViewerCard, QueryViewerChart } from "../types/json";
import { ChartTypes } from "./chart";

export const parseObjectToFormData = (object: { [key: string]: any }) =>
  "Data=" + encodeURIComponent(JSON.stringify(object));

export const sortAscendingForced = (qViewer: QueryViewer) =>
  (qViewer.RealType === QueryViewerOutputType.Chart &&
    ChartTypes.IsTimeline(qViewer as QueryViewerChart)) ||
  (qViewer.RealType === QueryViewerOutputType.Card &&
    ((qViewer as QueryViewerCard).IncludeSparkline ||
      (qViewer as QueryViewerCard).IncludeTrend));

// ToDo: implement this function
export function dataChanged() {
  // function DataChanged(qViewer, key)
  // function DataType(outputType) {
  //   if (outputType == QueryViewerOutputType.Table) {
  //     return "PagedRecordSet";
  //   } else if (outputType == QueryViewerOutputType.PivotTable) {
  //     return "PagedLineSet";
  //   } else {
  //     return "NotPaged";
  //   }
  // }
  // function GetFieldsJSON(qViewer, fields, keyOrderType) {
  //   let fieldsStr = SortAscendingForced(qViewer);
  //   for (let i = 0; i < fields.length; i++) {
  //     const field = fields[i];
  //     let orderType = "";
  //     if (field[keyOrderType] != undefined) {
  //       orderType = field[keyOrderType].Type;
  //     }
  //     if (orderType != "") {
  //       const sdtOrderType = qv.services.postInfo._priv.SdtWithValuesJSON(
  //         "Order",
  //         orderType,
  //         QueryViewerAxisOrderType.Custom,
  //         field[keyOrderType].Values,
  //         false
  //       );
  //       fieldsStr += "," + sdtOrderType;
  //     }
  //     if (field["Analytics"] != undefined) {
  //       fieldsStr += "," + field["Analytics"].ShowValuesAs;
  //       fieldsStr += "," + field["Analytics"].RollingAverageType;
  //       fieldsStr += "," + field["Analytics"].RollingAverageTerms;
  //       fieldsStr += "," + field["Analytics"].DifferenceFrom;
  //       fieldsStr += "," + field["Analytics"].ShowAsPercentage;
  //     }
  //   }
  //   return fieldsStr;
  // }
  // const runtimeParametersJSON = qv.services.RuntimeParametersJSON(qViewer);
  // const fieldsJSON = GetFieldsJSON(qViewer, qViewer.Axes, "AxisOrder");
  // const dataType = DataType(qViewer.RealType);
  // if (
  //   qViewer.ObjectName != key.ObjectName ||
  //   qViewer.ObjectType != key.ObjectType ||
  //   qViewer.ObjectId != key.ObjectId ||
  //   qViewer.Object != key.Object ||
  //   runtimeParametersJSON != key.RuntimeParametersJSON ||
  //   fieldsJSON != key.FieldsJSON ||
  //   dataType != key.DataType
  // ) {
  //   key.ObjectName = qViewer.ObjectName;
  //   key.ObjectType = qViewer.ObjectType;
  //   key.ObjectId = qViewer.ObjectId;
  //   key.Object = qViewer.Object;
  //   key.RuntimeParametersJSON = runtimeParametersJSON;
  //   key.FieldsJSON = fieldsJSON;
  //   key.DataType = dataType;
  //   return true;
  // } else {
  //   return false;
  // }
  return false;
}
