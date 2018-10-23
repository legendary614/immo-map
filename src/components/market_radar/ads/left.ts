import Vue from "vue";
import template from "./left_template.vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import autocomplete from "./../../address_autocomplete";
import Base from "./../../base";
import store from "../../../store";
import Debounce from "debounce-decorator";
import * as api from "@immosparrow/cockpit-api-v2";
Vue.use(require("vue-moment"));
import moment from "moment";
import modal from "../../modal";
import * as search from "../../../store/modules/search_";
const _ = require("lodash");
@Component({

  mixins: [template],
  components: {
    "autocomplete": autocomplete,
    "modal": modal
  }
})
export default class Left extends Base {

  // searchSuggestions: api.GeoSuggestionResult = new api.GeoSuggestionResult();
  selectedSearchSuggestions: Array<api.GeoSuggestion> = [];
  adsAddress: api.GeoSuggestion = new api.GeoSuggestion();
  radius: number = 0;
  showMore: boolean = true;
  activeAds: boolean = true;
  historicAds: boolean = false;
  simulateMultiple: boolean = false;
  menuOpened: boolean = false;
  viewport: string = "";
  zoom: number = 0;
  geoSearchOptions: Array<string> = ["Radius", "Locality", "Commune", "Draw manually", "Viewport"];
  selectedGeoSearchOption: string = this.geoSearchOptions[0];
  similar: string = "";
  full_address: api.GeoAddress = new api.GeoAddress();
  similarPriceSelected: number = 10;
  yearsOptions: Array<object> = [];
  yearsOptionsFrom: object = null;
  yearsOptionsTo: object = null;
  shapes: Array<any> = [];

  created() {
    let self = this;
    this.set_years_options();
    this.yearsOptionsFrom = this.yearsOptions[10];
    this.yearsOptionsTo = this.yearsOptions[0];



    this.$root.$on("shape_created", (shape: any) => {

      if (this.shapes.length) {

        let obj = this.shapes.find(function (obj) { return obj.id === shape.id; });
        if (obj != undefined) {
          obj.name = shape.name;
        } else {
          this.shapes.push(shape);
        }

      } else {
        this.shapes.push(shape);
      }
    });

  }

  remove_shape(id: string, index: number): void {
    this.$root.$emit("shape_removed", id);
    this.shapes.splice(index, 1);
  }

  stc(color: string): object {
    return {
      "background-color": color + " !important"
    };
  }

  set_years_options() {
    let start_year = new Date().getFullYear();

    for (let i = start_year; i > start_year - 100; i--) {
      this.yearsOptions.push({
        "value": i,
        "text": i,
      });

    }
  }

  @Debounce(250)
  async getSearchSuggestions () {

    const results = await api.$geo.findSuggestions({
      text: this.$parent.$refs["autocomplete_search"]["model"],
      includeGeom: true,
      suggestionTypes: [70],
      maxItemCount: 6
    });

    this.autocomplete_options = results;
    this.$parent.$refs["autocomplete_search"]["options"] = results;
    this.$parent.$refs["autocomplete_search"]["loading_data"] = false;

  }

  setStreet(data: api.GeoSuggestion, index: number) {

    this.selectedSearchSuggestions = [];
    this.selectedSearchSuggestions.push(data);
    this.$refs.autocomplete_search.options = [];
    this.$refs.autocomplete_search.model = data.name;
    this.adsAddress = data;
    this.viewport = "https://api.mapbox.com/v4/mapbox.emerald/pin-s-circle+285A98(" + this.adsAddress.coordinates.longitude + "," + this.adsAddress.coordinates.latitude + ")/" + this.adsAddress.coordinates.longitude + "," + this.adsAddress.coordinates.latitude + ",18/600x300@2x.png?access_token=pk.eyJ1IjoiYXNjYXJpeCIsImEiOiJjajQ4OGV0bXEwNW5iMzJwY2RpYmpzam5mIn0.V1p4AFPhf7Rhf3qW0jeovg";
    search.commitSearchingForMarketRadarAddress(store, data);

    api.$geo.getAddress(data.uniqueIdentifier).then((data: api.GeoAddress) => {
      this.full_address = data;
      // this.$root.$emit("show_draw_tools", true);
    });

  }

