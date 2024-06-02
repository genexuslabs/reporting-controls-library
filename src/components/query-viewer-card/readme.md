# gx-query-viewer-card



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                                                    | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Default                                    |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `description`      | `description`       | Describe the content or purpose of the element set as Datum in the query object.               | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`                                |
| `includeMaxMin`    | `include-max-min`   | Specifies whether to include the maximum and minimum values in the series.                     | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                                    |
| `includeSparkline` | `include-sparkline` | Specifies whether to include a sparkline chart for the values or not.                          | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                                    |
| `includeTrend`     | `include-trend`     | Specifies whether to include a trend mark for the values or not.                               | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `false`                                    |
| `maxValue`         | `max-value`         | Specifies the maximum value in the series.                                                     | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `""`                                       |
| `minValue`         | `min-value`         | Specifies the minimum value in the series.                                                     | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `""`                                       |
| `seriesData`       | --                  | Specifies the data used for the series of the sparkline.                                       | `number[][]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `[]`                                       |
| `translations`     | --                  | For translate the labels of the outputs                                                        | `{ GXPL_QViewerSinceTheBeginningTrend: string; GXPL_QViewerLastYearTrend: string; GXPL_QViewerLastSemesterTrend: string; GXPL_QViewerLastQuarterTrend: string; GXPL_QViewerLastMonthTrend: string; GXPL_QViewerLastWeekTrend: string; GXPL_QViewerLastDayTrend: string; GXPL_QViewerLastHourTrend: string; GXPL_QViewerLastMinuteTrend: string; GXPL_QViewerLastSecondTrend: string; GXPL_QViewerCardMinimum: string; GXPL_QViewerCardMaximum: string; GXPL_QViewerNoDatetimeAxis: string; GXPL_QViewerNoMapAxis: string; }` | `undefined`                                |
| `trendIcon`        | `trend-icon`        | Specifies the icon used for the trend.                                                         | `"drag_handle" \| "keyboard_arrow_down" \| "keyboard_arrow_up"`                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `"drag_handle"`                            |
| `trendPeriod`      | `trend-period`      | If `includeTrend == true`, this attribute specifies the period of time to calculate the trend. | `QueryViewerTrendPeriod.LastDay \| QueryViewerTrendPeriod.LastHour \| QueryViewerTrendPeriod.LastMinute \| QueryViewerTrendPeriod.LastMonth \| QueryViewerTrendPeriod.LastQuarter \| QueryViewerTrendPeriod.LastSecond \| QueryViewerTrendPeriod.LastSemester \| QueryViewerTrendPeriod.LastWeek \| QueryViewerTrendPeriod.LastYear \| QueryViewerTrendPeriod.SinceTheBeginning`                                                                                                                                             | `QueryViewerTrendPeriod.SinceTheBeginning` |
| `value`            | `value`             | Specifies the value to show in the card.                                                       | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `undefined`                                |


## Events

| Event            | Description                                                                                      | Type               |
| ---------------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| `itemClickEvent` | ItemClickEvent, executes actions when this event is triggered after clicking on a query element. | `CustomEvent<any>` |


## Dependencies

### Used by

 - [gx-query-viewer-card-controller](controller)

### Depends on

- [gx-query-viewer-chart](../query-viewer-chart)

### Graph
```mermaid
graph TD;
  gx-query-viewer-card --> gx-query-viewer-chart
  gx-query-viewer-card-controller --> gx-query-viewer-card
  style gx-query-viewer-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
