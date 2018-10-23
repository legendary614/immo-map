import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./Users.vue";
import Paginate from "vuejs-paginate";
import Profile from "../../components/profile";
import { IEntitySearchResult, IUserLightModel, UserModel, IUserModel } from "@immosparrow/cockpit-api-v2";
import {
  dispatchGetUser, dispatchGetUsers, dispatchSearchUser, getSearchResults, getUser,
  getUsers
} from "./../../store/modules/user_";
import store from "../../store";
import * as globalState from "../../store/modules/globalStates_";

@Component({
  mixins: [template],
  components: {
    Profile,
    Paginate
  }
})
export default class Users extends Vue {

  users: IEntitySearchResult<IUserLightModel> = null;
  user: IUserModel = new UserModel;
  newUser: IUserModel = new UserModel();

  activeNo: number = 0;
  inActiveNo: number = 0;
  pages: number = 0;
  searchForString: string = "";
  searchLoading: boolean = false;
  searchFinished: boolean = false;
  addingUser: boolean = false;
  perPage: number = 10;
  pageNum: number = 0;
  selectedIndex: number = -1;
  loading: boolean = false;
  $refs: {
    usersPagination: any
  };

  created() {
    this.loadUsers();
    globalState.commitSetSearchSidebar(store, true);
    // this.$store.commit("setLoadingButton", false);
  }

  closeUser() {
    this.user = new UserModel();
    globalState.commitProfileRightSidebar(store, false);
    this.selectedIndex = -1;
  }
  closeNewUser() {
    this.addingUser = false;
    globalState.commitProfileRightSidebar(store, false);
    this.user = new UserModel();
  }

  loadUsers() {
    let self = this;
    self.loading = true;
    dispatchGetUsers(store, {page: 0, pageSize: this.perPage}).then(() => {

      let res = getUsers(store);
      this.users = res;
      this.pages = res.pageCount;
      this.activeNo = res.totalItemCount;
      this.inActiveNo = res.entityCounts.totalCount - this.activeNo;
      self.loading = false;
      if (!this.searchFor) {
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

    this.$refs.usersPagination.selected = this.pageNum;

    setTimeout(() => {
      dispatchGetUsers(store, {page: this.pageNum, pageSize: this.perPage})
        .then(() => {
          let res = getUsers(store);
          this.users = res;
          this.pages = res.pageCount;
          this.loading = false;
        })
        .then(() => {
          if (index !== undefined) {
            this.getUser(index);
          }
        });
    }, 1000);
  }

  getUser(index: number) {
    this.addingUser = false;
    this.selectedIndex = index;
    let id = this.users.items[this.selectedIndex]["id"];
    dispatchGetUser(store, id).then(() => {
      this.user = getUser(store);
      // this.users.items[index] = this.user as IUserLightModel;
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
    this.getUser(this.selectedIndex);
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
      page: pNum,
      pageSize: this.perPage,
      searchQuery: self.searchForString
    };
    if (self.searchForString) {

      dispatchSearchUser(store, searchQuery).then(() => {
        setTimeout(function () {
          let res = getSearchResults(store);
          self.users = res;
          self.pages = res.pageCount;
          self.searchLoading = false;
          self.searchFinished = true;

        }, 500);
      }).catch(e => {
        console.log(e);
      });

    } else {
      self.loadUsers();
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

  add_user() {
    globalState.commitProfileRightSidebar(store, true);
    this.addingUser = true;
    this.newUser = new UserModel();

  }

  checkEnd (index: number) {
    let idx = index + 1;
    let pgNum = this.pageNum + 1;
    if (this.users[idx] || pgNum !== this.pages) {
      return true;
    } else {
      return false;
    }
  }

}