  submitForm() {
    if (this.adsAddress.name != "") {
      search.commitSearchingForMarketRadarAddress(store, this.adsAddress);
      search.commitSearchingForMarketRadarAddressRadius(store, this.radius);
    }
  }

  remove_address_item() {
    this.adsAddress = new api.GeoSuggestion();
    search.commitSearchingForMarketRadarAddress(store, this.adsAddress);
    search.commitSearchingForMarketRadarAddressRadius(store, 5);
    this.$refs.autocomplete_search.model = "";

    search.commitSearchingForMarketRadarAddress(store, new api.GeoSuggestion());

    this.$root.$emit("map_change_size", "big");
    if (document.getElementsByClassName("switch_style").length) {
      document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl";
    }

    this.$root.$emit("show_draw_tools", false);
  }

  resetForm(): void {

    // similar can be fatures or price or empty
    this.similar = "";
    this.similarPriceSelected = 10;

    // set radius to default
    this.radius = 0;

    // reset dropdown -> viewport, localities and so on
    this.selectedGeoSearchOption = "";

    // rest autocomplete model
    this.$refs.autocomplete_search.model = "";

    // reset default address and commit empty to store -> map will react
    this.adsAddress = new api.GeoSuggestion();
    search.commitSearchingForMarketRadarAddress(store, new api.GeoSuggestion());
    // hide search tools
    this.$root.$emit("show_draw_tools", false);

    // set years to default
    this.yearsOptionsFrom = this.yearsOptions[10];
    this.yearsOptionsTo = this.yearsOptions[0];

    // check / uncheck historic ads and ads
    this.historicAds = false;
    this.activeAds = true;

    // reset all layers on map
    this.$root.$emit("reset_map");

    // reset validator -> validator is not used anywhere in this module, maybe redundant, keep it for now - Sep, 24, 2018
    this.$validator.reset();

  }


  limitText(count: number): string {
    return `and ${count} other elements`;
  }

  @Watch("map_zoom", {immediate: true})
  mz() {
    this.zoom = this.map_zoom;
  }

  @Watch("marketRadarSearchedAddress", {immediate: true})
  ua(address: api.GeoSuggestion, oldaddress: api.GeoSuggestion) {

    if (address.name != undefined) {
      this.adsAddress = address;
    }
  }

  @Watch("selectedGeoSearchOption")
  ww() {
    for (let i = 0, l = this.shapes.length; i < l; i ++) {
      this.remove_shape(this.shapes[i].id, i);
    }
    this.$root.$emit("show_draw_tools", false);
    this.radius = 0;
    if (this.selectedGeoSearchOption == "Locality") {
      this.$root.$emit("highlight", {
        uniqueIdentifier: this.full_address.localityId,
        layer: "locality"
      });
    }

    if (this.selectedGeoSearchOption == "Commune") {
      this.$root.$emit("highlight", {
        uniqueIdentifier: this.full_address.communeId,
        layer: "commune"
      });
    }
    if (this.selectedGeoSearchOption == "Draw manually") {
      this.$root.$emit("show_draw_tools", true);
    }
  }

  @Watch("radius")
  wr() {
    if (this.radius > 0) {

      this.$root.$emit("draw_radius_around_point", {
        uniqueIdentifier: this.adsAddress.uniqueIdentifier,
        coordinates: this.adsAddress.coordinates,
        radius: this.radius,
        name: this.adsAddress.name
      });
    } else {
      this.$root.$emit("draw_radius_around_point", {
        uniqueIdentifier: this.adsAddress.uniqueIdentifier,
        coordinates: this.adsAddress.coordinates,
        radius: 0,
        name: this.adsAddress.name
      });
    }
  }

  @Watch("simulateMultiple")
  sm() {
    if (this.simulateMultiple) {
      this.$root.$emit("show_popup_on_map", true);
    } else {
      this.$root.$emit("show_popup_on_map", false);
    }
  }

}
