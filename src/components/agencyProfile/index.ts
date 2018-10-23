import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import store from "../../store";
import template from "./template.vue";
import autocomplete from "../address_autocomplete";
import * as agencyModule from "../../store/modules/agencies";
import * as workspaceModule from "../../store/modules/workspaces";
import * as employeeModule from "../../store/modules/employees";
import * as invitationModule from "../../store/modules/invitations";
import * as auth from "../../store/modules/auth_";
import {
  AgencyModel,
  IAgencyModel,
  ISearchResult,
  IWorkspaceLightModel,
  Address,
  ContactInfo,
  WorkspaceModel,
  IEmployeeLightModel,
  AgencyPrimaryInfo,
  EmployeeModel,
  IInvitationRequest,
  InvitationRequest,
  GeoAddressPartType,
  GeoAddressPart, GeoAreaSet, GeoShape, $geo
} from "@immosparrow/cockpit-api-v2";
import * as api from "@immosparrow/cockpit-api-v2";
import * as globalState from "./../../store/modules/globalStates_";
import Base from "./../base";
import Debounce from "debounce-decorator";
import AgencyMapComponent from "./../map/agency";

export interface OptionModel {
  value: Number;
  text: string;
}
@Component({
  name: "AgencyProfile",
  mixins: [template],
  components: {
    "autocomplete": autocomplete,
    AgencyMapComponent
  }
})
export default class AgencyProfile extends Base {

  @Prop({default: new AgencyModel})
  agency_profile: AgencyModel;

  @Prop({default: false})
  addAgency: Boolean;

  @Prop({default: false})
  agencyProfile: Boolean;

  workspaces: ISearchResult<IWorkspaceLightModel> =  null;
  employees: ISearchResult<IEmployeeLightModel> =  null;

  invitation: IInvitationRequest = new InvitationRequest();
  ownerEmail: string = "";

  tabsProfile: object = {
    "showProfile": false,
    "showEmployees": false,
    "showWorkspaces": false,
    "showGeo": false,
  };
  showContacts: boolean = false;
  showIdentity: boolean = false;
  showOwner: boolean = false;
  showFeatures: boolean = false;
  showContactInfo: boolean = false;
  showSearchAreas: boolean = false;
  agency: AgencyModel = new AgencyModel();
  options: Array<Object> = [];
  street: api.GeoSuggestion = new api.GeoSuggestion();
  streetSelected: Object = {};
  streetId: string = "";
  phone: string = "";
  cell: string = "";
  fax: string = "";
  website: string = "";
  postcode: string = "";
  name: string = "";
  addressName: string = "";
  cityName: string = "";
  lang: string = "";
  error: boolean = false;
  loading: boolean = false;
  map_is_loaded: boolean = false;
  selectedCountry: OptionModel = {
    value: 0,
    text: "Country"
  };
  languages: Array<OptionModel> = [
    {value: -1, text: "Language"},
    {value: 0, text: "EN"},
    {value: 1, text: "DE"},
    {value: 2, text: "FR"},
    {value: 3, text: "IT"},
  ];
  countries: Array<OptionModel> = [
    {value: 0, text: "Country"},
    {value: 1, text: "CH"}
  ];
  loadingBar: boolean = false;
  loaded: boolean = false;

  sendingInvitation: boolean = false;
  selectedSearchSuggestionsStrings: Array<string> = [];
  selectedSearchSuggestions: Array<api.GeoSuggestion> = [];
  colorsUsed: Array<string> = [];
  shapes: Array<any> = [];
  showSearchAreasInit: boolean = false;

  created() {

    globalState.commitSetLoadingButton(store, false);
    this.loadAgencyDetails(this.agency_profile);
    this.tabsProfile["showProfile"] = true;

    this.$root.$on("map_is_loaded", (loaded: boolean) => {
      this.map_is_loaded = true;
    });

    this.$root.$on("shape_created", (shape: any) => {

      if (this.shapes.length) {

        let obj = this.shapes.find(function (obj) { return obj.id === shape.id; });
        if (obj != undefined) {
          obj.name = shape.name;
        } else {
          this.shapes.push(shape);
        }

      } else {
        this.shapes.push(shape);
      }
    });

    this.$root.$on("profile_is_closed", (value: boolean) => {
      this.$parent.$emit("showSearchAreas", false);
      this.showSearchAreas = false;
    });

  }

  get agencyComputed (): IAgencyModel {
    return this.agency;
  }

