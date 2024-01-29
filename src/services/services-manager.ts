import {
  DeleteQueryServiceResponse,
  GXqueryConnector,
  RenameQueryServiceResponse
} from "./gxquery-connector";
import {
  attributeValues,
  calculatePivottableData,
  data,
  metaData,
  pivotTablePageData,
  getPivottableDataSync,
  recordSetCache,
  tablePageData
} from "./post-info";
import {
  GeneratorType,
  GxChatMessage,
  GxChatMessageResponse,
  GxCommonErrorResponse,
  GxGetQueryResponse,
  GxQueryItem,
  GxQueryListResponse,
  GxQueryOptions,
  QueryViewerBase,
  ServicePropertiesForPivotTable,
  ServicePropertiesForTable,
  // QueryViewerOutputType,
  // QueryViewerPivotDataType,
  ServiceType,
  AsyncServiceTypeForPivotTable,
  AsyncServiceTypeForTable,
  SyncServiceTypeForPivotTable
} from "@common/basic-types";
import { QueryViewer } from "./types/json";
import {
  QueryViewerServiceData,
  QueryViewerServiceMetaData,
  QueryViewerServiceResponse
} from "./types/service-result";
import { parseObjectToFormData } from "./utils/common";
import {
  transformGxChatItemToChatMessageDto,
  transformGxQueryItemToQueryDto,
  transformQueryDtoListToUIData,
  transformQueryDtoToChatItem,
  transformQueryViewerBaseToQueryViewer
} from "./utils/query-transformations";
import { parseDataXML } from "./xml-parser/data-parser";
import { parseMetadataXML } from "./xml-parser/metadata-parser";

const STATE_DONE = 4;
const STATUS_OK = 200;

const GENERATOR: { [key in GeneratorType]: string } = {
  net: "agxpl_get.aspx?",
  java: "qviewer.services.agxpl_get?"
};

const SERVICE_NAME_MAP: { [key in ServiceType]: string } = {
  metadata: "metadata",
  data: "data",
  recordSetCache: "recordsetcachekey"
};

const BASE_URL = process.env.GENEXUS_QUERY_URL;
const DEFAULT_GENERATOR = (process.env.GENEXUS_DEFAULT_GENERATOR ||
  "net") as GeneratorType;

const SERVICE_NAME_FOR_PIVOT_TABLE_MAP: {
  [key in AsyncServiceTypeForPivotTable]: string;
} = {
  pivotTablePageData: "pagedataforpivottable",
  attributeValues: "attributevalues",
  calculatePivottableData: "data",
  getPivottableDataSync: "getpivottabledatasync"
};

const SERVICE_NAME_FOR_TABLE_MAP: {
  [key in AsyncServiceTypeForTable]: string;
} = {
  tablePageData: "pagedatafortable",
  attributeValues: "attributevalues"
};

const SERVICE_NAME_FOR_SYNC_PIVOT_TABLE_MAP: {
  [key in SyncServiceTypeForPivotTable]: string;
} = {
  getPivottableDataSync: "getpivottabledatasync"
};

export const SERVICE_POST_INFO_MAP: {
  [key in ServiceType]: (qViewer: QueryViewer) => any;
} = {
  metadata: metaData,
  data: data,
  recordSetCache: recordSetCache
};

export const SERVICE_POST_INFO_FOR_PIVOT_TABLE_MAP: {
  [key in AsyncServiceTypeForPivotTable]: (
    qViewer: QueryViewer,
    properties: ServicePropertiesForPivotTable
  ) => any;
} = {
  pivotTablePageData: (qViewer, properties) =>
    pivotTablePageData(qViewer, properties.pageData),
  attributeValues: (qViewer, properties) =>
    attributeValues(qViewer, properties.attributeValues),
  calculatePivottableData: (qViewer, properties) =>
    calculatePivottableData(qViewer, properties.calculatePivottableData),
  getPivottableDataSync: (qViewer, properties) =>
    getPivottableDataSync(qViewer, properties.getPivottableDataSync)
};

