import { QueryViewer } from "./types/json";
import { data, metaData } from "./post-info";
import { parseObjectToFormData } from "./utils/common";
import {
  GeneratorType,
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
  GXqueryConnector,
  GXqueryOptions,
  GetQueryByNameServiceResponse,
  Query
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
  UseGXquery: boolean;
  BaseUrl: string;
  Generator: GeneratorType;
  MetadataName: string;
  ObjectName: string;
  SerializedObject: string;
};

/**
 * Necessary so that the explorer does not cache the results of the services
 * @returns Unique value with each call, using the current date
 */
const foolCache = () => new Date().getTime();

const QueryToQueryProperties = (query: Query): QueryViewerServiceProperties => {
  return {
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

const contextToGXqueryOptions = (context: ServicesContext): GXqueryOptions => {
  return {
    BaseUrl: context.BaseUrl,
    MetadataName: context.MetadataName,
    QueryName: context.ObjectName,
    Query: context.SerializedObject
      ? JSON.parse(context.SerializedObject)
      : undefined
  };
};

export const asyncGetProperties = (
  context: ServicesContext,
  callbackWhenReady: (prop: QueryViewerServiceProperties) => void
) => {
  if (!context.UseGXquery) {
    callbackWhenReady(undefined); // Not implemented
  } else if (context.ObjectName) {
    GXqueryConnector.GetQueryByName(contextToGXqueryOptions(context)).then(
      resObj => {
        const query = (resObj as GetQueryByNameServiceResponse).Query;
        const properties = QueryToQueryProperties(query);
        callbackWhenReady(properties);
      }
    );
  } else if (context.SerializedObject) {
    const query = JSON.parse(context.SerializedObject);
    const properties = QueryToQueryProperties(query);
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
  if (!context.UseGXquery) {
    const serviceURL =
      context.BaseUrl +
      GENERATOR[context.Generator] +
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
    GXqueryConnector.CallQueryViewerService(
      contextToGXqueryOptions(context),
      serviceType,
      postInfo
    ).then(str => {
      callbackWhenReady(str);
    });
  }
};
