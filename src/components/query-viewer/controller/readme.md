# gx-query-viewer-controller



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                     | Description                                                                                                                                                                                                                                                                                        | Type                                                                                                                                                                                                                              | Default     |
| -------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `allowElementsOrderChange` | `allow-elements-order-change` |                                                                                                                                                                                                                                                                                                    | `boolean`                                                                                                                                                                                                                         | `false`     |
| `apiKey`                   | `api-key`                     | This is GxQuery authentication key. It will required when property useGxQuery = true                                                                                                                                                                                                               | `string`                                                                                                                                                                                                                          | `""`        |
| `applicationNamespace`     | `application-namespace`       | Determines the application namespace where the program is generated and compiled.                                                                                                                                                                                                                  | `string`                                                                                                                                                                                                                          | `undefined` |
| `baseUrl`                  | `base-url`                    | API base URL                                                                                                                                                                                                                                                                                       | `string`                                                                                                                                                                                                                          | `""`        |
| `chartType`                | `chart-type`                  | When `type == Chart`, specifies the chart type: Bar, Pie, Timeline, etc...                                                                                                                                                                                                                         | `QueryViewerChartType`                                                                                                                                                                                                            | `undefined` |
| `environment`              | `environment`                 | Environment of the project: java or net                                                                                                                                                                                                                                                            | `"java" \| "net"`                                                                                                                                                                                                                 | `"net"`     |
| `includeSparkline`         | `include-sparkline`           | Include sparkline                                                                                                                                                                                                                                                                                  | `boolean`                                                                                                                                                                                                                         | `false`     |
| `includeTrend`             | `include-trend`               | If true includes trend on the graph                                                                                                                                                                                                                                                                | `boolean`                                                                                                                                                                                                                         | `false`     |
| `metadataId`               | `metadata-id`                 | This is the ID of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true. In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property) | `string`                                                                                                                                                                                                                          | `undefined` |
| `objectName`               | `object-name`                 | Name of the Query or Data provider assigned                                                                                                                                                                                                                                                        | `string`                                                                                                                                                                                                                          | `undefined` |
| `orientation`              | `orientation`                 | Specified the orientation when have more than one card                                                                                                                                                                                                                                             | `QueryViewerOrientation.Horizontal \| QueryViewerOrientation.Vertical`                                                                                                                                                            | `undefined` |
| `pageSize`                 | `page-size`                   | If paging true, number of items for a single page                                                                                                                                                                                                                                                  | `number`                                                                                                                                                                                                                          | `undefined` |
| `paging`                   | `paging`                      | If type == PivotTable or Table, if true there is paging, else everything in one table                                                                                                                                                                                                              | `boolean`                                                                                                                                                                                                                         | `undefined` |
| `queryTitle`               | `query-title`                 | Title of the QueryViewer                                                                                                                                                                                                                                                                           | `string`                                                                                                                                                                                                                          | `undefined` |
| `rememberLayout`           | `remember-layout`             | For timeline for remembering layout                                                                                                                                                                                                                                                                | `boolean`                                                                                                                                                                                                                         | `true`      |
| `returnSampleData`         | `return-sample-data`          |                                                                                                                                                                                                                                                                                                    | `boolean`                                                                                                                                                                                                                         | `false`     |
| `saiaToken`                | `saia-token`                  | This is GxQuery Saia Token. It will required when property useGxQuery = true                                                                                                                                                                                                                       | `string`                                                                                                                                                                                                                          | `""`        |
| `saiaUserId`               | `saia-user-id`                | This is GxQuery Saia User ID (optional). It will use when property useGxQuery = true                                                                                                                                                                                                               | `string`                                                                                                                                                                                                                          | `""`        |
| `serializedObject`         | `serialized-object`           | Use this property to pass a query obtained from GXquery, when useGxquery = true (ignored if objectName is specified, because this property has a greater precedence)                                                                                                                               | `string`                                                                                                                                                                                                                          | `undefined` |
| `showDataLabelsIn`         | `show-data-labels-in`         | Ax to show data labels                                                                                                                                                                                                                                                                             | `QueryViewerShowDataLabelsIn.Columns \| QueryViewerShowDataLabelsIn.Rows`                                                                                                                                                         | `undefined` |
| `totalForColumns`          | `total-for-columns`           | True if grand total is shown for all table columns                                                                                                                                                                                                                                                 | `QueryViewerTotal.No \| QueryViewerTotal.Yes`                                                                                                                                                                                     | `undefined` |
| `totalForRows`             | `total-for-rows`              | True if grand total is shown for all table rows                                                                                                                                                                                                                                                    | `QueryViewerTotal.No \| QueryViewerTotal.Yes`                                                                                                                                                                                     | `undefined` |
| `translationType`          | `translation-type`            |                                                                                                                                                                                                                                                                                                    | `string`                                                                                                                                                                                                                          | `"None"`    |
| `type`                     | `type`                        | Type of the QueryViewer: Table, PivotTable, Chart, Card                                                                                                                                                                                                                                            | `QueryViewerOutputType.Card \| QueryViewerOutputType.Chart \| QueryViewerOutputType.Default \| QueryViewerOutputType.Map \| QueryViewerOutputType.PivotTable \| QueryViewerOutputType.Pivot_Table \| QueryViewerOutputType.Table` | `undefined` |
| `useGxquery`               | `use-gxquery`                 | True to tell the controller to connect use GXquery as a queries repository                                                                                                                                                                                                                         | `boolean`                                                                                                                                                                                                                         | `undefined` |


