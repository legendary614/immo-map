<template>

  <div>
    <div class="marker_title">
      <div v-if="adsInfo.length" v-bar>
        <div class="width100percent">
        <div class="r" v-bind:class="{active: ad.uniqueIdentifier == uniqueIdentifier}" v-for="ad in adsInfo" v-bind:key="ad.uniqueIdentifier" v-on:click="selectAddress(ad)" >
          <div class="photo">
            <img :src="'https://axresources.azurewebsites.net/image/get/'+ad.pictures[0].resourceId+'/?mw=100&mh=100&q=90'">
          </div>
          <div class="text">
            <span class="title">{{ad.title}}</span>
            <span class="address"><i class="fa fa-address-book"></i> <b>{{ad.address.street}} {{ad.address.streetNumber}}, {{ad.address.locality}}</b></span>
            <span class="area"><i class="fa fa-area-chart"></i> Living area: <b>{{ad.livingArea}} m<sup>2</sup></b></span>
          </div>
        </div>
        </div>
      </div>
      <div v-else>
        <div v-on:click="selectAddress('ass')">Title 1</div><br>
        <div v-on:click="selectAddress('ass')">Title 2</div><br>
        <div v-on:click="selectAddress('ass')">Title 3</div>
      </div>

    </div>

  </div>

</template>
<style scoped lang="scss">
  .photo,.text{
    float: left;
  }
  .photo {
    width: 76px;
    overflow: hidden;
    margin-right: 10px;
    img {
      width: 100%;
    }
  }
  .text {
    width: 190px;
  }
  .marker_title{
    text-align: left;
    text-transform: none !important;
    span {
      float: left !important;
      cursor: pointer;
    }
  }
  .r{
    border-bottom: 1px solid #ebebeb; padding-bottom: 5px; float: left; width: 100%;
    padding-top: 5px; word-break: break-all;
  }
  .r:last-child{
    border-bottom: none !important;
  }
  .title, .address, .area {
    float: left;
    width: 100%;
  }
  .title {
    font-size: 12px;
  }
  .address, .area{
    font-size: 10px;
  }
  .vb-content {
    height: 200px !important;
  }
  .vb{
    width: 100% !important;
  }
  .active{
    background: #fafafa;
  }
</style>
