import "./polyfill";
import "./localisation";

import Vue from "vue";
import { Component } from "vue-property-decorator";

import store from "./store";
import router from "./router";
import NavHeader from "./components/layout/header/";
import Navigation from "./components/layout/navigation/";
import NavFooter from "./components/layout/footer/";
import AccountLock from "./pages/accountLock/";
import SearchSidebar from "./components/searchModule/leftSidebar/";
import * as globalStates from "./store/modules/globalStates_";

require("jquery-slim-webpack");
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);

require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../node_modules/bootstrap/dist/js/bootstrap.min.js");

require("./assets/oneui/css/oneui.css");
require("./assets/css/site.css");
require("./assets/scss/style.scss");
require("vue-multiselect/dist/vue-multiselect.min.css");
import * as api2 from "@immosparrow/cockpit-api-v2";
import select from "vue-select";

import Notifications from "vue-notification";
Vue.use(Notifications);

import VeeValidate from "vee-validate";
Vue.use(VeeValidate);

import Vuebar from "vuebar";
Vue.use(Vuebar);
import Multiselect from "vue-multiselect";
Vue.component("multiselect", Multiselect );
import Datepicker  from "vuejs-datepicker";
Vue.component("datepicker", Datepicker  );

Vue.component("vselect", select);
import VueAnalytics from "vue-analytics";
Vue.use(VueAnalytics, {
  id: "UA-115533864-1",
  autoTracking: {
    exception: false
  },
  debug: {
    enabled: false
  },
  onAnalyticsReady () {
    console.log(this);
  },
  router
});

import VTooltip from "v-tooltip";
import { VNode, VNodeDirective } from "vue/types/vnode";
Vue.use(VTooltip);

Vue.filter("sort_desc", function(data: any) {
  console.log(data);
  data.sort((date1: any, date2: any) => {
    if (date1.time > date2.time) return -1;
    if (date1.time < date2.time) return 1;
    return 0;

  });

  return data;
});

Vue.directive("close-rightSidebar", {
  inserted: function (el) {
    el.addEventListener("click", function(event) {
      // alert("S")
      globalStates.commitSetSidebar(store, !globalStates.getSidebar(store));

    });
  }
});

