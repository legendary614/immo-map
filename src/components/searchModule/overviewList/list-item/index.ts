import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import store from "../../../../store";
import template from "./listItem.vue";
import * as globalState from "../../../../store/modules/globalStates_";
import listMap from "../list-map";

@Component({
  mixins: [template],
  components: {
    "listMap": listMap,
  },
})
export default class ListItem extends Vue {

    @Prop({default: null})
    item: any;
  
    addToFav: boolean = false;
    showMiniMap: boolean = false;

    formatPrice(price: number) {
      return "CHF " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'") + ".-";
    }
}
