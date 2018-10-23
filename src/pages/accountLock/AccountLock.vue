<template>
 <div class="bg-white pulldown">
    <div class="content content-boxed overflow-hidden">
        <div class="row">
            <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                <div class="push-50-t push-50 animated fadeIn">
                    <div class="text-center">
                        <img class="img-avatar img-avatar96" src="static/img/avatars/avatar10.jpg" alt="">
                    </div>
                    <form class="js-validation-lock form-horizontal push-50-t" @submit.prevent="login">
                        <div class="form-group" :class="{ 'has-error' : errors.has('lock-password') || loginError }">
                            <div class="col-xs-12">
                                <div class="form-material form-material-primary">
                                    <input class="form-control" v-model="password" v-validate="'required'" type="password" id="lock-password" name="lock-password" placeholder="Please enter your password">
                                    <label for="lock-password">Password</label>
                                    <div v-show="errors.has('lock-password')" class="help-block text-right animated fadeInDown">{{ errors.first('lock-password') }}</div>
                                    <div v-if="loginError" class="help-block text-right animated fadeInDown">Password not valid.</div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-12 col-sm-6 col-sm-offset-3">
                                <button :disabled="loading" class="btn btn-sm btn-block btn-default" type="submit">
                                    <i v-if="loading" class="fa fa-spinner fa-spin"></i>
                                    <span> Unlock Account</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<style scoped>
  .error {
    color: #d26a5c;
  }
</style>
