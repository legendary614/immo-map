import { Component, Watch, Prop } from "vue-property-decorator";
import { setTimeout } from "timers";
import MapComponent from "./index";

@Component({
  mixins: [],
  components: {

  }
})
export default class AgencyMapComponent extends MapComponent {

  loadMap() {

    let self = this;


    this.show_draw_tools = true;


    this.$root.$on("remove_shape_from_address", (id: string) => {

      this.removeShapeFromAddress(id);

    });

    this.$root.$on("draw_shape_from_address", (shape: any) => {

      this.drawShapeFromAddress(shape);

    });

    this.$root.$on("shape_removed", (id: string) => {

      this.removeShape(id);

    });


    self.map.on("style.load", function () {

      self.mapStyleLoaded = true;

      self.redrawLayersFromAddress();

    });


    setTimeout(function () {
      // self.$root.$emit("map_change_size", "big");
    }, 200);



  }
  @Watch("mapLoaded")
  ml() {
    if (this.mapLoaded) {
      this.loadMap();
    }
  }

}
