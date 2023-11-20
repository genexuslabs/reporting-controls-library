import { QueryViewer } from "./types/json";
import {
  attributeValues,
  calculatePivottableData,
  data,
  metaData,
  pivotTablePageData,
  recordSetCache,
  tablePageData
} from "./post-info";
import { parseObjectToFormData } from "./utils/common";
import {
  GeneratorType,
  // QueryViewerAxisOrderType,
  QueryViewerBase,
  ServicePropertiesForPivotTable,
  ServicePropertiesForTable,
  // QueryViewerOutputType,
  // QueryViewerPivotDataType,
  ServiceType,
  ServiceTypeForPivotTable,
  ServiceTypeForTable
} from "../common/basic-types";
import { GXqueryConnector, GXqueryOptions } from "./gxquery-connector";
import {
  QueryViewerServiceData,
  QueryViewerServiceMetaData
} from "./types/service-result";
import { parseMetadataXML } from "./xml-parser/metadata-parser";
import { parseDataXML } from "./xml-parser/data-parser";
import { makeXMLRequest } from "../utils/general";

const GENERATOR: { [key in GeneratorType]: string } = {
  net: "agxpl_get.aspx?",
  java: "qviewer.services.agxpl_get?"
};

const SERVICE_NAME_MAP: { [key in ServiceType]: string } = {
  metadata: "metadata",
  data: "data",
  recordSetCache: "recordsetcachekey"
};

const SERVICE_NAME_FOR_PIVOT_TABLE_MAP: {
  [key in ServiceTypeForPivotTable]: string;
} = {
  pivotTablePageData: "pagedataforpivottable",
  attributeValues: "attributevalues",
  calculatePivottableData: "data"
  // getPivottableDataSync: "getpivottabledatasync"
};

const SERVICE_NAME_FOR_TABLE_MAP: {
  [key in ServiceTypeForTable]: string;
} = {
  tablePageData: "pagedatafortable",
  attributeValues: "attributevalues"
};

export const SERVICE_POST_INFO_MAP: {
  [key in ServiceType]: (qViewer: QueryViewer) => any;
} = {
  metadata: metaData,
  data: data,
  recordSetCache: recordSetCache
};

export const SERVICE_POST_INFO_FOR_PIVOT_TABLE_MAP: {
  [key in ServiceTypeForPivotTable]: (
    qViewer: QueryViewer,
    properties: ServicePropertiesForPivotTable
  ) => any;
} = {
  pivotTablePageData: (qViewer, properties) =>
    pivotTablePageData(qViewer, properties.pageData),
  attributeValues: (qViewer, properties) =>
    attributeValues(qViewer, properties.attributeValues),
  calculatePivottableData: (qViewer, properties) =>
    calculatePivottableData(qViewer, properties.calculatePivottableData)
};

export const SERVICE_POST_INFO_FOR_TABLE_MAP: {
  [key in ServiceTypeForTable]: (
    qViewer: QueryViewer,
    properties: ServicePropertiesForTable
  ) => any;
} = {
  tablePageData: (qViewer, properties) =>
    tablePageData(qViewer, properties.pageData),
  attributeValues: (qViewer, properties) =>
    attributeValues(qViewer, properties.attributeValues)
};

export type ServicesContext = {
  actualKey: string;
  oldKey: string;
  useGXquery: boolean;
  baseUrl: string;
  generator: GeneratorType;
  metadataName: string;
  objectName: string;
  serializedObject: string;
};

export type CallBackWhenServiceSuccess = (
  metaData: QueryViewerServiceMetaData,
  data: QueryViewerServiceData,
  queryViewerBaseProperties?: QueryViewerBase
) => void;

export type CallBackWhenPivotTableServiceSuccess = (
  actualKey: string,
  oldKey: string,
  metaData: QueryViewerServiceMetaData,
  metadataXML: string,
  queryViewerBaseProperties?: QueryViewerBase
) => void;

/**
 * Necessary so that the explorer does not cache the results of the services
 * @returns Unique value with each call, using the current date
 */
const foolCache = () => new Date().getTime();

export const getMetadataAndData = (
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenServiceSuccess
) => {
  if (servicesInfo.useGXquery) {
    getMetadataAndDataUsingGXQuery(qvInfo, servicesInfo, callbackWhenSuccess);
  } else {
    getMetadataAndDataUsingLocalServices(
      qvInfo,
      servicesInfo,
      callbackWhenSuccess
    );
  }
};

function getPivotTableMetadataUsingLocalServices(
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenPivotTableServiceSuccess
) {
  getPivotTableMetadataUsingGenericServices(
    "local",
    qvInfo,
    servicesInfo,
    callbackWhenSuccess
  );
}

