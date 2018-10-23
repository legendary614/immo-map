<template>
    <div v-if="loaded">
        <template v-if="$route.name === 'Register' && !invitationMode">
            <div class="bg-white pulldown">
                <div class="content content-boxed overflow-hidden">
                    <div class="row">
                        <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                            <div class="push-30-t animated fadeIn">
                                <div class="text-center">
                                    <img src="../../../static/img/misc/immosparrow_little.png" alt="ImmoSparrow" title="ImmoSparrow" />
                                    <p class="text-muted push-15-t">Full transparency for your properties</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12 padding-b-30" v-if="step !== -1">
                            <div class="animated fadeIn" v-if="step === 0">
                                <div class="col-xs-12 text-center">
                                    <div class="push-15-t"> You've been invited to the {{ invitation.agencyName }} agency</div>
                                    <p class="text-muted font-s-12"> Invited by {{ invitation.request.senderName }} </p>
                                </div>
                                <div class="col-xs-6 text-right">
                                    <button class="btn btn-minw btn-default" type="button" @click="step = -1">Reject</button>
                                </div>
                                <div class="col-xs-6 text-left">
                                    <button class="btn btn-minw btn-info" type="button" @click="step = 1">Accept</button>
                                </div>
                            </div>
                            <div class="animated fadeIn" v-if="step === 1">
                                <div class="col-xs-12 text-center">
                                    <div class="text-muted font-s-12"> Send a message to {{ invitation.request.senderName }} </div>
                                </div>
                                <div class="col-xs-4"></div>
                                <div class="col-xs-4 input-group margin-b-10 padding-top-15">
                                    <input class="form-control" v-model="message" type="message" id="message" name="message" placeholder="Message">
                                    <span class="input-group-btn">
                                        <button class="btn btn-default" type="button" @click="redirectToRegisterLogin()">
                                            <i class="fa fa-arrow-right"></i>
                                        </button>
                                    </span>
                                </div>
                                <div class="col-xs-4"></div>
                                <div class="col-xs-12 text-center text-muted font-s-12">
                                    <a type="button" @click="redirectToRegisterLogin()">Skip</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pulldown push-30-t text-center animated fadeInUp">
                <small class="text-muted"><span class="js-year-copy"></span> &copy; ImmoSparrow 1.0</small>
            </div>
        </template>
        <login v-show="invitationMode" :invitationMode="invitationMode" @register="register(...arguments)" @acceptInvitation="acceptInvitation()"></login>
    </div>
</template>
