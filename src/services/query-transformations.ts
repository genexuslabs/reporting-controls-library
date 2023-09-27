import { differenceInDays } from "date-fns";
import {
  GxChatMessage,
  GxQueryItem,
  Query,
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
  QueryViewerXAxisLabels
} from "../common/basic-types";
import { ChatMessage } from "./gxquery-connector";
import { QueryViewerServiceProperties } from "./types/service-result";

const queryToQueryProperties = (query: Query): QueryViewerServiceProperties => {
  return {
    Id: query.Id,
    Name: query.Name,
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

const transformGxQueryItemToQVProperties = (
  queryItem: GxQueryItem
): QueryViewerServiceProperties => {
  const query = transformGxQueryItemToQueryDto(queryItem);
  return queryToQueryProperties(query);
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

export {
  queryToQueryProperties,
  transformGxChatItemToChatMessageDto,
  transformGxQueryItemToQVProperties,
  transformGxQueryItemToQueryDto,
  transformQueryDtoListToUIData,
  transformQueryDtoToChatItem,
  transformQueryDtoToGxQueryItem
};
