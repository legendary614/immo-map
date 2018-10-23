import Vue from "vue";
import template from "./right_template.vue";
import { Component, Watch } from "vue-property-decorator";
import BaseComponent from "../../base";
import * as api from "@immosparrow/cockpit-api-v2";
import { PubQueryPublisherTypes, PubQueryStatuses, PubTransactionType } from "@immosparrow/cockpit-api-v2";
// import { PubTransactionType } from "@immosparrow/cockpit-api-v2";
import VueGallery from "vue-gallery";
import VueCarousel from "vue-carousel";
import vue_slider from "vue-slider-component";
import RadialProgress from "./../../transparencyModule/radial.progress.vue";

Vue.use(VueCarousel);
@Component({
  mixins: [template],
  components: {
    VueGallery,
    "vue-slider": vue_slider,
    "radial-progress-bar": RadialProgress,
  }
})
export default class Right extends BaseComponent {

  galleryIndex: any = null;

  completedSteps0: number = 80;
  completedSteps1: number = 45;
  completedSteps2: number = 82;
  completedSteps3: number = 25;
  totalSteps: number = 100;

  galleryImages: Array<string> = [];
  slidePage: number = 2;
  sliderProps =  {
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
  created() {
    this.toggle("overview");
    // this.toggle("overview");
    this.galleryImages.push("d00357bf-36b3-5969-e524-8a6e1b435fe1");

    // this.$root.$emit("show_draw_tools", true);
    api.$pubs.findByEntrance(this.marketRadarSearchedAddress.uniqueIdentifier).then(function (data: api.PubLightModel[]) {
      console.log(data);
    });
    /*api.$pubs.find({
      searchArea: {
        addressParts: [
          {
            id: this.marketRadarSearchedAddress.uniqueIdentifier,
            partType: <api.GeoAddressPartType> this.marketRadarSearchedAddress.suggestionType.valueOf()
          }
        ]
      },
      transactionType: PubTransactionType.Rent,
      propertyTypeAndCaregoryIds: null,
      publicationStatuses: PubQueryStatuses.Active,
      publisherTypes: PubQueryPublisherTypes.Any
    }).then((data: any) => {
      if (data.length) {
        console.log(data);
      }
    });*/

  }

  toggleSideBar() {

    let searchSidebar = document.querySelector("#sidebar-fixed");

    if (searchSidebar.classList.contains("active")) {
      if (document.getElementsByClassName("switch_style")[0] != undefined) {
        searchSidebar.classList.remove("active");
        document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl second";
        this.$root.$emit("map_change_size", "big");
      }

    } else {
      searchSidebar.classList.add("active");
      document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl on_left second";
      this.$root.$emit("map_change_size", "small");

    }
  }

  pageChanged(e: number) {

    e = e + 1;
    this.slidePage = e * 2;
  }

  @Watch("marketRadarSearchedAddress", {immediate: true})
  ua(address: api.GeoSuggestion, oldaddress: api.GeoSuggestion) {

    if (address.name != undefined) {
      if (document.getElementsByClassName("switch_style")[0] != undefined) {
        document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl on_left second";
      }

    } else {
      if (document.getElementsByClassName("switch_style").length) {
        document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl";
      }
    }
  }

}
