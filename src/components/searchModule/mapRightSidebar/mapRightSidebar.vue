<template>
  <div>
    <div v-if="selectedAd != undefined">
      <object-component @closeRightSidebar="closeObjectRightSidebar()" v-if="selectedAd.title != undefined" :item="selectedAd" :selectedIndex="selectedIndex" :pageNum="pageNum" @selectItem="selectItem"></object-component>
    </div>
      <div>
      <aside id="sidebar-fixed" @click.stop>
        <button @click="mapRightSidebarToggle()" class="btn btn-default pull-left side-overlay--button margin-t-60" type="button">
          <i class="fa fa-arrow-right"></i>
        </button>
        <div v-bar>
          <div id="side-overlay-scroll" class="widthAuto bg-white">
            <div class="side-content remove-padding-t">
              <div class="block on_top_counter">

                <button type="button" class="btn btn-default pull-right" style="margin-top: -14px" @click="mapRightSidebarToggle()"><i class="fa fa-times"></i></button>
                <div v-if="showOne && adsNotOnMap.length">
                  Ads <strong>{{ pageNum }}</strong> - <strong>{{ perPage }}</strong> of <strong>{{ adsNotOnMap.length | currency }}</strong> ({{ searchResults | currency }}) / <strong>{{ allAds | currency }}</strong>
                </div>
                <div v-if="showZero && adsOnMap.length">
                  Ads <strong>{{ pageNum }}</strong> - <strong>{{ perPage }}</strong> of <strong>{{ adsOnMap.length | currency }}</strong> ({{ searchResults | currency }}) / <strong>{{ allAds | currency }}</strong>
                </div>
              </div>
              <div class="block pull-r-l bg-gray-light">
                <ul class="nav nav-tabs nav-tabs-alt nav-justified nav_ul">
                  <li :class="{ 'active' : showZero}">
                    <a type="button" @click="show(0)" class="margin-t-12">On Map [{{ adsOnMap.length }} Ads]</a>
                  </li>
                  <li :class="{ 'active' : showOne}">
                    <a v-if="adsNotOnMap.length" type="button" class="margin-t-12" @click="show(1)">Not On Map [{{ adsNotOnMap.length }} Ads]</a>
                    <a v-else @click="show(1)" type="button" class="margin-t-12">Not On Map [0 Ads]</a>
                  </li>
                </ul>
                <div class="block-content tab-content" v-show="!$store.getters['globalStates_/loadingSearchResults']">
                  <div class="tab-pane" :class="{ 'active' : showZero}">
                    <div class="row" v-if="adsOnMap.length">
                      <div class="col-xs-12">
                        <div class="block" v-if="!loading">
                          <div class="col-md-12">
                            <div class="form-material mapRight-pagination">
                              <paginate ref="topPagination" :page-count="getPageCount" :page-range="3" :margin-pages="2" :click-handler="nextPage" :prev-text="'Prev'" :next-text="'Next'" :container-class="'pagination'" :page-class="'page-item'">
                              </paginate>
                            </div>
                          </div>
                          <div>
                            <div class="col-md-6" v-for="(ad, index) in paginateAdsOnMap" :key="index" @mouseup="setSelectedIndex(index)" @mouseenter="hilight_marker(ad)" @mouseleave="objectLeave()">
                              <map-item :ad="ad" :selectedIndex="selectedIndex" :index="((pageNum - 1) * 6) + index" @selectAd="selectAd(ad, index)"></map-item>
                            </div>
                          </div>
                          <div class="col-md-12 margin-b-17">

                            <div class="form-material mapRight-pagination">
                              <paginate ref="bottomPagination" :page-count="getPageCount" :page-range="3" :margin-pages="2" :click-handler="nextPage" :prev-text="'Prev'" :next-text="'Next'" :container-class="'pagination'" :page-class="'page-item'">
                              </paginate>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="row">
                      <div class="col-xs-12">
                        <div class="block text-center padding10 margin-t-10 bg-transparent">No ads to display</div>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane" :class="{ 'active' : showOne}">
                    <div class="row" v-if="adsNotOnMap.length">
                      <div class="col-xs-12">

                        <div class="block" v-if="!loading">
                          <div class="col-md-12">

                            <div class="form-material mapRight-pagination">
                              <paginate ref="topPagination2" :page-count="getPageCount2" :page-range="3" :margin-pages="2" :click-handler="nextPage2" :prev-text="'Prev'" :next-text="'Next'" :container-class="'pagination'" :page-class="'page-item'">
                              </paginate>
                            </div>
                          </div>
                          <div>
                            <div class="col-md-6" v-for="(ad, index) in paginateAdsNotOnMap" :key="index" @click="setSelectedIndex2(index)" @mouseenter="hilight_locality(ad)" @mouseleave="hilight_locality(ad, '')">
                              <map-item :ad="ad" :selectedIndex="selectedIndex" :index="((pageNum2 - 1) * 6) + index" @selectAd="selectAd"></map-item>
                            </div>
                          </div>
                          <div class="col-md-12 margin-b-17">
                            <div class="form-material mapRight-pagination">
                              <paginate ref="bottomPagination2" :page-count="getPageCount2" :page-range="3" :margin-pages="2" :click-handler="nextPage2" :prev-text="'Prev'" :next-text="'Next'" :container-class="'pagination'" :page-class="'page-item'">
                              </paginate>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="row">
                      <div class="col-xs-12">
                        <div class="block padding10 margin-t-10 bg-transparent" >No ads to display</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="block-content tab-content bg-white text-center ldr" v-show="$store.getters['globalStates_/loadingSearchResults']">
                  <i class="fa fa-spinner fa-spin spinner"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
