# gx-query-render



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                                                                          | Type                                                                                                                       | Default                     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `baseUrl`      | `base-url`      | Base URL of the server                                                                                                                                                                                                                                                                               | `string`                                                                                                                   | `process.env.BASE_URL`      |
| `data`         | `data`          | Data of                                                                                                                                                                                                                                                                                              | `string \| { Rows: QueryViewerServiceDataRow[]; }`                                                                         | `undefined`                 |
| `environment`  | `environment`   | Environment of the project: java or net                                                                                                                                                                                                                                                              | `"java" \| "net"`                                                                                                          | `"net"`                     |
| `metadata`     | `metadata`      | Data of                                                                                                                                                                                                                                                                                              | `string \| { TextForNullValues: string; Axes: QueryViewerServiceMetaDataAxis[]; Data: QueryViewerServiceMetaDataData[]; }` | `undefined`                 |
| `metadataName` | `metadata-name` | This is the name of the metadata (all the queries belong to a certain metadata) the connector will use when useGxquery = true. In this case the connector must be told the query to execute, either by name (via the objectName property) or giving a full serialized query (via the query property) | `string`                                                                                                                   | `process.env.METADATA_NAME` |
| `query`        | --              | Provide the Query properties                                                                                                                                                                                                                                                                         | `QueryViewerBase`                                                                                                          | `undefined`                 |
| `useGxquery`   | `use-gxquery`   | True to tell the controller to connect use GXquery as a queries repository                                                                                                                                                                                                                           | `boolean`                                                                                                                  | `true`                      |


## Dependencies

### Depends on

- [gx-query-viewer](../../query-viewer)
- gx-loading

### Graph
```mermaid
graph TD;
  gx-query-render --> gx-query-viewer
  gx-query-render --> gx-loading
  gx-query-viewer --> gx-query-viewer-card-controller
  gx-query-viewer --> gx-query-viewer-chart-controller
  gx-query-viewer-card-controller --> gx-query-viewer-card
  gx-query-viewer-card --> gx-query-viewer-chart
  gx-query-viewer-chart-controller --> gx-query-viewer-chart
  gx-query-viewer-chart-controller --> gx-checkbox
  gx-query-viewer-chart-controller --> gx-form-field
  gx-query-viewer-chart-controller --> gx-select
  gx-query-viewer-chart-controller --> gx-select-option
  gx-query-viewer-chart-controller --> gx-query-viewer-slider
  gx-query-viewer-chart-controller --> gx-radio-group
  gx-query-viewer-chart-controller --> gx-radio-option
  gx-loading --> gx-lottie
  style gx-query-render fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
