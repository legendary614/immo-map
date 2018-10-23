<template>
  <div id="app">
    <div id="page-loader" v-if="$store.getters['globalStates_/pageLoader']"></div>
      <!-- TODO PUT IN COMPONENT -->
      <notifications classes="notifClass" group="actions" position="top center">
        <template slot="body" slot-scope="props">
          <div :class="{ 'notif success': props.item.type === 'success', 'notif warn': props.item.type === 'warn', 'notif error': props.item.type === 'error' }">
              <a class="title">
                {{props.item.title}}
              </a>
              <button type="button" class="close" @click="props.close" aria-hidden="true">×</button>
              <div v-html="props.item.text">
              </div>
          </div>
        </template>
        <!-- END PUT IN COMPONENT -->
      </notifications>
    <account-lock v-if="$store.getters['globalStates_/showLock']"/>
    <div id="page-container" class="sidebar-l sidebar-o side-scroll header-navbar-fixed" :class="{'sidebar-mini':!$store.getters['globalStates_/sidebar'], 'sidebar-o-xs': $store.getters['globalStates_/sidebar']}" v-if="!$route.meta.plainLayout && $store.getters['auth_/loggedIn'] && !$store.getters['globalStates_/showLock']">
      <navigation />
      <nav-header />
      <router-view></router-view>
      <nav-footer />
    </div>
    <div v-if="$route.meta.plainLayout">
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped lang="scss">
.notifications {
  padding-top: 15px !important;
  width: 400px !important;
  left: calc(50% - 200px) !important;

  &.notification-wrapper {
    padding-top: 10px !important;
  }
}
.notif {
  padding: 10px;
  margin: 0 5px 5px;
  color: #ffffff;
  font-size: 14px;
  &.warn {
    background-color: #fdf3e5;
    color: #efa231;
    -webkit-box-shadow: 0 2px #fbe8cd;
    box-shadow: 0 2px #fbe8cd;
  }
  &.error {
    background-color: #f9eae8;
    color: #c54736;
    -webkit-box-shadow: 0 2px #f4d8d4;
    box-shadow: 0 2px #f4d8d4;
  }
  &.success {
    background-color: #e0f5e9;
    color: #34a263;
    -webkit-box-shadow: 0 2px #cdefdb;
    box-shadow: 0 2px #cdefdb;
  }
}
.title {
  color: #ffffff;
}
</style>
<style>
  ::-webkit-scrollbar {
    display: none !important;
  }
</style>
