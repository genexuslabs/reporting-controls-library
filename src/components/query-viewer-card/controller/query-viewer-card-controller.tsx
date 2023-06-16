import { Component, h, Prop, Host, Element, Watch } from "@stencil/core";

import {
  QueryViewerServiceDataRow,
  QueryViewerServiceMetaDataData,
  QueryViewerServiceResponse
} from "../../../services/types/service-result";
import {
  QueryViewerDataType,
  QueryViewerOrientation,
  QueryViewerShowDataAs,
  QueryViewerTrendPeriod,
  QueryViewerVisible,
  TrendIcon
} from "../../../common/basic-types";
import { aggregateData } from "../../../utils/general";
import { analyzeSeries, valueOrPercentage } from "./card-utils";

type CardInformation = {
  title: string;
  value: string;
  minValue?: string;
  maxValue?: string;
  includeMinMax: boolean;
  includeSparkline: boolean;
  includeTrend: boolean;
  seriesData: number[][];
  orientation: QueryViewerOrientation;
  trend: TrendConfiguration;
};

type TrendConfiguration = {
  icon: TrendIcon;
  tooltip?: string;
};

const trendIconMapping = (linearRegressionSlope: number) =>
  linearRegressionSlope > 0 ? "keyboard_arrow_up" : "keyboard_arrow_down";

@Component({
  tag: "gx-query-viewer-card-controller",
  styleUrl: "query-viewer-card-controller.scss",
  shadow: true
})
export class QueryViewerCard {
  private cardsToRender: CardInformation[] = [];

  @Element() element: HTMLGxQueryViewerCardControllerElement;

  /**
   * Specifies whether to include the maximum and minimum values in the series.
   */
  @Prop() readonly includeMaxMin: boolean = false;

  /**
   * Specifies whether to include a sparkline chart for the values or not.
   */
  @Prop() readonly includeSparkline: boolean = false;

  /**
   * Specifies whether to include a trend mark for the values or not.
   */
  @Prop() readonly includeTrend: boolean = false;

  /**
   * Specifies whether to arrange the attributes horizontally or vertically
   * when than one data attribute is present.
   */
  @Prop() readonly orientation: QueryViewerOrientation =
    QueryViewerOrientation.Horizontal;
  /**
   * Specifies the metadata and data that the control will use to render.
   */
  @Prop() readonly serviceResponse: QueryViewerServiceResponse;
  @Watch("serviceResponse")
  handleServiceResponseChange(newResponse: QueryViewerServiceResponse) {
    this.cardsToRender = this.getCardsToRender(newResponse);
  }

  /**
   * Specifies whether to show the actual values, the values as a percentage of
   * the target values, or both.
   */
  @Prop() readonly showDataAs: QueryViewerShowDataAs =
    QueryViewerShowDataAs.Values;

  /**
   * If `includeTrend == true`, this attribute specifies the period of time to
   * calculate the trend.
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
    const axes = this.serviceResponse.MetaData.Axes;

    // Can't use forEach, because it displays an error "Not all code paths return a value."
    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];

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
    }

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

  private getCardsToRender(
    response: QueryViewerServiceResponse
  ): CardInformation[] {
    // No metadata and data has been fetched yet
    if (!response) {
      return [];
    }

    const cardsToRender: CardInformation[] = [];
    const anyRows = response.Data.Rows.length > 0;
    const { aggregateRows, xDataField, xDataType } =
      this.checkIfThereIsAnyDate();

    let lastRow: QueryViewerServiceDataRow;

    if (anyRows) {
      lastRow = aggregateRows
        ? aggregateData(response.MetaData.Data, response.Data.Rows)
        : response.Data.Rows[response.Data.Rows.length - 1];
    }

    response.MetaData.Data.forEach(datum => {
      if (
        datum.Visible === QueryViewerVisible.Yes ||
        datum.Visible === QueryViewerVisible.Always
      ) {
        cardsToRender.push(
          this.getCardInformation(
            response,
            datum,
            anyRows,
            xDataField,
            xDataType,
            lastRow
          )
        );
      }
    });

    return cardsToRender;
  }

  private getCardInformation(
    response: QueryViewerServiceResponse,
    datum: QueryViewerServiceMetaDataData,
    anyRows: boolean,
    xDataField: string,
    xDataType: QueryViewerDataType,
    lastRow: QueryViewerServiceDataRow
  ): CardInformation {
    const cardInformation: CardInformation = {
      title: datum.Title,
      value: "",
      includeMinMax: false,
      includeSparkline: false,
      includeTrend: false,
      seriesData: [],
      orientation: QueryViewerOrientation.Horizontal,
      trend: {
        icon: "drag_handle"
      }
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
      parseFloat(lastRow[datum.DataField]),
      datum
    );

    // @todo Check how should be implemented this properties in the runtime
    // const shouldAnalyzeData =
    //   this.includeTrend || this.includeSparkline || this.includeMaxMin;
    const shouldAnalyzeData = true;

    if (!shouldAnalyzeData) {
      return cardInformation;
    }

    const data = analyzeSeries(
      {
        // includeMaxAndMin: this.includeMaxMin,
        // includeSparkline: this.includeSparkline,
        // includeTrend: this.includeTrend,
        // @todo Check how should be implemented this properties in the runtime
        includeMaxAndMin: true,
        includeSparkline: true,
        includeTrend: true,
        trendPeriod: this.trendPeriod
      },
      response.Data,
      datum,
      xDataField,
      xDataType
    );
    cardInformation["seriesData"] = data.ChartSeriesData;

    // Sparkline
    cardInformation["includeSparkline"] = !!xDataField;

    // Trend
    const shouldIncludeTrend = data.LinearRegression.AnyTrend;

    if (shouldIncludeTrend) {
      cardInformation.includeTrend = true;

      cardInformation.trend = this.getTrendIconConfiguration(
        data.LinearRegression.Slope
      );
    }

    // MaxAndMin
    const shouldIncludeMaxAndMin = !!xDataField;

    if (shouldIncludeMaxAndMin) {
      cardInformation.includeMinMax = true;

      // MinValue @todo Update the implementation of the minValue using the Web implementation
      cardInformation["minValue"] = valueOrPercentage(
        this.showDataAs,
        data.MinValue,
        datum
      );

      // MaxValue @todo Update the implementation of the maxValue using the Web implementation
      cardInformation["maxValue"] = valueOrPercentage(
        this.showDataAs,
        data.MaxValue,
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

  connectedCallback() {
    this.cardsToRender = this.getCardsToRender(this.serviceResponse);
  }

  render() {
    return (
      <Host
        role="article"
        aria-labelledby="gx-query-viewer-card-controller"
        class={{
          "gx-query-viewer-card-controller--vertical":
            this.orientation === QueryViewerOrientation.Vertical
        }}
      >
        {this.cardsToRender.map(
          ({
            title,
            value,
            maxValue,
            minValue,
            includeMinMax,
            includeSparkline,
            includeTrend,
            seriesData,
            trend
          }) => (
            <gx-query-viewer-card
              description={title}
              value={value}
              minValue={minValue}
              maxValue={maxValue}
              includeMaxMin={this.includeMaxMin && includeMinMax}
              includeSparkline={this.includeSparkline && includeSparkline}
              includeTrend={this.includeTrend && includeTrend}
              trendIcon={trend.icon}
              seriesData={seriesData}
            ></gx-query-viewer-card>
          )
        )}
      </Host>
    );
  }
}
