import {
  GxError,
  GxQueryOptions,
  Query,
  QueryViewerBase,
  ServiceType
} from "../common/basic-types";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_VERSION_PATH = process.env.API_VERSION_PATH || "/API/V1";
const LOGIN_SERVICE_PATH = "/Session/Login";
const GET_METADATA_BY_NAME_SERVICE_PATH = "/Metadata/GetByName";
const GET_QUERY_BY_NAME_SERVICE_PATH = "/Query/GetByName";
const GET_LIST_QUERY_SERVICE_PATH = "/Query/List";
const RENAME_QUERY_SERVICE_PATH = "/Query/SetPropertyValue";
const DELETE_QUERY_SERVICE_PATH = "/Query/Delete";
const NEW_QUERY_SERVICE_PATH = "/Query/New";
const UPDATE_QUERY_SERVICE_PATH = "/Query/Update";
const QV_GET_METADATA_SERVICE_PATH = "/QueryViewer/GetMetadata";
const QV_GET_DATA_SERVICE_PATH = "/QueryViewer/GetData";
const GENERIC_ERROR_CODE = -1;
const REPOSITORY_NAME = process.env.REPOSITORY_NAME || "";
const USER_NAME = process.env.USER_NAME || "administrator";
const USER_PASSWORD = process.env.USER_PASSWORD || "administrator123";

/**
 * Represents a user session in GXquery
 */
type Session = {
  Token: string;
};

/**
 * Represents GXquery metadata
 */
type Metadata = {
  Id: string;
  Name: string;
};

/**
 * Represent GXquery chat messages
 */
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Generic response to any GXquery API service
 */
export type GenericServiceResponse = {
  Errors: GxError[];
};

/**
 * Response returned by the Login service
 */
