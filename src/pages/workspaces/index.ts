import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./Workspaces.vue";
import Paginate from "vuejs-paginate";
import WorkspaceProfile from "../../components/workspaceProfile";
import * as workspaceModule from "../../store/modules/workspaces";
import * as agencyModule from "../../store/modules/agencies";
import { WorkspaceModel, IWorkspaceModel, IEntitySearchResult, IWorkspaceLightModel } from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "../../store/modules/globalStates_";
import AgencyMapComponent from "./../../components/map/agency";
@Component({
  mixins: [template],
  components: {
    WorkspaceProfile,
    Paginate,
    AgencyMapComponent
  }
})
export default class Workspaces extends Vue {

  workspaces: IEntitySearchResult<IWorkspaceLightModel> = null;
  workspace: IWorkspaceModel = new WorkspaceModel;
  newWorkspace: WorkspaceModel = new WorkspaceModel();

  showSearchAreas: boolean = false;
  activeNo: number = 0;
  inActiveNo: number = 0;
  pages: number = 0;
  workspaces_no: number = 0;
  searchForString: string = "";
  searchLoading: boolean = false;
  searchFinished: boolean = false;
  addingWorkspace: boolean = false;
  perPage: number = 10;
  pageNum: number = 0;
  selectedIndex: number = -1;
  loading: boolean = false;
  $refs: {
    workspacesPagination: any
  };

  created() {
    this.loadWorkspaces();
    this.$on("showSearchAreas", (value: boolean) => {
      this.showSearchAreas = value;
    });
  }

  closeWorkspace() {
    this.workspace = new WorkspaceModel();
    globalState.commitProfileRightSidebar(store, false);
    this.selectedIndex = -1;

    this.$root.$emit("profile_is_closed", true);
  }
  closeNewWorkspace() {
    this.addingWorkspace = false;
    globalState.commitProfileRightSidebar(store, false);
    this.workspace = new WorkspaceModel();
    this.$root.$emit("profile_is_closed", true);
  }

  loadWorkspaces() {
    let self = this;
    self.loading = true;
    let agency = agencyModule.getAgency(store);
    let pagination = {
      pageSize: this.perPage,
      page: 0
    };
    workspaceModule.dispatchGetWorkspaces(store, {agencyId: agency.id, pagination: pagination, name: ""}).then(() => {

      let res = workspaceModule.getWorkspaces(store);
      this.workspaces = res;
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
  reload_with_new_number() {
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

    this.$refs.workspacesPagination.selected = this.pageNum;

    setTimeout(() => {
      let agency = agencyModule.getAgency(store);
      let pagination = {
        pageSize: this.perPage,
        page: 0
      };
      workspaceModule.dispatchGetWorkspaces(store, {agencyId: agency.id, pagination: pagination, name: ""})
        .then(() => {
          let res = workspaceModule.getWorkspaces(store);
          this.workspaces = res;
          this.pages = res.pageCount;
          this.loading = false;
        })
        .then(() => {
          if (index !== undefined) {
            this.getWorkspace(index);
          }
        });
    }, 1000);
  }

  getWorkspace(index: number) {
    this.addingWorkspace = false;
    this.selectedIndex = index;
    let id = this.workspaces.items[this.selectedIndex]["id"];
    workspaceModule.dispatchGetWorkspace(store, id).then(() => {
      this.workspace = workspaceModule.getWorkspace(store);
      this.workspaces[index] = this.workspace;
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
    this.getWorkspace(this.selectedIndex);
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
      },
      agencyId: agencyModule.getAgency(store).id
    };
    if (self.searchForString) {

      workspaceModule.dispatchSearchWorkspace(store, searchQuery).then(() => {
        setTimeout(function () {
          let res = workspaceModule.getSearchResults(store);
          self.workspaces = res;
          self.pages = res.pageCount;
          self.searchLoading = false;
          self.searchFinished = true;
        }, 500);
      }).catch(e => {
        console.log(e);
      });

    } else {
      self.loadWorkspaces();
    }
  }

  change_perPage(i: number) {
    // this.searchForString = "";
    this.perPage = i;
    this.pageNum = 0;
  }

  clear_search() {
    this.searchForString = "";
    this.searchFinished = false;
    this.nextPage(0, -1);
  }

  addWorkspace() {
    this.newWorkspace = new WorkspaceModel();
    this.addingWorkspace = true;
    globalState.commitProfileRightSidebar(store, true);
  }

  checkEnd (index: number) {
    let idx = index + 1;
    let pgNum = this.pageNum + 1;
    if (this.workspaces.items[idx] || pgNum !== this.pages) {
      return true;
    } else {
      return false;
    }
  }
}
