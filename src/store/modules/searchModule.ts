import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import { commitSetShowLock } from "./../../store/modules/globalStates_";
import * as globalState from "./../../store/modules/globalStates_";

import { ActionContext } from "vuex";

class FindModel {
  query: api.IPubQuery;
  pagination: api.IPagination;
  fields?: api.PubLightModelFields;
  maxItemCount?: number;
}

class State {
  searchResults: api.ISearchResult<api.IPubLightModel>;
  mapSearchResults: api.ISearchResult<api.IPubLightModel>;
  propertyTypes: api.IPubPropertyCategory[];
  realEstatePortals: api.IPubSource[];
  searchData: FindModel;
}

const state: State = {
  searchResults: null,
  mapSearchResults: null,
  propertyTypes: [],
  realEstatePortals: [],
  searchData: new FindModel()
};


export const searchModule = {
  namespaced: true,

  state,
  getters: {
    searchResults: (state: State) => {
      return state.searchResults;
    },
    mapSearchResults: (state: State) => {
      return state.mapSearchResults;
    },
    propertyTypes: (state: State) => {
      return state.propertyTypes;
    },
    realEstatePortals: (state: State) => {
      return state.realEstatePortals;
    },
    searchData: (state: State) => {
      return state.searchData;
    }
  },
  mutations: {
    setSearchResults (state: State, searchResults: api.ISearchResult<api.IPubLightModel>) {
      state.searchResults = searchResults;
    },
    setMapSearchResults (state: State, mapSearchResults: api.ISearchResult<api.IPubLightModel>) {
      state.mapSearchResults = mapSearchResults;
    },
    setPropertyTypes (state: State, propertyTypes: api.IPubPropertyCategory[]) {
      state.propertyTypes = propertyTypes;
    },
    setRealEstatePortals (state: State, realEstatePortals: api.IPubSource[]) {
      state.realEstatePortals = realEstatePortals;
    },
    setSearchData (state: State, searchData: FindModel) {
      state.searchData = new FindModel;
      state.searchData = searchData;
    },
    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {
    async find (context: ActionContext<State, any>, data: FindModel) {
      try {
        const searchResults: api.ISearchResult<api.IPubLightModel> = await api.$pubs.find(data.query, data.pagination, data.fields, data.maxItemCount);
        commitSetSearchResults(context, searchResults);
        commitSetSearchData(context, data);
      }
      catch (err) {
        globalState.commitSetLoadingButton(store, false);

        if (err.status === 401) {
          commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to search"
          });
        }
      }
    },
    async findCoordinates (context: ActionContext<State, any>, data: FindModel) {
      try {
        const searchResults: api.ISearchResult<api.IPubLightModel> = await api.$pubs.find(data.query, data.pagination, data.fields, data.maxItemCount);
        commitSetMapSearchResults(context, searchResults);
        commitSetSearchData(context, data);
      }
      catch (err) {
        globalState.commitSetLoadingButton(store, false);

        if (err.status === 401) {
          commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to map search"
          });
        }
      }
    },
    async getRealEstatePortals (context: ActionContext<State, any>) {
      try {
        const pubSources: api.IPubSource[] = await api.$pubs.getPublicationSources();
        commitSetRealEstatePortals(context, pubSources);
      }
      catch (err) {
        if (err.status === 401) {
          commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get real estate portals"
          });
        }
      }
    },
    async getPropertyTypes (context: ActionContext<State, any>) {
      try {
        const properties: api.IPubPropertyCategory[] = await api.$pubs.getPropertyCategories();
        commitSetPropertyTypes(context, properties);
      }
      catch (err) {
        if (err.status === 401) {
          commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get property types"
          });
        }
      }
    }
  }
};


const { commit, read, dispatch } =
  getStoreAccessors<State, any>("searchModule");

const mutations = searchModule.mutations;
export const commitSetSearchResults = commit(mutations.setSearchResults);
export const commitSetMapSearchResults = commit(mutations.setMapSearchResults);
export const commitSetPropertyTypes = commit(mutations.setPropertyTypes);
export const commitSetRealEstatePortals = commit(mutations.setRealEstatePortals);
export const commitSetSearchData = commit(mutations.setSearchData);
export const commitResetState = commit(mutations.resetState);

const actions = searchModule.actions;
export const dispatchFind = dispatch(actions.find);
export const dispatchFindCoordinates = dispatch(actions.findCoordinates);
export const dispatchGetPropertyTypes = dispatch(actions.getPropertyTypes);
export const dipsatchGetRealEstatePortals = dispatch(actions.getRealEstatePortals);

const getters = searchModule.getters;
export const getSearchResults = read(getters.searchResults);
export const getMapSearchResults = read(getters.mapSearchResults);
export const getPropertyTypes = read(getters.propertyTypes);
export const getRealEstatePortals = read(getters.realEstatePortals);
export const getSearchData = read(getters.searchData);
