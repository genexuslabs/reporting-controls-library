import { QueryViewer } from "./types/json";
import { data, metaData } from "./post-info";
import { parseObjectToFormData } from "./utils/common";
import {
  GeneratorType,
  QueryViewerBase,
  ServiceType
} from "../common/basic-types";
import {
  GXqueryConnector,
  GXqueryOptions,
  GetQueryByNameServiceResponse
} from "./gxquery-connector";
import { QueryViewerServiceProperties } from "./types/service-result";

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

const queryToQueryProperties = (
  query: QueryViewerBase
): QueryViewerServiceProperties => {
  return {
    Type: query.OutputType,
    QueryTitle: query.Title,
    ShowValues: query.ShowValues,
    ShowDataAs: query.ShowDataAs,
    Orientation: query.Orientation,
    IncludeTrend: query.IncludeTrend,
    IncludeSparkline: query.IncludeSparkline,
    IncludeMaxMin: query.IncludeMaxAndMin,
    ChartType: query.ChartType,
    PlotSeries: query.PlotSeries,
    XAxisLabels: query.XAxisLabels,
    XAxisIntersectionAtZero: query.XAxisIntersectionAtZero,
    XAxisTitle: query.XAxisTitle,
    YAxisTitle: query.YAxisTitle,
    MapType: query.MapType,
    Region: query.Region,
    Continent: query.Continent,
    Country: query.Country,
    Paging: query.Paging,
    PageSize: query.PageSize,
    ShowDataLabelsIn: query.ShowDataLabelsIn,
    TotalForRows: query.TotalForRows,
    TotalForColumns: query.TotalForColumns
  };
};

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
