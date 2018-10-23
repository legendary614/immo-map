import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./template.vue";
import _ from "lodash";


@Component({
  name: "AutocompleteComponent",
  mixins: [template],
})

export default class AutocompleteComponent extends Vue {

  @Prop()
  onSearch: Function;

  @Prop()
  setData: Function;

  @Prop()
  ref_name: string;

  @Prop()
  item_highlighted: string;

  loading_data: boolean = false;
  is_open: boolean = false;
  options: Array<Object> = [];
  item_selected: Object = null;
  currentItem: number = 0;
  model: string = "";
  module: string = "";

  $refs: {};

  load_data(event: KeyboardEvent) {

    if (event.keyCode == 27) {
      this.close_results();
      return;
    }

    if (this.options.length > 0) {

      this.item_selected = this.options[this.currentItem];

      // console.log( this.options[this.currentItem]);
      // this.$refs["search_element"].value =  this.options[this.currentItem]["name"];
      if (event.keyCode == 38 && this.currentItem >= 0) {

        this.currentItem--;
        this.model = this.options[this.currentItem]["name"];
        this.item_selected = this.options[this.currentItem];


      } else if (event.keyCode == 40 && this.currentItem <= 5) {
        this.currentItem++;
        this.model = this.options[this.currentItem]["name"];
        this.item_selected = this.options[this.currentItem];
      }
    }

    if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
      if (this.model.length >= 3) {
        this.loading_data = true;

        this.onSearch();
        this.is_open = true;

      }
    }
  }



  close_results() {
    this.is_open = false;
  }

  show_results() {
    // this.is_open = true;
    this.$refs["search_element"].focus();
  }

  open_options() {
    if (this.options.length) {
      this.is_open = true;
    }
  }

  reset_model() {
    this.is_open = false;
    this.model = "";
    this.options = [];
    this.$refs["search_element"].focus();
  }


}
