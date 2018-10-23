/* import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import store from "../../store";
import { ActionContext } from "vuex";
import * as api from "@immosparrow/cockpit-api";
import * as api2 from "@immosparrow/cockpit-api-v2";

class State {
  transparencyHistory: any;
}
export const state: State = {
  transparencyHistory: [],
};

type HistoryContext = ActionContext<State, any>;




let keys = function (array: Array<object>, key: string) {

  let e = [];

  for (let i = 0, l = array.length; i < l; i++) {
    e.push(array[i][key]);
  }

  return e;
};

export const history = {
  namespaced: true,
  state,
  getters: {

    transparencyHistory: (state: State) => {

      return state.transparencyHistory;
    }
  },
  mutations: {

    addToTransparencyHistory (state: State, address: api2.GeoSuggestion) {

      let date = new Date();

      let date_string = date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();

      let t = getTransparencyHistory(store);

      let kd = keys(t, "date");


      if (t[0] != undefined) {

        if (kd.indexOf(date_string) == -1) {
          Vue.set(t, t.length, {
            date: date_string,
            data: [address]
          });
        }

        for (let i = 0, l = t.length; i < l; i++) {

          let k = keys(t[i].data, "uniqueIdentifier");

          if (t[i].date != undefined) {

            if (t[i].date == date_string) {

              if (k.indexOf(address.uniqueIdentifier) == -1) {

                Vue.set(t[i].data, t[i].data.length, {...address});
              } else {

                Vue.set(t[i].data, k.indexOf(address.uniqueIdentifier), {...address});
              }

            }
          }
        }

      } else {
        Vue.set(state.transparencyHistory, 0, {
          date: date_string,
          data: [address]
        });
      }

      // add to database
      let userRepo = new api.UserRepo();
      userRepo.setValue("transparency.history", date_string, address.uniqueIdentifier, {
        name: address.name,
        data: address,
        time: date,
      });

    },

    syncDbHistory(state: State) {
      let userRepo = new api.UserRepo();
      userRepo.getAllScopes("transparency.history").then(function (data: any) {

        state.transparencyHistory = [];

        for (let i = 0, l = data.length; i < l; i++) {

          userRepo.getAllValues("transparency.history", data[i]).then(function (h: any) {

            let m = [];
            for (let g = 0, f = h.length; g < f; g++) {
              h[g].data.time = h[g].time;
              m.push(h[g].data);
            }
            Vue.set(state.transparencyHistory, i, {
              date: data[i],
              data: m
            });
          });


        }
      });
    },

    resetHistory (state: State) {
      state.transparencyHistory = [];

      let userRepo = new api.UserRepo();
      userRepo.removeNamespace("transparency.history");

    },

    addArrayTransparencyHistory (state: State, array: any) {

      state.transparencyHistory = [];
      state.transparencyHistory = array;

    },

    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    }
  },

};

const { commit, read, dispatch } =
  getStoreAccessors<State, any>("history");
const mutations = history.mutations;
const getters = history.getters;

export const commitResetState = commit(mutations.resetState);
export const commitResetHistory = commit(mutations.resetHistory);
export const commitAddToTransparencyHistory = commit(mutations.addToTransparencyHistory);
export const commitAddArrayTransparencyHistory = commit(mutations.addArrayTransparencyHistory);
export const syncDbHistory = commit(mutations.syncDbHistory);

export const getTransparencyHistory = read(getters.transparencyHistory);
*/
