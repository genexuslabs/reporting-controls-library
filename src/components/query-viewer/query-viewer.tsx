import { Component, Element, Host, Prop, State, h } from "@stencil/core";

import { Component as GxComponent } from "../../common/interfaces";
import { ElementValue } from "../../common/query-viewer-interfaces";
import { SeriesOptionsType } from "highcharts";
import {
  QueryViewerChartType,
  QueryViewerOutputType
} from "../../common/basic-types";

const TITLE_OPTION = {
  text: ""
};

const CHART_OPTION = {
  margin: [0, 0, 0, 0],
  renderTo: "container",
  type: "pie",
  plotShadow: false
};

const TOOLTIP_OPTION = {
  pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
};

const LEGEND_OPTION = {
  enabled: false
};

const PLOT_OPTION = {
  pie: {
    allowPointSelect: true,
    cursor: "pointer",
    dataLabels: {
      enabled: true,
      format: "<b>{point.name}</b>: {point.percentage:.1f} %"
    }
  }
};

const YAXIS_OPTION = {};

const XAXIS_OPTION = {};

const SERIES_OPTION = [
  {
    name: "Brands",
    colorByPoint: true,
    data: [
      {
        name: "Chrome",
        y: 70.67,
        sliced: true,
        selected: true
      },
      {
        name: "Edge",
        y: 14.77
      },
      {
        name: "Firefox",
        y: 4.86
      },
      {
        name: "Safari",
        y: 2.63
      },
      {
        name: "Internet Explorer",
        y: 1.53
      },
      {
        name: "Opera",
        y: 1.4
      },
      {
        name: "Sogou Explorer",
        y: 0.84
      },
      {
        name: "QQ",
        y: 0.51
      },
      {
        name: "Other",
        y: 2.6
      }
    ]
  }
];

@Component({
  tag: "gx-query-viewer",
  styleUrl: "query-viewer.scss",
  shadow: false,
  assetsDirs: ["assets"]
})
export class QueryViewer implements GxComponent {
  /**
   * Dictionary for each type of Query Viewer. Maps Query Viewer types to their
   * corresponding render.
   */
  private rendersDictionary: {
    [key in QueryViewerOutputType]: any;
  } = {
    [QueryViewerOutputType.Card]: this.cardRender(),
    [QueryViewerOutputType.Chart]: this.chartRender(),
    [QueryViewerOutputType.Map]: "",
    [QueryViewerOutputType.PivotTable]: "",
    [QueryViewerOutputType.Table]: "",
    [QueryViewerOutputType.Default]: ""
  };

  @Element() element: HTMLGxQueryViewerElement;

  @State() parameters: string;
  @State() elements: string;

  /**
   * Language of the QueryViewer
   */
  @Prop() readonly language: string;

  /**
   * Object of QueryViewer
   */
  @Prop() readonly object: string;

  /**
   * Type of the QueryViewer: Table, PivotTable, Chart, Card
   */
  @Prop() readonly type: QueryViewerOutputType;

  /**
   * If type == Chart, this is the chart type: Bar, Pie, Timeline, etc...
   */
  @Prop() readonly chartType: QueryViewerChartType;

  /**
   * If type == PivotTable or Table, if true there is paging, else everything in one table
   */
  @Prop() readonly paging: boolean;

  /**
   * If paging true, number of items for a single page
   */
  @Prop() readonly pageSize: number;

  /**
   * Ax to show data labels
   */
  @Prop() readonly showDataLabelsIn: string;

  /**
   * Timeline
   */
  @Prop() readonly plotSeries: "InTheSameChart" | "InSeparateCharts";

  /**
   * Labels for XAxis
   */
  @Prop() readonly xAxisLabels:
    | "Horizontally"
    | "Rotated30"
    | "Rotated45"
    | "Rotated60"
    | "Vertically";

  /**
   * if true the x Axes intersect at zero
   */
  @Prop() readonly xAxisIntersectionAtZero: boolean;

  /**
   * if true show values on the graph
   */
  @Prop() readonly showValues: boolean;

  /**
   * X Axis title
   */
  @Prop() readonly xAxisTitle: string;

  /**
   * Y Axis title
   */
  @Prop() readonly yAxisTitle: string;

  /**
   * Type of data to show
   */
  @Prop() readonly showDataAs:
    | "Values"
    | "Percentages"
    | "ValuesAndPercentages";

  /**
   * If true includes trend on the graph
   */
  @Prop() readonly includeTrend: boolean;

