<template>
  <main id="main-container">
    <div v-bar="{
                preventParentScroll: true,
            }">
      <div>
        <div class="content bg-gray-lighter">
          <div class="row items-push">
            <div class="col-sm-3">
              <h1 class="page-heading">
                Employees
                <small>{{ activeNo }} active, {{ inActiveNo }} inactivated</small>
              </h1>
            </div>
            <div class="col-sm-9">
              <ul class="nav-header pull-right">
                <li class="header-search">
                  <div class="form-horizontal">
                    <div class="form-material input-group remove-margin-t remove-margin-b">
                      <input @keyup.enter="searchFor(0)"
                             placeholder="Search by (first name, last name, email, company )" type="text"
                             class="form-control" v-model="search_for">
                      <span class="input-group-addon" v-if="!search_loading">
                                                <i class="fa fa-search" @click="searchFor(0)"></i>
                                            </span>
                      <span class="input-group-addon" v-if="search_loading">
                                                <i class="fa fa-circle-o-notch fa-spin"></i>
                                            </span>
                      <span class="input-group-addon bg-gray-light" v-if="search_finished" @click="clear_search">
                                                <i class="fa fa-remove"></i>
                                            </span>
                    </div>
                  </div>
                </li>
                <li>
                  <button @click.stop="addEmployee" class="btn btn-success push-5-r push-10" type="button"><i
                    class="fa fa-plus"></i> Add Employee
                  </button>
                </li>
                <li>
                  <div class="form-material margin0">
                    <button v-for="(i, index) in [10,20,50]" :key="index" :class="i == perPage ? 'active':''"
                            class="btn btn-default push-5-r push-10" @click.stop="change_perPage(i)">{{i}}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="block">
            <div class="block-content">
              <div class="row">
                <div class="col-sm-12">
                  <div v-if="!loading" class="table-responsive">
                    <table class="table table-striped table-vcenter">
                      <thead>
                      <tr>
                        <th class="width30percent" rowspan="1" colspan="1">First name</th>
                        <th class="width30percent">Last name</th>
                        <th class="width20percent">Role</th>
                        <th class="width10percent">Active</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr class="hovertr" v-for="(employee, employeeKey) in employees.items" :key="employeeKey"
                          @click.stop="getEmployee(employeeKey)" :class="{'selected': selectedIndex === employeeKey}">

                        <td class="font-w600">{{employee.firstName}}</td>
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
                  <div v-if="loading" class="text-center">
                    <i class="fa fa-spinner fa-spin spn"></i>
                  </div>
                  <paginate
                    ref="employeesPagination"
                    :page-count="pages"
                    :page-range="3"
                    :margin-pages="2"
                    :click-handler="nextPage"
                    :prev-text="'Prev'"
                    :next-text="'Next'"
                    :container-class="'pagination'"
                    :page-class="'page-item'">
                  </paginate>
                </div>

                <aside @click.stop
                       v-if="employee.id && !addingEmployee && $store.getters['globalStates_/profileRightSidebar']"
                       :class="{'sidebar-fixed':employee}" class="overflow-y-hidden">
                  <div>
                    <div id="side-overlay-scroll" class="widthAuto">
                      <div class="side-header side-content">
                        <div :class="selectedIndex === -1 ? 'col-md-11' : 'col-md-8'">
                          <img class="img-avatar img-avatar32" src="static/img/avatars/avatar10.jpg" alt="">
                          <span class="font-w600 push-10-l">{{ employee.primaryInfo.firstName }} {{ employee.primaryInfo.lastName }} </span>
                        </div>
                        <template v-if="selectedIndex !== -1">
                          <div class="col-md-1 text-center">
                            <button class="btn btn-default" v-if="selectedIndex !== 0 || pageNum !== 0"
                                    @click="nextItem(selectedIndex, false)" type="button">
                              <i class="fa fa-arrow-left"></i><br>
                            </button>
                          </div>
                          <div class="col-md-1 text-center">
                            <button class="btn btn-default" v-if="checkEnd(selectedIndex)"
                                    @click="nextItem(selectedIndex, true)" type="button">
                              <i class="fa fa-arrow-right"></i><br>
                            </button>
                          </div>
                        </template>
                        <div :class="selectedIndex === -1 ? 'col-md-1' : 'col-md-2'">
                          <button class="btn btn-default pull-right" @click="closeEmployee()" type="button"
                                  data-toggle="layout" data-action="side_overlay_close">
                            <i class="fa fa-times"></i>
                          </button>
                        </div>
                      </div>
                      <employee-profile :employee_profile="employee" @searchFor="searchFor(0)" @loadAgencies="loadAgencies()"
                                      @closeEmployee="closeEmployee()"></employee-profile>
                    </div>
                  </div>
                </aside>
                <aside class="hideY" @click.stop
                       v-if="addingEmployee && $store.getters['globalStates_/profileRightSidebar']"
                       :class="{'sidebar-fixed':addingEmployee}">
                  <div>
                    <div id="side-overlay-scroll" class="widthAuto">
                      <employee-profile :employee_profile="newEmployee" :addEmployee="true" @closeNewEmployee="closeNewEmployee()"
                                      @loadEmployees="loadEmployees()"></employee-profile>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
  .hovertr:hover {
    cursor: pointer;
    background-color: #ebebeb !important;
  }
  .selected {
    background-color: #ebebeb !important;
  }
  .abs .nav.nav-tabs {
    background: #fff;
  }

  .sidebar-fixed {
    width: 750px !important;
    right: 0px !important;
  }

  .slimScrollDiv {
    height: 1200px !important;
  }

  .side-scroll #sidebar, .side-scroll #side-overlay {
    overflow-y: auto !important;
  }

  .sidebar-fixed {
    background-color: #fff;
    width: 750px !important;
    right: 0px !important;
    position: fixed;
    top: 0px;
    z-index: 4999;
    -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    overflow-y: auto !important;
    height: 100%;

  }
</style>
<style scoped>
  .pagination {
    float: right;
    margin-top: 0 !important;
  }

  .spinner {
    position: absolute;
    left: 50%;
  }

  .input-group-addon {
    cursor: pointer;
  }

  .spn {
    font-size: 50px !important;
    margin-top: 240px;
    margin-bottom: 240px;
  }
</style>
