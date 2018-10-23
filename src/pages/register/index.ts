import Vue from "vue";
import { Component } from "vue-property-decorator";
import register from "./Register.vue";
import store from "../../store";
import * as invitationModule from "../../store/modules/invitations";
import * as auth from "../../store/modules/auth_";
import { IRecipientOrgInvitationModel, RecipientOrgInvitationModel,
    IInvitationResponse, InvitationResponse, IUserProfileModel, UserProfileModel,
    IUserRegistrationProof, UserRegistrationProof } from "@immosparrow/cockpit-api-v2";
import Login from "../login";
import * as api from "@immosparrow/cockpit-api-v2";

export interface AcceptInvitationModel {
    response: IInvitationResponse;
    secretId: string;
}
@Component({
  mixins: [register],
  components: {
    Login
  }
})
export default class Register extends Vue {

    step: number = 0;
    invitation: IRecipientOrgInvitationModel  = new RecipientOrgInvitationModel();
    loaded: boolean = false;
    acceptInvitationData: AcceptInvitationModel = {
        response: new InvitationResponse(),
        secretId: ""
    };
    message: string = "";
    invitationMode: boolean = false;
    profile: IUserProfileModel = api.$newObj(api.UserProfileModel);
    proof: api.IUserRegistrationProof = api.$newObj(api.UserRegistrationProof);

    created () {
        let invitationType = this.$route.query.type;
        let secretId = this.$route.query.secretId;
        switch (invitationType) {
            case "21":
                invitationModule.dispatchGetOwnerInvitation(store, secretId)
                    .then(res => {
                        this.invitation = res;
                        this.loaded = true;
                    });
                break;
            case "22":
                invitationModule.dispatchGetEmployeeInvitation(store, secretId)
                .then(res => {
                    this.invitation = res;
                    this.loaded = true;
                });
                break;
            case "31":
                invitationModule.dispatchGetOwnershipTransferInvitation(store, secretId)
                .then(res => {
                    this.invitation = res;
                    this.loaded = true;
                });
                break;
        }
    }

    redirectToRegisterLogin () {
        if (auth.getLoggedIn(store)) {
            this.acceptInvitation();
        } else {
            this.invitationMode = true;
        }
    }

    register (email: string, password: string) {
        this.profile = api.$newObj(api.UserProfileModel);
        this.profile.email = email;
        this.proof.invitationSecretId = this.$route.query.secretId;
        let registerModel = {
            password: password,
            profile: this.profile,
            proof: this.proof
        };
        auth.dispatchRegisterUser(store, registerModel)
        .then(res => {
            switch (res) {
                case 0:
                    Vue.prototype.$notify({
                        group: "actions",
                        type: "success",
                        duration: 2500,
                        text: "You have registered successfully"
                    });
                    this.acceptInvitation();
                break;
                case 1:
                    Vue.prototype.$notify({
                        group: "actions",
                        type: "error",
                        duration: 2500,
                        text: "Another user with the same e-mail exists"
                    });
                break;
                case 2:
                    Vue.prototype.$notify({
                        group: "actions",
                        type: "error",
                        duration: 2500,
                        text: "Invalid invitation secret ID or the invitation was already used to register a user"
                    });
                break;
            }
        });
    }

    acceptInvitation () {
        let invitationType = this.$route.query.type;
        this.acceptInvitationData.secretId = this.$route.query.secretId;
        this.acceptInvitationData.response.message = this.message;

        switch (invitationType) {
            case "21":
                invitationModule.dispatchAcceptOwnerInvitation(store, this.acceptInvitationData)
                    .then(res => {
                        this.loaded = true;
                        this.$root.$emit("stopLoading");
                        this.$router.push({ name: "Dashboard" });
                    });
                break;
            case "22":
                invitationModule.dispatchAcceptEmployeeInvitation(store, this.acceptInvitationData)
                .then(res => {
                    this.loaded = true;
                    this.$root.$emit("stopLoading");
                    this.$router.push({ name: "Dashboard" });
                });
                break;
            case "31":
                invitationModule.dispatchAcceptOwnershipTransferInvitation(store, this.acceptInvitationData)
                .then(res => {
                    this.loaded = true;
                    this.$root.$emit("stopLoading");
                    this.$router.push({ name: "Dashboard" });
                });
                break;
        }
    }
}
