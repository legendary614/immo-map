import Vue from "vue";
import autocomplete from "./address_autocomplete";
import { Component, Watch } from "vue-property-decorator";
import axios from "axios";
import * as api2 from "@immosparrow/cockpit-api-v2";
import * as userProfile from "../store/modules/userProfile";
import store from "../store";
import * as search_ from "./../store/modules/search_";
import accounting from "accounting";
import * as globalState from "../store/modules/globalStates_";
import colorpicker from "./shared/color_picker";
import Debounce from "debounce-decorator";
import {
  commitObjectWindow,
  commitSidebar as commitMapSidebar,
  getObjectWindow,
  getSearchedAddressBuilding,
  getSidebar as getMapSideBar
} from "../store/modules/search_";

/*import * as history from "../store/modules/history";
import * as bookmarks from "../store/modules/bookmarks";
import * as docs from "../store/modules/docs";*/
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import * as searchModule from "../store/modules/searchModule";

// import * as _ from "underscore";
const _ = require("lodash");
@Component({
  name: "BaseComponent",
  // mixins: [template],
  components: {
    "autocomplete": autocomplete,

  }
})
export default class BaseComponent extends Vue {

  autocomplete_options: any = [];

  $refs: {
    autocomplete: autocomplete,
    autocomplete_search: autocomplete,
    autocomplete_profile: autocomplete,
    autocomplete_geo: autocomplete,
    map: any,
    colorpicker: colorpicker,
    cur: any,
    slider: any,
    topPagination: any,
    bottomPagination: any,
    topPagination2: any,
    bottomPagination2: any,
  };

  // for bookmarks editing var
  editing: string = "";

  show_modal: boolean = false;
  // start with tabs
  hide_search: boolean = false;
  hide_bookmarks: boolean = true;
  hide_docs: boolean = true;
  hide_history: boolean = true;
  hide_abo: boolean = true;
  tabs: object = {
    "search": true,
    "bookmarks": false,
    "docs": false,
    "history": false,
    "abo": false,
    "overview": false,
    "analytics": false,
    "similar": false,
  };
  // end with tabs

  // history start
  history_dates: Array<string> = [];
  history_objects_temp: any = [];
  history_objects: any = [];
  history_loaded: boolean  = false;
  // history end

  map_zoom: number = 0;

  format_money(number: number) {
    return accounting.formatMoney(number, "", 0, "'", ","); // &euro;4.999,99
  }

  closeMainMenu () {
    globalState.commitSetSidebar(store, false);
  }
  mainMenuToggle () {
    globalState.commitSetSidebar(store, !globalState.getSidebar(store));
  }


  hilight_marker(ad: api2.PubModel, empty: string) {

    if (empty == "") {
      this.$root.$emit("highlight_marker", "");
    } else {
      this.$root.$emit("highlight_marker", ad.id);
    }

    // console.log(ad["address"]["localityUniqueIdentifier"]);
  }

  searchSidebarToggle () {
    let searchSidebar =  document.querySelector("#side-overlay");
    if (searchSidebar.classList.contains("active")) {
      searchSidebar.classList.remove("active");
      globalState.commitSetSearchSidebar(this.$store, false);
    } else {
      searchSidebar.classList.add("active");
      globalState.commitSetSearchSidebar(this.$store, true);
    }
  }

  add_to_history(address: api2.GeoSuggestion) {

    console.log(address);
    address["time"] = new Date();
    // history.commitAddToTransparencyHistory(store, address);

  }
  edit_bookmark(address: api2.GeoSuggestion, action: string, date: string) {

    this.editing = address.uniqueIdentifier;

    if (action == "save") {
      this.editing = "";
      address["scope"] = date;
      // bookmarks.update_bookmark(store, address);
    }
  }
  remove_doc(address: api2.GeoSuggestion) {
    // docs.RemoveDoc(store, address);
  }

  bookmark(address: api2.GeoSuggestion) {

    if (this.isAddressBookmarked(address)) {
      console.log("bookmarked");
      // bookmarks.commitRemoveFromBookmarks(store, address);
    } else {
      console.log("not bookmarked");
      // bookmarks.commitAddToBookmarks(store, address);
    }
  }

