<template>
  <div class="searchSidebar">
    <aside id="side-overlay" class="active">
      <button @click="searchSidebarToggle()" class="btn btn-default pull-right side-overlay--button" type="button">
        <i class="fa fa-arrow-left"></i>
      </button>
      <div class="pull-right side-overlay--button bg-white nav_h">
        <a class="btn" v-on:click="toggle('search')" v-bind:class="{active: tabs['search']}">
          <span class="fa fa-search"></span>
        </a><br>
        <a class="btn" v-on:click="toggle('bookmarks')" v-bind:class="{active: tabs['bookmarks']}">
          <span class="fa fa-star"></span>
        </a><br>
        <a class="btn" v-on:click="toggle('history')" v-bind:class="{active: tabs['history']}">
          <span class="fa fa-history"></span>
        </a>
      </div>
      <div class="side-overlay--inner" v-bar>
        <div>
          <div class="side-content remove-padding-t">
            <div class="block-content tab-content" v-bind:class="{'hidden':!tabs['search']}">
              <div class="tab-pane fade fade-right in active">
                <div class="block pull-r-l">
                  <div class="block-content block-content-narrow">
                    <form class="form-horizontal push-10-t" data-vv-scope="profile_form" >
                      <h2 class="content-heading">
                        <i class="fa fa-map-marker"></i> Search</h2>
                      <div class="form-group">
                        <div class="col-xs-12">
                          <div class="input-group">
                            <span class="input-group-addon">
                              <i class="fa fa-map-marker"></i>
                            </span>

                            <autocomplete ref="autocomplete_search" class="ac" :setData="setStreet" :onSearch="getSearchSuggestions" :item_highlighted="'highlightedName'">
                              <template slot="products" slot-scope="{ item }">
                                <span class="suggestion_type">{{get_icon(item.suggestionType)}}</span>
                              </template>
                            </autocomplete>
                          </div>
                          <span v-if="adsAddress.name != undefined">
                            <span class="multiselect__tag margin-t-10" v-bind:key="adsAddress.uniqueidentifier">
                              <span>
                                <i v-show="$store.getters['search_/addressLoading']" class="fa fa-spinner fa-spin"></i>
                                <span class="address_remove" v-on:click="setStreet(adsAddress, 200)">{{adsAddress.name}}</span>
                              </span>
                              <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" v-on:click="remove_address_item()"></i>
                              <i aria-hidden="true" tabindex="1" v-bind:class="{'fa fa-star': isAddressBookmarked(adsAddress),  'fa fa-star-o': !isAddressBookmarked(adsAddress)}" v-on:click="bookmark(adsAddress)"></i>
                            </span>
                            <label class="css-input css-checkbox css-checkbox-primary">
                              <input type="checkbox" v-model="simulateMultiple"><span></span> DEV only: Simulate multiple object on the address
                            </label>
                          </span>
                        </div>
                      </div>
                      <div class="form-group" v-if="adsAddress.name != undefined">
                        <div class="col-xs-12">
                          <h2 class="content-heading">
                            Include data in
                            <ul class="nav-header pull-right" style="position: relative">
                              <li>
                                <div>
                                  <a data-toggle="dropdown" style="color: #666;" v-on:click="menuOpened = !menuOpened"> <i class="fa fa-pencil"> </i> {{selectedGeoSearchOption}} <i v-bind:class="{'si si-arrow-up': menuOpened, 'si si-arrow-down': !menuOpened }"></i></a>

                                  <ul class="dropdown-menu dropdown-menu-right cstm">
                                    <li class="dropdown-header">{{selectedGeoSearchOption}}</li>
                                    <li class="divider"></li>
                                    <li class="dropdown-header" v-for="geo_search_option in geoSearchOptions" v-bind:key="geo_search_option" v-on:click="selectedGeoSearchOption = geo_search_option" v-if="selectedGeoSearchOption != geo_search_option">
                                      <span v-if="selectedGeoSearchOption != geo_search_option">{{geo_search_option}}</span>
                                    </li>
                                  </ul>
                                </div>
                              </li>

                            </ul>
                          </h2>
                          <div class="input-group" v-if="selectedGeoSearchOption == 'Radius'">
                            <label class="col-xs-12 control-label custom_label_left" for="radius">Radius</label>
                            <span class="input-group-addon">
                                <i class="fa fa-circle-o"></i>
                              </span>
                            <input class="form-control" placeholder="Please enter yards" type="number" id="radius" name="yards" v-model="radius" data-vv-scope="profile_form" v-validate="'numeric'">
                            <span class="km_helper">Km</span>
                            <div v-show="errors.has('profile_form.redius')" class="help-block text-left animated fadeInDown"> Please enter a number
                            </div>
                          </div>

                          <div class="input-group" v-if="selectedGeoSearchOption == 'Locality'">
                            <p style="color: #ccc">Data in Locality is included</p>
                          </div>
                          <div class="input-group" v-if="selectedGeoSearchOption == 'Commune'">
                            <p style="color: #ccc">Data in Commune is included</p>
                          </div>
                          <div class="input-group" v-if="selectedGeoSearchOption == 'Viewport'">

                              <img v-if="adsAddress.name != undefined" style="width: 100%" alt='static Mapbox map of the San Francisco bay area' v-bind:src="viewport" >
                          </div>
                          <div v-if="shapes.length == 0 && selectedGeoSearchOption == 'Draw manually'" class="text-center">Plase use map draw tools.</div>
                          <div class="form-group" v-else>
                            <div v-hide-multiselect-elements class="col-sm-12">
                              <span v-for="(a, index) in shapes" class="multiselect__tag" v-bind:style="stc(a.color)"
                                    v-bind:key="a.name" v-on:click="remove_shape(a.id, index)"><span>{{a.name}}</span>
                                  <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i>
                                </span>
                            </div>

                            <div class="tags_holder_helper col-sm-12" v-remove-multi-tag-holder>and <span></span> more</div>
                            <div class="tags_holder_helper_less col-sm-12" v-show-multi-tag-holder>Show less</div>
                          </div>
                        </div>
                      </div>

                      <!--<div class="form-group">
                        <div class="col-xs-12">
                          1’234’567

                        </div>
                      </div>-->
                      <div class="form-group" v-if="adsAddress.name != undefined">
                        <div class="col-xs-12">
                          <h2 class="content-heading">Pricing info</h2>
                          <div class="input-group width100percent">
                            <label class="css-input css-radio css-radio-primary">
                              <input type="radio" v-model="similar" value="price"><span></span> Similar price
                            </label>

                            <div class=" pull-right width150">
                              <div class="input-group">
                                <span class="input-group-addon">+/-</span>
                                <input class="form-control" type="number" v-model="similarPriceSelected" placeholder="..">
                                <span class="input-group-addon">%</span>
                              </div>
                            </div>

                            <label class="css-input css-radio css-radio-primary">
                              <input type="radio" v-model="similar" value="features"><span></span> Similar features
                            </label>
                          </div>
                        </div>
                      </div>

                      <div class="form-group" v-if="adsAddress.name != undefined">

                        <div class="col-xs-12">
                          <h2 class="content-heading">Ads info</h2>
                          <div class="input-group width100percent">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="activeAds"><span></span> Active ads
                              </label>
                            <label class="css-input css-checkbox css-checkbox-primary padding-l-7">
                              <input type="checkbox" v-model="historicAds"><span></span> Historic ads
                            </label>
                          </div>
                        </div>
                      </div>

                      <div class="form-group" v-if="historicAds">

                        <div class="col-xs-12">
                          <h2 class="content-heading">Years period</h2>
                          <div class="col-md-6 padding-l-0">
                            <multiselect class="pull-left"
                                         v-model="yearsOptionsFrom"
                                         label="text"
                                         openDirection="bottom"
                                         placeholder="Plase select"
                                         :options="yearsOptions"
                                         :show-labels="false"
                                         :clear-on-select="false">
                            </multiselect>
                          </div>
                          <div class="col-md-6 padding-r-0">
                            <multiselect class="pull-right"
                                         v-model="yearsOptionsTo"
                                         label="text"
                                         openDirection="bottom"
                                         placeholder="Plase select"
                                         :options="yearsOptions"
                                         :show-labels="false"
                                         :clear-on-select="false">
                            </multiselect>
                          </div>
                        </div>
                      </div>

                      <div class="form-group padding-top-15" v-if="adsAddress.name != undefined">
                        <div class="col-xs-12">
                          <button class="btn btn-default width100percent" type="button" @click="resetForm()">
                            <i class="fa fa-list-ul"></i> Reset
                          </button>
                        </div>
                      </div>

                      <div class="form-group" v-if="adsAddress.name != undefined">
                        <div class="col-xs-12">
                          <div class="col-xs-6 padding-l-4">
                            <button :disabled="$store.getters['globalStates_/loadingButton'] && !searchMap"
                                    class="btn btn-info" type="submit">
                              <i v-if="$store.getters['globalStates_/loadingButton'] && !searchMap"
                                 class="fa fa-spinner fa-spin"></i>
                              <i v-else class="fa fa-list-ul"></i> List search
                            </button>
                          </div>
                          <div class="col-xs-6">
                            <button :disabled="$store.getters['globalStates_/loadingButton'] && searchMap"
                                    class="btn btn-info" type="submit" @click="searchMap = true">
                              <i v-if="$store.getters['globalStates_/loadingButton'] && searchMap"
                                 class="fa fa-spinner fa-spin"></i>
                              <i v-else class="fa fa-map"></i> Map search
                            </button>
                          </div>
                        </div>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="block-content tab-content" v-bind:class="{'hidden':!tabs['history']}">
              <div class="tab-pane fade fade-right in active">
                <div class="block pull-r-l">
                  <div class="block-content block-content-narrow">
                    <form class="form-horizontal push-10-t" data-vv-scope="profile_form" >
                      <h2 class="content-heading">
                        <i class="fa fa-map-marker"></i> History
                        <i v-show="$store.getters['search_/addressLoading']"
                           class="fa fa-spinner fa-spin pull-right"></i>
                        <i v-if="transparency_history.length"
                           v-show="!$store.getters['search_/addressLoading']" class="fa fa-trash empty pull-right"
                           v-on:click="empty_history(false)"></i>
                      </h2>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="block-content tab-content" v-bind:class="{'hidden':!tabs['bookmarks']}">
              <div class="tab-pane fade fade-right in active">
                <div class="block pull-r-l">
                  <div class="block-content block-content-narrow">
                    <div class="form-horizontal push-10-t" data-vv-scope="profile_form" >
                      <h2 class="content-heading">
                        <i class="fa fa-star"></i> Bookmarks

                        <i v-show="$store.getters['search_/addressLoading']"
                           class="fa fa-spinner fa-spin pull-right"></i>
                        <i v-if="bkmrks.length"
                           v-show="!$store.getters['search_/addressLoading']" class="fa fa-trash empty pull-right"
                           v-on:click="empty_bookmarks(false)"></i>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <modal ref="modal" v-if="tabs['bookmarks']" v-bind:modalShow="show_modal">

      <template slot="close">
        <button type="button" v-on:click="show_modal = false;"><i class="si si-close"></i>
        </button>
      </template>
      <template slot="title">
        <h3 class="block-title">Are you sure?</h3>
      </template>

      <template slot="text">
        <span>You are about to delete all of you bookmarks. Are you sure? This action can not be undone</span>
      </template>
      <template slot="slot_actions">

        <button class="btn btn-sm btn-default" type="button" data-dismiss="modal" v-on:click="show_modal = false;">No
        </button>

        <button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"
                v-on:click="empty_bookmarks(true) "><i class="fa fa-check"></i> Yes
        </button>
      </template>
    </modal>

    <modal ref="modal" v-if="tabs['history']" v-bind:modalShow="show_modal">

      <template slot="close">
        <button type="button" v-on:click="show_modal = false;"><i class="si si-close"></i>
        </button>
      </template>
      <template slot="title">
        <h3 class="block-title">Are you sure?</h3>
      </template>

      <template slot="text">
        <span>You are about to delete all of you history. Are you sure? This action can not be undone</span>
      </template>
      <template slot="slot_actions">

        <button class="btn btn-sm btn-default" type="button" data-dismiss="modal" v-on:click="show_modal = false;">No
        </button>

        <button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"
                v-on:click="empty_history(true) "><i class="fa fa-check"></i> Yes
        </button>
      </template>
    </modal>

    <modal ref="modal" v-if="tabs['docs']" v-bind:modalShow="show_modal">

      <template slot="close">
        <button type="button" v-on:click="show_modal = false;"><i class="si si-close"></i>
        </button>
      </template>
      <template slot="title">
        <h3 class="block-title">Are you sure?</h3>
      </template>

      <template slot="text">
        <span>You are about to delete all of you docs. Are you sure? This action can not be undone</span>
      </template>
      <template slot="slot_actions">

        <button class="btn btn-sm btn-default" type="button" data-dismiss="modal" v-on:click="show_modal = false;">No
        </button>

        <button class="btn btn-sm btn-primary" type="button" data-dismiss="modal"
                v-on:click="empty_docs(true) "><i class="fa fa-check"></i> Yes
        </button>
      </template>
    </modal>

  </div>
