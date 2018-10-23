import Vue from "vue";
import Router from "vue-router";
import store from "../store/index";

/*import {
  getToken, dispatchCheckTokenExpiration
} from "./../store/modules/auth_";*/
import * as auth from "./../store/modules/auth_";
import { commitSetSidebar, getSidebar } from "./../store/modules/globalStates_";
Vue.use(Router);

const Dashboard = () => import("../pages/dashboard/");
const Search = () => import("../pages/search/");
const Transparency = () => import("../pages/transparency/");
const Login = () => import("../pages/login/");
const Logout = () => import("../components/logout");
const Users = () => import("../pages/users/");
const Mapp = () => import("../pages/map/");
const MarketRadarAds = () => import("../pages/market_radar/ads");
const MyProfile = () => import("../pages/myProfile/");
const Inbox = () => import("../pages/inbox/");
const Agencies = () => import("../pages/agencies/");
const Workspaces = () => import("../pages/workspaces/");
const Employees = () => import("../pages/employees/");
const Register = () => import("../pages/register/");

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        plainLayout: true
      }
    },
    {
      path: "/logout",
      name: "Logout",
      component: Logout,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: {
        plainLayout: true,
        requiresAuth: false
      }
    },
    {
      path: "/users",
      name: "Users",
      component: Users,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/agencies",
      name: "Agencies",
      component: Agencies,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/workspaces",
      name: "Workspaces",
      component: Workspaces,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/employees",
      name: "Employees",
      component: Employees,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/profile",
      name: "Profile",
      component: MyProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/map",
      name: "Map",
      component: Mapp,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/search",
      name: "Search",
      component: Search,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/transparency",
      name: "Transparency",
      component: Transparency,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/market-radar/ads",
      name: "Market radar ads",
      component: MarketRadarAds,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/inbox",
      name: "Inbox",
      component: Inbox,
      meta: {
        requiresAuth: true
      }
    }
  ],
  base: "/",
  mode: "history",
  linkActiveClass: "active"
});

router.beforeEach((to, from, next) => {

  // api.Auth.token = getToken(store);

  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (!auth.getLoggedIn(store)) {
      router.push({name: "Login"});
    } else {

      /*dispatchCheckTokenExpiration(store).then(() => {

        if (getSidebar(store)) {

          commitSetSidebar(store, false);
        }

        next();
      });*/

      if (getSidebar(store)) {

        commitSetSidebar(store, false);
      }

      next();

    }
  } else {
    if (auth.getLoggedIn(store)) {
      if (to.name === "Register") {
        next();
      } else {
        router.push({ name: "Dashboard" });
      }
    } else {
      next();
    }
    // next() // make sure to always call next()!
  }
});

export default router;