  setStreet(data: api.GeoSuggestion) {

    this.street = data;
    this.streetId = this.street.uniqueIdentifier;
    this.streetSelected = this.street.name;

    this.$refs.autocomplete_profile.model = data.name;
    this.$refs.autocomplete_profile.options = [];

    if (this.street.uniqueIdentifier != "") {
      $geo.getAddress(this.street.uniqueIdentifier).then((res: any) => {
        this.agency.address.street = res.street;
        this.agency.address.locality = res.locality;
        this.agency.address.zip = res.zip;
        this.agency.address.streetNumber = res.streetNumber;
        this.agency.address.countryCode = res.countryCode;
        this.$forceUpdate();
      });
    }
  }

  @Watch("agency_profile")
  loadAgencyDetails(val: any) {
    this.loaded = false;
    this.agency = val;
    if (this.agency.address === undefined) {
      this.agency.address = Address.fromJS(undefined);
    } else {
      this.selectedCountry = this.countries.filter(country => {
        if (this.agency.address.countryCode === country.text) {
          return country;
        }
      })[0];
    }
    if (this.agency.contactInfo === undefined) {
      this.agency.contactInfo = ContactInfo.fromJS(undefined);
    }
    if (this.agency.primaryInfo === undefined) {
      this.agency.primaryInfo = AgencyPrimaryInfo.fromJS(undefined);
    }
    if (!this.addAgency) {
      let data = {
        pagination: {
          page: 0,
          pageSize: 10
        },
        name: "",
        agencyId: this.agency.id
      };
      workspaceModule.dispatchGetWorkspaces(store, data).then(() => {
        let res = workspaceModule.getWorkspaces(store);
        this.workspaces = res;
        this.loaded = true;
      });
      let employeeData = {
        pagination: {
          page: 0,
          pageSize: 10
        },
        name: "",
        agencyId: this.agency.id,
        role: 0
      };
      employeeModule.dispatchGetEmployees(store, employeeData).then(() => {
        let res = employeeModule.getEmployees(store);
        this.employees = res;
        this.loaded = true;
      });
    } else {
      this.loaded = true;
    }
    // if there is shapes of addresses add them to suggested models
    if (this.agency.geoRestriction != undefined) {
      if (this.agency.geoRestriction.addressParts || this.agency.geoRestriction.shapes) {

        this.showSearchAreas = true;
        this.showSearchAreasInit = true;

        this.shapes = [];
        this.selectedSearchSuggestions = [];

        if (this.agency.geoRestriction.addressParts) {
          for (let i = 0, l = this.agency.geoRestriction.addressParts.length; i < l; i++) {

            let suggestion = new api.GeoSuggestion();
            suggestion.name = this.agency.geoRestriction.addressParts[i].name;
            suggestion.uniqueIdentifier = this.agency.geoRestriction.addressParts[i].id;
            suggestion.suggestionType = this.agency.geoRestriction.addressParts[i].partType.valueOf();
            this.selectedSearchSuggestions.push(suggestion);

          }
        }
        if (this.agency.geoRestriction.shapes) {
          for (let i = 0, l = this.agency.geoRestriction.shapes.length; i < l; i++) {

            let shape = {
              name: this.agency.geoRestriction.shapes[i].name,
              color: this.agency.geoRestriction.shapes[i].color,
              geom: this.agency.geoRestriction.shapes[i].geom,
              id: Math.random().toString()
            };
            this.shapes.push(shape);
          }
        }
      }
    } else {
      this.shapes = [];
      this.selectedSearchSuggestions = [];
      this.showSearchAreas = false;
      this.showSearchAreasInit = false;
    }

    let self = this;
    setTimeout(function () {
      self.$refs.autocomplete_geo.$refs["search_element"].onfocus = function () {
        self.openMapAndDraw();
      };
    }, 500);

  }

  @Debounce(250)
  async getSearchSuggestions () {

    const results = await api.$geo.findSuggestions({
      text: this.$parent.$refs["autocomplete_profile"]["model"],
      includeGeom: true,
      suggestionTypes: [70],
      maxItemCount: 6
    });

    console.log(results);
    this.autocomplete_options = results;
    this.$parent.$refs["autocomplete_profile"]["options"] = results;
    this.$parent.$refs["autocomplete_profile"]["loading_data"] = false;


    /*let model = new GeoSuggestionQueryModel();

    model.queryText = this.$parent.$refs["autocomplete_profile"]["model"];
    model.includeTypes = [70];
    model.maxItemCount = 6;

    const suggestion: SuggestionClient = new SuggestionClient();
    const results: GeoSuggestionResult = await suggestion.getUniversalSearchSuggestions(model);

    this.autocomplete_options = results.items;
    this.$parent.$refs["autocomplete_profile"]["options"] = results.items;
    this.$parent.$refs["autocomplete_profile"]["loading_data"] = false;*/
  }

