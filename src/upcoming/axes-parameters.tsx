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
// private objectCall: Array<string>;
// private configurationObserver = new MutationObserver(() => {
//   this.configurationChangedHandler();
// });

// @Listen("parameterValueChanged")
// parameterValueChangedHandler(eventInfo: CustomEvent) {
//   eventInfo.stopPropagation();
//   this.getParameters();
// }

// @Listen("elementChanged")
// elementChangedHandler(eventInfo: CustomEvent) {
//   eventInfo.stopPropagation();
//   this.getElements();
// }

// private configurationChangedHandler() {
//   this.getParameters();
//   this.getElements();
// }

// componentWillLoad() {
//   this.getParameters();
//   this.getElements();
// }

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

// disconnectedCallback() {
//   if (this.configurationObserver) {
//     this.configurationObserver.disconnect();
//     this.configurationObserver = undefined;
//   }
// }

// private parseObjectToObjectcall() {
//   try {
//     this.objectCall = JSON.parse(this.object);
//   } catch (e) {
//     this.objectCall = null;
//   }
// }

// private hasObjectCall() {
//   return Array.isArray(this.objectCall) && this.objectCall.length >= 2;
// }

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

// private getParameters() {
//   const parametersValue: ParameterValue[] = [];

//   if (this.hasObjectCall()) {
//     this.objectCall.slice(2).forEach(value => {
//       const parameterObject: ParameterValue = {
//         Value: encodeURIComponent(value),
//         Name: ""
//       };
//       parametersValue.push(parameterObject);
//     });
//   } else {
//     const parameters = Array.from(
//       document.getElementsByTagName("gx-query-viewer-parameter")
//     );
//     parameters.forEach(parameter => {
//       const parameterObject: ParameterValue = {
//         Value: encodeURIComponent(parameter.Value),
//         Name: parameter.Name
//       };
//       parametersValue.push(parameterObject);
//     });
//   }

//   this.parameters = JSON.stringify(parametersValue);
// }

// private getElements() {
//   const elementsValue: ElementValue[] = [];
//   const elements = Array.from(
//     document.getElementsByTagName("gx-query-viewer-element")
//   );
//   elements.forEach(ax => {
//     const elementObjectValue: ElementValue = {
//       Name: ax.name,
//       Title: ax.title,
//       Visible: ax.visible,
//       Type: ax.type,
//       Axis: ax.axis,
//       Aggregation: ax.aggregation,
//       DataField: ax.dataField
//     };

//     if (ax.axisOrderType) {
//       elementObjectValue["AxisOrder"] = { Type: ax.axisOrderType };
//       if (ax.axisOrderValues) {
//         elementObjectValue["AxisOrder"]["Values"] = ax.axisOrderValues;
//       }
//     }
//     if (ax.filterType) {
//       elementObjectValue["Filter"] = { Type: ax.filterType };
//       if (ax.axisOrderValues) {
//         elementObjectValue["Filter"]["Values"] = ax.filterValues;
//       }
//     }
//     if (ax.expandCollapseType) {
//       elementObjectValue["ExpandCollapse"] = { Type: ax.expandCollapseType };
//       if (ax.axisOrderValues) {
//         elementObjectValue["ExpandCollapse"]["Values"] =
//           ax.expandCollapseValues;
//       }
//     }

//     const grouping = this.getGrouping(ax);
//     if (Object.keys(grouping).length > 0) {
//       elementObjectValue["Grouping"] = grouping;
//     }
//     if (ax.raiseItemClick) {
//       const action = { RaiseItemClick: ax.raiseItemClick };
//       elementObjectValue["Action"] = action;
//     }

//     const formats = Array.from(
//       ax.getElementsByTagName("gx-query-viewer-element-format")
//     );

//     formats.forEach(format => {
//       const formatObject: Format = {
//         Picture: format.picture,
//         Subtotals: format.subtotals,
//         CanDragToPages: format.canDragToPages,
//         Style: format.formatStyle,
//         TargetValue: format.targetValue,
//         MaximumValue: format.maximumValue
//       };

//       const styles = Array.from(
//         ax.getElementsByTagName("gx-query-viewer-format-style")
//       );

//       const valuesStyles: ValueStyle[] = [];
//       const conditionalStyles: ConditionalStyle[] = [];

//       styles.forEach(style => {
//         if (style.type === "Values") {
//           const valueStyle = {
//             Value: style.value,
//             ApplyToRowOrColumn: style.applyToRowOrColumn,
//             StyleOrClass: style.styleOrClass
//           };
//           valuesStyles.push(valueStyle);
//         } else {
//           const conditionalStyle = {
//             Value1: style.value1,
//             Value2: style.value2,
//             Operator: style.operator,
//             StyleOrClass: style.styleOrClass
//           };
//           conditionalStyles.push(conditionalStyle);
//         }
//       });
//       if (valuesStyles.length > 0) {
//         formatObject["ValuesStyle"] = valuesStyles;
//       }
//       if (conditionalStyles.length > 0) {
//         formatObject["ConditionalStyles"] = conditionalStyles;
//       }

//       elementObjectValue["Format"] = formatObject;
//     });
//     elementsValue.push(elementObjectValue);
//   });

//   this.elements = JSON.stringify(elementsValue);
// }

// private getGrouping(
//   ax: HTMLGxQueryViewerElementElement
// ): Record<string, any> {
//   const grouping = () => ({
//     ...(ax.groupingGroupByYear && { GroupByYear: ax.groupingGroupByYear }),
//     ...(ax.groupingYearTitle && {
//       YearTitle: ax.groupingYearTitle
//     }),
//     ...(ax.groupingGroupBySemester && {
//       GroupBySemester: ax.groupingGroupBySemester
//     }),
//     ...(ax.groupingSemesterTitle && {
//       SemesterTitle: ax.groupingSemesterTitle
//     }),
//     ...(ax.groupingGroupByQuarter && {
//       GroupByQuarter: ax.groupingGroupByQuarter
//     }),
//     ...(ax.groupingQuarterTitle && { QuarterTitle: ax.groupingQuarterTitle }),
//     ...(ax.groupingGroupByMonth && { GroupByMonth: ax.groupingGroupByMonth }),
//     ...(ax.groupingMonthTitle && { MonthTitle: ax.groupingMonthTitle }),
//     ...(ax.groupingGroupByDayOfWeek && {
//       GroupByDayOfWeek: ax.groupingGroupByDayOfWeek
//     }),
//     ...(ax.groupingDayOfWeekTitle && {
//       DayOfWeekTitle: ax.groupingDayOfWeekTitle
//     }),
//     ...(ax.groupingHideValue && { HideValue: ax.groupingHideValue })
//   });
//   return grouping;
// }
