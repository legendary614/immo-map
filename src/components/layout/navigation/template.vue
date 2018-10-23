<template>
  <div id="cssmenu">
    <ul>
      <li>
        <router-link to="/" class="h5 text-white padding-l-15">
          <img src="../../../assets/favicons/favicon-32x32.png" alt="ImmoSparrow"
               title="ImmoSparrow"/>
        </router-link>
      </li>
      <li class="has-sub" v-show-submenu>
        <a href="javascript: void(0)">
          <img class="menuIcons"
               :src="$route.path === '/users' || $route.path === '/agencies' ? '../../../../static/img/icons/settings.png' : '../../../../static/img/icons/settings inactive.png'"/>
        </a>
        <ul class="sub">
          <li>
            <a href="javascript: void(0)" class="lead_item has_submenu"><span>Admin</span></a>
            <router-link to="/agencies" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Agencies</span>
            </router-link>
            <router-link to="/users" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Users</span>
            </router-link>
          </li>
        </ul>
      </li>

      <li class="has-sub" v-show-submenu v-if="$store.getters['agencyStates/agency'].primaryInfo.name">
        <a href="#">
          <img class="menuIcons"
               :src="$route.path === '/employees' ? '../../../../static/img/icons/Agencies.png' : '../../../../static/img/icons/Agencies inactive.png'"/>
        </a>
        <ul class="sub">
          <li>
            <a href="javascript: void(0)"
               class="lead_item has_submenu"><span>{{ $store.getters['agencyStates/agency'].primaryInfo['name'] }}</span></a>
            <router-link to="/profiles" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Profile</span>
            </router-link>
            <router-link to="/employees" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Employees</span>
            </router-link>
            <router-link to="/workspaces" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Workspaces</span>
            </router-link>
          </li>
        </ul>
      </li>
      <li class="has-sub rest" v-show-submenu>
        <router-link to="/" :exact="true">
          <img class="menuIcons"
               :src="$route.path === '/' ? '../../../../static/img/icons/Dashboard.png' : '../../../../static/img/icons/Dashboard inactive.png'"/>
        </router-link>
        <ul class="sub">
          <li>
            <router-link to="/" :exact="true">
              <span
                class="sidebar-mini-hide">Dashboard</span>
            </router-link>
          </li>
        </ul>

      </li>
      <li class="has-sub" v-show-submenu>
        <router-link to="/search" :exact="true">
          <img class="menuIcons"
               :src="$route.path === '/search' ? '../../../../static/img/icons/Lupe.png' : '../../../../static/img/icons/Lupe inactive.png'"/>
        </router-link>
        <ul class="sub">
          <li>
            <router-link to="/search" :exact="true">
              Search
            </router-link>
          </li>
        </ul>
      </li>

      <li class="has-sub" v-show-submenu>

        <router-link to="/inbox" :exact="true">
          <img class="menuIcons"
               :src="$route.path === '/inbox' ? '../../../../static/img/icons/Inbox.png' : '../../../../static/img/icons/Inbox inactive.png'"/>
        </router-link>
        <ul class="sub">
          <li>
            <router-link to="/inbox" :exact="true">
              Inbox
            </router-link>
          </li>
        </ul>
      </li>

      <li class="has-sub" v-show-submenu>
        <a href="#">
          <img class="menuIcons"
               :src="$route.path === '/transparency' || $route.path === '/market-radar/ads' ? '../../../../static/img/icons/Market Radar.png' : '../../../../static/img/icons/Market Radar inactive.png'"/>
        </a>
        <ul class="sub">
          <li>
            <a href="javascript: void(0)" class="lead_item has_submenu">Market radar</a>
            <router-link to="/transparency" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Transparency</span>
            </router-link>
            <router-link to="/competitors" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Competitors</span>
            </router-link>
            <router-link to="/market-radar/ads" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Ads</span>
            </router-link>
            <router-link to="/areas" :exact="true" class="text-white">
              <span class="sidebar-mini-hide">Areas</span>
            </router-link>
          </li>
        </ul>

      </li>

    </ul>
  </div>
