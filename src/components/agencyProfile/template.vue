<template>
  <div class="side-content remove-padding-t">
    <div class="side-header padding-top-15" v-if="addAgency">
      <button class="btn btn-xs btn-default close_agency" type="button"
            @click="closeNewAgency"
      ><i class="fa fa-close"></i>
      </button>
      <span>
      <img class="img-avatar img-avatar32" src="static/img/avatars/avatar10.jpg" v-bind:alt="agency.name ? agency.name : 'New agency'">
      <span class="font-w600 push-10-l">{{ agency.name ? agency.name : "New agency" }}</span>
      </span>
    </div>
    <div class="block pull-r-l border-t">
      <ul class="nav nav-tabs nav-tabs-alt nav-justified" data-toggle="tabs">
        <li :class="{ 'active' : tabsProfile['showProfile']}">
          <a type="button" @click="show('showProfile')">Profile</a>
        </li>
        <li :class="{ 'active' : tabsProfile['showEmployees']}">
          <a type="button" @click="show('showEmployees')">Employees</a>
        </li>
        <li :class="{ 'active' : tabsProfile['showWorkspaces']}">
          <a type="button" @click="show('showWorkspaces')">Workspaces</a>
        </li>
        <!--<li :class="{ 'active' : tabsProfile['showGeo']}">
          <a type="button" @click="show('showGeo')">Geo</a>
        </li>-->
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
                    <div class="form-group" v-if="!addAgency">
                      <div class="col-xs-6 padding-top-6" v-if="!agencyProfile">
                        <label>Id:</label> {{ agency.id }}
                      </div>
                      <div class="col-xs-6">
                        <label class="css-input css-checkbox css-checkbox-primary">
                          <input type="checkbox" :checked="agency.enabled" v-model="agency.enabled"><span></span> Active
                        </label>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-12">
                        <div class="form-material">
                          <label for="title">Name</label>
                          <input class="form-control" type="text" id="name" v-model="agency.primaryInfo['name']"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="block margin-t-10">
                  <div class="block-header bg-gray-lighter mouse-pointer">
                    <h3 class="block-title">Work areas</h3>
                  </div>
                  <div class="block-content">
                      <div v-if="!showSearchAreas && selectedSearchSuggestions.length == 0 && shapes.length == 0">No search areas defined <a class="btn btn-default pull-right" v-on:click="addAreas">Add</a></div>
                      <div v-else>
                        <div>
                          <autocomplete ref="autocomplete_geo" :setData="addArea"
                                         :onSearch="getGeoSearchSuggestions"
                                         :item_highlighted="'highlightedName'">
                            <template slot="products" slot-scope="{ item }">
                              <span class="suggestion_type">{{get_icon(item.suggestionType)}}</span>
                            </template>
                          </autocomplete>
                        </div>
                        <div class="margin-b-10 margin-t-10" style="margin-bottom: 20px !important;">
                          <div class="width100percent pull-left" v-if="selectedSearchSuggestions.length || shapes.length">
                          <span v-for="(a, index) in selectedSearchSuggestions" v-bind:style="'background-color:'+ a.bg_color + '!important'" class="multiselect__tag" v-bind:key="index">
                            <i aria-hidden="true" tabindex="2" class="fa fa-edit add_km" v-on:click="add_km_to_geo_object(index)"></i>
                            <span v-on:click="remove_address_item(index)">{{a.name}} [ {{get_icon(a.suggestionType)}} ]</span>
                            <span class="km_hover" v-show="a.extend_by" v-on:click="remove_km_from_geo_object(index)">+ {{a.extend_by}}km</span>
                            <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" v-on:click="remove_address_item(index)"></i>
                          </span>
                            <span v-for="(a, index) in shapes" class="multiselect__tag" v-bind:style="stc(a.color)" v-bind:key="a.name" v-on:click="remove_shape(a.id, index)"><span>{{a.name}}</span>
                            <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i>
                          </span>
                          </div>
                          <!--<a type="button" class="btn btn-sm btn-success" v-on:click="updateAgencyAreas"><span>Update</span></a>-->
                          <a v-if="selectedSearchSuggestions.length == 0 && shapes.length == 0" type="button" class="btn btn-sm btn-default" v-on:click="closeAreas"><span>Cancel</span></a>
                          <a v-if="showSearchAreasInit" type="button" class="btn btn-sm btn-default" v-on:click="openMapAndDraw"><span>Show on map</span></a>

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
                              <span class="suggestion_type">{{get_icon(item.suggestionType)}}</span>
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
                                v-model="agency.address.street"
                                :key="agency.address.street"
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
                                v-model="agency.address.streetNumber"
                                :key="agency.address.streetNumber"
                          >
                          <label for="streetNumber">Street number</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6" :class="{ 'has-error' : errors.has('profile_form.cityName') }">
                        <div class="form-material">
                          <input class="form-control" type="text"
                                :key="agency.address.locality"
                                id="cityName"
                                name="cityName" v-validate="'required'"
                                data-vv-scope="profile_form"
                                v-model="agency.address.locality"
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
                                :key="agency.address.zip"
                                v-validate="'required'" v-model="agency.address.zip">
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
                                  v-model="agency.address.countryCode">
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
                                name="phone" v-model="agency.contactInfo['officePhone']"
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
                                v-model="agency.contactInfo['mobilePhone']">
                          <label for="cell">Cell</label>
                        </div>
                      </div>
                      <div class="col-xs-3">
                        <div class="form-material">
                          <input class="form-control" type="text" id="fax" v-model="agency.contactInfo['fax']">
                          <label for="fax">Fax</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-6">
                        <div class="form-material">
                          <input class="form-control" type="text" id="url"
                                v-model="agency.contactInfo['websiteUrl']"
                          >
                          <label for="url">Website</label>
                        </div>
                      </div>
                      <div class="col-xs-3">
                        <div class="form-material">
                          <input class="form-control" type="text" id="remarks"
                                v-model="agency.contactInfo['remarks']"
                          >
                          <label for="remarks">Remarks</label>
                        </div>
                      </div>
                       <div class="col-xs-3">
                        <label class="css-input css-checkbox css-checkbox-primary">
                          <input type="checkbox" id="newsletter" name="newsletter" :checked="agency.newsletter" v-model="agency.newsletter"><span></span> Newsletter
                        </label>
                      </div>
                    </div>
                    <!-- <div class="form-group">
                      <div class="col-xs-6" :class="{ 'has-error' : errors.has('profile_form.lang') }">
                        <div class="form-material">
                          <label for="lang">Language</label>
                          <select class="form-control"
                                  id="lang"
                                  name="lang"
                                  size="1"
                                  v-model="agency.language"
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
                      <div class="col-xs-6">
                        <label class="css-input css-checkbox css-checkbox-primary">
                          <input type="checkbox" id="newsletter" name="newsletter" :checked="agency.newsletter" v-model="agency.newsletter"><span></span> Newsletter
                        </label>
                      </div>
                    </div> -->
                  </div>
                </div>
                <div class="block margin-t-10"
                      :class="{'block-opt-hidden': showOwner, 'block-content--margin': !showOwner}">
                  <div class="block-header bg-gray-lighter mouse-pointer"
                        @click="showOwner = !showOwner">
                      <ul class="block-options">
                        <li>
                          <button type="button" data-toggle="block-option" data-action="content_toggle"><i
                            :class="{'si si-arrow-down': showOwner, 'si si-arrow-up': !showOwner}"></i></button>
                        </li>
                      </ul>
                    <h3 class="block-title">Owner info</h3>
                  </div>
                  <div class="block-content">
                    <div class="form-group">
                      <template v-if="!agency.ownerInvitation">
                        <div class="col-xs-6 padding-top-6">
                          <div class="form-material">
                            <label for="title">Email</label>
                            <input class="form-control" type="text" id="name" v-model="ownerEmail"/>
                          </div>
                        </div>
                        <div class="col-xs-6 padding-top-6">
                          <div class="form-material">
                            <label for="title">Full name</label>
                            <input class="form-control" type="text" id="name" v-model="invitation.recipientName"/>
                          </div>
                        </div>
                        <div class="col-xs-12" >
                          <div class="form-material">
                            <label for="title">Message</label>
                            <input class="form-control" type="text" id="name" v-model="invitation.message"/>
                          </div>
                        </div>
                        <div class="col-xs-12">
                          <div class="form-material">
                            <a type="button" :disabled="sendingInvitation" class="btn btn-sm btn-info" @click="sendInvitation()">
                              <i v-if="sendingInvitation" class="fa fa-spinner fa-spin"></i>
                              <span> Send invitation</span>
                            </a>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="agency.ownerInvitation['status'] === 1">
                          <div class="col-xs-6 padding-top-6">
                            <div class="form-material">
                              <label for="title">Email</label>
                              <input disabled class="form-control" type="text" id="name" v-model="agency.ownerInvitation.email"/>
                            </div>
                          </div>
                          <div class="col-xs-6 padding-top-6">
                            <div class="form-material">
                              <label for="title">Full name</label>
                              <input disabled class="form-control" type="text" id="name" v-model="agency.ownerInvitation.request.recipientName"/>
                            </div>
                          </div>
                          <div class="col-xs-12">
                            <div class="form-material">
                              <a type="button" :disabled="sendingInvitation" class="btn btn-sm btn-danger" @click="cancelInvitation()">
                                <i v-if="sendingInvitation" class="fa fa-spinner fa-spin"></i>
                                <span> Cancel invitation</span>
                              </a>
                            </div>
                          </div>
                        </template>
                        <template v-if="agency.ownerInvitation['status'] === 5">
                          <div class="col-xs-6 padding-top-6">
                          <div class="form-material">
                            <label for="title">Email</label>
                            <input class="form-control" type="text" id="name" v-model="ownerEmail"/>
                          </div>
                          </div>
                          <div class="col-xs-6 padding-top-6">
                            <div class="form-material">
                              <label for="title">Full name</label>
                              <input class="form-control" type="text" id="name" v-model="invitation.recipientName"/>
                            </div>
                          </div>
                          <div class="col-xs-12" >
                            <div class="form-material">
                              <label for="title">Message</label>
                              <input class="form-control" type="text" id="name" v-model="invitation.message"/>
                            </div>
                          </div>
                          <div class="col-xs-12">
                            <div class="form-material">
                              <a type="button" :disabled="sendingInvitation" class="btn btn-sm btn-info" @click="sendInvitation()">
                                <i v-if="sendingInvitation" class="fa fa-spinner fa-spin"></i>
                                <span> Send invitation</span>
                              </a>
                            </div>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="block margin-t-10"
                      :class="{'block-opt-hidden': showContacts, 'block-content--margin': !showContacts}">
                  <div class="block-header bg-gray-lighter mouse-pointer"
                        @click="showContacts = !showContacts">
                    <ul class="block-options">
                      <li>
                        <button type="button" data-toggle="block-option" data-action="content_toggle"><i
                          :class="{'si si-arrow-down': showContacts, 'si si-arrow-up': !showContacts}"></i></button>
                      </li>
                    </ul>
                    <h4 class="block-title">Contacts</h4>
                  </div>
                </div>
                <div class="block margin-t-10"
                      :class="{'block-opt-hidden': showFeatures, 'block-content--margin': !showFeatures}">
                  <div class="block-header bg-gray-lighter mouse-pointer"
                        @click="showFeatures = !showFeatures">
                    <ul class="block-options">
                      <li>
                        <button type="button" data-toggle="block-option" data-action="content_toggle"><i
                          :class="{'si si-arrow-down': showFeatures, 'si si-arrow-up': !showFeatures}"></i></button>
                      </li>
                    </ul>
                    <h4 class="block-title">Features</h4>
                  </div>
                </div>
                <div class="block-content ">
                  <div class="form-group col-xs-12 submit_form_div">
                    <button v-if="addAgency" :disabled="$store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                      <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                      <span> Add agency</span>
                    </button>

                    <button v-else :disabled="$store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                      <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                      <span> Update agency</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showEmployees']}">
          <div class="content" v-if="employees">
            <div class="block">
              <div class="block-content">
                <div class="row">
                  <div class="col-sm-12">
                    <div class="table-responsive">
                      <table class="table table-striped table-vcenter">
                          <thead>
                          <tr>
                              <th class="width30percent" rowspan="1" colspan="1">ID</th>
                              <th class="width20percent">First name</th>
                              <th class="width20percent">Last name</th>
                              <th class="width10percent">Role</th>
                              <th class="width10percent">Active</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr class="hovertr" v-for="(employee, employeeKey) in employees.items" :key="employeeKey"
                           @click.stop="redirectToEmployee(employee)">
                              <td class="font-w600">{{employee.id}}</td>
                              <td>{{employee.firstName}}</td>
                              <td>{{employee.lastName}}</td>
                              <td>{{ getRole(employee.role) }}</td>
                              <td>
                                <span v-if="employee.enabled" class="label label-success">Active</span>
                                <span v-if="!employee.enabled" class="label label-danger">Inactive</span>
                              </td>
                          </tr>
                          </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showWorkspaces']}" v-if="loaded">
          <div class="content" v-if="workspaces">
            <div class="block">
              <div class="block-content">
                <div class="row">
                  <div class="col-sm-12">
                    <div class="table-responsive">
                      <table class="table table-striped table-vcenter">
                          <thead>
                          <tr>
                              <th class="width40percent" rowspan="1" colspan="1">ID</th>
                              <th class="width50percent">Name</th>
                              <th class="width10percent">Active</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr class="hovertr" v-for="(workspace, workspaceKey) in workspaces.items" :key="workspaceKey"
                           @click.stop="redirectToWorkspace(workspace)">
                              <td class="font-w600">{{workspace.id}}</td>
                              <td>{{workspace.name}}</td>
                              <td>
                                <span v-if="workspace.enabled" class="label label-success">Active</span>
                                <span v-if="!workspace.enabled" class="label label-danger">Inactive</span>
                              </td>
                          </tr>
                          </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--<div class="tab-pane" :class="{ 'active' : tabsProfile['showGeo']}" v-show="tabsProfile['showGeo']">
          <div v-bar>
            <div >
            <div class="width100percent pull-left">
              <autocomplete ref="autocomplete_geo" :setData="addArea"
                            :onSearch="getGeoSearchSuggestions"
                            :item_highlighted="'highlightedName'">
                <template slot="products" slot-scope="{ item }">
                  <span class="suggestion_type">{{get_icon(item.suggestionType)}}</span>
                </template>
              </autocomplete>
            </div>
            <div class="width100percent pull-left" style="position: relative; float: left; height: 600px">
              <agency-map-component />
            </div>
              <div class="width100percent pull-left margin-t-10" v-if="selectedSearchSuggestions.length || shapes.length" style="margin-top: 40px !important;">

                <span v-for="(a, index) in selectedSearchSuggestions" v-bind:style="'background-color:'+ a.bg_color + '!important'" class="multiselect__tag" v-bind:key="index">
                  <i aria-hidden="true" tabindex="2" class="fa fa-edit add_km" v-on:click="add_km_to_geo_object(index)"></i>
                  <span v-on:click="remove_address_item(index)">{{a.name}} [ {{get_icon(a.suggestionType)}} ]</span>
                  <span class="km_hover" v-show="a.extend_by" v-on:click="remove_km_from_geo_object(index)">+ {{a.extend_by}}km</span>
                  <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" v-on:click="remove_address_item(index)"></i>
                </span>
                <span v-for="(a, index) in shapes" class="multiselect__tag" v-bind:style="stc(a.color)" v-bind:key="a.name" v-on:click="remove_shape(a.id, index)"><span>{{a.name}}</span>
                  <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i>
                </span>

              </div>
              <div class="width100percent pull-left margin-t-10" v-if="selectedSearchSuggestions.length || shapes.length" style="margin-top: 10px !important;">

                <button type="button" class="width100percent btn btn-sm btn-success"><span>Update</span></button>

              </div>
          </div>
          </div>
        </div>-->
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
  .map-wrapper{
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    margin-top: 20px;

  }
  .multiselect__tag{
    margin-top: 0px !important;
  }
  .submit_form_div{
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    text-align: right;
    /* padding-right: 607px; */
    width: 765px;
    background: #fff;
    text-align: left;
    margin-bottom: 0px;
    /* padding-left: 32px; */
    padding: 35px;
    padding-left: 18px;
    padding-top: 20px;
    padding-bottom: 20px;
    z-index: 99;
  }
</style>
