import { differenceInDays } from "date-fns";
import { GxChatMessage, GxQueryItem, Query } from "../common/basic-types";
import { ChatMessage } from "./gxquery-connector";
import { QueryViewerServiceProperties } from "./types/service-result";

const createNewQuery = (query: Query): GxQueryItem => {
  const { Id, Name, Description, Modified, Expression, ...rest } = query;
  const today = Date.now();
  const modifiedDate = new Date(Modified);
  return {
    ...rest,
    Id,
    Name,
    Description,
    Modified: modifiedDate,
    Expression,
    differenceInDays: differenceInDays(today, modifiedDate)
  };
};

const transformGxQueryItemToQueryDto = (
  query: GxQueryItem,
  properties?: QueryViewerServiceProperties
): Query => {
  const { Id, Name, Description, Modified, ...rest } = query;
  delete rest.differenceInDays;
  const queryProperties = (properties || {}) as QueryViewerServiceProperties;
  return {
    ...rest,
    ...queryProperties,
    Id,
    Name,
    Description,
    Modified: Modified.toISOString()
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

const transformQueryDtoListToUIData = (
  data: Partial<Query>[]
): GxQueryItem[] => {
  return data.map(createNewQuery);
};

const transformQueryDtoToGxQueryItem = (data: Query): GxQueryItem => {
  return data?.Id ? createNewQuery(data) : undefined;
};

const transformQueryDtoToChatItem = (data: Query): GxChatMessage => {
  const { Id, Name, Expression, ...rest } = data;
  return {
    ...rest,
    id: Id,
    content: Name,
    messageType: "assistant",
    expression: Expression
  };
};

const mapGxQueryItemToChatItem = (query: GxQueryItem) => {
  const { Id, Expression, Description } = query;
  const item: GxChatMessage = {
    id: Id,
    messageType: "assistant",
    expression: Expression,
    content: Description
  };
  return item;
};

export {
  mapGxQueryItemToChatItem,
  transformGxChatItemToChatMessageDto,
  transformGxQueryItemToQueryDto,
  transformQueryDtoListToUIData,
  transformQueryDtoToChatItem,
  transformQueryDtoToGxQueryItem
};