## Events

| Event                                  | Description                                                                                            | Type                                                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attributesValuesForTable`             | Fired when new page data is ready to use in the Table                                                  | `CustomEvent<string>`                                                                                                                               |
| `attributeValuesForPivotTable`         | Fired when new page data is ready to use in the PivotTable                                             | `CustomEvent<string>`                                                                                                                               |
| `calculatePivottableData`              | Fired when new page data is ready to use in the PivotTable                                             | `CustomEvent<string>`                                                                                                                               |
| `itemClickPivotTable`                  | ItemClickEvent, executes actions when this event is triggered after clicking on a pivot table element. | `CustomEvent<string>`                                                                                                                               |
| `pageDataForPivotTable`                | Fired when new page data is ready to use in the PivotTable                                             | `CustomEvent<string>`                                                                                                                               |
| `pageDataForTable`                     | Fired when new page data is ready to use in the PivotTable                                             | `CustomEvent<string>`                                                                                                                               |
| `queryViewerServiceResponse`           | Fired when new metadata and data is fetched                                                            | `CustomEvent<{ MetaData: QueryViewerServiceMetaData; Data: QueryViewerServiceData; XML: QueryViewerServiceXML; Properties: QueryViewerBase; }>`     |
| `queryViewerServiceResponsePivotTable` | Fired when new metadata and data is fetched                                                            | `CustomEvent<{ MetaData: QueryViewerServiceMetaData; metadataXML: string; Properties: QueryViewerBase; objectName: string; useGxQuery: boolean; }>` |
| `syncPivotTableData`                   | Fired when data is ready to use in the PivotTable                                                      | `CustomEvent<string>`                                                                                                                               |


## Methods

### `getAttributeValues(properties: QueryViewerAttributesValuesForPivot) => Promise<void>`

PivotTable's Method for Attributes Values

#### Returns

Type: `Promise<void>`



### `getCalculatePivottableData(properties: QueryViewerCalculatePivottableData) => Promise<void>`

PivotTable's Method for Calculate PivotTable Data

#### Returns

Type: `Promise<void>`



### `getPageDataForPivotTable(pageData: QueryViewerPageDataForPivot) => Promise<void>`

PivotTable's Method for PivotTable Page Data

#### Returns

Type: `Promise<void>`



### `getPageDataForTable(pageData: QueryViewerPageDataForTable) => Promise<void>`

Table's Method for Table Page Data

#### Returns

Type: `Promise<void>`



### `getPivottableDataSync(properties: QueryViewerPivotTableDataSync) => Promise<void>`

PivotTable's Method for PivotTable Data Sync Response

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
