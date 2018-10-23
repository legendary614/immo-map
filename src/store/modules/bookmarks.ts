/*import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import store from "../../store";
import { ActionContext } from "vuex";
import * as api from "@immosparrow/cockpit-api";
import * as api2 from "@immosparrow/cockpit-api-v2";

class State {
  bookmarks: any;
}
export const state: State = {
  bookmarks: [],
};

type BookmarksContext = ActionContext<State, any>;


let keys = function (array: Array<object>, key: string) {

  let e = [];

  for (let i = 0, l = array.length; i < l; i++) {
    e.push(array[i][key]);
  }

  return e;
};

export const bookmarks = {
  namespaced: true,
  state,
  getters: {

    bookmarks: (state: State) => {

      return state.bookmarks;
    }
  },
  mutations: {

    addBookmark (state: State, address: api2.GeoSuggestion) {

      let userRepo = new api.UserRepo();

      // let bookmarks = userRepo.removeNamespace("bookmarks.history");

      let date = new Date();
      let date_string = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();


      if (state.bookmarks.length) {

        for (let i = 0, l = state.bookmarks.length; i < l; i++) {

          for (let g = 0, f = state.bookmarks[i].data.length; g < f; g++) {

            if (state.bookmarks[i].data[g].uniqueIdentifier == address.uniqueIdentifier) {
              break;
            }
          }

          // if (state.bookmarks[i].date == date_string) {
            Vue.set(state.bookmarks[i].data, state.bookmarks[i].data.length, {...address});
            userRepo.setValue("bookmarks.history", date_string, address.uniqueIdentifier, {
              name: address.name,
              data: address,
              time: date,
            });
          // }
        }
      } else {

        userRepo.setValue("bookmarks.history", date_string, address.uniqueIdentifier, {
          name: address.name,
          data: address,
          time: date,
        });

        Vue.set(state.bookmarks, 0, {
          date: date_string,
          data: [address]
        });

      }

    },


    syncDbBookmarks(state: State) {
      let userRepo = new api.UserRepo();
      userRepo.getAllScopes("bookmarks.history").then(function (data: any) {

        state.bookmarks = [];

        for (let i = 0, l = data.length; i < l; i++) {

          userRepo.getAllValues("bookmarks.history", data[i]).then(function (h: any) {

            let m = [];
            for (let g = 0, f = h.length; g < f; g++) {
              h[g].data.time = h[g].time;
              m.push(h[g].data);
            }
            Vue.set(state.bookmarks, i, {
              date: data[i],
              data: m
            });
          });


        }
      });
    },

    update_bookmark(state: State, address: api2.GeoSuggestion) {
      for (let i = 0, l = state.bookmarks.length; i < l; i++) {

        if (state.bookmarks[i].date == address["scope"]) {
          for (let g = 0, f = state.bookmarks[i].data.length; g < f; g++) {
            if (state.bookmarks[i].data[g].uniqueIdentifier == address.uniqueIdentifier) {
              Vue.set(state.bookmarks[i].data, g, address);

              userRepo.setValue("bookmarks.history", address["scope"], address.uniqueIdentifier, {
                name: address.name,
                data: address,
                time: new Date(),
            }
          }
        }
      }
    },
    removeBookmark (state: State, address: api2.GeoSuggestion) {

      let userRepo = new api.UserRepo();
      for (let i = 0, l = state.bookmarks.length; i < l; i++) {

        let d = state.bookmarks[i].date.split(".")[2] + "-" + state.bookmarks[i].date.split(".")[1] + "-" + state.bookmarks[i].date.split(".")[0];

        let date = new Date(d);
        let date_string = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();

        for (let g = 0, f = state.bookmarks[i].data.length; g < f; g++) {

          if (state.bookmarks[i].data[g].uniqueIdentifier == address.uniqueIdentifier) {

            Vue.delete(state.bookmarks[i].data, g);
            userRepo.removeValue("bookmarks.history", date_string, address.uniqueIdentifier);

            if (state.bookmarks[i].data.length == 0) {
              Vue.delete(state.bookmarks, i);
              userRepo.removeScope("bookmarks.history", date_string);
            }
          }

        }
      }
    },
    resetBookmarks (state: State) {
      state.bookmarks = [];

      let userRepo = new api.UserRepo();
      userRepo.removeNamespace("bookmarks.history");

    },

    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    }
  },

};

const { commit, read, dispatch } =
  getStoreAccessors<State, any>("bookmarks");
const mutations = bookmarks.mutations;
const getters = bookmarks.getters;

export const commitResetState = commit(mutations.resetState);
export const commitResetBookmarks = commit(mutations.resetBookmarks);
export const commitAddToBookmarks = commit(mutations.addBookmark);
export const commitRemoveFromBookmarks = commit(mutations.removeBookmark);
export const syncDbBookmarks = commit(mutations.syncDbBookmarks);
export const update_bookmark = commit(mutations.update_bookmark);

export const getBookmarks = read(getters.bookmarks);*/

