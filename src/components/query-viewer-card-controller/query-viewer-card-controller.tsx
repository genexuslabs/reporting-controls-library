import { Component, h, Prop, Host, Element } from "@stencil/core";
import {
  QueryViewerServiceDataRow,
  QueryViewerServiceResponse
} from "../../services/types/service-result";
import {
  QueryViewerDataType,
  QueryViewerVisible
} from "../../common/basic-types";
import { aggregateData } from "./utils";
import { parseNumericPicture } from "../../utils/general";

@Component({
  tag: "gx-query-viewer-card-controller",
  styleUrl: "query-viewer-card-controller.scss"
})
export class QueryViewerCard {
  @Element() element: HTMLGxQueryViewerCardControllerElement;

  /**
   * IncludeMaxAndMin, specifies whether to include the maximum and minimum values in the series.
   */
  @Prop() readonly includeMaxAndMin: boolean = false;

  /**
   * IncludeSparkline, specifies whether to include a sparkline chart for the values or not.
   */
  @Prop() readonly includeSparkline: boolean = false;

  /**
   * IncludeTrend, specifies whether to include a trend mark for the values or not.
   */
  @Prop() readonly includeTrend: boolean = false;

  /**
   * Orientation, specifies whether to arrange the attributes horizontally or vertically when than one data attribute is present.
   */
  @Prop() readonly orientation: "Horizontal" | "Vertical" = "Horizontal";

  /**
   *
   */
  @Prop() readonly serviceResponse: QueryViewerServiceResponse;

  /**
   * ShowDataAs, specifies whether to show the actual values, the values as a percentage of the target values, or both.
   */
  @Prop() readonly showDataAs:
    | "Values"
    | "Percentages"
    | "Values and Percentages" = "Values";

  /**
   * If includeTrend == True, TrendPeriod specifies the period of time to calculate the trend.
   */
  @Prop() readonly trendPeriod:
    | "Since the beginning"
    | "Last semester"
    | "Last year"
    | "Last quarter"
    | "Last month"
    | "Last week"
    | "Last day"
    | "Last hour"
    | "Last minute"
    | "Last second" = "Since the beginning";

  /**
   * If there is a date, I do not add the data because I want to see the
   * evolution over time.
   */
  private checkIfThereIsAnyDate() {
    this.serviceResponse.MetaData.Axes.forEach(axis => {
      if (
        axis.DataType === QueryViewerDataType.Date ||
        axis.DataType === QueryViewerDataType.DateTime
      ) {
        return {
          aggregateRows: false,
          xDataField: axis.DataField,
          xDataType: axis.DataType
        };
      }
    });

    return {
      aggregateRows: true,
      xDataField: "",
      xDataType: ""
    };
  }

