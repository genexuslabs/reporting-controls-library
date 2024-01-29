import { differenceInDays } from "date-fns";
import { ChatMessage, GxChatMessage, GxQueryItem, QueryViewerBase, QueryViewerOutputType } from "../../common/basic-types";
import { QueryViewer, QueryViewerCard } from "../types/json";

type QueryViewerOptions = {
  applicationNamespace: string;
  allowElementsOrderChange: boolean;
  returnSampleData: boolean;
  translationType: string;
};

const createNewQuery = (query: QueryViewerBase): GxQueryItem => {
  const { id, name, description, expression, ...rest } = query;
  const today = Date.now();
  const modifiedDate = new Date(rest.modified);
  return {
    ...rest,
    id,
    name,
    modified: modifiedDate,
    description,
    expression,
    differenceInDays: differenceInDays(today, modifiedDate)
  };
};

const transformGxQueryItemToQueryDto = (
  query: GxQueryItem
): QueryViewerBase => {
  const { id, name, description, ...rest } = query;
  delete rest.differenceInDays;
  return {
    ...rest,
    id,
    name,
    modified: rest.modified.toISOString(),
    description
  };
};

const transformGxChatItemToChatMessageDto = (
  query: GxChatMessage
): ChatMessage => {
  const { messageType: role, content, expression } = query;
  return {
    role,
    content: role === "user" ? content : expression
  };
};

const transformQueryDtoListToUIData = (data: Partial<QueryViewerBase>[]): GxQueryItem[] =>
  data.map(createNewQuery);

const transformQueryDtoToGxQueryItem = (data: QueryViewerBase): GxQueryItem =>
  data?.id ? createNewQuery(data) : undefined;

const transformQueryDtoToChatItem = (data: QueryViewerBase): GxChatMessage => {
  const { id, name, expression, ...rest } = data;
  return {
    ...rest,
    id,
    content: name,
    messageType: "assistant",
    expression: expression
  };
};

const defaultOptions: QueryViewerOptions = {
  applicationNamespace: "",
  allowElementsOrderChange: false,
  returnSampleData: false,
  translationType: "None"
};
const transformQueryViewerBaseToQueryViewer = (
  query: QueryViewerBase,
  options: QueryViewerOptions = defaultOptions
): QueryViewer => {
  const queryViewerObject: QueryViewer = {
    ApplicationNamespace: options.applicationNamespace,
    AllowElementsOrderChange: options.allowElementsOrderChange, // @todo
    Axes: undefined, // @todo Add Axes support
    ObjectName: query.name,
    Parameters: [], // @todo Add Parameters support
    RealType: query.outputType,
    ReturnSampleData: options.returnSampleData, // @todo
    TranslationType: options.translationType, // @todo
    UseRecordsetCache: [
      QueryViewerOutputType.PivotTable,
      QueryViewerOutputType.Table
    ].includes(query.outputType),
  };

  if (query.outputType === QueryViewerOutputType.Card) {
    (queryViewerObject as QueryViewerCard)["IncludeTrend"] = query.includeTrend;

    (queryViewerObject as QueryViewerCard)["IncludeSparkline"] = query.includeSparkline;
  }

  return queryViewerObject;
}

export {
  transformGxChatItemToChatMessageDto,
  transformGxQueryItemToQueryDto,
  transformQueryDtoListToUIData,
  transformQueryDtoToChatItem,
  transformQueryDtoToGxQueryItem,
  transformQueryViewerBaseToQueryViewer
};

