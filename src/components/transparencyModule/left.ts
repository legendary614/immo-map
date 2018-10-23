import Vue from "vue";
import template from "./left_template.vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import autocomplete from "./../address_autocomplete";
import * as globalState from "./../../store/modules/globalStates_";
import Base from "./../base";
import * as search from "../../store/modules/search_";
import store from "../../store";
import Debounce from "debounce-decorator";
import {
  commitObjectWindow, commitSearchingForTransparency,
  dispatchSetTransparencyAddress
} from "../../store/modules/search_";
Vue.use(require("vue-moment"));
import moment from "moment";
import modal from "../modal";
import * as api from "@immosparrow/cockpit-api-v2";
import { OptionModel } from "../../models";

const _ = require("lodash");
@Component({

  mixins: [template],
  components: {
    "autocomplete": autocomplete,
    "modal": modal
  }
})
export default class Left extends Base {
  isLoading: boolean = false;
  showMore: boolean = true;
  loaded: boolean = false;
  bookmarked: boolean = false;

  searchData: api.IPubQuery = new api.PubQuery();
  tr_address: any = {};
  roomsOptions: Array<OptionModel> = [
    {value: undefined, text: ""},
    {value: 1, text: "1"},
    {value: 1.5, text: "1.5"},
    {value: 2, text: "2"},
    {value: 2.5, text: "2.5"},
    {value: 3, text: "3"},
    {value: 3.5, text: "3"},
    {value: 4, text: "4"},
    {value: 4.5, text: "4.5"},
    {value: 5, text: "5"},
    {value: 5.5, text: "5.5"},
    {value: 6, text: "6"},
    {value: 6.5, text: "6.5"},
    {value: 7, text: "7"},
    {value: 7.5, text: "7.5"},
    {value: 8, text: "8"}
  ];
  roomsMin: number = null;
  roomsMax: number = null;
  selectedAddress: number = null;
  selectedSearchSuggestions: Array<api.GeoSuggestion> = [];
  transparencyAddress: api.GeoSuggestion = new api.GeoSuggestion();
  minimized: object = {
    history: [],
    bookmarks: [],
    docs: [],
  };

  @Prop()
  address: api.GeoSuggestion;

  created() {
    this.loaded = true;
    let self = this;
    globalState.commitSetSearchSidebar(this.$store, true);

    globalState.commitSetLoadingButton(store, false);
    globalState.commitShowOverviewList(store, false);
    this.showMore = true;

    this.searchData.livingArea = new api.SearchQueryRangeOfNullableOfDouble();

  }

  ret_date(d: string) {

    try {
      let e = d.split(".")[2] + "-" + d.split(".")[1] + "-" + d.split(".")[0];
      return new Date(e);
    } catch {
      return d;
    }
  }

  format_date(date: string) {
    moment.locale("de-ch");
    return moment(this.ret_date(date)).format("l");
  }

  desc(data: any, key: string, order: string) {

    let new_a = [];
    let self = this;
    let e = _.sortBy(data, function(o: any) {

      return moment(self.ret_date(o[key]));

    }).reverse();

    return e;
  }

  setStreet(data: api.GeoSuggestion, index: number) {

    this.selectedSearchSuggestions = [];
    this.selectedSearchSuggestions.push(data);
    this.$refs.autocomplete_search.options = [];
    this.$refs.autocomplete_search.model = data.name;
    this.transparencyAddress = data;

    this.selectedAddress = index;

    dispatchSetTransparencyAddress(store, data);

  }

  remove_address_item(index: number) {

    search.commitResetState(store);

    this.transparencyAddress = new api.GeoSuggestion();
    commitSearchingForTransparency(store, this.transparencyAddress);
    this.$refs.autocomplete_search.model = "";

  }

  @Debounce(250)
  async getSearchSuggestions() {

    const results = await api.$geo.findSuggestions({
      text: this.$parent.$refs["autocomplete_search"]["model"],
      includeGeom: true,
      suggestionTypes: [70],
      maxItemCount: 6
    });

    console.log(results);
    this.autocomplete_options = results;
    this.$parent.$refs["autocomplete_search"]["options"] = results;
    this.$parent.$refs["autocomplete_search"]["loading_data"] = false;

  }

  @Watch("transparencySearchedAddress", {immediate: true})
  addressUpdateTransparency(address: api.GeoSuggestion, oldaddress: api.GeoSuggestion) {

    if (address.name != undefined) {
      this.transparencyAddress = address;
    }
  }

  is_minimized(date: string, location: string) {

    if (this.minimized[location].indexOf(date) > -1) {
      return true;
    }

    return false;
  }

  minimize(date: string, location: string) {
    if (this.minimized[location].indexOf(date) > -1) {
      this.minimized[location].splice(this.minimized[location].indexOf(date), 1);
    } else {
      this.minimized[location].push(date);
    }
  }

}