  isAddressBookmarked(address: api2.GeoSuggestion) {

    for (let i = 0, l = this.bkmrks.length; i < l; i++) {
      for (let g = 0, f = this.bkmrks[i].data.length; g < f; g++) {
        if (this.bkmrks[i].data[g].uniqueIdentifier == address.uniqueIdentifier) {
          return true;
        }
      }
    }

    return false;

  }

  get showSearchMap() {
    return globalState.getSearchMap(store);
  }
  // globalState.commitShowSearchMap(store, true);
  get transparency_history() {
    return new Array(); // history.getTransparencyHistory(store);
  }

  get bkmrks() {
    return new Array(); // bookmarks.getBookmarks(store);
  }

  get documents() {
    return new Array(); // docs.getDocs(store);
  }

  empty_history(action: boolean) {

    if (action) {
      this.show_modal = false;
      // history.commitResetHistory(store);
    } else {
      this.show_modal = true;
    }

  }

  empty_bookmarks(action: boolean) {

    if (action) {
      this.show_modal = false;
      // bookmarks.commitResetBookmarks(store);
    } else {
      this.show_modal = true;
    }

  }

  empty_docs(action: boolean) {

    if (action) {
      this.show_modal = false;
      // docs.resetDocs(store);
    } else {
      this.show_modal = true;
    }

  }

  get map_size() {
    return globalState.getMapSize(store);
  }
  get object_window() {
    return getObjectWindow(store);
  }

  get map_sidebar() {
    return getMapSideBar(store);
  }

  get isMapLoaded() {
    return globalState.mapLoaded(store);
  }


  get showMapRightSidebar() {
    return globalState.getMapRightSidebar(store);
  }
  get mainSearchedAddress() {
    return search_.getSearchedAddress(store);
  }

  get searchResultsFromMap() {
    return searchModule.getSearchResults(store);
  }

  get transparencySearchedAddress() {
    return search_.getSearchedAddressTransparency(store);
  }
  get marketRadarSearchedAddressRadius() {
    return search_.getSearchedAddressMarketRadarRadius(store);
  }
  get marketRadarSearchedAddress() {
    return search_.getSearchedAddressMarketRadar(store);
  }

  get isLeftSearchBarOpened() {
    return globalState.getSearchSideBar(store);
  }

  get isRightSideBarOpened() {
    return globalState.getRightSidebar(store);
  }

  get transparencySideBarOpened() {
    return globalState.getTransparencySidebar(store);
  }

  get building() {
    return getSearchedAddressBuilding(store);
  }

  get_building_type(no: number) {

    let e: any = {
      0: "Unknown",
      1: "Verwaltung",
      2: "Wohngebaeude",
      4: "Verkehr",
      5: "Handel",
      6: "Industrie_Gewerbe",
      8: "Nebengebaeude"
    };

    return e[no];
  }

  @Debounce(250)
  async searchAllModules(no: number) {


    const results = await api2.$geo.findSuggestions({
      text: this.$parent.$refs["autocomplete"]["model"],
      includeGeom: true,
      suggestionTypes: [],
      maxItemCount: 6
    });

    console.log(results);
    this.autocomplete_options = results;
    this.$parent.$refs["autocomplete"]["options"] = results;
    this.$parent.$refs["autocomplete"]["loading_data"] = false;


  }

  get_icon(no: number) {

    /*
      Canton = 10,
      District = 20,
      Commune = 30,
      Quarter = 40,
      Locality = 50,
      Street = 60,
      EntranceAddress = 70
     */

    // return "icon_" + no.toString();

    let name = "";
    switch (no) {
      case 10:
        name = "Canton";
      break;

      case 20:
        name = "District";
        break;

      case 30:
        name = "Commune";
        break;

      case 40:
        name = "Quarter";
        break;

      case 50:
        name = "Locality";
        break;

      case 60:
        name = "";
        break;

      case 70:
        name =  "";
        break;
    }
    return name;

  }

