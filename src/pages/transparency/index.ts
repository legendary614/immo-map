import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import template from "./template.vue";
import MapBox from "../../components/map/";
import TransparencyMap from "../../components/map/transparency";
import LeftSidebar from "../../components/transparencyModule/left";
import RightSidebar from "../../components/transparencyModule/right";
import BaseComponent from "../../components/base";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import { getSidebar } from "../../store/modules/search_";
@Component({
  mixins: [template],
  components: {
    TransparencyMap,
    LeftSidebar,
    RightSidebar,
  },
  store
})
export default class Transparency extends BaseComponent {

  address: api.GeoSuggestion = new api.GeoSuggestion();

  created() {
    let self = this;

    this.$root.$on("transparency_address_changed", function (address: api.GeoSuggestion) {
      self.address = address;
    });


  }

}
