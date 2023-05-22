import { QueryViewer } from "./types/json";
import { data, metaData } from "./post-info";
import { parseObjectToFormData } from "./utils/common";
import { GeneratorType, ServiceType } from "../common/basic-types";

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

const SERVICE_POST_INFO_MAP: {
  [key in ServiceType]: (qViewer: QueryViewer) => any;
} = {
  metadata: metaData,
  data: data
};

/**
 * Necessary so that the explorer does not cache the results of the services
 * @returns Unique value with each call, using the current date
 */
const foolCache = () => new Date().getTime();

export const asyncServerCall = (
  qViewer: QueryViewer,
  baseUrl: string,
  environment: GeneratorType,
  serviceType: ServiceType,
  callbackWhenReady: (xml: string) => void
) => {
  const serviceURL =
    baseUrl +
    GENERATOR[environment] +
    SERVICE_NAME_MAP[serviceType] +
    "," +
    foolCache();

  const postInfo = parseObjectToFormData(
    SERVICE_POST_INFO_MAP[serviceType](qViewer)
  );

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
};
