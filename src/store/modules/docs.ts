/*import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import store from "../../store";
import { ActionContext } from "vuex";
import * as api from "@immosparrow/cockpit-api";
import * as api2 from "@immosparrow/cockpit-api-v2";
class State {
  docs: any;
}
export const state: State = {
  docs: [],
};

type DocsContext = ActionContext<State, any>;



let keys = function (array: Array<object>, key: string) {

  let e = [];

  for (let i = 0, l = array.length; i < l; i++) {
    e.push(array[i][key]);
  }

  return e;
};

export const docs = {
  namespaced: true,
  state,
  getters: {

    docs: (state: State) => {

      return state.docs;
    }
  },
  mutations: {

    addToDocs(state: State, address: api2.GeoSuggestion) {

      let date = new Date();

      let date_string = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();

      let t = getDocs(store);

      if (t[0] != undefined) {

        for (let i = 0, l = t.length; i < l; i++) {

          let k = keys(t[i].data, "uniqueIdentifier");

          if (t[i].date != undefined) {

            if (t[i].date == date_string) {

              if (k.indexOf(address.uniqueIdentifier) == -1) {

                Vue.set(t[i].data, t[i].data.length, {...address});
              } else {
                Vue.set(t[i].data, t[i].data.indexOf(address), {...address});
              }

            }
          }

        }
      } else {
        Vue.set(state.docs, 0, {
          date: date_string,
          data: [address]
        });
      }

      // add to database
      let userRepo = new api.UserRepo();
      userRepo.setValue("transparency.docs", date_string, address.uniqueIdentifier, {
        name: address.name,
        data: address,
        time: date,
      });

    },

    syncDbHistory(state: State) {
      let userRepo = new api.UserRepo();
      userRepo.getAllScopes("transparency.docs").then(function (data: any) {

        state.docs = [];

        for (let i = 0, l = data.length; i < l; i++) {

          userRepo.getAllValues("transparency.docs", data[i]).then(function (h: any) {

            let m = [];
            for (let g = 0, f = h.length; g < f; g++) {
              h[g].data.time = h[g].time;
              m.push(h[g].data);
            }
            Vue.set(state.docs, i, {
              date: data[i],
              data: m
            });
          });


        }
      });
    },

    resetDocs (state: State) {
      state.docs = [];

      let userRepo = new api.UserRepo();
      userRepo.removeNamespace("transparency.docs");

    },

    addArrayToDocs (state: State, array: any) {

      state.docs = [];
      state.docs = array;

    },

    removeDoc (state: State, address: api2.GeoSuggestion) {

      let userRepo = new api.UserRepo();
      for (let i = 0, l = state.docs.length; i < l; i++) {

        let d = state.docs[i].date.split(".")[2] + "-" + state.docs[i].date.split(".")[1] + "-" + state.docs[i].date.split(".")[0];

        let date = new Date(d);
        let date_string = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();

        for (let g = 0, f = state.docs[i].data.length; g < f; g++) {

          if (state.docs[i].data[g].uniqueIdentifier == address.uniqueIdentifier) {

            Vue.delete(state.docs[i].data, g);
            userRepo.removeValue("transparency.docs", date_string, address.uniqueIdentifier);

            if (state.docs[i].data.length == 0) {
              Vue.delete(state.docs, i);
              userRepo.removeScope("transparency.docs", date_string);
            }
          }

        }
      }
    },

    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    }
  },

};

const { commit, read, dispatch } =
  getStoreAccessors<State, any>("docs");
const mutations = docs.mutations;
const getters = docs.getters;

export const commitResetState = commit(mutations.resetState);
export const resetDocs = commit(mutations.resetDocs);
export const AddToDocs = commit(mutations.addToDocs);
export const RemoveDoc = commit(mutations.removeDoc);
export const commitAddArrayTransparencyHistory = commit(mutations.addArrayToDocs);
export const syncDbHistory = commit(mutations.syncDbHistory);

export const getDocs = read(getters.docs);*/

