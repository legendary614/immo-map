import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./listMap.vue";
import MapBox from "mapbox-gl-vue";
import mapboxgl from "mapbox-gl";
@Component({
  mixins: [template],
  components: {
    "mapbox": MapBox
  }
})
export default class ListMap extends Vue {

    @Prop({default: null})
    coordinates: any;

    map: any;
    markers: any = [];

    mapInitialized(map: mapboxgl.Map) {
      this.map = map;
    }

    clearMarkers() {
      if (this.markers.length > 0) {
        for (let i = 0, l = this.markers.length; i < l; i++) {
          this.markers[i].remove();
        }
      }
    }

    loaded () {
      this.clearMarkers();

      let marker = new mapboxgl.Marker()
      .setLngLat([this.coordinates.longitude, this.coordinates.latitude])
      .addTo(this.map);
      this.map.dragRotate.disable();
      this.map.touchZoomRotate.disableRotation();
      this.map.setCenter([this.coordinates.longitude, this.coordinates.latitude]);
      this.map.panTo([this.coordinates.longitude, this.coordinates.latitude]);
      this.map.addControl(new mapboxgl.FullscreenControl());

      /* let self = this;
      let classname = document.getElementsByClassName("mapboxgl-ctrl-icon mapboxgl-ctrl-fullscreen");
      console.log("HELLOOOO");
      for (let i = 0; i < classname.length; i++) {
        classname[i].addEventListener("click", function() {
          self.map.setCenter([self.coordinates.longitude, self.coordinates.latitude]);
          self.map.panTo([self.coordinates.longitude, self.coordinates.latitude]);
        });
      }
      */
    }
}
