import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "./../../store/modules/globalStates_";

import { ActionContext } from "vuex";

class State {
  agencies: api.IEntitySearchResult<api.IAgencyLightModel>;
  agency: api.IAgencyModel;
  searchResults: api.IEntitySearchResult<api.IAgencyLightModel>;
}

const state: State = {
  agencies: null,
  agency: new api.AgencyModel,
  searchResults: null
};

class Page {
  page: number;
  perPage: number;
}

class SearchQuery {
    name: string;
    pagination: api.IPagination;
}

export const agencyStates = {
  namespaced: true,

  state,
  getters: {
    agencies: (state: State) => {
      return state.agencies;
    },
    agency: (state: State) => {
      return state.agency;
    },
    searchResults: (state: State) => {
      return state.searchResults;
    }
  },
  mutations: {
    setAgencies (state: State, agencies: api.IEntitySearchResult<api.IAgencyLightModel>) {
      state.agencies = agencies;
    },
    setAgency (state: State, agency: api.IAgencyModel) {
      state.agency = agency;
    },
    setSearchResults (state: State, searchResults: api.IEntitySearchResult<api.IAgencyLightModel>) {
      state.searchResults = searchResults;
    },
    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {

    async getAgencies (context: ActionContext<State, any>, data: api.IPagination) {

      try {
        const agencyList: api.IEntitySearchResult<api.IAgencyLightModel> = await api.$agencies.find("", data);
        commitSetAgencies(context, agencyList);
      }
      catch (err) {

        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get agencies"
          });
        }
      }
    },
    async getAgencyById (context: ActionContext<State, any>, agencyId: string) {
      try {
        const agency: api.IAgencyModel = await api.$agency(agencyId).get();
        commitSetAgency(context, agency);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get agency"
          });
        }
      }
    },
    async createAgency (context: ActionContext<State, any>, data: api.IAgencyModel) {
        const agency: api.Agency = await api.$agencies.create(data);
        return agency;
    },
    async updateAgency (context: ActionContext<State, any>, data: api.IAgencyModel) {

      try {
        const agency = api.$agency(data.id);
        await agency.update(data);

        setTimeout(() => {
          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "Agency was updated"
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
            text: "Agency was not updated successfully"
          });
        }
      }
    },
    async searchAgency (context: ActionContext<State, any>, data: SearchQuery) {
      try {
        const agency = await api.$agencies.find(data.name, data.pagination);
        commitSetSearchResults(store, agency);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to search for this agency"
          });
        }
      }
    }
  }
};


const { commit, read, dispatch } =
  getStoreAccessors<State, any>("agencyStates");


const mutations = agencyStates.mutations;
export const commitSetAgencies = commit(mutations.setAgencies);
export const commitSetAgency = commit(mutations.setAgency);
export const commitSetSearchResults = commit(mutations.setSearchResults);
export const commitResetState = commit(mutations.resetState);

const actions = agencyStates.actions;
export const dispatchGetAgencies = dispatch(actions.getAgencies);
export const dispatchGetAgency = dispatch(actions.getAgencyById);
export const dispatchSearchAgency = dispatch(actions.searchAgency);
export const dispatchCreateAgency = dispatch(actions.createAgency);
export const dispatchUpdateAgency = dispatch(actions.updateAgency);

const getters = agencyStates.getters;
export const getAgencies = read(getters.agencies);
export const getAgency = read(getters.agency);
export const getSearchResults = read(getters.searchResults);
