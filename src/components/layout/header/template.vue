<template>
  <header id="header-navbar" class="content-mini content-mini-full">
    <ul class="nav-header pull-right">
      <li>
        <div class="btn-group">
          <button class="btn btn-default btn-image dropdown-toggle" data-toggle="dropdown" type="button">
            <img src="../../../../static/img/avatars/avatar10.jpg" alt="Avatar"/>
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right">
            <li class="dropdown-header">{{user.fullName}}</li>

            <li>
              <router-link to="/profile" exact>
                <i class="si si-user pull-right"></i>Profile
              </router-link>
            </li>
            <template v-if="false">
              <li class="dropdown-header">Agencies</li>
              <li v-for="(agency, index) in agencies" :key="index">
                <a type="button" @click="selectAgency(agency)">
                  <!-- <i v-if="$store.getters['globalStates_/currentWorkspace'] === workspace"
                    class="si si-check pull-right"></i> --> {{ agency }}
                </a>
              </li>
              <li class="divider"></li>
            </template>
            <li>
              <router-link to="/logout" exact>
                <i class="si si-logout pull-right"></i>Log out
              </router-link>

            </li>
          </ul>
        </div>
      </li>

    </ul>
    <ul class="nav-header pull-left">

      <li>
        <intercom/>
      </li>

      <li class="visible-xs">
        <button class="btn btn-default" v-on:click="showSearch ? showSearch = false:showSearch = true"
                data-class="header-search-xs-visible" type="button">
          <i class="fa fa-search"></i>
        </button>
      </li>
      <li class="js-header-search header-search" v-bind:class="{showSearch:showSearch}">
        <div class="form-horizontal">
          <div class="form-material form-material-primary input-group remove-margin-t remove-margin-b width100percent">
            <autocomplete ref="autocomplete" :setData="setStreet" :onSearch="searchAllModules" :no="70"
                          :item_highlighted="'highlightedName'">
              <template slot="products" slot-scope="{ item }">
                <span class="product_small">
                  {{get_icon(item.suggestionType)}}
                </span>
                <span v-for="product in get_products(item.suggestionType)" v-bind:key="product"
                      v-on:mousedown="setProduct(item, product, get_products(item.suggestionType));"
                      class="btn btn-warning product">
                  {{product.charAt(0).toUpperCase()}}
                </span>
              </template>
            </autocomplete>
          </div>
        </div>
      </li>
      <li>
        <h6 class="push-10-t">{{ $store.getters['globalStates_/currentWorkspace'] }}</h6>
      </li>
    </ul>
  </header>
</template>

<style>
  .product_small {
    padding-right: 5px;
    color: #ccc;
    font-size: 11px
  }

  #header-navbar {
    height: 60px !important;
  }

  .open-indicator, .clear {
    display: none !important;
  }

  .nav-header .header-search {
    min-width: 360px;
    max-width: 800px;
  }

  .show_search {
    display: inherit !important;
  }

  .product {
    padding: 2px !important;
    font-size: 10px;
    float: right;
    margin-top: 6px;
    margin-right: 5px;
  }

  .autocomplete__box ul li {
    line-height: 32px;
  }

  .fi {
    margin-right: 10px;
  }
  a{
    cursor: pointer;
  }
  .content-mini{
    padding: 13px 23px 1px !important;
  }
</style>
