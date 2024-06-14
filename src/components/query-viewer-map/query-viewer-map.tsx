import {
  Component,
  Event,
  Host,
  Prop,
  EventEmitter,
  h,
  Watch
} from "@stencil/core";
import * as Highcharts from "highcharts/highmaps";
import HighchartsData from "highcharts/modules/data";
import HighchartsExporting from "highcharts/modules/exporting";
import { QueryViewerMapType } from "@genexus/reporting-api";

@Component({
  tag: "gx-query-viewer-map",
  styleUrl: "query-viewer-map.scss",
  shadow: true
})
export class QueryViewerMap {
  private mapContainer: HTMLDivElement;

  private mapHC: Highcharts.MapChart;

  /**
   * Allow the points to be selected by clicking on the graphic (columns, point markers, pie slices, map areas etc).
   */
  @Prop() readonly allowPointSelect: boolean = false;

  /**
   * A CSS class to set as the element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * Description of the QueryViewer
   */
  @Prop() readonly description: string;

  /**
   * A string to append to the tooltip format.
   */
  @Prop() readonly footerFormat: string | undefined = undefined;

  /**
   * The HTML of the tooltip header line
   */
  @Prop() readonly headerFormat: string | undefined = undefined;

  /**
   * Title of the QueryViewer
   */
  @Prop() readonly queryTitle: string;

  /**
   * This is the map type: Bubble or Choropleth
   */
  @Prop() readonly mapType: QueryViewerMapType;

  /**
   * The HTML of the point's line in the tooltip
   */
  @Prop() readonly pointFormat: string | undefined = undefined;

  /**
   * Series options for specific data and the data itself.
   */
  @Prop() readonly series: (Highcharts.SeriesOptionsType | { name: string })[];

  /**
   * Map Data for series, in terms of a GeoJSON or TopoJSON object
   */
  @Prop() readonly topology: Highcharts.GeoJSON | Highcharts.TopoJSON;

  /**
   * Fires when the series is clicked. One parameter, event, is passed to the function, containing common event information.
   */
  @Event() mapItemClick: EventEmitter<Highcharts.PointClickCallbackFunction>;

  /**
   * Fires when the point is selected either programmatically or following a click on the point. One parameter, event, is passed to the function. Returning false cancels the operation.
   */
  @Event() mapItemSelect: EventEmitter<Highcharts.PointSelectCallbackFunction>;

  /**
   * Fires when the point is unselected either programmatically or following a click on the point. One parameter, event, is passed to the function. Returning false cancels the operation.
   */
  @Event()
  mapItemUnSelect: EventEmitter<Highcharts.PointUnselectCallbackFunction>;

  @Watch("queryTitle")
  @Watch("description")
  updateTitle(newValue: string, _: string, propName: string) {
    const propertiesDictionary = {
      queryTitle: "title",
      description: "description"
    };
    const key = propertiesDictionary[propName];
    this.mapHC.update({ [`${key}`]: { text: newValue } });
  }

  private handleClick(e: Highcharts.PointClickCallbackFunction) {
    this.mapItemClick.emit(e);
  }
  private handleSelect(e: Highcharts.PointSelectCallbackFunction) {
    this.mapItemSelect.emit(e);
  }
  private handleUnselect(e: Highcharts.PointUnselectCallbackFunction) {
    this.mapItemUnSelect.emit(e);
  }

  private renderMap() {
    HighchartsData(Highcharts);
    HighchartsExporting(Highcharts);

    const tooltip = {
      ...(this.headerFormat ? { headerFormat: this.headerFormat } : {}),
      ...(this.pointFormat ? { pointFormat: this.pointFormat } : {}),
      ...(this.footerFormat ? { footerFormat: this.footerFormat } : {})
    };

    // @ts-ignore
    this.mapHC = Highcharts.mapChart(this.mapContainer, {
      chart: {
        map: this.topology
      },
      title: {
        text: this.queryTitle
      },
      subtitle: {
        text: this.description
      },
      mapNavigation: {
        enabled: true
      },
      plotOptions: {
        map: {
          allowPointSelect: this.allowPointSelect,
          point: {
            events: {
              select: this.handleSelect.bind(this),
              unselect: this.handleUnselect.bind(this)
            }
          }
        },
        mapbubble: {
          allowPointSelect: this.allowPointSelect,
          point: {
            events: {
              select: this.handleSelect.bind(this),
              unselect: this.handleUnselect.bind(this)
            }
          }
        },
        mappoint: {
          allowPointSelect: this.allowPointSelect,
          point: {
            events: {
              select: this.handleSelect.bind(this),
              unselect: this.handleUnselect.bind(this)
            }
          },
          tooltip: {
            pointFormat: "longitude: {point.lon} / latitude: {point.lat}"
          }
        },
        series: {
          events: {
            click: this.handleClick.bind(this)
          }
        }
      },
      series: this.series,
      tooltip
    });
  }

  componentDidRender() {
    this.renderMap();
  }

  render() {
    return (
      <Host>
        <div ref={el => (this.mapContainer = el as HTMLDivElement)}></div>
      </Host>
    );
  }
}
