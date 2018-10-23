import { getStoreAccessors } from "vuex-typescript";

class State {
  sidebar: boolean;
  loadingButton: boolean;
  loggedIn: boolean;
  loginError: boolean;
  token?: string | undefined;
  expTime: string;
  currentTime: string;
  showLock: boolean;
  showOverviewList: boolean;
  showRightSidebar: boolean;
  leftSearchSidebar: boolean;
  showSearchMap: boolean;
  showMapRightSidebar: boolean;
  showRightSidebarTransparency: boolean;
  profileRightSidebar: boolean;
  mapLoaded: boolean;
  map_size: string;
  loadingSearchResults: boolean;
}
const state: State = {
  sidebar: false,
  loadingButton: false,
  loggedIn: false,
  loginError: false,
  token: "",
  expTime: "",
  currentTime: "",
  showLock: false,
  showOverviewList: false,
  showRightSidebar: false,
  showRightSidebarTransparency: false,
  leftSearchSidebar: false,
  showSearchMap: true,
  mapLoaded: false,
  showMapRightSidebar: true,
  profileRightSidebar: false,
  map_size: "big",
  loadingSearchResults: false
};

export const globalStates_ = {
  namespaced: true,

  state,
  getters: {
    sidebar: (state: State) => {
      return state.sidebar;
    },
    loadingButton: (state: State) => {
      return state.loadingButton;
    },
    showLock: (state: State) => {
      return state.showLock;
    },
    showOverviewList: (state: State) => {
      return state.showOverviewList;
    },
    showRightSidebar: (state: State) => {
      return state.showRightSidebar;
    },
    showRightSidebarTransparency: (state: State) => {
      return state.showRightSidebarTransparency;
    },
    showMapRightSidebar: (state: State) => {
      return state.showMapRightSidebar;
    },
    showSearchMap: (state: State) => {
      return state.showSearchMap;
    },
    profileRightSidebar: (state: State) => {
      return state.profileRightSidebar;
    },
    isSearchSidebarOpened: (state: State) => {
      return state.leftSearchSidebar;
    },
    mapLoaded: (state: State) => {
      return state.mapLoaded;
    },
    mapSize: (state: State) => {
      return state.map_size;
    },
    loadingSearchResults: (state: State) => {
      return state.loadingSearchResults;
    }
  },
  mutations: {
    setSidebar (state: State, sidebar: boolean) {
      state.sidebar = sidebar;
    },
    setLoadingButton (state: State, loadingButton: boolean) {
      state.loadingButton = loadingButton;
    },
    setShowLock (state: State, showLock: boolean) {

      state.loggedIn = false;
      state.token = "";
      state.showLock = showLock;
    },
    setOverviewList (state: State, showOverviewList: boolean) {
      state.showOverviewList = showOverviewList;
    },
    setRightSidebar (state: State, showRightSidebar: boolean) {
      state.showRightSidebar = showRightSidebar;
    },
    setRightSidebarTransparency (state: State, showRightSidebar: boolean) {
      state.showRightSidebarTransparency = showRightSidebar;
    },
    setMapRightSidebar (state: State, showMapRightSidebar: boolean) {
      state.showMapRightSidebar = showMapRightSidebar;
    },
    setSearchMap (state: State, showSearchMap: boolean) {
      state.showSearchMap = showSearchMap;
    },
    setSearchSidebar(state: State, on: boolean) {

      state.leftSearchSidebar = on;
    },
    setProfileRightSidebar (state: State, profileRightSidebar: boolean) {
      state.profileRightSidebar = profileRightSidebar;
    },
    mapLoaded(state: State, loaded: boolean) {
      state.mapLoaded = loaded;
    },
    mapSize(state: State, size: string) {
      state.map_size = size;
    },
    loadingSearchResults(state: State, v: boolean) {
      state.loadingSearchResults = v;
    },
    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  }
};


const { commit, read, dispatch } =
  getStoreAccessors<State, any>("globalStates_");

const getters = globalStates_.getters;
export const getSidebar = read(getters.sidebar);
export const getLoadingButton = read(getters.loadingButton);
export const getOverviewList = read(getters.showOverviewList);
export const getRightSidebar = read(getters.showRightSidebar);
export const getTransparencySidebar = read(getters.showRightSidebarTransparency);
export const getMapRightSidebar = read(getters.showMapRightSidebar);
export const getSearchSideBar = read(getters.isSearchSidebarOpened);
export const getSearchMap = read(getters.showSearchMap);
export const mapLoaded = read(getters.mapLoaded);
export const getProfileRightSidebar = read(getters.profileRightSidebar);
export const getMapSize = read(getters.mapSize);
export const loadingSearchResults = read(getters.loadingSearchResults);

const mutations = globalStates_.mutations;
export const commitSetSidebar = commit(mutations.setSidebar);
export const commitSetLoadingButton = commit(mutations.setLoadingButton);
export const commitSetShowLock = commit(mutations.setShowLock);
export const commitShowOverviewList = commit(mutations.setOverviewList);
export const commitShowRightSidebar = commit(mutations.setRightSidebar);
export const commitShowRightSidebarTransparency = commit(mutations.setRightSidebarTransparency);
export const commitShowMapRightSidebar = commit(mutations.setMapRightSidebar);
export const commitSetSearchSidebar = commit(mutations.setSearchSidebar);
export const commitShowSearchMap = commit(mutations.setSearchMap);
export const commitMapLoaded = commit(mutations.mapLoaded);
export const commitProfileRightSidebar = commit(mutations.setProfileRightSidebar);
export const commitResetState = commit(mutations.resetState);
export const updateMapSize = commit(mutations.mapSize);
export const updateLoadingSearchResults = commit(mutations.loadingSearchResults);
