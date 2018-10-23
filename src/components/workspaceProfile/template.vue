<template>
  <div class="side-content remove-padding-t">
    <div class="side-header padding-top-15" v-if="addWorkspace">
      <button class="btn btn-xs btn-default close_agency" type="button"
            @click="$emit('closeNewWorkspace')"
      ><i class="fa fa-close"></i>
      </button>
      <span>
      <img class="img-avatar img-avatar32" src="static/img/avatars/avatar10.jpg" v-bind:alt="workspace.name ? workspace.name : 'New workspace'">
      <span class="font-w600 push-10-l">{{ workspace.name ? workspace.name : "New workspace" }}</span>
      </span>
    </div>
    <div class="block pull-r-l border-t">
      <ul class="nav nav-tabs nav-tabs-alt nav-justified" data-toggle="tabs">
        <li :class="{ 'active' : tabsProfile['showProperties']}">
          <a type="button" @click="show('showProperties')">Properties</a>
        </li>
        <li :class="{ 'active' : tabsProfile['showEmployees']}" v-if="!addWorkspace">
          <a type="button" @click="show('showEmployees')">Employees</a>
        </li>
      </ul>
      <div class="block-content tab-content">
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showProperties']}">
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
                    <div class="form-group" v-if="!addWorkspace">
                      <div class="col-xs-6 .padding-top-6" v-if="!workspaceProfile">
                        <label>Id:</label> {{ workspace.id }}
                      </div>
                      <div class="col-xs-6">
                        <label class="css-input css-checkbox css-checkbox-primary">
                          <input type="checkbox" :checked="workspace.enabled" v-model="workspace.enabled"><span></span> Active
                        </label>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-12">
                        <div class="form-material">
                          <label for="title">Name</label>
                          <input class="form-control" type="text" id="name" v-model="workspace.name"/>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-xs-12">
                        <div class="form-material">
                          <label for="title">Description</label>
                          <input class="form-control" type="text" id="desc" v-model="workspace.description"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="block margin-t-10">
                  <div class="block-header bg-gray-lighter mouse-pointer">
                    <h3 class="block-title">Region</h3>
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
                <div class="block">
                  <div class="block-content">
                    <div class="form-group col-xs-12">
                      <button v-if="addWorkspace" :disabled="$store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                        <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                        <span> Add workspace</span>
                      </button>

                      <button v-else :disabled="$store.getters['globalStates_/loadingButton']" class="btn btn-sm btn-success" type="submit">
                        <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                        <span> Update workspace</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="tab-pane" :class="{ 'active' : tabsProfile['showEmployees']}">
          <div class="content">
            <div class="block">
              <div class="block-content">
                <div class="row">
                  <template v-if="allEmployees">
                    <div class="col-sm-12">
                      <label class="col-sm-4 control-label">
                        Select an employee:
                      </label>
                      <label class="col-sm-4 control-label">
                        Select a role:
                      </label>
                    </div>
                    <div class="col-sm-12">
                      <div class="col-sm-4">
                        <multiselect
                          v-model="selectedEmployee"
                          label="firstName"
                          placeholder="Employees"
                          :options="allEmployees.items"
                          :show-labels="false"
                          :clear-on-select="false">
                        </multiselect>
                      </div>
                      <div class="col-sm-4">
                        <multiselect
                          v-model="selectedRole"
                          label="text"
                          placeholder="Roles"
                          :options="roles"
                          :show-labels="false"
                          :clear-on-select="false">
                        </multiselect>
                      </div>
                      <div class="col-sm-4">
                        <button @click="addEmployee()" :disabled="$store.getters['globalStates_/loadingButton'] || (!selectedRole || !selectedEmployee)" class="btn btn-sm btn-success" type="submit">
                          <i v-if="$store.getters['globalStates_/loadingButton']" class="fa fa-spinner fa-spin"></i>
                          <span> Add employee </span>
                        </button>
                      </div>
                    </div>
                  </template>
                  <div class="col-sm-12" style="margin-top: 35px;">
                    <div class="table-responsive" v-if="!loading">
                      <table class="table table-striped table-vcenter">
                          <thead>
                          <tr>
                              <!-- <th class="width30percent" rowspan="1" colspan="1">ID</th> -->
                              <th class="width20percent">First name</th>
                              <th class="width20percent">Last name</th>
                              <th class="width20percent">Role</th>
                              <th class="width20percent">Active</th>
                              <th class="width20percent"></th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr class="hovertr" v-for="(employee, employeeKey) in employees" :key="employeeKey"
                           @click.stop="redirectToEmployee(employee)">
                              <!-- <td class="font-w600">{{employee.employee.id}}</td> -->
                              <td>{{employee.employee.firstName}}</td>
                              <td>{{employee.employee.lastName}}</td>
                              <td>{{ getRole(employee.role) }}</td>
                              <td>
                                <span v-if="employee.enabled" class="label label-success">Active</span>
                                <span v-if="!employee.enabled" class="label label-danger">Inactive</span>
                              </td>
                              <td>
                                <button @click.stop="removeEmployee(employee.employee.id) " class="btn btn-xs btn-danger" type="button"><i class="fa fa-times"></i> Remove</button>
                              </td>
                          </tr>
                          </tbody>
                      </table>
                    </div>
                    <div class="text-center" v-if="loading">
                      <i class="fa fa-spinner fa-spin text-center big_spinner"></i>
                    </div>
                  </div>
                </div>
              </div>
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
  .spinner {
    position: absolute;
    left: 50%;
}
  .big_spinner{
    font-size: 50px !important; margin-top: 240px; margin-bottom: 240px;
  }
</style>
