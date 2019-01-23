import DrawLineString from '@mapbox/mapbox-gl-draw/src/modes/draw_line_string';
import createVertex from '@mapbox/mapbox-gl-draw/src/lib/create_vertex';
import cheapRuler from 'cheap-ruler';

const DISTANCE_FROM_MOUSE = 10;

const DrawLineStringSnap = {
  toDisplayFeatures(state, geojson, display) {
    DrawLineString.toDisplayFeatures.call(this, state, geojson, display);

    if (state.currentVertexPosition > 0) {
      display(createVertex(
        state.line.id,
        geojson.geometry.coordinates[state.currentVertexPosition],
        `${state.currentVertexPosition}`,
        true
      ));
    }
  },

  onSetup(options) {
    return DrawLineString.onSetup.call(this, options);
  },

  onClick(state, e) {
    DrawLineString.onClick.call(this, state, e);
  },

  onMouseMove(state, e) {
    const bbox = [
      [e.point.x - DISTANCE_FROM_MOUSE, e.point.y - DISTANCE_FROM_MOUSE],
      [e.point.x + DISTANCE_FROM_MOUSE, e.point.y + DISTANCE_FROM_MOUSE]
    ];

    const eCoords = e.lngLat.toArray();
    const features = this.map.queryRenderedFeatures(bbox);
    console.log('queryRenderedFeatures', features);

    const nearby = features
      .map((feature) => {
        const { type } = feature.geometry;
        if (type === 'Polygon' || type === 'LineString') {
          const coordinates = type === 'Polygon' ? feature.geometry.coordinates[0] : feature.geometry.coordinates;
          const ruler = cheapRuler.fromTile(feature._vectorTileFeature._y, 20);
          const result = ruler.pointOnLine(coordinates, eCoords);
          if (result.point && result.point[0]) {
            console.log('pointOnLine', result);
            const distance = ruler.distance(result.point, eCoords);
            feature.point = this.map.project(result.point);
            feature.closest = result.point;
            feature.distance = distance;
          }
        }
        return feature;
      })
      .filter((feature) => {
        const { point } = feature;
        if (!point) return false;
        return (point.x > bbox[0][0] && point.x < bbox[1][0] && point.y > bbox[0][1] && point.y < bbox[1][1])
      })
      .sort((feature) => {
        return feature.distance;
      });

    if (nearby && nearby.length) {
      e.point.x = nearby[0].point.x;
      e.point.y = nearby[0].point.y;
      e.lngLat.lng = nearby[0].closest[0];
      e.lngLat.lat = nearby[0].closest[1];
      console.log('Snapping to:', nearby);
    }

    DrawLineString.onMouseMove.call(this, state, e);
  },
  
  onKeyUp(state, e) {
    DrawLineString.onKeyUp.call(this, state, e);
  },

  onTap(state, e) {
    DrawLineString.onTap.call(this, state, e);
  },

  onStop(state, e) {
    DrawLineString.onStop.call(this, state, e);
  },

  onTrash(state, e) {
    DrawLineString.onTrash.call(this, state, e);
  },

  clickAnywhere(state, e) {
    return DrawLineString.clickAnywhere.call(this, state, e);
  },

  clickOnVertex(state) {
    return DrawLineString.clickOnVertex.call(this, state);
  }
}

export default DrawLineStringSnap;