import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import store from "../../store";
import template from "./template.vue";
import * as agencyModule from "../../store/modules/agencies";
import * as workspaceModule from "../../store/modules/workspaces";
import * as employeeModule from "../../store/modules/employees";
import {
  ISearchResult,
  IWorkspaceLightModel,
  WorkspaceModel,
  IWorkspaceEmployeeModel,
  IWorkspaceModel,
  EmployeeModel,
  EmployeeRole,
  GeoAreaSet, GeoShape, GeoAddressPart, GeoAddressPartType
} from "@immosparrow/cockpit-api-v2";
import * as globalState from "./../../store/modules/globalStates_";
import Base from "./../base";
import Debounce from "debounce-decorator";
import * as api from "@immosparrow/cockpit-api-v2";

export class Role {
  value: number;
  text: string;
}

@Component({
  name: "WorkspaceProfile",
  mixins: [template]
})
export default class WorkspaceProfile extends Base {

  @Prop({default: new WorkspaceModel})
  workspace_profile: WorkspaceModel;

  @Prop({default: false})
  addWorkspace: Boolean;

  @Prop({default: false})
  workspaceProfile: Boolean;

  workspaces: ISearchResult<IWorkspaceLightModel> =  null;
  employees: IWorkspaceEmployeeModel[] =  [];
  allEmployees: ISearchResult<IWorkspaceLightModel> =  null;
  selectedEmployee: any =  null;

  roles: Array<Role> = [
    {
      value: 1,
      text: "Admin"
    },
    {
      value: 2,
      text: "Manager"
    }
  ];
  selectedRole: Role = null;

  tabsProfile: object = {
    "showProperties": false,
    "showEmployees": false
  };
  showIdentity: boolean = false;
  showRegion: boolean = false;

  workspace: IWorkspaceModel = new WorkspaceModel();

  error: boolean = false;
  loading: boolean = false;

  loadingBar: boolean = false;
  loaded: boolean = false;

