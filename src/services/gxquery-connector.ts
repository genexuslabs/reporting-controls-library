import { ServiceType } from "../common/basic-types";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const API_VERSION_PATH = "/API/V1";
const LOGIN_SERVICE_PATH = "/Session/Login";
const GET_METADATA_BY_NAME_SERVICE_PATH = "/Metadata/GetByName";
const GET_QUERY_BY_NAME_SERVICE_PATH = "/Query/GetByName";
const QV_GET_METADATA_SERVICE_PATH = "/QueryViewer/GetMetadata";
const QV_GET_DATA_SERVICE_PATH = "/QueryViewer/GetData";
const GENERIC_ERROR_CODE = -1;

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
 * Represents query in GXquery
 */
export type Query = {
  Id: string;
  Name: string;
  Description: string;
  Expression: string;
  Modified: string;
  RemoveDuplicates: boolean;
  MaxRows: string;
  TextForNullValues: string;
  OutputType: string;
  Title: string;
  ShowValues: boolean;
  ShowDataAs: string;
  Orientation: string;
  IncludeTrend: boolean;
  IncludeSparkline: boolean;
  IncludeMaxAndMin: boolean;
  ChartType: string;
  PlotSeries: string;
  XAxisLabels: string;
  XAxisIntersectionAtZero: boolean;
  XAxisTitle: string;
  YAxisTitle: string;
  MapType: string;
  Region: string;
  Continent: string;
  Country: string;
  Paging: boolean;
  PageSize: number;
  ShowDataLabelsIn: string;
  TotalForRows: string;
  TotalForColumns: string;
};

/**
 * Generic response to any GXquery API service
 */
type GenericServiceResponse = {
  Errors: { Code: number; Message: string }[];
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
  Query: Query;
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
 * This is the minimum information required to display a query from GXquery
 */
export type GXqueryOptions = {
  baseUrl: string;
  metadataName: string;
  queryName?: string;
  query?: Query;
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
    options: GXqueryOptions
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
    options: GXqueryOptions
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
  private static async callRESTService(
    service: string,
    method: HttpMethod,
    serviceParameters: string
  ): Promise<GenericServiceResponse> {
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
      body: body
    };
    try {
      const response = await fetch(serviceURL, fetchOptions);
      return response.ok
        ? await response.json()
        : makeGenericError(response.status, response.statusText);
    } catch (err) {
      return makeGenericError(GENERIC_ERROR_CODE, err.message);
    }
  }

  /**
   * Executes a login in GXquery
   */
  private static async login(): Promise<LoginServiceResponse> {
    const serviceParameters = {
      RepositoryName: "",
      UserName: "administrator",
      UserPassword: "administrator123"
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
    options: GXqueryOptions
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
    options: GXqueryOptions,
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

  private static async getQueryId(options: GXqueryOptions): Promise<string> {
    let queryId;
    if (options.queryName) {
      queryId =
        GXqueryConnector._queryByNameDictionary[
          options.queryName.toLocaleLowerCase()
        ];
      if (!queryId) {
        const resJson = await GXqueryConnector.getQueryByName(options);
        if (resJson.Errors.length === 0) {
          return resJson.Query.Id;
        } else {
          return "";
        }
      } else {
        return queryId;
      }
    } else {
      return options.query.Id;
    }
  }
}
