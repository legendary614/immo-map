<template>
    <a class="block block-link-hover2 map_item" :class="{'selected': selectedIndex === index}" @click="$emit('selectAd', ad)" >
        <div class="ribbon-modern ribbon-crystal ribbon-bottom prop_type">
            <div class="ribbon-box smaller-ribbon">{{ ad["propertyType"]["name"] }}</div>
        </div>
        <div class="ribbon ribbon-modern ribbon-danger ribbon">
            <div class="ribbon-box smaller-ribbon font-w600 mouse-pointer" @click.stop="addToFav = !addToFav">
                <i :class="{'fa fa-heart': addToFav, 'fa fa-heart-o': !addToFav}"></i>
            </div>
        </div>
        <div class="ribbon ribbon-danger ribbon-left deal_type">
            <div class="ribbon-box">
                {{ ad.transactionType === 10 ? 'Rent' : 'Buy' }}
            </div>
        </div>
        <div class="ribbon ribbon-success ribbon-left industry">
            <div class="ribbon-box font-w600">
                <i class="fa fa-fw fa-industry"></i>
            </div>
        </div>
        <div class="ribbon ribbon-primary ribbon-left chrt">
            <div class="ribbon-box font-w600">
                <i class="fa fa-fw fa-bar-chart"></i>
            </div>
        </div>
        <img class="mapRight-img" :src="'https://axresources.azurewebsites.net/image/get/' + ad.pictures[0].resourceId + '/?mw=500&mh=500&q=90'" v-bind:alt="ad.title">
        <table class="table table-striped table-borderless table-vcenter add_table">
            <tr class="ad_title">
                <td colspan="2">
                {{ shortenTitle(ad.title) }}
                </td>
            </tr>
            <tr class="ad_price">
                <td class="text-left">
                1'234'567
                </td>
                <td class="text-right">
                14'398
                </td>
            </tr>
            <tr class="ad_price_desc">
                <td class="text-left text-muted">
                PREIS
                </td>
                <td class="text-right text-muted">
                PREIS CHF M
                <sup>2</sup>
                </td>
            </tr>
            <tr class="ad_geo">
                <td class="text-left padding-b-0" colspan="2">
                {{ ad.address ? ad.address.street : '' }} {{ ad.address ? ad.address.streetNumber : '' }}{{ ad.address.street || ad.address.streetNumber ? ', ' : ''}}{{ ad.address.zip }} {{ ad.address.locality }}
                </td>
            </tr>
            <tr class="ad_history">
                <td class="text-left text-muted" colspan="2">
                52 TAGE AUF DEM MARKET
                <!-- <i class="fa fa-map-marker pull-right markerIcon">
                        <i v-if="!ad.address.coordinates" class="fa fa-close fa-1x markerIconCrossed"></i>
                        </i>
                        -->
                </td>
            </tr>
        </table>
    </a>
</template>
<style scoped lang="scss">
tr:last-child {
  border: none;
}
tr {
  border-bottom: 1px solid #ebebeb;
}
th {
  font-weight: normal;
}
td {
  padding: 10px 5px 10px 5px;
}
.mapRight-img {
  width: 100%;
  height: 150px;
}
.selected {
  -webkit-transform: translateY(-1px);
  -ms-transform: translateY(-1px);
  transform: translateY(-1px);
  -webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
}
.ribbon {
  min-height: 0px !important;
}
.ribbon-box {
  height: 22px !important;
  line-height: 22px !important;
  padding: 0 10px !important;
}
.smaller-ribbon:before {
  border: 11px solid;
}
.markerIcon {
  font-size: 32px !important;
  margin-right: 10px;
  margin-top: 14px;
  position: relative;
}
  .map_item{
    padding: 5px; height: 380px;
    border: 1px solid #ebebeb;
  }
  .prop_type{
    position: relative;
    div{
      top: 128px;font-size: 12px;
    }
  }
  .deal_type{
    div{
      top: 0; cursor: pointer !important; width: 45px; text-align: center; font-size: 10px;
    }
  }
  .industry{
    div{
      top: 22px; cursor: pointer; width: 45px; text-align: center; font-size: 10px;
    }
  }
  .chrt{
    div{
      top: 42px; cursor: pointer; width: 45px; text-align: center; font-size: 10px;
    }
  }
  .add_table{
    margin-left: 0px !important; margin-bottom: 0px !important;
  }
  .ad_title{
    height: 60px;
  }
  .ad_price{
    vertical-align: bottom; border-bottom: 0px !important;
    td{
      padding-bottom: 0px !important; font-size: 18px;
    }
  }
  .ad_price_desc{
    vertical-align: top;
    td{
      padding-top: 0px !important; font-size: 12px;
    }
  }
  .ad_geo{
    height: 51px; border-bottom: 0px !important;
  }
  .ad_history{
    vertical-align: top; border-bottom: 0px !important;
    td{
      padding-top: 0px !important; font-size: 12px;
    }
  }
</style>
