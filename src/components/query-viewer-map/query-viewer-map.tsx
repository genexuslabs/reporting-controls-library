import { Component, Event, Host, Prop, EventEmitter, h } from "@stencil/core";
import * as Highcharts from 'highcharts/highmaps';
import HighchartsData from "highcharts/modules/data";
import HighchartsExporting from "highcharts/modules/exporting";
import { QueryViewerContinent, QueryViewerCountry, QueryViewerMapType, QueryViewerRegion } from "@genexus/reporting-api";

@Component({
  tag: "gx-query-viewer-map",
  styleUrl: "query-viewer-map.scss",
  shadow: true
})
export class QueryViewerMap {
  private mapContainer: HTMLDivElement;

  /**
   * Title of the QueryViewer
   */
  @Prop() queryTitle: string;

  /**
   * Description of the QueryViewer
   */
  @Prop() description: string;

  /**
   * This is the map type: Bubble or Choropleth
   */
  @Prop() mapType: QueryViewerMapType;

  /**
   * This is the region to display in the map
   */
  @Prop() region: QueryViewerRegion;

  /**
   * If region = Continent, this is the continent to display in the map
   */
  @Prop() continent: QueryViewerContinent;

  /**
   * If region = Country, this is the country to display in the map
   */
  @Prop() country: QueryViewerCountry;

  /**
   * A CSS class to set as the element class.
   */
  @Prop() readonly cssClass: string;

  /**
   * The Data module provides a simplified interface for adding data.
   */
  @Prop() readonly data: (number | Highcharts.PointOptionsObject | [string, number])[];

  /**
   * Series options for specific data and the data itself.
   */
  @Prop() readonly series: Highcharts.SeriesOptionsType[];

  /**
   * The HTML of the tooltip header line
   */
  @Prop() readonly headerFormat: string | undefined = undefined;
  /**
   * The HTML of the point's line in the tooltip
   */
  @Prop() readonly pointFormat: string | undefined = undefined;
  /**
   * A string to append to the tooltip format.
   */
  @Prop() readonly footerFormat: string | undefined = undefined;
  /**
   * Allow the points to be selected by clicking on the graphic (columns, point markers, pie slices, map areas etc).
   */
  @Prop() readonly allowPointSelect = false;

  /**
   * Map Data for series, in terms of a GeoJSON or TopoJSON object
   */
  @Prop() readonly topology: Highcharts.GeoJSON | Highcharts.TopoJSON;

  @Event() mapItemClick: EventEmitter<Highcharts.PointClickCallbackFunction>;

  @Event() mapItemSelect: EventEmitter<Highcharts.PointSelectCallbackFunction>;

  @Event() mapItemUnSelect: EventEmitter<Highcharts.PointUnselectCallbackFunction>;

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
      ...( this.headerFormat ? { headerFormat: this.headerFormat } : {}),
      ...( this.pointFormat ? { pointFormat: this.pointFormat } : {}),
      ...( this.footerFormat ? { footerFormat: this.footerFormat } : {})
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
              unselect: this.handleUnselect.bind(this),
            }
          }
        },
        mapbubble: {
          allowPointSelect: this.allowPointSelect,
          point: {
            events: {
              select: this.handleSelect.bind(this),
              unselect: this.handleUnselect.bind(this),
            }
          }
        },
        mappoint: {
          allowPointSelect: this.allowPointSelect,
          point: {
            events: {
              select: this.handleSelect.bind(this),
              unselect: this.handleUnselect.bind(this),
            }
          }
        },
        series: {
          events: {
            click: this.handleClick.bind(this),
          },
        },
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
      <Host class="gx-query-viewer-map-container">
        <div ref={el => (this.mapContainer = el as HTMLDivElement)}></div>
      </Host>
    );
  }
}
