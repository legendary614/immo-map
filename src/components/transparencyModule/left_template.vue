<template>
  <div class="searchSidebar" v-if="loaded">
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
        </a><br>
        <a class="btn" v-on:click="toggle('docs')" v-bind:class="{active: tabs['docs']}">
          <span class="fa fa-file"></span>
        </a><br>
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

                            <autocomplete ref="autocomplete_search" class="ac" :setData="setStreet" :onSearch="getSearchSuggestions" :item_highlighted="'highlightedName'"></autocomplete>
                          </div>
                          <span v-if="transparencyAddress.name != undefined">
                            <span class="multiselect__tag" v-bind:key="transparencyAddress.uniqueidentifier">
                              <span>
                                <i v-show="$store.getters['search_/addressLoading']" class="fa fa-spinner fa-spin"></i>
                                <span class="mouse-pointer" v-on:click="setStreet(transparencyAddress, 200)">{{transparencyAddress.name}}</span>
                              </span>
                              <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" v-on:click="remove_address_item()"></i>
                              <i aria-hidden="true" tabindex="1" v-bind:class="{'fa fa-star': isAddressBookmarked(transparencyAddress),  'fa fa-star-o': !isAddressBookmarked(transparencyAddress)}" v-on:click="bookmark(transparencyAddress)"></i>
                            </span>
                          </span>
                        </div>

                      </div>
                      <div class="block pull-r-l " :class="{'block-opt-hidden': showMore, 'block-content--margin': !showMore}">
                        <div class="block-header bg-gray-lighter" @click="showMore = !showMore">
                          <ul class="block-options">
                            <li>
                              <button type="button" data-toggle="block-option" data-action="content_toggle">
                                <i :class="{'si si-arrow-down': showMore, 'si si-arrow-up': !showMore,}"></i>
                              </button>
                            </li>
                          </ul>
                          <h3 class="block-title">More Options...</h3>
                        </div>
                        <div class="block-content padding-20">
                          <div class="form-group">
                            <label class="col-xs-12 control-label text-left padding-b-10">Rooms</label>
                            <div class="col-sm-12">
                              <multiselect v-model="roomsMin" id="rooms" openDirection="bottom" placeholder="Plase select" :options="roomsOptions" :show-labels="false" :clear-on-select="false">
                              </multiselect>
                            </div>

                          </div>
                          <div class="form-group">
                            <label class="col-xs-12 control-label text-left padding-b-10" for="area">Living area
                            </label>
                            <div class="col-sm-12" :class="{ 'has-error' : errors.has('profile_form.areaMin') }">
                              <input class="form-control" placeholder="Please enter living area" type="text" id="area" name="area" v-model="searchData.livingArea.min" data-vv-scope="profile_form" v-validate="'numeric'">
                              <div v-show="errors.has('profile_form.areaMin')" class="help-block text-left animated fadeInDown"> Please enter a number
                              </div>
                            </div>
                          </div>

                          <div class="form-group">
                            <label class="col-xs-12 control-label text-left padding-b-10" for="yards">Yards</label>
                            <div class="col-sm-12" :class="{ 'has-error' : errors.has('profile_form.areaMin') }">
                              <input class="form-control" placeholder="Please enter yards" type="text" id="yards" name="yards" v-model="searchData.livingArea.min" data-vv-scope="profile_form" v-validate="'numeric'">
                              <div v-show="errors.has('profile_form.areaMin')" class="help-block text-left animated fadeInDown"> Please enter a number
                              </div>
                            </div>
                          </div>

                          <div class="form-group">
                            <div class="col-sm-12">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" :checked="false">
                                <span></span> Include historic ads
                              </label>
                            </div>
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

                      <div class="block pull-r-l" v-for="history in desc(transparency_history, 'date', 'desc')" v-bind:key="history.date" v-bind:class="{minimize: is_minimized(history.date, 'history')}">
                        <div class="block-header bg-gray-lighter">
                          <ul class="block-options">
                            <li>
                              <button type="button" v-on:click="minimize(history.date, 'history')">
                                <i class="si" v-bind:class="{'si-arrow-down': is_minimized(history.date, 'history'), 'si-arrow-up': !is_minimized(history.date, 'history')}"></i>
                              </button>
                            </li>
                          </ul>
                          <h3 class="block-title">{{format_date(history.date)}}</h3>
                        </div>
                        <div class="block-content block-content-full">
                          <ul class="nav-users remove-margin-b">
                            <li v-for="(address, index) in  desc(history.data, 'time', 'desc') " v-bind:key="index">
                              <a>
                                <span aria-hidden="true" tabindex="1" v-bind:class="{'fa fa-star': isAddressBookmarked(address),  'fa fa-star-o': !isAddressBookmarked(address)}" v-on:click="bookmark(address)"></span>
                                <span class="link" v-on:mousedown="setStreet(address, 200)">{{address.name}}</span>
                                <div class="font-w400 text-muted"><small>{{address['time'] | moment("from")}}</small></div>
                              </a>
                            </li>
                          </ul>

                        </div>
                      </div>
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
                      <div class="block pull-r-l " v-for="history in desc(bkmrks, 'date', 'desc')" v-bind:key="history.date" v-bind:class="{minimize: is_minimized(history.date, 'bookmarks')}">
                        <div class="block-header bg-gray-lighter">
                          <ul class="block-options">
                            <li>
                              <button type="button" v-on:click="minimize(history.date, 'bookmarks')">
                                <i class="si" v-bind:class="{'si-arrow-down': is_minimized(history.date, 'bookmarks'), 'si-arrow-up': !is_minimized(history.date, 'bookmarks')}"></i>
                              </button>
                            </li>
                          </ul>
                          <h3 class="block-title">{{format_date(history.date)}}</h3>
                        </div>
                        <div class="block-content block-content-full">

                          <ul class="nav-users remove-margin-b">
                            <li v-for="(address, index) in  desc(history.data, 'time', 'desc') " v-bind:key="index">
                              <a v-if="address != undefined && editing != address.uniqueIdentifier" >
                                <span class="fa fa-remove pull-right" v-on:mousedown="bookmark(address)"></span>
                                <span class="fa fa-edit pull-left" v-on:mousedown="edit_bookmark(address, 'form')"></span>
                                <span class="link" v-on:click="setStreet(address, 200);">{{address.name}}</span>
                                <div class="font-w400 text-muted"><small>{{address['time'] | moment("from")}}</small></div>
                              </a>

                              <a v-if="editing == address.uniqueIdentifier">
                                <input v-model="address.name" class="form-control" @keyup.enter="edit_bookmark(address, 'save', history.date)" />
                                <i  v-if="editing == address.uniqueIdentifier" class="fa fa-save pull-right editing" v-on:click="edit_bookmark(address, 'save', history.date)"></i>
                              </a>

                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="block-content tab-content" v-bind:class="{'hidden':!tabs['docs']}">
              <div class="tab-pane fade fade-right in active">
                <div class="block pull-r-l">
                  <div class="block-content block-content-narrow">
                    <form class="form-horizontal push-10-t" data-vv-scope="profile_form" >
                      <h2 class="content-heading">
                        <i class="fa fa-file"></i> Docs
                        <i v-if="documents.length"
                          class="fa fa-trash empty pull-right"
                           v-on:click="empty_docs(false)"></i>

                      </h2>

                      <div class="block pull-r-l " v-for="history in desc(documents, 'date', 'desc')" v-bind:key="history.date" v-bind:class="{minimize: is_minimized(history.date, 'docs')}">
                        <div class="block-header bg-gray-lighter">
                          <ul class="block-options">
                            <li>
                              <button type="button" v-on:click="minimize(history.date, 'docs')">
                                <i class="si" v-bind:class="{'si-arrow-down': is_minimized(history.date, 'docs'), 'si-arrow-up': !is_minimized(history.date, 'docs')}"></i>
                              </button>
                            </li>
                          </ul>
                          <h3 class="block-title">{{format_date(history.date)}}</h3>
                        </div>

                        <div class="block-content block-content-full">
                          <ul class="nav-users remove-margin-b">
                            <li v-for="(address, index) in  desc(history.data, 'time', 'desc') " v-bind:key="index">
                              <a >
                                <span class="fa fa-remove pull-right" v-on:mousedown="remove_doc(address)"></span>
                                <span class="link" v-on:click="setStreet(address, 200);print_(address)">{{address.name}}</span>
                                <div class="font-w400 text-muted"><small>{{address['time'] | moment("from")}}</small></div>
                              </a>
                            </li>
                          </ul>

                        </div>
                      </div>
                    </form>

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
  height: 168px;
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
  .editing{
    margin-top: -19px; margin-left: 77%;
  }
</style>