  /**
   * If includeTrend, defines the period of the trend
   */
  @Prop() readonly trendPeriod:
    | "SinceTheBeginning"
    | "LastYear"
    | "LastSemester"
    | "LastQuarter"
    | "LastMonth"
    | "LastWeek"
    | "LastDay"
    | "LastHour"
    | "LastMinute"
    | "LastSecond";

  /**
   * For timeline for remembering layout
   */
  @Prop() readonly rememberLayout: boolean;

  /**
   * Orientation of the graph
   */
  @Prop() readonly orientation: "Horizontal" | "Vertical";

  /**
   * Include spark line
   */
  @Prop() readonly includeSparkline: boolean;

  /**
   * Include max and min
   */
  @Prop() readonly includeMaxMin: boolean;

  /**
   * Theme for showing the graph
   */
  @Prop() readonly theme: string;

  /**
   * Object type -> Query or DataProvider
   */
  @Prop() readonly objectType: string;

  /**
   * True if it is external query
   */
  @Prop() readonly isExternalQuery: boolean;

  /**
   * Allowing elements order to change
   */
  @Prop() readonly allowElementsOrderChange: boolean;

  /**
   * If type== PivotTable or Table, if true will shrink the table
   */
  @Prop() readonly autoResize: boolean;

  /**
   * If autoResize, in here select the type, Width, height, or both
   */
  @Prop() readonly autoResizeType: "Both" | "Vertical" | "Horizontal";

  /**
   * Auto refresh group
   */
  @Prop() readonly autoRefreshGroup: string;

  /**
   * Allowing or not Comlumn sort
   */
  @Prop() readonly disableColumnSort: boolean;

  /**
   * Allow selection
   */
  @Prop() readonly allowSelection: boolean;

  /**
   * If type== PivotTable or Table allow to export to XML
   */
  @Prop() readonly exportToXML: boolean;

  /**
   * If type== PivotTable or Table allow to export to HTML
   */
  @Prop() readonly exportToHTML: boolean;

  /**
   * If type== PivotTable or Table allow to export to XLS
   */
  @Prop() readonly exportToXLS: boolean;

  /**
   * If type== PivotTable or Table allow to export to XLSX
   */
  @Prop() readonly exportToXLSX: boolean;

  /**
   * If type== PivotTable or Table allow to export to PDF
   */
  @Prop() readonly exportToPDF: boolean;

  /**
   * Title of the QueryViewer
   */
  @Prop() readonly queryTitle: string;

  /**
   * Version of data
   */
  @Prop() readonly dataVersionId: number;

  private isDatum = (element: ElementValue) => element.Type == "Datum";
  // private isAxis = (element: ElementValue) => element.Type == "Axis";
  // private getFirstAxisDateTimeOrDate(axis: ElementValue[]) : ElementValue{
  //   axis.forEach(element => {
  //    //if element.

  //   });
  // };

  private cardRender() {
    const queryViewerElements: ElementValue[] = JSON.parse(this.elements);
    const datum = queryViewerElements.filter(this.isDatum);

    datum.map(
      datum => (
        // axis.map(axis => (
        <gx-query-viewer-card
          datum={datum}
          value={datum.DataField}
          // axis={axis}
          // showDataAs={this.showDataAs}
          orientation={this.orientation}
          includeTrend={this.includeTrend}
          // trendPeriod={this.trendPeriod}
          includeSparkline={this.includeSparkline}
          includeMaxAndMin={this.includeMaxMin}
        ></gx-query-viewer-card>
      )
      // ))
    );
  }

  private chartRender() {
    return (
      <gx-query-viewer-chart
        chartTitle={TITLE_OPTION}
        chartOptions={CHART_OPTION}
        seriesOptions={SERIES_OPTION as SeriesOptionsType[]}
        tooltipOptions={TOOLTIP_OPTION}
        legendOptions={LEGEND_OPTION}
        plotOptions={PLOT_OPTION}
        yaxisOptions={YAXIS_OPTION}
        xaxisOptions={XAXIS_OPTION}
      ></gx-query-viewer-chart>
    );
  }

  render() {
    // const axis = queryViewerElements.filter(this.isAxis);
    // const cardAxis = this.getFirstAxisDateTimeOrDate();
    // console.log("type", this.type);
    // console.log("elements", this.elements);
    // console.log(datum);
    // console.log(this.objectName);
    // console.log("includeTrend", this.includeTrend);
    // console.log("includeSparkline", this.includeSparkline);
    // console.log("includeMaxMin", this.includeMaxMin);
    // console.log("orientation", this.orientation);

    return <Host>{this.rendersDictionary[this.type]}</Host>;
  }
}
