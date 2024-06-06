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
  @Prop() readonly series: Highcharts.SeriesOptionsType;

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
   * Map Data for series, in terms of a GeoJSON or TopoJSON object
   */
  @Prop() readonly topology: Highcharts.GeoJSON | Highcharts.TopoJSON;

  @Event() mapItemClick: EventEmitter<Highcharts.PointClickCallbackFunction>;

  @Event() mapItemMouseOver: EventEmitter<Highcharts.PointClickCallbackFunction>;

  @Event() mapItemMouseOut: EventEmitter<Highcharts.PointClickCallbackFunction>;

  @Event() mapItemSelect: EventEmitter<Highcharts.PointSelectCallbackFunction>;

  private handleClick(e) {
    this.mapItemClick.emit(e.detail)
  }
  private handleMouseOut(e) {
    this.mapItemMouseOver.emit(e.detail)
  }
  private handleMouseOver(e) {
    this.mapItemMouseOut.emit(e.detail)
  }
  private handleSelected(e) {
    this.mapItemSelect.emit(e.detail)
  }

  // @ts-ignore
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
        series: {
          events: {
            click: this.handleClick.bind(this),
            mouseOut: this.handleMouseOut.bind(this),
            mouseOver: this.handleMouseOver.bind(this),
            select: this.handleSelected.bind(this),
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
