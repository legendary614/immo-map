import Vue from "vue";
import * as api from "@immosparrow/cockpit-api-v2";
import * as api1 from "@immosparrow/cockpit-api";
import store from "../../store";
import { ActionContext } from "vuex";
import { getStoreAccessors } from "vuex-typescript";
import * as globalState from "./../../store/modules/globalStates_";
import { getToken } from "./auth_";

class State {
  userProfile: api.IUserProfileModel;
}

const state: State = {
  userProfile: new api.UserProfileModel()
};
export const userProfile = {

  namespaced: true,

  state,
  getters: {
    userProfile: (state: State) => {
      return state.userProfile;
    }
  },
  mutations: {
    setUserProfile (state: State, userProfile: api.IUserProfileModel) {
      state.userProfile = userProfile;
    },

    resetState: (s: State) => {
      const initial = new State();
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {
    async getUserProfile (context: ActionContext<State, any>) {
      try {
        const userProfile: api.IUserProfileModel = await api.$authUser.profile.get();
        commitSetUserProfile(context, userProfile);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get users profile"
          });
        }
      }
    },
    async updateUserProfilePassword (context: ActionContext<State, any>, data: any) {
      try {
        // const res = await api.$authUser.profile.changePassword();
        /* const client: api.UserProfileClient = new api.UserProfileClient();
        const res = await client.updatePassword(new api.UserProfileUpdatePasswordModel(
          {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
          }
        )); */

        api.$authUser.profile.changePassword(data.currentPassword, data.newPassword).then((value: boolean) => {

          if (value) {
            setTimeout(() => {
              globalState.commitSetLoadingButton(store, false);
              Vue.prototype.$notify({
                group: "actions",
                type: "success",
                duration: 2500,
                text: "Password was updated"
              });
            }, 1000);
          } else {
            Vue.prototype.$notify({
              group: "actions",
              type: "error",
              duration: 2500,
              text: "Password was not updated successfully"
            });
          }
        });

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
    async updateUserProfile (context: ActionContext<State, any>, data: api1.UserModifiableModel) {
      try {
        const client: api1.UserProfileClient = new api1.UserProfileClient();
        const res = await client.update(new api1.UserModifiableModel(data));
        setTimeout(() => {
          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "Profile was updated"
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
            text: "Profile was not updated successfully"
          });
        }
      }
    }
  }

};

const { commit, read, dispatch } =
  getStoreAccessors<State, any>("userProfile");

const getters = userProfile.getters;
export const getUserProfile = read(getters.userProfile);

const actions = userProfile.actions;
export const dispatchGetUserProfile = dispatch(actions.getUserProfile);
export const dispatchUpdateUserProfilePassword = dispatch(actions.updateUserProfilePassword);
export const dispatchUpdateUserProfile = dispatch(actions.updateUserProfile);

const mutations = userProfile.mutations;
export const commitSetUserProfile = commit(mutations.setUserProfile);
export const commitResetState = commit(mutations.resetState);
