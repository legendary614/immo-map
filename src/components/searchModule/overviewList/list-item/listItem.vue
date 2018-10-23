<template>
    <div>
        <div class="col-md-12 js-listItem padding-l-0">
            <div class="col-md-3 padding-l-0 padding-r-35">
                <div class="ribbon ribbon-modern ribbon-danger ribbon">
                            <div class="ribbon-box font-w600 top0 mouse-pointer" @click.stop="addToFav = !addToFav">
                                <i :class="{'fa fa-heart': addToFav, 'fa fa-heart-o': !addToFav}" ></i>
                            </div>
                            <!-- <vue-gallery :images="images" :index="index"
                                @close="index = null"></vue-gallery> -->

                        </div>
                <div class="ribbon ribbon-danger ribbon-left deal_type">
                    <div class="ribbon-box">
                        {{ item.transactionType === 10 ? 'Rent' : 'Buy' }}
                    </div>
                </div>
                <div class="ribbon ribbon-success ribbon-left deal_industry">
                    <div class="ribbon-box font-w600">
                        <i class="fa fa-fw fa-industry"></i>
                        <!-- <i class="fa fa-fw fa-user"></i>
                        <i class="fa fa-fw fa-question"></i> -->
                    </div>
                </div>
                <div class="ribbon ribbon-primary ribbon-left deal_chart">
                    <div class="ribbon-box font-w600">
                        <i class="fa fa-fw fa-bar-chart"></i>
                    </div>
                </div>
                <img v-if="item.pictures.length" class="overview-img" :src="`https://axresources.azurewebsites.net/image/get/${item.pictures[0].resourceId}/?mw=500&mh=500&q=90`" alt="">
            </div>
            <div class="title-wrapper">
                <h6> {{ item.title }} </h6>
            </div>
            <div class="col-md-9 padding-l-0">
                <div class="col-md-11 padding-l-0">
                    <div class="col-md-4 padding-l-0">
                        <table class="table table-striped table-borderless table-vcenter margin-l-0">
                            <tr class="border-bottom-none">
                                <th>
                                    OBJEKT
                                </th>
                                <td class="text-right">
                                    <i class="fa fa-male fa-x"></i>
                                </td>
                            </tr>
                            <tr class="border-bottom-none">
                                <td class="text-muted">
                                    Preis
                                </td>
                                <td class="text-right text-muted">
                                    Preis chf m<sup>2</sup>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {{ item.salePrice ? formatPrice(item.salePrice.price) : '' }}
                                </td>
                                <td class="text-right">
                                    {{ item.salePrice ? formatPrice(item.salePrice.pricePerSqm) : '' }}
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    Inseratelaufdauer
                                </td>
                                <td class="text-right">52 tage</td>
                            </tr>
                            <tr class="border-bottom-none">
                                <td class="text-muted">
                                    Address
                                </td>
                                <td class="text-right">{{ item.address.street ? item.address.street : '-'}} {{ item.address.streetNumber }}</td>
                            </tr>
                            <tr class="border-bottom-none">
                                <td>
                                </td>
                                <td class="text-right">
                                    {{ item.address.zip }} {{ item.address.locality }}
                                </td>
                            </tr>
                                <tr class="padding-top-20 border-bottom-none">
                                <td class="text-left">
                                    <button class="btn btn-xs btn-default" type="button" @click.stop="showMiniMap = !showMiniMap">
                                        <i class="fa fa-map fa-x"></i>
                                    </button>
                                    <!-- <i class="fa fa-map fa-x"></i> -->
                                </td>
                                <td class="text-right">
                                    <button class="btn btn-xs btn-default" type="button" @click.stop><i class="fa fa-street-view fa-x"></i></button>
                                    <!-- <i class="fa fa-street-view fa-x"></i> -->
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-4">
                        <table class="table table-striped table-borderless table-vcenter">
                            <tr>
                                <th>
                                    GABAUDE
                                </th>
                                <td class="text-right">
                                    <i class="fa fa-building fa-x"></i>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    Property category
                                </td>
                                <td class="text-right">
                                    {{ item.propertyCategory.name }}
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    Property type
                                </td>
                                <td class="text-right">
                                    {{ item.propertyType.name }}
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    Rooms/s
                                </td>
                                <td class="text-right">
                                    {{ item.rooms }}
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    Living area
                                </td>
                                <td class="text-right">
                                    {{ item.livingArea ? item.livingArea + ' m2' : '' }}
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                Property area
                                </td>
                                <td class="text-right">
                                    {{ item.propertyArea ? item.propertyArea + ' m2' : '' }}
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                Construction Year
                                </td>
                                <td class="text-right">
                                    {{ item.constructionYear }}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-4">
                        <table class="table table-striped table-borderless table-vcenter">
                            <tr>
                                <th>
                                    KONTAKT
                                </th>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    Name
                                </td>
                                <td class="text-right">{{ item.contact.name }}</td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    Strasse
                                </td>
                                <td class="text-right">{{ item.contact.address.street }} {{ item.contact.address.streetNumber }}</td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    PLZ / Ort
                                </td>
                                <td class="text-right">{{ item.contact.address.zip }} {{ item.contact.address.locality }}</td>
                            </tr>
                            <tr>
                                <td class="text-muted">
                                    Verkaufertyp
                                </td>
                                <td class="text-right"></td>
                            </tr>
                            <tr>
                                <td>
                                    <i class="fa fa-mobile-phone fa-x"></i>
                                </td>
                                <td class="text-right">
                                    {{ item.contact.mobilePhone }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <i class="fa fa-phone fa-x"></i>
                                </td>
                                <td class="text-right">
                                    {{ item.contact.landlinePhone }}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="actions">
                    <table class="table table-striped table-borderless table-vcenter">
                        <tr class="border-bottom-none">
                            <!-- <th>
                                VERKNUPFUNG
                            </th> -->
                            <td>
                            </td>
                        </tr>
                        <tr class="border-bottom-none">
                            <!-- <th>
                                Favorit
                            </th> -->
                            <td class="text-center">
                                <button class="btn btn-xs btn-default" type="button" @click.stop v-tooltip.right="'Favorit'">
                                    <i class="fa fa-star fa-x">
                                </i></button>
                            </td>
                        </tr>
                        <tr class="border-bottom-none">
                            <!-- <td>
                                Marketradar
                            </td> -->
                            <td class="text-center">
                                <button class="btn btn-xs btn-default" type="button" @click.stop v-tooltip.right="'Marketradar'">
                                    <i class="fa fa-wpexplorer fa-x"></i>
                                </button>
                            </td>
                        </tr>
                        <tr class="border-bottom-none">
                            <!-- <td>
                                Transparency
                            </td> -->
                            <td class="text-center">
                                <button class="btn btn-xs btn-default" type="button" @click.stop v-tooltip.right="'Transparency'">
                                    <i class="si si-home fa-x"></i>
                                </button>
                            </td>
                        </tr>
                        <tr class="border-bottom-none">
                            <!-- <td>
                                Lead
                            </td> -->
                            <td class="text-center">
                                <button class="btn btn-xs btn-default" type="button" @click.stop v-tooltip.right="'Inbox'">
                                    <i class="fa fa-exchange fa-x"></i>
                                </button>
                            </td>
                        </tr>
                        <tr class="border-bottom-none">
                            <!-- <td>
                                Verstecken
                            </td> -->
                            <td class="text-center">
                                <button class="btn btn-xs btn-default" type="button" @click.stop v-tooltip.right="'Verstecken'">
                                    <i class="fa fa-remove fa-x" ></i>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <!-- <td>
                                Fake melden
                            </td> -->
                            <td class="text-center">
                                <button class="btn btn-xs btn-default" type="button" @click.stop v-tooltip.right="'Fake melden'">
                                    <i class="si si-dislike fa-x"></i>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="mapBox" @click.stop v-if="showMiniMap">
            <list-map :coordinates="item.address.coordinates">
            </list-map>
        </div>
    </div>
</template>
<style scoped lang="scss">
.mapBox {
    float: left;
    position: relative;
    height: 280px;
    width: 100%;
}
table {
    height: 235px;
    margin-bottom: 0px !important;
    margin-right: 10px;
    margin-left: 10px;
}
tr {
    height: 35px;
    border-bottom: 1px solid #ebebeb;
}
tr:last-child, tr:first-child {
    border: none;
}
.overview-img {
    width: 100%;
    height: 290px;
}
.ribbon {
    min-height: 0px !important;
}
.btn-xs {
    width: 25px;
}
.title-wrapper {
    font-weight: bold;
    padding-bottom: 15px;
    padding-top: 15px;
}
  .actions {
    position: absolute;
    right: 10px;
    top: -44px
  }

.deal_type{
  div{
    top: 0; cursor: pointer; width: 58px; text-align: center;
  }
}
  .deal_industry{
    div{
      top: 36px; cursor: pointer; width: 58px; text-align: center;
    }
  }
  .deal_chart{
    div {
      top: 72px; cursor: pointer; width: 58px; text-align: center;
    }
  }
</style>
