import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./AccountLock.vue";
import * as globalState from "./../../store/modules/globalStates_";
import * as auth from "./../../store/modules/auth_";
import store from "../../store";
import * as api from "@immosparrow/cockpit-api-v2";
@Component({
    name: "AccountLockComponent",
    mixins: [template]
})

export default class AccountLockComponent extends Vue {

    password: string = "";
    loading: boolean = false;
    get loginError (): boolean {
      return auth.getLoginError(store);
    }

    created () {
      globalState.commitSetLoadingButton(store, false);
      auth.commitLoginError(store, false);
    }

    login () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let self = this;
          this.loading = true;

          try {
            let model = new api.UserPasswordCredential({
              email: auth.getLoggedInUser(store).email,
              password: this.password,
              persistent: false,
            });

            if (model.email != undefined) {
              auth.dispatchLogin(store, model).then(() => {
                setTimeout(function () {
                  self.loading = false;
                  self.$router.push(self.$route.path);
                }, 1500);
              }).catch(() => {
                this.loading = false;
              });
            } else {
              auth.dispatchLogout(store);
              this.loading = false;
            }
          } catch {
            this.loading = false;
            auth.dispatchLogout(store);
          }

        } else {
          this.loading = false;
        }
      });
    }
}
