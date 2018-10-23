import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./leftSidebar.vue";
import * as api from "@immosparrow/cockpit-api-v2";

import store from "../../../store";
import * as searchModule from "./../../../store/modules/searchModule";
import * as globalState from "./../../../store/modules/globalStates_";
import { OptionModel } from "../../../models";
import autocomplete from "./../../address_autocomplete";
import Base from "./../../base";
import Debounce from "debounce-decorator";
import _ from "lodash";
import ColorPicker from "./../../shared/color_picker";
import { GeoAddressPartType } from "@immosparrow/cockpit-api-v2";

@Component({
  mixins: [template],
  components: {
    "autocomplete": autocomplete,
    ColorPicker
  },
  filters: {
    currency(amount: number) {
      const amt = Number(amount);
      return amt && amt.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0";
    }
  }
})
export default class SearchSidebar extends Base {

  isLoading: boolean = false;
  showMore: boolean = true;
  loaded: boolean = false;
  showLocalityRequired: boolean = false;
  resultsCounter: api.IPubQueryTotals = new api.PubQueryTotals();

  get counterItems() {
    return this.resultsCounter;
  }

  /* OPTIONS DATA */
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
  prices: Array<OptionModel> = [
    {value: undefined, text: ""},
    {value: 500, text: "500"},
    {value: 600, text: "600"},
    {value: 700, text: "700"},
    {value: 800, text: "800"},
    {value: 900, text: "900"},
    {value: 1000, text: "1,000"},
    {value: 1100, text: "1,100"},
    {value: 1200, text: "1,200"},
    {value: 1300, text: "1,300"},
    {value: 1400, text: "1,400"},
    {value: 1500, text: "1,500"},
    {value: 1600, text: "1,600"},
    {value: 1700, text: "1,700"},
    {value: 1800, text: "1,800"},
    {value: 1900, text: "1,900"},
    {value: 2000, text: "2,000"},
    {value: 2200, text: "2,200"},
    {value: 2400, text: "2,400"},
    {value: 2600, text: "2,600"},
    {value: 2800, text: "2,800"},
    {value: 3000, text: "3,000"},
    {value: 3500, text: "3,500"},
    {value: 4000, text: "4,000"},
    {value: 4500, text: "4,500"},
    {value: 5000, text: "5,000"},
    {value: 5500, text: "5,500"},
    {value: 6000, text: "6,000"},
  ];
  sortOptions: Array<OptionModel> = [
    {value: 0, text: "Standard"},
    {value: 1, text: "First publication time"},
    {value: 2, text: "Last update time"},
    {value: 3, text: "Price"},
    {value: 4, text: "Rooms"},
    {value: 5, text: "Living area"},
    {value: 6, text: "Construction year"},
    {value: 7, text: "Zip"},
    {value: 8, text: "Locality"},
  ];

  /* Search model */
  searchData: api.IPubQuery = new api.PubQuery();
  pageNum: number = 0;
  perPage: number = 10;
  pages: number = 0;

  /* V-MODELS */
  transactionType: number = null;

  newBuilding: boolean = false;
  balconyOrTerrace: boolean = false;
  childFriendly: boolean = false;
  ecoFriendly: boolean = false;
  parking: boolean = false;
  wheelchairAccess: boolean = false;
  petsAllowed: boolean = false;
  elevator: boolean = false;
  showAll: boolean = false;
  showAllS: boolean = false;
  showAllPortals: boolean = false;

  propTypes: api.IPubPropertyCategory[] = [];
  selectedPropTypes: api.IPubPropertyCategory[] = [];
  realEstateOptions: api.IPubSource[] = [];
  selectedRealEstateOptions: api.IPubSource[] = [];
  propSubTypes: api.IPubPropertyCategory[] = [];
  selectedPropSubTypes: api.IPubPropertyCategory[] = [];

  searchSuggestions: api.GeoSuggestion = new api.GeoSuggestion();
  selectedSearchSuggestions: Array<api.GeoSuggestion> = [];
  selectedSearchSuggestionsStrings: Array<string> = [];

  priceMin: OptionModel = {value: undefined, text: "Price min"};
  priceMax: OptionModel = {value: undefined, text: "Price max"};
  roomsMin: OptionModel = {value: undefined, text: "Room min"};
  roomsMax: OptionModel = {value: undefined, text: "Room max"};
  sortBy: OptionModel = {value: 0, text: "Standard"};

  pubDateFrom: Date = new Date();
  pubDateTo: Date = new Date();

