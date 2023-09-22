import {
  GeneratorType,
  GxChatMessage,
  GxChatMessageResponse,
  GxCommonErrorResponse,
  GxQueryItem,
  GxQueryListResponse,
  GxQueryOptions,
  Query,
  QueryViewerChartType,
  QueryViewerContinent,
  QueryViewerCountry,
  QueryViewerMapType,
  QueryViewerOrientation,
  QueryViewerOutputType,
  QueryViewerPlotSeries,
  QueryViewerRegion,
  QueryViewerShowDataAs,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal,
  QueryViewerXAxisLabels,
  ServiceType
} from "../common/basic-types";
import {
  DeleteQueryServiceResponse,
  GXqueryConnector,
  GetQueryByNameServiceResponse,
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
import { QueryViewerServiceProperties } from "./types/service-result";
import { parseObjectToFormData } from "./utils/common";

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

/**
 * Necessary so that the explorer does not cache the results of the services
 * @returns Unique value with each call, using the current date
 */
const foolCache = () => new Date().getTime();

const queryToQueryProperties = (query: Query): QueryViewerServiceProperties => {
  return {
    Id: query.Id,
    Name: query.Name,
    Type: QueryViewerOutputType[
      query.OutputType as keyof typeof QueryViewerOutputType
    ],
    QueryTitle: query.Title,
    ShowValues: query.ShowValues,
    ShowDataAs:
      QueryViewerShowDataAs[
        query.ShowDataAs as keyof typeof QueryViewerShowDataAs
      ],
    Orientation:
      QueryViewerOrientation[
        query.Orientation as keyof typeof QueryViewerOrientation
      ],
    IncludeTrend: query.IncludeTrend,
    IncludeSparkline: query.IncludeSparkline,
    IncludeMaxMin: query.IncludeMaxAndMin,
    ChartType:
      QueryViewerChartType[
        query.ChartType as keyof typeof QueryViewerChartType
      ],
    PlotSeries:
      QueryViewerPlotSeries[
        query.PlotSeries as keyof typeof QueryViewerPlotSeries
      ],
    XAxisLabels:
      QueryViewerXAxisLabels[
        query.XAxisLabels as keyof typeof QueryViewerXAxisLabels
      ],
    XAxisIntersectionAtZero: query.XAxisIntersectionAtZero,
    XAxisTitle: query.XAxisTitle,
    YAxisTitle: query.YAxisTitle,
    MapType:
      QueryViewerMapType[query.MapType as keyof typeof QueryViewerMapType],
    Region: QueryViewerRegion[query.Region as keyof typeof QueryViewerRegion],
    Continent:
      QueryViewerContinent[
        query.Continent as keyof typeof QueryViewerContinent
      ],
    Country:
      QueryViewerCountry[query.Country as keyof typeof QueryViewerCountry],
    Paging: query.Paging,
    PageSize: query.PageSize,
    ShowDataLabelsIn:
      QueryViewerShowDataLabelsIn[
        query.ShowDataLabelsIn as keyof typeof QueryViewerShowDataLabelsIn
      ],
    TotalForRows:
      QueryViewerTotal[query.TotalForRows as keyof typeof QueryViewerTotal],
    TotalForColumns:
      QueryViewerTotal[query.TotalForColumns as keyof typeof QueryViewerTotal]
  };
};

const contextToGXqueryOptions = (context: ServicesContext): GxQueryOptions => {
  return {
    baseUrl: context.baseUrl,
    metadataName: context.metadataName,
    queryName: context.objectName,
    query: context.serializedObject
      ? JSON.parse(context.serializedObject)
      : undefined
  };
};

export const asyncGetProperties = (
  context: ServicesContext,
  callbackWhenReady: (prop: QueryViewerServiceProperties) => void
) => {
  if (!context.useGXquery) {
    callbackWhenReady(undefined); // Not implemented
  } else if (context.objectName) {
    GXqueryConnector.getQueryByName(contextToGXqueryOptions(context)).then(
      resObj => {
        const query = (resObj as GetQueryByNameServiceResponse).Query;
        const properties = queryToQueryProperties(query);
        callbackWhenReady(properties);
      }
    );
  } else if (context.serializedObject) {
    const query = JSON.parse(context.serializedObject);
    const properties = queryToQueryProperties(query);
    callbackWhenReady(properties);
  } else {
    callbackWhenReady(undefined);
  }
};

export const asyncServerCall = (
  qViewer: QueryViewer,
  context: ServicesContext,
  serviceType: ServiceType,
  callbackWhenReady: (xml: string) => void
) => {
  const postInfo = parseObjectToFormData(
    SERVICE_POST_INFO_MAP[serviceType](qViewer)
  );
  if (!context.useGXquery) {
    const serviceURL =
      context.baseUrl +
      GENERATOR[context.generator] +
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
    xmlHttp.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    xmlHttp.send(postInfo);
  } else {
    GXqueryConnector.callQueryViewerService(
      contextToGXqueryOptions(context),
      serviceType,
      postInfo
    ).then(str => {
      callbackWhenReady(str);
    });
  }
};

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
  // const queries = transformQueryDtoListToUIData(resObj.Queries);
  // callbackWhenReady(queries);
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
  callbackWhenReady: (data: GxCommonErrorResponse) => void
) => {
  const queryDto = transformGxQueryItemToQueryDto(query);
  const queryOptions = { ...options, query: queryDto };
  GXqueryConnector.updateQuery(queryOptions)
    .then(resObj => {
      callbackWhenReady({ Errors: resObj });
    })
    .catch(err => {
      callbackWhenReady({ Errors: [].concat(err?.message || err || []) });
    });
};