  @Debounce(250)
  async getGeoSearchSuggestions () {

    const results = await api.$geo.findSuggestions({
      text: this.$parent.$refs["autocomplete_geo"]["model"],
      includeGeom: true,
      suggestionTypes: [70],
      maxItemCount: 6
    });

    console.log(results);
    this.autocomplete_options = results;
    this.$parent.$refs["autocomplete_geo"]["options"] = results;
    this.$parent.$refs["autocomplete_geo"]["loading_data"] = false;

    /*let model = new GeoSuggestionQueryModel();

    model.queryText = this.$parent.$refs["autocomplete_geo"]["model"];
    model.includeTypes = [10, 20, 30, 40, 50];
    model.maxItemCount = 6;

    const suggestion: SuggestionClient = new SuggestionClient();
    const results: GeoSuggestionResult = await suggestion.getUniversalSearchSuggestions(model);

    this.$parent.$refs["autocomplete_geo"]["options"] = results.items;
    this.$parent.$refs["autocomplete_geo"]["loading_data"] = false;*/
  }

  addAreas() {
    this.$parent.$emit("showSearchAreas", true);
    this.showSearchAreas = true;
  }

  openMapAndDraw() {
    if (this.agency.geoRestriction != undefined) {
      this.$parent.$emit("showSearchAreas", true);
      this.showSearchAreas = true;

    }
  }

  closeAreas() {
    this.$parent.$emit("showSearchAreas", false);
    this.showSearchAreas = false;
    this.selectedSearchSuggestions = [];
    this.selectedSearchSuggestionsStrings = [];
  }

  addArea(data: api.GeoSuggestion) {

    let color = this.get_color();
    data["bg_color"] = color;

    if (this.selectedSearchSuggestionsStrings.indexOf(data.uniqueIdentifier) == -1) {

      this.selectedSearchSuggestions.push(data);
      this.selectedSearchSuggestionsStrings.push(data.uniqueIdentifier);

      this.$root.$emit("draw_shape_from_address", {
        id: data.uniqueIdentifier,
        geo: data.geom,
        name: data.name,
        color: color
      });
    }

    this.$refs.autocomplete_geo.model = "";
    this.$refs.autocomplete_geo.options = [];

  }

  updateAgencyAreas() {

    let areas = this.selectedSearchSuggestions;
    let shapes = this.shapes;
    this.agency.geoRestriction = new GeoAreaSet();
    this.agency.geoRestriction.addressParts = [];
    this.agency.geoRestriction.shapes = [];

    for (let i = 0, l = shapes.length; i < l; i++) {

      this.agency.geoRestriction.shapes.push( new GeoShape({
        name: shapes[i].name,
        color: shapes[i].color,
        geom: shapes[i].geom
      }));
    }

    for (let i = 0, l = areas.length; i < l; i++) {

      this.agency.geoRestriction.addressParts.push( new GeoAddressPart({
        id: areas[i].uniqueIdentifier,
        partType:  <GeoAddressPartType> areas[i].suggestionType.valueOf(),
        name: areas[i].name,
        color: areas[i]["bg_color"],

      }));
    }

  }

  get_color (): string {

    let color = this.new_colors()[Math.floor(Math.random() * this.new_colors().length)];

    // if colors limit reached get from another palete with Google material design colors
    if (this.colorsUsed.length == this.new_colors().length) {
      return this.get_random_color();
    }

    if (this.colorsUsed.indexOf(color) == -1) {
      this.colorsUsed.push(color);
      return color;

    } else {
      this.get_color();
    }

  }

  add_km_to_geo_object(index: number): void {

    let km = prompt("Extend search in km", "");

    if (km == null || km == "") {

      Vue.delete(this.selectedSearchSuggestions[index], "extend_by");
      return;
    }

    Vue.set(this.selectedSearchSuggestions[index], "extend_by", parseInt(km));
  }

  remove_km_from_geo_object(index: number): void {
    Vue.delete(this.selectedSearchSuggestions[index], "extend_by");
  }

  remove_address_item(index: number): void {

    this.$root.$emit("remove_shape_from_address", this.selectedSearchSuggestions[index].uniqueIdentifier);
    this.selectedSearchSuggestionsStrings.splice(this.selectedSearchSuggestionsStrings.indexOf(this.selectedSearchSuggestions[index].uniqueIdentifier), 1);
    this.selectedSearchSuggestions.splice(index, 1);


  }

  remove_shape(id: string, index: number): void {
    this.$root.$emit("shape_removed", id);
    this.shapes.splice(index, 1);

  }

