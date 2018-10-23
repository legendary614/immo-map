import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./template.vue";
import vue_slider from "vue-slider-component";
import VueCarousel from "vue-carousel";
import VueChartkick from "vue-chartkick";
import Chart from "chart.js";
import RadialProgress from "../../../pages/transparency/radial.progress.vue";
import VueGallery  from "vue-gallery";
import * as api from "@immosparrow/cockpit-api-v2";

Vue.use(VueChartkick, {adapter: Chart});

Vue.use(VueCarousel);


@Component({
  mixins: [template],
  components: {
    "vue-slider": vue_slider,
    "radial-progress-bar": RadialProgress,
    VueGallery
  }
})
export default class RightSidebar extends Vue {

  @Prop({default: new api.PubModel()})
  item: api.PubModel;
  @Prop({default: -1})
  selectedIndex: number;

  @Prop()
  pageNum: number;

  pictures: Array<string> = [];

  completedSteps0: number = 80;
  completedSteps1: number = 45;
  completedSteps2: number = 82;
  completedSteps3: number = 25;
  index: any = null;
  fullscreenOptions: any = {
    // Defines if the gallery should open in fullscreen mode:
    fullScreen: true
  };
  totalSteps: number = 100;
  home: boolean = true;
  analitics: boolean = false;
  offset: number = 0;
  // chartData = [["Jan", 220000], ["Feb", 240000], ["Mar", 260000], ["Apr", 210000], ["May", 300000]];
  chart_data: any = {
    "2017-05-13": 2,
    "2017-05-14": 5,
    "2017-05-15": 3,
    "2017-05-16": 8,
    "2017-05-17": 6,
    "2017-05-18": 6,
    "2017-05-19": 12,
    "2017-05-20": 5,
    "2017-05-21": 5,
    "2017-05-22": 3,
    "2017-05-23": 1,
    "2017-05-24": 6,
    "2017-05-25": 1,
    "2017-05-26": 3,
    "2017-05-27": 2,
    "2017-05-28": 3,
    "2017-05-29": 2,
    "2017-05-30": 8,
    "2017-05-31": 5
  };
  slider_props =  {
    data: [
      0,
      50,
      100

      ],
    value: 50,
    width: "100%",
    tooltip: "never",
    height: 24,
    disabled: true,
    piecewise: true,
    piecewiseLabel: true,
    style: {
      "padding": "8px",
      "margin": 0,
      "margin-bottom": "40px",
      "opacity": "1"
    }

  };
  showOverview: boolean = true;
  showHistory: boolean = false;
  favorit: boolean = false;
  marketradar: boolean = false;
  transparency: boolean = false;
  inbox: boolean = false;
  verstecken: boolean = false;
  fakeMelden: boolean = false;
  show_arrow: boolean = true;

  $refs = {
    cur: VueCarousel,
    slider: vue_slider
  };

  slide_page: number = 1;

  pageChanged(e: number) {

    e = e + 1;
    this.slide_page = e * 2;
  }

  nextItem (next: boolean) {
    let nextIndex = this.selectedIndex;
    let left = false;
    if (next) {
      nextIndex++;
    } else {
      nextIndex--;
      left = true;
    }
    this.$emit("selectItem", nextIndex, true, left);
  }

  created() {
    let self = this;

    /*self.item.pictures.forEach(function (pic: api.PropertyPicture) {
      self.pictures.push(pic.resourceId);
    });*/
    // let val = 80;
    // let r = document.getElementById("circle").getAttribute("r");
    // console.log(r);
    /*let c = Math.PI * ( r * 2);

    if (val < 0) { val = 0; }
    if (val > 100) { val = 100; }

    let pct = ((100 - val) / 100) * c;
    this.offset = pct;*/
    // console.log("Index from right sidebar: " + this.selectedIndex);

    if (self.item.pictures) {
      self.item.pictures.otherPictures.forEach(function (pic: any) {
        self.pictures.push("https://axresources.azurewebsites.net/image/get/" + pic.resourceId + "/?mw=500&mh=500&q=90");
      });
    }

    this.$root.$on("hide_arrows", function () {


      self.show_arrow = false;

    });


  }

  destroyed () {
    this.$emit("closeRightSidebar");
  }
  getAddress (address: any) {
    let addr = "";
    if (address != undefined) {
      if (address.street || address.streetNumber) {
        addr = address.street + (address.streetNumber != null ? " " + address.streetNumber : "") + ", " + address.zip + " " + address.locality;
      } else if (address.zip || address.locality) {
        addr = address.zip + " " + address.locality;
      }
      if (addr.length >= 50) {
        return addr.substring(0, 50) + "...";
      } else {
        return addr;
      }
    }
  }
  showHeader(tab: number) {
    switch (tab) {
      case 0:
          this.favorit = true;
          this.marketradar = false;
          this.transparency = false;
          this.inbox = false;
          this.verstecken = false;
          this.fakeMelden = false;
          this.showOverview = false;
          this.showHistory = false;
        break;
      case 1:
        this.favorit = false;
        this.marketradar = true;
        this.transparency = false;
        this.inbox = false;
        this.verstecken = false;
        this.fakeMelden = false;
        this.showOverview = false;
        this.showHistory = false;
        break;
      case 2:
        this.favorit = false;
        this.marketradar = false;
        this.transparency = true;
        this.inbox = false;
        this.verstecken = false;
        this.fakeMelden = false;
        this.showOverview = false;
        this.showHistory = false;
        break;
      case 3:
        this.favorit = false;
        this.marketradar = false;
        this.transparency = false;
        this.inbox = true;
        this.verstecken = false;
        this.fakeMelden = false;
        this.showOverview = false;
        this.showHistory = false;
        break;
      case 4:
        this.favorit = false;
        this.marketradar = false;
        this.transparency = false;
        this.inbox = false;
        this.verstecken = true;
        this.fakeMelden = false;
        this.showOverview = false;
        this.showHistory = false;
        break;
      case 5:
        this.favorit = false;
        this.marketradar = false;
        this.transparency = false;
        this.inbox = false;
        this.verstecken = false;
        this.fakeMelden = true;
        this.showOverview = false;
        this.showHistory = false;
        break;
      case 6:
        this.favorit = false;
        this.marketradar = false;
        this.transparency = false;
        this.inbox = false;
        this.verstecken = false;
        this.fakeMelden = false;
        this.showOverview = true;
        this.showHistory = false;
        break;
      case 7:
        this.favorit = false;
        this.marketradar = false;
        this.transparency = false;
        this.inbox = false;
        this.verstecken = false;
        this.fakeMelden = false;
        this.showOverview = false;
        this.showHistory = true;
        break;
      default:
        this.favorit = false;
        this.marketradar = false;
        this.transparency = false;
        this.inbox = false;
        this.verstecken = false;
        this.fakeMelden = false;
        this.showOverview = true;
        this.showHistory = false;
        break;
    }
  }
}
