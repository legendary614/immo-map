import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import router from "../../router";
import store from "../../store";
import { ActionContext } from "vuex";
import * as globalState from "./../../store/modules/globalStates_";
import * as search_ from "./../../store/modules/search_";
import * as searchModule from "./../../store/modules/searchModule";
import * as user_ from "./../../store/modules/user_";
import * as userProfile from "./../../store/modules/userProfile";
/*import * as bookmarks from "./../../store/modules/bookmarks";
import * as history from "./../../store/modules/history";
import * as docs from "./../../store/modules/docs";*/
import * as api2 from "@immosparrow/cockpit-api-v2";

export interface Permissions {
  property: string;
}
/*export interface LoggedInModel {
  loginData: api.LoginResponseModel;
  rememberMe: boolean;
}*/
export interface RegisterModel {
  profile: api2.IUserProfileModel;
  password: string;
  proof: api2.IUserRegistrationProof;
}
class State {
  loggedIn: boolean;
  loginError: boolean;
  token?: string | undefined;
  expTime: string;
  currentTime: string;
  loggedInUser: api2.IUserProfileModel;
}
const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const state: State = {
  loggedIn: false,
  loginError: false,
  token: "",
  expTime: "",
  currentTime: "",
  loggedInUser: null
};

export const auth_ = {
  namespaced: true,

  state,
  getters: {
    loggedIn: (state: State) => {
      return state.loggedIn;
    },
    loginError: (state: State) => {
      return state.loginError;
    },
    token: (state: State) => {
      return state.token;
    },
    expTime: (state: State) => {
      return state.expTime;
    },
    currentTime: (state: State) => {
      return state.currentTime;
    },
    loggedInUser: (state: State) => {
      return state.loggedInUser;
    }
  },
  mutations: {

    whenIsLoggedIn (state: State, data: any) {

      // LoggedInModel this was a model but i could not find rmemmber me in that
      // state.token = data.loginData.token;

      // api.Auth.token = data.loginData.token;


      state.loggedIn = true;

      state.loggedInUser = data.loginData as api2.IUserProfileModel;
      /*if (state.loggedInUser.primaryInfo == undefined) {
        state.loggedInUser.primaryInfo = {
          gender: 0
        };
        a.primaryInfo.firstName = "";
        a.primaryInfo.lastName = "";
      }*/
      globalState.commitSetShowLock(store, false);

      if (!data.rememberMe) {
        let currentTime = new Date();
        let expirationTime = new Date();

        expirationTime.setMinutes(currentTime.getMinutes() + 10);
        state.currentTime = currentTime.toString();
        state.expTime = expirationTime.toString();
      }

      // bookmarks.syncDbBookmarks(store);
      // history.syncDbHistory(store);
      // docs.syncDbHistory(store);


    },
    loggedOut (state: State) {
      state.loggedIn = false;
      state.token = "";
      globalState.commitResetState(store);
      search_.commitResetState(store);
      user_.commitResetState(store);
      userProfile.commitResetState(store);
      searchModule.commitResetState(store);
      router.push("/login");
    },
    loginError (state: State, message: boolean) {
      state.loginError = message;
    },
    setCurrentTime (state: State, time: string) {
      state.currentTime = time;
    },
    setExpirationTime (state: State, time: string) {
      state.expTime = time;
    },
    setRefreshToken (state: State, token: string) {
      state.token = token;
    },
    setToken (state: State, token: string) {
      state.token = token;
    },
    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {
    async login(context: ActionContext<State, any>, data: api2.UserPasswordCredential) {

      // try {

        /*const client: api.AuthClient = new api.AuthClient();
        const res: api.LoginResponseModel = await client.logIn(new api.LoginModel({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        }));*/
        let res = api2.$anonymousUser.profile.login(data.email, data.password, data.persistent).then((value: boolean) => {
          /*commitWhenIsLoggedIn(store, {
              loginData: res, rememberMe: data.persistent
            }
          );*/

          // console.log(api2.$authUser.profile.get());
          // console.log(api2.$global.data.());
          if (value) {
            api2.$authUser.profile.get().then((profile: api2.IUserProfileModel) => {
              commitWhenIsLoggedIn(store, {
                loginData: profile,
                rememberMe: data.persistent
              });
            });
            // console.log(api2.$global.data.getSessionData());
            // console.log(api2.$global.data.getPersistentData());

            // api2.$global
            // api2.$authUser.loadPersistentData();
            /*console.log(api2.$global.data.getSessionData());
            console.log(api2.$global.data.getPersistentData());
            console.log(api2.$global.data.loadSessionData(api2.$global.data.getSessionData()));*/


          } else {
            const message = "Login error";
            dispatchLoginFailed(store, message);
            return;
          }
        });
        // commitWhenIsLoggedIn(store, {loginData: res, rememberMe: data.persistent});
      // }
      /*catch (err) {
        console.log(err);
        if (err.status === 400) {
          state.token = "";
          globalState.commitSetShowLock(store, false);
        } else {
          const message = err.message || "Login error";
          dispatchLoginFailed(store, message);
          return;
        }
      }*/
    },
    logout ({ commit }: any) {

      return new Promise((resolve, reject) => {
        commitLoggedOut(store);
        commitResetState(store);
        api2.$authUser.logout();
        resolve();
      });
    },
    async loginFailed (context: ActionContext<State, any> , message: string) {
      commitLoginError(store, true);
      // context.commit("loginError", message);
      await sleep(6000);
      commitLoginError(store, false);
      // context.commit("loginError", null);
    },
    /*async refreshToken (context: ActionContext<State, any>) {
      try {

        const client: api.AuthClient = new api.AuthClient();
        const res = await client.refreshToken();

        let token = res.token;

        commitSetRefreshToken(store, token);

        let currentTime = new Date();
        let expirationTime = new Date();

        expirationTime.setMinutes(currentTime.getMinutes() + 10);
        commitSetCurrentTime(store, currentTime.toString());
        commitSetExpirationTime(store, expirationTime.toString());

        api.auth.token = token;
        bookmarks.syncDbBookmarks(store);
        history.syncDbHistory(store);
        docs.syncDbHistory(store);
      }
      catch (err) {

        if (err.status === 401 || err.status === 500) {
          globalState.commitSetShowLock(store, true);
        }
      }
    },*/
    async register(context: ActionContext<State, any>, registerData: RegisterModel) {
      try {
        const result: api2.RegisterUserProfileResult = await api2.$anonymousUser.profile.register(registerData.profile, registerData.password, registerData.proof);
        return result;
      }
      catch (err) {
        Vue.prototype.$notify({
          group: "actions",
          type: "error",
          duration: 2500,
          text: "Error while trying to register a user"
        });
      }
    },
    /*checkTokenExpiration (context: ActionContext<State, any>) {
      let time = new Date();
      commitSetCurrentTime(store, time.toString());

      if (getExpTime(store) != null && (getCurrentTime(store) > getExpTime(store))) {

        // globalState.commitSetShowLock(store, true);
        dispatchRefreshToken(store);
        // TODO: Popup for logout - your session has expired, please login again


      }
    },*/

  }
};


const { commit, read, dispatch } =
  getStoreAccessors<State, any>("auth_");


const mutations = auth_.mutations;
export const commitWhenIsLoggedIn = commit(mutations.whenIsLoggedIn);
export const commitLoggedOut = commit(mutations.loggedOut);
export const commitLoginError = commit(mutations.loginError);
export const commitSetCurrentTime = commit(mutations.setCurrentTime);
export const commitSetExpirationTime = commit(mutations.setExpirationTime);
// export const commitSetRefreshToken = commit(mutations.setRefreshToken);
export const commitSetToken = commit(mutations.setToken);
export const commitResetState = commit(mutations.resetState);

const actions = auth_.actions;
export const dispatchLogin = dispatch(actions.login);
// export const dispatchRefreshToken = dispatch(actions.refreshToken);
// export const dispatchCheckTokenExpiration = dispatch(actions.checkTokenExpiration);
export const dispatchLogout = dispatch(actions.logout);
export const dispatchLoginFailed = dispatch(actions.loginFailed);
export const dispatchRegisterUser = dispatch(actions.register);

const getters = auth_.getters;
export const getLoggedIn = read(getters.loggedIn);
export const getLoginError = read(getters.loginError);
export const getLoggedInUser = read(getters.loggedInUser);
export const getToken = read(getters.token);
// export const getExpTime = read(getters.expTime);
// export const getCurrentTime = read(getters.currentTime);
