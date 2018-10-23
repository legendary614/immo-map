import { Component, Watch, Prop } from "vue-property-decorator";
import template from "./TheMapbox.vue";
import mapboxgl from "mapbox-gl";
import MapBox from "mapbox-gl-vue";
import Base from "./../base";

let tj = require("@mapbox/togeojson");
let fs = require("fs");
let DOMParser = require("xmldom").DOMParser;

import { Names } from "../shared/fake_names";

require("mapbox-gl/dist/mapbox-gl.css");

let geojsonExtent = require("geojson-extent");
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import store from "../../store";
import ColorPicker from "./../shared/color_picker";
import * as api from "@immosparrow/cockpit-api-v2";

import * as globalState from "../../store/modules/globalStates_";
import modal from "./../modal";
// import router from "../../router";
// import {cc} from "./radius";
import { setTimeout } from "timers";
// import Vue from "vue";
// import PopupShapeComponent from "./popup.shape";
// import polylabel from "polylabel";
// import RadiusMode from "./radius";


import Vue from "vue";
import polylabel from "polylabel";
import RadiusMode, { cc } from "./radius";
let MapboxDraw = require("@mapbox/mapbox-gl-draw");
import PopupShapeComponent from "./popup.shape";
import PopupObjectComponent from "./popup.object";

@Component({
  mixins: [template],
  components: {
    "mapbox": MapBox,
    ColorPicker,
    modal

  }
})
export default class MapComponent extends Base {
  last_center: any = null;
  last_zoom: any = null;
  shape_names: Array<Object> = [];
  map: any;
  // markers: Array<mapboxgl.Marker> = [];
  draw: any;
  draws: any = [];
  d2: boolean = true;
  d3: boolean = false;
  show_draw_tools: boolean = false;
  mapLoaded: boolean = false;
  mapStyleLoaded: boolean = false;
  mapSearchResults: api.ISearchResult<api.IPubLightModel> = null;
  curr: string = "";
  symbolLayers: Array<object> = [];
  searchAreasLayers: Array<any> = [];
  markers: Array<any> = [];
  cluster: object;
  clusterSource: object;
  clusterSymbol: object;
  clusterRadius: number = 50;
  markerSources: Array<any> = [];
  sources: Array<object> = [];
  localities: Array<string> = [];
  shapeNameEditFinished: boolean = false;
  draw_type: string = "";
  shape_name: string = "";
  mapSize: string = "big";

  popup: mapboxgl.Popup = new mapboxgl.Popup();
  popup_object: mapboxgl.Popup = new mapboxgl.Popup();

  timer: any = null;
  initLoad: boolean = false;

  mapInitialized(map: mapboxgl.Map) {


    map.setCenter([8.2275, 46.8182]);
    map.panTo([8.2275, 46.8182]);

    map.setZoom(7.5);
    map.setBearing(-17.6);

  }

  zoom_in() {
    let zoom_level = this.map.getZoom();
    if (zoom_level < 22) {
      this.map.flyTo({zoom: zoom_level + 0.5});
    }
  }

  zoom_out() {
    let zoom_level = this.map.getZoom();
    if (zoom_level > 1) {
      this.map.flyTo({zoom: zoom_level - 0.5});
    }
  }

