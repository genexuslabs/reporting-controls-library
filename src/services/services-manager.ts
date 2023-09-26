import { QueryViewer } from "./types/json";
import { data, metaData } from "./post-info";
import { parseObjectToFormData } from "./utils/common";
import {
  GeneratorType,
  QueryViewerBase,
  ServiceType
} from "../common/basic-types";
import { GXqueryConnector, GXqueryOptions } from "./gxquery-connector";
import {
  QueryViewerServiceData,
  QueryViewerServiceMetaData,
  QueryViewerServiceProperties
} from "./types/service-result";
import { parseMetadataXML } from "./xml-parser/metadata-parser";
import { parseDataXML } from "./xml-parser/data-parser";

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
  queryViewerBaseProperties?: QueryViewerServiceProperties
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

function getQueryPropertiesInGXQuery(
  servicesInfo: ServicesContext,
  callbackWhenReady: (
    queryViewerBaseProperties: QueryViewerServiceProperties
  ) => void
) {
  if (servicesInfo.objectName) {
    GXqueryConnector.getQueryByName(contextToGXqueryOptions(servicesInfo)).then(
      queryByNameResponse => {
        const query = queryByNameResponse.Query;
        const properties = queryToQueryProperties(query);
        callbackWhenReady(properties);
      }
    );
  } else if (servicesInfo.serializedObject) {
    const query = JSON.parse(servicesInfo.serializedObject);
    const properties = queryToQueryProperties(query);
    callbackWhenReady(properties);
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
