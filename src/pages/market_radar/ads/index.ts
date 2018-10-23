import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import template from "./template.vue";
import AdsMapComponent from "../../../components/market_radar/ads/map";
import Left from "../../../components/market_radar/ads/left";
import Right from "../../../components/market_radar/ads/right";
import BaseComponent from "../../../components/base";
import * as api from "@immosparrow/cockpit-api-v2";
import * as globalState from "../../../store/modules/globalStates_";
import store from "../../../store";
@Component({
  mixins: [template],
  components: {
    "amap": AdsMapComponent,
    Left,
    Right

  }
})
export default class AdsComponent extends BaseComponent {

  address: api.GeoSuggestion = new api.GeoSuggestion();

  created() {
    let self = this;

    this.$root.$on("market_radar_address_changed", function (address: api.GeoSuggestion) {
      self.address = address;
    });
    this.$root.$emit("show_draw_tools", false);

    globalState.commitSetSearchSidebar(store, true);


  }

}
