
  // @ts-nocheck
import * as Highcharts from 'highcharts/highmaps';
import { Host, Watch } from "@stencil/core";
import { Component, Prop, h, Event } from "@stencil/core";

import {
  QueryViewerAxisType,
  QueryViewerContinent,
  QueryViewerCountry,
  QueryViewerMapType,
  QueryViewerRegion,
  QueryViewerServiceResponse
 } from "@genexus/reporting-api";


@Component({
  tag: "gx-query-viewer-map-controller",
})
export class QueryViewerMapController {
  private regExp = /\(([^)]+)\)/;

  /**
   * A CSS class to set as the `gx-query-viewer-map` element class.
   */
  @Prop() readonly cssClass: string;

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
  @Watch('region')
  handleRegion(newValue) {
    if (newValue !== undefined) {
      this.fetchMapData();
    }
  }

  /**
   * If region = Continent, this is the continent to display in the map
   */
  @Prop() continent: QueryViewerContinent;

  /**
   * If region = Country, this is the country to display in the map
   */
  @Prop() country: QueryViewerCountry;

  /**
   * Whether to select the series initially
   */
  @Prop() selected: boolean = false;

  /**
   * Specifies the metadata and data that the control will use to render.
   */
  @Prop() readonly serviceResponse: QueryViewerServiceResponse;

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
  @State() topology: Highcharts.GeoJSON | Highcharts.TopoJSON = null;

  /**
   *
   * @returns topology URL
   */
  private mapDataUrl(): string {
    let url = 'https://code.highcharts.com/mapdata/custom/world.topo.json';
    switch(String(this.region)) {
      case 'Continent':
        url = `https://code.highcharts.com/mapdata/custom/${String(this.continent)}.topo.json`;
        break;
      case 'Country':
        const country = String(this.country).toLocaleLowerCase();
        url = `https://code.highcharts.com/mapdata/countries/${country}/${country}-all.topo.json`;
        break;
    }
    return url;
  }

  private async fetchMapData(): void {
    const url = this.mapDataUrl();
    this.topology = await fetch(url).then(response => response.json());
  }

  private getSerieData(axesDataField: QueryViewerDataType, dataField: QueryViewerDataType): { code: string, value: number }[] {
    const { rows } = this.serviceResponse.Data;

    return rows.map((row) => {
      const key = row[axesDataField].trim();
      const value = Number(row[dataField]);

      const regex = /\(([^ ]+) ([^)]+)\)/;
      const matches = key.match(regex);

      if (matches) {
        const [, longitud, latitud] = matches;
        return { value: `${value}`, name: `${value}`, lon: parseFloat(longitud), lat: parseFloat(latitud), x: parseFloat(longitud), y: parseFloat(latitud) };
      } else {
        return { value, z: value, code: key };
      }
    })
    .filter(({ value }) => value > 0);
  };

  private getSeries(): Highcharts.SeriesOptionsType {
    const { dataField: axesDataField, dataType } = this.serviceResponse.MetaData.axes[0];
    const { dataField } = this.serviceResponse.MetaData.data[0];
    const { title } = this.serviceResponse.MetaData.data[0];

    const data = this.getSerieData(axesDataField, dataField);

    const series = {
      type: this.mapType === "Choropleth" ? "map" : "mapbubble",
      name: title,
      joinBy: ['iso-a2', 'code'],
      data,
    };

    // @TODO: Replace type in order to show points. Review to allow bubbles
    if (dataType === 'geopoint') {
      series.type = 'mappoint';
      series.allAreas = false;
    }

    return series;
  }

  render() {
    if (this.topology === null) {
      return "";
    }

    const series = [
      {
        name: ['World', 'Continent'].includes(this.region) ? 'Countries' : 'Cities',
        enableMouseTracking: false
      },
      this.getSeries()
    ];

    return (
      <Host
        class={{
          "gx-query-viewer-map-controller": true
        }}
      >
        <gx-query-viewer-map
          continent={this.continent}
          country={this.country}
          cssClass={this.cssClass}
          description={this.description}
          mapType={this.mapType}
          queryTitle={this.queryTitle}
          region={this.region}
          selected={this.selected}
          series={series}
          topology={this.topology}
          headerFormat={this.headerFormat}
          pointFormat={this.pointFormat}
          footerFormat={this.footerFormat}
          allowPointSelect={this.allowPointSelect}
        ></gx-query-viewer-map>
      </Host>
    );
  }
}
