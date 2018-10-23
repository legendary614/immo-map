import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import store from "../../../../store";

import mapItem from "./mapItem.vue";

@Component({
  mixins: [mapItem]
})

export default class MapItem extends Vue {

    @Prop({default: null})
    ad: any;

    @Prop()
    selectedIndex: number;

    @Prop()
    index: number;

    addToFav: boolean = false;

    shortenTitle(title: string) {
      if (title != undefined) {
        if (title.length >= 60) {
          return title.substring(0, 60) + "...";
        } else {
          return title;
        }
      }
    }

}
