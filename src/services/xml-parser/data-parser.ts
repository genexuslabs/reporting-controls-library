import {
  QueryViewerServiceData,
  QueryViewerServiceDataRow
} from "../types/service-result";
import {
  getMultipleElementsByTagName,
  getSingleElementByTagName,
  xmlToDocument
} from "./utils/dom";

const ELEMENT_NODE_TYPE = 1;

export function parseDataXML(data: string): QueryViewerServiceData | undefined {
  if (!data) {
    return undefined;
  }

  const xmlDoc = xmlToDocument(data);
  const rootElement = getSingleElementByTagName(xmlDoc, "Recordset");
  const records = Array.from(
    getMultipleElementsByTagName(rootElement, "Record")
  );

  const rows: QueryViewerServiceDataRow[] = records.map(record => {
    const values: { [key: string]: string } = {};

    record.childNodes.forEach(node => {
      if (node.nodeType === ELEMENT_NODE_TYPE) {
        const name = node.nodeName;
        const value =
          node.childNodes.length === 1 ? node.childNodes[0].nodeValue : "";

        values[name] = value;
      }
    });
    return values;
  });

  return { rows: rows };
}
