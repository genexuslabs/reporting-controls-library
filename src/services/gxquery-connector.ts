import {
  ChatMessage,
  GxError,
  GxQueryOptions,
  QueryViewerBase,
  ServiceType
} from "@common/basic-types";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// This is a WA to fix the query-viewer implementation in GeneXus' applications.
// Without this, the query-viewer won't work since this code runs in the
// browser when using GeneXus' applications
if (globalThis.window && window.process === undefined) {
  window.process = { browser: true, env: { ENVIRONMENT: "BROWSER" } } as any;
}

export const GET_METADATA_BY_NAME_SERVICE_PATH = "/Metadata/GetByName";
export const GET_QUERY_BY_NAME_SERVICE_PATH = "/Query/GetByName";
export const GET_LIST_QUERY_SERVICE_PATH = "/Query/List";
export const RENAME_QUERY_SERVICE_PATH = "/Query/SetPropertyValue";
export const DELETE_QUERY_SERVICE_PATH = "/Query/Delete";
export const NEW_QUERY_SERVICE_PATH = "/Query/New";
export const UPDATE_QUERY_SERVICE_PATH = "/Query/Update";
export const QV_GET_METADATA_SERVICE_PATH = "/QueryViewer/GetMetadata";
export const QV_GET_DATA_SERVICE_PATH = "/QueryViewer/GetData";
export const QV_GET_RECORD_SET_CACHE_SERVICE_PATH = "/QueryViewer/GetRecordSetCache";
export const SAIA_USER_ID_HEADER: string = 'X-Saia-User-Id';
export const SAIA_AUTH_HEADER: string = 'Saia-Auth';

const GENERIC_ERROR_CODE = -1;

/**
 * Represents GXquery metadata
 */
type Metadata = {
  id: string;
  name: string;
};

/**
 * Generic response to any GXquery API service
 */
type GenericServiceResponse = {
  Errors: { Code: number; Message: string }[];
};

/**
 * Response returned by the GetMetadataByName service
 */
type GetMetadataByNameServiceResponse = GenericServiceResponse & {
  Metadata: Metadata;
};

/**
 * Response returned by the GetQueryByName service
 */
export type GetQueryByNameServiceResponse = GenericServiceResponse & {
  Query: QueryViewerBase;
};

/**
 * Response returned by the QueryViewerGetMetadata service
 */
type QVMetadataServiceResponse = GenericServiceResponse & {
  Metadata: string;
};

/**
 * Response returned by the QueryViewerGetData service
 */
type QVDataServiceResponse = GenericServiceResponse & {
  Data: string;
};

/**
 * Response returned by the QueryViewerGetRecordSetCache service
 */
type QVRecordSetCacheServiceResponse = GenericServiceResponse & {
  RecordSetCache: string;
};

/**
 * Response returned by the QueryList service
 */
export type GetQueryListServiceResponse = GenericServiceResponse & {
  Queries: QueryViewerBase[];
};
/**
 * Response returned by the Query rename service
 */
export type RenameQueryServiceResponse = GenericServiceResponse;
/**
 * Response returned by the Query delete service
 */
export type DeleteQueryServiceResponse = GenericServiceResponse;
/**
 * Response returned by the Query update service
 */
export type UpdateQueryServiceResponse = GxError[];

/**
 * Input sended to update a Query
 */
type UpdateQueryServiceInput = {
  MetadataId: string;
  Query: QueryViewerBase;
};

/**
 * Response returned by the New Query service
 */
export type NewQueryServiceResponse = GenericServiceResponse & {
  Query: QueryViewerBase;
};

/**
 * Response returned by the New Query service
 */
export type QueryDataMetadataServiceResponse = GenericServiceResponse & {
  Query: QueryViewerBase;
  Data: string;
  Metadata: string;
};

/**
 * Returns a generic error given its code and message
 */
const makeGenericError = (
  code: number,
  message: string
): GenericServiceResponse => ({
  Errors: [{ Code: code, Message: message }]
});

/**
 *
 */
const makeResponseWithError = <T extends GenericServiceResponse>(err: GenericServiceResponse, rest = {}) => ({ ...err, ...rest }) as T;

/**
 * Check error response
 */
const hasAnyError = <T>(err: { Errors: T[] }): boolean => {
  return err.Errors.length > 0;
}

