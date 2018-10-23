<template>
  <div class="searchSidebar">
    <aside id="side-overlay" class="active">
      <button v-on:click="searchSidebarToggleIn(false)" class="btn btn-default pull-right side-overlay--button" type="button" :disabled="$store.getters['globalStates_/loadingSearchResults']">
        <i class="fa fa-arrow-left"></i>
      </button>
      <div class="pull-right side-overlay--button bg-white nav_h">
        <a class="btn" v-on:click="$store.getters['globalStates_/loadingSearchResults'] ? '': toggle('search')" v-bind:class="{active: tabs['search']}"><span
          class="fa fa-search"></span></a><br>
        <a class="btn" v-on:click="$store.getters['globalStates_/loadingSearchResults'] ? '': toggle('bookmarks')" v-bind:class="{active: tabs['bookmarks']}"><span
          class="fa fa-star"></span></a><br>
        <a class="btn" v-on:click="$store.getters['globalStates_/loadingSearchResults'] ? '': toggle('history')" v-bind:class="{active: tabs['history']}"><span
          class="fa fa-history"></span></a><br>
        <a class="btn" v-on:click="$store.getters['globalStates_/loadingSearchResults'] ? '': toggle('abo')" v-bind:class="{active: tabs['abo']}"><span>A</span></a><br>
      </div>
      <div class="side-overlay--inner" v-bar>
        <div>
          <div class="side-content remove-padding-t">
            <div class="block-content tab-content" v-bind:class="{'hidden':!tabs['search']}">
              <div class="tab-pane fade fade-right in active">
                <div class="block pull-r-l">
                  <div class="block-content block-content-narrow">
                    <form class="form-horizontal push-10-t" @submit.prevent="searchAbo('profile_form')"
                          data-vv-scope="profile_form" >
                      <div class="form-group">
                        <div class="col-xs-12">
                          <button disabled
                                  class="btn btn-success items_total">
                            <!-- <span> {{ resultsCounter.items.length }} </span> -->
                            <span> {{ counterItems.totalCount | currency }} ads</span>
                          </button>
                        </div>
                      </div>
                      <div class="form-group push-20-t"
                           :class="{ 'has-error' : errors.has('profile_form.transaction type') }">
                        <div class="col-sm-6">
                          <label class="css-input css-radio css-radio-primary push-10-r">
                            <input type="radio" id="transaction type" data-vv-scope="profile_form"
                                   name="transaction type" v-model="transactionType" value=20
                                   v-validate="'required'"><span></span> Buy
                          </label>
                        </div>
                        <div class="col-xs-6">
                          <label class="css-input css-radio css-radio-primary">
                            <input type="radio" id="transaction type" data-vv-scope="profile_form"
                                   name="transaction type" v-model="transactionType" value=10><span></span> Rent
                          </label>
                        </div>
                        <div class="col-xs-12">
                          <div v-show="errors.has('profile_form.transaction type')"
                               class="help-block text-right animated fadeInDown">{{
                            errors.first('profile_form.transaction type') }}
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="col-xs-12">
                          <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-map-marker"></i></span>

                            <autocomplete ref="autocomplete_search" :setData="setStreet"
                                          :onSearch="getSearchSuggestions"
                                          :item_highlighted="'highlightedName'">

                              <template slot="products" slot-scope="{ item }">
                                <span class="suggestion_type">{{get_icon(item.suggestionType)}}</span>
                              </template>

                            </autocomplete>
                          </div>

                          <!--<span v-if="selectedSearchSuggestions.length || shapes.length" class="show pull-left">
                                <span v-for="(a, index) in selectedSearchSuggestions"
                                      v-bind:style="'background-color:'+ a.bg_color + '!important'"
                                      class="multiselect__tag"
                                      v-bind:key="index">
                                  <i aria-hidden="true" tabindex="2" class="fa fa-edit add_km"
                                     v-on:click="addKmToGeoObject(index)"></i>
                                  <span v-on:click="remove_address_item(index)">{{a.name}}
                                    [ {{get_icon(a.suggestionType)}} ]</span>
                                  <span class="km_hover" v-show="a.extend_by" v-on:click="removeKmFromGeoObject(index)">+ {{a.extend_by}}km</span>
                                  <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"
                                     v-on:click="remove_address_item(index)"></i>
                                </span>
                                <span v-for="(a, index) in shapes" class="multiselect__tag" v-bind:style="stc(a.color)"
                                  v-bind:key="a.name" v-on:click="remove_shape(a.id, index)"><span>{{a.name}}</span>
                                  <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i>
                                </span>
                          </span>-->

                        </div>
                        <div class="col-xs-12" v-if="showLocalityRequired">
                          <div
                               class="help-block text-right animated fadeInDown req_error">This field is required
                          </div>
                        </div>
                      </div>
                      <div class="form-group" v-if="selectedSearchSuggestions.length || shapes.length">
                        <div v-hide-multiselect-elements class="col-sm-12">
                                <span v-for="(a, index) in selectedSearchSuggestions"
                                      v-bind:style="'background-color:'+ a.bg_color + '!important'"
                                      class="multiselect__tag"
                                      v-bind:key="index">
                                  <i aria-hidden="true" tabindex="2" class="fa fa-edit add_km"
                                     v-on:click="addKmToGeoObject(index)"></i>
                                  <span v-on:click="removeAddressItem(index)">{{a.name}}
                                    [ {{get_icon(a.suggestionType)}} ]</span>
                                  <span class="km_hover" v-show="a.extend_by" v-on:click="removeKmFromGeoObject(index)">+ {{a.extend_by}}km</span>
                                  <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"
                                     v-on:click="removeAddressItem(index)"></i>
                                </span>
                                <span v-for="(a, index) in shapes" class="multiselect__tag" v-bind:style="stc(a.color)"
                                      v-bind:key="a.name" v-on:click="remove_shape(a.id, index)"><span>{{a.name}}</span>
                                  <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i>
                                </span>
                        </div>

                        <div class="tags_holder_helper col-sm-12" v-remove-multi-tag-holder>and <span></span> more</div>
                        <div class="tags_holder_helper_less col-sm-12" v-show-multi-tag-holder>Show less</div>

                      </div>
                      <div class="form-group">
                        <div class="col-sm-12">
                          <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-home"></i></span>
                            <multiselect
                              name="property type"
                              data-vv-scope="profile_form"
                              v-validate="'required'"
                              v-model="selectedPropTypes"
                              track-by="id"
                              openDirection="bottom"
                              @input="updateSelected"
                              placeholder="Property type"
                              :custom-label="propLimitLabel"
                              :options="propTypes"
                              :group-select="false"
                              :multiple="false"
                              :limit="1"
                              :limit-text="limitText"
                              :taggable="true"
                              :show-labels="false"
                              :clear-on-select="true"
                              :close-on-select="true">
                            </multiselect>
                          </div>
                        </div>
                        <div class="col-xs-12">
                          <div v-show="errors.has('profile_form.property type')"
                               class="help-block text-right animated fadeInDown req_error">{{
                            errors.first('profile_form.property type') }}
                          </div>
                        </div>
                      </div>

                      <div class="form-group margin-b-0" v-if="propSubTypes.length" >
                        <div class="col-sm-12">
                          <div class="input-group margin-b-17">
                            <span class="input-group-addon"><i class="fa fa-home"></i></span>
                            <multiselect

                              @input="updateSelectedSubtypes"
                              track-by="id"
                              openDirection="bottom"
                              placeholder="Property subtype"
                              :custom-label="propLimitLabel"
                              :options="propSubTypes"
                              :group-select="false"
                              :multiple="false"
                              :limit="1"
                              :limit-text="limitText"
                              :taggable="true"
                              :show-labels="false"
                              :clear-on-select="true"
                              :close-on-select="true">
                            </multiselect>

                          </div>
                        </div>

                      </div>

                      <div class="form-group" v-if="selectedPropSubTypes.length">
                        <div v-hide-multiselect-elements class="col-sm-12" >
                          <span v-for="(a, index) in selectedPropSubTypes" class="multiselect__tag" v-bind:key="index"
                            v-on:click="remove_sub_category_item(index)">
                            {{a.name}}
                            <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"
                               v-on:click="remove_sub_category_item(index)"></i>
                          </span>
                        </div>

                        <div class="tags_holder_helper col-sm-12" v-remove-multi-tag-holder>and <span></span> more</div>
                        <div class="tags_holder_helper_less col-sm-12" v-show-multi-tag-holder>Show less</div>

                      </div>
                      <div class="form-group">
                        <div class="col-sm-6">
                          <multiselect
                            v-model="priceMin"
                            label="text"
                            openDirection="bottom"
                            placeholder="Price min"
                            :options="prices"
                            :custom-label="priceMinLabel"
                            :show-labels="false"
                            :clear-on-select="false">
                          </multiselect>
                        </div>
                        <div class="col-sm-6">
                          <multiselect
                            v-model="priceMax"
                            label="text"
                            placeholder="Price max"
                            :options="prices"
                            :custom-label="priceMaxLabel"
                            :show-labels="false"
                            :clear-on-select="false">
                          </multiselect>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="col-sm-6">
                          <multiselect
                            v-model="roomsMin"
                            label="text"
                            openDirection="bottom"
                            placeholder="Rooms min"
                            :options="roomsOptions"
                            :custom-label="roomsMinLabel"
                            :show-labels="false"
                            :clear-on-select="false">
                          </multiselect>
                        </div>
                        <div class="col-sm-6">
                          <multiselect
                            v-model="roomsMax"
                            label="text"
                            openDirection="bottom"
                            placeholder="Rooms max"
                            :options="roomsOptions"
                            :custom-label="roomsMaxLabel"
                            :show-labels="false"
                            :clear-on-select="false">
                          </multiselect>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-xs-12 control-label area_min"
                                for="areaMin">
                          Living space m<sup>2</sup>
                        </label>
                        <div class="col-sm-6" :class="{ 'has-error' : errors.has('profile_form.areaMin') }">
                          <input class="form-control"
                                 placeholder="min"
                                 type="text"
                                 id="areaMin"
                                 name="areaMin"
                                 v-model="livingSpaceMin"
                                 data-vv-scope="profile_form"
                                 v-validate="'numeric'">
                          <div v-show="errors.has('profile_form.areaMin')"
                               class="help-block text-left animated fadeInDown"> Please enter a number
                          </div>
                        </div>
                        <div class="col-sm-6" :class="{ 'has-error' : errors.has('profile_form.areaMax') }">
                          <input class="form-control"
                                 placeholder="max"
                                 type="text"
                                 id="areaMax"
                                 name="areaMax"
                                 v-model="livingSpaceMax"
                                 data-vv-scope="profile_form"
                                 v-validate="'numeric'">
                          <div v-show="errors.has('profile_form.areaMax')"
                               class="help-block text-left animated fadeInDown"> Please enter a number
                          </div>
                        </div>
                      </div>
                      <div class="block pull-r-l "
                           :class="{'block-opt-hidden': showMore, 'block-content--margin': !showMore}">
                        <div class="block-header bg-gray-lighter mouse-pointer"
                             @click="showMore = !showMore">
                          <ul class="block-options">
                            <li>
                              <button type="button" data-toggle="block-option" data-action="content_toggle"><i
                                :class="{'si si-arrow-down': showMore, 'si si-arrow-up': !showMore,}"></i></button>
                            </li>
                          </ul>
                          <h4 class="block-title">More Options...</h4>
                        </div>
                        <div class="padding-19" v-if="!showMore">
                          <div class="form-group">
                            <div class="col-sm-6 chbx-no-padding">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="wheelchairAccess"><span></span> Wheelchair access
                              </label>
                            </div>
                            <div class="col-sm-6 chbx-no-padding">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="newBuilding"><span></span> New building
                              </label>
                            </div>
                          </div>
                          <div class="form-group">
                            <div class="col-sm-6 chbx-no-padding">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="balconyOrTerrace"><span></span> Balcony / terrace
                              </label>
                            </div>
                            <div class="col-sm-6 chbx-no-padding">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="elevator"><span></span> Elevator
                              </label>
                            </div>
                          </div>
                          <div class="form-group">
                            <div class="col-sm-6 chbx-no-padding">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="petsAllowed"><span></span> Pets allowed
                              </label>
                            </div>
                            <div class="col-sm-6 chbx-no-padding">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="parking"><span></span> Parking
                              </label>
                            </div>
                          </div>
                          <div class="form-group">
                            <div class="col-sm-6 chbx-no-padding">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="childFriendly"><span></span> Family friendly
                              </label>
                            </div>
                            <div class="col-sm-6 chbx-no-padding">
                              <label class="css-input css-checkbox css-checkbox-primary">
                                <input type="checkbox" v-model="ecoFriendly"><span></span> Ecologically
                              </label>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-xs-5 control-label text-left"
                                   for="example-datepicker1">Available from</label>
                            <div class="col-xs-7">
                              <datepicker id="example-datepicker1" :input-class="'form-control'" :calendar-class="'rightside-datepicker'"
                                          :typeable="true" v-model="availableDate"
                                          :calendar-button-icon="'fa fa-calendar'"></datepicker>
                            </div>
                          </div>
                          <div class="form-group margin-b-0">
                            <div class="col-sm-12">
                              <div class="input-group margin-b-17">
                                <span class="input-group-addon"><i class="fa fa-home"></i></span>
                                <multiselect ref="a" class="zindex10"
                                             @input="updateSelectedPortals"
                                             openDirection="bottom"
                                             placeholder="Real estate portal"
                                             track-by="id"
                                             label="name"
                                             :options="realEstateOptions"
                                             :show-labels="false"
                                             :clear-on-select="true"
                                             :multiple="false"
                                             :limit="1"
                                             :limit-text="limitText"
                                             :taggable="true"
                                             :close-on-select="true">
                                </multiselect>
                              </div>
                            </div>
                          </div>

                          <div class="form-group" v-if="selectedRealEstateOptions.length">
                            <div v-hide-multiselect-elements class="col-sm-12" >
                                  <span v-for="(a, index) in selectedRealEstateOptions" class="multiselect__tag"
                                        v-bind:key="index" v-on:click="remove_re_item(index)">
                                    <span>{{a.name}}</span>
                                    <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon"></i>
                                  </span>
                            </div>

                            <div class="tags_holder_helper col-sm-12" v-remove-multi-tag-holder>and <span></span> more</div>
                            <div class="tags_holder_helper_less col-sm-12" v-show-multi-tag-holder>Show less</div>

                          </div>
                          <div class="form-group">
                            <label class="col-xs-6 control-label pub_date"
                                   for="publication">Publication date</label>
                            <div class="col-xs-12">
                              <div class="input-daterange input-group">
                                <datepicker :input-class="'form-control'"
                                            :typeable="true"
                                            :calendar-class="'leftside-datepicker'"
                                            v-model="searchData.publicationTime.min"
                                            :placeholder="'from'">
                                </datepicker>
                                <span class="input-group-addon"><i class="fa fa-chevron-right"></i></span>
                                <datepicker :input-class="'form-control'"
                                            :typeable="true"
                                            :calendar-class="'rightside-datepicker'"
                                            v-model="searchData.publicationTime.max"
                                            :highlighted="publicationHighlighated"
                                            :placeholder="'to'">
                                </datepicker>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="col-sm-12">
                          <label class="css-input css-checkbox css-checkbox-primary">
                            <input type="checkbox" :checked="false"><span></span> Include historic ads
                          </label>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-xs-12 control-label pub_date"
                               for="sortBy">
                          Sort by
                        </label>
                        <div class="col-sm-12">
                          <multiselect
                            id="sortBy"
                            label="text"
                            v-model="sortBy"
                            track-by="value"
                            openDirection="bottom"
                            :options="sortOptions"
                            :show-labels="false"
                            :close-on-select="true">
                          </multiselect>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="col-xs-12">
                          <button class="btn btn-default width100percent" type="button" @click="resetForm()">
                            <i class="fa fa-list-ul"></i> Reset
                          </button>
                        </div>
                      </div>
                      <div class="form-group">
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
                      <div class="form-group">
                        <div class="col-xs-12">
                          <button class="btn btn-success width100percent" type="button">
                            <span> Search Abo</span>
                          </button>
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
                           v-on:click="empty_history"></i>
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
                    <form class="form-horizontal push-10-t" data-vv-scope="profile_form" >
                      <h2 class="content-heading">
                        <i class="fa fa-star"></i> Bookmarks

                        <i v-show="$store.getters['search_/addressLoading']"
                           class="fa fa-spinner fa-spin pull-right"></i>
                        <i v-if="transparency_history.length"
                           v-show="!$store.getters['search_/addressLoading']" class="fa fa-trash empty pull-right"
                           v-on:click="empty_history"></i>

                      </h2>

                    </form>

                  </div>
                </div>
              </div>
            </div>
            <div class="block-content tab-content" v-bind:class="{'hidden':!tabs['abo']}">
              <div class="tab-pane fade fade-right in active">
                <div class="block pull-r-l">
                  <div class="block-content block-content-narrow">
                    <form class="form-horizontal push-10-t" data-vv-scope="profile_form" >
                      <h2 class="content-heading">
                        Search abo

                        <i v-show="$store.getters['search_/addressLoading']"
                           class="fa fa-spinner fa-spin pull-right"></i>
                        <i v-if="transparency_history.length"
                           v-show="!$store.getters['search_/addressLoading']" class="fa fa-trash empty pull-right"
                           v-on:click="empty_history"></i>

                      </h2>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
<script>
</script>
<style scoped lang="scss">
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
      transition: all .22s ease;
      transform: rotate(180deg);
    }
  }

  .chbx-no-padding {
    padding-right: 0px !important;
  }

  .show{
    margin-top: 10px;
  }
  .show_all {
    position: absolute;
    right: 17px;
    bottom: 7px;
    font-size: 21px;
    cursor: pointer;
  }

  .multiselect__tag {
    cursor: pointer;
    float: left;
    margin-right: 1px;
    margin-top: 0;
  }

  .km_hover:hover {
    background-color: red;
    cursor: pointer;
  }

  .nav_h {
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
  .items_total{
    width: 100%; opacity: 0.5; cursor: default !important;
  }
  .suggestion_type {
    padding-right: 5px; color: #ccc; font-size: 11px;
  }
  .add_km {
    margin-left: -3px
  }
  .req_error{
    color: #d26a5c;
  }
  .area_min, .pub_date{
    text-align: left !important; padding-bottom: 8px !important;
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
