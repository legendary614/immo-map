import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "../../store";
import template from "./template.vue";
import * as auth from "../../store/modules/auth_";

@Component({
  mixins: [template],
})
export default class Logout extends Vue {

  created () {
    auth.dispatchLogout(store);
  }

}
