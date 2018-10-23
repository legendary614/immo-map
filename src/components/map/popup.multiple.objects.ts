import Vue from "vue";
import template from "./popup.multiple.objects_template.vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import * as api2 from "@immosparrow/cockpit-api-v2";

@Component({
  mixins: [template],
  components: {

  }
})
export default class PopupMultipleObjectsComponent extends Vue {

  @Prop()
  adsInfo: Array<api2.PubModel>;

  @Prop()
  selectAddress: Function;

  @Prop()
  uniqueIdentifier: string;

  created() {
    // console.log(this.adInfo);

  }
}
