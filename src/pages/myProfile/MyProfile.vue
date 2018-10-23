<template>
    <main id="main-container" class="profile">
        <div v-bar>
            <div>
                <div class="content bg-gray-lighter">
                    <div class="row items-push">
                        <div class="col-sm-7">
                            <h1 class="page-heading">
                                Profile
                                <!--<small>{{first_name}} {{last_name}}</small>-->
                            </h1>
                        </div>
                    </div>
                </div>
                <div class="content col-lg-6" v-if="loaded">
                    <profile :user_profile="user" :userProfile="true"></profile>
                </div>
            </div>
        </div>
    </main>
</template>
