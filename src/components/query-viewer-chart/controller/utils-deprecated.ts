let HCChart;
let _highChartsDrawPointsWrapped;
const DEFAULTCHARTSPACING = 10;

qv.chart = (function () {
  // 	 function IsTimelineChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.Timeline ||
  //       qViewer.RealChartType == QueryViewerChartType.SmoothTimeline ||
  //       qViewer.RealChartType == QueryViewerChartType.StepTimeline
  //     );
  //   }

  //   function IsDatetimeXAxis(qViewer) {
  //     return (
  //       IsTimelineChart(qViewer) ||
  //       qViewer.RealChartType == QueryViewerChartType.Sparkline
  //     );
  //   }

  //   function IsStackedChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.StackedColumn ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedColumn3D ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedColumn100 ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedBar ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedBar100 ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedArea ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedArea100 ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedLine ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedLine100
  //     );
  //   }

  //   function IsCircularChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.Pie ||
  //       qViewer.RealChartType == QueryViewerChartType.Pie3D ||
  //       qViewer.RealChartType == QueryViewerChartType.Doughnut ||
  //       qViewer.RealChartType == QueryViewerChartType.Doughnut3D
  //     );
  //   }

  //   function IsFunnelChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.Funnel ||
  //       qViewer.RealChartType == QueryViewerChartType.Pyramid
  //     );
  //   }

  //   function IsPolarChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.Radar ||
  //       qViewer.RealChartType == QueryViewerChartType.FilledRadar ||
  //       qViewer.RealChartType == QueryViewerChartType.PolarArea
  //     );
  //   }

  //   function IsSingleSerieChart(qViewer) {
  //     return IsCircularChart(qViewer) || IsFunnelChart(qViewer);
  //   }

  //   function IsCombinationChart(qViewer) {
  //     return (
  //       (qViewer.RealChartType == QueryViewerChartType.ColumnLine ||
  //         qViewer.RealChartType == QueryViewerChartType.Column3DLine) &&
  //       qViewer.Chart.Series.DataFields.length > 1
  //     );
  //   }

  //   function IsGaugeChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.CircularGauge ||
  //       qViewer.RealChartType == QueryViewerChartType.LinearGauge
  //     );
  //   }

  //   function IsAreaChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.Area ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedArea ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedArea100 ||
  //       qViewer.RealChartType == QueryViewerChartType.SmoothArea ||
  //       qViewer.RealChartType == QueryViewerChartType.StepArea
  //     );
  //   }

  //   function IsLineChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.Line ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedLine ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedLine100 ||
  //       qViewer.RealChartType == QueryViewerChartType.SmoothLine ||
  //       qViewer.RealChartType == QueryViewerChartType.StepLine ||
  //       qViewer.RealChartType == QueryViewerChartType.Sparkline ||
  //       IsTimelineChart(qViewer)
  //     );
  //   }

  //   function IsBarChart(qViewer) {
  //     return (
  //       qViewer.RealChartType == QueryViewerChartType.Bar ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedBar ||
  //       qViewer.RealChartType == QueryViewerChartType.StackedBar100
  //     );
  //   }

  
  //   function IsSplittedChart(qViewer) {
  //     if (IsStackedChart(qViewer))
  //       return false; // Para las gráficas Stacked no tiene sentido separar en varias gráficas pues dejan de apilarse las series
  //     else
  //       return (
  //         (qViewer.PlotSeries == QueryViewerPlotSeries.InSeparateCharts ||
  //           IsSingleSerieChart(qViewer)) &&
  //         qViewer.Chart.Series.DataFields.length > 1
  //       ); // Fuerzo gráficas separadas para este tipo de gráficas porque sino no se pueden dibujar
  //   }

  function NumberOfCharts(qViewer) {
    return IsSplittedChart(qViewer)
      ? qViewer.Chart.Series.DataFields.length
      : 1;
  }

  function splitChartContainer(qViewer) {
    const viewerId = qViewer.userControlId();
    let container = qv.util.dom.getEmptyContainer(qViewer);
    if (
      (IsTimelineChart(qViewer) || IsSplittedChart(qViewer)) &&
      container.offsetHeight == 0
    ) {
      container.style.height = "400px"; // Necesito tener un alto distinto de cero antes de dibujar las gráficas, si no todas quedan con alto 400px
    }
    if (IsTimelineChart(qViewer)) {
      qv.util.dom.createDiv(
        container,
        optionsId(viewerId),
        "QVTimelineHeaderContainer",
        "",
        { width: "100%", height: TimelineHeaderHeight + "px" },
        ""
      );
      const centerDiv = qv.util.dom.createDiv(
        container,
        centerId(viewerId),
        "",
        "",
        {
          width: "100%",
          height:
            "calc(100% - " +
            TimelineHeaderHeight +
            "px - " +
            TimelineFooterHeight +
            "px)"
        },
        ""
      );
      qv.util.dom.createDiv(
        container,
        footerId(viewerId),
        "gx-qv-footer",
        "",
        { width: "100%", height: TimelineFooterHeight + "px" },
        ""
      );
      container.style.padding = DEFAULTCHARTSPACING + "px";
      container = centerDiv;
    }
    if (IsSplittedChart(qViewer)) {
      const totDIVs = qViewer.Chart.Series.DataFields.length;
      const divHeight = parseInt(100 / totDIVs);
      const percentLeft = 100 % totDIVs;
      let baseId;
      if (IsTimelineChart(qViewer)) {
        baseId = centerId(viewerId);
      } else {
        baseId = viewerId;
      }
      for (let i = 0; i < totDIVs; i++) {
        qv.util.dom.createDiv(
          container,
          baseId + "_chart" + i.toString(),
          "",
          "",
          {
            width: "100%",
            height: (divHeight + (i < percentLeft ? 1 : 0)).toString() + "%"
          },
          ""
        );
      }
    }
  }

  function getHoverPoints(qViewer, index) {
    const points = [];
    for (let i = 0; i < qViewer.Charts.length; i++) {
      for (let j = 0; j < qViewer.Charts[i].series.length; j++) {
        const point = qViewer.Charts[i].series[j].data[index];
        points.push(point);
      }
    }
    return points;
  }

  function syncPoints(qViewer, container, index, visible, highlightIfVisible) {
    for (let i = 0; i < qViewer.Charts.length; i++) {
      if (container.id != qViewer.Charts[i].container.id) {
        for (let j = 0; j < qViewer.Charts[i].series.length; j++) {
          const point = qViewer.Charts[i].series[j].data[index];
          if (visible) {
            if (highlightIfVisible) {
              point.setState("hover");
            }
            qViewer.Charts[i].tooltip.hide(0);
          } else {
            point.setState();
          }
        }
      }
    }
  }


  function SetHighchartsOptions() {
    Highcharts.setOptions({
      lang: {
        months: [
          gx.getMessage("GXPL_QViewerJanuary"),
          gx.getMessage("GXPL_QViewerFebruary"),
          gx.getMessage("GXPL_QViewerMarch"),
          gx.getMessage("GXPL_QViewerApril"),
          gx.getMessage("GXPL_QViewerMay"),
          gx.getMessage("GXPL_QViewerJune"),
          gx.getMessage("GXPL_QViewerJuly"),
          gx.getMessage("GXPL_QViewerAugust"),
          gx.getMessage("GXPL_QViewerSeptember"),
          gx.getMessage("GXPL_QViewerOctober"),
          gx.getMessage("GXPL_QViewerNovember"),
          gx.getMessage("GXPL_QViewerDecember")
        ],
        weekdays: [
          gx.getMessage("GXPL_QViewerSunday"),
          gx.getMessage("GXPL_QViewerMonday"),
          gx.getMessage("GXPL_QViewerTuesday"),
          gx.getMessage("GXPL_QViewerWednesday"),
          gx.getMessage("GXPL_QViewerThursday"),
          gx.getMessage("GXPL_QViewerFriday"),
          gx.getMessage("GXPL_QViewerSaturday")
        ],
        shortMonths: [
          gx.getMessage("GXPL_QViewerJanuary").substring(0, 3),
          gx.getMessage("GXPL_QViewerFebruary").substring(0, 3),
          gx.getMessage("GXPL_QViewerMarch").substring(0, 3),
          gx.getMessage("GXPL_QViewerApril").substring(0, 3),
          gx.getMessage("GXPL_QViewerMay").substring(0, 3),
          gx.getMessage("GXPL_QViewerJune").substring(0, 3),
          gx.getMessage("GXPL_QViewerJuly").substring(0, 3),
          gx.getMessage("GXPL_QViewerAugust").substring(0, 3),
          gx.getMessage("GXPL_QViewerSeptember").substring(0, 3),
          gx.getMessage("GXPL_QViewerOctober").substring(0, 3),
          gx.getMessage("GXPL_QViewerNovember").substring(0, 3),
          gx.getMessage("GXPL_QViewerDecember").substring(0, 3)
        ],
        numericSymbols: null
      }
    });
  }

  function SetItemClickData(
    eventData,
    qViewer,
    name,
    type,
    value,
    selected,
    row
  ) {
    function GetContextElement(axisOrDatum, value) {
      const contextElement = {};
      contextElement.Name = axisOrDatum.Name;
      const pictureProperties = qv.util.GetPictureProperties(
        axisOrDatum.DataType,
        axisOrDatum.Picture
      );
      const formattedValue = qv.util.ApplyPicture(
        value,
        axisOrDatum.Picture,
        axisOrDatum.DataType,
        pictureProperties
      );
      contextElement.Values = [formattedValue];
      return contextElement;
    }

    eventData.Name = name;
    eventData.Type = type;
    eventData.Axis = "";
    eventData.Value = value;
    eventData.Selected = selected;
    eventData.Context = [];
    for (var i = 0; i < qViewer.Metadata.Axes.length; i++) {
      const axis = qViewer.Metadata.Axes[i];
      if (!axis.IsComponent) {
        var contextElement = GetContextElement(axis, row[axis.DataField]);
        eventData.Context.push(contextElement);
      }
    }
    for (var i = 0; i < qViewer.Metadata.Data.length; i++) {
      const datum = qViewer.Metadata.Data[i];
      if (!datum.IsComponent) {
        var contextElement = GetContextElement(datum, row[datum.DataField]);
        eventData.Context.push(contextElement);
      }
    }
    eventData.Filters = [];
  }

  function ToggleChartsSelection(charts, index) {
    let selectedResult = false;
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];
      for (let j = 0; j < chart.series.length; j++) {
        const point = chart.series[j].points[index];
        if (point.selected) {
          point.select();
          break;
        } else {
          point.select(true, j > 0);
          selectedResult = true;
        }
      }
    }
    return selectedResult;
  }

  function GetRowsToSelect(qViewer, selection) {
    const rowsToSelect = [];
    for (let i = 0; i < qViewer.Data.Rows.length; i++) {
      const row = qViewer.Data.Rows[i];
      let selected = true;
      for (j = 0; j < selection.length; j++) {
        const selectionItem = selection[j];
        if (row[selectionItem.DataField]) {
          if (
            qv.util.trim(row[selectionItem.DataField]) !=
            qv.util.trim(selectionItem.Value)
          ) {
            selected = false;
            break;
          }
        }
      }
      if (selected) {
        rowsToSelect.push(i);
      }
    }
    return rowsToSelect;
  }

  function SelectChartsPoints(charts, indexes) {
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];
      let accumulate = false;
      for (let j = 0; j < indexes.length; j++) {
        const index = indexes[j];
        for (let k = 0; k < chart.series.length; k++) {
          const point = chart.series[k].points[index];
          point.select(true, accumulate);
          if (!accumulate) {
            accumulate = true;
          }
        }
      }
    }
  }

  function DeselectChartsPoints(charts) {
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];
      const points = chart.getSelectedPoints();
      if (points.length > 0) {
        points[0].select(false, false);
      }
    }
  }

  function onHighchartsItemClickEventHandler(event) {
    const qViewer = qv.collection[this.chart.options.qv.viewerId];
    const seriesIndex = IsSplittedChart(qViewer)
      ? this.chart.options.qv.seriesIndex
      : event.point.series.index;
    let selected = false;
    if (qViewer.SelectionAllowed()) {
      if (qViewer.SelectionType == "Point") {
        event.point.select();
        selected = event.point.selected;
        if (
          qViewer.PlotSeries == QueryViewerPlotSeries.InSeparateCharts &&
          selected
        ) {
          for (let i = 0; i < qViewer.Charts.length; i++) {
            const chart = qViewer.Charts[i];
            const point = chart.series[0].points[event.point.index];
            if (point != event.point) {
              point.select(false);
            }
          }
        }
      } else {
        selected = ToggleChartsSelection(qViewer.Charts, event.point.index);
      }
    }
    if (
      qViewer.ItemClick &&
      qViewer.Metadata.Data[seriesIndex].RaiseItemClick
    ) {
      const serie = qViewer.Chart.Series.ByIndex[seriesIndex];
      const formattedValue = qv.util.formatNumber(
        event.point.y,
        serie.NumberFormat.DecimalPrecision,
        serie.Picture,
        false
      );
      const row = qViewer.Data.Rows[event.point.index];
      SetItemClickData(
        qViewer.ItemClickData,
        qViewer,
        serie.FieldName,
        QueryViewerElementType.Datum,
        formattedValue,
        selected,
        row
      );
      qViewer.ItemClick();
    }
  }

  function onHighchartsXAxisClickEventHandler(
    event,
    tickInd,
    tick,
    chart,
    raiseItemClick,
    selectionAllowed
  ) {
    const qViewer = qv.collection[chart.options.qv.viewerId];
    let selected = false;
    if (selectionAllowed && !IsTimelineChart(qViewer)) {
      selected = ToggleChartsSelection(qViewer.Charts, tick.pos);
    }
    if (raiseItemClick) {
      let name;
      if (qViewer.Chart.Categories.DataFields.length == 1) {
        const dataField = qViewer.Chart.Categories.DataFields[0];
        const axis = qv.util.GetAxisByDataField(qViewer, dataField);
        name = axis.Name;
      } else {
        name = "";
      }
      const row = qViewer.Data.Rows[tickInd];
      SetItemClickData(
        qViewer.ItemClickData,
        qViewer,
        name,
        QueryViewerElementType.Axis,
        tick.label.textStr,
        selected,
        row
      );
      qViewer.ItemClick();
    }
  }

  function GetBoldText(text) {
    return qv.util.dom.createSpan(
      null,
      "",
      "",
      "",
      { fontWeight: "bold" },
      null,
      text
    ).outerHTML;
  }

  function GetBoldRightText(text) {
    return qv.util.dom.createSpan(
      null,
      "",
      "",
      "",
      { fontWeight: "bold", textAlign: "right" },
      null,
      text
    ).outerHTML;
  }

  function CircularGaugeTooltipAndDataLabelFormatter(evArg, qViewer) {
    const seriesIndex = IsSplittedChart(qViewer)
      ? evArg.series.chart.options.qv.seriesIndex
      : evArg.series.index;
    const serie = qViewer.Chart.Series.ByIndex[seriesIndex];
    const chartSize =
      Math.min(
        qViewer.getContainerControl().offsetHeight,
        qViewer.getContainerControl().offsetWidth
      ) / NumberOfCharts(qViewer);
    const fontSize = chartSize / 13;
    return qv.util.dom.createSpan(
      null,
      "",
      "",
      "",
      {
        color: GetColorStringFromHighchartsObject(qViewer, evArg),
        fontSize: fontSize + "px"
      },
      null,
      qv.util.formatNumber(evArg.point.y, 2, "ZZZZZZZZZZZZZZ9.99", true) + "%"
    ).outerHTML;
  }

  function DataLabelFormatter(evArg, qViewer) {
    let seriesIndex = IsSplittedChart(qViewer)
      ? evArg.series.chart.options.qv.seriesIndex
      : evArg.series.index;
    seriesIndex = seriesIndex % qViewer.Chart.Series.ByIndex.length; // Cuando comparo hay el doble de series en la gráfica
    const chartSerie = qViewer.Chart.Series.ByIndex[seriesIndex];
    const multiplier =
      qViewer.RealChartType == QueryViewerChartType.LinearGauge
        ? chartSerie.TargetValue / 100
        : 1;
    const value = qv.util.formatNumber(
      evArg.point.y * multiplier,
      chartSerie.NumberFormat.DecimalPrecision,
      chartSerie.Picture,
      false
    );
    const chartType = evArg.series.chart.options.chart.type;
    const label = value;
    return label;
  }

  function TooltipFormatter(evArg, chartSeries, sharedTooltip) {
    let qViewer;
    if (!sharedTooltip) {
      qViewer = qv.collection[evArg.series.chart.options.qv.viewerId];
      var seriesIndex = evArg.series.index;
      var serie = chartSeries[seriesIndex];
      const picture = IsGaugeChart(qViewer)
        ? "ZZZZZZZZZZZZZZ9.99"
        : serie.Picture;
      const decimalPrecision = IsGaugeChart(qViewer)
        ? 2
        : serie.NumberFormat.DecimalPrecision;
      const removeTrailingZeroes = IsGaugeChart(qViewer);
      return qv.util.isRTL(qViewer)
        ? (IsGaugeChart(qViewer) ? "%" : "") +
            qv.util.formatNumber(
              evArg.point.y,
              decimalPrecision,
              picture,
              removeTrailingZeroes
            ) +
            "<b>: " +
            (evArg.point.name != "" ? evArg.point.name : evArg.series.name) +
            "<b>"
        : "<b>" +
            (evArg.point.name != "" ? evArg.point.name : evArg.series.name) +
            "</b>: " +
            qv.util.formatNumber(
              evArg.point.y,
              decimalPrecision,
              picture,
              removeTrailingZeroes
            ) +
            (IsGaugeChart(qViewer) ? "%" : "");
    } else {
      let firstPoint;
      let index;
      if (!evArg.points) {
        firstPoint = evArg.point;
        index = firstPoint.index;
      } else {
        firstPoint = evArg.points[0];
        index = firstPoint.point.index;
      }
      qViewer = qv.collection[firstPoint.series.chart.options.qv.viewerId];
      const hoverPoints = getHoverPoints(qViewer, index);
      const x = !evArg.key ? (!evArg.x ? "" : evArg.x) : evArg.key;
      const hasTitle =
        x != "" && qViewer.RealChartType != QueryViewerChartType.Sparkline; // en Sparkline la x no viene formateada
      let res = "";
      if (hasTitle) {
        qv.util.isRTL(qViewer)
          ? (res += GetBoldRightText(x))
          : (res += GetBoldText(x));
      }
      for (let i = 0; i < hoverPoints.length; i++) {
        const point = hoverPoints[i];
        var seriesIndex = point.series.chart.options.qv.seriesIndex;
        var serie = chartSeries[seriesIndex];
        if (qv.util.isRTL(qViewer)) {
          res +=
            (hasTitle || i > 0 ? "<br/>" : "") +
            qv.util.formatNumber(
              point.y,
              serie.NumberFormat.DecimalPrecision,
              serie.Picture,
              false
            );
          res += " :" + point.series.name;
        } else {
          res += (hasTitle || i > 0 ? "<br/>" : "") + point.series.name + ": ";
          res += qv.util.formatNumber(
            point.y,
            serie.NumberFormat.DecimalPrecision,
            serie.Picture,
            false
          );
        }
      }
      return res;
    }
  }

  function PieTooltipFormatter(evArg, sharedTooltip) {
    const qViewer = qv.collection[evArg.point.series.chart.options.qv.viewerId];
    if (!sharedTooltip) {
      var percentage = Math.round(evArg.point.percentage * 100) / 100;
      return qv.util.isRTL(qViewer)
        ? "%" +
            percentage +
            "<b>: " +
            (evArg.point.name != ""
              ? evArg.point.name
              : evArg.point.series.name) +
            "</b>"
        : "<b>" +
            (evArg.point.name != ""
              ? evArg.point.name
              : evArg.point.series.name) +
            "</b>: " +
            percentage +
            "%";
    } else {
      const hoverPoints = getHoverPoints(qViewer, evArg.point.index);
      const x = hoverPoints.length > 0 ? hoverPoints[0].id : "";
      const hasTitle = x != "";
      let res = "";
      if (hasTitle) {
        qv.util.isRTL(qViewer)
          ? (res += GetBoldRightText(x))
          : (res += GetBoldText(x));
      }
      for (let i = 0; i < hoverPoints.length; i++) {
        const point = hoverPoints[i];
        var percentage = Math.round(point.percentage * 100) / 100;
        if (qv.util.isRTL(qViewer)) {
          res += (hasTitle || i > 0 ? "<br/>" : "") + "%" + percentage;
          res += " :" + point.series.name;
        } else {
          res += (hasTitle || i > 0 ? "<br/>" : "") + point.series.name + ": ";
          res += percentage + "%";
        }
      }
      return res;
    }
  }

  function Stacked100TooltipFormatter(evArg, qViewer) {
    const percentage = Math.round(evArg.point.percentage * 100) / 100;
    return qv.util.isRTL(qViewer)
      ? "%" +
          percentage +
          "<b>: " +
          (evArg.point.id != "" ? evArg.point.id : evArg.series.name) +
          "</b>"
      : "<b>" +
          (evArg.point.id != "" ? evArg.point.id : evArg.series.name) +
          "</b>: " +
          percentage +
          "%";
  }

  function DateTimeTooltipFormatter(evArg, chartSeries) {
    function GetDuration(point) {
      const value = point.y;
      const points = point.series.data;
      const index = point.index;
      let duration = "";
      let max = index;
      for (var i = index + 1; i < points.length; i++) {
        if (points[i].y != value) {
          break;
        }
        max = i;
      }
      if (max < points.length - 1) {
        max++;
      }
      let min = index;
      for (var i = index - 1; i >= 0; i--) {
        if (points[i].y != value) {
          break;
        }
        min = i;
      }
      const seconds = (points[max].x - points[min].x) / 1000;
      duration =
        " (" +
        gx.getMessage("GXPL_QViewerDuration") +
        ": " +
        qv.util.seconsdToText(seconds) +
        ")";
      return duration;
    }

    let hoverPoints;
    const viewerId = evArg.points[0].series.chart.options.qv.viewerId;
    const qViewer = qv.collection[viewerId];
    if (IsSplittedChart(qViewer)) {
      hoverPoints = getHoverPoints(qViewer, evArg.points[0].point.index);
    } else {
      hoverPoints = [];
      jQuery.each(evArg.points, function (index, point) {
        hoverPoints.push(point.point);
      });
    }
    // Agrupa la lista de puntos por índice de la serie
    const points_by_strIndex = {};
    const compare = gx.dom.el(viewerId + "_options_compare_enable").checked;
    for (let i = 0; i < hoverPoints.length; i++) {
      const index = compare
        ? Math.trunc(hoverPoints[i].series.index / 2)
        : hoverPoints[i].series.index;
      var strIndex = index.toString();
      if (points_by_strIndex[strIndex] == undefined) {
        points_by_strIndex[strIndex] = [];
      }
      points_by_strIndex[strIndex].push(hoverPoints[i]);
    }
    let res = "";
    let currentTotal = 0;
    let previousTotal = 0;
    let oldUtc;
    let oldSeriesName;
    for (var strIndex in points_by_strIndex) {
      const seriesIndex = parseInt(strIndex);
      const serie = chartSeries[seriesIndex];
      const seriesName = serie.Name;
      const points = points_by_strIndex[strIndex];
      for (let ind = 0; points[ind] != undefined; ind++) {
        const p = points[ind];
        const utc = parseInt(p.real_x ? p.real_x : p.x);
        if (p.real_x) {
          previousTotal += p.y;
        } else {
          currentTotal += p.y;
        }
        if (compare) {
          if (oldSeriesName != seriesName) {
            qv.util.isRTL(qViewer)
              ? (res += GetBoldRightText(seriesName) + "<br/>")
              : (res += GetBoldText(seriesName) + "<br/>");
            oldSeriesName = seriesName;
          }
        } else if (oldUtc != utc) {
          qv.util.isRTL(qViewer)
            ? (res += GetBoldRightText(p.name) + "<br/>")
            : (res += GetBoldText(p.name) + "<br/>");
          oldUtc = utc;
        }
        const duration =
          qViewer.RealChartType == QueryViewerChartType.StepTimeline
            ? GetDuration(p)
            : "";
        var keySpan;
        const valueSpan = qv.util.dom.createSpan(
          null,
          "",
          "",
          "",
          {},
          null,
          qv.util.formatNumber(
            p.y,
            serie.NumberFormat.DecimalPrecision,
            serie.Picture,
            false
          )
        ).outerHTML;

        qv.util.isRTL(qViewer)
          ? (keySpan = qv.util.dom.createSpan(
              null,
              "",
              "",
              "",
              {},
              null,
              ": " + (compare ? p.name : seriesName)
            ).outerHTML)
          : (keySpan = qv.util.dom.createSpan(
              null,
              "",
              "",
              "",
              {},
              null,
              (compare ? p.name : seriesName) + ": "
            ).outerHTML);
        qv.util.isRTL(qViewer)
          ? (res += duration + valueSpan + keySpan + "<br/>")
          : (res += keySpan + valueSpan + duration + "<br/>");
      }
    }
    return res;
  }


  function groupPoints(
    chartCategories,
    chartSeriePoints,
    xAxisDataType,
    aggregation,
    groupOption
  ) {
    function getGroupStartPoint(
      dateStr,
      name,
      xAxisDataType,
      dateFormat,
      groupOption
    ) {
      function yearWith4Digits(xAxisDataType, name) {
        return xAxisDataType == QueryViewerDataType.Date
          ? name.length == 10
          : name.charAt(10) == " ";
      }

      function formatDate(
        dateStr,
        dateFormat,
        yearWith4Digits,
        includeMonth,
        includeDay
      ) {
        const year = dateStr.substr(0, 4);
        const month = dateStr.substr(5, 2);
        const day = dateStr.substr(8, 2);
        let date = dateFormat;
        if (!includeMonth) {
          date = date.replace("M", "");
        }
        if (!includeDay) {
          date = date.replace("D", "");
        }
        let newDate = "";
        for (let i = 0; i < date.length; i++) {
          newDate += i == 0 ? "" : "/";
          newDate += date.charAt(i);
        }
        date = newDate.replace("Y", yearWith4Digits ? year : year.substr(2, 2));
        if (includeMonth) {
          date = date.replace("M", month);
        }
        if (includeDay) {
          date = date.replace("D", day);
        }
        return date;
      }

      let dateStrStartPoint;
      let nameStartPoint;
      if (dateStr != "") {
        groupOption =
          groupOption ||
          (xAxisDataType == QueryViewerDataType.Date ? "Days" : "Seconds");
        switch (groupOption) {
          case "Years":
            dateStrStartPoint = dateStr.substr(0, 4) + "-01-01";
            nameStartPoint = formatDate(
              dateStrStartPoint,
              dateFormat,
              yearWith4Digits(xAxisDataType, name),
              false,
              false
            );
            break;
          case "Months":
            dateStrStartPoint = dateStr.substr(0, 7) + "-01";
            nameStartPoint = formatDate(
              dateStrStartPoint,
              dateFormat,
              yearWith4Digits(xAxisDataType, name),
              true,
              false
            );
            break;
          case "Semesters":
            var startingMonth = dateStr.substr(5, 2) <= "06" ? "01" : "07";
            dateStrStartPoint = dateStr.substr(0, 5) + startingMonth + "-01";
            var semester = dateStr.substr(5, 2) <= "06" ? "01" : "02";
            dateStrSemester = dateStr.substr(0, 5) + semester + "-01";
            nameStartPoint = formatDate(
              dateStrSemester,
              dateFormat,
              yearWith4Digits(xAxisDataType, name),
              true,
              false
            );
            break;
          case "Quarters":
            var startingMonth =
              dateStr.substr(5, 2) <= "03"
                ? "01"
                : dateStr.substr(5, 2) <= "06"
                ? "04"
                : dateStr.substr(5, 2) <= "09"
                ? "07"
                : "10";
            dateStrStartPoint = dateStr.substr(0, 5) + startingMonth + "-01";
            var quarter =
              dateStr.substr(5, 2) <= "03"
                ? "01"
                : dateStr.substr(5, 2) <= "06"
                ? "02"
                : dateStr.substr(5, 2) <= "09"
                ? "03"
                : "04";
            dateStrQuarter = dateStr.substr(0, 5) + quarter + "-01";
            nameStartPoint = formatDate(
              dateStrQuarter,
              dateFormat,
              yearWith4Digits(xAxisDataType, name),
              true,
              false
            );
            break;
          case "Weeks":
            var date = new gx.date.gxdate(dateStr, "Y4MD");
            var dow = gx.date.dow(date);
            date = gx.date.dtadd(date, -86400 * (dow - 1));
            dateStrStartPoint = qv.util.dateToString(date, false);
            nameStartPoint = formatDate(
              dateStrStartPoint,
              dateFormat,
              yearWith4Digits(xAxisDataType, name),
              true,
              true
            );
            break;
          case "Days":
            dateStrStartPoint =
              xAxisDataType == QueryViewerDataType.Date
                ? dateStr
                : dateStr.substr(0, 10);
            nameStartPoint =
              xAxisDataType == QueryViewerDataType.Date
                ? name
                : name.substr(0, 10);
            break;
          case "Hours":
            dateStrStartPoint = dateStr.substr(0, 13) + ":00:00";
            nameStartPoint = name.substr(0, 13) + ":00";
            break;
          case "Minutes":
            dateStrStartPoint = dateStr.substr(0, 16) + ":00";
            nameStartPoint = name.substr(0, 16);
            break;
          case "Seconds":
            dateStrStartPoint = dateStr;
            nameStartPoint = name;
            break;
        }
      } else {
        dateStrStartPoint = "";
        nameStartPoint = "";
      }
      return { dateStr: dateStrStartPoint, name: nameStartPoint };
    }

    let point;
    let lastStartPoint = { dateStr: null, name: null };
    let currentYValues = [];
    let currentYQuantities = [];
    const points = [];
    for (i = 0; i < chartSeriePoints.length; i++) {
      const name = chartCategories.Values[i].ValueWithPicture;
      const xValue = chartCategories.Values[i].Value;
      var yValue;
      var yQuantity;
      if (chartSeriePoints[i].Value != null) {
        if (aggregation == QueryViewerAggregationType.Count) {
          yValue = 0; // No se utiliza
          yQuantity = parseFloat(qv.util.trim(chartSeriePoints[i].Value));
        } else if (aggregation == QueryViewerAggregationType.Average) {
          yValue = parseFloat(qv.util.trim(chartSeriePoints[i].Value_N));
          yQuantity = parseFloat(qv.util.trim(chartSeriePoints[i].Value_D));
        } else {
          yValue = parseFloat(qv.util.trim(chartSeriePoints[i].Value));
          yQuantity = 1;
        }
      } else {
        yValue = null;
        yQuantity = 0;
      }
      const currentStartPoint = getGroupStartPoint(
        xValue,
        name,
        xAxisDataType,
        gx.dateFormat,
        groupOption
      );
      if (currentStartPoint.dateStr == lastStartPoint.dateStr || i == 0) {
        if (yValue != null) {
          currentYValues.push(yValue);
          currentYQuantities.push(yQuantity);
        }
        if (i == 0) {
          lastStartPoint = currentStartPoint;
        }
      } else {
        point = {
          x: lastStartPoint.dateStr,
          y: qv.util.aggregate(aggregation, currentYValues, currentYQuantities),
          name: lastStartPoint.name
        };
        points.push(point);
        lastStartPoint = currentStartPoint;
        currentYValues = [yValue];
        currentYQuantities = [yQuantity];
      }
    }
    if (currentYValues.length > 0 && currentYQuantities.length > 0) {
      point = {
        x: lastStartPoint.dateStr,
        y: qv.util.aggregate(aggregation, currentYValues, currentYQuantities),
        name: lastStartPoint.name
      };
      points.push(point);
    }
    return points;
  }

  function getSpacing(qViewer) {
    let spacingTop;
    let spacingRight;
    let spacingBottom;
    let spacingLeft;
    if (IsTimelineChart(qViewer)) {
      spacingTop = DEFAULTCHARTSPACING;
      spacingRight = 0;
      spacingBottom = DEFAULTCHARTSPACING;
      spacingLeft = 0;
    } else {
      spacingTop = DEFAULTCHARTSPACING;
      spacingRight = DEFAULTCHARTSPACING;
      spacingBottom = DEFAULTCHARTSPACING;
      spacingLeft = DEFAULTCHARTSPACING;
    }
    return [spacingTop, spacingRight, spacingBottom, spacingLeft];
  }

  function circularGaugeWidths(chartSeriesCount, serieNumber) {
    let width;
    let center;
    let lowerExtreme;
    let upperExtreme;
    if (chartSeriesCount <= 3) {
      width = 24;
    } else {
      width = 50 / (chartSeriesCount - 1) - 1;
    } // Para que no pase más del 50% del Gauge hacia adentro;
    center = 100 - (width + 1) * (serieNumber - 1);
    lowerExtreme = center - width / 2;
    upperExtreme = center + width / 2;
    return {
      Width: width,
      Center: center,
      LowerExtreme: lowerExtreme,
      UpperExtreme: upperExtreme
    };
  }

  function linearGaugeWidths(chartSeriesCount, serieNumber) {
    const width = 1 / chartSeriesCount / 2;
    const center = -0.5 + (serieNumber - 0.5) / chartSeriesCount;
    const lowerExtreme = center - width / 2;
    const upperExtreme = center + width / 2;
    return {
      Width: width,
      Center: center,
      LowerExtreme: lowerExtreme,
      UpperExtreme: upperExtreme
    };
  }

  function GetColorStringFromHighchartsObject(qViewer, highchartsObject) {
    function GetHighchartsDefaultColors(qViewer) {
      function LoadColorsObj(colorsObj, rules, rulePrefix, loadedColors) {
        if (!loadedColors) {
          loadedColors = 0;
        }
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (rule instanceof CSSStyleRule) {
            if (
              rule.selectorText &&
              rule.selectorText.indexOf(rulePrefix) == 0
            ) {
              const key = rule.selectorText.replace(rulePrefix, "");
              colorsObj[key] = rule.style.fill;
              loadedColors++;
            }
            if (loadedColors === HIGHCHARTS_MAX_COLORS) {
              break;
            }
          } else if (rule instanceof CSSImportRule) {
            const importedRules =
              rule.styleSheet.rules || rule.styleSheet.cssRules;
            LoadColorsObj(colorsObj, importedRules, rulePrefix, loadedColors);
          } else if (rule instanceof CSSLayerBlockRule) {
            const layeredRules = rule.cssRules;
            LoadColorsObj(colorsObj, layeredRules, rulePrefix, loadedColors);
          }
        }
      }

      if (!qViewer._HighchartsDefaultColors) {
        qViewer._HighchartsDefaultColors = [];
        const colorsObj = {};
        let styleSheet;
        let rulePrefix;
        styleSheet = qv.util.GetQueryViewerStyleSheet(qViewer); // Inicializo con los colores default del QueryViewer
        rulePrefix = ".highcharts-color-";
        LoadColorsObj(colorsObj, styleSheet.cssRules, rulePrefix);
        if (qViewer.Class != "") {
          styleSheet = qv.util.GetThemeStyleSheet(qViewer); // Sustituyo con los colores definidos en el tema
          rulePrefix =
            "." +
            qv.util.GetContainerControlClass(qViewer) +
            " " +
            ".highcharts-color-";
          LoadColorsObj(colorsObj, styleSheet.cssRules, rulePrefix);
        }
        for (let i = 0; i < HIGHCHARTS_MAX_COLORS; i++) {
          qViewer._HighchartsDefaultColors.push(colorsObj[i.toString()]);
        }
      }
      return qViewer._HighchartsDefaultColors;
    }

    const classPrefix = "highcharts-color-";
    let colorIndex;
    let color;
    if (
      highchartsObject.className &&
      highchartsObject.className.indexOf(classPrefix) == 0
    ) {
      colorIndex = parseInt(
        highchartsObject.className.replace(classPrefix, "")
      );
    } else {
      colorIndex = highchartsObject.colorIndex;
    }
    if (colorIndex < HIGHCHARTS_MAX_COLORS) {
      const defaultColors = GetHighchartsDefaultColors(qViewer);
      color = defaultColors[colorIndex];
    } else {
      color = HIGHCHARTS_CUSTOM_COLOR[colorIndex - HIGHCHARTS_MAX_COLORS];
      if (qv.util.color.IsHexaColor(color)) {
        color = "#" + color;
      }
    }
    return color;
  }

  function SetHighchartsColor(
    qViewer,
    highchartsObject,
    color,
    colorIndexForDefaultColors
  ) {
    function AddHighchartsCustomColor(qViewer, color) {
      let localColorIndex = HIGHCHARTS_CUSTOM_COLOR.indexOf(color);
      let globalColorIndex;
      if (localColorIndex < 0) {
        HIGHCHARTS_CUSTOM_COLOR.push(color);
        localColorIndex = HIGHCHARTS_CUSTOM_COLOR.length - 1;
        globalColorIndex = HIGHCHARTS_MAX_COLORS + localColorIndex;
        const prefix = qv.util.color.IsHexaColor(color) ? "#" : "";
        const rule =
          "." +
          HIGHCHARTS_COLOR_PREFIX +
          globalColorIndex +
          " {fill: " +
          prefix +
          color +
          "; stroke: " +
          prefix +
          color +
          ";}";
        const themeStyleSheet = qv.util.GetThemeStyleSheet(qViewer);
        themeStyleSheet.insertRule(rule, themeStyleSheet.cssRules.length);
      } else {
        globalColorIndex = HIGHCHARTS_MAX_COLORS + localColorIndex;
      }
      return globalColorIndex;
    }

    if (!qv.util.IsNullColor(color)) {
      let colorIndex;
      if (color.IsDefault) {
        colorIndex = color.ColorIndex;
      } else {
        colorIndex = AddHighchartsCustomColor(qViewer, color.Color);
      }
      if (colorIndexForDefaultColors) {
        highchartsObject.colorIndex = colorIndex;
      } else {
        highchartsObject.className = HIGHCHARTS_COLOR_PREFIX + colorIndex;
      } // Para PlotBands, por ejemplo, no anda setear el colorIndex
    }
  }

  function AddHighchartsCSSRules(qViewer) {
    // Workaround por no poder hacer estos seteos mediante la propiedad className en el tooltip
    if (qViewer.RealChartType == QueryViewerChartType.CircularGauge) {
      const themeStyleSheet = qv.util.GetThemeStyleSheet(qViewer);
      const rule =
        "#" +
        qViewer.ContainerName +
        " .highcharts-tooltip-box {fill: none !important; stroke-width: 0 !important; }";
      themeStyleSheet.insertRule(rule, themeStyleSheet.cssRules.length);
    }
  }


  function getAllHighchartOptions(qViewer) {
    const arrOptions = [];
    if (!IsSplittedChart(qViewer)) {
      var options = getHighchartOptions(qViewer, null, null);
      arrOptions.push(options);
    } else {
      for (
        let seriesIndex = 0;
        seriesIndex < qViewer.Chart.Series.ByIndex.length;
        seriesIndex++
      ) {
        const chartSerie = qViewer.Chart.Series.ByIndex[seriesIndex];
        var options = getHighchartOptions(qViewer, chartSerie, seriesIndex);
        arrOptions.push(options);
      }
    }
    return arrOptions;
  }

  

  function renderChart(qViewer) {
    const i = 0;
    const qvClasses = qv.util.GetContainerControlClasses(qViewer);
    if (qvClasses != "") {
      qv.util.SetUserControlClass(qViewer, qvClasses);
    }
    const errMsg = qv.util.ProcessDataAndMetadata(qViewer);
    if (errMsg == "") {
      splitChartContainer(qViewer);
      const arrOptions = getAllHighchartOptions(qViewer);
      AddHighchartsCSSRules(qViewer);
      SetHighchartsOptions();
      const HCCharts = [];
      for (let serie = 0; serie < arrOptions.length; serie++) {
        HCChart = new Highcharts.Chart(
          arrOptions[serie],
          HCFinishedLoadingCallback
        );
        HCCharts.push(HCChart);
      }
      qViewer.Charts = HCCharts;
      if (IsTimelineChart(qViewer)) {
        FillHeaderAndFooter(HCCharts, arrOptions);
      }
      qViewer._ControlRenderedTo = qViewer.RealType;
      qv.util.hideActivityIndicator(qViewer);
    } else {
      qv.util.renderError(qViewer, errMsg);
    }
  }

  // ------------------------------------------------------ Timeline ------------------------------------------------------

  var prevClickedZoomId = null;
  let viewerId = null;
  var TimelineHeaderHeight = 35;
  var TimelineFooterHeight = 50;

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // Determina si el navegador es Microsoft Internet Explorer en una version anterior a la 9
  function isOldIEf() {
    return gx.util.browser.isIE() && gx.util.browser.ieVersion() <= 8.0;
  }

  function getZoomId(z) {
    return viewerId + "_Zoom_" + z + "m";
  }

  function getZoomControl(z) {
    if (isNumeric(z)) {
      return gx.dom.el(getZoomId(z));
    }
    // control id
    else {
      return gx.dom.el(z);
    }
  }

  function changeZoomControlUnderline(z, decoration) {
    zoom = getZoomControl(z);
    if (zoom) {
      zoom.style.textDecoration = decoration;
    }
  }

  function selectZoom(z) {
    changeZoomControlUnderline(z, "underline");
  }

  function deselectZoom(z) {
    changeZoomControlUnderline(z, "none");
  }

  function triggerZoom(z) {
    zoom = getZoomControl(z);
    if (zoom) {
      zoom.onclick();
    } else if (z != 0) {
      // Intento con un zoom más alejado
      let newZoom;
      switch (z) {
        case 12:
          newZoom = 6;
          break;
        case 6:
          newZoom = 3;
          break;
        case 3:
          newZoom = 2;
          break;
        case 2:
          newZoom = 1;
          break;
        case 1:
          newZoom = 0;
          break;
      }
      triggerZoom(newZoom);
    }
  }

  function hideZoom(z) {
    zoom = getZoomControl(z);
    if (zoom) {
      zoom.style.display = "none";
    }
  }

  function showZoom(z) {
    zoom = getZoomControl(z);
    if (zoom) {
      zoom.style.display = "";
    }
  }

  function getSelectedZoomFactor() {
    return parseInt(
      prevClickedZoomId
        .substring(0, prevClickedZoomId.length - 1)
        .substring(prevClickedZoomId.indexOf("_Zoom_") + 6)
    );
  }

  // Esta funcion se invoca mas arriba en el handler del evento de seleccion de la timeline
  function deselectActiveZoom() {
    deselectZoom(prevClickedZoomId);
  }

  function EnableDisableCompareControls(qViewerId, enabled) {
    gx.dom.el(qViewerId + "_options_compare_enable").disabled = !enabled;
    gx.dom.el(qViewerId + "_options_compare_text").disabled = !enabled;
    gx.dom.el(qViewerId + "_options_compare_text").style.opacity = !enabled
      ? 0.5
      : 1;
    gx.dom.el(qViewerId + "_options_compare_options").disabled = !enabled;
    gx.dom.el(qViewerId + "_options_compare_options").style.opacity = !enabled
      ? 0.5
      : 1;
  }

  function EnableCompareControls(qViewerId, enabled) {
    EnableDisableCompareControls(qViewerId, true);
  }

  function DisableCompareControls(qViewerId, enabled) {
    EnableDisableCompareControls(qViewerId, false);
  }

  const sliderCursorWidth = 10;
  let sliderClickedOffsetX = 0;
  let sliderClickedqViewerId = "";
  let sliderClickedPaddingLeft = 0;
  let sliderClickedPaddingRight = 0;
  let sliderClickedRangeWidth = 0;
  let sliderClickedContainerWidth = 0;
  let sliderResizingLeft = false;
  let sliderResizingRight = false;
  let sliderMovingBar = false;

  function optionsId(qViewerId) {
    return qViewerId + "_options";
  }

  function centerId(qViewerId) {
    return qViewerId + "_center";
  }

  function footerId(qViewerId) {
    return qViewerId + "_footer";
  }

  function footerSliderId(qViewerId) {
    return qViewerId + "_footer_slider";
  }

  function footerChartId(qViewerId) {
    return qViewerId + "_footer_chart";
  }

  function footerRangeId(qViewerId) {
    return qViewerId + "_footer_range";
  }

  function footerLeftCursorId(qViewerId) {
    return qViewerId + "_footer_left_cursor";
  }

  function footerRightCursorId(qViewerId) {
    return qViewerId + "_footer_right_cursor";
  }

  function footerCenterId(qViewerId) {
    return qViewerId + "_footer_center";
  }

  function InitializeSlider(qViewerId, minValue, maxValue) {
    minValue = setMinAndMax(minValue, 0, 100);
    maxValue = setMinAndMax(maxValue, 0, 100);

    jQuery("#" + footerId(qViewerId))
      .css("width", "100%")
      .css("height", TimelineFooterHeight.toString() + "px");
    jQuery("#" + footerChartId(qViewerId))
      .css("width", "100%")
      .css("height", (TimelineFooterHeight - 2).toString() + "px");

    const controlWidth =
      qv.collection[qViewerId].getContainerControl().offsetWidth;
    let paddingLeft = (minValue * controlWidth) / 100;
    let paddingRight = ((100 - maxValue) * controlWidth) / 100;
    // Fix: PaddingLeft y PaddingRight deben dejar lugar para los cursores. Esto hace que no se pueda llegar a un rango de tamaño cero nunca, pero queda feo si se solapan los cursores
    if (controlWidth - paddingLeft - paddingRight < 2 * sliderCursorWidth) {
      const pixelsToRemove =
        2 * sliderCursorWidth - (controlWidth - paddingLeft - paddingRight);
      let pixelsToRemoveLeft;
      let pixelsToRemoveRight;
      if (pixelsToRemove % 2 == 0) {
        pixelsToRemoveLeft = pixelsToRemove / 2;
      } else {
        pixelsToRemoveLeft = (pixelsToRemove + 1) / 2;
      }
      pixelsToRemoveRight = pixelsToRemove - pixelsToRemoveLeft;
      paddingLeft -= pixelsToRemoveLeft;
      paddingRight -= pixelsToRemoveRight;
      if (paddingLeft < 0) {
        paddingRight += paddingLeft;
        paddingLeft = 0;
      }
      if (paddingRight < 0) {
        paddingLeft += paddingRight;
        paddingRight = 0;
      }
    }
    const width = controlWidth - paddingLeft - paddingRight;

    jQuery("#" + footerSliderId(qViewerId))
      .css("width", "100%")
      .css("height", TimelineFooterHeight.toString() + "px")
      .css(
        "padding-left",
        ((100 * paddingLeft) / controlWidth).toString() + "%"
      )
      .css(
        "padding-right",
        ((100 * paddingRight) / controlWidth).toString() + "%"
      );
    jQuery("#" + footerRangeId(qViewerId))
      .css("width", "100%")
      .css("height", TimelineFooterHeight.toString() + "px");
    jQuery("#" + footerLeftCursorId(qViewerId))
      .css("width", sliderCursorWidth.toString() + "px")
      .css("height", TimelineFooterHeight.toString() + "px");
    jQuery("#" + footerRightCursorId(qViewerId))
      .css("width", sliderCursorWidth.toString() + "px")
      .css("height", TimelineFooterHeight.toString() + "px");
    jQuery("#" + footerCenterId(qViewerId))
      .css("width", "calc(100% - " + 2 * sliderCursorWidth + "px)")
      .css("height", TimelineFooterHeight.toString() + "px")
      .css("left", sliderCursorWidth.toString() + "px");
  }

  function setMin(value, minValue) {
    return Math.max(value, minValue);
  }

  function setMax(value, maxValue) {
    return Math.min(value, maxValue);
  }

  function setMinAndMax(value, minValue, maxValue) {
    return setMax(setMin(value, minValue), maxValue);
  }

  function normalizedSliderOffset(qViewerId, event) {
    const paddingLeft = parseInt(
      jQuery("#" + footerSliderId(qViewerId)).css("padding-left")
    );
    const barWidth = parseInt(
      jQuery("#" + footerRangeId(qViewerId)).css("width")
    );
    let offsetX;
    if (event.originalEvent.touches) {
      offsetX =
        event.originalEvent.touches[0].pageX -
        event.originalEvent.touches[0].target.offsetLeft;
    } else {
      offsetX = event.offsetX;
    }
    switch (event.target.id) {
      case footerSliderId(qViewerId):
        return offsetX;
      case footerLeftCursorId(qViewerId):
        return offsetX + paddingLeft;
      case footerCenterId(qViewerId):
        return offsetX + paddingLeft;
      case footerRightCursorId(qViewerId):
        return offsetX + paddingLeft + barWidth - sliderCursorWidth;
    }
  }

  function attachSliderEvents(qViewerId) {
    function leftCursorMousedown(event) {
      event.preventDefault();
      sliderResizingLeft = true;
    }

    function rightCursorMousedown(event) {
      event.preventDefault();
      sliderResizingRight = true;
    }

    function centerMousedown(event) {
      event.preventDefault();
      if (!sliderResizingLeft && !sliderResizingRight) {
        sliderMovingBar = true;
      }
    }

    function sliderMousedown(event) {
      event.preventDefault();
      sliderClickedqViewerId = qViewerId;
      const slider = jQuery("#" + footerSliderId(sliderClickedqViewerId));
      const range = jQuery("#" + footerRangeId(sliderClickedqViewerId));
      const paddingLeft = parseInt(slider.css("padding-left"));
      sliderClickedOffsetX = normalizedSliderOffset(
        sliderClickedqViewerId,
        event
      );
      sliderClickedPaddingLeft = parseInt(slider.css("padding-left"));
      sliderClickedPaddingRight = parseInt(slider.css("padding-right"));
      sliderClickedContainerWidth = parseInt(slider.css("width"));
      sliderClickedRangeWidth = parseInt(range.css("width"));
    }

    function documentMouseup(event) {
      if (sliderMovingBar || sliderResizingRight || sliderResizingLeft) {
        const slider = jQuery("#" + footerSliderId(sliderClickedqViewerId));
        const qViewer = qv.collection[sliderClickedqViewerId];
        const compare = gx.dom.el(
          sliderClickedqViewerId + "_options_compare_enable"
        ).checked;
        const controlWidth = qViewer.getContainerControl().offsetWidth;
        let containerId;
        let containers;
        if (IsTimelineChart(qViewer)) {
          containerId = centerId(qViewer.userControlId());
        } else {
          containerId = qViewer.getContainerControl().id;
        }
        if (IsSplittedChart(qViewer)) {
          containers = jQuery("[id^=" + containerId + "_chart]");
        } else {
          containers = jQuery("#" + containerId);
        }
        const charts = [];
        jQuery.each(containers, function (index, div) {
          const chart = jQuery("#" + div.id).highcharts();
          charts.push(chart);
        });
        const firstChart = charts[0];
        const paddingLeft = parseInt(slider.css("padding-left"));
        const paddingRight = parseInt(slider.css("padding-right"));
        const minPercent = (100 * paddingLeft) / controlWidth;
        const maxPercent = 100 * (1 - paddingRight / controlWidth);
        if (minPercent == 0 && maxPercent == 100) {
          jQuery.each(charts, function (index, chart) {
            chart.zoomOut();
          });
        } else {
          const extremes = firstChart.get("xaxis").getExtremes();
          const qvOptions = firstChart.options.qv;
          const minDate =
            qvOptions.dataMin +
            (minPercent / 100) * (qvOptions.dataMax - qvOptions.dataMin);
          const maxDate =
            qvOptions.dataMin +
            (maxPercent / 100) * (qvOptions.dataMax - qvOptions.dataMin);
          const redraw = !compare;
          jQuery.each(charts, function (index, chart) {
            chart.get("xaxis").setExtremes(minDate, maxDate, redraw);
          });
        }
        if (compare) {
          GroupAndCompareFunction(charts);
        }
        if (sliderResizingRight || sliderResizingLeft) {
          deselectZoom(prevClickedZoomId);
          prevClickedZoomId = null;
        }
      }
      sliderMovingBar = false;
      sliderResizingLeft = false;
      sliderResizingRight = false;
    }

    function sliderMousemove(event) {
      if (sliderMovingBar || sliderResizingRight || sliderResizingLeft) {
        let increment =
          normalizedSliderOffset(sliderClickedqViewerId, event) -
          sliderClickedOffsetX;
        if (sliderResizingLeft) {
          increment = setMax(
            increment,
            sliderClickedRangeWidth - 2 * sliderCursorWidth
          );
        } else {
          increment = setMax(increment, sliderClickedPaddingRight);
        }
        if (sliderResizingRight) {
          increment = setMin(
            increment,
            -sliderClickedRangeWidth + 2 * sliderCursorWidth
          );
        } else {
          increment = setMin(increment, -sliderClickedPaddingLeft);
        }
        if (increment != 0) {
          const center = jQuery("#" + footerCenterId(sliderClickedqViewerId));
          const slider = jQuery("#" + footerSliderId(sliderClickedqViewerId));
          const range = jQuery("#" + footerRangeId(sliderClickedqViewerId));
          if (sliderResizingLeft) {
            slider.css(
              "padding-left",
              (
                (100 * (sliderClickedPaddingLeft + increment)) /
                sliderClickedContainerWidth
              ).toString() + "%"
            );
          } else if (sliderResizingRight) {
            slider.css(
              "padding-right",
              (
                (100 * (sliderClickedPaddingRight - increment)) /
                sliderClickedContainerWidth
              ).toString() + "%"
            );
          } else {
            slider.css(
              "padding-left",
              (
                (100 * (sliderClickedPaddingLeft + increment)) /
                sliderClickedContainerWidth
              ).toString() + "%"
            );
            slider.css(
              "padding-right",
              (
                (100 * (sliderClickedPaddingRight - increment)) /
                sliderClickedContainerWidth
              ).toString() + "%"
            );
          }
        }
      }
    }

    const leftCursor = jQuery("#" + footerLeftCursorId(qViewerId));
    const rightCursor = jQuery("#" + footerRightCursorId(qViewerId));
    const center = jQuery("#" + footerCenterId(qViewerId));
    const slider = jQuery("#" + footerSliderId(qViewerId));
    const range = jQuery("#" + footerRangeId(qViewerId));

    // Attachments for mouse events
    leftCursor.mousedown(function (event) {
      leftCursorMousedown(event);
    });
    rightCursor.mousedown(function (event) {
      rightCursorMousedown(event);
    });
    center.mousedown(function (event) {
      centerMousedown(event);
    });
    slider.mousedown(function (event) {
      sliderMousedown(event);
    });
    jQuery(document).mouseup(function (event) {
      documentMouseup(event);
    });
    slider.mousemove(function (event) {
      sliderMousemove(event);
    });

    // Attachments for finger events
    leftCursor.on("touchstart", function (event) {
      leftCursorMousedown(event);
    });
    rightCursor.on("touchstart", function (event) {
      rightCursorMousedown(event);
    });
    center.on("touchstart", function (event) {
      centerMousedown(event);
    });
    slider.on("touchstart", function (event) {
      sliderMousedown(event);
    });
    jQuery(document).on("touchend", function (event) {
      documentMouseup(event);
    });
    jQuery(document).on("touchcancel", function (event) {
      documentMouseup(event);
    });
    slider.on("touchmove", function (event) {
      sliderMousemove(event);
    });
  }

  function CreateFooter(parent, qViewerId) {
    const div1 = qv.util.dom.createDiv(
      parent,
      footerSliderId(qViewerId),
      "gx-qv-footer-slider",
      "",
      {},
      ""
    );
    const div2 = qv.util.dom.createDiv(
      div1,
      footerRangeId(qViewerId),
      "gx-qv-footer-range",
      "",
      {},
      ""
    );
    qv.util.dom.createDiv(
      div2,
      footerLeftCursorId(qViewerId),
      "gx-qv-footer-left-cursor",
      "",
      {},
      ""
    );
    qv.util.dom.createDiv(
      div2,
      footerRightCursorId(qViewerId),
      "gx-qv-footer-right-cursor",
      "",
      {},
      ""
    );
    qv.util.dom.createDiv(
      div2,
      footerCenterId(qViewerId),
      "gx-qv-footer-center",
      "",
      {},
      ""
    );
    qv.util.dom.createDiv(
      parent,
      footerChartId(qViewerId),
      "gx-qv-footer-chart",
      "",
      {},
      ""
    );
  }

  function getTimelineFooterChartOptions(qViewer, arrOptions) {
    const containerId = footerChartId(qViewer.userControlId());
    const chartType =
      qViewer.RealChartType == QueryViewerChartType.SmoothTimeline
        ? "spline"
        : "line";
    const step =
      qViewer.RealChartType == QueryViewerChartType.StepTimeline ? "left" : "";
    const series = [];
    if (!IsSplittedChart(qViewer)) {
      for (var i = 0; i < arrOptions[0].series.length; i++)
        {series.push(arrOptions[0].series[i]);}}
    } else {
      for (var i = 0; i < arrOptions.length; i++) {
        series.push(arrOptions[i].series[0]);
      }
    }
    return qv.chart.getSparklineChartOptions(
      qViewer,
      containerId,
      chartType,
      false,
      step,
      series
    );
  }

  function GroupAndCompareFunction(charts) {
    const firstChart = charts[0];
    const viewerId = firstChart.options.qv.viewerId;
    const qViewer = qv.collection[viewerId];

    // Chequea si esta marcado el chkbox que indica que se quiere comparar
    const compare = gx.dom.el(viewerId + "_options_compare_enable").checked;

    // Obtiene el tipo de periodo contra el que se quiere comparar
    const extremes = firstChart.get("xaxis").getExtremes();
    if (extremes.userMin != undefined) {
      extremes.min = extremes.userMin;
    } // Sin esto, la llamada a setextremes (con redraw en false) realizado en el zoom no actualiza el min hasta el próximo dibujado.
    if (extremes.userMax != undefined) {
      extremes.max = extremes.userMax;
    } // Sin esto, la llamada a setextremes (con redraw en false) realizado en el zoom no actualiza el min hasta el próximo dibujado.

    if (compare) {
      const options = gx.dom.el(viewerId + "_options_compare_options").children;
      var selectedOptionValue;
      for (
        ind = 0;
        options[ind] != undefined && selectedOptionValue == undefined;
        ind++
      ) {
        if (options[ind].selected) {
          selectedOptionValue = options[ind].value;
        }
      }
      var minDateCompare;
      var maxDateCompare;
      if (selectedOptionValue == "PrevPeriod") {
        maxDateCompare = new Date(extremes.min);
        minDateCompare = new Date(extremes.min - (extremes.max - extremes.min));
      } else if (selectedOptionValue == "PrevYear") {
        minDateCompare = new Date(extremes.min);
        minDateCompare = new Date(
          minDateCompare.setFullYear(minDateCompare.getFullYear() - 1)
        );
        maxDateCompare = new Date(extremes.max);
        maxDateCompare = new Date(
          maxDateCompare.setFullYear(maxDateCompare.getFullYear() - 1)
        );
      }
      minDateCompare = minDateCompare.getTime();
      maxDateCompare = maxDateCompare.getTime();

      hideZoom(viewerId + "_Zoom_0m"); // Si esta habilitada la comparación oculto el zoom all
    } else {
      showZoom(viewerId + "_Zoom_0m");
    }

    // Elimina todas las series existentes de la grafica
    jQuery.each(charts, function (index, chart) {
      const series_colorIndexes = [];
      while (chart.series.length > 0) {
        if (!chart.options.qv.colorIndexesUsed) {
          series_colorIndexes.push(chart.series[0].colorIndex);
        }
        chart.series[0].remove(true);
      }
      if (!chart.options.qv.colorIndexesUsed) {
        chart.options.qv.colorIndexesUsed = series_colorIndexes;
      }
    });

    // Carga las series con los datos que correspondan
    let ns = 0;
    for (
      let seriesIndex = 0;
      seriesIndex < qViewer.Chart.Series.ByIndex.length;
      seriesIndex++
    ) {
      const chartSerie = qViewer.Chart.Series.ByIndex[seriesIndex];
      seriesName = chartSerie.Name;
      var chart;
      var serieColorIndex;
      if (IsSplittedChart(qViewer)) {
        chart = charts[ns];
        serieColorIndex = chart.options.qv.colorIndexesUsed[0];
      } else {
        chart = firstChart;
        serieColorIndex = chart.options.qv.colorIndexesUsed[ns];
      }

      // Serie con el periodo seleccionado por el usuario
      const serie1 = {};
      serie1.turboThreshold = 0;
      serie1.colorIndex = serieColorIndex;
      serie1.id = seriesName + "1";
      serie1.name = seriesName;
      serie1.data = [];

      if (compare) {
        // Serie con el periodo contra el que se va a comparar
        var serie2 = {};
        serie2.className = "highcharts-dashed-series-line";
        serie2.turboThreshold = 0;
        serie2.colorIndex = serieColorIndex;
        serie2.id = seriesName + "2";
        serie2.name = seriesName;
        serie2.data = [];
      }

      var points;
      const groupOption = document.getElementById(
        viewerId + "_options_group_options"
      ).value;
      points = groupPoints(
        qViewer.Chart.Categories,
        chartSerie.Points,
        qv.util.XAxisDataType(qViewer),
        chartSerie.Aggregation,
        groupOption
      );

      for (i = 0; i < points.length; i++) {
        const value = points[i].y;
        const date = new gx.date.gxdate(points[i].x, "Y4MD");
        const name = points[i].name;
        const timeValue1 =
          date.Value.getTime() - date.Value.getTimezoneOffset() * 60000;
        const original_time_value =
          date.Value.getTime() - date.Value.getTimezoneOffset() * 60000;
        if (compare) {
          let addToSerie1 = false;
          let addToSerie2 = false;
          if (timeValue1 <= extremes.max && timeValue1 >= extremes.min) {
            addToSerie1 = true;
          }
          if (timeValue1 <= maxDateCompare && timeValue1 >= minDateCompare) {
            addToSerie2 = true;
            const tmpDate = new Date(timeValue1);
            var timeValue2;
            if (selectedOptionValue == "PrevPeriod") {
              if (chart.options.qv.predef_zoom == "1m") {
                timeValue2 = tmpDate.setMonth(tmpDate.getMonth() + 1);
              } else if (chart.options.qv.predef_zoom == "2m") {
                timeValue2 = tmpDate.setMonth(tmpDate.getMonth() + 2);
              } else if (chart.options.qv.predef_zoom == "3m") {
                timeValue2 = tmpDate.setMonth(tmpDate.getMonth() + 3);
              } else if (chart.options.qv.predef_zoom == "6m") {
                timeValue2 = tmpDate.setMonth(tmpDate.getMonth() + 6);
              } else if (chart.options.qv.predef_zoom == "12m") {
                timeValue2 = tmpDate.setFullYear(tmpDate.getFullYear() + 1);
              } else {
                timeValue2 += extremes.max - extremes.min;
              }
            } else if (selectedOptionValue == "PrevYear") {
              timeValue2 = tmpDate.setFullYear(tmpDate.getFullYear() + 1);
            }
          }
          if (addToSerie1) {
            var point = {};
            point.x = timeValue1;
            point.y = value;
            point.name = name;
            serie1.data.push(point);
          }
          if (addToSerie2) {
            var point = {};
            point.x = timeValue2;
            point.y = value;
            point.name = name;
            point.real_x = original_time_value;
            serie2.data.push(point);
          }
        } else {
          serie1.data.push({ x: timeValue1, y: value, name: name });
        }
      }

      chart.addSeries(serie1);
      if (compare) {
        chart.addSeries(serie2);
      }
      ns++;
    }
  }

  function getSuitableZoomFactor(points, maxPoints) {
    if (points.length < maxPoints) {
      return 0;
    } else {
      const maxValue = points[points.length - 1].x;
      const minValue = points[points.length - maxPoints].x;
      const cantMeses = (maxValue - minValue) / 1000 / 3600 / 24 / (365 / 12);
      if (cantMeses <= 1) {
        return 1;
      } else if (cantMeses <= 2) {
        return 2;
      } else if (cantMeses <= 3) {
        return 3;
      } else if (cantMeses <= 6) {
        return 6;
      } else {
        return 12;
      }
    }
  }

  function FillHeaderAndFooter(charts, arrOptions) {
    function CreateGroupByCombo(
      parent,
      qViewer,
      showYears,
      showSemesters,
      showQuarters,
      showMonths,
      showWeeks,
      showHours,
      showMinutes
    ) {
      const qViewerId = qViewer.userControlId();
      const select = qv.util.dom.createSelect(
        parent,
        optionsId(qViewerId) + "_group_options"
      );
      if (qv.util.XAxisDataType(qViewer) == QueryViewerDataType.DateTime) {
        qv.util.dom.createOption(
          select,
          "Seconds",
          qViewer._groupOption == "Seconds",
          gx.getMessage("GXPL_QViewerSeconds")
        );
        if (showMinutes) {
          qv.util.dom.createOption(
            select,
            "Minutes",
            qViewer._groupOption == "Minutes",
            gx.getMessage("GXPL_QViewerMinutes")
          );
          if (showHours) {
            qv.util.dom.createOption(
              select,
              "Hours",
              qViewer._groupOption == "Hours",
              gx.getMessage("GXPL_QViewerHours")
            );
          }
        }
      }
      if (
        showDays ||
        qv.util.XAxisDataType(qViewer) == QueryViewerDataType.Date
      ) {
        qv.util.dom.createOption(
          select,
          "Days",
          qViewer._groupOption == "Days",
          gx.getMessage("GXPL_QViewerDays")
        );
        if (showWeeks) {
          qv.util.dom.createOption(
            select,
            "Weeks",
            qViewer._groupOption == "Weeks",
            gx.getMessage("GXPL_QViewerWeeks")
          );
          if (showMonths) {
            qv.util.dom.createOption(
              select,
              "Months",
              qViewer._groupOption == "Months",
              gx.getMessage("GXPL_QViewerMonths")
            );
            if (showQuarters) {
              qv.util.dom.createOption(
                select,
                "Quarters",
                qViewer._groupOption == "Quarters",
                gx.getMessage("GXPL_QViewerQuarters")
              );
              if (showSemesters) {
                qv.util.dom.createOption(
                  select,
                  "Semesters",
                  qViewer._groupOption == "Semesters",
                  gx.getMessage("GXPL_QViewerSemesters")
                );
                if (showYears) {
                  qv.util.dom.createOption(
                    select,
                    "Years",
                    qViewer._groupOption == "Years",
                    gx.getMessage("GXPL_QViewerYears")
                  );
                }
              }
            }
          }
        }
      }
      return select;
    }

    function CreateHeader(
      parent,
      qViewer,
      include1m,
      include2m,
      include3m,
      include6m,
      include1y,
      showYears,
      showSemesters,
      showQuarters,
      showMonths,
      showWeeks,
      showHours,
      showMinutes
    ) {
      function CreateHeaderGroup(parent) {
        return qv.util.dom.createDiv(
          parent,
          "",
          "QVTimelineHeaderGroup",
          "",
          { height: TimelineHeaderHeight + "px", flexGrow: 1 },
          ""
        );
      }

      function CreateZoomItem(parent, text, id) {
        return qv.util.dom.createAnchor(
          parent,
          id,
          { cursor: "pointer", paddingLeft: "6px" },
          text
        );
      }

      const qViewerId = qViewer.userControlId();
      const divFlexTable = qv.util.dom.createDiv(
        parent,
        "",
        "QVTimelineHeader",
        "",
        { display: "flex", flexDirection: "row", flexWrap: "wrap" },
        ""
      );
      const headerGroup1 = CreateHeaderGroup(divFlexTable);
      const headerGroup2 = CreateHeaderGroup(divFlexTable);
      const headerGroup3 = CreateHeaderGroup(divFlexTable);

      const headerGroup1Div = qv.util.dom.createDiv(
        headerGroup1,
        "",
        "",
        "",
        { float: "left" },
        ""
      );

      // Zoom
      qv.util.dom.createText(
        headerGroup1Div,
        gx.getMessage("GXPL_QViewerJSChartZoom")
      );
      if (include1m) {
        CreateZoomItem(
          headerGroup1Div,
          gx.getMessage("GXPL_QViewerJSChartZoomLevelToOneMonth"),
          qViewerId + "_Zoom_1m"
        );
        if (include2m) {
          CreateZoomItem(
            headerGroup1Div,
            gx.getMessage("GXPL_QViewerJSChartZoomLevelToTwoMonth"),
            qViewerId + "_Zoom_2m"
          );
          if (include3m) {
            CreateZoomItem(
              headerGroup1Div,
              gx.getMessage("GXPL_QViewerJSChartZoomLevelToThreeMonth"),
              qViewerId + "_Zoom_3m"
            );
            if (include6m) {
              CreateZoomItem(
                headerGroup1Div,
                gx.getMessage("GXPL_QViewerJSChartZoomLevelToSixMonth"),
                qViewerId + "_Zoom_6m"
              );
              if (include1y) {
                CreateZoomItem(
                  headerGroup1Div,
                  gx.getMessage("GXPL_QViewerJSChartZoomLevelToOneYear"),
                  qViewerId + "_Zoom_12m"
                );
              }
            }
          }
        }
      }
      CreateZoomItem(
        headerGroup1Div,
        gx.getMessage("GXPL_QViewerJSChartZoomLevelToAll"),
        qViewerId + "_Zoom_0m"
      );

      // Group by
      const headerGroup2Div = qv.util.dom.createDiv(
        headerGroup2,
        "",
        "",
        "",
        { float: "right", paddingLeft: "12px" },
        ""
      );
      qv.util.dom.createSpan(
        headerGroup2Div,
        optionsId(qViewerId) + "_groupby_text",
        "",
        "",
        { whiteSpace: "nowrap", paddingRight: "6px" },
        null,
        gx.getMessage("GXPL_QViewerGroupBy")
      );
      CreateGroupByCombo(
        headerGroup2Div,
        qViewer,
        showYears,
        showSemesters,
        showQuarters,
        showMonths,
        showWeeks,
        showHours,
        showMinutes
      );

      // Compare to
      const headerGroup3Div = qv.util.dom.createDiv(
        headerGroup3,
        "",
        "",
        "",
        { float: "right", paddingLeft: "12px" },
        ""
      );
      qv.util.dom.createInput(
        headerGroup3Div,
        optionsId(qViewerId) + "_compare_enable",
        "checkbox",
        { verticalAlign: "text-bottom" }
      );
      qv.util.dom.createSpan(
        headerGroup3Div,
        optionsId(qViewerId) + "_compare_text",
        "",
        "",
        { whiteSpace: "nowrap", paddingRight: "6px", paddingLeft: "6px" },
        null,
        gx.getMessage("GXPL_QViewerCompareWith")
      );
      const select = qv.util.dom.createSelect(
        headerGroup3Div,
        optionsId(qViewerId) + "_compare_options"
      );
      qv.util.dom.createOption(
        select,
        "PrevPeriod",
        false,
        gx.getMessage("GXPL_QViewerPreviousPeriod")
      );
      qv.util.dom.createOption(
        select,
        "PrevYear",
        false,
        gx.getMessage("GXPL_QViewerPreviousYear")
      );

      return divFlexTable;
    }

    // Crea un nuevo div conteniendo los links para hacer zoom predefenidos programaticamente.
    const firstChart = charts[0];
    viewerId = firstChart.options.qv.viewerId;
    const qViewer = qv.collection[viewerId];
    const divOptions = document.getElementById(optionsId(viewerId));
    const divFooter = document.getElementById(footerId(viewerId));

    const extremes = firstChart.get("xaxis").getExtremes();
    const winTime = extremes.dataMax - extremes.dataMin;
    jQuery.each(charts, function (index, chart) {
      chart.options.qv.dataMax = extremes.dataMax;
      chart.options.qv.dataMin = extremes.dataMin;
    });
    const moreThanOneMonth = winTime > 30.42 * 24 * 3600 * 1000;
    const moreThanTwoMonths = winTime > 60.83 * 24 * 3600 * 1000;
    const moreThanThreeMonths = winTime > 91.25 * 24 * 3600 * 1000;
    const moreThanSixMonths = winTime > 182.5 * 24 * 3600 * 1000;
    const moreThanOneYear = winTime > 365 * 24 * 3600 * 1000;

    qViewer._groupOption =
      qViewer._groupOption ||
      (qv.util.XAxisDataType(qViewer) == QueryViewerDataType.Date
        ? "Days"
        : "Seconds");

    const minDate = new gx.date.gxdate("");
    const maxDate = new gx.date.gxdate("");
    minDate.Value.setTime(
      extremes.dataMin + minDate.Value.getTimezoneOffset() * 60000
    );
    maxDate.Value.setTime(
      extremes.dataMax + maxDate.Value.getTimezoneOffset() * 60000
    );

    let showYears = true;
    let showSemesters = true;
    let showQuarters = true;
    let showMonths = true;
    let showWeeks = true;
    var showDays = true;
    let showHours = true;
    let showMinutes = true;

    if (gx.date.year(minDate) == gx.date.year(maxDate)) {
      showYears = false;
      if (!(gx.date.month(minDate) <= 6 && gx.date.month(maxDate) >= 7)) {
        showSemesters = false;
        if (
          !(
            (gx.date.month(minDate) <= 3 && gx.date.month(maxDate) >= 4) ||
            (gx.date.month(minDate) <= 6 && gx.date.month(maxDate) >= 7) ||
            (gx.date.month(minDate) <= 9 && gx.date.month(maxDate) >= 10)
          )
        ) {
          showQuarters = false;
          if (gx.date.month(minDate) == gx.date.month(maxDate)) {
            showMonths = false;
            if (
              gx.date.day(minDate) - gx.date.dow(minDate) ==
              gx.date.day(maxDate) - gx.date.dow(maxDate)
            ) {
              showWeeks = false;
              if (gx.date.day(minDate) == gx.date.day(maxDate)) {
                showDays = false;
                if (gx.date.hour(minDate) == gx.date.hour(maxDate)) {
                  showHours = false;
                  if (gx.date.minute(minDate) == gx.date.minute(maxDate)) {
                    showMinutes = false;
                  }
                }
              }
            }
          }
        }
      }
    }

    CreateHeader(
      divOptions,
      qViewer,
      moreThanOneMonth,
      moreThanTwoMonths,
      moreThanThreeMonths,
      moreThanSixMonths,
      moreThanOneYear,
      showYears,
      showSemesters,
      showQuarters,
      showMonths,
      showWeeks,
      showHours,
      showMinutes
    );
    CreateFooter(divFooter, viewerId);
    attachSliderEvents(viewerId);

    ////////////////////////////////////////////////////////////////////////////////////////////
    // Event handlers para las opciones de "compare to past"
    ////////////////////////////////////////////////////////////////////////////////////////////

    gx.dom.el(divOptions.id + "_compare_enable").onclick = function () {
      GroupAndCompareFunction(charts);
    };
    gx.dom.el(divOptions.id + "_compare_options").onchange = function () {
      if (gx.dom.el(divOptions.id + "_compare_enable").checked) {
        GroupAndCompareFunction(charts);
      }
    };
    gx.dom.el(divOptions.id + "_group_options").onchange = function () {
      GroupAndCompareFunction(charts);
    };
    const doZoom = function (zoomFactor) {
      let compare = gx.dom.el(divOptions.id + "_compare_enable").checked;

      if (zoomFactor > 0) {
        let minDate, maxDate;
        let extremes = firstChart.get("xaxis").getExtremes();
        maxDate = extremes.dataMax;
        minDate = maxDate - 30.417 * zoomFactor * 24 * 3600 * 1000; // 30.4166 = 365dias/12meses
        let redraw = !compare;
        jQuery.each(charts, function (index, chart) {
          chart.get("xaxis").setExtremes(minDate, maxDate, redraw);
        });
        let qvOptions = firstChart.options.qv;
        let minPercent =
          ((minDate - qvOptions.dataMin) /
            (qvOptions.dataMax - qvOptions.dataMin)) *
          100;
        let maxPercent =
          ((maxDate - qvOptions.dataMin) /
            (qvOptions.dataMax - qvOptions.dataMin)) *
          100;
        InitializeSlider(
          firstChart.options.qv.viewerId,
          minPercent,
          maxPercent
        );

        EnableCompareControls(firstChart.options.qv.viewerId, true);
      } // Zoom All
      else {
        jQuery.each(charts, function (index, chart) {
          chart.zoomOut();
        });
        DisableCompareControls(firstChart.options.qv.viewerId, false);
      }

      // Resalto el selector de zoom seleccionado
      deselectZoom(prevClickedZoomId);
      selectZoom(this.id);

      jQuery.each(charts, function (index, chart) {
        chart.options.qv.predef_zoom = zoomFactor + "m";
      });
      prevClickedZoomId = this.id;

      // Si esta habilitada la comparación recalculo las fechas
      if (compare) {GroupAndCompareFunction(charts);}
    };

    ////////////////////////////////////////////////////////////////////////////////////////////
    // Carga los links de zooms con los event handlers necesarios
    // Zoom automatico a x meses
    const array_zooms = [0, 1, 2, 3, 6, 12];
    for (const index in array_zooms) {
      const x = array_zooms[index];
      const zoomXm = gx.dom.el(viewerId + "_Zoom_" + x + "m");
      if (zoomXm) {
        zoomXm.onclick = doZoom.closure(zoomXm, [x]);
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    // Al final, se muestra un rango de fechas que despliegue un máximo de 20 puntos
    const zoomFactor = getSuitableZoomFactor(firstChart.series[0].points, 20);
    triggerZoom(zoomFactor);

    const footerChartOptions = getTimelineFooterChartOptions(qViewer, arrOptions);
    const FooterHCChart = new Highcharts.Chart(footerChartOptions); // Agrego la gráfica del footer
  }

  // This function execute when the Highcharts object is finished loading and rendering.
  function HCFinishedLoadingCallback(chart) {
    const qViewer = qv.collection[chart.options.qv.viewerId];
    if (!IsDatetimeXAxis(qViewer)) {
      const selectionAllowed = qViewer.SelectionAllowed();
      let raiseItemClick = false;
      if (qViewer.ItemClick) {
        for (let i = 0; i < qViewer.Metadata.Axes.length; i++)
          {if (qViewer.Metadata.Axes[i].RaiseItemClick) {
            raiseItemClick = true;
            break;
          }}}
      if (raiseItemClick || selectionAllowed) {
        // Asocia el manejador para el evento click sobre el eje x
        jQuery.each(chart.xAxis[0].ticks, function (tick_index, tick) {
          if (tick && tick.label) {
            if (raiseItemClick) {
              tick.label.addClass("gx-qv-clickable-element");
            }
            tick.label.on("click", function (event) {
              onHighchartsXAxisClickEventHandler(
                event,
                tick_index,
                tick,
                chart,
                raiseItemClick,
                selectionAllowed
              );
            });
          }
        });
      }
    }
  }


  // ---------------------------------------------------- end Timeline ----------------------------------------------------

  return {
    // tryToRenderChart: function (qViewer) {
    //   let errMsg = "";

    //   // Ejecuto el primer servicio y verifico que no haya habido error
    //   const d1 = new Date();
    //   const t1 = d1.getTime();

    //   qViewer.xml = qViewer.xml || {};

    //   qv.services.GetRecordsetCacheKeyIfNeeded(
    //     qViewer,
    //     function (resText, qViewer) {
    //       // Servicio GetRecordsetCacheKey
    //       let newRecordsetCacheKey = false;
    //       if (resText != qViewer.xml.recordsetCacheKey) {
    //         qViewer.xml.recordsetCacheKey = resText;
    //         newRecordsetCacheKey = true;
    //       }
    //       if (!qv.util.anyError(resText)) {
    //         if (newRecordsetCacheKey) {
    //           qv.services.parseRecordsetCacheKeyXML(qViewer);
    //         }

    //         qv.services.GetMetadataIfNeeded(
    //           qViewer,
    //           function (resText, qViewer) {
    //             // Servicio GetMetadata
    //             let newMetadata = false;
    //             if (resText != qViewer.xml.metadata) {
    //               qViewer.xml.metadata = resText;
    //               newMetadata = true;
    //             }
    //             const d2 = new Date();
    //             const t2 = d2.getTime();
    //             if (!qv.util.anyError(resText)) {
    //               if (newMetadata) {
    //                 qv.services.parseMetadataXML(qViewer);
    //               }

    //               if (qViewer.Metadata.ParserResult.Success) {
    //                 qv.services.GetDataIfNeeded(
    //                   qViewer,
    //                   function (resText, qViewer) {
    //                     // Servicio GetData
    //                     let newData = false;
    //                     if (resText != qViewer.xml.data) {
    //                       qViewer.xml.data = resText;
    //                       newData = true;
    //                     }
    //                     const d3 = new Date();
    //                     const t3 = d3.getTime();
    //                     if (!qv.util.anyError(resText)) {
    //                       if (newData) {
    //                         qv.services.parseDataXML(qViewer);
    //                       }
    //                       renderChart(qViewer);
    //                     } else {
    //                       // Error en el servicio GetData
    //                       errMsg = qv.util.getErrorFromText(resText);
    //                       qv.util.renderError(qViewer, errMsg);
    //                     }
    //                   }
    //                 );
    //               } else {
    //                 qv.util.renderError(
    //                   qViewer,
    //                   qViewer.Metadata.ParserResult.Message
    //                 );
    //               }
    //             } else {
    //               // Error en el servicio GetMetadata
    //               errMsg = qv.util.getErrorFromText(resText);
    //               qv.util.renderError(qViewer, errMsg);
    //             }
    //           }
    //         );
    //       } else {
    //         // Error en el servicio GetRecordsetCachekey
    //         errMsg = qv.util.getErrorFromText(resText);
    //         qv.util.renderError(qViewer, errMsg);
    //       }
    //     }
    //   );
    // },

    GetMetadataChart: function (qViewer) {
      function UpdateMetadata(qViewer, designtimeMetadata) {
        function UpdateField(designtimeMetadata, name, visible) {
          for (let i = 0; i < designtimeMetadata.length; i++) {
            const element = designtimeMetadata[i];
            if (element.Name == name) {
              element.Visible = visible
                ? QueryViewerVisible.Yes
                : QueryViewerVisible.No;
              break;
            }
          }
        }

        if (qViewer.PlotSeries == QueryViewerPlotSeries.InTheSameChart) {
          for (
            var serieIndex = 0;
            serieIndex < qViewer.Charts[0].series.length;
            serieIndex++
          ) {
            var serie = qViewer.Charts[0].series[serieIndex];
            var name = qViewer.Chart.Series.ByIndex[serieIndex].FieldName;
            UpdateField(designtimeMetadata, name, serie.visible);
          }
        } else {
          for (
            var serieIndex = 0;
            serieIndex < qViewer.Charts.length;
            serieIndex++
          ) {
            var serie = qViewer.Charts[serieIndex].series[0];
            var name = qViewer.Chart.Series.ByIndex[serieIndex].FieldName;
            UpdateField(designtimeMetadata, name, serie.visible);
          }
        }
      }

      const designtimeMetadata = qv.util.GetDesigntimeMetadata(qViewer);
      UpdateMetadata(qViewer, designtimeMetadata);
      return designtimeMetadata;
    },

    GetRuntimeMetadata: function (qViewer) {
      function GetRuntimeElement(name, type, axis, position, visible) {
        return {
          Name: name,
          Type: type,
          Axis: axis,
          Position: position,
          Hidden:
            visible == QueryViewerVisible.Never ||
            element.Visible == QueryViewerVisible.No
        };
      }

      const elements = [];
      let lastPosition;
      lastPosition = 0;
      for (var i = 0; i < qViewer.Metadata.Axes.length; i++) {
        var element = qViewer.Metadata.Axes[i];
        if (element.Visible != QueryViewerVisible.Never) {
          lastPosition += 1;
        }
        elements.push(
          GetRuntimeElement(
            element.Name,
            QueryViewerElementType.Axis,
            element.Axis,
            element.Visible != QueryViewerVisible.Never ? lastPosition : null,
            element.Visible
          )
        );
      }
      lastPosition = 0;
      for (var i = 0; i < qViewer.Metadata.Data.length; i++) {
        var element = qViewer.Metadata.Data[i];
        if (element.Visible != QueryViewerVisible.Never) {
          lastPosition += 1;
        }
        elements.push(
          GetRuntimeElement(
            element.Name,
            QueryViewerElementType.Datum,
            "",
            element.Visible != QueryViewerVisible.Never ? lastPosition : null,
            element.Visible
          )
        );
      }
      if (qViewer.PlotSeries == QueryViewerPlotSeries.InTheSameChart) {
        for (
          var serieIndex = 0;
          serieIndex < qViewer.Charts[0].series.length;
          serieIndex++
        ) {
          var serie = qViewer.Charts[0].series[serieIndex];
          var name = qViewer.Chart.Series.ByIndex[serieIndex].FieldName;
          element = qv.util.GetElementInCollection(elements, "Name", name);
          element.Hidden = !serie.visible;
        }
      } else {
        for (
          var serieIndex = 0;
          serieIndex < qViewer.Charts.length;
          serieIndex++
        ) {
          var serie = qViewer.Charts[serieIndex].series[0];
          var name = qViewer.Chart.Series.ByIndex[serieIndex].FieldName;
          element = qv.util.GetElementInCollection(elements, "Name", name);
          element.Hidden = !serie.visible;
        }
      }
      return elements;
    },

    GetDataChart: function (qViewer) {
      return qViewer.xml.data;
    },

    getSparklineChartOptions: function (
      qViewer,
      containerId,
      chartType,
      noBackground,
      step,
      series
    ) {
      const options = {};
      options.chart = {};
      options.chart.renderTo = containerId;
      options.chart.margin = 0;
      options.chart.type = chartType;
      options.chart.styledMode = true;
      if (noBackground) {
        options.chart.className = "highcharts-no-background";
      } // Clase no estándar de Highcharts
      options.title = {};
      options.title.text = "";
      options.credits = {};
      options.credits.enabled = false;
      options.xAxis = {};
      options.xAxis.visible = false;
      options.yAxis = {};
      options.yAxis.visible = false;
      options.legend = {};
      options.legend.enabled = false;
      options.tooltip = {};
      options.tooltip.enabled = false;
      options.plotOptions = {};
      options.plotOptions.series = {};
      options.plotOptions.series.animation = false;
      options.plotOptions.series.connectNulls = true;
      options.plotOptions.series.enableMouseTracking = false;
      options.plotOptions.series.lineWidth = 1;
      options.plotOptions.series.shadow = false;
      options.plotOptions.series.states = {};
      options.plotOptions.series.states.hover = {};
      options.plotOptions.series.states.hover.lineWidth = 1;
      options.plotOptions.series.marker = {};
      options.plotOptions.series.marker.radius = 0;
      options.plotOptions.series.marker.states = {};
      options.plotOptions.series.marker.states.hover = {};
      options.plotOptions.series.marker.states.hover.radius = 2;
      if (step != "") {
        options.plotOptions.series.step = step;
      }
      options.series = [];
      for (let i = 0; i < series.length; i++) {
        options.series.push(series[i]);
      }
      return options;
    },

    IsDatetimeXAxis: function (qViewer) {
      return IsDatetimeXAxis(qViewer);
    },

    IsSingleSerieChart: function (qViewer) {
      return IsSingleSerieChart(qViewer);
    },

    IsAreaChart: function (qViewer) {
      return IsAreaChart(qViewer);
    },

    IsLineChart: function (qViewer) {
      return IsLineChart(qViewer);
    },

    IsSplittedChart: function (qViewer) {
      return IsSplittedChart(qViewer);
    },

    IsGaugeChart: function (qViewer) {
      return IsGaugeChart(qViewer);
    },

    Select: function (qViewer, selection) {
      const rowsToSelect = GetRowsToSelect(qViewer, selection);
      if (rowsToSelect.length > 0) {
        SelectChartsPoints(qViewer.Charts, rowsToSelect);
      } else {
        DeselectChartsPoints(qViewer.Charts);
      }
    },

    Deselect: function (qViewer) {
      DeselectChartsPoints(qViewer.Charts);
    }
  };
})();