</template>
<style scoped lang="scss">
  .menuIcons {
    height: 26px;
    display: inline-block;
    min-width: 14px;
  }

  .submenuList {
    padding-left: 41px !important;
    li {
      a {
        padding-top: 10px !important;
        padding-bottom: 10px !important;
      }
    }
  }

  .side-content {
    padding: 13px 20px 1px 8px !important;
  }

  .vb-content {
    height: 100vh !important;
  }

  .nav-main a {
    padding: 17px 28px !important;
  }

  #cssmenu {
    padding: 0;
    margin: 0;
    border: 0;
    line-height: 1;

    width: 60px;
    zoom: 1;
    position: absolute;
    font-size: 12px;
    left: 0;
    height: 100%;
    background-color: #2c343f;
    top: 0;
    z-index: 2312 !important;

  }

  #cssmenu ul,
  #cssmenu ul li,
  #cssmenu ul ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #cssmenu ul {
    position: relative;
    z-index: 9999999999999;
    float: left;
  }

  #cssmenu ul li {
    float: left;
    min-height: 1px;
    line-height: 1em;
    vertical-align: middle;
    position: relative;
  }

  #cssmenu ul li.hover,
  #cssmenu ul li:hover {
    position: relative;
    z-index: 599;
    cursor: default;
  }

  #cssmenu ul ul {
    visibility: hidden;
    position: absolute;
    top: 100%;
    left: 0px;
    z-index: 598;
    width: 100%;
  }

  #cssmenu ul ul li {
    float: none;
  }

  #cssmenu ul ul ul {
    top: -2px;
    right: 0;
  }

  #cssmenu ul li:hover > ul {
    //transition-delay: 0.5s;
    //visibility: visible;
  }
  #cssmenu ul ul {
    top: 1px;
    left: 99%;
  }

  #cssmenu ul li {
    float: none;
  }

  #cssmenu ul ul {
    margin-top: 8px;
    margin-left: 1px;

  }

  #cssmenu ul ul li {
    font-weight: normal;
  }

  /* Custom CSS Styles */
  #cssmenu {
    width: 60px;
    zoom: 1;
    font-size: 12px;
  }

  #cssmenu:before {
    content: '';
    display: block;
  }

  #cssmenu:after {
    content: '';
    display: table;
    clear: both;
  }

  #cssmenu a {
    display: block;
    padding: 14px;
    text-align: center;
    color: #ffffff;
    text-decoration: none;
    text-transform: uppercase;
  }
  .sub li > a{
    border-bottom: 1px solid #3a4554;
  }
  .sub li > a:last-child{
    border: none;
  }

  .sub li > a:first-child{
    cursor: default;
  }
  .sub li > a:first-child:hover{
    background-color: #5a636e !important;
  }
  .sub li > a:hover{
    background-color: #3a4554;
  }

  #cssmenu > ul {
    width: 60px;
  }

  #cssmenu ul ul {
    width: 200px;
  }

  #cssmenu > ul > li > a {
    color: #ffffff;
  }

  #cssmenu > ul > li > a:hover {
    color: #ffffff;
  }

  #cssmenu > ul > li.active a {
    background: #1b9bff;
  }

  #cssmenu li {
    position: relative;
  }

  #cssmenu ul ul {
    border: 1px solid #5a636e;

  }

  #cssmenu ul ul a {
    font-size: 12px;
    color: #ffffff;
  }

  #cssmenu ul ul a:hover {
    color: #ffffff;
  }

  #cssmenu ul ul li {
  }

  #cssmenu ul ul li:hover > a {
    color: #ffffff;
  }

  #cssmenu.align-right > ul > li > a {
    border-right: none;
  }

  #cssmenu.align-right {
    float: right;
  }

  #cssmenu.align-right li {
    text-align: right;
  }

  #cssmenu.align-right ul li.has-sub > a:before {
    content: '+';
    position: absolute;
    top: 50%;
    left: 15px;
    margin-top: -6px;
  }

  #cssmenu.align-right ul li.has-sub > a:after {
    content: none;
  }

  #cssmenu.align-right ul ul {
    visibility: hidden;
    position: absolute;
    left: -100%;
    z-index: 598;
    width: 100%;
  }

  .lead_item {
    font-weight: 600;
    border-bottom: 1px solid #5a636e;
  }

  .sub {
    background-color: #2c343f;

    a {
      text-align: left !important;
    }
  }

  .rest {
    margin-top: 20px !important;
  }
  .has_submenu{
    background-color: #5a636e;
  }
  .open_with_delay > ul{
    transition-delay: 0.5s;
    visibility: visible !important;
  }
  .open > ul{
    visibility: visible !important;
  }
  .sub .router-link-exact-active{
    background-color: #3a4554;
  }
</style>