export const getPivotTableMetadata = (
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenPivotTableServiceSuccess
) => {
  if (servicesInfo.useGXquery) {
    // ToDO: implement this
    // getMetadataAndDataUsingGXQuery(qvInfo, servicesInfo, callbackWhenSuccess);
  } else {
    getPivotTableMetadataUsingLocalServices(
      qvInfo,
      servicesInfo,
      callbackWhenSuccess
    );
  }
};

function getMetadataAndDataUsingGXQuery(
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenServiceSuccess
) {
  getQueryPropertiesInGXQuery(servicesInfo, queryViewerBaseProperties => {
    getMetadataAndDataUsingGenericServices(
      "gx-query",
      qvInfo,
      servicesInfo,
      (metadata, data) =>
        callbackWhenSuccess(metadata, data, queryViewerBaseProperties)
    );
  });
}

function getMetadataAndDataUsingLocalServices(
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenServiceSuccess
) {
  getMetadataAndDataUsingGenericServices(
    "local",
    qvInfo,
    servicesInfo,
    callbackWhenSuccess
  );
}

function getMetadataAndDataUsingGenericServices(
  serviceProvider: "gx-query" | "local",
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenServiceSuccess
) {
  // Determine the service provider
  const asyncServerCall =
    serviceProvider === "gx-query"
      ? asyncServerCallUsingGXQuery
      : asyncServerCallUsingLocalServices;

  // When success, make an async server call for metadata
  asyncServerCall(qvInfo, servicesInfo, "metadata", (metadataXML: string) => {
    if (!metadataXML) {
      return;
    }
    const serviceMetaData: QueryViewerServiceMetaData =
      parseMetadataXML(metadataXML);

    // When success, make an async server call for data
    asyncServerCall(qvInfo, servicesInfo, "data", (dataXML: string) => {
      if (!dataXML) {
        return;
      }
      const serviceData: QueryViewerServiceData = parseDataXML(dataXML);

      callbackWhenSuccess(serviceMetaData, serviceData);
    });
  });
}

function getPivotTableMetadataUsingGenericServices(
  serviceProvider: "gx-query" | "local",
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenPivotTableServiceSuccess
) {
  // Determine the service provider
  const asyncServerCall =
    serviceProvider === "gx-query"
      ? asyncServerCallUsingGXQuery
      : asyncServerCallUsingLocalServices;

  const recordsetCacheCallback = (cacheKey: string) => {
    let actualKey = servicesInfo.actualKey;
    let oldKey = servicesInfo.oldKey;

    if (servicesInfo.actualKey !== cacheKey) {
      oldKey = actualKey;
      actualKey = cacheKey;
    }

    qvInfo.RecordsetCache = {
      ActualKey: actualKey,
      OldKey: oldKey,
      MinutesToKeepInRecordsetCache: 5,
      MaximumCacheSize: 100
    };

    // When success, make an async server call for metadata
    asyncServerCall(qvInfo, servicesInfo, "metadata", (metadataXML: string) => {
      if (!metadataXML) {
        return;
      }
      const serviceMetaData: QueryViewerServiceMetaData =
        parseMetadataXML(metadataXML);
      callbackWhenSuccess(actualKey, oldKey, serviceMetaData, metadataXML);
    });
  };

  // When success, make an async server call for recordsetcache
  asyncServerCall(
    qvInfo,
    servicesInfo,
    "recordSetCache",
    recordsetCacheCallback
  );
}

const contextToGXqueryOptions = (context: ServicesContext): GXqueryOptions => {
  return {
    baseUrl: context.baseUrl,
    metadataName: context.metadataName,
    queryName: context.objectName,
    query: context.serializedObject
      ? JSON.parse(context.serializedObject)
      : undefined
  };
};

function getQueryPropertiesInGXQuery(
  servicesInfo: ServicesContext,
  callbackWhenReady: (queryViewerBaseProperties: QueryViewerBase) => void
) {
  if (servicesInfo.objectName) {
    GXqueryConnector.getQueryByName(contextToGXqueryOptions(servicesInfo)).then(
      queryByNameResponse => {
        const query = queryByNameResponse.Query;
        callbackWhenReady(query);
      }
    );
  } else if (servicesInfo.serializedObject) {
    const query = JSON.parse(servicesInfo.serializedObject);
    callbackWhenReady(query);
  }
}

function asyncServerCallUsingLocalServices(
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  serviceType: ServiceType,
  callbackWhenReady: (response: string) => void
) {
  const postInfo = parseObjectToFormData(
    SERVICE_POST_INFO_MAP[serviceType](qvInfo)
  );
  console.log("qvInfo", qvInfo);
  console.log("serviceType, POST INFO", serviceType, postInfo);
  const serviceURL =
    servicesInfo.baseUrl +
    GENERATOR[servicesInfo.generator] +
    SERVICE_NAME_MAP[serviceType] +
    "," +
    foolCache();
  makeXMLRequest(serviceURL, postInfo, callbackWhenReady);
}