  availableDate: Date = new Date();
  livingSpaceMax: number = null;
  livingSpaceMin: number = null;

  searchMap: boolean = false;
  shapes: Array<any> = [];

  colorsUsed: Array<string> = [];

  get publicationHighlighated(): object {
    return {
      "to": this.searchData.publicationTime.max,
      "from": this.searchData.publicationTime.min
    };
  }

  created(): void {

    globalState.commitSetLoadingButton(store, false);
    globalState.commitShowOverviewList(store, false);
    globalState.commitShowRightSidebar(store, false);
    globalState.commitShowMapRightSidebar(store, false);
    globalState.commitShowSearchMap(store, true);
    searchModule.commitSetMapSearchResults(store, null);

    searchModule.commitSetSearchResults(store, null);
    this.resetForm();
    this.searchSuggestions = new api.GeoSuggestion();

    this.searchData.amenities = new api.PubQueryAmenities();
    this.searchData.searchArea.addressParts = [];
    this.searchData.price = new api.SearchQueryRangeOfNullableOfDouble();
    this.searchData.roomCount = new api.SearchQueryRangeOfNullableOfDouble();

    // this always has to be set
    // get status from `Include historic ads`
    this.searchData.publicationStatuses = api.PubQueryStatuses.Active;
    this.searchData.publisherTypes = api.PubQueryPublisherTypes.Any;

    searchModule.dispatchGetPropertyTypes(store)
      .then(() => {
        this.propTypes = searchModule.getPropertyTypes(store);
      });
    searchModule.dipsatchGetRealEstatePortals(store)
      .then(() => {
        this.realEstateOptions = searchModule.getRealEstatePortals(store);
      });

    this.counterSearch();

    this.loaded = true;

    globalState.commitSetSearchSidebar(store, true);

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

  async counterSearch() {
    const res: api.IPubQueryTotals = await api.$pubs.getTotals(this.searchData);
    this.resultsCounter = res;
  }

  get_color (): string {

    let color = this.new_colors()[Math.floor(Math.random() * this.new_colors().length)];

    // if colors limit reached get from another palete with Google material design colors

    if (this.colorsUsed.length == this.new_colors().length) {
      return this.get_random_color();
    }

    if (this.colorsUsed.indexOf(color) == -1) {
      this.colorsUsed.push(color);

      return color;

    } else {
      this.get_color();
    }

  }

  setStreet(data: api.GeoSuggestion): void {

    this.showAll = true;
    if (this.selectedSearchSuggestionsStrings.indexOf(data.uniqueIdentifier) === -1) {

      let color = this.get_color();
      data["bg_color"] = color;

      if (this.selectedSearchSuggestionsStrings.indexOf(data.uniqueIdentifier) == -1) {
        this.selectedSearchSuggestions.push(data);
        this.selectedSearchSuggestionsStrings.push(data.uniqueIdentifier);

        this.$root.$emit("draw_shape_from_address", {
          id: data.uniqueIdentifier,
          geo: data.geom,
          name: data.name,
          color: color
        });
      }

      this.showLocalityRequired = false;
      this.$refs.autocomplete_search.options = [];
      this.$refs.autocomplete_search.model = "";

    }

  }

  clearAll(): void {
    this.selectedSearchSuggestions = [];
  }

  @Debounce(250)
  async getSearchSuggestions() {

    const results = await api.$geo.findSuggestions({
      text: this.$parent.$refs["autocomplete_search"]["model"],
      includeGeom: true,
      suggestionTypes: [10, 20, 30, 40, 50],
      maxItemCount: 6
    });

    console.log(results);
    this.autocomplete_options = results;
    this.$parent.$refs["autocomplete_search"]["options"] = results;
    this.$parent.$refs["autocomplete_search"]["loading_data"] = false;

  }

  updateSelected(el: api.IPubPropertyCategory): void {

    this.propSubTypes = el.propertyTypes;
    this.selectedPropSubTypes = [];

  }

  searchSidebarToggleIn(from_search: boolean): void {

    let self = this;

    let searchSidebar = document.querySelector("#side-overlay");


    if (searchSidebar.classList.contains("active")) {

      searchSidebar.classList.remove("active");
      globalState.commitSetSearchSidebar(store, false);

      // set selected areas to transparent
      this.$root.$emit("redraw_searched_areas", true);

      if (searchModule.getMapSearchResults(store).items != undefined) {

        let mapSearchSidebar = document.querySelector("#sidebar-fixed");
        if (mapSearchSidebar) {

          mapSearchSidebar.classList.add("show");
          mapSearchSidebar.classList.remove("hidden");

          mapSearchSidebar.classList.add("active");
          this.$root.$emit("map_change_size", "small");
          this.$root.$emit("hide_search_areas");
          this.$root.$emit("show_draw_tools", false);
          document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl on_left second";
        }
      }
    } else {


      searchSidebar.classList.add("active");
      globalState.commitShowSearchMap(store, true);
      globalState.commitSetSearchSidebar(store, true);
      globalState.commitShowOverviewList(store, false);
      globalState.commitShowRightSidebar(store, false);

      self.$root.$emit("show_object", "0");

      if (searchModule.getMapSearchResults(store).items != undefined) {
        let mapSearchSidebar = document.querySelector("#sidebar-fixed");

        if (mapSearchSidebar) {

          mapSearchSidebar.classList.remove("show");
          mapSearchSidebar.classList.remove("active");
          mapSearchSidebar.classList.add("hidden");
          this.$root.$emit("map_change_size", "big");
          this.$root.$emit("show_search_areas");
          this.$root.$emit("show_draw_tools", true);
          document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl";

        }
      }
      setTimeout(function () {
        self.$root.$emit("redraw_searched_areas", false);
      }, 200);

    }

  }

  removeAddressItem(index: number): void {

    this.$root.$emit("remove_shape_from_address", this.selectedSearchSuggestions[index].uniqueIdentifier);
    this.selectedSearchSuggestionsStrings.splice(this.selectedSearchSuggestionsStrings.indexOf(this.selectedSearchSuggestions[index].uniqueIdentifier), 1);
    this.selectedSearchSuggestions.splice(index, 1);

  }

  removeKmFromGeoObject(index: number): void {
    Vue.delete(this.selectedSearchSuggestions[index], "extend_by");
  }

  addKmToGeoObject(index: number): void {

    let km = prompt("Extend search in km", "");

    if (km == null || km == "") {

      Vue.delete(this.selectedSearchSuggestions[index], "extend_by");
      return;
    }

    Vue.set(this.selectedSearchSuggestions[index], "extend_by", parseInt(km));
  }

  searchAbo(form: string): void {

    globalState.commitSetLoadingButton(store, true);

    this.$validator.validateAll(form).then((result) => {
      if (result) {
        if (!this.selectedSearchSuggestions.length && !this.shapes.length) {
          this.showLocalityRequired = true;
          globalState.commitSetLoadingButton(store, false);
        } else {
          this.showLocalityRequired = false;
          this.searchData.propertyTypeAndCaregoryIds = [];
          if (this.selectedPropTypes) {
            this.searchData.propertyTypeAndCaregoryIds.push(this.selectedPropTypes["id"]);
          }
          if (this.selectedPropSubTypes) {
            // this.searchData.propertyTypeAndCaregoryIds = [];
            for (let i in this.selectedPropSubTypes) {
              this.searchData.propertyTypeAndCaregoryIds.push(this.selectedPropSubTypes[i].id);
            }
          }
          if (this.selectedRealEstateOptions) {
            this.searchData.sourceIds = [];
            for (let i in this.selectedRealEstateOptions) {
              this.searchData.sourceIds.push(this.selectedRealEstateOptions[i].id);
            }
          }

          searchModule.commitResetState(store);
          this.$root.$emit("remove_all_markers_from_search");

          // this.searchData.firstPublicationDate.min = this.pubDateFrom;
          // this.searchData.firstPublicationDate.max = this.pubDateTo;
          globalState.commitShowSearchMap(store, false);
          globalState.commitShowOverviewList(store, false);
          globalState.commitShowRightSidebar(store, false);

          // when clicked on button map search or list search
          if (this.searchMap) {
            searchModule.dispatchFindCoordinates(store, {
              query: this.searchData,
              pagination: { page: this.pageNum, pageSize: this.perPage },
              fields: api.PubLightModelFields.All,
              maxItemCount: 500
            })
              .then(() => {
                let self = this;
                globalState.commitSetLoadingButton(store, false);
                globalState.commitShowSearchMap(store, true);
                this.$root.$emit("show_draw_tools", false);
                // globalState.commitShowMapRightSidebar(store, true);

                self.searchSidebarToggleIn(true);
                self.searchMap = false;
              });
          } else {
            searchModule.dispatchFind(store, {
              query: this.searchData,
              pagination: { page: this.pageNum, pageSize: this.perPage },
              fields: api.PubLightModelFields.All,
              maxItemCount: 500
            })
              .then(() => {
                let self = this;
                globalState.commitSetLoadingButton(store, false);
                console.log("Successfull search");
                globalState.commitShowMapRightSidebar(store, false);
                globalState.commitShowOverviewList(store, true);
                globalState.commitShowRightSidebar(store, false);
                self.searchSidebarToggleIn(true);
                // searchModule.commitSetMapSearchResults(store, new api.PubFindCoordinatesResultModel());
                // searchModule.commitResetState(store);
                // globalState.commitShowSearchMap(store, false);

                // self.searchMap = false;
                // self.showOverviewList = true;
              });
          }
        }
      } else {
        globalState.commitSetLoadingButton(store, false);
      }
    });
  }

  // **** LABELS *****
  priceMinLabel({value, text}: OptionModel): string {
    if (value) {
      return text;
    } else {
      return "Price min";
    }
  }

  priceMaxLabel({value, text}: OptionModel): string {
    if (value) {
      return text;
    } else {
      return "Price max";
    }
  }

  roomsMinLabel({value, text}: OptionModel): string {
    if (value) {
      return text;
    } else {
      return "Rooms min";
    }
  }

  roomsMaxLabel({value, text}: OptionModel): string {
    if (value) {
      return text;
    } else {
      return "Rooms max";
    }
  }

  limitText(count: number): string {
    return `and ${count} other elements`;
  }

  propLimitLabel({name}: api.IPubPropertyCategory): string {
    if (name.length > 25) {
      return name.substring(0, 25) + "...";
    } else {
      return name;
    }
  }

  resetForm(): void {
    this.newBuilding = false;
    this.balconyOrTerrace = false;
    this.childFriendly = false;
    this.ecoFriendly = false;
    this.parking = false;
    this.wheelchairAccess = false;
    this.petsAllowed = false;
    this.elevator = false;

    this.selectedPropTypes = [];
    this.selectedRealEstateOptions = [];
    this.selectedPropSubTypes = [];

    this.transactionType = null;
    this.searchSuggestions = new api.GeoSuggestion();
    this.selectedSearchSuggestions = [];

    this.priceMin = {value: undefined, text: "Price min"};
    this.priceMax = {value: undefined, text: "Price max"};
    this.roomsMin = {value: undefined, text: "Room min"};
    this.roomsMax = {value: undefined, text: "Room max"};

    this.pubDateFrom = new Date();
    this.pubDateTo = new Date();
    this.availableDate = null;
    this.livingSpaceMax = null;
    this.livingSpaceMin = null;

    this.searchData.livingArea = new api.SearchQueryRangeOfNullableOfDouble();
    this.$set(this.searchData, "publicationTime", new api.SearchQueryRangeOfNullableOfDateTime());
    // this.searchData.availableFromDate = new SearchRangeOfNullableOfDateTime();
    this.showMore = true;
    this.showLocalityRequired = false;
    this.$validator.reset();
  }


  mounted(): void {
    if (this.mainSearchedAddress.name != undefined) {

      if (this.selectedSearchSuggestionsStrings.indexOf(this.mainSearchedAddress.uniqueIdentifier) === -1) {
        this.selectedSearchSuggestionsStrings.push(this.mainSearchedAddress.uniqueIdentifier);
        this.selectedSearchSuggestions.push(this.mainSearchedAddress);
      }

    }
  }

  @Watch("mainSearchedAddress")
  uad(): void {
    if (this.mainSearchedAddress.name != undefined) {

      if (this.selectedSearchSuggestionsStrings.indexOf(this.mainSearchedAddress.uniqueIdentifier) === -1) {
        this.selectedSearchSuggestionsStrings.push(this.mainSearchedAddress.uniqueIdentifier);
        this.selectedSearchSuggestions.push(this.mainSearchedAddress);
      }

    }
  }

  updateSelectedSubtypes(el: api.IPubPropertyCategory): void {

    if (this.selectedPropSubTypes.indexOf(el) == -1) {
      this.selectedPropSubTypes.unshift(el);
    }

  }

  remove_sub_category_item(index: number): void {
    this.selectedPropSubTypes.splice(index, 1);
  }

  updateSelectedPortals(el: api.IPubSource): void {

    if (this.selectedRealEstateOptions.indexOf(el) == -1) {
      this.selectedRealEstateOptions.unshift(el);
    }
  }

  remove_re_item(index: number): void {
    this.selectedRealEstateOptions.splice(index, 1);
  }


  // **** Watchers ****
  @Watch("transactionType")
  transactioWatch(): void {
    this.searchData.transactionType = this.transactionType;
    this.counterSearch();
  }

  @Watch("selectedSearchSuggestions")
  suggestionWatch(): void {
    // console.log(this.selectedSearchSuggestions);
    if (this.selectedSearchSuggestions.length) {

      let e = [];
      for (let i in this.selectedSearchSuggestions) {
        let addr = new api.GeoAddressPart();
        addr.partType = <api.GeoAddressPartType> this.selectedSearchSuggestions[i].suggestionType.valueOf();
        addr.id = this.selectedSearchSuggestions[i].uniqueIdentifier;

        if ("extend_by" in this.selectedSearchSuggestions[i]) {
          addr.radius = this.selectedSearchSuggestions[i]["extend_by"];
        }
        e.push(addr);
      }
      // TO BE: Uncomment after migration to API2
      this.searchData.searchArea.addressParts = _.uniqBy(e, "uniqueIdentifier");
      this.counterSearch();
    } else {
      // this.searchData.includeAddresses = [];

      this.counterSearch();
    }
  }

  @Watch("selectedPropTypes")
  categoryWatch(): void {
    this.searchData.propertyTypeAndCaregoryIds = [];
    if (this.selectedPropTypes["id"]) {
      this.searchData.propertyTypeAndCaregoryIds.push(this.selectedPropTypes["id"]);
      this.counterSearch();
    }
  }

  @Watch("selectedPropSubTypes")
  propertyWatch(): void {
    if (this.selectedPropSubTypes.length) {
      for (let i in this.selectedPropSubTypes) {
        this.searchData.propertyTypeAndCaregoryIds.push(this.selectedPropSubTypes[i].id);
      }
      this.counterSearch();
    }
  }

  @Watch("priceMin")
  priceMinWatch(): void {
    this.searchData.price.min = this.priceMin.value;
    this.counterSearch();
  }

  @Watch("priceMax")
  priceMaxWatch(): void {
    this.searchData.price.max = this.priceMax.value;
    this.counterSearch();
  }

  @Watch("roomsMin")
  roomsMinWatch(): void {
    this.searchData.roomCount.min = this.roomsMin.value;
    this.counterSearch();
  }

  @Watch("roomsMax")
  roomsMaxWatch(): void {
    this.searchData.roomCount.max = this.roomsMax.value;
    this.counterSearch();
  }

  @Watch("wheelchairAccess")
  wheelchairAccessWatch(): void {
    this.searchData.amenities.wheelchairAccess = this.wheelchairAccess;
    this.counterSearch();
  }

  @Watch("balconyTerrace")
  balconyTerraceWatch(): void {
    this.searchData.amenities.balconyOrTerrace = this.balconyOrTerrace;
    this.counterSearch();
  }

  @Watch("childFriendly")
  childFriendlyWatch(): void {
    this.searchData.amenities.childFriendly = this.childFriendly;
    this.counterSearch();
  }

  @Watch("ecoFriendly")
  ecoFriendlyWatch(): void {
    this.searchData.amenities.ecoFriendly = this.ecoFriendly;
    this.counterSearch();
  }

  @Watch("elevator")
  elevatorWatch(): void {
    this.searchData.amenities.elevator = this.elevator;
    this.counterSearch();
  }

  @Watch("newBuilding")
  newBuildingWatch(): void {
    this.searchData.amenities.newBuilding = this.newBuilding;
    this.counterSearch();
  }

  @Watch("parking")
  parkingWatch(): void {
    this.searchData.amenities.parking = this.parking;
    this.counterSearch();
  }

  @Watch("petsAllowed")
  petsAllowedWatch(): void {
    this.searchData.amenities.petsAllowed = this.petsAllowed;
    this.counterSearch();
  }

  /* @Watch("availableDate")
  allowedFromDateWatch(): void {
    this.searchData.availableFromDate = new SearchRangeOfNullableOfDateTime();
    this.searchData.availableFromDate.min = this.availableDate;
    this.counterSearch();
  }
  */

  @Watch("livingSpaceMin")
  livingSpaceMinWatch(): void {
    this.searchData.livingArea.min = this.livingSpaceMin;
    this.counterSearch();
  }

  @Watch("livingSpaceMax")
  livingSpaceMaxWatch(): void {
    this.searchData.livingArea.max = this.livingSpaceMax;
    this.counterSearch();
  }
}
