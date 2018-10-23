import { Component, Watch, Prop } from "vue-property-decorator";
import * as search_ from "./../../store/modules/search_";
import store from "../../store";

import * as api from "@immosparrow/cockpit-api-v2";
import { setTimeout } from "timers";
import MapComponent from "./index";
import * as searchModule from "../../store/modules/searchModule";
import mapboxgl from "mapbox-gl";

import * as globalState from "../../store/modules/globalStates_";
import _ from "underscore";
import Vue from "vue";
import PopupMultipleObjectsComponent from "./popup.multiple.objects";

@Component({
  mixins: [],
  components: {

  }
})
export default class SearchMapComponent extends MapComponent {

  loadMap() {

    this.map.setPitch(0);

    this.addSearchResultsToMap();
    this.show_draw_tools = true;
    let self = this;
    this.map.on("click", "unclustered-point", function (e: any) {

      self.getClickedAd(e.features[0].properties.itemId)
        .then((adInfo: api.PubModel) => {

          self.$root.$emit("show_object", adInfo.id);
          self.map.setPaintProperty("unclustered-point", "circle-color",
            ["case",
              ["==", ["get", "itemId"]
                , e.features[0].properties.itemId],
              "#dd2117",
              "#11b4da"]);
          self.map.setPaintProperty("unclustered-point", "circle-radius",
            ["case",
              ["==", ["get", "itemId"]
                , e.features[0].properties.itemId],
              8,
              6]);

          self.popup_object.on("close", function () {

            self.$root.$emit("hide_object", adInfo.id);

            self.map.setPaintProperty("unclustered-point", "circle-color",
              ["case",
                ["==", ["get", "itemId"]
                  , e.features[0].properties.itemId],
                "#11b4da",
                "#11b4da"]);

            self.map.setPaintProperty("unclustered-point", "circle-radius",
              ["case",
                ["==", ["get", "itemId"]
                  , e.features[0].properties.itemId],
                6,
                6]);
          });
        });
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    this.map.on("mouseenter", "unclustered-point", function () {
      self.map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    this.map.on("mouseleave", "unclustered-point", function () {
      self.map.getCanvas().style.cursor = "";
    });

    self.map.on("style.load", function () {

      self.mapStyleLoaded = true;

      let searchSidebar = document.querySelector("#side-overlay");
      if (searchSidebar.classList.contains("active")) {
        self.redrawLayersFromAddress();
        self.map.setLayoutProperty("unclustered-point", "visibility", "none");
        self.map.setLayoutProperty("cluster", "visibility", "none");
        self.map.setLayoutProperty("cluster-count", "visibility", "none");

      } else {
        if (self.map.getSource("ads") == undefined) {
          self.map.addSource("ads", self.markerSources[0]);
          self.map.addLayer(self.markers[0]);

          self.map.addSource("adsWithDuplicatedCoordinates", self.clusterSource);
          self.map.addLayer(self.cluster);
          self.map.addLayer(self.clusterSymbol);

        }
      }

    });

    this.$root.$on("highlight_marker", (localityUniqueIdentifier: string) => {

      let pixelSpaceBoundingBox = [this.map.project(this.map.getBounds().getNorthEast()),
        this.map.project(this.map.getBounds().getSouthWest())];

      let features =
        this.map.queryRenderedFeatures(pixelSpaceBoundingBox, {
          layers: ["unclustered-point"]
        });
      let lastFeatureId: any;
      if (features.length > 0) {

        for (let i = 0, l = features.length; i < l; i++) {

          if (features[i].properties.itemId !== lastFeatureId) {

            if (localityUniqueIdentifier != "") {


              if (features[i].properties.itemId == localityUniqueIdentifier) {

                lastFeatureId = features[i].properties.itemId;

                self.map.setPaintProperty("unclustered-point", "circle-color",
                  ["case",
                    ["==", ["get", "itemId"], localityUniqueIdentifier], "#dd2117",
                    "#11b4da"
                  ]);
                self.map.setPaintProperty("unclustered-point", "circle-radius",
                  ["case",
                    ["==", ["get", "itemId"], localityUniqueIdentifier], 8,
                    6
                  ]);
              }
            } else {

              self.map.setPaintProperty("unclustered-point", "circle-color",
                ["case",
                  ["==", ["get", "itemId"]
                    , localityUniqueIdentifier],
                  "#11b4da",
                  "#11b4da"]);

              self.map.setPaintProperty("unclustered-point", "circle-radius",
                ["case",
                  ["==", ["get", "itemId"], localityUniqueIdentifier], 6,
                  6
                ]);

            }
          }
        }
      }
    });

    this.$root.$on("remove_shape_from_address", (id: string) => {

      this.removeShapeFromAddress(id);

    });

    this.$root.$on("draw_shape_from_address", (shape: any) => {

      this.drawShapeFromAddress(shape);

    });

    self.map.on("moveend", function (a: any, b: any, c: any) {

      const current_center = self.map.getCenter();
      const current_zoom = self.map.getZoom();

      if (current_center != self.last_center || current_zoom != self.last_zoom) {

        self.last_center = current_center;
        self.last_zoom = current_zoom;

        if (searchModule.getMapSearchResults(store) != undefined && searchModule.getMapSearchResults(store).items != undefined) {
          if (searchModule.getMapSearchResults(store).items.length) {

            let searchSidebar = document.querySelector("#sidebar-fixed");

            try {
              if (searchSidebar.classList.contains("active")) {

                if (self.map.getSource("ads") != undefined) {
                  self.get_localities();
                  self.getAdsInViewport();
                }
              }
            } catch {
              self.getAdsInViewport();
            }
          }
        }
      }
    });

  }

  getAdsInViewport() {
    let mapBounds = this.map.getBounds();
    globalState.updateLoadingSearchResults(store, true);
    globalState.commitShowMapRightSidebar(store, true);
    // this.$root.$emit("map_change_size", "small");
    clearTimeout(this.timer);
    // Small delay
    let features = this.adsInBounds(mapBounds);
    this.timer = setTimeout(() => {
      this.getMultipleAds(features);
    }, 1000);
  }

  // Check if result items are in bounds of viewport
  adsInBounds(mapBounds: any) {
    let self = this;
    let notOnMap = true;
    let results: Array<string> = [];
    if (self.mapSearchResults["items"]) {
      self.mapSearchResults.items.forEach(function (item) {
        // localityID or coordinates
        if (item.address["coordinates"]) {
          if (item.address.coordinates.latitude > mapBounds._sw.lat && item.address.coordinates.latitude < mapBounds._ne.lat &&
            item.address.coordinates.longitude > mapBounds._sw.lng && item.address.coordinates.longitude < mapBounds._ne.lng) {
            results.push(item.id);
          }
        } else if (self.localities.indexOf(item.address["localityId"]) !== -1) {
          results.push(item.id);
          notOnMap = false;
        }
      });
      if (self.initLoad && notOnMap) {
        results = this.getAllAds();
        self.initLoad = false;
      }
    }
    return results;
  }

  getAllAds () {

    let self = this;
    let results: Array<string> = [];
    if (self.mapSearchResults["items"]) {
      self.mapSearchResults.items.forEach(function (item) {
        results.push(item.id);
      });
    }
    return results;
  }

  async getMultipleAds(adsInViewport: Array<string>) {
    let model = new api.PublicationsClient();
    const results: Array<api.PubModel> = await model.getMultiple(adsInViewport);
    this.$emit("setAdsInViewport", results);
    globalState.commitShowMapRightSidebar(store, true);
    globalState.updateLoadingSearchResults(store, false);
  }

  async getClickedAd(uniqueId: string) {
    let model = new api.PublicationsClient();
    const res: api.PubModel = await model.get(uniqueId);
    return res;
  }

  get_localities() {

    this.localities = [];
    let pixelSpaceBoundingBox = [this.map.project(this.map.getBounds().getNorthEast()),
      this.map.project(this.map.getBounds().getSouthWest())];

    let features =
      this.map.queryRenderedFeatures(pixelSpaceBoundingBox, {
        layers: ["locality"]
      });

    if (features.length > 0) {

      for (let i = 0, l = features.length; i < l; i++) {
        this.localities.push(features[i].properties.uniqueidentifier);
      }
    }
  }
  async getClusterData(clusterData: Array<string>) {
    let model = new api.PublicationsClient();
    const results: Array<api.PubModel> = await model.getMultiple(clusterData);
    return results;
  }

  addSearchResultsToMap() {

    let self = this;
    let features: any = [];
    let featuresWithSameCoordinates: any = [];

    self.mapSearchResults = searchModule.getMapSearchResults(store);

    if (self.mapSearchResults) {
     if (self.mapSearchResults.totalItemCount) {

      let groupedData = _.groupBy(self.mapSearchResults.items, (elem: any) => {
        if (elem.coordinates != undefined) {
          return elem.coordinates.longitude + "_"  + elem.coordinates.latitude; // here you can specify whichever key you want to check duplicates for
        }
      });

      for (let i in groupedData) {

        if (i.valueOf().indexOf("undefined") == -1 && groupedData[i].length > 1) {
          groupedData[i].forEach((item: api.PubLightModel) => {
            featuresWithSameCoordinates.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [item.address.coordinates.longitude, item.address.coordinates.latitude],
              },
              "itemId": item.id,
              "properties": {
                "icon": "monument",
                "itemId": item.id
              },
            });
          });
        } else {
          groupedData[i].forEach((item: api.PubLightModel) => {
            if (item.address.coordinates) {
              features.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [item.address.coordinates.longitude, item.address.coordinates.latitude],
                },
                "itemId": item.id,
                "properties": {
                  "icon": "monument",
                  "itemId": item.id
                },
              });
            }
          });
        }
      }

      this.clusterSource = {
        type: "geojson",
        data: {
          "type": "FeatureCollection",
          "features": featuresWithSameCoordinates

        },
        cluster: true,
        clusterMaxZoom: 21, // Max zoom to cluster points on
        clusterRadius: this.clusterRadius // Radius of each cluster when clustering points (defaults to 50)
      };
      this.map.addSource("adsWithDuplicatedCoordinates", this.clusterSource);

      this.cluster = {
        id: "cluster",
        type: "circle",
        source: "adsWithDuplicatedCoordinates",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Pink hard, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Green, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#d61683",
            100,
            "#f1f075",
            750,
            "#bcf26c"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40
          ]
        }
      };
      self.map.addLayer(this.cluster);

      this.clusterSymbol = {
        id: "cluster-count",
        type: "symbol",
        source: "adsWithDuplicatedCoordinates",
        filter: [">=", "point_count", 2],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        },
        paint: {
          "text-color": "#000000",
        }
      };
      self.map.addLayer(this.clusterSymbol);

      self.map.on("click", "cluster", (e: any) => {
        let features = self.map.queryRenderedFeatures(e.point, { layers: ["cluster"] });
        let coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        let clusterId = features[0].properties.cluster_id;
        let pointCount = features[0].properties.point_count;

        let clusterSource = self.map.getSource(/* cluster layer data source id */"adsWithDuplicatedCoordinates");

        clusterSource.getClusterLeaves(clusterId, pointCount, 0, function(err: any, aFeatures: any) {

          let ids = [];
          for (let i = 0, l = aFeatures.length; i < l; i++) {
            ids.push(aFeatures[i].itemId);
          }

          self.getClusterData(ids).then((data: Array<api.PubModel>) => {

            let popup_component = new Vue({

              name: "popup_objects_app",
              data: {
                adsInfo: data,
                adInfo: {},
              },
              components: {
                "pp": PopupMultipleObjectsComponent
              },
              methods: {
                selectAddress(a: api.PubModel) {
                  console.log(a);
                  self.$root.$emit("show_object", a.id);
                  this.adInfo = a;
                },
                closePopup() {
                  self.popup.remove();
                }
              },
              parent: self,
              template: '<pp ref="popup_objects" v-bind:adsInfo="adsInfo" v-bind:closePopup="closePopup" :selectAddress="selectAddress" :uniqueIdentifier="adInfo.uniqueIdentifier"/>'
            }).$mount();

            // Need to be triggered somehow DO NOT REMOVE!
            setTimeout(function () {
              self.popup.setLngLat(coordinates)
                .setDOMContent(popup_component.$el)
                .addTo(self.map);

            }, 100);

          });

        });
      });

      self.map.on("mouseenter", "cluster", () => {
        self.map.getCanvas().style.cursor = "pointer";
      });
      self.map.on("mouseleave", "cluster", () => {
        self.map.getCanvas().style.cursor = "";
      });

      /*self.mapSearchResults.items.forEach(function (item) {
        // localityID or coordinates
        if (item.coordinates) {
          features.push({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [item.coordinates.longitude, item.coordinates.latitude],
            },
            "itemId": item.uniqueIdentifier,
            "properties": {
              "icon": "monument",
              "itemId": item.uniqueIdentifier
            },
          });
        }

      });*/
      let coordsMin = [Math.min.apply(Math, features.map(function (o: any) {
        return o.geometry.coordinates[0];
      })), Math.min.apply(Math, features.map(function (o: any) {
        return o.geometry.coordinates[1];
      }))];
      let coordsMax = [Math.max.apply(Math, features.map(function (o: any) {
        return o.geometry.coordinates[0];
      })), Math.max.apply(Math, features.map(function (o: any) {
        return o.geometry.coordinates[1];
      }))];
      self.map.fitBounds([coordsMin, coordsMax], {padding: 20});

        try {

          let ads = {
            type: "geojson",
            data: {
              "type": "FeatureCollection",
              "features": features
            }
          };
          this.map.addSource("ads", ads);

          let up = {
            id: "unclustered-point",
            type: "circle",
            source: "ads",
            filter: ["!has", "point_count"],
            paint: {
              "circle-color": "#11b4da",
              "circle-radius": 6,
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff"
            }
          };
          this.map.addLayer(up);
          this.markers.push(up);
          this.markerSources.push(ads);
        } catch (err) {
          console.log(err);
        }
      }
    }

    // this.$root.$emit("hide_search_areas");
  }

  @Watch("mainSearchedAddress", {immediate: true})
  addressUpdate() {

    let self = this;
    let interval = setTimeout(function () {
      try {

        let e = {
          id: self.mainSearchedAddress.uniqueIdentifier,
          geo: self.mainSearchedAddress.geom,
          name: self.mainSearchedAddress.name,
        };
        try {
          self.drawShapeFromAddress(e);
        } catch {
        }
        search_.commitResetState(store);

        clearInterval(interval);

      } catch {
        search_.commitResetState(store);
      }
    }, 100);
  }

  @Watch("showSearchMap")
  ae() {

    if (this.showSearchMap) {
      this.addSearchResultsToMap();
      // this.redraw_layers_from_address();

    }
  }

  @Watch("mapLoaded")
  ml() {
    this.loadMap();
  }

  created() {

  }

}
