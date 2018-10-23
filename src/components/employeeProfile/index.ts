import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import store from "../../store";
import VueTimeago from "vue-timeago";
import template from "./template.vue";
import autocomplete from "../address_autocomplete";
import * as agencyModule from "../../store/modules/agencies";
import * as employeeModule from "../../store/modules/employees";
import {
  EmployeeModel,
  IEmployeeModel,
  ISearchResult,
  Address,
  ContactInfo,
  IEmployeeLightModel,
  EmployeePrimaryInfo,
  $geo
} from "@immosparrow/cockpit-api-v2";
import { StreetSpecific } from "../../models";
import * as globalState from "./../../store/modules/globalStates_";
import Base from "./../base";
import { Validator } from "vee-validate";
import Debounce from "debounce-decorator";
import * as api from "@immosparrow/cockpit-api-v2";
Vue.use(VueTimeago, {
  name: "timeago", // component name, `timeago` by default
  locale: "en-US",
  locales: {
    // you will need json-loader in webpack 1
    "en-US": require("vue-timeago/locales/en-US.json")
  }
});

let emailsDB: any = [];

export interface StreetModel {
  Name: string;
  UniqueIdentifier: string;
}

export interface OptionModel {
  value: Number;
  text: string;
}

const isUnique = (value: any) => new Promise((resolve) => {
  setTimeout(() => {
    if (emailsDB.indexOf(value) === -1) {
      return resolve({
        valid: true
      });
    }

    return resolve({
      valid: false,
      data: {
        message: `${value} is already taken.`
      }
    });
  }, 200);
});

Validator.extend("unique", {
  validate: isUnique,
  getMessage: (field: any, params: any, data: any) => data.message
});

@Component({
  name: "EmployeeProfile",
  mixins: [template],
  components: {
    "autocomplete": autocomplete
  }
})
export default class EmployeeProfile extends Base {

  @Prop({default: new EmployeeModel})
  employee_profile: EmployeeModel;

  @Prop({default: false})
  addEmployee: Boolean;

  @Prop({default: false})
  employeeProfile: Boolean;

  employees: ISearchResult<IEmployeeLightModel> =  null;

  tabsProfile: object = {
    "showProfile": false
  };
  showIdentity: boolean = false;
  showContactInfo: boolean = false;

  employee: EmployeeModel = new EmployeeModel();

  options: Array<Object> = [];
  city: Object = {};
  city_id: string = "";
  city_selected: Object = {};

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

  selectedCountry: OptionModel = {
    value: 0,
    text: "Country"
  };
  selectedSal: OptionModel = {
    value: -1,
    text: "Salutation"
  };
  countries: Array<OptionModel> = [
    {value: 0, text: "Country"},
    {value: 1, text: "CH"}
  ];
  salutations: Array<OptionModel> = [
    {value: -1, text: "Salutation"},
    {value: 0, text: "Mr"},
    {value: 1, text: "Ms"},
    {value: 2, text: "Mss"}
  ];

  loadingBar: boolean = false;
  loaded: boolean = false;

  created() {
    this.loadEmployeeDetails(this.employee_profile);
    this.tabsProfile["showProfile"] = true;
  }

  get employeeComputed (): IEmployeeModel {
    return this.employee;
  }

  setStreet(data: api.GeoSuggestion) {

    this.street = data;
    this.streetId = this.street.uniqueIdentifier;
    this.streetSelected = this.street.name;

    this.$refs.autocomplete_profile.model = data.name;
    this.$refs.autocomplete_profile.options = [];

    if ( this.street.uniqueIdentifier != "") {
      $geo.getAddress(this.street.uniqueIdentifier)
      .then( (res) => {
        this.employee.address.street = res.street;
        this.employee.address.locality = res.locality;
        this.employee.address.zip = res.zip;
        this.employee.address.streetNumber = res.streetNumber;
        this.employee.address.countryCode = res.countryCode;
        this.$forceUpdate();
      }).catch(e => {
      });
    }
  }

  @Watch("employee_profile")
  loadEmployeeDetails(val: any) {
    this.loaded = false;
    this.employee = val;
    if (this.employee.address === undefined) {
      this.employee.address = Address.fromJS(undefined);
    } else {
      this.selectedCountry = this.countries.filter(country => {
        if (this.employee.address.countryCode === country.text) {
          return country;
        }
      })[0];
    }
    if (this.employee.contactInfo === undefined) {
      this.employee.contactInfo = ContactInfo.fromJS(undefined);
    }
    if (this.employee.primaryInfo === undefined) {
      this.employee.primaryInfo = EmployeePrimaryInfo.fromJS(undefined);
    }
    this.selectedSal = this.salutations.filter(sal => {
      if (this.employee.primaryInfo.salutation === sal.text) {
        return sal;
      }
    })[0];
    this.loaded = true;
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
    model.includeTypes = [70]; // should be included
    // model.excludeTypes = [];
    model.maxItemCount = 6;

    const suggestion: SuggestionClient = new SuggestionClient();
    const results: GeoSuggestionResult = await suggestion.getUniversalSearchSuggestions(model);

    // console.log(results.items)
    this.autocomplete_options = results.items;
    this.$parent.$refs["autocomplete_profile"]["options"] = results.items;
    this.$parent.$refs["autocomplete_profile"]["loading_data"] = false;*/
  }

  updateOrCreate(form: string) {

    let self = this;
    globalState.commitSetLoadingButton(store, true);

    if (this.addEmployee) {
      this.$validator.validateAll(form).then((result) => {
        if (result) {
          // emailsDB.push(this.user.email);
          this.employee.enabled = true;
          let emp = {
              data: this.employee,
              agencyId: agencyModule.getAgency(store).id
          };
          employeeModule.dispatchCreateEmployee(store, emp)
          .then(() => {
            globalState.commitSetLoadingButton(store, false);
            Vue.prototype.$notify({
              group: "actions",
              type: "success",
              duration: 2500,
              text: "Employee was created"
            });
            this.$emit("loadEmployees");
            this.$emit("closeNewEmployee");

            this.employee = new EmployeeModel();

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
                text: "Employee was not created successfully"
              });
            }
          });
        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    } else if (this.employeeProfile) {

      this.$validator.validateAll(form).then((result) => {
        if (result) {

          employeeModule.dispatchUpdateEmployee(store, this.employee);

        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    } else {
      this.$validator.validateAll(form).then((result) => {
        if (result) {

            employeeModule.dispatchUpdateEmployee(store, this.employee).then(() => {
            self.$emit("searchFor");
          });

        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    }
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
}