  render() {
    const response = this.serviceResponse;

    const anyRows = response.Data.Rows.length > 0;
    const { aggregateRows, xDataField, xDataType } =
      this.checkIfThereIsAnyDate();

    let lastRow: QueryViewerServiceDataRow;

    if (anyRows) {
      lastRow = aggregateRows
        ? aggregateData(response.MetaData.Data, response.Data.Rows)
        : response.Data.Rows[response.Data.Rows.length - 1];
    }

    // const dataAllSeries = [];
    for (let i = 0; i < response.MetaData.Data.length; i++) {
      const datum = response.MetaData.Data[i];

      if (
        datum.Visible === QueryViewerVisible.Yes ||
        datum.Visible === QueryViewerVisible.Always
      ) {
        const numberFormat = parseNumericPicture(datum.DataType, datum.Picture);
        const decimals = numberFormat.DecimalPrecision;
        let value;
        let valueStr;
        let ageStr;

        if (anyRows) {
          value = lastRow[datum.DataField];
          // valueStr = valueOrPercentage(
          //   qViewer,
          //   lastRow[datum.DataField],
          //   datum,
          //   decimals
          // );
          // ageStr = age(lastRow[xDataField]);
          ageStr = lastRow[xDataField];
        } else {
          value = "";
          // valueStr = "";
          ageStr = "";
        }

        if (
          anyRows &&
          (this.includeTrend || this.includeSparkline || this.includeMaxAndMin)
        ) {
          // const data = analizeSeries(qViewer, datum, xDataField, xDataType);
          // dataAllSeries.push(data);
        }

        // const styleStr = selectStyle(datum, value);
        // // let styleObj = {};
        // // let elementValueClass = "qv-card-element-value";
        // // if (
        // //   qv.util.startsWith(styleStr, "{") &&
        // //   qv.util.endsWith(styleStr, "}")
        // // ) {
        // //   styleObj = JSON.parse(styleStr);
        // // } else {
        // //   elementValueClass = styleStr;
        // // } // El style es en realidad el nombre de una clase
        // // let onClick = null;
        // // if (qViewer.ItemClick && datum.RaiseItemClick) {
        // //   elementValueClass +=
        // //     (elementValueClass == "" ? "" : " ") + "gx-qv-clickable-element";
        // //   onClick = function () {
        // //     qv.card.fireItemClickEvent(event, qViewer, aggregateRows);
        // //   };
        // // }

        // if (qViewer.Orientation == QueryViewerOrientation.Vertical) {
        //   trInner = qv.util.dom.createRow(tableInner);
        // }

        // const horizontalPadding =
        //   qViewer.Orientation == QueryViewerOrientation.Horizontal
        //     ? "10px"
        //     : "";
        // const verticalPadding =
        //   qViewer.Orientation == QueryViewerOrientation.Vertical ? "10px" : "";
        // const tdInner = qv.util.dom.createCell(
        //   trInner,
        //   1,
        //   "center",
        //   {
        //     paddingRight: horizontalPadding,
        //     paddingLeft: horizontalPadding,
        //     paddingBottom: verticalPadding,
        //     paddingTop: verticalPadding
        //   },
        //   ""
        // );
        // const table1 = qv.util.dom.createTable(tdInner, "", {});
        // let tr1 = qv.util.dom.createRow(table1);
        // let td1 = qv.util.dom.createCell(tr1, 1, "center", {}, "");
        // var table2 = qv.util.dom.createTable(td1, "", {});
        // var tr2 = qv.util.dom.createRow(table2);
        // td2 = qv.util.dom.createCell(tr2, 1, "center", {}, "");
        // const span2 = qv.util.dom.createSpan(
        //   td2,
        //   qViewer.getContainerControl().id + "_" + datum.Name,
        //   elementValueClass,
        //   xDataField != "" ? ageStr : "",
        //   styleObj,
        //   onClick,
        //   valueStr
        // );
        // var td2 = qv.util.dom.createCell(tr2, 1, "", {}, "");
        // if (
        //   anyRows &&
        //   qViewer.IncludeTrend &&
        //   !qViewer.IncludeSparkline &&
        //   data.LinearRegression.AnyTrend
        // ) {
        //   TrendIcon(td2, qViewer, data);
        // }
        // tr1 = qv.util.dom.createRow(table1);
        // td1 = qv.util.dom.createCell(tr1, 1, "center", {}, "");
        // span1 = qv.util.dom.createSpan(
        //   td1,
        //   "",
        //   "qv-card-element-title",
        //   xDataField != "" ? ageStr : "",
        //   {},
        //   null,
        //   datum.Title
        // );

        // if (qViewer.IncludeSparkline && xDataField != "" && anyRows) {
        //   tr1 = qv.util.dom.createRow(table1);
        //   td1 = qv.util.dom.createCell(tr1, 1, "", {}, "");
        //   var table2 = qv.util.dom.createTable(td1, "", { width: "100%" });
        //   var tr2 = qv.util.dom.createRow(table2);
        //   var td2;
        //   td2 = qv.util.dom.createCell(tr2, 1, "", { width: "100%" }, "");
        //   const div = qv.util.dom.createDiv(
        //     td2,
        //     sparklineChartId(qViewer.userControlId(), i),
        //     "",
        //     "",
        //     { height: "50px", width: "100%", minWidth: "100px" },
        //     ""
        //   );
        //   td2 = qv.util.dom.createCell(tr2, 1, "", { width: "0%" }, "");
        //   if (
        //     anyRows &&
        //     qViewer.IncludeTrend &&
        //     data.LinearRegression.AnyTrend
        //   ) {
        //     TrendIcon(td2, qViewer, data);
        //   }
        // }

        // if (qViewer.IncludeMaxAndMin && xDataField != "" && anyRows) {
        //   tr1 = qv.util.dom.createRow(table1);
        //   td1 = qv.util.dom.createCell(tr1, 1, "center", {}, "");
        //   const table2 = qv.util.dom.createTable(td1, "", {
        //     "margin-top": "10px"
        //   });
        //   const tr2 = qv.util.dom.createRow(table2);
        //   var td2;
        //   td2 = qv.util.dom.createCell(tr2, 1, "", {}, "");
        //   var table3;
        //   table3 = getMinMaxTable(
        //     td2,
        //     valueOrPercentage(qViewer, data.MinValue, datum, decimals),
        //     age(data.MinWhen),
        //     gx.getMessage("GXPL_QViewerCardMinimum")
        //   );
        //   td2 = qv.util.dom.createCell(tr2, 1, "", {}, "");
        //   table3 = getMinMaxTable(
        //     td2,
        //     valueOrPercentage(qViewer, data.MaxValue, datum, decimals),
        //     age(data.MaxWhen),
        //     gx.getMessage("GXPL_QViewerCardMaximum")
        //   );
        // }
      }
    }

    if (this.includeSparkline && xDataField && anyRows) {
      // for (let i = 0; i < response.MetaData.Data.length; i++) {
      //   const sparklineOptions = GetSparklineOptions(
      //     qViewer,
      //     dataAllSeries[i].ChartSeriesData,
      //     i
      //   );
      //   const SparklineHCChart = new Highcharts.Chart(sparklineOptions);
      // }
    }

    return <Host></Host>;
  }
}
