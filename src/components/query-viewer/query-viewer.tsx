import {
  Component,
  Element,
  Host,
  Listen,
  Prop,
  State,
  h
} from "@stencil/core";

import { Component as GxComponent } from "../../common/interfaces";
import {
  ConditionalStyle,
  ElementValue,
  Format,
  ParameterValue,
  ValueStyle
} from "../../common/query-viewer-interfaces";
import { SeriesOptionsType } from "highcharts";

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
  // private mapServices = {
  //   net: 'gxqueryviewerforsd.aspx',
  //   java: 'qviewer.services.gxqueryviewerforsd',
  // };
  // private propsNotToPost = [
  //   'baseUrl',
  //   'env',
  //   'mapServices',
  //   'object',
  //   'objectCall',
  //   'propsNotToPost',
  //   'parameters',
  //   'elements',
  //   'dataVersionId',
  // ];
  private objectCall: Array<string>;
  private configurationObserver = new MutationObserver(() => {
    this.configurationChangedHandler();
  });

  @Element() element: HTMLGxQueryViewerElement;

  @State() parameters: string;
  @State() elements: string;

  /**
   * Base URL of the server
   */
  @Prop() readonly baseUrl: any;

  /**
   * Environmet of the project: JAVA. .Net, NetCore
   */
  @Prop() readonly env: string;

  /**
   * Language of the QueryViewer
   */
  @Prop() readonly language: string;

  /**
   * Object of QueryViewer
   */
  @Prop() readonly object: string;

  /**
   * Name of the Query or Data provider assigned
   */
  @Prop() readonly objectName: string;

  /**
   * Type of the QueryViewer: Table, PivotTable, Chart, Card
   */
  @Prop() readonly type: "Card" | "Chart" | "PivotTable" | "Table" | "Default";

  /**
   * If type == Chart, this is the chart type: Bar, Pie, Timeline, etc...
   */
  @Prop() readonly chartType:
    | "Column"
    | "Column3D"
    | "StackedColumn"
    | "StackedColumn3D"
    | "StackedColumn100"
    | "Bar"
    | "StackedBar"
    | "StackedBar100"
    | "Area"
    | "StackedArea"
    | "StackedArea100"
    | "SmoothArea"
    | "StepArea"
    | "Line"
    | "StackedLine"
    | "StackedLine100"
    | "SmoothLine"
    | "StepLine"
    | "Pie"
    | "Pie3D"
    | "Doughnut"
    | "Doughnut3D"
    | "LinearGauge"
    | "CircularGauge"
    | "Radar"
    | "FilledRadar"
    | "PolarArea"
    | "Funnel"
    | "Pyramid"
    | "ColumnLine"
    | "Column3DLine"
    | "Timeline"
    | "SmoothTimeline"
    | "StepTimeline"
    | "Sparkline";

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
   * Type of font
   */
  @Prop() readonly fontFamily: string;

  /**
   * Font size
   */
  @Prop() readonly fontSize: number;

  /**
   * Font Color
   */
  @Prop() readonly fontColor: string;

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

  @Listen("parameterValueChanged")
  parameterValueChangedHandler(eventInfo: CustomEvent) {
    eventInfo.stopPropagation();
    this.getParameters();
  }

  @Listen("elementChanged")
  elementChangedHandler(eventInfo: CustomEvent) {
    eventInfo.stopPropagation();
    this.getElements();
  }

  private configurationChangedHandler() {
    this.getParameters();
    this.getElements();
  }

  componentWillLoad() {
    this.getParameters();
    this.getElements();
  }

  // componentDidLoad() {
  //   this.configurationObserver.observe(this.element, {
  //     childList: true,
  //     subtree: true,
  //   });
  // }

  // componentDidRender() {
  //   const form = this.element.querySelector('form');
  //   form.submit();
  // }

  disconnectedCallback() {
    if (this.configurationObserver) {
      this.configurationObserver.disconnect();
      this.configurationObserver = undefined;
    }
  }

  // private parseObjectToObjectcall() {
  //   try {
  //     this.objectCall = JSON.parse(this.object);
  //   } catch (e) {
  //     this.objectCall = null;
  //   }
  // }

  private hasObjectCall() {
    return Array.isArray(this.objectCall) && this.objectCall.length >= 2;
  }

  // private loadObjectNameFromObjectCall() {
  //   if (this.hasObjectCall()) {
  //     this.objectName = this.objectCall[1];
  //   }
  // }

  // private postData() {
  //   this.parseObjectToObjectcall();
  //   this.loadObjectNameFromObjectCall();

  //   return [
  //     ...Object.keys(QueryViewer.prototype)
  //       .filter(key => !this.propsNotToPost.includes(key))

  //       .map(key => <input type="hidden" name={key} value={this[key]} />),

  //     <input type="hidden" name="Elements" value={this.elements} />,
  //     <input type="hidden" name="Parameters" value={this.parameters} />,
  //   ];
  // }

  private getParameters() {
    const parametersValue: ParameterValue[] = [];

    if (this.hasObjectCall()) {
      this.objectCall.slice(2).forEach(value => {
        const parameterObject: ParameterValue = {
          Value: encodeURIComponent(value),
          Name: ""
        };
        parametersValue.push(parameterObject);
      });
    } else {
      const parameters = Array.from(
        document.getElementsByTagName("gx-query-viewer-parameter")
      );
      parameters.forEach(parameter => {
        const parameterObject: ParameterValue = {
          Value: encodeURIComponent(parameter.Value),
          Name: parameter.Name
        };
        parametersValue.push(parameterObject);
      });
    }

    this.parameters = JSON.stringify(parametersValue);
  }

  private getElements() {
    const elementsValue: ElementValue[] = [];
    const elements = Array.from(
      document.getElementsByTagName("gx-query-viewer-element")
    );
    elements.forEach(ax => {
      const elementObjectValue: ElementValue = {
        Name: ax.name,
        Title: ax.title,
        Visible: ax.visible,
        Type: ax.type,
        Axis: ax.axis,
        Aggregation: ax.aggregation,
        DataField: ax.dataField
      };

      if (ax.axisOrderType) {
        elementObjectValue["AxisOrder"] = { Type: ax.axisOrderType };
        if (ax.axisOrderValues) {
          elementObjectValue["AxisOrder"]["Values"] = ax.axisOrderValues;
        }
      }
      if (ax.filterType) {
        elementObjectValue["Filter"] = { Type: ax.filterType };
        if (ax.axisOrderValues) {
          elementObjectValue["Filter"]["Values"] = ax.filterValues;
        }
      }
      if (ax.expandCollapseType) {
        elementObjectValue["ExpandCollapse"] = { Type: ax.expandCollapseType };
        if (ax.axisOrderValues) {
          elementObjectValue["ExpandCollapse"]["Values"] =
            ax.expandCollapseValues;
        }
      }

      const grouping = this.getGrouping(ax);
      if (Object.keys(grouping).length > 0) {
        elementObjectValue["Grouping"] = grouping;
      }
      if (ax.raiseItemClick) {
        const action = { RaiseItemClick: ax.raiseItemClick };
        elementObjectValue["Action"] = action;
      }

      const formats = Array.from(
        ax.getElementsByTagName("gx-query-viewer-element-format")
      );

      formats.forEach(format => {
        const formatObject: Format = {
          Picture: format.picture,
          Subtotals: format.subtotals,
          CanDragToPages: format.canDragToPages,
          Style: format.formatStyle,
          TargetValue: format.targetValue,
          MaximumValue: format.maximumValue
        };

        const styles = Array.from(
          ax.getElementsByTagName("gx-query-viewer-format-style")
        );

        const valuesStyles: ValueStyle[] = [];
        const conditionalStyles: ConditionalStyle[] = [];

        styles.forEach(style => {
          if (style.type === "Values") {
            const valueStyle = {
              Value: style.value,
              ApplyToRowOrColumn: style.applyToRowOrColumn,
              StyleOrClass: style.styleOrClass
            };
            valuesStyles.push(valueStyle);
          } else {
            const conditionalStyle = {
              Value1: style.value1,
              Value2: style.value2,
              Operator: style.operator,
              StyleOrClass: style.styleOrClass
            };
            conditionalStyles.push(conditionalStyle);
          }
        });
        if (valuesStyles.length > 0) {
          formatObject["ValuesStyle"] = valuesStyles;
        }
        if (conditionalStyles.length > 0) {
          formatObject["ConditionalStyles"] = conditionalStyles;
        }

        elementObjectValue["Format"] = formatObject;
      });
      elementsValue.push(elementObjectValue);
    });

    this.elements = JSON.stringify(elementsValue);
  }

  private getGrouping(
    ax: HTMLGxQueryViewerElementElement
  ): Record<string, any> {
    const grouping = () => ({
      ...(ax.groupingGroupByYear && { GroupByYear: ax.groupingGroupByYear }),
      ...(ax.groupingYearTitle && {
        YearTitle: ax.groupingYearTitle
      }),
      ...(ax.groupingGroupBySemester && {
        GroupBySemester: ax.groupingGroupBySemester
      }),
      ...(ax.groupingSemesterTitle && {
        SemesterTitle: ax.groupingSemesterTitle
      }),
      ...(ax.groupingGroupByQuarter && {
        GroupByQuarter: ax.groupingGroupByQuarter
      }),
      ...(ax.groupingQuarterTitle && { QuarterTitle: ax.groupingQuarterTitle }),
      ...(ax.groupingGroupByMonth && { GroupByMonth: ax.groupingGroupByMonth }),
      ...(ax.groupingMonthTitle && { MonthTitle: ax.groupingMonthTitle }),
      ...(ax.groupingGroupByDayOfWeek && {
        GroupByDayOfWeek: ax.groupingGroupByDayOfWeek
      }),
      ...(ax.groupingDayOfWeekTitle && {
        DayOfWeekTitle: ax.groupingDayOfWeekTitle
      }),
      ...(ax.groupingHideValue && { HideValue: ax.groupingHideValue })
    });
    return grouping;
  }
  private isDatum = (element: ElementValue) => element.Type == "Datum";
  // private isAxis = (element: ElementValue) => element.Type == "Axis";
  // private getFirstAxisDateTimeOrDate(axis: ElementValue[]) : ElementValue{
  //   axis.forEach(element => {
  //    //if element.

  //   });
  // };

  render() {
    const queryViewerElements: ElementValue[] = JSON.parse(this.elements);
    const datum = queryViewerElements.filter(this.isDatum);
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

    return (
      <Host>
        {this.type == "Card" ? (
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
          )
        ) : this.type == "Chart" ? (
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
        ) : (
          ""
        )}
      </Host>
    );
  }
}
