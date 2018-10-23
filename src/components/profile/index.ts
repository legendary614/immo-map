import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import store from "../../store";
import VueTimeago from "vue-timeago";
import template from "./template.vue";
import autocomplete from "../address_autocomplete";
import {
  IUserModel, UserModel, UserPrimaryInfo, Address, ContactInfo, UserAdminInfo, $geo
} from "@immosparrow/cockpit-api-v2";
import { StreetSpecific } from "../../models";
import * as userProfile from "./../../store/modules/userProfile";
import * as user from "./../../store/modules/user_";
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
  name: "ProfileComponent",
  mixins: [template],
  components: {
    "autocomplete": autocomplete
  }
})
export default class ProfileComponent extends Base {

  @Prop({default: new UserModel})
  user_profile: IUserModel;

  @Prop({default: false})
  addUser: Boolean;

  @Prop({default: false})
  userProfile: Boolean;

  chartData: any = [{
    name: "User Sign Ins",
    data: {
      "July": 10,
      "8. July": 3,
      "15. July": 5,
      "22. July": 2
    }
  }];

  tabsProfile: object = {
    "showProfile": false,
    "showPassword": false,
    "showSignIns": false,
    "showAgencies": false
  };

  user: IUserModel = new UserModel();

  options: Array<Object> = [];
  email: string = "";
  company: string = "";

  city: Object = {};
  city_id: string = "";
  city_selected: Object = {};

  street: api.GeoSuggestion = new api.GeoSuggestion();
  street_selected: Object = {};
  street_id: string = "";

  first_name: string = "";
  last_name: string = "";
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

  selected_lang: OptionModel = {
    value: -1,
    text: "Language"
  };
  selected_sal: OptionModel = {
    value: -1,
    text: "Salutation"
  };
  selected_country: OptionModel = {
    value: 0,
    text: "Country"
  };

  salutations: Array<OptionModel> = [
    {value: -1, text: "Salutation"},
    {value: 0, text: "Mr"},
    {value: 1, text: "Ms"},
    {value: 2, text: "Mss"}
  ];
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

  password: string = "";
  newPassword: string = "";
  currentPassword: string = "";
  passwordOk: boolean = false;
  searchUrlSpecific: string = "https://geoapi.azurewebsites.net/api/geocoder/";
  searchUrl: string = "https://geoapi.azurewebsites.net/api/GeoSuggestion/Suggest";

  searchResult: StreetSpecific;

  showIdentity: boolean = false;
  showContactInfo: boolean = false;

  loadingBar: boolean = false;

  created() {
    if (this.user_profile.address === undefined) {
      this.user_profile.address = Address.fromJS(undefined);
    } else {
      this.selected_country = this.countries.filter(country => {
        if (this.user_profile.address.countryCode === country.text) {
          return country;
        }
      })[0];
    }
    if (this.user_profile.contactInfo === undefined) {
      this.user_profile.contactInfo = ContactInfo.fromJS(undefined);
    }
    if (this.user_profile.primaryInfo === undefined) {
      this.user_profile.primaryInfo = UserPrimaryInfo.fromJS(undefined);
    }
    this.selected_sal = this.salutations.filter(sal => {
      if (this.user_profile.primaryInfo.salutation === sal.text) {
        return sal;
      }
    })[0];
    emailsDB = user.getUsers(store).items.map((user: any) => {
      return user.email;
    });
    if (this.user_profile.adminInfo === undefined) {
      this.user_profile.adminInfo = UserAdminInfo.fromJS(undefined);
    }
    /* if (this.user_profile.settings === undefined) {
      this.user_profile.settings = UserSettings.fromJS(undefined);
      this.user_profile.settings.ui = UserUISettings.fromJS(undefined);
      // this.user_profile.settings.ui.languageCode = UserUISettings.fromJS(undefined);
    }

    this.selected_lang = this.languages.filter(lang => {
      if (this.user.settings.ui.languageCode === lang.text) {
        return lang;
      }
    })[0];
    */

    this.user = this.user_profile;
    this.tabsProfile["showProfile"] = true;
  }

  get userComputed (): IUserModel {
    return this.user;
  }

  updateOrCreate(form: string) {

    let self = this;
    globalState.commitSetLoadingButton(store, true);

    if (this.addUser) {
      this.$validator.validateAll(form).then((result) => {
        if (result) {
          emailsDB.push(this.user.email);
          this.user.password = this.password;
          this.user.enabled = true;
          user.dispatchCreateUser(store, this.user)
          .then(() => {
            globalState.commitSetLoadingButton(store, false);
            Vue.prototype.$notify({
              group: "actions",
              type: "success",
              duration: 2500,
              text: "User was created"
            });
            this.$emit("loadUsers");
            this.$emit("closeNewUser");

            this.user = new UserModel();

          })
          .catch(err => {
            globalState.commitSetLoadingButton(store, false);
            // context.commit("setLoadingButton", false);
            if (err.status === 401) {
              globalState.commitSetShowLock(store, true);
              // context.commit("setShowLock", true);
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
                text: "User was not created successfully"
              });
            }
          });
        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    } else if (this.userProfile) {

      this.$validator.validateAll(form).then((result) => {
        if (result) {

          // userProfile.dispatchUpdateUserProfile(store, this.user);

        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    } else {
      this.$validator.validateAll(form).then((result) => {
        if (result) {

          user.dispatchUpdateUser(store, { id: this.user["uniqueIdentifier"], data: this.user }).then(() => {
            self.$emit("searchFor");
          });

        } else {
          globalState.commitSetLoadingButton(store, false);
        }
      });
    }
  }

  update_password(form: string) {

    globalState.commitSetLoadingButton(store, true);

    if (this.userProfile) {
      this.$validator.validateAll(form).then((result) => {
        if (result) {
          userProfile.dispatchUpdateUserProfilePassword(this.$store, {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword
          });
        }
      });
    } else {
      this.$validator.validateAll(form).then((result) => {
        if (result) {
          let data = {
            id: this.user["uniqueIdentifier"],
            password: this.newPassword
          };
          // user.dispatchUpdatePassword(store, data);
        }
      });
    }
  }

  setStreet(data: api.GeoSuggestion) {

    this.street = data;
    this.street_id = this.street.uniqueIdentifier;
    this.street_selected = this.street.name;

    this.$refs.autocomplete_profile.model = data.name;
    this.$refs.autocomplete_profile.options = [];

    if (this.street.uniqueIdentifier != "") {
      $geo.getAddress(this.street.uniqueIdentifier).then((res: any) => {
        this.user.address.street = res.street;
        this.user.address.locality = res.locality;
        this.user.address.zip = res.zip;
        this.user.address.streetNumber = res.streetNumber;
        this.user.address.countryCode = res.countryCode;
        this.$forceUpdate();
      });
    }
  }

  @Watch("user_profile")
  uu(val: any) {
    this.user = val;
  }
  @Watch("currentPassword")
  onPasswordChanged(val: string, oldVal: string) {
    this.passwordOk = true;
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

  }
}
