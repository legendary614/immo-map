import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "./../../store/modules/globalStates_";
import { ActionContext } from "vuex";

class State {
  employees: api.IEntitySearchResult<api.IEmployeeLightModel>;
  employee: api.IEmployeeModel;
  searchResults: api.IEntitySearchResult<api.IEmployeeLightModel>;
}

const state: State = {
  employees: null,
  employee: new api.EmployeeModel,
  searchResults: null
};

class SearchQuery {
    name: string;
    pagination: api.IPagination;
    agencyId: string;
    role: number;
}
class CreateEmployeeModel {
    agencyId: string;
    data: api.IEmployeeModel;
}

export const employeeStates = {
  namespaced: true,

  state,
  getters: {
    employees: (state: State) => {
      return state.employees;
    },
    employee: (state: State) => {
      return state.employee;
    },
    searchResults: (state: State) => {
      return state.searchResults;
    }
  },
  mutations: {
    setEmployees (state: State, employees: api.IEntitySearchResult<api.IEmployeeLightModel>) {
      state.employees = employees;
    },
    setEmployee (state: State, employee: api.IEmployeeModel) {
      state.employee = employee;
    },
    setSearchResults (state: State, searchResults: api.IEntitySearchResult<api.IEmployeeLightModel>) {
      state.searchResults = searchResults;
    },
    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {

    async getEmployees (context: ActionContext<State, any>, data: SearchQuery) {

      try {
        const employeeList = await api.$agency(data.agencyId).findEmployees(data.name, undefined, data.pagination);
        commitSetEmployees(context, employeeList);
      }
      catch (err) {

        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get employees"
          });
        }
      }
    },
    async getEmployeeById (context: ActionContext<State, any>, employeeId: string) {
      try {

        const employee = await api.$employee(employeeId).get();
        commitSetEmployee(context, employee);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get employee"
          });
        }
      }
    },
    async createEmployee (context: ActionContext<State, any>, data: CreateEmployeeModel) {
        const newEmployee: api.Employee = await api.$agency(data.agencyId).createEmployee(data.data);
        const employee: api.IEmployeeModel = await newEmployee.get();
        return employee;
    },
    async updateEmployee (context: ActionContext<State, any>, data: api.IEmployeeModel) {

      try {
        await api.$employee(data.id).update(data);

        setTimeout(() => {
          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "Employee was updated"
          });
        }, 1000);
      }
      catch (err) {
        globalState.commitSetLoadingButton(store, false);
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Employee was not updated successfully"
          });
        }
      }
    },
    async searchEmployee (context: ActionContext<State, any>, data: SearchQuery) {
      try {
        const employees = await api.$agency(data.agencyId).findEmployees(data.name, data.role, data.pagination);
        commitSetSearchResults(store, employees);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to search for employee"
          });
        }
      }
    }
  }
};


const { commit, read, dispatch } =
  getStoreAccessors<State, any>("employeeStates");


const mutations = employeeStates.mutations;
export const commitSetEmployees = commit(mutations.setEmployees);
export const commitSetEmployee = commit(mutations.setEmployee);
export const commitSetSearchResults = commit(mutations.setSearchResults);
export const commitResetState = commit(mutations.resetState);

const actions = employeeStates.actions;
export const dispatchGetEmployees = dispatch(actions.getEmployees);
export const dispatchGetEmployee = dispatch(actions.getEmployeeById);
export const dispatchSearchEmployee = dispatch(actions.searchEmployee);
export const dispatchCreateEmployee = dispatch(actions.createEmployee);
export const dispatchUpdateEmployee = dispatch(actions.updateEmployee);

const getters = employeeStates.getters;
export const getEmployees = read(getters.employees);
export const getEmployee = read(getters.employee);
export const getSearchResults = read(getters.searchResults);