  selectedSearchSuggestionsStrings: Array<string> = [];
  selectedSearchSuggestions: Array<api.GeoSuggestion> = [];
  colorsUsed: Array<string> = [];
  shapes: Array<any> = [];
  showSearchAreasInit: boolean = false;
  showSearchAreas: boolean = false;
  map_is_loaded: boolean = false;
  created() {
    this.loadWorkspaceDetails(this.workspace_profile);
    this.tabsProfile["showProperties"] = true;

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

  get workspaceComputed (): IWorkspaceModel {
    return this.workspace;
  }

  @Watch("workspace_profile")
  loadWorkspaceDetails(val: any) {
    this.loaded = false;
    this.workspace = val;
    this.employees =  [];
    this.allEmployees = null;

    if (!this.addWorkspace) {
      let employeeData = {
        pagination: {
          page: 0,
          pageSize: 10
        },
        name: "",
        agencyId: agencyModule.getAgency(store).id,
        role: 0
      };
      let foundIt = false;
      employeeModule.dispatchGetEmployees(store, employeeData)
        .then(() => {
          let res = employeeModule.getEmployees(store);
          this.allEmployees = res;
            workspaceModule.dispatchGetWorkspaceEmployees(store, this.workspace.id)
              .then(res => {
                let worksapceEmployees = res;
                worksapceEmployees.forEach(employee => {
                  this.allEmployees.items.forEach(allEmployee => {
                    if (employee.employee.id === allEmployee.id) {
                      foundIt = true;
                    }
                  });
                  if (foundIt) {
                    this.employees.push(employee);
                    foundIt = false;
                  }
                });
                // this.employees = res;
                this.loaded = true;
              });
        });
      // if there is shapes of addresses add them to suggested models
      console.log(this.workspace.geoRestriction);
      if (this.workspace.geoRestriction != undefined) {
        if (this.workspace.geoRestriction.addressParts.length || this.workspace.geoRestriction.shapes.length) {

          this.showSearchAreas = true;
          this.showSearchAreasInit = true;

          this.shapes = [];
          this.selectedSearchSuggestions = [];

          for (let i = 0, l = this.workspace.geoRestriction.addressParts.length; i < l; i++) {

            let suggestion = new api.GeoSuggestion();
            suggestion.name = this.workspace.geoRestriction.addressParts[i].name;
            suggestion.uniqueIdentifier = this.workspace.geoRestriction.addressParts[i].id;
            suggestion.suggestionType = this.workspace.geoRestriction.addressParts[i].partType.valueOf();
            this.selectedSearchSuggestions.push(suggestion);

          }
          for (let i = 0, l = this.workspace.geoRestriction.shapes.length; i < l; i++) {

            let shape = {
              name: this.workspace.geoRestriction.shapes[i].name,
              color: this.workspace.geoRestriction.shapes[i].color,
              geom: this.workspace.geoRestriction.shapes[i].geom,
              id: Math.random().toString()
            };
            this.shapes.push(shape);
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

  updateOrCreate(form: string) {

    let self = this;
    globalState.commitSetLoadingButton(store, true);

    this.updateAgencyAreas();

    if (this.addWorkspace) {
      this.$validator.validateAll(form).then((result) => {
        if (result) {
          this.workspace.enabled = true;
          let newWorkspace = {
              data: this.workspace,
              agencyId: agencyModule.getAgency(store).id
          };
          workspaceModule.dispatchCreateWorkspace(store, newWorkspace)
          .then(() => {
            globalState.commitSetLoadingButton(store, false);
            Vue.prototype.$notify({
              group: "actions",
              type: "success",
              duration: 2500,
              text: "Workspace was created"
            });
            this.$emit("loadWorkspaces");
            this.$emit("closeNewWorkspace");

            this.workspace = new WorkspaceModel();

          })
          .catch(err => {
            globalState.commitSetLoadingButton(store, false);
            if (err.status === 401) {
              globalState.commitSetShowLock(store, true);
            } else {
              Vue.prototype.$notify({
                group: "actions",
                type: "error",
                duration: 2500,
                text: "Workspace was not created successfully"
              });
            }
          });
        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    } else if (this.workspaceProfile) {


      this.$validator.validateAll(form).then((result) => {
        if (result) {

          workspaceModule.dispatchUpdateWorkspace(store, this.workspace);

        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    } else {
      this.$validator.validateAll(form).then((result) => {
        console.log(this.workspace);
        if (result) {

            workspaceModule.dispatchUpdateWorkspace(store, this.workspace).then(() => {
            self.$emit("searchFor");
          });

        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    }
  }
  redirectToEmployee (employee: IWorkspaceEmployeeModel) {
    employeeModule.dispatchGetEmployee(store, employee.employee.id)
    .then(() => {
      this.$router.push( {name: "Employees" });
    });
  }

  addEmployee () {
    globalState.commitSetLoadingButton(store, true);

    let employeeData = {
      workspaceId: this.workspace.id,
      employeeIdOrEntity: this.selectedEmployee.id,
      role: this.selectedRole.value,
      enabled: this.selectedEmployee.enabled
    };
    workspaceModule.dispatchSetEmployee(store, employeeData)
      .then(() => {
        Vue.prototype.$notify({
          group: "actions",
          type: "success",
          duration: 2500,
          text: "Employee successfully assigned to this workspace"
        });
        globalState.commitSetLoadingButton(store, false);
        this.loadWorkspaceDetails(this.workspace_profile);
      });
  }

  removeEmployee (employeeId: string) {
    this.loading = true;
    let employeeData = {
      workspaceId: this.workspace.id,
      employeeIdOrEntity: employeeId
    };
    workspaceModule.dispatchRemoveEmployee(store, employeeData)
      .then(() => {
        Vue.prototype.$notify({
          group: "actions",
          type: "success",
          duration: 2500,
          text: "Employee successfully removed from workspace"
        });
        this.loading = false;
        this.loadWorkspaceDetails(this.workspace_profile);
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
  }

  addAreas() {
    this.$parent.$emit("showSearchAreas", true);
    this.showSearchAreas = true;
  }

  openMapAndDraw() {
    if (this.workspace.geoRestriction != undefined) {
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
    this.workspace.geoRestriction = new GeoAreaSet();
    this.workspace.geoRestriction.addressParts = [];
    this.workspace.geoRestriction.shapes = [];

    for (let i = 0, l = shapes.length; i < l; i++) {

      this.workspace.geoRestriction.shapes.push( new GeoShape({
        name: shapes[i].name,
        color: shapes[i].color,
        geom: shapes[i].geom
      }));
    }

    for (let i = 0, l = areas.length; i < l; i++) {

      this.workspace.geoRestriction.addressParts.push( new GeoAddressPart({
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
