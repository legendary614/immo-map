import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./Login.vue";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "./../../store/modules/globalStates_";
import * as auth from "./../../store/modules/auth_";

@Component({
  mixins: [template],
})

export default class Login extends Vue {

  loginInfo: api.UserPasswordCredential = new api.UserPasswordCredential({
    email: "",
    password: "",
    persistent: false,
  });

  registerInfo: any = {
    email: "",
    password: "",
    confirmPassword: ""
  };

  loading: boolean = false;
  error: boolean = false;
  register: boolean = false;

  @Prop({default: false})
  invitationMode: boolean;

  get loginError (): boolean {
    return auth.getLoginError(store);
  }
  get hasEmail (): boolean {
    return this.loginInfo.email.length > 0;
  }
  get hasPassword (): boolean {
    return this.loginInfo.password.length > 0;
  }
  get registerHasEmail (): boolean {
    return this.registerInfo.email.length > 0;
  }
  get registerHasPassword (): boolean {
    return this.registerInfo.password.length > 0;
  }
  get registerHasConfirmPassword (): boolean {
    return this.registerInfo.confirmPassword.length > 0;
  }

  created () {
    globalState.commitSetShowLock(store, false);
  }

  login () {
    let self = this;
    this.$validator.validateAll("loginForm").then((result) => {
      if (result) {
        this.loading = true;
        let self = this;
        auth.dispatchLogin(store, this.loginInfo)
        .then(() => {
          if (this.loginError) {
            this.loading = false;
          } else {
            if (this.invitationMode) {
              this.$emit("acceptInvitation");
            } else {
              setTimeout(function () {
                self.loading = false;
                self.$router.push({ name: "Dashboard" });
              }, 1500);
            }
          }
        })
        .catch((e: any) => {
          this.loading = false;
        });

      }
    });
  }

  registerUser () {
    let self = this;
    this.$validator.validateAll("registerForm").then((result) => {
      if (result) {
        this.loading = true;
        self.$emit("register", this.registerInfo.email, this.registerInfo.password);
        setTimeout(function () {
          self.loading = false;
        }, 2000);
      }
    });
  }
}
