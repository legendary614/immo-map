import Vue from "vue";
import { Component } from "vue-property-decorator";
import template from "./template.vue";
import VueIntercom from "vue-intercom";
Vue.use(VueIntercom, { appId: process.env.intercom });
import * as auth from "./../../store/modules/auth_";
import store from "../../store";

@Component({
  name: "IntecomComponent",
  mixins: [template],
})

export default class IntecomComponent extends Vue {

  $intercom: any;

  mounted() {

    let user = auth.getLoggedInUser(store);

    try {
      this.$intercom.boot({
        user_id: user.id,
        name: user.primaryInfo.firstName + " " + user.primaryInfo.lastName,
        email: user.email,
      });
    } catch {}
  }
  show_intercom() {
    this.$intercom.visible ? this.$intercom.hide() : this.$intercom.show();
  }
}
