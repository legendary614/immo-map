import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "./../../store/modules/globalStates_";

import { ActionContext } from "vuex";
import { IPagination } from "@immosparrow/cockpit-api-v2";

class State {
  workspaces: api.IEntitySearchResult<api.IWorkspaceLightModel>;
  workspace: api.IWorkspaceModel;
  searchResults: api.IEntitySearchResult<api.IWorkspaceLightModel>;
  workspaceEmployees: api.IWorkspaceEmployeeModel[];
}

const state: State = {
  workspaces: null,
  workspace: new api.WorkspaceModel,
  searchResults: null,
  workspaceEmployees: null
};

class SearchQuery {
    name: string;
    pagination: api.IPagination;
    agencyId: string;
}
class CreateWorkspaceModel {
    agencyId: string;
    data: api.IWorkspaceModel;
}
class AddEmployeeModel {
  workspaceId: string;
  employeeIdOrEntity: string;
  role: api.WorkspaceEmployeeRole;
  enabled: boolean;
}
class RemoveEmployeeModel {
  workspaceId: string;
  employeeIdOrEntity: string;
}

export const workspaceStates = {
  namespaced: true,

  state,
  getters: {
    workspaces: (state: State) => {
      return state.workspaces;
    },
    workspace: (state: State) => {
      return state.workspace;
    },
    searchResults: (state: State) => {
      return state.searchResults;
    },
    workspaceEmployees: (state: State) => {
      return state.workspaceEmployees;
    }
  },
  mutations: {
    setWorkspaces (state: State, workspaces: api.IEntitySearchResult<api.IWorkspaceLightModel>) {
      state.workspaces = workspaces;
    },
    setWorkspace (state: State, workspace: api.IWorkspaceModel) {
      state.workspace = workspace;
    },
    setSearchResults (state: State, searchResults: api.IEntitySearchResult<api.IWorkspaceLightModel>) {
      state.searchResults = searchResults;
    },
    setWorkspaceEmployees (state: State, workspaceEmployees: api.IWorkspaceEmployeeModel[]) {
      state.workspaceEmployees = workspaceEmployees;
    },
    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {

    async getWorkspaces (context: ActionContext<State, any>, data: SearchQuery) {

      try {
        const workspaceList = await api.$agency(data.agencyId).findWorkspaces(data.name, data.pagination);
        commitSetWorkspaces(context, workspaceList);
      }
      catch (err) {

        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get workspaces"
          });
        }
      }
    },
    async getWorkspaceById (context: ActionContext<State, any>, workspaceId: string) {
      try {

        const workspace = await api.$workspace(workspaceId).get();
        commitSetWorkspace(context, workspace);
        return workspace;
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to get workspace"
          });
        }
      }
    },
    async createWorkspace (context: ActionContext<State, any>, data: CreateWorkspaceModel) {
        const newWorkspace: api.Workspace = await api.$agency(data.agencyId).createWorkspace(data.data);
        const workspace: api.IWorkspaceModel = await newWorkspace.get();
        return workspace;
    },
    async updateWorkspace (context: ActionContext<State, any>, data: api.IWorkspaceModel) {

      try {
        await api.$workspace(data.id).update(data);

        setTimeout(() => {
          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "Workspace was updated"
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
            text: "Workspace was not updated successfully"
          });
        }
      }
    },
    async searchWorkspace (context: ActionContext<State, any>, data: SearchQuery) {
      try {
        const workspaces = await api.$agency(data.agencyId).findWorkspaces(data.name, data.pagination);
        commitSetSearchResults(store, workspaces);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to search for workspace"
          });
        }
      }
    },
    async getWorkspaceEmployees (context: ActionContext<State, any>, workspaceId: string) {
      try {
        const employees = await api.$workspace(workspaceId).getEmployees();
        return employees;
        // commitSetWorkspaceEmployees(context, employees);
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
    async setEmployee (context: ActionContext<State, any>, data: AddEmployeeModel) {
      try {
        return await api.$workspace(data.workspaceId).setEmployee(data.employeeIdOrEntity, data.role, data.enabled);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to set employee"
          });
        }
      }
    },
    async removeEmployee (context: ActionContext<State, any>, data: RemoveEmployeeModel) {
      try {
        return await api.$workspace(data.workspaceId).removeEmployee(data.employeeIdOrEntity);
      }
      catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to remove employee"
          });
        }
      }
    },
  }
};


const { commit, read, dispatch } =
  getStoreAccessors<State, any>("workspaceStates");


const mutations = workspaceStates.mutations;
export const commitSetWorkspaces = commit(mutations.setWorkspaces);
export const commitSetWorkspace = commit(mutations.setWorkspace);
export const commitSetSearchResults = commit(mutations.setSearchResults);
export const commitResetState = commit(mutations.resetState);
export const commitSetWorkspaceEmployees = commit(mutations.setWorkspaceEmployees);

const actions = workspaceStates.actions;
export const dispatchGetWorkspaces = dispatch(actions.getWorkspaces);
export const dispatchGetWorkspace = dispatch(actions.getWorkspaceById);
export const dispatchSearchWorkspace = dispatch(actions.searchWorkspace);
export const dispatchCreateWorkspace = dispatch(actions.createWorkspace);
export const dispatchUpdateWorkspace = dispatch(actions.updateWorkspace);
export const dispatchGetWorkspaceEmployees = dispatch(actions.getWorkspaceEmployees);
export const dispatchSetEmployee = dispatch(actions.setEmployee);
export const dispatchRemoveEmployee = dispatch(actions.removeEmployee);

const getters = workspaceStates.getters;
export const getWorkspaces = read(getters.workspaces);
export const getWorkspace = read(getters.workspace);
export const getSearchResults = read(getters.searchResults);
export const getWorkspaceEmployees = read(getters.workspaceEmployees);
