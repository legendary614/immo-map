import { Component } from "vue-property-decorator";
import template from "./template.vue";
import BaseComponent from "../../base";

@Component({
  mixins: [template],
})
export default class Navigation extends BaseComponent {

}