  get_products(no: number) {

    let product_types = [
      {
        name: "search",
        types: [10, 20, 30, 40, 50]
      },
      {
        name: "market_radar",
        types: [api2.GeoAddressPartType.EntranceAddress]
      },
      {
        name: "transparency",
        types: [api2.GeoAddressPartType.EntranceAddress]
      }
    ];
    // let types = api.GeoSuggestionTypeEnum;
    let products = [];
    // console.log(types[no]);

    for (let i = 0, l = product_types.length; i < l; i++) {

      if (product_types[i].types.indexOf(no) > -1) {
        products.push(product_types[i].name);
      }
    }

    return products;

  }

  print_(address: api2.GeoSuggestion) {

    let self = this;
    address["time"] = new Date();

    let quotes = document.getElementById("print");
    // docs.AddToDocs(store, address);

    html2pdf(quotes, {
      margin:       0.8,
      filename:     address.name,
      // image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { dpi: 192, letterRendering: true },
      jsPDF:        { unit: "cm", format: "a4", orientation: "portrait" }
    }, function(data: any) {
      // console.log(data)
    }).then(function (data: any) {

      // self.printing = false;
    });
  }


  toggle(what: string) {

    for (let i in this.tabs) {
      if (i == what) {
        this.tabs[i] = true;
      } else {
        this.tabs[i] = false;
      }
    }

    try {
      let searchSidebar = document.querySelector("#side-overlay");
      searchSidebar.classList.add("active");
      globalState.commitSetSearchSidebar(this.$store, true);

    } catch  {

    }
  }


  @Watch("object_window")
  ow(val: boolean) {
    try {
      if (val) {
        document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl on_left second";
      } else {
        document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl";
      }
    } catch {}
  }


