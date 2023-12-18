import {
  QueryViewerAxisType,
  QueryViewerElementType
} from "../common/basic-types";

export type QueryViewerContextElement = {
  Name: string;
  Values: string[];
};

export type QueryViewerEventFilters = {
  Name: string;
  Values: string[];
};

export type QueryViewerItemClickData = {
  Name: string;
  Type: QueryViewerElementType;
  Axis: QueryViewerAxisType;
  Value: string;
  Selected: boolean;
  Context: QueryViewerContextElement[];
  Filters: QueryViewerEventFilters[];
};

export type QueryViewerDragAndDropData = {
  Name: string;
  Type: QueryViewerElementType;
  Axis: QueryViewerAxisType;
  Position: string;
};

export type QueryViewerItemExpandAndCollapseData = {
  Name: string;
  Value: string;
  ExpandedValues: [
    {
      Item: string;
    }
  ];
};

export type QueryViewerItemDoubleClickData = {
  Name: string;
  Type: QueryViewerElementType;
  Axis: QueryViewerAxisType;
  Value: string;
  Context: QueryViewerContextElement[];
  Filters: QueryViewerEventFilters[];
};

export type QueryViewerFilterChangedData = {
  Name: string;
  SelectedValues: {
    Item: string;
  };
};

export type PivotTableItemClick = {
  parameter: {
    QueryviewerId: number;
    Data: string;
  };
};

export type PivotTableDragAndDrop = {
  parameter: {
    QueryviewerId: number;
    Data: string;
  };
};

export type PivotTableExpandCollapse = {
  parameter: {
    Queryviewer: any;
    Data: string;
    IsCollapse: boolean;
  };
};

export type PivotTablePageChange = {
  parameter: {
    Queryviewer: any;
    Navigation: PivotTableNavigation;
  };
};

export enum PivotTableNavigation {
  OnFirstPage = "OnFirstPage",
  OnLastPage = "OnLastPage",
  OnPreviousPage = "OnPreviousPage",
  OnNextPage = "OnNextPage"
}

export type PivotTableFilterChanged = {
  parameter: {
    QueryviewerId: number;
    FilterChangedData: string;
  };
};

export type TableItemClick = PivotTableItemClick;

export type TablePageChange = PivotTablePageChange;

export type TableFilterChanged = PivotTableFilterChanged;
