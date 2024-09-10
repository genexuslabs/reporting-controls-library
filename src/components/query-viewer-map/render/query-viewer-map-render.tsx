import * as Highcharts from "highcharts/highmaps";
import { Host, Watch } from "@stencil/core";
import { Component, Prop, h, State } from "@stencil/core";

import {
  QueryViewerContinent,
  QueryViewerCountry,
  QueryViewerMapType,
  QueryViewerRegion,
  QueryViewerServiceResponse
} from "@genexus/reporting-api";

const GEOPOINT_REGEX = /\(([^ ]+) ([^)]+)\)/;

@Component({
  tag: "gx-query-viewer-map-render"
})
export class QueryViewerMapRender {
  /**
   * Allow the points to be selected by clicking on the graphic (columns, point markers, pie slices, map areas etc).
   */
  @Prop() readonly allowPointSelect: boolean = false;

  /**
   * If region = Continent, this is the continent to display in the map
   */
  @Prop() readonly continent: QueryViewerContinent;

  /**
   * If region = Country, this is the country to display in the map
   */
  @Prop() readonly country: QueryViewerCountry;

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
   * This is the region to display in the map
   */
  @Prop() readonly region: QueryViewerRegion;
  @Watch("region")
  handleRegion(newValue) {
    if (newValue !== undefined) {
      this.fetchMapData();
    }
  }

  /**
   * Specifies the metadata and data that the control will use to render.
   */
  @Prop() readonly serviceResponse: QueryViewerServiceResponse;

  /**
   * Map Data for series, in terms of a GeoJSON or TopoJSON object
   */
  @State() topology: Highcharts.GeoJSON | Highcharts.TopoJSON = null;

  /**
   * topology source URL
   */
  private topologyUrlMapping = {
    Continent: () =>
      `https://code.highcharts.com/mapdata/custom/${String(
        this.continent
      )}.topo.json`,
    Country: () => {
      const country = String(this.country).toLocaleLowerCase();
      return `https://code.highcharts.com/mapdata/countries/${country}/${country}-all.topo.json`;
    },
    World: () => `https://code.highcharts.com/mapdata/custom/world.topo.json`
  } as const satisfies { [key in QueryViewerRegion]: () => string };

  private getTopologyUrl = (): string =>
    this.topologyUrlMapping[String(this.region || QueryViewerRegion.World)]();

  private async fetchMapData() {
    const url = this.getTopologyUrl();
    this.topology = await fetch(url).then(response => response.json());
  }

  private getSerieData(
    axesDataField: string,
    dataField: string
  ): Highcharts.PointOptionsType[] {
    const { rows } = this.serviceResponse.Data;

    return rows
      .map(row => {
        const key = row[axesDataField].trim();
        const value = Number(row[dataField]);

        const matches = key.match(GEOPOINT_REGEX);

        if (matches) {
          const [, longitude, latitude] = matches;
          return {
            lon: parseFloat(longitude),
            lat: parseFloat(latitude),
            name: `${value}`,
            value
          };
        } else {
          return { value, z: value, code: key };
        }
      })
      .filter(({ value }) => Number(value) > 0);
  }

  private getSeries() {
    const { dataField: axesDataField, dataType } =
      this.serviceResponse.MetaData.axes[0];
    const { dataField } = this.serviceResponse.MetaData.data[0];
    const { title } = this.serviceResponse.MetaData.data[0];

    const data = this.getSerieData(axesDataField, dataField);

    const series = {
      ...(this.mapType === "Bubble" ? { type: "mapbubble" } : { type: "map" }),
      name: title,
      joinBy: ["iso-a2", "code"],
      data
    };

    // @TODO: Replace type in order to show points. Review to allow bubbles
    if (dataType === "geopoint") {
      series.type = "mappoint";
    }

    return series;
  }

  render() {
    if (this.topology === null) {
      return "";
    }

    const series = [
      {
        name: ["World", "Continent"].includes(this.region)
          ? "Countries"
          : "Cities"
      },
      this.getSeries()
    ];

    return (
      <Host>
        <gx-query-viewer-map
          allowPointSelect={this.allowPointSelect}
          description={this.description}
          footerFormat={this.footerFormat}
          headerFormat={this.headerFormat}
          mapType={this.mapType}
          pointFormat={this.pointFormat}
          queryTitle={this.queryTitle}
          series={series}
          topology={this.topology}
        ></gx-query-viewer-map>
      </Host>
    );
  }
}
