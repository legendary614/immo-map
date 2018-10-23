import { Component, Watch, Prop } from "vue-property-decorator";
import * as search_ from "./../../store/modules/search_";
import store from "../../store";
import polylabel from "polylabel";
import * as api from "@immosparrow/cockpit-api";
import {
  commitSearchingForTransparency, commitSearchedAddressBuilding,
  commitResetState, commitAddressLoading, commitObjectWindow, commitSidebar
} from "../../store/modules/search_";
import { setTimeout } from "timers";
import MapComponent from "./index";
import mapboxgl from "mapbox-gl";
import * as api2 from "@immosparrow/cockpit-api-v2";
@Component({
  mixins: [],
  components: {

  }
})
export default class TransparencyMapComponent extends MapComponent {

  last_fs_id_hover: string = "";
  last_fs_layer_type_hover: string = "";
  so: boolean = false;
  searched_address: any = {};
  @Prop()
  address: api2.GeoSuggestion;
  created() {

    let self = this;

  }

  destroyed() {
    search_.commitResetState(store);
  }

  ready() {
    window.onbeforeunload = function () {
      search_.commitResetState(store);
    };

  }

  set_transparency_layers(address: any) {

    let self = this;

    try {

      self.transparency_object(address.uniqueIdentifier, null);
      search_.commitResetState(store);
      commitObjectWindow(store, true);
      this.map.setZoom(18);

    } catch (err) {
      search_.commitResetState(store);
      console.log(err);
    }
  }