<script>
</script>
<style lang="scss" scoped>
#side-overlay-scroll {
  height: calc(100vh - 20px) !important;
}
#sidebar-fixed {
  background-color: #fff;
  border-left: 1px solid #e1e1e1;
  width: 650px !important;
  right: 0px !important;
  position: fixed;
  top: 0px;
  z-index: 1400;
  height: 100%;
  transition: all 0.28s ease-out;
  transform: translateX(100%) !important;
  &.active {
    transition: all 0.28s ease-out;
    transform: translateX(0) !important;
    .side-overlay--button i {
      transform: rotate(0);
    }
  }
}
.col-md-6 {
  cursor: pointer;
}
.block-content {
  padding: 5px 10px 1px !important;
}
.top-title {
  position: absolute;
  right: 15px;
  padding: 0 15px;
  height: 36px;
  line-height: 36px;
  color: #fff;
  z-index: 500;
  font-size: 16px;
  font-weight: 500;
}
.mapRight-pagination {
  text-align: center;
  margin-bottom: 5px !important;
}
.headerIcons {
  font-size: 32px;
  cursor: pointer;
}
.side-overlay--button {
  height: 80px;
  position: absolute;
  // top: calc(56% - 64px);
  border: 1px solid #e1e1e1;
  left: -75px;
  transform: translateX(100%);
  i {
    position: relative;
    transition: all 0.22s ease;
    transform: rotate(180deg);
  }
}
.spinner {
  font-size: 50px;
}
.markerIconCrossed {
  position: absolute;
  left: -3px;
  top: -1px;
  color: rgba(217, 83, 79, 0.7);
}
.resultCounter {
  margin-bottom: 5px;
  background-color: white;
  padding: 7px;
  width: 260px;
  margin-bottom: 10px;
}
.disableTab:hover {
  color: #646464 !important;
  border-color: transparent !important;
  cursor: not-allowed;
  box-shadow: 0 0px !important;
}
</style>
<style lang="scss">
.nav-tabs li {
  cursor: pointer;
}
  .nav_ul{
    border-top: 1px solid #e9e9e9; background-color: white !important;
  }
  .ldr{

    i{
      margin-top: 150px;
    }
  }
  .on_top_counter {
    margin-top: 27px;
    text-align: center;
    height: 20px;
  }
</style>
