import MapComponent from "../../map";
import store from "../../../store";
import { Component, Watch } from "vue-property-decorator";
import * as search from "../../../store/modules/search_";
import { cc } from "../../map/radius";
import Vue from "vue";
import PopupMultipleObjectsComponent from "../../map/popup.multiple.objects";
import { setTimeout } from "timers";
import * as api2 from "@immosparrow/cockpit-api-v2";
window.onbeforeunload = function () {
  search.commitResetState(store);
};
@Component({
  mixins: [],
  components: {

  }
})

export default class AdsMapComponent extends MapComponent {

  address: api2.GeoSuggestion;
  destroyed() {
    search.commitResetState(store);
  }

  setLayers(address: any) {

    let self = this;

    try {

      self.setObject(address.uniqueIdentifier, null, address);

    } catch (err) {
      search.commitResetState(store);

    }
  }


  async setObject(id: string, e: any, address: api2.GeoSuggestion) {

    try {
      let geojson = {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [address.coordinates.longitude, address.coordinates.latitude]
          }
        }]
      };

      let pointSource = {
        "type": "geojson",
        "data": geojson
      };
      let pointLayer = {
        "id": "point",
        "type": "circle",
        "source": "point",
        "paint": {
          "circle-radius": 10,
          "circle-color": "#3887be",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      };

      try {
        this.map.addSource("point", pointSource);
        this.map.addLayer(pointLayer);

        this.markers.push(pointLayer);
        this.markerSources.push(pointSource);

      } catch {
        this.map.getSource("point").setData(geojson);
      }

      this.map.setZoom(16);
      this.map_zoom = 16;



    } catch {
    }
    search.commitAddressLoading(store, false);

  }

  get mapAndAddress() {
    return {
      loaded: this.mapLoaded,
      address: this.marketRadarSearchedAddress
    };
  }
  @Watch("mapAndAddress", {immediate: true})
  ma() {

    let self = this;
    if (this.mapAndAddress.loaded && this.mapAndAddress.address.name != undefined) {

      this.address = this.mapAndAddress.address;
      search.commitAddressLoading(store, true);
      // self.add_to_history(address);

      self.map.setCenter([self.address.coordinates.longitude, self.address.coordinates.latitude]);
      self.map.panTo([self.address.coordinates.longitude, self.address.coordinates.latitude]);
      self.setLayers(self.address);
      if (self.mapSize == "big") {
        self.$root.$emit("map_change_size", "small");
      }

    } else {
      try {
        self.map.removeLayer("point");
        self.map.removeSource("point");
      } catch {
      }
    }
  }

  load() {

    let self = this;

    this.$root.$on("highlight", (data: any) => {
      let uniqueIdentifier = data.uniqueIdentifier;
      let layer = data.layer;
      let pixelSpaceBoundingBox = [self.map.project(self.map.getBounds().getNorthEast()),
        self.map.project(self.map.getBounds().getSouthWest())];


      let features =
        self.map.queryRenderedFeatures(pixelSpaceBoundingBox, {
          layers: [layer]
        });


      if (features.length > 0) {

        for (let i = 0, l = features.length; i < l; i++) {

          if (uniqueIdentifier != "") {
            if (features[i].properties.uniqueidentifier == uniqueIdentifier) {
              self.map.setPaintProperty(layer, "fill-color",
                ["case",
                  ["==", ["get", "uniqueidentifier"]
                    , uniqueIdentifier],
                  "#dd3e33",
                  "transparent"]);
            }
          } else {
            self.map.setPaintProperty(layer, "fill-color",
              ["case",
                ["==", ["get", "uniqueidentifier"]
                  , uniqueIdentifier],
                "transparent",
                "transparent"]);
          }
        }
      }

    });

    this.$root.$on("draw_radius_around_point", (data: any) => {

      if (data.radius == 0) {
        try {
          this.map.removeLayer(data.uniqueIdentifier);
          this.map.removeSource(data.uniqueIdentifier);
          this.searchAreasLayers = [];
          this.shape_names = [];
        } catch {}

        return;
      }
      try {

        this.map.removeLayer(data.uniqueIdentifier);
        this.map.removeSource(data.uniqueIdentifier);
        this.searchAreasLayers = [];
        this.shape_names = [];
      } catch { }

      let source = cc([data.coordinates.longitude, data.coordinates.latitude],
        data.radius);

      let circle_layer = {
        "id": data.uniqueIdentifier,
        "type": "fill",
        "source": source,
        layout: {},
        "paint": {
          "fill-color": "#73cccb",
          "fill-opacity": 0.3,
          "fill-outline-color": "#ccc",
        },
        "data.uniqueIdentifier": {
          "id": data.uniqueIdentifier
        }
      };

      this.searchAreasLayers.push(circle_layer);
      this.map.addLayer(circle_layer);

      let shape = {
        id: data.uniqueIdentifier,
        name: data.name,
        color: "#73cccb",
        geom: {
          type: "polygon",
          coordinates: source["data"]["features"][0]["geometry"]["coordinates"]
        }
      };

      this.shape_names.push(shape);
      this.fit_bounds();

    });

    this.$root.$on("show_popup_on_map", (value: boolean) => {

      if (value) {

        let popup_component = new Vue({

          name: "popup_objects_app",
          data: {

          },
          components: {
            "pp": PopupMultipleObjectsComponent
          },
          methods: {
            selectAddress(a: any) {
              console.log(a);
            },
            closePopup() {
              self.popup.remove();
            }
          },
          parent: this,
          template: '<pp ref="popup_objects" v-bind:selectAddress="selectAddress" v-bind:closePopup="closePopup"   />'
        }).$mount();

        // Need to be triggered somehow DO NOT REMOVE!
        setTimeout(function () {
          self.popup.setLngLat([self.address.coordinates.longitude, self.address.coordinates.latitude])
            .setDOMContent(popup_component.$el)
            .addTo(self.map);

        }, 100);
      } else {
        this.popup.remove();
      }
    });

    self.map.on("style.load", function () {

      self.mapStyleLoaded = true;
      self.redrawLayersFromAddress();
      if (self.map.getSource("point") == undefined) {
        if (self.markerSources.length) {
          self.map.addSource("point", self.markerSources[0]);
          self.map.addLayer(self.markers[0]);
        }
      }

    });
  }
  @Watch("mapLoaded")
  ml() {
    if (this.mapLoaded) {
      this.load();
    }
  }

}
