import React from 'react';
import ReactDOM from 'react-dom';
import * as mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const descriptor = Object.getOwnPropertyDescriptor(mapboxgl, "accessToken");
if (descriptor && descriptor.set) {
  descriptor.set('pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA');
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
