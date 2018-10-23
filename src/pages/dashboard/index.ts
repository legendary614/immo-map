import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./Dashboard.vue";
import { dispatchLogout, getLoggedInUser } from "./../../store/modules/auth_";
import store from "./../../store";
import VueChartkick from "vue-chartkick";
import Chart from "chart.js";
Vue.use(VueChartkick, {adapter: Chart});
import BaseComponent from "../../components/base";
import * as globalState from "../../store/modules/globalStates_";
@Component({
  mixins: [template],
})
export default class Dashboard extends BaseComponent {

  chartData: object = {
    "UNKNOWN": 2312,
    "FIRMENKUNDEN": 125231,
    "VATKUNDEN": 4503,

  };

  chartData0: any = [{
    name: "Sale",
    data: {
      "MON": 15,
      "TUE": 20,
      "WED": 25,
      "THU": 30,
      "FRI": 35,
      "SAT": 20,
      "SUN": 12,
    }

  },

    {
      name: "Rent",
      data: {
        "MON": 150,
        "TUE": 200,
        "WED": 250,
        "THU": 300,
        "FRI": 100,
        "SAT": 200,
        "SUN": 120,
      }

    }
  ];

  chart_data1: any = [{
    name: "HAUS",
    data: {
      "MON": 15,
      "TUE": 20,
      "WED": 25,
      "THU": 30,
      "FRI": 35,
      "SAT": 20,
      "SUN": 12,
    }

  },

    {
      name: "WOHNUNG",
      data: {
        "MON": 150,
        "TUE": 200,
        "WED": 250,
        "THU": 300,
        "FRI": 100,
        "SAT": 200,
        "SUN": 120,
      }

    }
  ];

  get userName () {
    let user = getLoggedInUser(store);
    // return user.primaryInfo.firstName + " " + user.primaryInfo.lastName;
    return "John Doe";
  }
  created() {
    globalState.commitSetSearchSidebar(store, true);
  }
}