export class GXqueryConnector {
  private static _currentMetadata: Metadata;
  private static _queryByNameDictionary: { [key: string]: string } = {};

  private static servicePathDictionary = {
    metadata: QV_GET_METADATA_SERVICE_PATH,
    data: QV_GET_DATA_SERVICE_PATH,
    recordSetCache: QV_GET_RECORD_SET_CACHE_SERVICE_PATH
  };

  private static serviceResponseDictionary = {
    metadata: (resJson: GenericServiceResponse) =>
      (resJson as QVMetadataServiceResponse).Metadata,
    data: (resJson: GenericServiceResponse) =>
      (resJson as QVDataServiceResponse).Data,
    recordSetCache: (resJson: GenericServiceResponse) =>
      (resJson as QVRecordSetCacheServiceResponse).RecordSetCache
  };

  /**
   * Check metadata by metadata name
   */
  private static async ckeckAndUpdateMetadata(options: GxQueryOptions): Promise<{ Errors: GxError[] }> {
    const { metadataName } = options;
    if (GXqueryConnector._currentMetadata && GXqueryConnector._currentMetadata.name === metadataName) {
      return { Errors: [] };
    }
    const serviceParameters = `Name=${metadataName}`;
    const responseMetadata = await GXqueryConnector.callRESTService<GetMetadataByNameServiceResponse>(
        options,
        GET_METADATA_BY_NAME_SERVICE_PATH,
        serviceParameters,
        "GET"
      );

    if (!hasAnyError(responseMetadata)) {
      GXqueryConnector._currentMetadata = responseMetadata.Metadata;
    }
    return responseMetadata;
  }

  /**
   * Make header authentication
   * @param options: GxQueryOptions
   * @returns HeadersInit
   */
  private static makeRequestHeader(options: GxQueryOptions): HeadersInit {
    const { apiKey, saiaToken, saiaUserId } = options;
    return {
      "Content-Type": "application/json",
      "Authorization": `${apiKey}`,
      [SAIA_AUTH_HEADER]: `${saiaToken}`,
      ...(saiaUserId ? { [SAIA_USER_ID_HEADER]: `${saiaUserId}` } : {})
    };
  }

  /**
   * Calls any REST service
   */
  private static async callRESTService<T = GenericServiceResponse>(
    options: GxQueryOptions,
    service: string,
    serviceParameters: string,
    method: HttpMethod,
  ): Promise<T> {
    let serviceURL = options.baseUrl + service;
    let body: string;
    if (method === "GET" || method === "DELETE") {
      serviceURL += "?" + serviceParameters;
    } else if (method === "PUT" || method === "POST") {
      body = serviceParameters;
    }
    const headers = this.makeRequestHeader(options);
    const fetchOptions: RequestInit = {
      method: method,
      cache: "no-store",
      headers: headers,
      body: body
    };
    try {
      const response = await fetch(serviceURL, fetchOptions);
      return response.ok
        ? await response.json()
        : makeGenericError(response.status, response.statusText);
    } catch (err) {
      return Promise.reject<T>(
        makeGenericError(GENERIC_ERROR_CODE, err.message) as T
      );
    }
  }