  new_colors () {
    return [
    "#86ACDC",
      "#CCDCF1",
      "#98B9E3",
      "#5C90D2",
      "#E4DCF2",
      "#C7B7E4",
      "#A48AD4",
      "#A8DED8",
      "#83D0C7",
      "#44B4A6",
      "#70B9EB",
      "#46C37B"
    ];
  }
  get_colors() {
    return {
      "red": {
        "100": "#ffcdd2",
        "200": "#ef9a9a",
        "300": "#e57373",
        "400": "#ef5350",
        "500": "#f44336",
        "600": "#e53935",
        "700": "#d32f2f",
        "800": "#c62828",
        "900": "#b71c1c",
        "a100": "#ff8a80",
        "a200": "#ff5252",
        "a400": "#ff1744",
        "a700": "#d50000"
      },
      "pink": {
        "100": "#f8bbd0",
        "200": "#f48fb1",
        "300": "#f06292",
        "400": "#ec407a",
        "500": "#e91e63",
        "600": "#d81b60",
        "700": "#c2185b",
        "800": "#ad1457",
        "900": "#880e4f",
        "a100": "#ff80ab",
        "a200": "#ff4081",
        "a400": "#f50057",
        "a700": "#c51162"
      },
      "purple": {
        "100": "#e1bee7",
        "200": "#ce93d8",
        "300": "#ba68c8",
        "400": "#ab47bc",
        "500": "#9c27b0",
        "600": "#8e24aa",
        "700": "#7b1fa2",
        "800": "#6a1b9a",
        "900": "#4a148c",
        "a100": "#ea80fc",
        "a200": "#e040fb",
        "a400": "#d500f9",
        "a700": "#aa00ff"
      },
      "deeppurple": {
        "100": "#d1c4e9",
        "200": "#b39ddb",
        "300": "#9575cd",
        "400": "#7e57c2",
        "500": "#673ab7",
        "600": "#5e35b1",
        "700": "#512da8",
        "800": "#4527a0",
        "900": "#311b92",
        "a100": "#b388ff",
        "a200": "#7c4dff",
        "a400": "#651fff",
        "a700": "#6200ea"
      },
      "indigo": {
        "100": "#c5cae9",
        "200": "#9fa8da",
        "300": "#7986cb",
        "400": "#5c6bc0",
        "500": "#3f51b5",
        "600": "#3949ab",
        "700": "#303f9f",
        "800": "#283593",
        "900": "#1a237e",
        "a100": "#8c9eff",
        "a200": "#536dfe",
        "a400": "#3d5afe",
        "a700": "#304ffe"
      },
      "blue": {
        "100": "#bbdefb",
        "200": "#90caf9",
        "300": "#64b5f6",
        "400": "#42a5f5",
        "500": "#2196f3",
        "600": "#1e88e5",
        "700": "#1976d2",
        "800": "#1565c0",
        "900": "#0d47a1",
        "a100": "#82b1ff",
        "a200": "#448aff",
        "a400": "#2979ff",
        "a700": "#2962ff"
      },
      "lightblue": {
        "100": "#b3e5fc",
        "200": "#81d4fa",
        "300": "#4fc3f7",
        "400": "#29b6f6",
        "500": "#03a9f4",
        "600": "#039be5",
        "700": "#0288d1",
        "800": "#0277bd",
        "900": "#01579b",
        "a100": "#80d8ff",
        "a200": "#40c4ff",
        "a400": "#00b0ff",
        "a700": "#0091ea"
      },
      "cyan": {
        "100": "#b2ebf2",
        "200": "#80deea",
        "300": "#4dd0e1",
        "400": "#26c6da",
        "500": "#00bcd4",
        "600": "#00acc1",
        "700": "#0097a7",
        "800": "#00838f",
        "900": "#006064",
        "a100": "#84ffff",
        "a200": "#18ffff",
        "a400": "#00e5ff",
        "a700": "#00b8d4"
      },
      "teal": {
        "100": "#b2dfdb",
        "200": "#80cbc4",
        "300": "#4db6ac",
        "400": "#26a69a",
        "500": "#009688",
        "600": "#00897b",
        "700": "#00796b",
        "800": "#00695c",
        "900": "#004d40",
        "a100": "#a7ffeb",
        "a200": "#64ffda",
        "a400": "#1de9b6",
        "a700": "#00bfa5"
      },
      "green": {
        "200": "#a5d6a7",
        "300": "#81c784",
        "400": "#66bb6a",
        "500": "#4caf50",
        "600": "#43a047",
        "700": "#388e3c",
        "800": "#2e7d32",
        "900": "#1b5e20",
        "a100": "#b9f6ca",
        "a200": "#69f0ae",
        "a400": "#00e676",
        "a700": "#00c853"
      },
      "lightgreen": {
        "200": "#c5e1a5",
        "300": "#aed581",
        "400": "#9ccc65",
        "500": "#8bc34a",
        "600": "#7cb342",
        "700": "#689f38",
        "800": "#558b2f",
        "900": "#33691e",
        "a100": "#ccff90",
        "a200": "#b2ff59",
        "a400": "#76ff03",
        "a700": "#64dd17"
      },
      "lime": {
        "200": "#e6ee9c",
        "300": "#dce775",
        "400": "#d4e157",
        "500": "#cddc39",
        "600": "#c0ca33",
        "700": "#afb42b",
        "800": "#9e9d24",
        "900": "#827717",
        "a100": "#f4ff81",
        "a200": "#eeff41",
        "a400": "#c6ff00",
        "a700": "#aeea00"
      },
      "yellow": {
        "200": "#fff59d",
        "300": "#fff176",
        "400": "#ffee58",
        "500": "#ffeb3b",
        "600": "#fdd835",
        "700": "#fbc02d",
        "800": "#f9a825",
        "900": "#f57f17",
        "a100": "#ffff8d",
        "a200": "#ffff00",
        "a400": "#ffea00",
        "a700": "#ffd600"
      },
      "amber": {
        "200": "#ffe082",
        "300": "#ffd54f",
        "400": "#ffca28",
        "500": "#ffc107",
        "600": "#ffb300",
        "700": "#ffa000",
        "800": "#ff8f00",
        "900": "#ff6f00",
        "a100": "#ffe57f",
        "a200": "#ffd740",
        "a400": "#ffc400",
        "a700": "#ffab00"
      },
      "orange": {
        "100": "#ffe0b2",
        "200": "#ffcc80",
        "300": "#ffb74d",
        "400": "#ffa726",
        "500": "#ff9800",
        "600": "#fb8c00",
        "700": "#f57c00",
        "800": "#ef6c00",
        "900": "#e65100",
        "a100": "#ffd180",
        "a200": "#ffab40",
        "a400": "#ff9100",
        "a700": "#ff6d00"
      },
      "deeporange": {
        "100": "#ffccbc",
        "200": "#ffab91",
        "300": "#ff8a65",
        "400": "#ff7043",
        "500": "#ff5722",
        "600": "#f4511e",
        "700": "#e64a19",
        "800": "#d84315",
        "900": "#bf360c",
        "a100": "#ff9e80",
        "a200": "#ff6e40",
        "a400": "#ff3d00",
        "a700": "#dd2c00"
      },
      "brown": {

        "200": "#bcaaa4",
        "300": "#a1887f",
        "400": "#8d6e63",
        "500": "#795548",
        "600": "#6d4c41",
        "700": "#5d4037",
        "800": "#4e342e",
        "900": "#3e2723"
      },
      "grey": {

        "400": "#bdbdbd",
        "500": "#9e9e9e",
        "600": "#757575",
        "700": "#616161",
        "800": "#424242",
        "900": "#212121"
      },
      "bluegrey": {
        "200": "#b0bec5",
        "300": "#90a4ae",
        "400": "#78909c",
        "500": "#607d8b",
        "600": "#546e7a",
        "700": "#455a64",
        "800": "#37474f",
        "900": "#263238"
      }
    };
  }

