<template>
    <div>
        <div class="bg-white pulldown">
            <div class="content content-boxed overflow-hidden">
                <div class="row">
                    <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">
                        <div class="push-30-t push-50 animated fadeIn" :class="{ 'has-error' : loginError }">
                            <div class="text-center">
                                <img src="../../../static/img/misc/immosparrow_little.png" alt="ImmoSparrow" title="ImmoSparrow" />
                                <p class="text-muted push-15-t">Full transparency for your properties</p>
                            </div>
                            <form v-show="!register" class="form-horizontal push-30-t animated fadeIn" @submit.prevent="login" data-vv-scope="loginForm">
                                <div class="form-group" :class="{ 'has-error' : errors.has('loginForm.login-username') }">
                                    <div class="col-xs-12">
                                        <div class="form-material form-material-primary floating" :class="{ 'open' : hasEmail }">
                                            <input class="form-control" data-vv-scope="loginForm" v-validate="'required|email'" type="text" id="login-username" name="login-username" v-model="loginInfo.email">
                                            <label for="login-username">Email</label>
                                            <div v-show="errors.has('loginForm.login-username')" class="help-block text-right animated fadeInDown">{{ errors.first('loginForm.login-username') }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group" :class="{ 'has-error' : errors.has('loginForm.login-password') }">
                                    <div class="col-xs-12">
                                        <div class="form-material form-material-primary floating" :class="{ 'open' : hasPassword }">
                                            <input class="form-control" data-vv-scope="loginForm" v-validate="'required'" type="password" id="login-password" name="login-password" v-model="loginInfo.password">
                                            <label for="login-password">Password</label>
                                            <div v-show="errors.has('loginForm.login-password')" class="help-block text-right animated fadeInDown">{{ errors.first('loginForm.login-password') }}</div>
                                            <div v-if="loginError" class="help-block text-right animated fadeInDown">Username and/or Password not valid.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="col-xs-6">
                                        <label class="css-input switch switch-sm switch-primary">
                                            <input type="checkbox" data-vv-scope="loginForm" id="login-remember-me" name="login-remember-me" v-model="loginInfo.persistent"><span></span> Remember Me?
                                        </label>
                                    </div>
                                    <div class="col-xs-6">
                                        <div class="font-s13 text-right push-5-t">
                                            <router-link to="/reminder">
                                                Forgot Password?
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group push-30-t">
                                    <div class="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                                        <button :disabled="loading" class="btn btn-sm btn-block btn-primary" type="submit">
                                            <i v-if="loading" class="fa fa-spinner fa-spin"></i>
                                            <span> Log in</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-xs-12">
                                    <div class="font-s13 text-right">
                                        <div class="text-center padding-b-10">
                                            Don't have an account?
                                        <a type="button" @click="register = true">
                                            Register now
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <form v-show="register" class="form-horizontal push-30-t animated fadeIn" @submit.prevent="registerUser" data-vv-scope="registerForm">
                                <div class="form-group" :class="{ 'has-error' : errors.has('registerForm.register-username') }">
                                    <div class="col-xs-12">
                                        <div class="form-material form-material-primary floating" :class="{ 'open' : registerHasEmail }">
                                            <input class="form-control" data-vv-scope="registerForm" v-validate="'required|email'" type="text" id="register-username" name="register-username" v-model="registerInfo.email">
                                            <label for="register-username">Email</label>
                                            <div v-show="errors.has('registerForm.register-username')" class="help-block text-right animated fadeInDown">{{ errors.first('registerForm.register-username') }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group" :class="{ 'has-error' : errors.has('registerForm.register-password') }">
                                    <div class="col-xs-12">
                                        <div class="form-material form-material-primary floating" :class="{ 'open' : registerHasPassword }">
                                            <input class="form-control" data-vv-scope="registerForm" v-validate="'required'" ref="register-password" type="password" id="register-password" name="register-password" v-model="registerInfo.password">
                                            <label for="register-password">Password</label>
                                            <div v-show="errors.has('registerForm.register-password')" class="help-block text-right animated fadeInDown">{{ errors.first('registerForm.register-password') }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group" :class="{ 'has-error' : errors.has('registerForm.confirm-password') }">
                                    <div class="col-xs-12">
                                        <div class="form-material form-material-primary floating" :class="{ 'open' : registerHasConfirmPassword }">
                                            <input class="form-control" data-vv-scope="registerForm" v-validate="'required|confirmed:register-password'" type="password" id="confirm-password" name="confirm-password" v-model="registerInfo.confirmPassword">
                                            <label for="confirm-password">Confirm password</label>
                                            <div v-show="errors.has('registerForm.confirm-password')" class="help-block text-right animated fadeInDown">{{ errors.first('registerForm.confirm-password') }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group push-30-t">
                                    <div class="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                                        <button :disabled="loading" class="btn btn-sm btn-block btn-primary" type="submit">
                                            <i v-if="loading" class="fa fa-spinner fa-spin"></i>
                                            <span> Register</span>
                                        </button>
                                    </div>
                                </div>
                                 <div class="col-xs-12">
                                    <div class="font-s13 text-right">
                                        <div class="text-center padding-b-10">
                                            Already have an account?
                                        <a type="button" @click="register = false">
                                            Login now
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pulldown push-30-t text-center animated fadeInUp">
            <small class="text-muted"><span class="js-year-copy"></span> &copy; ImmoSparrow 1.0</small>
        </div>
    </div>
</template>
