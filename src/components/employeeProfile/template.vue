<template>
  <div class="side-content remove-padding-t">
    <div class="side-header padding-top-15" v-if="addEmployee">
      <button class="btn btn-xs btn-default close_agency" type="button"
            @click="$emit('closeNewEmployee')"
      ><i class="fa fa-close"></i>
      </button>
      <span>
      <img class="img-avatar img-avatar32" src="static/img/avatars/avatar10.jpg">
      <span class="font-w600 push-10-l">{{ employee.primaryInfo.firstName || employee.primaryInfo.lastName ? employee.primaryInfo.firstName : "New" }} {{ employee.primaryInfo.lastName || employee.primaryInfo.firstName? employee.primaryInfo.lastName : "employee" }}</span>
      </span>
    </div>
    <div class="block pull-r-l border-t">
      <ul class="nav nav-tabs nav-tabs-alt nav-justified" data-toggle="tabs">
        <li :class="{ 'active' : tabsProfile['showProfile']}">
          <a type="button" @click="show('showProfile')">Profile</a>
        </li>
      </ul>
      <div class="block-content tab-content">
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showProfile']}">

           <div class="row" v-bar>
            <div class="col-xs-12">
              <form class="form-horizontal push-10-t push-10 padding-right-10"
                        @submit.prevent="updateOrCreate('profile_form')"
                        data-vv-scope="profile_form">
                <div class="block"
                      :class="{'block-opt-hidden': showIdentity, 'block-content--margin': !showIdentity}">
                  <div class="block-header bg-gray-lighter mouse-pointer"
                        @click="showIdentity = !showIdentity">
                    <ul class="block-options">
                      <li>
                        <button type="button" data-toggle="block-option" data-action="content_toggle"><i
                          :class="{'si si-arrow-down': showIdentity, 'si si-arrow-up': !showIdentity}"></i></button>
                      </li>
                    </ul>
                    <h3 class="block-title">Identity</h3>
                  </div>
                  <div class="block-content">
                    <div class="form-group" v-if="!addEmployee">
                      <div class="col-xs-6 padding-top-6" v-if="!employeeProfile">
                        <label>Id:</label> {{employee.id}}
                      </div>
                      <div class="col-xs-6">
                        <label class="css-input css-checkbox css-checkbox-primary">
                          <input type="checkbox" :checked="employee.enabled" v-model="employee.enabled"><span></span> Active
                        </label>
                      </div>
                    </div>
                    <div class="form-group" :class="{ 'has-error' : errors.has('profile_form.email') }">
                      <div class="col-xs-12">
                        <div class="form-material" v-if="addEmployee">
                          <input class="form-control" type="text" id="email" name="email"
                                data-vv-scope="profile_form"
                                v-validate="'required|email|unique'" v-model="employee.contactInfo['email']">
                          <label for="email">Email</label>
                        </div>
                        <div class="form-material" v-else>
                          <input class="form-control" type="text" id="email" name="email"
                                data-vv-scope="profile_form"
                                v-validate="'required|email'" v-model="employee.contactInfo['email']">
                          <label for="email">Email</label>
                        </div>
                        <div v-show="errors.has('profile_form.email')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.email') }}
                        </div>
                      </div>
                    </div>
                    <!-- <div class="form-group">
                      <div class="col-xs-6">
                        <div class="form-material">
                          <label for="salutation">Salutation</label>
                          <select class="form-control"
                                  id="salutation"
                                  name="salutation"
                                  size="1"
                                  v-model="employee.primaryInfo['salutation']"
                                  data-vv-scope="profile_form">
                            <option v-for="(sal, salKey) in salutations" :value="sal.value" :key="salKey">
                              {{ sal.text }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div> -->
                    <div class="form-group"
                        :class="{ 'has-error' : errors.has('profile_form.first_name') }">
                      <div class="col-md-12">
                        <div class="form-material">
                          <input class="form-control" type="text" id="first_name"
                                name="first_name"
                                v-model="employee.primaryInfo['firstName']"
                                data-vv-scope="profile_form"
                                v-validate="'required'">
                          <label for="first_name">First name</label>
                        </div>
                        <div v-show="errors.has('profile_form.first_name')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.first_name') }}
                        </div>
                      </div>
                    </div>
                    <div class="form-group"
                        :class="{ 'has-error' : errors.has('profile_form.last_name') }">
                      <div class="col-md-12">
                        <div class="form-material">
                          <input class="form-control" type="text" id="last_name"
                                name="last_name" v-validate="'required'"
                                data-vv-scope="profile_form"
                                v-model="employee.primaryInfo['lastName']"
                          >
                          <label for="last_name">Last name</label>
                        </div>
                        <div v-show="errors.has('profile_form.last_name')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.last_name') }}
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-12">

                        <div class="form-material">
                          <label for="title">Title</label>
                          <input class="form-control" type="text" id="title" v-model="employee.primaryInfo['title']"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="block margin-t-10"
                      :class="{'block-opt-hidden': showContactInfo, 'block-content--margin': !showContactInfo}">
                  <div class="block-header bg-gray-lighter mouse-pointer"
                        @click="showContactInfo = !showContactInfo">
                      <ul class="block-options">
                        <li>
                          <button type="button" data-toggle="block-option" data-action="content_toggle"><i
                            :class="{'si si-arrow-down': showContactInfo, 'si si-arrow-up': !showContactInfo}"></i></button>
                      </li>
                      </ul>
                    <h3 class="block-title">Contact info</h3>
                  </div>
                  <div class="block-content">
                    <div class="form-group padding-top-6" >
                      <div class="col-xs-12">
                        <div class="form-material">
                          <autocomplete ref="autocomplete_profile" :setData="setStreet"
                                        :onSearch="getSearchSuggestions"
                                        :item_highlighted="'highlightedName'">
                            <template slot="products" slot-scope="{ item }">
                              <span class="suggestion_autocomplete">{{get_icon(item.suggestionType)}}</span>
                            </template>
                          </autocomplete>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6" :class="{ 'has-error' : errors.has('profile_form.street') }">
                        <div class="form-material">
                          <input class="form-control" type="text" id="street"
                                name="street" v-validate="'required'"
                                data-vv-scope="profile_form"
                                v-model="employee.address.street"
                                :key="employee.address.street"
                          >
                          <label for="street">Street</label>
                        </div>
                        <div v-show="errors.has('profile_form.street')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.street') }}
                        </div>
                      </div>
                      <div class="col-xs-6">
                        <div class="form-material">
                          <input class="form-control" type="text" id="streetNumber"
                                name="streetNumber"
                                data-vv-scope="profile_form"
                                v-model="employee.address.streetNumber"
                                :key="employee.address.streetNumber"
                          >
                          <label for="streetNumber">Street number</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6" :class="{ 'has-error' : errors.has('profile_form.cityName') }">
                        <div class="form-material">
                          <input class="form-control" type="text"
                                :key="employee.address.locality"
                                id="cityName"
                                name="cityName" v-validate="'required'"
                                data-vv-scope="profile_form"
                                v-model="employee.address.locality"
                          >
                          <label for="cityName">City</label>
                        </div>
                        <div v-show="errors.has('profile_form.cityName')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.cityName') }}
                        </div>
                      </div>
                      <div class="col-xs-3" :class="{ 'has-error' : errors.has('profile_form.postcode') }">
                        <div class="form-material">
                          <input class="form-control"
                                type="text"
                                id="postcode"
                                name="postcode"
                                data-vv-scope="profile_form"
                                :key="employee.address.zip"
                                v-validate="'required'" v-model="employee.address.zip">
                          <label for="postcode">Postcode</label>
                        </div>
                        <div v-show="errors.has('profile_form.postcode')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.postcode') }}
                        </div>
                      </div>
                      <div class="col-xs-3">
                        <div class="form-material">
                          <label for="country">Country</label>
                          <select class="form-control"
                                  id="country"
                                  name="country"
                                  size="1"
                                  v-model="employee.address.countryCode">
                            <option v-for="(country, cnKey) in countries" :value="country.text" :key="cnKey">
                              {{ country.text }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6" :class="{ 'has-error' : errors.has('profile_form.phone') }">
                        <div class="form-material">
                          <input class="form-control" type="text" id="phone"
                                name="phone" v-model="employee.contactInfo.officePhone"
                                data-vv-scope="profile_form"
                                v-validate="'required'">
                          <label for="phone">Phone</label>
                        </div>
                        <div v-show="errors.has('profile_form.phone')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.phone') }}
                        </div>
                      </div>
                      <div class="col-xs-3">
                        <div class="form-material">
                          <input class="form-control" type="text" id="cell"
                                v-model="employee.contactInfo.mobilePhone">
                          <label for="cell">Cell</label>
                        </div>
                      </div>
                      <div class="col-xs-3">
                        <div class="form-material">
                          <input class="form-control" type="text" id="fax" v-model="employee.contactInfo.fax">
                          <label for="fax">Fax</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                     <div class="col-xs-6">
                        <div class="form-material">
                          <input class="form-control" type="text" id="skypename"
                                v-model="employee.contactInfo.skypeName">
                          <label for="skypename">Skypename</label>
                        </div>
                      </div>
                      <div class="col-xs-6">
                        <div class="form-material">
                          <input class="form-control" type="text" id="remarks"
                                v-model="employee.primaryInfo.remarks"
                          >
                          <label for="remarks">Remarks</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group col-xs-12">
                      <button v-if="addEmployee" :disabled="$store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                        <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                        <span> Add employee</span>
                      </button>

                      <button v-else :disabled="$store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                        <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                        <span> Update profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  a {
    cursor: pointer;
  }
  .profile .fade.show {
    opacity: 1;
  }
  .profile .nav-link.active {
    color: #646464;
    background-color: #fff;
    border-color: transparent;
  }
  .profile .nav-item > a {
    margin-right: 0;
    color: #646464;
    font-weight: 600;
    border: 1px solid transparent;
    border-radius: 0;
    line-height: 1.42857143;
    position: relative;
    display: block;
    padding: 10px 15px;
  }
  .profile .form-group {
    margin-right: auto;
  }
  .content.col-lg-6 {
    margin-left: auto;
    margin-right: auto;
    float: none;
  }
  .autocomplete__icon {
    height: 14px;
    width: 14px;
    position: absolute;
    top: 12px;
  }
  .autocomplete__inputs input {
    padding-left: 20px;
  }
  .v-select .dropdown-toggle {
    border: none !important;
    box-shadow: 0 1px 0 #e6e6e6;
    -webkit-border-radius: 0px !important;
    -moz-border-radius: 0px !important;
    border-radius: 0px !important;
  }
  .v-select .selected-tag {
    color: #333;
    position: absolute;
    padding: 0px !important;
    margin: 0px !important;
    margin-top: 2px !important;
    border: none !important;
    -webkit-border-radius: 0px !important;
    -moz-border-radius: 0px !important;
    border-radius: 0px !important;
  }
  .nav-item a:focus{
    outline: none;
  }
  .profile .nav-link.active {
    color: #646464;
    background-color: #fff;
    border-color: transparent;
    border-bottom: 2px solid #9cc5d5;
  }
  *:focus{
    outline: none !important;
  }
  .input_search{
    border: none;
    border-bottom: 1px solid #e6e6e6;
  }
  .hovertr:hover {
    cursor: pointer;
    background-color: #ebebeb !important;
  }
</style>
<style lang="scss" scoped>
.vb-content {
  height: calc(100vh - 150px) !important;
}
  .close_agency{
    top: 24px; position: absolute; z-index: 1; right: 27px;
  }
  .suggestion_type{
    padding-right: 5px; color: #ccc; font-size: 11px
  }
</style>