  async transparency_object(id: string, e: any) {

    try {


      let client: api.TransparencyClient = new api.TransparencyClient();
      let result = await client.getBuilding(id);

      api2.$building(id).get().then((data: any) => {
        console.log(data);
      });

      let polygon_layer_property = {
        "id": "transparency_object_property",
        "type": "fill",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": result.realProperty.shape.coordinates[0]
            }
          }
        },
        "properties": {
          "id": id
        },
        "layout": {},
        "paint": {
          "fill-color": "#4e5051",
          "fill-opacity": 0.3,
          "fill-outline-color": "#000",
        }
      };

      if (this.map.getLayer("transparency_object_property") != undefined) {

        this.map.removeLayer("transparency_object_property");
        this.map.removeSource("transparency_object_property");

      } else {
        this.map.addLayer(polygon_layer_property);
      }

      let polygon_layer = {
        "id": "transparency_object",
        "type": "fill",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": result.shape.coordinates[0]
            }
          }
        },
        "properties": {
          "id": id
        },
        "layout": {},
        "paint": {
          "fill-color": "#dd3e33",
          "fill-opacity": 1,
          "fill-outline-color": "#000",
        }
      };

      if (this.map.getLayer("transparency_object") != undefined) {

        this.map.getSource("transparency_object").setData({
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": result.shape.coordinates[0]
          }
        });

      } else {
        this.map.addLayer(polygon_layer);
      }


      let ll = result.shape.coordinates[0];

      let popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
      });
      popup.setLngLat(new mapboxgl.LngLat(polylabel(ll, 1.0)[0], polylabel(ll, 1.0)[1]));

      if (result.entrances.length > 1) {

        let html = "";

        for (let i = 0, l = result.entrances.length; i < l; i++) {
          html += "<a>" + result.entrances[i].address.street + " " + result.entrances[i].address.streetNumber + ", " + result.entrances[i].address.zip + " " + result.entrances[i].address.locality + "</a><br />";
        }
        popup.setHTML(html);
        popup.addTo(this.map);
      } else {

        let coordinates: api.GeoCoordinates = new api.GeoCoordinates();
        if (e != null) {

          if (result.entrances[0] != undefined) {
            coordinates.longitude = e.lngLat.lng;
            coordinates.latitude = e.lngLat.lat;
            this.address.name = result.entrances[0].address.street + " " + result.entrances[0].address.streetNumber + ", " + result.entrances[0].address.zip + " " + result.entrances[0].address.locality;
            this.address.uniqueIdentifier = id;
            this.address.coordinates = coordinates;
            this.address.geom = null;
            this.address.highlightedName = null;
          }
        }
        if (e != null) {

          if (result.entrances[0] != undefined) {
            commitSearchingForTransparency(store, this.address);
          }

        }
        if (result.entrances[0] != undefined) {
          commitSearchedAddressBuilding(store, result);

        }
      }
      commitObjectWindow(store, true);



    } catch {}
    commitAddressLoading(store, false);



  }

  mounted() {
    search_.commitResetState(store);
  }

  @Watch("mapLoaded")
  msl() {

    let self = this;
    let lastFeatureId: any;

    this.map.on("mousemove", "av", function (e: any) {

      let fs = self.map.queryRenderedFeatures(e.point, {layers: ["av"]});

      if (fs.length) {

        let f = fs[0];

        if (f.properties.uniqueidentifier !== lastFeatureId) {
          lastFeatureId = f.properties.uniqueidentifier;
          self.last_fs_id_hover = lastFeatureId;
          self.last_fs_layer_type_hover = f.layer.type;
          self.map.getCanvas().style.cursor = "pointer";
          if (f.layer.type != "fill-extrusion") {
            self.map.setPaintProperty("av", "fill-color",
              ["case",
                ["==", ["get", "uniqueidentifier"]
                  , f.properties.uniqueidentifier],
                "#dd3e33",
                "#9ac5d5"]);
          } else {
            self.map.setPaintProperty("av", "fill-extrusion-color",
              ["case",
                ["==", ["get", "uniqueidentifier"]
                  , f.properties.uniqueidentifier],
                "#dd3e33",
                "#9ac5d5"]);
          }
        }
      }
    });

    self.map.on("mouseleave", "av", function (e: any) {

      if (self.last_fs_layer_type_hover != "fill-extrusion") {
        self.map.setPaintProperty("av", "fill-color",
          ["case",
            ["==", ["get", "uniqueidentifier"]
              , self.last_fs_id_hover],
            "#9ac5d5",
            "#9ac5d5"]);
      } else {
        self.map.setPaintProperty("av", "fill-extrusion-color",
          ["case",
            ["==", ["get", "uniqueidentifier"]
              , self.last_fs_id_hover],
            "#9ac5d5",
            "#9ac5d5"]);
      }
      self.last_fs_id_hover = "";
      self.last_fs_layer_type_hover = "";
      lastFeatureId = "";
      // map.setPaintProperty("av", "fill-color", "#499bbc");
    });

    self.map.on("mouseleave", "av", function () {
      self.map.getCanvas().style.cursor = "";

    });

    self.map.on("click", "av", function (e: any) {
      commitAddressLoading(store, true);
      self.transparency_object(e["features"][0].properties.uniqueidentifier, e);
    });



  }
  @Watch("transparencySearchedAddress", {immediate: true})
  addressUpdateTransparency(address: api2.GeoSuggestion, oldaddress: api2.GeoSuggestion) {

    let self = this;

    if (address.name != undefined) {

      let interval = setTimeout(function () {
        try {


          commitAddressLoading(store, true);
          self.add_to_history(address);

          self.map.setCenter([address.coordinates.longitude, address.coordinates.latitude]);
          self.map.panTo([address.coordinates.longitude, address.coordinates.latitude]);
          self.set_transparency_layers(address);
          clearInterval(interval);

        } catch {

          // remove layers and reset view
          try {
            self.map.removeLayer("transparency_object");
            self.map.removeSource("transparency_object");
          } catch {
          }
          search_.commitResetState(store);

        }
      }, 100);
    } else {

      let interval = setTimeout(function () {

        try {
          self.map.removeLayer("transparency_object");
          self.map.removeSource("transparency_object");

          self.map.removeLayer("transparency_object_property");
          self.map.removeSource("transparency_object_property");

          clearInterval(interval);
        } catch {}
      }, 100);
    }

  }

}
