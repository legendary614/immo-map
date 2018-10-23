<template>
  <div class="side-content remove-padding-t">
    <div class="side-header padding-top-15" v-if="addUser">
      <button class="btn btn-xs btn-default toggle_button" type="button"
            @click="$emit('closeNewUser')"
      ><i class="fa fa-close"></i>
      </button>
      <span>
      <img class="img-avatar img-avatar32" src="static/img/avatars/avatar10.jpg" alt="">
      <span class="font-w600 push-10-l">{{ user.primaryInfo.firstName || user.primaryInfo.lastName ? user.primaryInfo.firstName : "New" }} {{ user.primaryInfo.lastName || user.primaryInfo.firstName? user.primaryInfo.lastName : "user" }}</span>
      </span>
    </div>
    <div class="block pull-r-l border-t">
      <ul class="nav nav-tabs nav-tabs-alt nav-justified" data-toggle="tabs">
        <li :class="{ 'active' : tabsProfile['showProfile']}">
          <a type="button" @click="show('showProfile')">Profile</a>
        </li>
        <li :class="{ 'active' : tabsProfile['showPassword']}" v-if="!addUser">
          <a type="button" @click="show('showPassword')">Password</a>
        </li>
        <li :class="{ 'active' : tabsProfile['showSignIns']}" v-if="!addUser">
          <a type="button" @click="show('showSignIns')">Sign Ins</a>
        </li>
        <li :class="{ 'active' : tabsProfile['showAgencies']}" v-if="!addUser">
          <a type="button" @click="show('showAgencies')">Agencies</a>
        </li>
      </ul>
      <div class="block-content tab-content">
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showProfile']}">

          <div class="row" v-bar>
            <div class="col-xs-12">
              <form class="form-horizontal push-10-t push-10 padding-right-10"
                        @submit.prevent="updateOrCreate('profile_form')"
                        data-vv-scope="profile_form">
                <div class="block margin-t-10"
                      :class="{'block-opt-hidden': showIdentity, 'block-content--margin': !showIdentity}">
                  <div class="block-header bg-gray-lighter mouse-pointer"
                        @click="showIdentity = !showIdentity">
                      <ul class="block-options">
                        <li>
                          <button type="button" data-toggle="block-option" data-action="content_toggle"><i
                            :class="{'si si-arrow-down': showIdentity, 'si si-arrow-up': !showIdentity,}"></i></button>
                        </li>
                      </ul>
                    <h3 class="block-title">Identity</h3>
                  </div>
                  <div class="block-content">
                    <div class="form-group" v-if="!addUser">
                      <div class="col-xs-6 padding-top-6" v-if="!userProfile">
                        <label>Id:</label> {{user.id}}
                      </div>
                      <div class="col-xs-6">
                        <label class="css-input css-checkbox css-checkbox-primary">
                          <input type="checkbox" :checked="user.enabled" v-model="user.enabled"><span></span> Active
                        </label>
                      </div>
                    </div>
                    <div class="form-group" :class="{ 'has-error' : errors.has('profile_form.email') }">
                      <div class="col-xs-12">
                        <div class="form-material" v-if="addUser">
                          <input class="form-control" type="text" id="email" name="email"
                                data-vv-scope="profile_form"
                                v-validate="'required|email|unique'" v-model="user.email">
                          <label for="email">Email</label>
                        </div>
                        <div class="form-material" v-else>
                          <input class="form-control" type="text" id="email" name="email"
                                data-vv-scope="profile_form"
                                v-validate="'required|email'" v-model="user.email">
                          <label for="email">Email</label>
                        </div>
                        <div v-show="errors.has('profile_form.email')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.email') }}
                        </div>
                      </div>
                    </div>
                    <div class="form-group" v-if="addUser"
                        v-bind:class="{ 'has-error' : errors.has('profile_form.password') }">
                      <div class="col-xs-12">
                        <div class="form-material">
                          <input class="form-control" type="password"
                                id="password"
                                name="password"
                                v-model="password"
                                data-vv-scope="profile_form"
                                v-validate="'required'">
                          <label for="url">Password</label>
                        </div>
                        <div v-show="errors.has('profile_form.password')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('password') }}
                        </div>
                      </div>
                    </div>
                    <div class="form-group" v-if="addUser"
                        v-bind:class="{ 'has-error' : errors.has('profile_form.password_confirmation') }">
                      <div class="col-xs-12">
                        <div class="form-material">
                          <input class="form-control" type="password"
                                id="new_password"
                                name="password_confirmation"
                                data-vv-scope="profile_form"
                                v-validate="'required|confirmed:password'"
                                v-model="newPassword">
                          <label for="url">Confirm password</label>
                        </div>
                        <div v-show="errors.has('profile_form.password_confirmation')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.password_confirmation') }}
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6">
                        <div class="form-material">
                          <label for="salutation">Salutation</label>
                          <select class="form-control"
                                  id="salutation"
                                  name="salutation"
                                  size="1"
                                  v-model="selected_sal"
                                  data-vv-scope="profile_form">
                            <option v-for="(sal, salKey) in salutations" :value="sal.value" :key="salKey">
                              {{ sal.text }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="form-group"
                        :class="{ 'has-error' : errors.has('profile_form.first_name') }">
                      <div class="col-md-12">
                        <div class="form-material">
                          <input class="form-control" type="text" id="first_name"
                                name="first_name"
                                v-model="user.primaryInfo.firstName"
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
                                v-model="user.primaryInfo.lastName"
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
                          <input class="form-control" type="text" id="title" v-model="user.primaryInfo.title"/>
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
                                v-model="user.address.street"
                                :key="user.address.street"
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
                                v-model="user.address.streetNumber"
                                :key="user.address.streetNumber"
                          >
                          <label for="streetNumber">Street number</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6" :class="{ 'has-error' : errors.has('profile_form.cityName') }">
                        <div class="form-material">
                          <input class="form-control" type="text"
                                :key="user.address.locality"
                                id="cityName"
                                name="cityName" v-validate="'required'"
                                data-vv-scope="profile_form"
                                v-model="user.address.locality"
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
                                :key="user.address.zip"
                                v-validate="'required'" v-model="user.address.zip">
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
                                  v-model="user.address.countryCode">
                            <option v-for="(country, cnKey) in countries" :value="country.text" :key="cnKey">
                              {{ country.text }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-3" :class="{ 'has-error' : errors.has('profile_form.phone') }">
                        <div class="form-material">
                          <input class="form-control" type="text" id="phone"
                                name="phone" v-model="user.contactInfo.officePhone"
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
                                v-model="user.contactInfo.mobilePhone">
                          <label for="cell">Cell</label>
                        </div>
                      </div>
                      <div class="col-xs-3">
                        <div class="form-material">
                          <input class="form-control" type="text" id="fax" v-model="user.contactInfo.fax">
                          <label for="fax">Fax</label>
                        </div>
                      </div>
                      <div class="col-xs-3">
                        <div class="form-material">
                          <input class="form-control" type="text" id="skypename"
                                v-model="user.contactInfo.skypeName">
                          <label for="skypename">Skypename</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6">
                        <div class="form-material">
                          <input class="form-control" type="text" id="url"
                                v-model="user.contactInfo.websiteUrl"
                          >
                          <label for="url">Website</label>
                        </div>
                      </div>
                      <div class="col-xs-6">
                        <div class="form-material">
                          <input class="form-control" type="text" id="remarks"
                                v-model="user.adminInfo.remarks"
                          >
                          <label for="remarks">Remarks</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6" :class="{ 'has-error' : errors.has('profile_form.lang') }">
                        <div class="form-material">
                          <label for="lang">Language</label>
                          <select class="form-control"
                                  id="lang"
                                  name="lang"
                                  size="1"
                                  v-model="selected_lang"
                                  v-validate="'required'"
                                  data-vv-scope="profile_form">
                            <option v-for="(lang, langKey) in languages" :value="lang.value" :key="langKey">
                              {{ lang.text }}
                            </option>
                          </select>
                        </div>
                        <div v-show="errors.has('profile_form.lang')"
                            class="help-block text-right animated fadeInDown">{{
                          errors.first('profile_form.lang') }}
                        </div>
                      </div>
                      <!-- <div class="col-xs-6">
                        <label class="css-input css-checkbox css-checkbox-primary">
                          <input type="checkbox" id="newsletter" name="newsletter" :checked="user.newsletter" v-model="user.newsletter"><span></span> Newsletter
                        </label>
                      </div> -->
                    </div>
                  </div>
                </div>
                <div class="block-content">
                  <div class="form-group col-xs-12">
                      <button v-if="addUser" :disabled="$store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                        <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                        <span> Add user</span>
                      </button>

                      <button v-else :disabled="$store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                        <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                        <span> Update profile</span>
                      </button>
                    </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showPassword']}" v-if="!addUser">
          <div class="row">
            <div class="col-xs-12">
              <div class="block block-themed">
                <div class="block-content">
                  <form class="form-horizontal push-10-t push-10"
                        @submit.prevent="update_password('pass_form')" data-vv-scope="pass_form">

                    <div class="form-group col-xs-12" v-if="userProfile"
                        v-bind:class="{ 'has-error' : errors.has('pass_form.current_password') || !passwordOk }">
                      <div class="form-material">
                        <input class="form-control" type="password"
                              id="current_password"
                              name="current_password"
                              v-model="currentPassword"
                              data-vv-scope="pass_form"
                              v-validate="'required'"

                        >
                        <label for="url">Current password</label>
                      </div>

                      <div v-show="errors.has('pass_form.current_password') || !passwordOk"
                          class="help-block text-right animated fadeInDown">{{
                        errors.first('pass_form.current_password') }}
                      </div>
                    </div>
                    <div class="form-group col-xs-12"
                        v-bind:class="{ 'has-error' : errors.has('pass_form.password') }">
                      <div class="form-material">
                        <input class="form-control" type="password"
                              id="password"
                              name="password"
                              v-model="password"
                              data-vv-scope="pass_form"
                              v-validate="'required'"
                        >
                        <label for="url">New password</label>
                      </div>

                      <div v-show="errors.has('pass_form.password')"
                          class="help-block text-right animated fadeInDown">{{
                        errors.first('password') }}
                      </div>
                    </div>

                    <div class="form-group col-xs-12"
                        v-bind:class="{ 'has-error' : errors.has('pass_form.password_confirmation') }">
                      <div class="form-material">
                        <input class="form-control" type="password"
                              id="new_password"
                              name="password_confirmation"
                              data-vv-scope="pass_form"
                              v-validate="'required|confirmed:password'"
                              v-model="newPassword"
                        >
                        <label for="url">Confirm new password</label>
                      </div>

                      <div v-show="errors.has('pass_form.password_confirmation')"
                          class="help-block text-right animated fadeInDown">{{
                        errors.first('pass_form.password_confirmation') }}
                      </div>

                    </div>

                    <div class="form-group col-xs-12">
                      <button :disabled="!newPassword || !password || $store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                        <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                        <span> Update password</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showSignIns']}" v-if="!addUser">
          <div class="row">
            <div class="col-xs-12">
              <div class="col-xs-6">
                <label>Last login:</label>
                <timeago :since="user.lastLoginTimeUtc"></timeago>
              </div>
            </div>
            <div class="col-xs-12">
              <div class="block  bg-white">
                <!-- <div class="block-header">
                  <ul class="block-options">
                    <li>
                      <button type="button" data-toggle="block-option" data-action="refresh_toggle"
                              data-action-mode="demo"><i class="si si-refresh"></i></button>
                    </li>
                  </ul>
                   <h3 class="block-title">Sign Ins</h3>
                </div> -->
                <div class="block-content block-content-full text-center bg-gray-lighter">
                  <div class="chart_div">

                    <area-chart :data="chartData" :colors="['#f4f4f4', '#ccc', '#f4f4f4']"></area-chart>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showAgencies']}" v-if="!addUser">
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .chart_div {
    height: 374px;
  }
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
</style>
<style lang="scss" scoped>
.vb-content {
  height: calc(100vh - 150px) !important;
}
  .toggle_button{
    top: 24px; position: absolute; z-index: 1; right: 27px;
  }
  .suggestion_autocomplete{
    padding-right: 5px; color: #ccc; font-size: 11px
  }
</style>
