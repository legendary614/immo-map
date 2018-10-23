import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./template.vue";
import store from "../../store";
import Left from "./../../components/lead/left";
// import Right from "./../../components/lead/right";
import OverviewList from "../../components/searchModule/overviewList/";
import BaseComponent from "../../components/base";
import * as globalState from "../../store/modules/globalStates_";
@Component({
  mixins: [template],
  components: {
    Left,
    OverviewList,
  }
})
export default class Inbox extends BaseComponent {

  showLeads: boolean = false;

  created () {

    let self = this;
    this.$root.$on("show_leads", function (data: boolean) {
      self.showLeads = data;

      let searchSidebar =  document.querySelector("#side-overlay");
      searchSidebar.classList.remove("active");
      globalState.commitSetSearchSidebar(self.$store, false);


    });

    globalState.commitSetSearchSidebar(store, true);
  }

}