function asyncServerCallUsingGXQuery(
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  serviceType: ServiceType,
  callbackWhenReady: (xml: string) => void
) {
  const postInfo = parseObjectToFormData(
    SERVICE_POST_INFO_MAP[serviceType](qvInfo)
  );

  GXqueryConnector.callQueryViewerService(
    contextToGXqueryOptions(servicesInfo),
    serviceType,
    postInfo
  ).then(callbackWhenReady);
}

export const getPagePivotTable = (
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenServiceSuccess
) => {
  if (servicesInfo.useGXquery) {
    getMetadataAndDataUsingGXQuery(qvInfo, servicesInfo, callbackWhenSuccess);
  } else {
    getMetadataAndDataUsingLocalServices(
      qvInfo,
      servicesInfo,
      callbackWhenSuccess
    );
  }
};

export const makeRequestForPivotTable = (
  qvInfo: QueryViewer,
  properties: ServicePropertiesForPivotTable,
  servicesInfo: ServicesContext,
  serviceType: ServiceTypeForPivotTable,
  callbackWhenSuccess: (xml: string) => void
) => {
  qvInfo.RecordsetCache = {
    ActualKey: servicesInfo.actualKey,
    OldKey: servicesInfo.oldKey,
    MinutesToKeepInRecordsetCache: 5,
    MaximumCacheSize: 100
  };

  // Determine the service provider
  const asyncServerCall = asyncServerCallUsingLocalServicesForPivotTable;

  asyncServerCall(
    qvInfo,
    properties,
    servicesInfo,
    serviceType,
    (dataXML: string) => {
      if (!dataXML) {
        return;
      }

      callbackWhenSuccess(dataXML);
    }
  );
};

export const makeRequestForTable = (
  qvInfo: QueryViewer,
  properties: ServicePropertiesForTable,
  servicesInfo: ServicesContext,
  serviceType: ServiceTypeForTable,
  callbackWhenSuccess: (xml: string) => void
) => {
  qvInfo.RecordsetCache = {
    ActualKey: servicesInfo.actualKey,
    OldKey: servicesInfo.oldKey,
    MinutesToKeepInRecordsetCache: 5,
    MaximumCacheSize: 100
  };

  // Determine the service provider
  const asyncServerCall = asyncServerCallUsingLocalServicesForTable;

  asyncServerCall(
    qvInfo,
    properties,
    servicesInfo,
    serviceType,
    (dataXML: string) => {
      if (!dataXML) {
        return;
      }

      callbackWhenSuccess(dataXML);
    }
  );
};

function asyncServerCallUsingLocalServicesForPivotTable(
  qvInfo: QueryViewer,
  properties: ServicePropertiesForPivotTable,
  servicesInfo: ServicesContext,
  serviceType: ServiceTypeForPivotTable,
  callbackWhenReady: (response: string) => void
) {
  const postInfo = parseObjectToFormData(
    SERVICE_POST_INFO_FOR_PIVOT_TABLE_MAP[serviceType](qvInfo, properties)
  );
  const serviceURL =
    servicesInfo.baseUrl +
    GENERATOR[servicesInfo.generator] +
    SERVICE_NAME_FOR_PIVOT_TABLE_MAP[serviceType] +
    "," +
    foolCache();
  makeXMLRequest(serviceURL, postInfo, callbackWhenReady);
}

function asyncServerCallUsingLocalServicesForTable(
  qvInfo: QueryViewer,
  properties: ServicePropertiesForTable,
  servicesInfo: ServicesContext,
  serviceType: ServiceTypeForTable,
  callbackWhenReady: (response: string) => void
) {
  const postInfo = parseObjectToFormData(
    SERVICE_POST_INFO_FOR_TABLE_MAP[serviceType](qvInfo, properties)
  );
  const serviceURL =
    servicesInfo.baseUrl +
    GENERATOR[servicesInfo.generator] +
    SERVICE_NAME_FOR_TABLE_MAP[serviceType] +
    "," +
    foolCache();
  makeXMLRequest(serviceURL, postInfo, callbackWhenReady);
}
// ToDo: Add implementation for GXQuery
// function asyncServerCallUsingGXQueryForPivotTable(
//   qvInfo: QueryViewer,
//   servicesInfo: ServicesContext,
//   serviceType: ServiceType,
//   callbackWhenReady: (xml: string) => void
// ) {
//   const postInfo = parseObjectToFormData(
//     SERVICE_POST_INFO_FOR_PIVOT_TABLE_MAP[serviceType](qvInfo)
//   );

//   GXqueryConnector.callQueryViewerService(
//     contextToGXqueryOptions(servicesInfo),
//     serviceType,
//     postInfo
//   ).then(callbackWhenReady);
// }
