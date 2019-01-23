import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import React, { Component } from 'react';
import DrawLineStringSnap from './draw_line_string_snap';
import { FeatureCollection } from 'geojson';
import styled from 'styled-components';
import logo from './logo.svg';
import './App.css';

const StyledMap = styled.div`
  margin: 0;
  width: 100vw;
  height: 100vh;
`;

const DEFAULT_LAYER: mapboxgl.Layer = {
  id: 'us-zipcodes',
  type: 'line',
  source: {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/jgoodall/us-maps/master/geojson/county.geo.json',
  },
  paint: {
    'line-width': 2,
    'line-color': '#3bb2d0',
  }
};

class App extends Component {
  private mapRef: Element | null;
  private map: mapboxgl.Map | null;
  private mapDrawTool: any;

  constructor(props: any) {
    super(props);
    this.mapRef = null;
    this.map = null;
    this.mapDrawTool = null;
  }

  private onReferenceMap = (element: HTMLDivElement) => {
    this.mapRef = element;
  }

  private initializeMap = () => {
    if (!this.mapRef) return;
    this.map = new mapboxgl.Map({
      container: this.mapRef,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-97, 35],
      zoom: 4,
    });
    this.mapDrawTool = new MapboxDraw({
      modes: {
        ...MapboxDraw.modes,
        draw_line_string: DrawLineStringSnap
      },
      controls: {
        line_string: true,
      },
      displayControlsDefault: false,
    });
    this.map.addControl(this.mapDrawTool);
    this.map.on('load', this.loadGeoJSON);
  }

  private loadGeoJSON = () => {
    if (!this.map) return;
    this.map.addLayer(DEFAULT_LAYER);
  }

  componentDidMount() {
    this.initializeMap();
  }

  render() {
    return (
      <StyledMap id="map-container" ref={this.onReferenceMap}/>
    );
  }
}

export default App;
