import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "./../../store/modules/globalStates_";

import { ActionContext } from "vuex";

class State {
  users: api.IEntitySearchResult<api.IUserLightModel>;
  user: api.UserModel;
  searchResults:  api.IEntitySearchResult<api.IUserLightModel>;
}

const state: State = {
  users: null,
  user: new api.UserModel,
  searchResults: null
};


class SearchQuery {
  page: number;
  pageSize: number;
  searchQuery: string;
}
class PasswordUpdate {
  id: string;
  newPassword: string;
}
class UpdateUser {
  id: string;
  data: api.IUserModel;
}
export const userStates = {
  namespaced: true,

  state,
  getters: {
    users: (state: State) => {
      return state.users;
    },
    user: (state: State) => {
      return state.user;
    },
    searchResults: (state: State) => {
      return state.searchResults;
    }
  },
  mutations: {
    setUsers (state: State, users: api.IEntitySearchResult<api.IUserLightModel>) {
      state.users = users;
    },
    setUser (state: State, user: api.UserModel) {
      state.user = user;
    },
    setSearchResults (state: State, searchResults: api.IEntitySearchResult<api.IUserLightModel>) {
      state.searchResults = searchResults;
    },
    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {

    async getUsers (context: ActionContext<State, any>, data: api.IPagination) {
      try {
        const usersList: api.IEntitySearchResult<api.IUserLightModel> = await api.$users.find(undefined, " ", data);
        commitSetUsers(context, usersList);
      }
      catch (err) {

        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get users"
          });
        }
      }
    },
    async getUser (context: ActionContext<State, any>, userId: string) {
      try {
        const user: api.UserModel = await api.$user(userId).get();
        commitSetUser(context, user);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get user"
          });
        }
      }
    },
    // TODO type for data
    async updatePassword (context: ActionContext<State, any>, data: PasswordUpdate) {
      try {
        // const res = await api.$auth.completePasswordReset(data.id, data.newPassword);
        setTimeout(() => {
          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "Password was updated"
          });
        }, 1000);
      }
      catch (err) {
        globalState.commitSetLoadingButton(store, false);
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Password was not updated successfully"
          });
        }
      }
    },
    async createUser (context: ActionContext<State, any>, data: api.IUserModel) {
      const user: api.User = await api.$users.create(data);
      return user;
    },
    async updateUser (context: ActionContext<State, any>, data: UpdateUser) {
      try {
        const user = api.$user(data.id);
        await user.update(data.data);
        setTimeout(() => {

          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "User was updated"
          });
        }, 1000);
      }
      catch (err) {
        globalState.commitSetLoadingButton(store, false);
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "User was not updated successfully"
          });
        }
      }
    },
    async searchUser (context: ActionContext<State, any>, data: SearchQuery) {
      try {
        const usersList: api.IEntitySearchResult<api.IUserLightModel> = await api.$users.find(0, data.searchQuery, { page: data.page, pageSize: data.pageSize });
        commitSetSearchResults(context, usersList);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to search for this user"
          });
        }
      }
    }
  }
};


const { commit, read, dispatch } =
  getStoreAccessors<State, any>("userStates");


const mutations = userStates.mutations;
export const commitSetUsers = commit(mutations.setUsers);
export const commitSetUser = commit(mutations.setUser);
export const commitSetSearchResults = commit(mutations.setSearchResults);
export const commitResetState = commit(mutations.resetState);

const actions = userStates.actions;
export const dispatchGetUsers = dispatch(actions.getUsers);
export const dispatchGetUser = dispatch(actions.getUser);
export const dispatchSearchUser = dispatch(actions.searchUser);
export const dispatchCreateUser = dispatch(actions.createUser);
export const dispatchUpdateUser = dispatch(actions.updateUser);
export const dispatchUpdatePassword = dispatch(actions.updatePassword);

const getters = userStates.getters;
export const getUsers = read(getters.users);
export const getUser = read(getters.user);
export const getSearchResults = read(getters.searchResults);
