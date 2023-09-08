import { ServiceType } from "../common/basic-types";
import { SERVICE_POST_INFO_MAP } from "./services-manager";
import { QueryViewer } from "./types/json";

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
 * Valid Output section properties for a Query (the values of these properties are the defaults for the same property in QueryViewer once a query is loaded in the control)
 */
export type QueryOutputProperty =
  | "OutputType"
  | "Title"
  | "ShowValues"
  | "ShowDataAs"
  | "Orientation"
  | "IncludeTrend"
  | "IncludeSparkline"
  | "IncludeMaxAndMin"
  | "ChartType"
  | "PlotSeries"
  | "XAxisLabels"
  | "XAxisIntersectionAtZero"
  | "XAxisTitle"
  | "YAxisTitle"
  | "MapType"
  | "Region"
  | "Continent"
  | "Country"
  | "Paging"
  | "PageSize"
  | "ShowDataLabelsIn"
  | "TotalForRows"
  | "TotalForColumns";

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
type GetQueryByNameServiceResponse = GenericServiceResponse & {
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

  /**
   * Starts a session in GXquery and gets the id for a metadata given its name
   */
  private static async Connect(options: GXqueryOptions) {
    GXqueryConnector._connecting = true;
    GXqueryConnector._baseUrl = options.BaseUrl;
    const resObj: GenericServiceResponse =
      await GXqueryConnector.GetMetadataByName(options.MetadataName);
    if (resObj.Errors.length === 0) {
      GXqueryConnector._connected = true;
    }
    GXqueryConnector._connecting = false;
    return resObj;
  }

  private static async CheckConnection(options: GXqueryOptions) {
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
  ) {
    let serviceURL = GXqueryConnector._baseUrl + service;
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
  private static async Login() {
    const serviceParameters = {
      RepositoryName: "",
      UserName: "administrator",
      UserPassword: "administrator123"
    };
    const resObj: GenericServiceResponse =
      await GXqueryConnector.CallRESTService(
        LOGIN_SERVICE_PATH,
        "POST",
        JSON.stringify(serviceParameters)
      );
    if (resObj.Errors.length === 0) {
      GXqueryConnector._currentSession = (
        resObj as LoginServiceResponse
      ).Session;
    }
    return resObj;
  }

  /**
   * Gets a metadata given its name
   */
  private static async GetMetadataByName(metadataName: string) {
    let resObj: GenericServiceResponse = { Errors: [] };
    if (!GXqueryConnector._currentSession) {
      resObj = await this.Login();
    }
    if (resObj.Errors.length === 0) {
      const serviceParameters = `Name=${metadataName}`;
      resObj = await GXqueryConnector.CallRESTService(
        GETMETADATABYNAME_SERVICE_PATH,
        "GET",
        serviceParameters
      );
      if (resObj.Errors.length === 0) {
        GXqueryConnector._currentMetadata = (
          resObj as GetMetadataByNameServiceResponse
        ).Metadata;
      }
    }
    return resObj;
  }

  /**
   * Gets a query given its name
   */
  private static async GetQueryByName(qViewer: QueryViewer, queryName: string) {
    let resObj: GenericServiceResponse = { Errors: [] };
    if (resObj.Errors.length === 0) {
      const serviceParameters = `MetadataId=${GXqueryConnector._currentMetadata.Id}&Name=${queryName}`;
      resObj = await GXqueryConnector.CallRESTService(
        GETQUERYBYNAME_SERVICE_PATH,
        "GET",
        serviceParameters
      );
      if (resObj.Errors.length === 0) {
        qViewer.QueryObj = (resObj as GetQueryByNameServiceResponse).Query;
      }
    }
    return resObj;
  }

  private static SetQueryViewerProperties(qViewer: QueryViewer) {
    qViewer.Properties = {
      OutputType: qViewer.QueryObj.OutputType,
      Title: qViewer.QueryObj.Title,
      ShowValues: qViewer.QueryObj.ShowValues,
      ShowDataAs: qViewer.QueryObj.ShowDataAs,
      Orientation: qViewer.QueryObj.Orientation,
      IncludeTrend: qViewer.QueryObj.IncludeTrend,
      IncludeSparkline: qViewer.QueryObj.IncludeSparkline,
      IncludeMaxAndMin: qViewer.QueryObj.IncludeMaxAndMin,
      ChartType: qViewer.QueryObj.ChartType,
      PlotSeries: qViewer.QueryObj.PlotSeries,
      XAxisLabels: qViewer.QueryObj.XAxisLabels,
      XAxisIntersectionAtZero: qViewer.QueryObj.XAxisIntersectionAtZero,
      XAxisTitle: qViewer.QueryObj.XAxisTitle,
      YAxisTitle: qViewer.QueryObj.YAxisTitle,
      MapType: qViewer.QueryObj.MapType,
      Region: qViewer.QueryObj.Region,
      Continent: qViewer.QueryObj.Continent,
      Country: qViewer.QueryObj.Country,
      Paging: qViewer.QueryObj.Paging,
      PageSize: qViewer.QueryObj.PageSize,
      ShowDataLabelsIn: qViewer.QueryObj.ShowDataLabelsIn,
      TotalForRows: qViewer.QueryObj.TotalForRows,
      TotalForColumns: qViewer.QueryObj.TotalForColumns
    };
  }

  /**
   * Calls a QueryViewer service (data, metadata, etc)
   */
  public static async CallGXqueryService(
    qViewer: QueryViewer,
    options: GXqueryOptions,
    serviceType: ServiceType
  ) {
    await GXqueryConnector.CheckConnection(options);
    let resJson: GenericServiceResponse = { Errors: [] };
    const ServicePathDictionary = {
      metadata: QVGETMETADATA_SERVICE_PATH,
      data: QVGETDATA_SERVICE_PATH
    };
    const postInfo = JSON.stringify(
      SERVICE_POST_INFO_MAP[serviceType](qViewer)
    );
    if (
      !qViewer.QueryObj ||
      (options.QueryName !== "" &&
        qViewer.QueryObj.Name !== options.QueryName) ||
      (options.QueryName === "" &&
        qViewer.QueryObj.Expression !== options.Query.Expression)
    ) {
      if (!options.QueryName) {
        qViewer.QueryObj = options.Query;
      } else {
        resJson = await GXqueryConnector.GetQueryByName(
          qViewer,
          options.QueryName
        );
      }
      GXqueryConnector.SetQueryViewerProperties(qViewer);
    }
    if (resJson.Errors.length === 0) {
      const serviceParameters = {
        MetadataId: GXqueryConnector._currentMetadata.Id,
        QueryId: qViewer.QueryObj.Id,
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
}