  get_random_color() {
    let colors = Object.keys(this.get_colors());
    let random_key = colors[Math.floor(Math.random() * colors.length)];
    let keys = Object.keys(this.get_colors()[random_key]);
    return this.get_colors()[random_key][keys[Math.floor(keys.length * Math.random())]];
  }
  get get_map_draw_styles() {

    return [
      // ACTIVE (being drawn)
      // line stroke
      {
        id: "gl-draw-line",
        type: "line",
        filter: ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#D96B27",
          // "line-dasharray": [0.2, 2],
          "line-width": 4,
        },
      },
      // polygon fill
      {
        id: "gl-draw-polygon-fill",
        type: "fill",
        filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
        paint: {
          "fill-color": this.$refs.colorpicker.defaultColor,
          "fill-outline-color": "#D20C0C",
          "fill-opacity": 0.1,
        },
      },
      // polygon outline stroke
      // This doesn"t style the first edge of the polygon, which uses the line stroke styling instead
      {
        id: "gl-draw-polygon-stroke-active",
        type: "line",
        filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#D96B27",
          // "line-dasharray": [0.2, 2],
          "line-width": 4,
        },
      },
      // vertex point halos
      {
        id: "gl-draw-polygon-and-line-vertex-halo-active",
        type: "circle",
        filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
        paint: {
          "circle-radius": 7,
          "circle-color": "#FFF",
        },
      },
      // vertex points
      {
        id: "gl-draw-polygon-and-line-vertex-active",
        type: "circle",
        filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
        paint: {
          "circle-radius": 6,
          "circle-color": "#fff",
        },
      },

      // INACTIVE (static, already drawn)
      // line stroke
      {
        id: "gl-draw-line-static",
        type: "line",
        filter: ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#fff",
          "line-width": 3,
        },
      },
      // polygon fill
      {
        id: "gl-draw-polygon-fill-static",
        type: "fill",
        filter: ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
        paint: {
          "fill-color": "#fff",
          "fill-outline-color": "#fff",
          "fill-opacity": 0.1,
        },
      },
      // polygon outline
      {
        id: "gl-draw-polygon-stroke-static",
        type: "line",
        filter: ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#fff",
          "line-width": 3,
        },
      },
    ];
  }


}