</template>
<script>
</script>
<style scoped lang="scss">
  a{
    cursor: pointer;
  }
  #side-overlay {
    z-index: 1029 !important;
    left: 60px;
    top: 60px !important;
    overflow-y: visible !important;
    transform: translateX(-100%) !important;
    &.active {
      transform: translateX(0) !important;
      .side-overlay--button i {
        transform: rotate(0);
      }
    }
  }

  .block-content {
    padding: 0px 11px 1px !important;
  }
  .block-content-full {
    padding: 0 !important;

    a{
      padding-left: 20px;
      cursor: default;

      .fa-edit{
        margin-top: 3px;
        cursor: pointer;
        color: #777;
      }
      .fa-edit:hover{
        color: #000;
      }
      span.link{
        cursor: pointer;
      }

      .fa-star, .fa-star-o, .fa-save{
        cursor: pointer;
        color: #777777;
      }

      .fa-star:hover, .fa-star-o:hover, .fa-save:hover{
        color: #000;
      }
      .fa-remove{
        cursor: pointer;
        color: #777777;
      }
      .fa-remove:hover{
        color: #000;
      }
    }
  }
  .block-content--margin {
    margin-bottom: -20px !important;
  }

  .vb-content {
    height: calc(100vh - 60px) !important;
  }

  .side-overlay--inner {
    position: relative;
  }

  .side-overlay--button {
    left: 284px;
    border-left: transparent !important;
    height: 80px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translateX(100%);
    i {
      position: relative;
      transition: all 0.22s ease;
      transform: rotate(180deg);
    }
  }

  .chbx-no-padding {
    padding-right: 0px !important;
  }

  .expand {
    border-bottom: 1px solid #ccc;
    float: left;
    height: 65px !important;
    overflow: hidden;
    position: relative;
  }

  .show_all {
    position: absolute;
    right: 17px;
    bottom: 7px;
    font-size: 21px;
    cursor: pointer;
  }

  .expand.show {
    height: auto;
  }

  .multiselect__tag {
    cursor: pointer;
  }

  .km_hover:hover {
    background-color: red;
    cursor: pointer;
  }

  .nav_h {
    left: 284px;
    margin-top: 90px;
    height: 125px;
    border-left: 1px solid #ebebeb !important;
    border-right: 1px solid #ebebeb !important;
    border-bottom: 1px solid #ebebeb !important;
    width: 36px;
    .btn {
      border-bottom: 1px solid #ebebeb;
      background: #fff;
      color: #999;
      width: 100%;
      padding: 10px;
      border-radius: 0;
    }
    .btn:last-child {
      border: none;
    }
    .btn.active {
      color: #fff;
      background-color: #999;
    }
    .btn:hover {
      border-bottom: 1px solid #ccc;
    }
  }
  .side-content {
    height: 100%;
  }
  .minimize{
    .block-content{
      display: none;
    }
  }
  .suggestion_type {
    padding-right: 5px; color: #ccc; font-size: 11px
  }
  .address_remove{
    cursor: pointer;
  }
  .km_helper {
    position: absolute;
    right: 10px;
    z-index: 99999;
    top: 7px;
  }
  .width100{
    width: 100px !important;
  }
  .width150{
    width: 150px !important;
  }
  .cstm {
    // margin-top: -45px;
    z-index: 12223131;
    // margin-right: 14px;

    li:hover{
      cursor: pointer;
      background-color: #ebebeb;
    }
    li:hover:first-child{
      cursor: default;
      background-color: transparent;
    }
  }input[type=number]::-webkit-inner-spin-button,
   input[type=number]::-webkit-outer-spin-button {
     -webkit-appearance: none;
     margin: 0;
   }
  .multiselect__tag {
    cursor: pointer;
    float: left;
    margin-right: 1px;
    margin-top: 0;
  }
  .tags_holder_helper, .tags_holder_helper_less{
    display: none;
    cursor: pointer;
  }
  .tags_holder_helper:hover, .tags_holder_helper_less:hover{
    text-decoration: underline;
  }
  .tags_holder {
    height: 54px;
    overflow: hidden;
    width: 100%;
  }
</style>
