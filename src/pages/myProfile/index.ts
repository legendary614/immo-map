import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import Profile from "../../components/profile";
import template from "./MyProfile.vue";
import * as userProfile from "./../../store/modules/userProfile";
import store from "../../store";
import * as globalState from "../../store/modules/globalStates_";
@Component({
    name: "UserProfileComponent",
    mixins: [template],
    components: {
      Profile
    }
})

export default class UserProfileComponent extends Vue {

    user: Object = {};
    loaded: boolean = false;

    created() {

      userProfile.dispatchGetUserProfile(store).then(() => {
        this.loaded = true;
        this.user = userProfile.getUserProfile(this.$store);
      });
      // this.$store.dispatch("getUserProfile")
      // this.loaded = true;
      /* this.$store.dispatch("getUserProfile")
      .then(() => {
        this.user = this.$store.getters.userProfile;
        this.loaded = true;
      }); */

      globalState.commitSetSearchSidebar(store, true);
    }
    mounted() {

    }
}
