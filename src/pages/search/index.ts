import Vue from "vue";
import { Component } from "vue-property-decorator";
import template from "./Search.vue";
import OverviewList from "../../components/searchModule/overviewList/";
import MapRightSidebar from "../../components/searchModule/mapRightSidebar/";
import SearchMap from "../../components/map/search";
import LeftSidebar from "../../components/searchModule/leftSidebar/";
import SearchAbo from "../../components/searchModule/searchAbo/";
import store from "../../store";
import VueCarousel from "vue-carousel";
Vue.use(VueCarousel);
import * as api from "@immosparrow/cockpit-api-v2";
import { commitShowMapRightSidebar } from "./../../store/modules/globalStates_";

@Component({
  mixins: [template],
  components: {
    OverviewList,
    SearchMap,
    LeftSidebar,
    MapRightSidebar,
    SearchAbo
  }
})
export default class Search extends Vue {

  results: Array<api.PubModel> = [];
  showAd: api.PubModel = new api.PubModel();


  setAdsInViewport (results: Array<api.PubModel>) {
    this.results = [];
    this.results = results;
  }
  selectAd(ad: api.PubModel) {
    this.showAd = ad;
  }

  created() {

    let self = this;
    this.$root.$on("remove_all_results", () => {
      self.results = [];
      commitShowMapRightSidebar(store, false);
      document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl";
    });

  }

}
