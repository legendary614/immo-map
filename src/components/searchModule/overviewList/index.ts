import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import store from "../../../store";
import template from "./overviewList.vue";
import * as globalState from "../../../store/modules/globalStates_";
import Paginate from "vuejs-paginate";
import * as searchModule from "../../../store/modules/searchModule";
import * as api from "@immosparrow/cockpit-api-v2";
import ListItem from "./list-item/";
import ObjectComponent from "../object/";

@Component({
  mixins: [template],
  components: {
    Paginate,
    ListItem,
    ObjectComponent
  },
  filters: {
    currency(amount: number) {
      const amt = Number(amount);
      return amt && amt.toLocaleString(undefined, {maximumFractionDigits: 2}) || "0";
    }
  }
})
export default class OverviewList extends Vue {

    pages: number = 0;
    per_page: number = 10;
    page_num: number = 0;
    searchResults: api.ISearchResult<api.IPubLightModel> = null;
    searchData: api.IPubQuery = new api.PubQuery();
    // resultsCounter: api.PubTotalsModel = new api.PubTotalsModel(); commented
    selectedIndex: number = -1;
    selectedItem: api.IPubLightModel = new api.PubLightModel();
    allAds: number = 0;
    $refs: {
      topPagination: any,
      bottomPagination: any,
    };
    loading: boolean = false;

    get counterItems () {
      // return this.resultsCounter;
      return 0;
    }

    created () {
      globalState.commitShowRightSidebar(store, false);
      this.searchResults = searchModule.getSearchResults(store);
      this.pages = this.searchResults.pageCount;
      this.counterSearch();
    }

    async counterSearch () {
      /* const pubClient: api.PublicationClient = new api.PublicationClient();
      this.searchData.status = api.PubSearchStatusEnum.ActiveOnly;
      this.searchData.vendorType = api.PubSearchVendorTypeEnum.Any;
      const res1: api.PubTotalsModel = await pubClient.getTotals(this.searchData);
      this.allAds = res1.totalCount;
      this.searchData.transactionType = this.searchResults.items != undefined ? this.searchResults.items[0].transactionType : 10;
      const res2: api.PubTotalsModel = await pubClient.getTotals(this.searchData);
      this.resultsCounter = res2;
      */
    }

    closeRightSidebar() {
      this.selectedIndex = -1;
      globalState.commitShowRightSidebar(store, false);
    }

    getResults () {
      if (this.searchResults.totalItemCount <= 500) {
        return this.searchResults.totalItemCount;
      } else {
        return 500;
      }
    }

    selectItem (index: number, arrow: boolean, left: boolean) {
      if (index !== 0 && index % 10 === 0) {
        this.page_num += 2;
        this.nextPage(this.page_num, 0);
      } else if (index === -1 && this.page_num > 0) {
        this.page_num--;
        this.nextPage(this.page_num, 9);
      } else {
        this.selectedIndex = index;
        this.selectedItem = this.searchResults.items[index];
        if (arrow) {
          let el = document.querySelector("#scrollDiv");
          el.scrollTop = 300 * this.selectedIndex;
        }
        // globalState.commitShowRightSidebar(store, true);
      }
    }

    @Watch("per_page")
    reload_with_new_number() {
      this.nextPage(this.page_num, -1);
    }

    nextPage(pageNum: number, index: number) {
      if (pageNum === 0) {
        this.page_num = 0;
      } else {
        this.page_num = pageNum - 1;
      }
      this.$refs.topPagination.selected = this.page_num;
      this.$refs.bottomPagination.selected = this.page_num;

      this.loading = true;

      this.selectedIndex = -1;
      this.searchData = searchModule.getSearchData(store).query;
      // let sortBy = searchModule.getSearchData(store).;
      searchModule.dispatchFind(store, 
        {
          query: this.searchData,
          pagination: { page: this.page_num, pageSize: this.per_page },
          fields: api.PubLightModelFields.All,
          maxItemCount: 500
        })
        .then(() => {
          let self = this;
            self.searchResults = searchModule.getSearchResults(store);
            self.pages = self.searchResults.pageCount;
            self.loading = false;
        })
        .then(() => {
          if (index !== -1) {
            this.selectedIndex = index;
            if (this.selectedItem.primaryInfo.title != undefined) {
              this.selectedItem = this.searchResults.items[this.selectedIndex];
            }
            // globalState.commitShowRightSidebar(store, true);
          }
        });
    }

    closeObjectRightSidebar() {
      this.selectedItem = new api.PubLightModel();
    }
}
