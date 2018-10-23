import { getStoreAccessors } from "vuex-typescript";
import Vue from "vue";
import * as api from "@immosparrow/cockpit-api-v2";
import store from "../../store";
import * as globalState from "./../../store/modules/globalStates_";

import { ActionContext } from "vuex";

class Invitation {
    invitationRequest: api.IInvitationRequest;
    id: string;
    email: string;
}
class AcceptInvitation {
  response: api.IInvitationResponse;
  secretId: string;
}

class State {
}

const state: State = {
};

export const invitationModule = {
  namespaced: true,

  state,
  getters: {
  },
  mutations: {
    resetState: (s: State) => {
      const initial = state;
      Object.keys(initial).forEach(key => { s[key] = initial[key]; });
    },
  },
  actions: {
    async sendOwnerInvitation (context: ActionContext<State, any>, data: Invitation) {
      try {
        const res = await api.$agency(data.id).sendOwnerInvitation(data.email, data.invitationRequest);
        setTimeout(() => {
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "Invitation was sent successfully"
          });
        }, 1000);
        return res;
       }
       catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to send an invitation"
          });
        }
      }
    },
    async cancelOwnerInvitation (context: ActionContext<State, any>, agencyId: string) {
      try {
        const res = await api.$agency(agencyId).cancelOwnerInvitation();
        setTimeout(() => {
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "Invitation was canceled successfully"
          });
        }, 1000);
        return res;
       }
       catch (err) {
        if (err.status === 401) {
          globalState.commitSetShowLock(store, true);
        } else {
          Vue.prototype.$notify({
            group: "actions",
            type: "error",
            duration: 2500,
            text: "Error while trying to cancel an invitation"
          });
        }
      }
    },
    async sendOwnershipTransferInvitation (context: ActionContext<State, any>, data: Invitation) {
      try {
        await api.$agency(data.id).sendOwnershipTransferInvitation(data.email, data.invitationRequest);
        setTimeout(() => {
            globalState.commitSetLoadingButton(store, false);
            Vue.prototype.$notify({
              group: "actions",
              type: "success",
              duration: 2500,
              text: "Ownership transfer invitation was sent successfully"
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
            text: "Error while trying to send an invitation"
          });
        }
      }
    },
    async cancelOwnershipTransferInvitation (context: ActionContext<State, any>, agencyId: string) {
      try {
        await api.$agency(agencyId).cancelOwnershipTransferInvitation();
        setTimeout(() => {
            globalState.commitSetLoadingButton(store, false);
            Vue.prototype.$notify({
              group: "actions",
              type: "success",
              duration: 2500,
              text: "Ownership transfer invitation was canceled successfully"
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
            text: "Error while trying to cancel an invitation"
          });
        }
      }
    },
    async sendInvitation (context: ActionContext<State, any>, data: Invitation) {
      try {
        await api.$employee(data.id).sendInvitation(data.email, data.invitationRequest);
        setTimeout(() => {
            globalState.commitSetLoadingButton(store, false);
            Vue.prototype.$notify({
              group: "actions",
              type: "success",
              duration: 2500,
              text: "Ownership transfer invitation was sent successfully"
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
            text: "Error while trying to send an invitation"
          });
        }
      }
    },
    async cancelInvitation (context: ActionContext<State, any>, employeeId: string) {
      try {
        await api.$employee(employeeId).cancelInvitation();
        setTimeout(() => {
            globalState.commitSetLoadingButton(store, false);
            Vue.prototype.$notify({
              group: "actions",
              type: "success",
              duration: 2500,
              text: "Invitation was canceled successfully"
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
            text: "Error while trying to cancel an invitation"
          });
        }
      }
    },
    async getAgencyOwnerInvitation (context: ActionContext<State, any>, secretId: string) {
      try {
        const res: api.IRecipientOrgInvitationModel = await api.$anonymousUser.invitations.getAgencyOwnerInvitation(secretId);
        return res;
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
            text: "Error while trying to get an invitation"
          });
        }
      }
    },
    async getEmployeeInvitation (context: ActionContext<State, any>, secretId: string) {
      try {
        const res: api.IRecipientOrgInvitationModel = await api.$anonymousUser.invitations.getEmployeeInvitation(secretId);
        return res;
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
            text: "Error while trying to get an invitation"
          });
        }
      }
    },
    async getAgencyOwnershipTransferInvitation (context: ActionContext<State, any>, secretId: string) {
      try {
        const res: api.IRecipientOrgInvitationModel =  await api.$anonymousUser.invitations.getAgencyOwnershipTransferInvitation(secretId);
        return res;
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
            text: "Error while trying to get an invitation"
          });
        }
      }
    },
    async acceptOwnerInvitation (context: ActionContext<State, any>, data: AcceptInvitation) {
      try {
        await api.$authUser.invitations.acceptAgencyOwnerInvitation(data.secretId, data.response);
        setTimeout(() => {
          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "You have accepted the owner invitation"
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
            text: "Error while trying to accept an invitation"
          });
        }
      }
    },
    async acceptEmployeeInvitation (context: ActionContext<State, any>, data: AcceptInvitation) {
      try {
        await api.$authUser.invitations.acceptEmployeeInvitation(data.secretId, data.response);
        setTimeout(() => {
          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "You have accepted the employee invitation"
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
            text: "Error while trying to accept an invitation"
          });
        }
      }
    },
    async acceptOwnershipTransferInvitation (context: ActionContext<State, any>, data: AcceptInvitation) {
      try {
        await api.$authUser.invitations.acceptAgencyOwnershipTransferInvitation(data.secretId, data.response);
        setTimeout(() => {
          globalState.commitSetLoadingButton(store, false);
          Vue.prototype.$notify({
            group: "actions",
            type: "success",
            duration: 2500,
            text: "You have accepted the ownership transfer invitation"
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
            text: "Error while trying to accept an invitation"
          });
        }
      }
    }
  }
};


const { commit, read, dispatch } =
  getStoreAccessors<State, any>("invitationModule");

const actions = invitationModule.actions;
export const dispatchSendOwnerInvitation = dispatch(actions.sendOwnerInvitation);
export const dispatchSendInvitation = dispatch(actions.sendInvitation);
export const dispatchSendOwnershipTransferInvitation = dispatch(actions.sendOwnershipTransferInvitation);
export const dispatchCancelOwnerInvitation = dispatch(actions.cancelOwnerInvitation);
export const dispatchCancelInvitation = dispatch(actions.cancelInvitation);
export const dispatchCancelOwnershipTransferInvitation = dispatch(actions.cancelOwnershipTransferInvitation);
export const dispatchGetOwnerInvitation = dispatch(actions.getAgencyOwnerInvitation);
export const dispatchGetEmployeeInvitation = dispatch(actions.getEmployeeInvitation);
export const dispatchGetOwnershipTransferInvitation = dispatch(actions.getAgencyOwnershipTransferInvitation);
export const dispatchAcceptOwnerInvitation = dispatch(actions.acceptOwnerInvitation);
export const dispatchAcceptEmployeeInvitation = dispatch(actions.acceptEmployeeInvitation);
export const dispatchAcceptOwnershipTransferInvitation = dispatch(actions.acceptOwnershipTransferInvitation);
