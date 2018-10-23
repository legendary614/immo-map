import Vue from "vue";
import template from "./right_template.vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import store from "../../store";
import vue_slider from "vue-slider-component";
import VueCarousel from "vue-carousel";
import VueChartkick from "vue-chartkick";
import Chart from "chart.js";
import RadialProgress from "./radial.progress.vue";
import VueGallery  from "vue-gallery";
import * as api from "@immosparrow/cockpit-api-v2";
import { commitObjectWindow } from "../../store/modules/search_";
import BaseComponent from "../base";
Vue.use(VueChartkick, {adapter: Chart});
Vue.use(VueCarousel);


@Component({
  mixins: [template],
  components: {
    "vue-slider": vue_slider,
    "radial-progress-bar": RadialProgress,
    VueGallery,
  }
})
export default class Right extends BaseComponent {

  @Prop()
  address: api.GeoSuggestion;

  galleryImages: Array<string> = [];
  completedSteps0: number = 80;
  completedSteps1: number = 45;
  completedSteps2: number = 82;
  completedSteps3: number = 25;
  index: any = null;
  object: api.BuildingModel = new api.BuildingModel();
  fullscreenOptions: any = {
    // Defines if the gallery should open in fullscreen mode:
    fullScreen: true
  };
  totalSteps: number = 100;
  home: boolean = true;
  analitics: boolean = false;
  offset: number = 0;
  transparency_address: api.GeoSuggestion = new api.GeoSuggestion();
  // chartData = [["Jan", 220000], ["Feb", 240000], ["Mar", 260000], ["Apr", 210000], ["May", 300000]];
  chart_data: any = {
    "2017-05-13": 2,
    "2017-05-14": 5,
    "2017-05-15": 3,
    "2017-05-16": 8,
    "2017-05-17": 6,
    "2017-05-18": 6,
    "2017-05-19": 12,
    "2017-05-20": 5,
    "2017-05-21": 5,
    "2017-05-22": 3,
    "2017-05-23": 1,
    "2017-05-24": 6,
    "2017-05-25": 1,
    "2017-05-26": 3,
    "2017-05-27": 2,
    "2017-05-28": 3,
    "2017-05-29": 2,
    "2017-05-30": 8,
    "2017-05-31": 5
  };
  slider_props =  {
    data: [
      0,
      50,
      100

    ],
    value: 50,
    width: "100%",
    tooltip: "never",
    height: 24,
    disabled: true,
    piecewise: true,
    piecewiseLabel: true,
    style: {
      "padding": "8px",
      "margin": 0,
      "margin-bottom": "40px",
      "opacity": "1"
    }

  };
  showZero: boolean = true;
  showOne: boolean = false;


  slide_page: number = 2;

  destroyed() {
    /*let searchedAddress = {
      id: "",
      lat: 0,
      lng: 0,
      name: "",
      geo: {}
    };
    search.commitSearchingFor(store, searchedAddress);*/
  }

  pageChanged(e: number) {

    e = e + 1;
    this.slide_page = e * 2;
  }

  created() {
    // let val = 80;
    // let r = document.getElementById("circle").getAttribute("r");
    // console.log(r);
    /*let c = Math.PI * ( r * 2);

    if (val < 0) { val = 0; }
    if (val > 100) { val = 100; }

    let pct = ((100 - val) / 100) * c;
    this.offset = pct;*/

    // for testing only TODO remove
   //  globalState.commitShowRightSidebar(store, true);
    // console.log(this.address);
    // this.$refs["slider"].refresh();

    setTimeout(function () {

      window.dispatchEvent(new Event("resize"));
    }, 2000);

  }

  mounted() {
    // this.$refs["slider"].refresh();

    setTimeout(function () {

      window.dispatchEvent(new Event("resize"));
    }, 2000);

  }

  get id() {
    return this.address.uniqueIdentifier;
  }

  show(tab: number) {

    switch (tab) {
      case 0:
        this.showZero = true;
        this.showOne = false;
        break;
      case 1:
        this.showZero = false;
        this.showOne = true;
        break;

    }
  }

  closeRightSidebar() {


    commitObjectWindow(store, false);
    // this.$root.$emit("remove_transparency_address", true);
    // commitResetState(store);
  }

  @Watch("building")
  ub(building: api.BuildingModel) {

    this.object = building;
    if (building.address != undefined) {

      this.galleryImages = [];

      /*for (let i = 0, l = building.pictures.length; i < l; i++) {
        this.galleryImages.push(building.pictures[i].resourceId);
      }*/



    }
  }
  @Watch("address")
  ua(address: api.GeoSuggestion) {
    // console.log(address);
  }

  @Watch("transparencySearchedAddress", {immediate: true})
  addressUpdateTransparency(address: api.GeoSuggestion, oldaddress: api.GeoSuggestion) {

    if (address.name != undefined) {
      this.transparency_address = address;
    }
  }

  toggleSideBar() {
    let searchSidebar = document.querySelector("#sidebar-fixed");

    if (searchSidebar.classList.contains("active")) {
      searchSidebar.classList.remove("active");
      document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl second";




    } else {
      searchSidebar.classList.add("active");

      document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl on_left second";

    }
  }

}
