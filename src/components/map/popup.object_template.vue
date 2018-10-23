<template>

  <div>
    <div class="marker_image">
      <img :src="'https://axresources.azurewebsites.net/image/get/' + adInfo.pictures[0].resourceId + '/?mw=500&mh=500&q=90'" v-bind:alt="adInfo.title">
    </div>
    <div class="marker_title">
        <span>{{adInfo.propertyCategory.name}}</span>
        <span
          v-bind:class="{'green': adInfo.transactionType === 10, 'blue': adInfo.transactionType !== 10}">
          <template v-if="adInfo.transactionType === 10">
            Buy
          </template>
          <template v-else>
            Rent
          </template>
        </span>
       </div>
    <div class="marker_content">
      <div class="price">
        <span v-if="adInfo.salePrice">{{adInfo.salePrice.price}}</span> <br>
        <span>Preis</span>
      </div>
      <div class="price_sq">
        <span v-if="adInfo.salePrice">{{adInfo.salePrice.pricePerSqm}}</span> <br />
        <span>Pries CHF m<sup>2</sup></span>
      </div>
    </div>
    <div class="location">
      {{adInfo.address["street"]}} {{adInfo.address["streetNumber"]}}, {{adInfo.address["zip"]}} {{adInfo.address["locality"]}}
    </div>
  </div>

</template>