export const SERVICE_POST_INFO_FOR_TABLE_MAP: {
  [key in AsyncServiceTypeForTable]: (
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
  actualKey?: string;
  oldKey?: string;
  useGXquery: boolean;
  baseUrl: string;
  generator: GeneratorType;
  metadataName: string;
  objectName: string;
  serializedObject: string;
  apiKey: string;
  saiaToken: string;
  saiaUserId?: string;
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
    getPivotTableMetadataAndDataUsingGXQuery(
      qvInfo,
      servicesInfo,
      callbackWhenSuccess
    );
  } else {
    getPivotTableMetadataUsingLocalServices(
      qvInfo,
      servicesInfo,
      callbackWhenSuccess
    );
  }
};

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

function getPivotTableMetadataAndDataUsingGXQuery(
  qvInfo: QueryViewer,
  servicesInfo: ServicesContext,
  callbackWhenSuccess: CallBackWhenPivotTableServiceSuccess
) {
  getQueryPropertiesInGXQuery(servicesInfo, queryViewerBaseProperties => {
    // Make an async server call for metadata
    asyncServerCallUsingGXQuery(
      qvInfo,
      servicesInfo,
      "metadata",
      (metadataXML: string) => {
        if (!metadataXML) {
          return;
        }
        const serviceMetaData: QueryViewerServiceMetaData =
          parseMetadataXML(metadataXML);
        getPivotTableMetadataUsingGenericServices(
          "gx-query",
          qvInfo,
          servicesInfo,
          (_, metadataXML) =>
            callbackWhenSuccess(
              servicesInfo.actualKey,
              servicesInfo.oldKey,
              serviceMetaData,
              metadataXML,
              queryViewerBaseProperties
            )
        );
      }
    );
  });
}

function makeXMLRequest(
  serviceURL: string,
  postInfo: string,
  callbackWhenReady: (xml: string) => void
) {
  const xmlHttp = new XMLHttpRequest();

  // Callback function when ready
  xmlHttp.onload = () => {
    if (xmlHttp.readyState === STATE_DONE && xmlHttp.status === STATUS_OK) {
      callbackWhenReady(xmlHttp.responseText);
    }
  };

  xmlHttp.open("POST", serviceURL); // async
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlHttp.send(postInfo);
}

function makeXMLRequestSync(serviceURL: string, postInfo: string) {
  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("POST", serviceURL, false); // sync
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlHttp.send(postInfo);

  return xmlHttp.responseText;
}

