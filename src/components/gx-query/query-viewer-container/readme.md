# gx-query-viewer-container



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                    | Type     | Default     |
| ----------- | ------------ | ---------------------------------------------- | -------- | ----------- |
| `mainTitle` | `main-title` | This property specifies the items of the chat. | `string` | `undefined` |


## Events

| Event              | Description | Type                                                                            |
| ------------------ | ----------- | ------------------------------------------------------------------------------- |
| `gxQuerySaveQuery` |             | `CustomEvent<{ id: number; title: string; fixed: boolean; modified: string; }>` |


## Dependencies

### Depends on

- gx-button
- [gx-query-viewer](../../query-viewer)

### Graph
```mermaid
graph TD;
  gx-query-viewer-container --> gx-button
  gx-query-viewer-container --> gx-query-viewer
  gx-query-viewer --> gx-query-viewer-card-controller
  gx-query-viewer --> gx-query-viewer-chart-controller
  gx-query-viewer-card-controller --> gx-query-viewer-card
  gx-query-viewer-card --> gx-query-viewer-chart
  gx-query-viewer-chart-controller --> gx-query-viewer-chart
  style gx-query-viewer-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
