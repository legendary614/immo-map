import { getStoreAccessors } from "vuex-typescript";
import { ActionContext } from "vuex";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";

class State {
  searchedAddress: api.GeoSuggestion;
  searchedAddressTransparency: api.GeoSuggestion;
  searchedAddressMarketRadar: api.GeoSuggestion;
  searchedAddressMarketRadarRadius: number;
  searchedAddressBuilding: api.BuildingModel;
  address_loading: boolean;
  object_window: boolean;
  map_sidebar: boolean;
}

const state: State = {
  searchedAddress: new api.GeoSuggestion(),
  searchedAddressTransparency: new api.GeoSuggestion(),
  searchedAddressMarketRadar: new api.GeoSuggestion(),
  searchedAddressMarketRadarRadius: 5,
  searchedAddressBuilding: new api.BuildingModel(),
  address_loading: false,
  object_window: false,
  map_sidebar: false,
};

export const search_ = {
  namespaced: true,
  state,
  getters: {
    searchedAddressBuilding: (state: State) => {
      return state.searchedAddressBuilding;
    },
    searchedAddress: (state: State) => {
      return state.searchedAddress;
    },
    searchedAddressTransparency: (state: State) => {
      return state.searchedAddressTransparency;
    },
    searchedAddressMarketRadar: (state: State) => {
      return state.searchedAddressMarketRadar;
    },
    searchedAddressMarketRadarRadius: (state: State) => {
      return state.searchedAddressMarketRadarRadius;
    },
    addressLoading: (state: State) => {
      return state.address_loading;
    },
    object_window: (state: State) => {
      return state.object_window;
    },
    sidebar: (state: State) => {
      return state.map_sidebar;
    }
  },
  mutations: {
    searchingFor (state: State, address: api.GeoSuggestion) {
      state.searchedAddress = address;
    },
    searchingForTransparency (state: State, address: api.GeoSuggestion) {
      state.searchedAddressTransparency = address;
    },
    searchingMarketRadarAddress (state: State, address: api.GeoSuggestion) {
      state.searchedAddressMarketRadar = address;
    },

    searchingMarketRadarAddressRadius (state: State, radius: number) {
      state.searchedAddressMarketRadarRadius = radius;
    },

    searchedAddressBuilding (state: State, b: api.BuildingModel) {
      state.searchedAddressBuilding = b;
    },

    addressLoading (state: State, loading: boolean) {
      state.address_loading = loading;
    },

    object_window (state: State, loading: boolean) {
      state.object_window = loading;
    },

    changeSidebar (state: State, val: boolean) {
      state.map_sidebar = val;
    },

    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {
    setTransparencyAddress(context: ActionContext<State, any>, address: api.GeoSuggestion) {
      commitSearchingForTransparency(store, address);
    }


  }
};

const { commit, read, dispatch } =
  getStoreAccessors<State, any>("search_");
const mutations = search_.mutations;
const getters = search_.getters;
/*[getters, mutations].forEach(dictionary =>
  Object["entries"](dictionary).forEach(
    ([name, func]: any) => ((<any>func)._vuexKey = name)
  )
);
if (!Object["entries"]) {
  Object["entries"] = function (obj: any) {
    console.log(obj)
    let ownProps = Object.keys(obj),
      i = ownProps.length,
      resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
  };
}*/

export const commitSearchingFor = commit(mutations.searchingFor);
export const commitSearchingForTransparency = commit(mutations.searchingForTransparency);
export const commitSearchingForMarketRadarAddress = commit(mutations.searchingMarketRadarAddress);
export const commitSearchingForMarketRadarAddressRadius = commit(mutations.searchingMarketRadarAddressRadius);
export const commitSearchedAddressBuilding = commit(mutations.searchedAddressBuilding);
export const commitAddressLoading = commit(mutations.addressLoading);
export const commitResetState = commit(mutations.resetState);
export const commitObjectWindow = commit(mutations.object_window);
export const commitSidebar = commit(mutations.changeSidebar);

export const getSearchedAddress = read(getters.searchedAddress);
export const getSearchedAddressTransparency = read(getters.searchedAddressTransparency);
export const getSearchedAddressMarketRadar = read(getters.searchedAddressMarketRadar);
export const getSearchedAddressMarketRadarRadius = read(getters.searchedAddressMarketRadarRadius);
export const getSearchedAddressBuilding = read(getters.searchedAddressBuilding);
export const getAddressLoading = read(getters.addressLoading);
export const getObjectWindow = read(getters.object_window);
export const getSidebar = read(getters.object_window);


const actions = search_.actions;
export const dispatchSetTransparencyAddress = dispatch(actions.setTransparencyAddress);
