import { differenceInDays } from "date-fns";
import {
  ChatMessage,
  GxChatMessage,
  GxQueryItem,
  QueryViewerBase
} from "../common/basic-types";

const createNewQuery = (query: QueryViewerBase): GxQueryItem => {
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
  query: GxQueryItem
): QueryViewerBase => {
  const { Id, Name, Description, Modified, ...rest } = query;
  delete rest.differenceInDays;
  return {
    ...rest,
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
  data: Partial<QueryViewerBase>[]
): GxQueryItem[] => {
  return data.map(createNewQuery);
};

const transformQueryDtoToGxQueryItem = (data: QueryViewerBase): GxQueryItem => {
  return data?.Id ? createNewQuery(data) : undefined;
};

const transformQueryDtoToChatItem = (data: QueryViewerBase): GxChatMessage => {
  const { Id, Name, Expression, ...rest } = data;
  return {
    ...rest,
    id: Id,
    content: Name,
    messageType: "assistant",
    expression: Expression
  };
};

export {
  transformGxChatItemToChatMessageDto,
  transformGxQueryItemToQueryDto,
  transformQueryDtoListToUIData,
  transformQueryDtoToChatItem,
  transformQueryDtoToGxQueryItem
};
