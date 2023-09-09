import { ServiceType } from "../common/basic-types";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const LOGIN_SERVICE_PATH = "/Session/Login";
const GETMETADATABYNAME_SERVICE_PATH = "/Metadata/GetByName";
const GETQUERYBYNAME_SERVICE_PATH = "/Query/GetByName";
const QVGETMETADATA_SERVICE_PATH = "/QueryViewer/GetMetadata";
const QVGETDATA_SERVICE_PATH = "/QueryViewer/GetData";

/**
 * Options for the javascript fetch API
 */
type FetchOptions = {
  method: HttpMethod;
  cache: RequestCache;
  headers: { [key: string]: string };
  body: string;
};

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
  Errors: [{ Code: number; Message: string }?];
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
  BaseUrl: string;
  MetadataName: string;
  QueryName?: string;
  Query?: Query;
};

export class GXqueryConnector {
  private static _baseUrl: string;
  private static _connecting: boolean;
  private static _connected: boolean;
  private static _currentSession: Session;
  private static _currentMetadata: Metadata;
  private static _queryByNameDictionary: { [key: string]: string } = {};

  /**
   * Starts a session in GXquery and gets the id for a metadata given its name
   */
  private static async Connect(
    options: GXqueryOptions
  ): Promise<GenericServiceResponse> {
    GXqueryConnector._connecting = true;
    GXqueryConnector._baseUrl = options.BaseUrl;
    let resObj = (await GXqueryConnector.Login()) as GenericServiceResponse;
    if (resObj.Errors.length === 0) {
      resObj = await GXqueryConnector.GetMetadataByName(options.MetadataName);
      if (resObj.Errors.length === 0) {
        GXqueryConnector._connected = true;
      }
    }
    GXqueryConnector._connecting = false;
    return resObj;
  }

  /**
   * Test if connected to GXquery and connects if not
   */
  private static async CheckConnection(
    options: GXqueryOptions
  ): Promise<GenericServiceResponse> {
    let resObj: GenericServiceResponse;
    if (GXqueryConnector._connected) {
      resObj = { Errors: [] };
    } else if (!GXqueryConnector._connecting) {
      resObj = await GXqueryConnector.Connect(options);
    } else {
      do {
        await GXqueryConnector.Sleep(1000);
      } while (!GXqueryConnector._connected);
      resObj = { Errors: [] };
    }
    return resObj;
  }

  private static Sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calls any REST service
   */
  private static async CallRESTService(
    service: string,
    method: HttpMethod,
    serviceParameters: string
  ): Promise<GenericServiceResponse> {
    let serviceURL = GXqueryConnector._baseUrl + "/API/V1" + service;
    let body: string;
    if (method === "GET" || method === "DELETE") {
      serviceURL += "?" + serviceParameters;
    } else if (method === "PUT" || method === "POST") {
      body = serviceParameters;
    }
    const fetchOptions: FetchOptions = {
      method: method,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json"
      },
      body: body
    };
    if (GXqueryConnector._currentSession) {
      fetchOptions.headers.Authorization =
        "OAuth " + GXqueryConnector._currentSession.Token;
    }
    let resObj: GenericServiceResponse;
    try {
      const response = await fetch(serviceURL, fetchOptions);
      if (response.ok) {
        resObj = await response.json();
      } else {
        resObj = {
          Errors: [{ Code: response.status, Message: response.statusText }]
        };
      }
    } catch (err) {
      resObj = { Errors: [{ Code: -1, Message: err.message }] };
    }
    return resObj;
  }

  /**
   * Executes a login in GXquery
   */
  private static async Login(): Promise<LoginServiceResponse> {
    const serviceParameters = {
      RepositoryName: "",
      UserName: "administrator",
      UserPassword: "administrator123"
    };
    const resObj = (await GXqueryConnector.CallRESTService(
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
  private static async GetMetadataByName(
    metadataName: string
  ): Promise<GetMetadataByNameServiceResponse> {
    const serviceParameters = `Name=${metadataName}`;
    const resObj = (await GXqueryConnector.CallRESTService(
      GETMETADATABYNAME_SERVICE_PATH,
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
  public static async GetQueryByName(
    options: GXqueryOptions
  ): Promise<GetQueryByNameServiceResponse> {
    let resObj = await GXqueryConnector.CheckConnection(options);
    if (resObj.Errors.length === 0) {
      const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.Id}&Name=${options.QueryName}`;
      resObj = (await GXqueryConnector.CallRESTService(
        GETQUERYBYNAME_SERVICE_PATH,
        "GET",
        serviceParameters
      )) as GetQueryByNameServiceResponse;
      if (resObj.Errors.length === 0) {
        const query = (resObj as GetQueryByNameServiceResponse).Query;
        GXqueryConnector._queryByNameDictionary[query.Name.toLowerCase()] =
          query.Id;
      }
    }
    return resObj as GetQueryByNameServiceResponse;
  }

  /**
   * Calls a QueryViewer service (data, metadata, etc)
   */
  public static async CallQueryViewerService(
    options: GXqueryOptions,
    serviceType: ServiceType,
    postInfo: string
  ) {
    let resJson = await GXqueryConnector.CheckConnection(options);
    if (resJson.Errors.length === 0) {
      const ServicePathDictionary = {
        metadata: QVGETMETADATA_SERVICE_PATH,
        data: QVGETDATA_SERVICE_PATH
      };
      const queryId = await GXqueryConnector.GetQueryId(options);
      const serviceParameters = {
        MetadataId: GXqueryConnector._currentMetadata.Id,
        QueryId: queryId,
        PostInfoJSON: postInfo
      };
      resJson = await GXqueryConnector.CallRESTService(
        ServicePathDictionary[serviceType],
        "POST",
        JSON.stringify(serviceParameters)
      );
    }
    if (resJson.Errors.length === 0) {
      const serviceResponseDictionary = {
        metadata: (resJson: GenericServiceResponse) =>
          (resJson as QVMetadataServiceResponse).Metadata,
        data: (resJson: GenericServiceResponse) =>
          (resJson as QVDataServiceResponse).Data
      };
      const serviceResponse = serviceResponseDictionary[serviceType](resJson);
      return serviceResponse || "";
    } else {
      throw new Error(resJson.Errors[0].Message);
    }
  }

  private static async GetQueryId(options: GXqueryOptions): Promise<string> {
    let queryId;
    if (options.QueryName) {
      queryId =
        GXqueryConnector._queryByNameDictionary[
          options.QueryName.toLocaleLowerCase()
        ];
      if (!queryId) {
        const resJson = await GXqueryConnector.GetQueryByName(options);
        if (resJson.Errors.length === 0) {
          return resJson.Query.Id;
        } else {
          return "";
        }
      } else {
        return queryId;
      }
    } else {
      return options.Query.Id;
    }
  }
}
