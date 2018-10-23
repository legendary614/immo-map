import Vue from "vue";
import Vuex from "vuex";
// import persist from "vuex-localstorage";
import createPersistedState from "vuex-persistedstate";
import { search_ } from "./modules/search_";
// import { history } from "./modules/history";
// import { bookmarks } from "./modules/bookmarks";
// import { docs } from "./modules/docs";
import { userProfile } from "./modules/userProfile";
import { globalStates_ } from "./modules/globalStates_";
import { auth_ } from "./modules/auth_";
import { userStates } from "./modules/user_";
import { searchModule } from "./modules/searchModule";
import { agencyStates } from "./modules/agencies";
import { workspaceStates } from "./modules/workspaces";
import { employeeStates } from "./modules/employees";
import { invitationModule } from "./modules/invitations";
import * as api2 from "@immosparrow/cockpit-api-v2";

// api.config.baseUrl = process.env.apiURL;
api2.init(process.env.apiURL);

Vue.use(Vuex);

let store = new Vuex.Store({
  modules: {
    auth_,
    userProfile,
    userStates,
    globalStates_,
    search_,
    // history,
    // docs,
    // bookmarks,
    searchModule,
    agencyStates,
    workspaceStates,
    employeeStates,
    invitationModule
  },
  plugins: [
    createPersistedState({
      namespace: "immosparrow",
      expires: 7 * 24 * 60 * 60 * 1e3
    })
  ],
  strict: false,

});

export default store;
