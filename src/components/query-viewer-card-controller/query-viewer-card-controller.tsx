import { Component, h, Prop, Host, Element } from "@stencil/core";
import {
  QueryViewerServiceDataRow,
  QueryViewerServiceMetaDataData,
  QueryViewerServiceResponse
} from "../../services/types/service-result";
import {
  QueryViewerDataType,
  QueryViewerShowDataAs,
  QueryViewerTrendPeriod,
  QueryViewerVisible
} from "../../common/basic-types";
import { aggregateData, parseNumericPicture } from "../../utils/general";
import {
  RegressionSeries,
  analyzeSeries,
  valueOrPercentage
} from "./card-utils";

type CardInformation = {
  title: string;
  value: string;
  minValue?: string;
  maxValue?: string;
  dataSeries?: RegressionSeries;
  includeMinAndMax: boolean;
  includeSparkline: boolean;
  includeTrend: boolean;
  trend?: TrendConfiguration;
};

type TrendConfiguration = {
  icon: string;
  tooltip: string;
};

const trendIconMapping = (linearRegressionSlope: number) =>
  linearRegressionSlope > 0 ? "keyboard_arrow_up" : "keyboard_arrow_down";

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
  @Prop() readonly showDataAs: QueryViewerShowDataAs =
    QueryViewerShowDataAs.Values;

  /**
   * If includeTrend == True, TrendPeriod specifies the period of time to calculate the trend.
   */
  @Prop() readonly trendPeriod: QueryViewerTrendPeriod =
    QueryViewerTrendPeriod.SinceTheBeginning;

  /**
   * If there is a date, do not add the data because we want to see the
   * evolution over time.
   */
  private checkIfThereIsAnyDate(): {
    aggregateRows: boolean;
    xDataField: string;
    xDataType: QueryViewerDataType;
  } {
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
      xDataType: null
    };
  }

  private getTrendIconConfiguration: (slope: number) => TrendConfiguration = (
    slope: number
  ) => ({
    icon: slope === 0 ? "drag_handle" : trendIconMapping(slope),
    tooltip: `GXPL_QViewer${this.trendPeriod}Trend` // @todo Translate this texts
  });

  private getCardsToRender(): CardInformation[] {
    const cardsToRender: CardInformation[] = [];
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

    const dataAllSeries: RegressionSeries[] = [];

    response.MetaData.Data.forEach(datum => {
      if (
        datum.Visible === QueryViewerVisible.Yes ||
        datum.Visible === QueryViewerVisible.Always
      ) {
        cardsToRender.push(
          this.getCardInformation(
            datum,
            anyRows,
            xDataField,
            xDataType,
            lastRow,
            dataAllSeries
          )
        );
      }
    });

    return cardsToRender;
  }

  private getCardInformation(
    datum: QueryViewerServiceMetaDataData,
    anyRows: boolean,
    xDataField: string,
    xDataType: QueryViewerDataType,
    lastRow: QueryViewerServiceDataRow,
    dataAllSeries: RegressionSeries[]
  ): CardInformation {
    const cardInformation: CardInformation = {
      title: datum.Title,
      value: "",
      includeMinAndMax: false,
      includeSparkline: false,
      includeTrend: false
    };

    if (!anyRows) {
      return cardInformation;
    }

    // const numberFormat = parseNumericPicture(datum.DataType, datum.Picture);
    // const decimals = numberFormat.DecimalPrecision;
    // const value = lastRow[datum.DataField];
    // const ageStr = age(lastRow[xDataField]);

    cardInformation["value"] = valueOrPercentage(
      this.showDataAs,
      lastRow[datum.DataField],
      datum
    );

    const shouldAnalyzeData =
      this.includeTrend || this.includeSparkline || this.includeMaxAndMin;

    if (!shouldAnalyzeData) {
      return cardInformation;
    }

    const data = analyzeSeries(
      {
        includeMaxAndMin: this.includeMaxAndMin,
        includeSparkline: this.includeSparkline,
        includeTrend: this.includeTrend,
        trendPeriod: this.trendPeriod
      },
      this.serviceResponse.Data,
      datum,
      xDataField,
      xDataType
    );
    dataAllSeries.push(data);

    // Sparkline
    cardInformation["includeSparkline"] = this.includeSparkline && !!xDataField;

    // Trend
    const shouldIncludeTrend =
      this.includeTrend && data.LinearRegression.AnyTrend;

    if (shouldIncludeTrend) {
      cardInformation["includeTrend"] = true;

      cardInformation["trend"] = this.getTrendIconConfiguration(
        data.LinearRegression.Slope
      );
    }

    // MaxAndMin
    const shouldIncludeMaxAndMin = this.includeMaxAndMin && !!xDataField;

    if (shouldIncludeMaxAndMin) {
      // MinValue @todo Update the implementation of the minValue using the Web implementation
      cardInformation["minValue"] = valueOrPercentage(
        this.showDataAs,
        data.MinWhen,
        datum
      );

      // MaxValue @todo Update the implementation of the maxValue using the Web implementation
      cardInformation["maxValue"] = valueOrPercentage(
        this.showDataAs,
        data.MaxWhen,
        datum
      );
    }

    return cardInformation;

    // const styleStr = selectStyle(datum, value);
    // let styleObj = {};
    // let elementValueClass = "qv-card-element-value";
    // if (
    //   qv.util.startsWith(styleStr, "{") &&
    //   qv.util.endsWith(styleStr, "}")
    // ) {
    //   styleObj = JSON.parse(styleStr);
    // } else {
    //   elementValueClass = styleStr;
    // } // El style es en realidad el nombre de una clase
    // let onClick = null;
    // if (qViewer.ItemClick && datum.RaiseItemClick) {
    //   elementValueClass +=
    //     (elementValueClass == "" ? "" : " ") + "gx-qv-clickable-element";
    //   onClick = function () {
    //     qv.card.fireItemClickEvent(event, qViewer, aggregateRows);
    //   };
    // }
  }

  render() {
    return <Host></Host>;
  }
}
