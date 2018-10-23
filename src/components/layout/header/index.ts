import { Component } from "vue-property-decorator";
import template from "./template.vue";
import Intercom from "../../intercom";
import autocomplete from "../../address_autocomplete";
import * as auth from "./../../../store/modules/auth_";
import store from "./../../../store";
import {
  commitSearchingFor, commitSearchingForMarketRadarAddress, commitSearchingForTransparency,
  dispatchSetTransparencyAddress
} from "../../../store/modules/search_";
import Base from "./../../base";
import * as api from "@immosparrow/cockpit-api-v2";
@Component({
  mixins: [template],
  components: {
    "intercom": Intercom,
    "autocomplete": autocomplete
  }
})
export default class NavHeader extends Base {

  options: Array<Object> = [];
  showSearch: boolean = false;
  $ga: any;
  user: api.IUserProfileModel;
  streetSet: boolean = false;
  agencies: Array<string> = [
    "Immo Team",
    "Engel und Volkers"
  ];

  logout () {
    auth.dispatchLogout(store).then(() => {
      this.$router.push({ name: "Login" });
    });
  }

  setStreet(data: api.GeoSuggestion) {

    if (data == undefined || data.name == undefined) {
      return;
    }

    this.streetSet = true;
    this.$refs.autocomplete.model = data.name;
    this.$refs.autocomplete.options = [];

    if (this.get_products(data.suggestionType)[0] == "transparency") {
      this.$router.push({name: "Transparency"});
      commitSearchingForTransparency(store, data);
    } else {
      commitSearchingFor(store, data);
      this.$router.push({name: "Search"});
    }

  }
  setProduct(item: api.GeoSuggestion, module: any, products: Array<string>) {

    this.$refs.autocomplete.model = item.name;
    this.$refs.autocomplete.options = [];

    switch (module) {

      case "transparency":
        dispatchSetTransparencyAddress(this.$store, item);
        this.$router.push({name: "Transparency"});
        break;

      case "market_radar":
        commitSearchingForMarketRadarAddress(this.$store, item);
        this.$router.push({name: "Market radar ads"});
        break;

      case "search":
        commitSearchingFor(store, item);
        this.$router.push({name: "Search"});
        break;

      default:
        break;
    }
  }

  created() {
    this.user = auth.getLoggedInUser(store);
    this.$ga.set("userId", this.user.id);
  }

  selectAgency (agency: string) {
  }
}