type LoginServiceResponse = GenericServiceResponse & {
  Session: Session;
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
 * Response returned by the QueryList service
 */
export type GetQueryListServiceResponse = GenericServiceResponse & {
  Queries: Query[];
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
  Query: Query;
};

/**
 * Response returned by the New Query service
 */
export type NewQueryServiceResponse = GenericServiceResponse & {
  Query: Query;
};

/**
 * This is the minimum information required to display a query from GXquery
 */
export type GXqueryOptions = {
  baseUrl: string;
  metadataName: string;
  queryName?: string;
  query?: QueryViewerBase;
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

export class GXqueryConnector {
  private static _baseUrl: string;
  private static _connecting: boolean;
  private static _connected: boolean;
  private static _currentSession: Session;
  private static _currentMetadata: Metadata;
  private static _queryByNameDictionary: { [key: string]: string } = {};

  private static servicePathDictionary = {
    metadata: QV_GET_METADATA_SERVICE_PATH,
    data: QV_GET_DATA_SERVICE_PATH
  };

  private static serviceResponseDictionary = {
    metadata: (resJson: GenericServiceResponse) =>
      (resJson as QVMetadataServiceResponse).Metadata,
    data: (resJson: GenericServiceResponse) =>
      (resJson as QVDataServiceResponse).Data
  };

  /**
   * Starts a session in GXquery and gets the id for a metadata given its name
   */
  private static async connect(
    options: GxQueryOptions
  ): Promise<GenericServiceResponse> {
    GXqueryConnector._connecting = true;
    GXqueryConnector._baseUrl = options.baseUrl;
    const loginResponse = await GXqueryConnector.login();
    if (loginResponse.Errors.length > 0) {
      GXqueryConnector._connecting = false;
      return loginResponse;
    }
    const getMetadataByNameResponse = await GXqueryConnector.getMetadataByName(
      options.metadataName
    );
    GXqueryConnector._connected = getMetadataByNameResponse.Errors.length === 0;
    GXqueryConnector._connecting = false;
    return getMetadataByNameResponse;
  }

  /**
   * Test if connected to GXquery and connects if not
   */
  private static async checkConnection(
    options: GxQueryOptions
  ): Promise<GenericServiceResponse> {
    const NO_ERRORS_RESPONSE: GenericServiceResponse = { Errors: [] };
    if (GXqueryConnector._connected) {
      return NO_ERRORS_RESPONSE;
    }
    if (!GXqueryConnector._connecting) {
      return await GXqueryConnector.connect(options);
    }
    do {
      await GXqueryConnector.sleep(1000);
    } while (!GXqueryConnector._connected);
    return NO_ERRORS_RESPONSE;
  }

  private static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calls any REST service
   */
  private static async callRESTService<T = GenericServiceResponse>(
    service: string,
    method: HttpMethod,
    serviceParameters: string
  ): Promise<T> {
    let serviceURL = GXqueryConnector._baseUrl + API_VERSION_PATH + service;
    let body: string;
    if (method === "GET" || method === "DELETE") {
      serviceURL += "?" + serviceParameters;
    } else if (method === "PUT" || method === "POST") {
      body = serviceParameters;
    }
    const headers: HeadersInit = GXqueryConnector._currentSession
      ? {
          "Content-Type": "application/json",
          "Authorization": "OAuth " + GXqueryConnector._currentSession.Token
        }
      : {
          "Content-Type": "application/json"
        };
    const fetchOptions: RequestInit = {
      method: method,
      cache: "no-store",
      headers: headers,
      body
    };
    try {
      const response = await fetch(serviceURL, fetchOptions);
      if (!response?.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    } catch (err) {
      return Promise.reject<T>(
        makeGenericError(GENERIC_ERROR_CODE, err.message) as T
      );
    }
  }

  /**
   * Executes a login in GXquery
   */
  private static async login(): Promise<LoginServiceResponse> {
    const serviceParameters = {
      RepositoryName: REPOSITORY_NAME,
      UserName: USER_NAME,
      UserPassword: USER_PASSWORD
    };
    const resObj = (await GXqueryConnector.callRESTService(
      LOGIN_SERVICE_PATH,
      "POST",
      JSON.stringify(serviceParameters)
    )) as LoginServiceResponse;
    if (resObj.Errors.length === 0) {
      GXqueryConnector._currentSession = resObj.Session;
    }
    return resObj;
  }

  /**
   * Gets a metadata given its name
   */
  private static async getMetadataByName(
    metadataName: string
  ): Promise<GetMetadataByNameServiceResponse> {
    const serviceParameters = `Name=${metadataName}`;
    const resObj = (await GXqueryConnector.callRESTService(
      GET_METADATA_BY_NAME_SERVICE_PATH,
      "GET",
      serviceParameters
    )) as GetMetadataByNameServiceResponse;
    if (resObj.Errors.length === 0) {
      GXqueryConnector._currentMetadata = resObj.Metadata;
    }
    return resObj;
  }

  /**
   * Gets a query given its name
   */
  public static async getQueryByName(
    options: GxQueryOptions
  ): Promise<GetQueryByNameServiceResponse> {
    const connectionStatus = await GXqueryConnector.checkConnection(options);
    if (connectionStatus.Errors.length > 0) {
      return { Query: undefined, Errors: connectionStatus.Errors };
    }
    const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.Id}&Name=${options.queryName}`;
    const serviceResponse = await GXqueryConnector.callRESTService(
      GET_QUERY_BY_NAME_SERVICE_PATH,
      "GET",
      serviceParameters
    );
    if (serviceResponse.Errors.length === 0) {
      const query = (serviceResponse as GetQueryByNameServiceResponse).Query;
      GXqueryConnector._queryByNameDictionary[query.Name.toLowerCase()] =
        query.Id;
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
    let resJson = await GXqueryConnector.checkConnection(options);
    if (resJson.Errors.length === 0) {
      const queryId = await GXqueryConnector.getQueryId(options);
      const serviceParameters = {
        MetadataId: GXqueryConnector._currentMetadata.Id,
        QueryId: queryId,
        PostInfoJSON: postInfo
      };
      resJson = await GXqueryConnector.callRESTService(
        GXqueryConnector.servicePathDictionary[serviceType],
        "POST",
        JSON.stringify(serviceParameters)
      );
    }
    if (resJson.Errors.length === 0) {
      const serviceResponse =
        GXqueryConnector.serviceResponseDictionary[serviceType](resJson);
      return serviceResponse || "";
    } else {
      throw new Error(resJson.Errors[0].Message);
    }
  }

  private static async getQueryId(options: GxQueryOptions): Promise<string> {
    if (!options.queryName) {
      return options.query.Id;
    }
    const queryId =
      GXqueryConnector._queryByNameDictionary[options.queryName.toLowerCase()];
    if (queryId) {
      return queryId;
    }
    const queryByNameResponse = await GXqueryConnector.getQueryByName(options);
    return queryByNameResponse.Errors.length === 0
      ? (queryByNameResponse as GetQueryByNameServiceResponse).Query.Id
      : "";
  }

  /**
   * Get list of queries
   */
  public static async getQueryList(
    options: GxQueryOptions
  ): Promise<GetQueryListServiceResponse> {
    const connectionStatus = await GXqueryConnector.checkConnection(options);
    if (connectionStatus.Errors.length > 0) {
      return { Queries: undefined, Errors: connectionStatus.Errors };
    }
    const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.Id}`;
    const serviceResponse = await GXqueryConnector.callRESTService(
      GET_LIST_QUERY_SERVICE_PATH,
      "GET",
      serviceParameters
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
    const connectionStatus = await GXqueryConnector.checkConnection(options);
    if (connectionStatus.Errors.length > 0) {
      return connectionStatus;
    }
    const { query } = options;
    const payload = {
      MetadataId: GXqueryConnector._currentMetadata.Id,
      Id: query.Id,
      PropertyName: "Name",
      PropertyValue: query.Name
    };
    const serviceResponse =
      await GXqueryConnector.callRESTService<RenameQueryServiceResponse>(
        RENAME_QUERY_SERVICE_PATH,
        "PUT",
        JSON.stringify(payload)
      );
    return (
      serviceResponse.hasOwnProperty("Errors")
        ? serviceResponse
        : { Errors: serviceResponse }
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
    const connectionStatus = await GXqueryConnector.checkConnection(options);
    if (connectionStatus.Errors.length > 0) {
      return connectionStatus as DeleteQueryServiceResponse;
    }
    const { query } = options;
    const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.Id}&Id=${query.Id}`;
    const serviceResponse =
      await GXqueryConnector.callRESTService<DeleteQueryServiceResponse>(
        DELETE_QUERY_SERVICE_PATH,
        "DELETE",
        serviceParameters
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
    const connectionStatus = await GXqueryConnector.checkConnection(options);
    if (connectionStatus.Errors.length > 0) {
      return connectionStatus.Errors;
    }
    const payload: UpdateQueryServiceInput = {
      Query: options.query,
      MetadataId: GXqueryConnector._currentMetadata.Id
    };
    const serviceResponse =
      await GXqueryConnector.callRESTService<UpdateQueryServiceResponse>(
        UPDATE_QUERY_SERVICE_PATH,
        "PUT",
        JSON.stringify(payload)
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
    const connectionStatus = await GXqueryConnector.checkConnection(options);
    if (connectionStatus.Errors.length > 0) {
      return { Query: undefined, Errors: connectionStatus.Errors };
    }
    const payload = {
      ChatMessages: messages,
      MetadataId: GXqueryConnector._currentMetadata.Id
    };
    const serviceResponse =
      await GXqueryConnector.callRESTService<NewQueryServiceResponse>(
        NEW_QUERY_SERVICE_PATH,
        "POST",
        JSON.stringify(payload)
      );
    return serviceResponse;
  }
}
