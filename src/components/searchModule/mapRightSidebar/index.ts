import { Component, Prop, Watch } from "vue-property-decorator";
import mapRightSidebar from "./mapRightSidebar.vue";
import store from "../../../store";
import Paginate from "vuejs-paginate";
import Base from "./../../base";
import MapItem from "./map-item/";
import ObjectComponent from "../object/";
import * as api from "@immosparrow/cockpit-api-v2";
import * as searchModule from "../../../store/modules/searchModule";

@Component({
  mixins: [mapRightSidebar],
  components: {
    Paginate,
    MapItem,
    ObjectComponent
  },
  filters: {
    currency(amount: number) {
      const amt = Number(amount);
      return amt && amt.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0";
    }
  }
})
export default class MapRightSidebar extends Base {

  @Prop()
  ads: Array<api.PubModel>;

  pictures: Array<string> = [];

  selectedIndex: number = -1;
  selectedAd: api.PubModel = new api.PubModel();

  perPage: number = 6;
  pageNum: number = 1;
  perPage2: number = 6;
  pageNum2: number = 1;

  loading: boolean = false;
  timer: any = null;
  showZero: boolean = true;
  showOne: boolean = false;

  allAds: number = 0;
  searchResults: number = 0;
  searchData: api.PubQuery = new api.PubQuery();

