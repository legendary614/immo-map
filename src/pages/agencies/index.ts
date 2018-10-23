import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./Agencies.vue";
import Paginate from "vuejs-paginate";
import AgencyProfile from "../../components/agencyProfile";
import * as agencyModule from "../../store/modules/agencies";
import { AgencyModel, IAgencyModel, IEntitySearchResult, IAgencyLightModel } from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "../../store/modules/globalStates_";
import AgencyMapComponent from "./../../components/map/agency";
@Component({
  mixins: [template],
  components: {
    AgencyProfile,
    Paginate,
    AgencyMapComponent
  }
})
export default class Agencies extends Vue {

  agencies: IEntitySearchResult<IAgencyLightModel> = null;
  agency: IAgencyModel = new AgencyModel;
  newAgency: AgencyModel = new AgencyModel();

  activeNo: number = 0;
  inActiveNo: number = 0;
  pages: number = 0;
  searchForString: string = "";
  searchLoading: boolean = false;
  showSearchAreas: boolean = false;
  searchFinished: boolean = false;
  addingAgency: boolean = false;
  perPage: number = 10;
  pageNum: number = 0;
  selectedIndex: number = -1;
  loading: boolean = false;
  $refs: {
    agenciesPagination: any
  };

  created() {
    this.loadAgencies();
    globalState.commitSetSearchSidebar(store, true);

    this.$on("showSearchAreas", (value: boolean) => {
      this.showSearchAreas = value;
    });
  }

  closeAgency() {
    this.agency = new AgencyModel();
    globalState.commitProfileRightSidebar(store, false);
    this.selectedIndex = -1;

    this.$root.$emit("profile_is_closed", true);
  }
  closeNewAgency() {
    this.addingAgency = false;
    globalState.commitProfileRightSidebar(store, false);
    this.agency = new AgencyModel();
    this.$root.$emit("profile_is_closed", true);
  }

  loadAgencies() {
    let self = this;
    self.loading = true;
    agencyModule.dispatchGetAgencies(store, {page: 0, pageSize: this.perPage}).then(() => {

      let res = agencyModule.getAgencies(store);
      this.agencies = res;
      this.pages = res.pageCount;
      this.activeNo = res.entityCounts.enabledCount;
      this.inActiveNo = res.entityCounts.totalCount - this.activeNo;
      self.loading = false;
      if (!this.searchForString) {
        setTimeout(function () {
          self.searchLoading = false;
        }, 500);
      }
    });

  }

  @Watch("perPage")
  reloadWithNewNumber() {
    this.nextPage(this.pageNum, undefined);
  }

  nextPage(pageNum: number, index: number) {
    this.loading = true;
    if (pageNum === 0) {
      this.pageNum = 0;
    } else {
      this.pageNum = pageNum - 1;
    }
    if (this.searchForString != "") {
      return this.searchFor(this.pageNum);
    }

    this.$refs.agenciesPagination.selected = this.pageNum;

    setTimeout(() => {
      agencyModule.dispatchGetAgencies(store, {page: this.pageNum, pageSize: this.perPage})
        .then(() => {
          let res = agencyModule.getAgencies(store);
          this.agencies = res;
          this.pages = res.pageCount;
          this.loading = false;
        })
        .then(() => {
          if (index !== undefined) {
            this.getAgency(index);
          }
        });
    }, 1000);
  }

  getAgency(index: number) {
    this.addingAgency = false;
    this.selectedIndex = index;
    let id = this.agencies.items[this.selectedIndex]["id"];
    agencyModule.dispatchGetAgency(store, id).then(() => {
      this.agency = agencyModule.getAgency(store);
      this.agencies[index] = this.agency;
      globalState.commitProfileRightSidebar(store, true);
    });
  }

  nextItem (index: number, next: boolean) {
    this.selectedIndex = index;
    if (next) {
      if (this.perPage - 1 === index) {
        let pgNum = this.pageNum;
        pgNum += 2;
        this.nextPage(pgNum, 0);
      } else {
        this.selectedIndex++;
      }
    } else {
      if (index === 0) {
        let pgNum = this.pageNum;
        pgNum--;
        this.nextPage(pgNum, this.perPage - 1);
      } else {
        this.selectedIndex--;
      }
    }
    this.getAgency(this.selectedIndex);
  }


  searchFor(pageNum: number) {
    let self = this;
    self.searchFinished = false;
    this.searchLoading = true;

    let pNum = 0;
    if (pageNum > 0) {
      pNum = pageNum - 1;
    }

    let searchQuery = {
      name: self.searchForString,
      pagination: {
        page: pNum,
        pageSize: this.perPage
      }
    };
    if (self.searchForString) {

      agencyModule.dispatchSearchAgency(store, searchQuery).then(() => {
        setTimeout(function () {
          let res = agencyModule.getSearchResults(store);
          self.agencies = res;
          self.pages = res.pageCount;
          self.searchLoading = false;
          self.searchFinished = true;
        }, 500);
      }).catch(e => {
        console.log(e);
      });

    } else {
      self.loadAgencies();
    }
  }

  changePerPage(i: number) {
    // this.searchForString = "";
    this.perPage = i;
    this.pageNum = 0;
  }

  clear_search() {
    this.searchForString = "";
    this.searchFinished = false;
    this.nextPage(0, -1);
  }

  addAgency() {
    this.newAgency = new AgencyModel();
    this.addingAgency = true;
    globalState.commitProfileRightSidebar(store, true);
  }

  checkEnd (index: number) {
    let idx = index + 1;
    let pgNum = this.pageNum + 1;
    if (this.agencies.items[idx] || pgNum !== this.pages) {
      return true;
    } else {
      return false;
    }
  }
}