  stc(color: string): object {
    return {
      "background-color": color + " !important"
    };
  }
  closeNewAgency () {
    this.$emit("closeNewAgency");
  }
  updateOrCreate(form: string) {

    let self = this;
    globalState.commitSetLoadingButton(store, true);

    // update search areas
    this.updateAgencyAreas();

    if (this.addAgency) {
      this.$validator.validateAll(form).then((result) => {
        if (result) {
          this.agency.enabled = true;
          agencyModule.dispatchCreateAgency(store, this.agency)
          .then(() => {
            globalState.commitSetLoadingButton(store, false);
            Vue.prototype.$notify({
              group: "actions",
              type: "success",
              duration: 2500,
              text: "Agency was created"
            });
            this.$emit("loadAgencies");
            this.$emit("closeNewAgency");

            this.agency = new AgencyModel();

          })
          .catch(err => {
            globalState.commitSetLoadingButton(store, false);
            if (err.status === 401) {
              globalState.commitSetShowLock(store, true);
            } else if (err.status === 409) {
              Vue.prototype.$notify({
                group: "actions",
                type: "error",
                duration: 2500,
                text: "Email is already taken, please try with another one"
              });
            } else {
              Vue.prototype.$notify({
                group: "actions",
                type: "error",
                duration: 2500,
                text: "Agency was not created successfully"
              });
            }
          });
        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    } else if (this.agencyProfile) {

      this.$validator.validateAll(form).then((result) => {
        if (result) {

          agencyModule.dispatchUpdateAgency(store, this.agency);

        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    } else {
      this.$validator.validateAll(form).then((result) => {
        if (result) {

          agencyModule.dispatchUpdateAgency(store, this.agency).then(() => {
            self.$emit("searchFor");
          });

        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    }
  }

  redirectToWorkspace (workspace: WorkspaceModel) {
    workspaceModule.dispatchGetWorkspace(store, workspace.id).then(res => {
      this.$router.push( {name: "Workspaces" });
    });
  }

  redirectToEmployee (employee: EmployeeModel) {
    employeeModule.dispatchGetEmployee(store, employee.id).then(res => {
      this.$router.push( {name: "Employees" });
    });
  }

  sendInvitation () {
    this.sendingInvitation = true;
    this.invitation.senderName = auth.getLoggedInUser(store).primaryInfo.firstName + " " + auth.getLoggedInUser(store).primaryInfo.lastName;
    let invitation = {
      invitationRequest: this.invitation,
      id: this.agency.id,
      email: this.ownerEmail
    };
    invitationModule.dispatchSendOwnerInvitation(store, invitation)
      .then(() => {
        agencyModule.dispatchGetAgency(store, this.agency.id)
          .then(() => {
            this.agency = agencyModule.getAgency(store) as AgencyModel;
            this.sendingInvitation = false;
          });
      });
  }

  cancelInvitation () {
    this.sendingInvitation = true;
    invitationModule.dispatchCancelOwnerInvitation(store, this.agency.id)
      .then(() => {
        agencyModule.dispatchGetAgency(store, this.agency.id)
          .then(() => {
            this.agency = agencyModule.getAgency(store) as AgencyModel;
            this.sendingInvitation = false;
          });
      });
  }

  getRole(role: number) {
    switch (role) {
      case 0:
      return "None";
      case 1:
      return "Admin";
      case 2:
      return "Manager";
    }
  }

  show(tab: string) {
    for (let i in this.tabsProfile) {
      if (i == tab) {
        this.tabsProfile[i] = true;
      } else {
        this.tabsProfile[i] = false;
      }
    }
  }

  @Watch("map_is_loaded")
  ml() {

    let self = this;
    if (this.agency.geoRestriction != undefined) {

      let areas = this.selectedSearchSuggestions;
      let shapes = this.shapes;

      setTimeout(function () {
        for (let i = 0, l = shapes.length; i < l; i++) {

          // console.log(shapes[i]);
          self.$root.$emit("draw_shape_from_address", {
            id: shapes[i].id,
            geo: shapes[i].geom,
            name: shapes[i].name,
            color: shapes[i].color,
            type: "poligon"
          });
        }

        for (let i = 0, l = areas.length; i < l; i++) {

          $geo.getAddress(areas[i].uniqueIdentifier).then((res) => {
            console.log(res);
          });
          /*self.$root.$emit("draw_shape_from_address", {
            id: areas[i].uniqueIdentifier,
            geo: areas[i].shape,
            name: areas[i].name,
            // color: areas[i].color
          });*/


        }
      }, 500);

    }
    // console.log(this.map_is_loaded);
  }

  @Watch("selectedSearchSuggestions")
  ff() {
    if (this.selectedSearchSuggestions.length == 0 && this.shapes.length == 0) {
      this.showSearchAreasInit = false;
    }

  }

  @Watch("shapes")
  ff1() {
    if (this.selectedSearchSuggestions.length == 0 && this.shapes.length == 0) {
      this.showSearchAreasInit = false;
    }

  }
}