Vue.directive("show-multi-tag-holder", {
  inserted: function (el: HTMLElement) {
    el.addEventListener("click", function (event) {

      // el = document.getElementById(el.parentElement.id);

      let parent = el.parentElement.getElementsByClassName("multiselect__tag").item(0).parentElement;
      parent.classList.add("tags_holder");


      let multiselect__tags = parent.getElementsByClassName("multiselect__tag");

      let parentPos = parent.getBoundingClientRect();


      for (let i = 0, l = multiselect__tags.length; i < l; i++) {


        let childrenPos = multiselect__tags.item(i).getBoundingClientRect();
        if ((childrenPos.top - parentPos.top) == 54) {
          multiselect__tags.item(i).classList.add("hidden");
        }
      }



      el.parentElement.getElementsByClassName("tags_holder_helper").item(0).classList.add("show");
      el.classList.remove("show");

      el.setAttribute("dont_group_multitag", "0");

      el.parentElement.getElementsByClassName("tags_holder_helper_less").item(0).classList.remove("show");

    });
  }
});
Vue.directive("remove-multi-tag-holder", {
  inserted: function (el: HTMLElement) {
    el.addEventListener("click", function(event) {

      // el = document.getElementById(el.id);

      if (el.parentElement.getElementsByClassName("tags_holder").length) {

        let tags_holder = el.parentElement.getElementsByClassName("tags_holder").item(0);
        for (let i = 0, l = tags_holder.getElementsByClassName("multiselect__tag").length; i < l; i ++) {
          tags_holder.getElementsByClassName("multiselect__tag").item(i).classList.remove("hidden");
        }
        tags_holder.classList.remove("tags_holder");
        // tags_holder.removeAttribute("hide_from_index");
        el.classList.remove("show");

        el.setAttribute("dont_group_multitag", "1");

        el.parentElement.getElementsByClassName("tags_holder_helper_less").item(0).classList.add("show");
        el.parentElement.getElementsByClassName("tags_holder_helper").item(0).classList.remove("show");
      }

    });
  }
});
Vue.directive("hide-multiselect-elements", {

  inserted: function (el: HTMLElement) {
    el.setAttribute("dont_group_multitag", "0");
  },
  componentUpdated: function (el: HTMLElement, binding: VNodeDirective, vnode: VNode, oldVnode: VNode) {

    let clhight = el.clientHeight;

    if (clhight != parseInt(el.getAttribute("height"))) {

      let parent = el.parentElement;

      if (el.getAttribute("dont_group_multitag") == "0") {

        // let tagsLen = 0;
        if (el.clientHeight == 54) {

          if (!el.classList.contains("tags_holder")) {
            el.classList.add("tags_holder");

            let tagsLen = el.getElementsByClassName("multiselect__tag").length;

            el.setAttribute("hide_from_index", (tagsLen).toString());

          }

          if (el.getAttribute("hide_from_index")) {

            let multiselect__tags = el.getElementsByClassName("multiselect__tag");

            let parentPos = el.getBoundingClientRect();


            for (let i = 0, l = multiselect__tags.length; i < l; i++) {

              let childrenPos = multiselect__tags.item(i).getBoundingClientRect();
              if ((childrenPos.top - parentPos.top) == 54) {
                multiselect__tags.item(i).classList.add("hidden");
              }
            }

            let hidden = el.getElementsByClassName("multiselect__tag hidden").length;

            if (hidden) {
              if (!parent.getElementsByClassName("tags_holder_helper").item(0).classList.contains("show")) {
                parent.getElementsByClassName("tags_holder_helper").item(0).classList.add("show");
              }
              parent.getElementsByClassName("tags_holder_helper").item(0)
                .getElementsByTagName("span").item(0).innerHTML = hidden.toString();
            } else {
              el.parentElement.getElementsByClassName("tags_holder_helper_less").item(0).classList.remove("show");
              el.parentElement.getElementsByClassName("tags_holder_helper").item(0).classList.remove("show");
            }
          }

        }
      }

    }

  }

});

Vue.directive("show-submenu", {
  inserted: function (el) {

    el.addEventListener("click", function(event) {

      el.classList.add("open");
      el.classList.remove("open_with_delay");

    });

    el.addEventListener("mouseleave", function(event) {
      el.classList.remove("open_with_delay");
      el.classList.remove("open");
    });

    el.addEventListener("mouseenter", function(event) {

      if (!globalStates.getSearchSideBar(store)) {
        // console.log(searchSidebar);
        el.classList.remove("open");
        el.classList.add("open_with_delay");
      } else {
        el.classList.add("open");
      }

    });

  }
});

import template from "./main.vue";

@Component({
  mixins: [template],
  store,
  components: {
    NavHeader,
    Navigation,
    SearchSidebar,
    NavFooter,
    AccountLock
  },
  router,

})
class App extends Vue {

  created() {

    let apiPersistentData = localStorage.getItem("api.data");
    let apiSessionData = sessionStorage.getItem("api.data");

    if (apiPersistentData) {
      api2.$global.data.loadPersistentData(JSON.parse(apiPersistentData));
    }
    if (apiSessionData) {
      api2.$global.data.loadSessionData(JSON.parse(apiSessionData));
    }

    api2.$global.data.persistentDataChanged.add(this.persistentDataChanged);
    api2.$global.data.sessionDataChanged.add(this.sessionDataChanged);

  }
  persistentDataChanged() {
    let apiPersistentData = api2.$global.data.getPersistentData();
    if (apiPersistentData) {
      localStorage.setItem("api.data", JSON.stringify(apiPersistentData));
    }
  }
  sessionDataChanged() {
    let apiSessionData = api2.$global.data.getSessionData();
    if (apiSessionData) {
      sessionStorage.setItem("api.data", JSON.stringify(apiSessionData));
    }
  }
}

export const app = new App().$mount("#app");