  /**
   * Gets a query given its name
   */
  public static async getQueryByName(
    options: GxQueryOptions
  ): Promise<GetQueryByNameServiceResponse> {
    if (!options.query?.name) {
      return {
        Errors: [{ Code: 400, Message: "Attribute Query Name is required" }]
      } as GetQueryByNameServiceResponse;
    }
    const metadataStatus = await GXqueryConnector.ckeckAndUpdateMetadata(options);
    if (hasAnyError(metadataStatus)) {
      return makeResponseWithError<GetQueryByNameServiceResponse>(metadataStatus, { Query: undefined });
    }
    const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.id}&Name=${options.query.name}`;
    const serviceResponse = await GXqueryConnector.callRESTService(
      options,
      GET_QUERY_BY_NAME_SERVICE_PATH,
      serviceParameters,
      "GET"
    );
    if (!hasAnyError(serviceResponse)) {
      const query = (serviceResponse as GetQueryByNameServiceResponse).Query;
      GXqueryConnector._queryByNameDictionary[query.name.toLowerCase()] =
        query.id;
    }
    return serviceResponse as GetQueryByNameServiceResponse;
  }

  /**
   * Calls a QueryViewer service (data, metadata, etc)
   */
  public static async callQueryViewerService(
    options: GxQueryOptions,
    serviceType: ServiceType,
    postInfo: string
  ) {
    const queryId = await GXqueryConnector.getQueryId(options);
    const serviceParameters = {
      MetadataId: GXqueryConnector._currentMetadata.id,
      QueryId: queryId,
      PostInfoJSON: postInfo
    };
    const resJson = await GXqueryConnector.callRESTService(
      options,
      GXqueryConnector.servicePathDictionary[serviceType],
      JSON.stringify(serviceParameters),
      "POST"
    );

    if (!hasAnyError(resJson)) {
      const serviceResponse =
        GXqueryConnector.serviceResponseDictionary[serviceType](resJson);
      return serviceResponse || "";
    } else {
      throw new Error(resJson.Errors[0].Message);
    }
  }

  /**
   * Get the query Id
   */
  private static async getQueryId(options: GxQueryOptions): Promise<string> {
    const { query } = options;
    if (query && query.id) {
      return query.id;
    }
    const queryId =
      GXqueryConnector._queryByNameDictionary[query.name.toLowerCase()];
    if (queryId) {
      return queryId;
    }
    const queryByNameResponse = await GXqueryConnector.getQueryByName(options);
    return !hasAnyError(queryByNameResponse)
      ? (queryByNameResponse as GetQueryByNameServiceResponse).Query.id
      : "";
  }

  /**
   * Get list of queries
   */
  public static async getQueryList(
    options: GxQueryOptions
  ): Promise<GetQueryListServiceResponse> {
    const metadataStatus = await GXqueryConnector.ckeckAndUpdateMetadata(options);
    if (hasAnyError(metadataStatus)) {
      return makeResponseWithError<GetQueryListServiceResponse>(metadataStatus, { Queries: undefined });
    }
    const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.id}`;
    const serviceResponse = await GXqueryConnector.callRESTService(
      options,
      GET_LIST_QUERY_SERVICE_PATH,
      serviceParameters,
      "GET",
    );
    return serviceResponse as GetQueryListServiceResponse;
  }

  /**
   * Set a new name for a query
   * @param options service options
   * @returns Service response
   */
  public static async renameQuery(
    options: GxQueryOptions
  ): Promise<RenameQueryServiceResponse> {
    const metadataStatus = await GXqueryConnector.ckeckAndUpdateMetadata(options);
    if (hasAnyError(metadataStatus)) {
      return metadataStatus;
    }
    const { query } = options;
    const payload = {
      MetadataId: GXqueryConnector._currentMetadata.id,
      Id: query.id,
      PropertyName: "name",
      PropertyValue: query.name
    };
    const serviceResponse =
      await GXqueryConnector.callRESTService<RenameQueryServiceResponse>(
        options,
        RENAME_QUERY_SERVICE_PATH,
        JSON.stringify(payload),
        "PUT"
      );
    return (
      serviceResponse.hasOwnProperty("Errors")
        ? serviceResponse
        : makeResponseWithError(serviceResponse)
    ) as RenameQueryServiceResponse;
  }

  /**
   * Delete an existing query
   * @param options service options
   * @returns Service response
   */
  public static async deleteQuery(
    options: GxQueryOptions
  ): Promise<DeleteQueryServiceResponse> {
    const metadataStatus = await GXqueryConnector.ckeckAndUpdateMetadata(options);
    if (hasAnyError(metadataStatus)) {
      return metadataStatus;
    }
    const { query } = options;
    const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.id}&Id=${query.id}`;
    const serviceResponse =
      await GXqueryConnector.callRESTService<DeleteQueryServiceResponse>(
        options,
        DELETE_QUERY_SERVICE_PATH,
        serviceParameters,
        "DELETE"
      );
    return (
      serviceResponse.hasOwnProperty("Errors")
        ? serviceResponse
        : { Errors: serviceResponse }
    ) as DeleteQueryServiceResponse;
  }
  /**
   * Save or update a query
   */
  public static async updateQuery(
    options: GxQueryOptions
  ): Promise<UpdateQueryServiceResponse> {
    const metadataStatus = await GXqueryConnector.ckeckAndUpdateMetadata(options);
    if (hasAnyError(metadataStatus)) {
      return metadataStatus.Errors;
    }
    const payload: UpdateQueryServiceInput = {
      Query: options.query,
      MetadataId: GXqueryConnector._currentMetadata.id
    };
    const serviceResponse =
      await GXqueryConnector.callRESTService<UpdateQueryServiceResponse>(
        options,
        UPDATE_QUERY_SERVICE_PATH,
        JSON.stringify(payload),
        "PUT"
      );
    return serviceResponse;
  }
  /**
   * Create a new query without save it in the database
   */
  public static async newInput(
    options: GxQueryOptions,
    messages: ChatMessage[]
  ): Promise<NewQueryServiceResponse> {
    const metadataStatus = await GXqueryConnector.ckeckAndUpdateMetadata(options);
    if (hasAnyError(metadataStatus)) {
      return makeResponseWithError<NewQueryServiceResponse>(metadataStatus, { Query: undefined });
    }
    const payload = {
      ChatMessages: messages,
      MetadataId: GXqueryConnector._currentMetadata.id
    };
    const serviceResponse =
      await GXqueryConnector.callRESTService<NewQueryServiceResponse>(
        options,
        NEW_QUERY_SERVICE_PATH,
        JSON.stringify(payload),
        "POST"
      );
    return serviceResponse;
  }

  /**
   * Create a new query without save it in the database
   */
  public static async getQueryDataMetadataByMessage(
    options: GxQueryOptions,
    messages: ChatMessage[]
  ): Promise<QueryDataMetadataServiceResponse> {
    const metadataStatus = await GXqueryConnector.ckeckAndUpdateMetadata(options);
    if (hasAnyError(metadataStatus)) {
      return makeResponseWithError<QueryDataMetadataServiceResponse>(metadataStatus, {
        Query: undefined,
        Data: undefined,
        Metadata: undefined
      });
    }
    const payloadQuery = {
      ChatMessages: messages,
      MetadataId: GXqueryConnector._currentMetadata.id
    };
    const queryResponse =
      await GXqueryConnector.callRESTService<NewQueryServiceResponse>(
        options,
        NEW_QUERY_SERVICE_PATH,
        JSON.stringify(payloadQuery),
        "POST"
      );

    const payload = {
      QueryId: queryResponse.Query.id,
      MetadataId: GXqueryConnector._currentMetadata.id
    };

    const dataResponse =
      GXqueryConnector.callRESTService<QVDataServiceResponse>(
        options,
        QV_GET_DATA_SERVICE_PATH,
        JSON.stringify(payload),
        "POST",
      );

    const metadataResponse =
      GXqueryConnector.callRESTService<QVMetadataServiceResponse>(
        options,
        QV_GET_METADATA_SERVICE_PATH,
        JSON.stringify(payload),
        "POST",
      );

    const [{ Data }, { Metadata }] = await Promise.all([
      dataResponse,
      metadataResponse
    ]);

    return { Data, Metadata, Query: queryResponse.Query, Errors: [] };
  }

  /**
   * Create a new query without save it in the database
   */
  public static async getQueryDataMetadataByQueryName(
    options: GxQueryOptions
  ): Promise<QueryDataMetadataServiceResponse> {
    const metadataStatus = await GXqueryConnector.ckeckAndUpdateMetadata(options);
    if (hasAnyError(metadataStatus)) {
      return makeResponseWithError<QueryDataMetadataServiceResponse>(metadataStatus, {
        Query: undefined,
        Data: undefined,
        Metadata: undefined
      });
    }
    const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.id}&Name=${options.query?.name}`;
    const queryResponse =
      await GXqueryConnector.callRESTService<GetQueryByNameServiceResponse>(
        options,
        GET_QUERY_BY_NAME_SERVICE_PATH,
        serviceParameters,
        "GET"
      );

    const payload = {
      QueryId: queryResponse.Query.id,
      MetadataId: GXqueryConnector._currentMetadata.id
    };
    const dataResponse =
      await GXqueryConnector.callRESTService<QVDataServiceResponse>(
        options,
        QV_GET_DATA_SERVICE_PATH,
        JSON.stringify(payload),
        "POST"
      );

    const metadataResponse =
      await GXqueryConnector.callRESTService<QVMetadataServiceResponse>(
        options,
        QV_GET_METADATA_SERVICE_PATH,
        JSON.stringify(payload),
        "POST"
      );

    return {
      Data: dataResponse.Data,
      Metadata: metadataResponse.Metadata,
      Query: queryResponse.Query,
      Errors: []
    };
  }
}