  loaded(map: any) {
    let self = this;
    this.map = map;
    // let self = this;

    this.initLoad = true;
    this.mapLoaded = true;
    this.$root.$emit("map_is_loaded", true);

    this.last_center = this.map.getCenter();
    this.last_zoom = this.map.getZoom();

    // this.$root.$emit("map_change_size", "big");
    this.set_style("", true);

    let kml = new DOMParser().parseFromString(fs.readFileSync("kml/Musterdaten_swissBUILDINGS3D20_LV03_1166-44.kml", "utf8"));

    console.log(kml);
    
    let converted = tj.kml(kml);
    map.addLayer({
      "id": "room-extrusion",
      "type": "fill-extrusion",
      "source": {
          "type": "geojson",
          "data": converted
      },
      "paint": {
          // Get the fill-extrusion-color from the source "color" property.
          "fill-extrusion-color": ["get", "fill"],

          // Get fill-extrusion-height from the source "height" property.
          "fill-extrusion-height": 20,

          // Get fill-extrusion-base from the source "base_height" property.
          "fill-extrusion-base": ["get", "base_height"],

          // Make extrusions slightly opaque for see through indoor walls.
          "fill-extrusion-opacity": 0.5
        }
    });

    this.$root.$on("show_search_areas", () => {

      // console.log(self.map.getLayer(self.searchAreasLayers[0]["id"]));
      for (let i = 0, l = self.searchAreasLayers.length; i < l; i++) {

        if (self.map.getLayer(self.searchAreasLayers[0]["id"]) == undefined) {
          // for (let i = 0, l = self.searchAreasLayers.length; i < l; i++) {
            self.map.addLayer(self.searchAreasLayers[i]);
          // }


        } else {

          self.map.setLayoutProperty(self.searchAreasLayers[i]["id"], "visibility", "visible");

        }

      }

      for (let i = 0, l = self.symbolLayers.length; i < l; i++) {

        if (self.map.getLayer(self.symbolLayers[0]["id"]) == undefined) {
          self.map.addLayer(self.symbolLayers[i]);
        } else {
          self.map.setLayoutProperty(self.symbolLayers[i]["id"], "visibility", "visible");
        }
      }
      self.map.setLayoutProperty("unclustered-point", "visibility", "none");
      self.map.setLayoutProperty("cluster", "visibility", "none");
      self.map.setLayoutProperty("cluster-count", "visibility", "none");
      self.fit_bounds();
    });

    this.$root.$on("hide_search_areas", () => {

      try {
        for (let i = 0, l = self.searchAreasLayers.length; i < l; i++) {
          self.map.setLayoutProperty(self.searchAreasLayers[i]["id"], "visibility", "none");
          self.map.setLayoutProperty("symbol_" + self.searchAreasLayers[i]["id"], "visibility", "none");

        }
        if (self.map.getLayer("unclustered-point") == undefined) {
          self.map.addSource("ads", self.markerSources[0]);
          self.map.addLayer(self.markers[0]);
        } else {
          self.map.setLayoutProperty("unclustered-point", "visibility", "visible");
          self.map.setLayoutProperty("cluster", "visibility", "visible");
          self.map.setLayoutProperty("cluster-count", "visibility", "visible");
        }
      } catch {}

    });

    this.$root.$on("shape_removed", (id: string) => {

      this.removeShape(id);

    });


    self.map.on("draw.create", this.updateArea);

    let draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: this.get_map_draw_styles,
      modes: Object.assign({
        draw_radius: RadiusMode,
      }, MapboxDraw.modes),
    });

    self.map.addControl(draw);
    this.draw = draw;
    this.draws.push(draw);
  }

  set_style(val: string, d: boolean) {

    if (d) {
      this.map.setPitch(0);
      this.map.dragRotate.disable();
      this.map.touchZoomRotate.disableRotation();
      this.map.setBearing(0);
      this.d3 = false;
      this.d2 = true;

    } else {

      this.map.setPitch(45);
      this.map.setBearing(-17.5);
      this.map.dragRotate.enable();
      this.map.touchZoomRotate.enable();

      this.d3 = true;
      this.d2 = false;

    }
    if (val != "") {

      this.map.setStyle(val);
    }
  }

  created() {

    let self = this;

    this.$root.$on("reset_map", () => {
      this.set_style("mapbox://styles/ascarix/cjiyn2g07ak6v2rqop62fgw5o", true);

      this.map.setCenter([8.2275, 46.8182]);
      this.map.panTo([8.2275, 46.8182]);

      this.map.setZoom(7.5);
    });
    this.$root.$on("remove_all_markers_from_search", () => {

      try {
        if (this.map.getSource("ads") != undefined) {
          this.map.removeLayer("unclustered-point");
          this.map.removeLayer("cluster-count");
          this.map.removeLayer("clusters");
          this.map.removeSource("ads");
          this.mapSearchResults = null;

        }
      } catch {}

    });

    this.$root.$on("map_change_size", function (value: string) {

      let mapDiv = document.getElementById("map");
      // let mapCanvas = document.getElementsByClassName("mapboxgl-canvas")[0];
      self.mapSize = value;
      if (value == "small") {

        mapDiv.style.width = "calc(" + window.getComputedStyle(mapDiv).width + " - 650px)";
      } else {
        mapDiv.style.width = "100%";

      }

      self.map.resize();

    });

    this.$root.$on("show_draw_tools", (show: boolean) => {
      this.show_draw_tools = show;
    });

    this.$root.$on("localityUniqueIdentifier", (localityUniqueIdentifier: string) => {

      this.localities = [];
      let pixelSpaceBoundingBox = [this.map.project(this.map.getBounds().getNorthEast()),
        this.map.project(this.map.getBounds().getSouthWest())];

      let features =
        this.map.queryRenderedFeatures(pixelSpaceBoundingBox, {
          layers: ["locality"]
        });

      if (features.length > 0) {

        for (let i = 0, l = features.length; i < l; i++) {

          if (localityUniqueIdentifier != "") {
            if (features[i].properties.uniqueidentifier == localityUniqueIdentifier) {
              self.map.setPaintProperty("locality", "fill-color",
                ["case",
                  ["==", ["get", "uniqueidentifier"]
                    , localityUniqueIdentifier],
                  "#dd3e33",
                  "transparent"]);
            }
          } else {
            self.map.setPaintProperty("locality", "fill-color",
              ["case",
                ["==", ["get", "uniqueidentifier"]
                  , localityUniqueIdentifier],
                "transparent",
                "transparent"]);
          }
        }
      }
    });

    this.curr = this.$router["history"].current.path;

  }

  draw_shape(type: string) {

    this.draw.changeMode(type);

  }

  delete_draw() {

    for (let i = 0, l = this.draws.length; i < l; i++) {

      try {
        this.draws[i].delete(this.draws[i].getSelected().features[0].id);
      } catch {
      }
    }
  }

  setColor(color: string) {
    this.$refs.colorpicker.defaultColor = color;
    this.$refs.colorpicker.showAllColors = false;
  }

  fit_bounds() {

    if (this.searchAreasLayers.length) {

      let geo_layers = {
        "type": "FeatureCollection",
        "features": <any> []
      };

      for (let i = 0, l = this.searchAreasLayers.length; i < l; i++) {
        geo_layers["features"].push({
          "type": "Feature",
          "properties": {
            id: new Date().toString()
          },
          "geometry": {
            "type": "Polygon",
            // if must be here since circles use map source (typeof this.searchAreasLayers[i]["source"] == "string") and you got circle
            "coordinates": <any>  ( this.searchAreasLayers[i]["source"].data.geometry == undefined) ?
              this.searchAreasLayers[i]["source"].data.features[0].geometry.coordinates :
              this.searchAreasLayers[i]["source"].data.geometry.coordinates
          }
        });
      }

      if (this.$router["history"].current.path == "/search" || this.$router["history"].current.path == "/market-radar/ads") {
        this.map.fitBounds(geojsonExtent(geo_layers), {
          padding: 160
        });
      } else {
        this.map.fitBounds(geojsonExtent(geo_layers));
      }
    }
  }


  @Watch("mapLoaded")
  ss() {
    if (this.mapLoaded) {
      globalState.commitMapLoaded(store, true);
    }
  }

  drawShapeFromAddress(shape: any) {

    let self = this;
    let polygon_layer = {
      "id": shape.id,
      "type": "fill",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "geometry": {
            "type": shape.type == undefined ? "MultiPolygon" : "Polygon",
            "coordinates": shape.geo.coordinates
          }
        }
      },
      metadata: {
        name: shape.name
      },
      properties: {
        color: shape.color
      },
      "layout": {},
      "paint": {
        "fill-color": shape.color,
        "fill-opacity": 0.4,
        "fill-outline-color": "#000",
      }
    };
    self.map.addLayer(polygon_layer);
    if (shape.type != undefined) {
      let symbol_layer = {
        "id": "symbol_" + shape.id,
        "type": "symbol",
        "source": shape.id,
        "layout": {
          "text-field": shape.name,
          "text-font": [
            "DIN Offc Pro Medium",
            "Arial Unicode MS Bold"
          ],
          "text-size": 12
        }
      };
      this.map.addLayer(symbol_layer);
      this.symbolLayers.push(symbol_layer);
    }


    self.searchAreasLayers.push(polygon_layer);
    self.fit_bounds();

  }

  removeShapeFromAddress(id: string) {

    this.map.removeLayer(id);
    this.map.removeLayer("symbol_" + id);
    this.map.removeSource(id);

    for (let i = 0, l = this.searchAreasLayers.length; i < l; i ++) {

      if (this.searchAreasLayers[i] != undefined) {
        if (this.searchAreasLayers[i].id == id) {
          this.searchAreasLayers.splice(i, 1);
        }
      }
    }

    this.fit_bounds();

    if (this.searchAreasLayers.length == 0) {
      // remove all results
      this.$root.$emit("remove_all_markers_from_search");
      this.$root.$emit("remove_all_results");
      this.mapSearchResults = null;
      this.searchAreasLayers = [];
    }

  }

  removeShape(id: string) {

    this.map.removeLayer(id);
    this.map.removeSource(id);

    // not all layers has symbols
    try {
      this.map.removeLayer("symbol_" + id);
    } catch {
    }

    for (let i = 0, l = this.searchAreasLayers.length; i < l; i ++) {

      if (this.searchAreasLayers[i] != undefined) {
        if (this.searchAreasLayers[i].id == id) {
          this.searchAreasLayers.splice(i, 1);
        }
      }
    }

    this.fit_bounds();

  }

  redrawLayersFromAddress() {

    try {
      for (let i = 0, l = this.searchAreasLayers.length; i < l; i++) {
        this.map.addLayer(this.searchAreasLayers[i]);
      }

      for (let i = 0, l = this.symbolLayers.length; i < l; i++) {

        if ("symbol_" + this.shape_names[i]["id"] == this.symbolLayers[i]["id"]) {
          this.symbolLayers[i]["layout"]["text-field"] = this.shape_names[i]["name"];
          this.map.addLayer(this.symbolLayers[i]);
        }
      }

      this.fit_bounds();
    } catch (err) {
      console.log(err);
    }

    /*try {
      this.map.addSource("adsWithDuplicatedCoordinates", this.clusterSource);
      this.map.addLayer(this.cluster);
      this.map.addLayer(this.clusterSymbol);
    } catch {

    }*/
  }

  updateArea(e: any) {

    let self = this;

    let shape_name = this.shape_name;

    let id = (Math.floor(Math.random() * (1000000 - 0 + 1)) + 0).toString();

    if (e["features"][0]["properties"]["radius"] != undefined) {

      let source = cc([e["features"][0].geometry.coordinates[0], e["features"][0].geometry.coordinates[1]],
        e["features"][0]["properties"]["radius"] / 1000);

      let circle_layer = {
        "id": id,
        "type": "fill",
        "source": source,
        layout: {},
        "paint": {
          "fill-color": this.$refs.colorpicker.defaultColor,
          "fill-opacity": 0.3,
          "fill-outline-color": "#000",
        },
        "properties": {
          "id": id
        }
      };
      this.searchAreasLayers.push(circle_layer);
      this.map.addLayer(circle_layer);

      let shape = {
        id: id,
        name: shape_name,
        color: this.$refs.colorpicker.defaultColor,
        geom: {
          type: "polygon",
          coordinates: source["data"]["features"][0]["geometry"]["coordinates"]
        }
      };
      this.shape_names.push(shape);

      let symbol_layer = {
        "id": "symbol_" + id,
        "type": "symbol",
        "source": id,
        "layout": {
          "text-field": shape_name,
          "text-font": [
            "DIN Offc Pro Medium",
            "Arial Unicode MS Bold"
          ],
          "text-size": 12
        }
      };
      this.map.addLayer(symbol_layer);
      this.symbolLayers.push(symbol_layer);

      setTimeout(function () {
        self.delete_draw();
      }, 100);


      let popup_component = new Vue({

        name: "popup_app",
        data: {
          shape: shape,
          polygon_symbol: circle_layer,
        },
        components: {
          "pp": PopupShapeComponent
        },
        methods: {
          updateShapeName() {
            self.updateShapeName(id, shape);
          },
          closePopup() {
            self.closePopup(shape);
          },
          shape_model_changed(shape: any) {

            self.shape_name = shape;
          }
        },
        parent: this,
        template: '<pp ref="popup_shape" @shape_model_changed="shape_model_changed" v-bind:polygonSymbol="polygon_symbol" v-bind:shape="shape" v-bind:updateShapeName="updateShapeName" v-bind:closePopup="closePopup"   />'
      }).$mount();

      // Need to be triggered somehow DO NOT REMOVE!
      setTimeout(function () {
        self.popup.setLngLat(e["features"][0].geometry.coordinates)
          .setDOMContent(popup_component.$el)
          .addTo(self.map);

      }, 100);

      this.map.on("click", id, function (e1: any) {

        self.popup.setLngLat(e["features"][0].geometry.coordinates)
          .setDOMContent(popup_component.$el)
          .addTo(self.map);
      });

      this.map.on("mouseenter", id, function () {
        self.map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      this.map.on("mouseleave", id, function () {
        self.map.getCanvas().style.cursor = "";
      });


    } else {

      let shape = {
        id: id,
        name: shape_name,
        color: this.$refs.colorpicker.defaultColor,
        geom: {
          type: "polygon",
          coordinates: e["features"][0].geometry.coordinates
        }
      };

      this.shape_names.push(shape);

      let polygon_layer = {
        "id": id,
        "type": "fill",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": e["features"][0].geometry.coordinates
            }
          }
        },
        "properties": {
          "id": id
        },
        "metadata": {
          "name": shape_name
        },
        "layout": {},
        "paint": {
          "fill-color": this.$refs.colorpicker.defaultColor,
          "fill-opacity": 0.3,
          "fill-outline-color": "#000",
        }
      };
      this.map.addLayer(polygon_layer);
      // this.layers.push(polygon_layer);

      let polygon_symbol = {
        "id": "symbol_" + id,
        "type": "symbol",
        "source": id,
        "layout": {
          "text-field": shape_name,
          "text-font": [
            "DIN Offc Pro Medium",
            "Arial Unicode MS Bold"
          ],
          "text-size": 12
        },
        "properties": {
          "name": shape_name
        }
      };
      this.map.addLayer(polygon_symbol);
      this.symbolLayers.push(polygon_symbol);

      this.searchAreasLayers.push(polygon_layer);
      // this.searchAreasLayers.push(polygon_symbol);

      setTimeout(function () {
        self.delete_draw();
      }, 100);

      let p = polylabel(e["features"][0].geometry.coordinates, 1.0);

      let popup_component = new Vue({

        name: "popup_app",
        data: {
          shape: shape,
          polygon_symbol: polygon_symbol,
        },
        components: {
          "pp": PopupShapeComponent
        },
        methods: {
          updateShapeName() {
            self.updateShapeName(id, shape);
          },
          closePopup() {
            self.closePopup(shape);
          },
          shape_model_changed(shape: any) {

            self.shape_name = shape;
          }
        },
        parent: this,
        template: '<pp ref="popup_shape" @shape_model_changed="shape_model_changed" v-bind:polygonSymbol="polygon_symbol" v-bind:shape="shape" v-bind:updateShapeName="updateShapeName" v-bind:closePopup="closePopup"   />'
      }).$mount();

      // Need to be triggered somehow DO NOT REMOVE!
      setTimeout(function () {
        self.popup.setLngLat(p)
          .setDOMContent(popup_component.$el)
          .addTo(self.map);

      }, 100);


      this.map.on("click", id, function (e: any) {

        self.popup.setLngLat(p)
          .setDOMContent(popup_component.$el)
          .addTo(self.map);
      });

      this.map.on("mouseenter", id, function () {
        self.map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      this.map.on("mouseleave", id, function () {
        self.map.getCanvas().style.cursor = "";
      });

    }
    this.shapeNameEditFinished = false;
    try {
      let searchSidebar = document.querySelector("#side-overlay");
      searchSidebar.classList.add("active");
      globalState.commitSetSearchSidebar(this.$store, true);
    } catch {}
    this.fit_bounds();
  }

  closePopup(shape: any) {

    if (shape.name == "") {

      this.map.removeLayer(shape.id);
    }

    this.popup.remove();
  }
  updateShapeName(id: string, shape: any) {

    shape.name = this.shape_name;
    this.map.setLayoutProperty("symbol_" + id, "text-field", this.shape_name);
    this.popup.remove();

    this.$root.$emit("shape_created", shape);
  }


}