const contextToGXqueryOptions = (context: ServicesContext): GxQueryOptions => {
  const { objectName, serializedObject, baseUrl, generator, metadataName, apiKey, saiaToken, saiaUserId } = context;
  const options: GxQueryOptions = {
    baseUrl,
    generator,
    metadataName,
    apiKey,
    saiaToken,
    saiaUserId
  }
  if (serializedObject || objectName) {
    options.query = serializedObject ? JSON.parse(serializedObject) : { Name: objectName };
  }
  return options;
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
  serviceType: AsyncServiceTypeForPivotTable,
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
  serviceType: AsyncServiceTypeForTable,
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
  serviceType: AsyncServiceTypeForPivotTable,
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
  serviceType: AsyncServiceTypeForTable,
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
export const makeRequestForSyncServicesPivotTable = (
  qvInfo: QueryViewer,
  properties: ServicePropertiesForPivotTable,
  servicesInfo: ServicesContext,
  serviceType: SyncServiceTypeForPivotTable
) => {
  qvInfo.RecordsetCache = {
    ActualKey: servicesInfo.actualKey,
    OldKey: servicesInfo.oldKey,
    MinutesToKeepInRecordsetCache: 5,
    MaximumCacheSize: 100
  };

  // Determine the service provider
  const syncServerCall = syncServerCallUsingLocalServices;

  const response = syncServerCall(
    qvInfo,
    properties,
    servicesInfo,
    serviceType
  );

  return response;
};

function syncServerCallUsingLocalServices(
  qvInfo: QueryViewer,
  properties: ServicePropertiesForPivotTable,
  servicesInfo: ServicesContext,
  serviceType: SyncServiceTypeForPivotTable
) {
  const postInfo = parseObjectToFormData(
    SERVICE_POST_INFO_FOR_PIVOT_TABLE_MAP[serviceType](qvInfo, properties)
  );
  const serviceURL =
    servicesInfo.baseUrl +
    GENERATOR[servicesInfo.generator] +
    SERVICE_NAME_FOR_SYNC_PIVOT_TABLE_MAP[serviceType] +
    "," +
    foolCache();
  const response = makeXMLRequestSync(serviceURL, postInfo);
  return response;
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

/**
 * Fetch query list service
 * @param options Query options
 * @param serializedObject List of  QueryViewerBase
 * @param callbackWhenReady Callback function that return data or error
 */
export const asyncGetListQuery = (
  options: GxQueryOptions,
  serializedObject: string,
  callbackWhenReady: (data: GxQueryListResponse) => void
) => {
  if (serializedObject) {
    const items = JSON.parse(serializedObject) as QueryViewerBase[];
    const Queries = transformQueryDtoListToUIData(items);
    callbackWhenReady({ Queries, Errors: [] });
  } else {
    GXqueryConnector.getQueryList(options)
      .then(resObj => {
        const { Errors } = resObj;
        const Queries = transformQueryDtoListToUIData(resObj.Queries);
        callbackWhenReady({ Queries, Errors });
      })
      .catch(err => {
        const Errors = [].concat(err?.message || err || []);
        callbackWhenReady({ Queries: [], Errors });
      });
  }
};

/**
 * Call service to rename a query
 * @param options options that includes the query with the new name
 * @param callbackWhenReady Callback that return service error message
 */
export const asyncRenameQuery = (
  options: GxQueryOptions,
  query: GxQueryItem,
  callbackWhenReady: (data: RenameQueryServiceResponse) => void
) => {
  const queryDto = transformGxQueryItemToQueryDto(query);
  const queryOptions = { ...options, query: queryDto };
  GXqueryConnector.renameQuery(queryOptions)
    .then(resObj => {
      callbackWhenReady(resObj);
    })
    .catch(err => {
      callbackWhenReady({ Errors: [err] });
    });
};

/**
 * Call service to delete a query
 * @param options query options
 * @param callbackWhenReady Callback that return service error message
 */
export const asyncDeleteQuery = (
  options: GxQueryOptions,
  query: GxQueryItem,
  callbackWhenReady: (data: DeleteQueryServiceResponse) => void
) => {
  const queryDto = transformGxQueryItemToQueryDto(query);
  const queryOptions = { ...options, query: queryDto };
  GXqueryConnector.deleteQuery(queryOptions)
    .then(resObj => {
      callbackWhenReady(resObj);
    })
    .catch(err => {
      callbackWhenReady({ Errors: [].concat(err?.message || err || []) });
    });
};

/**
 * Call service to insert a new query
 * @param options provide baseUrl and metadataId
 * @param callbackWhenReady Callback that return service error message
 */
export const asyncNewChatMessage = (
  options: GxQueryOptions,
  messages: GxChatMessage[],
  callbackWhenReady: (data: GxChatMessageResponse) => void
) => {
  const chatMessages = messages.map(transformGxChatItemToChatMessageDto);
  GXqueryConnector.newInput(options, chatMessages)
    .then(resObj => {
      const { Query, Errors } = resObj;
      const ChatMessage = transformQueryDtoToChatItem(Query);
      callbackWhenReady({ Errors, ChatMessage, Query });
    })
    .catch(err => {
      callbackWhenReady({ ChatMessage: undefined, Errors: [err] });
    });
};

/**
 * Call service to update a new query
 * @param options provide baseUrl and metadataId
 * @param callbackWhenReady Callback that return service error message
 */
export const asyncUpdateQuery = (
  options: GxQueryOptions,
  query: QueryViewerBase,
  callbackWhenReady: (data: GxCommonErrorResponse) => void
) => {
  // const queryDto = transformGxQueryItemToQueryDto(query, properties);
  // const queryDto = transformGxQueryItemToQueryDto(query);
  const queryOptions = { ...options, query };
  GXqueryConnector.updateQuery(queryOptions)
    .then(resObj => {
      callbackWhenReady({ Errors: resObj });
    })
    .catch(err => {
      callbackWhenReady({ Errors: [].concat(err?.message || err || []) });
    });
};

export const asyncGetQueryProperties = (
  options: GxQueryOptions,
  callbackWhenReady: (data: GxGetQueryResponse) => void
) => {
  // const query = transformGxQueryItemToQueryDto(gxQuery);
  GXqueryConnector.getQueryByName(options)
    .then(response => {
      const { Query, Errors } = response;
      // const Query = transformQueryDtoToGxQueryItem(response.Query);
      callbackWhenReady({ Query, Errors });
    })
    .catch(err => {
      callbackWhenReady({
        Query: null,
        Errors: [].concat(err?.message || err || [])
      });
    });
};

/**
 * Fetch data and metadata required for Query Viewer
 * @param query query viewer data
 * @param options ServicesContext
 * @param callbackWhenReady: (data: CallBackWhenServiceSuccess) => void
 * @todo add parameter to specify limits or paginator to query viewer with a lot of data
 */
export const fetchMetadataAndDataByQuery = (
  query: QueryViewerBase,
  options: Partial<ServicesContext>,
  callbackWhenReady: (data: QueryViewerServiceResponse) => void
) => {
  const queryViewerObject = transformQueryViewerBaseToQueryViewer(query);
  const servicesInfo: ServicesContext = {
    objectName: null,
    baseUrl: options.baseUrl ?? BASE_URL,
    metadataName: options.metadataName,
    useGXquery: options.useGXquery,
    generator: (options.generator ?? DEFAULT_GENERATOR),
    serializedObject: (options.serializedObject ?? ""),
    apiKey: options.apiKey,
    saiaToken: options.saiaToken,
    saiaUserId: options.saiaUserId
  };

  getMetadataAndData(
    queryViewerObject,
    servicesInfo,
    (MetaData, Data, Properties) => {
      callbackWhenReady({
        Data,
        MetaData,
        Properties
      });
    }
  );
};

/**
 *
 * @param options
 * @param messages
 * @param callbackWhenReady
 */
export const getQueryAndDataByMessage = (
  options: Omit<ServicesContext, "serializedObject">,
  messages: GxChatMessage[],
  callbackWhenReady: (
    data: QueryViewerServiceResponse | { Errors: any[] }
  ) => void
) => {
  const chatMessages = messages.map(transformGxChatItemToChatMessageDto);

  GXqueryConnector.newInput(options, chatMessages)
    .then(({ Query }) => {
      const queryViewerObject = transformQueryViewerBaseToQueryViewer(Query);
      const serialized = {
        Id: Query.id,
        Title: Query.title,
        ChartType: Query.outputType,
        ShowValues: Query.showValues
      };
      const servicesInfo: ServicesContext = {
        objectName: null,
        baseUrl: options.baseUrl ?? BASE_URL,
        metadataName: options.metadataName,
        useGXquery: options.useGXquery,
        generator: (options.generator ?? DEFAULT_GENERATOR),
        serializedObject: JSON.stringify(serialized),
        apiKey: options.apiKey,
        saiaToken: options.saiaToken,
        saiaUserId: options.saiaUserId
      };

      try {
        getMetadataAndData(
          queryViewerObject,
          servicesInfo,
          (MetaData, Data, Properties) => {
            callbackWhenReady({
              Data,
              MetaData,
              Properties
            });
          }
        );
      } catch (err) {
        callbackWhenReady({
          Errors: [].concat(err?.message || err || [])
        });
      }
    })
    .catch(err => {
      callbackWhenReady({
        Errors: [].concat(err?.message || err || [])
      });
    });
};
