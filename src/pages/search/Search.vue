<template>
  <div>
    <left-sidebar></left-sidebar>
    <search-abo></search-abo>
    <overview-list v-if="$store.getters['globalStates_/showOverviewList']"></overview-list>
    <!--<map-box @setAdsInViewport="setAdsInViewport" :showAd="showAd"></map-box>-->
    <!--<div class="loader1" v-if="$store.getters['globalStates_/loadingSearchResults']" v-bind:class="{fifty: $store.getters['globalStates_/showMapRightSidebar']}">
      <i class="fa fa-spinner fa-spin"></i>
    </div> -->
    <search-map @setAdsInViewport="setAdsInViewport" :showAd="showAd"></search-map>
    <map-right-sidebar v-show="$store.getters['globalStates_/showMapRightSidebar'] && results" :ads="results" @selectAd="selectAd"></map-right-sidebar>
  </div>
</template>
<script>
</script>
<style lang="scss" scoped>
</style>
<style>
  ::-webkit-scrollbar {
    display: none;
  }
  .loader1 {
    position: fixed;
    width: 100%;
    background-color: rgba(0,0,0, 0.4);
    top: 61px;
    z-index: 1;
    height: 100%;
    text-align: center;
    font-size: 50px;
    padding-top: 250px;
    color: #fff;
  }
  .loader1.fifty{
    width: calc(50% + 150px);
  }
</style>
