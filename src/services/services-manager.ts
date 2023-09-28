import {
  GeneratorType,
  GxChatMessage,
  GxChatMessageResponse,
  GxCommonErrorResponse,
  GxQueryItem,
  GxQueryListResponse,
  GxQueryOptions,
  QueryViewerBase,
  ServiceType
} from "../common/basic-types";
import {
  DeleteQueryServiceResponse,
  GXqueryConnector,
  GXqueryOptions,
  RenameQueryServiceResponse
} from "./gxquery-connector";
import { data, metaData } from "./post-info";
import {
  transformGxChatItemToChatMessageDto,
  transformGxQueryItemToQueryDto,
  transformQueryDtoListToUIData,
  transformQueryDtoToChatItem,
  transformQueryDtoToGxQueryItem
} from "./query-transformations";
import { QueryViewer } from "./types/json";
import {
  QueryViewerServiceData,
  QueryViewerServiceMetaData,
  QueryViewerServiceProperties
} from "./types/service-result";
import { parseObjectToFormData } from "./utils/common";
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
  data: "data"
};

export const SERVICE_POST_INFO_MAP: {
  [key in ServiceType]: (qViewer: QueryViewer) => any;
} = {
  metadata: metaData,
  data: data
};

export type ServicesContext = {
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
  callbackWhenReady: (xml: string) => void
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

/**
 * Fetch query list service
 * @param options Query options
 * @param callbackWhenReady Callback function that return data or error
 */
export const asyncGetListQuery = (
  options: GxQueryOptions,
  callbackWhenReady: (data: GxQueryListResponse) => void
) => {
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
      const { Query: QueryDto, Errors } = resObj;
      const ChatMessage = transformQueryDtoToChatItem(QueryDto);
      const Query = transformQueryDtoToGxQueryItem(QueryDto);
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
  query: GxQueryItem,
  properties: QueryViewerServiceProperties,
  callbackWhenReady: (data: GxCommonErrorResponse) => void
) => {
  const queryDto = transformGxQueryItemToQueryDto(query, properties);
  const queryOptions = { ...options, query: queryDto };
  GXqueryConnector.updateQuery(queryOptions)
    .then(resObj => {
      callbackWhenReady({ Errors: resObj });
    })
    .catch(err => {
      callbackWhenReady({ Errors: [].concat(err?.message || err || []) });
    });
};
