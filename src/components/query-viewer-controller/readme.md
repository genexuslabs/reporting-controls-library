# gx-query-viewer-controller



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                     | Description                                                                       | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Default     |
| -------------------------- | ----------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `allowElementsOrderChange` | `allow-elements-order-change` |                                                                                   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `false`     |
| `applicationNamespace`     | `application-namespace`       | Determines the application namespace where the program is generated and compiled. | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `undefined` |
| `baseUrl`                  | `base-url`                    | Base URL of the server                                                            | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `undefined` |
| `chartType`                | `chart-type`                  | When `type == Chart`, specifies the chart type: Bar, Pie, Timeline, etc...        | `"Column" \| "Column3D" \| "StackedColumn" \| "StackedColumn3D" \| "StackedColumn100" \| "Bar" \| "StackedBar" \| "StackedBar100" \| "Area" \| "StackedArea" \| "StackedArea100" \| "SmoothArea" \| "StepArea" \| "Line" \| "StackedLine" \| "StackedLine100" \| "SmoothLine" \| "StepLine" \| "Pie" \| "Pie3D" \| "Doughnut" \| "Doughnut3D" \| "LinearGauge" \| "CircularGauge" \| "Radar" \| "FilledRadar" \| "PolarArea" \| "Funnel" \| "Pyramid" \| "ColumnLine" \| "Column3DLine" \| "Timeline" \| "SmoothTimeline" \| "StepTimeline" \| "Sparkline"` | `undefined` |
| `environment`              | `environment`                 | Environment of the project: java or net                                           | `"java" \| "net"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `undefined` |
| `includeSparkline`         | `include-sparkline`           | Include spark line                                                                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `false`     |
| `includeTrend`             | `include-trend`               | If true includes trend on the graph                                               | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `false`     |
| `objectName`               | `object-name`                 | Name of the Query or Data provider assigned                                       | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `undefined` |
| `rememberLayout`           | `remember-layout`             | For timeline for remembering layout                                               | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `true`      |
| `returnSampleData`         | `return-sample-data`          |                                                                                   | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `false`     |
| `translationType`          | `translation-type`            |                                                                                   | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `"None"`    |
| `type`                     | `type`                        | Type of the QueryViewer: Table, PivotTable, Chart, Card                           | `QueryViewerOutputType.Card \| QueryViewerOutputType.Chart \| QueryViewerOutputType.Default \| QueryViewerOutputType.Map \| QueryViewerOutputType.PivotTable \| QueryViewerOutputType.Table`                                                                                                                                                                                                                                                                                                                                                                | `undefined` |


## Events

| Event                 | Description                        | Type                                                                                                                      |
| --------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `queryViewerData`     | Fired when new data is fetched     | `CustomEvent<{ Rows: QueryViewerServiceDataRow[]; }>`                                                                     |
| `queryViewerMetadata` | Fired when new metadata is fetched | `CustomEvent<{ TextForNullValues: string; Axes: QueryViewerServiceMetaDataAxis[]; Data: QueryViewerServiceDataAxis[]; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*