  @Watch("ads")
  changedAdsInViewport () {

    let self = this;

    self.loading = true;
    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      self.pageNum = 1;
      self.pageNum2 = 1;
      self.loading = false;

    }, 1000);

  }

  get paginateAdsNotOnMap () {
    let pageNum2 = this.pageNum2 - 1;
    let start = pageNum2 * this.perPage2,
          end = start + this.perPage2;
    let filteredAds = this.ads.filter(ad => {
      if (!ad.address.coordinates) {
        return ad;
      }
    });
    return filteredAds.slice(start, end);
  }

  get paginateAdsOnMap () {
      let pageNum = this.pageNum - 1;
      let start = pageNum * this.perPage,
            end = start + this.perPage;
      let filteredAds = this.ads.filter(ad => {
        if (ad.address.coordinates) {
          return ad;
        }
      });
      return filteredAds.slice(start, end);
  }

  get adsNotOnMap () {
    let filteredAds = this.ads.filter(ad => {
      if (!ad.address.coordinates) {
        return ad;
      }
    });
    return filteredAds;
  }

  get adsOnMap () {
    let filteredAds = this.ads.filter(ad => {
      if (ad.address.coordinates) {
        return ad;
      }
    });
    return filteredAds;
  }

  get getPageCount () {
    if (this.adsOnMap) {

      if (this.adsOnMap.length % 6 != 0) {
        return Math.floor(this.adsOnMap.length / 6) + 1;
      }

      return Math.floor(this.adsOnMap.length / 6);
    }
  }
  get getPageCount2 () {
    if (this.adsNotOnMap) {

      if (this.adsNotOnMap.length % 6 != 0) {
        return Math.floor(this.adsNotOnMap.length / 6) + 1;
      }

      return Math.floor(this.adsNotOnMap.length / 6);
    }
  }
  nextPage(pageNum: number, index: number) {
    if (pageNum === 0) {
      this.pageNum = 0;
    } else {
      this.pageNum = pageNum - 1;
    }
    this.$refs.bottomPagination.selected = this.pageNum;
    this.$refs.topPagination.selected = this.pageNum;

    this.pageNum++;

    if (index !== -1) {
      this.selectedIndex = index;
      this.selectedAd = this.adsOnMap[this.selectedIndex];
      // globalState.commitShowRightSidebar(store, true);
    }
  }

  prevPage () {
    this.$refs.bottomPagination.selected = this.pageNum;
    this.$refs.topPagination.selected = this.pageNum;

    this.pageNum++;
    if (this.selectedIndex !== -1) {
      this.selectedAd = this.adsOnMap[this.selectedIndex];
      // globalState.commitShowRightSidebar(store, true);
    }
  }
  nextPage2(pageNum: number, index: number) {
    if (pageNum === 0) {
      this.pageNum2 = 0;
    } else {
      this.pageNum2 = pageNum - 1;
    }
    this.$refs.bottomPagination2.selected = this.pageNum2;
    this.$refs.topPagination2.selected = this.pageNum2;

    this.pageNum2++;

    if (index !== -1) {
      this.selectedIndex = index;
      this.selectedAd = this.adsNotOnMap[this.selectedIndex];
      // globalState.commitShowRightSidebar(store, true);
    }
  }
  prevPage2 () {
    this.$refs.bottomPagination2.selected = this.pageNum2;
    this.$refs.topPagination2.selected = this.pageNum2;

    this.pageNum2++;
    if (this.selectedIndex !== -1) {
      this.selectedAd = this.adsNotOnMap[this.selectedIndex];
      // globalState.commitShowRightSidebar(store, true);
    }
  }

  show (tab: number) {
    switch (tab) {
      case 0:
      this.showZero = true;
      this.showOne = false;
      break;
      case 1:
      this.showOne = true;
      this.showZero = false;
      break;
    }
  }

  selectAd (ad: api.PubModel, selectedIndex: number, no_arrows: boolean) {
    // globalState.commitShowRightSidebar(store, true);
    console.log(selectedIndex);
    let self = this;
    this.selectedAd = ad;
    this.selectedIndex = selectedIndex;
    this.$emit("selectAd", ad);

    if (no_arrows) {
      setTimeout(function () {
        self.$root.$emit("hide_arrows");
      }, 10);

    }
  }
  closeRightSidebar() {
    this.selectedAd = new api.PubModel();
    this.$root.$emit("close_popup_object");

    let mapSearchSidebar = document.querySelector("#sidebar-fixed");

    if (mapSearchSidebar) {
      if (!mapSearchSidebar.classList.contains("active")) {
        this.$root.$emit("map_change_size", "big");
      }
    } else  {
      this.$root.$emit("map_change_size", "big");
    }


    // globalState.commitShowRightSidebar(store, false);
  }

  selectItem (index: number, arrow: boolean, left: boolean) {
    if (this.showZero) {
      let p = this.pageNum - 1;
      if (index !== 0 && index % 6 === 0 && !left) {
        this.pageNum += 1;
        this.selectedIndex = index;
        this.nextPage(this.pageNum, index);
      } else if (index === (p * 6) - 1 && left) {
        this.pageNum -= 2;
        this.selectedIndex = index;
        this.prevPage();
      } else {
        this.selectedIndex = index;
        this.selectedAd = this.adsOnMap[index];
        this.hilight_marker(this.selectedAd, "no");
        // globalState.commitShowRightSidebar(store, true);
      }
    } else {
      let p = this.pageNum2 - 1;
      if (index !== 0 && index % 6 === 0 && !left) {
        this.pageNum2 += 1;
        this.selectedIndex = index;
        this.nextPage2(this.pageNum2, index);
      } else if (index === (p * 6) - 1 && left) {
        this.pageNum2 -= 2;
        this.selectedIndex = index;
        this.prevPage2();
      } else {
        this.selectedIndex = index;
        this.selectedAd = this.adsNotOnMap[index];
        this.hilight_locality(this.selectedAd, "no");
        // globalState.commitShowRightSidebar(store, true);
      }
    }
  }

  setSelectedIndex (index: number) {
    let p = this.pageNum - 1;
    this.selectedIndex = (p * 6) + index;
  }
  setSelectedIndex2 (index: number) {
    let p = this.pageNum2 - 1;
    this.selectedIndex = (p * 6) + index;
  }

  hilight_locality(ad: any, empty: string) {

    if (empty == "") {
      this.$root.$emit("localityUniqueIdentifier", "");
    } else {
      this.$root.$emit("localityUniqueIdentifier", ad["address"]["localityUniqueIdentifier"]);
    }

    // console.log(ad["address"]["localityUniqueIdentifier"]);
  }

  mapRightSidebarToggle () {

    let searchSidebar = document.querySelector("#sidebar-fixed");
    let leftSearchSidebar = document.querySelector("#side-overlay");

    if (searchSidebar.classList.contains("active")) {
      searchSidebar.classList.remove("active");

      document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl second";
      // this.$root.$emit("map_change_size", "big");
      // leftSearchSidebar.classList.add("active");
      // this.$root.$emit("redraw_searched_areas", false);
      // this.$root.$emit("show_draw_tools", true);
      this.$root.$emit("map_change_size", "big");
      // this.$root.$emit("show_search_areas");

      // this.show_draw_tools = true;
      // this.change_map_size("big");

    } else {
      searchSidebar.classList.add("active");
      document.getElementsByClassName("switch_style")[0].className = "switch_style mapboxgl-ctrl-group mapboxgl-ctrl on_left second";
      // this.$root.$emit("map_change_size", "small");

      // leftSearchSidebar.classList.remove("active");
      // this.$root.$emit("redraw_searched_areas", true);
      // this.$root.$emit("show_draw_tools", false);
      this.$root.$emit("map_change_size", "small");
      // this.$root.$emit("hide_search_areas");

      // this.show_draw_tools = false;
      // this.change_map_size("small");

    }

  }

  closeObjectRightSidebar() {
    this.selectedAd = new api.PubModel();
    this.hilight_marker(this.selectedAd, "");
    let mapSearchSidebar = document.querySelector("#sidebar-fixed");
    if (mapSearchSidebar) {
      if (!mapSearchSidebar.classList.contains("active")) {
        this.$root.$emit("map_change_size", "big");

      }
    }
  }

  objectLeave() {

    try {
      if (this.selectedAd.primaryInfo.title == undefined) {
        this.hilight_marker(this.selectedAd, "");
      }
    } catch {

    }
  }

  created() {

    // this.get_all_ads();

    let self = this;

    this.$root.$on("show_object", function (id: string) {


      if (id == "0") {
        self.closeRightSidebar();
        self.$root.$emit("map_change_size", "big");
        return;
      }

      let mapSearchSidebar = document.querySelector("#sidebar-fixed");
      if (mapSearchSidebar) {
        if (!mapSearchSidebar.classList.contains("active")) {
          self.$root.$emit("map_change_size", "small");

        }
      }
      self.ads.filter( (ad, index) => {

        if (ad.address.coordinates && ad.id == id) {

          self.selectAd(ad, index, true);

        }
      });

    });

    this.$root.$on("hide_object", function (id: string) {
      self.closeRightSidebar();
    });

  }

  async get_all_ads() {
    const res1: api.IPubQueryTotals = await api.$pubs.getTotals(this.searchData);
    this.searchResults = res1.totalItemCount;

    this.searchData.publicationStatuses = api.PubQueryStatuses.Active;
    this.searchData.publisherTypes = api.PubQueryPublisherTypes.Any;
    const res2: api.IPubQueryTotals = await api.$pubs.getTotals(this.searchData);
    this.allAds = res2.totalItemCount;

  }

}
