<template>
  <div>
    <aside class="sidebar-fixed" @click.stop>
      <div  v-bar>
        <div id="side-overlay-scroll" class="widthAuto">
          <div class="side-header side-content border-bottom-1eb">
            <div :class="selectedIndex === -1 ? 'col-md-11' : 'col-md-8'">
              <img class="img-avatar img-avatar32" src="/static/img/icons/house.png" v-bind:alt="item.address">
              <span class="font-w600 push-10-l">{{ getAddress(item.address) }}</span>
            </div>
            <template v-if="selectedIndex !== -1 && show_arrow">
              <div class="col-md-1 text-center">
                <button class="btn btn-default" v-if="selectedIndex !== 0 || pageNum !== 1" @click="nextItem(false)" type="button">
                  <i class="fa fa-arrow-left"></i><br>
                </button>
              </div>
              <div class="col-md-1 text-center">
                <button class="btn btn-default" @click="nextItem(true)" type="button">
                  <i class="fa fa-arrow-right"></i><br>
                </button>
              </div>
            </template>
            <div v-if="show_arrow" :class="selectedIndex === -1 ? 'col-md-1' : 'col-md-2'">
              <button class="btn btn-default pull-right" type="button" data-toggle="layout"
                      data-action="side_overlay_close" @click="$emit('closeRightSidebar')">
                <i class="fa fa-times"></i>
              </button>
            </div>
            <div v-if="!show_arrow" class="col-md-4">
              <button class="btn btn-default pull-right" type="button" data-toggle="layout"
                      data-action="side_overlay_close" @click="$emit('closeRightSidebar')">
                <i class="fa fa-times"></i>
              </button>
            </div>
          </div>
          <div class="side-content remove-padding-t">
            <div class="block pull-r-l">
              <ul class="nav nav-tabs nav-tabs-alt nav-justified" data-toggle="tabs">
                <li :class="{ 'active' : showOverview}">
                  <a type="button" @click="showHeader(6)">Overview</a>
                </li>
                <li :class="{ 'active' : showHistory}">
                  <a type="button" @click="showHeader(7)">History</a>
                </li>
              </ul>
              <div class="block-content tab-content">
                <div class="tab-pane" :class="{ 'active' : showOverview}">
                  <div class="row">
                    <div class="nice-copy col-md-12">
                      <div class="block block-themed">
                        <div class="block-content">
                          <div class="block margin-b-0">
                            <vue-gallery   :images="pictures" :index="index"
                                           @close="index = null"></vue-gallery>

                            <carousel ref="cur" :per-page="1" :mouse-drag="false" :spacePadding="0" :paginationColor="'#ccc'" :navigationEnabled="true" v-on:pageChange="pageChanged">
                              <slide v-for="(image, imageIndex) in pictures" v-bind:key="imageIndex">
                                <div class="image"

                                     @click="index = imageIndex"
                                     v-bind:key="imageIndex"
                                     :style="{ 'background-image': 'url(' + image+ ')', width: '100%', height: '100%', 'background-size': '100%', 'background-repeat': 'no-repeat' }"
                                >
                                  <i class="fa fa-expand"></i>
                                  <span class="imageCount display_none" >{{imageIndex + 1}}</span>
                                </div>
                              </slide>
                            </carousel>
                            <div class="font-w600 item_title"> {{ item.title }} </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-xs-12">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter">
                          <h3 class="block-title">Price</h3>
                        </div>
                        <div class="block-content">
                          <div class="col-xs-6 bg-white">
                            <table class="table">
                              <tr>
                                <td class="text-muted">
                                  Ad-price
                                </td>
                                <td class="text-right">Missing from API</td>
                              </tr>
                              <tr class="border-bottom-none">
                                <td class="text-muted">
                                  Price / m<sup>2</sup>
                                </td>
                                <td class="text-right">Missing from API</td>
                              </tr>
                              <tr class="border-none">
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td></td>
                                <td></td>
                              </tr>
                            </table>
                          </div>
                          <div class="col-xs-6 bg-white">
                            <table class="table">
                              <tr>
                                <th  class="text-muted">
                                  Market price
                                </th>
                                <td class="text-right">Missing from API</td>
                              </tr>
                              <tr>
                                <th  class="text-muted">
                                  Price / m<sup>2</sup>
                                </th>
                                <td class="text-right">Missing from API</td>
                              </tr>
                              <tr>
                                <th  class="text-muted">
                                  Min price
                                </th>
                                <td class="text-right">Missing from API</td>
                              </tr>
                              <tr>
                                <th  class="text-muted">
                                  Max price
                                </th>
                                <td class="text-right">Missing from API</td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-xs-12">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter">
                          <h3 class="block-title">Gebäude</h3>
                        </div>
                        <div class="block-content">
                          <div class="col-xs-6">
                            <table class="table">
                              <tr>
                                <td class="text-muted">
                                  Property category
                                </td>
                                <td class="text-right" v-if="item.propertyCategory != undefined">{{ item.propertyCategory.name }}</td>
                              </tr>
                              <tr>
                                <td class="text-muted">
                                  Property type
                                </td>
                                <td class="text-right" v-if="item.propertyType != undefined">
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
                          <div class="col-xs-6">
                            <table class="table">
                              <tr>
                                <th class="text-muted">
                                  Nutzung
                                </th>
                                <td class="text-right">Wohngebäude</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Grundstück-Nummer
                                </th>
                                <td class="text-right">12331</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Objektnummer
                                </th>
                                <td class="text-right">231</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Bauzone
                                </th>
                                <td class="text-right">WG2</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Ausnutzung Ziffer
                                </th>
                                <td class="text-right">45%</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Nutzung aktuell
                                </th>
                                <td class="text-right">33%</td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- <div class="col-xs-12">
                      <hr/>
                    </div> -->

                    <div class="col-xs-12" v-if="item.contact != undefined">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter margin-b-10">
                          <h3 class="block-title pull-left">Vendor</h3>
                        </div>
                        <div class="block-content">
                          <div class="col-xs-6">
                            <table class="table">
                              <tr>
                                <td class="text-muted">
                                  Name
                                </td>
                                <td class="text-right" v-if="item.contact">{{ item.contact.name }}</td>
                              </tr>
                              <tr>
                                <td class="text-muted">
                                  Email
                                </td>
                                <td class="text-right">{{ item.contact.email }}</td>
                              </tr>
                              <tr>
                                <td class="text-muted">
                                  Address
                                </td>
                                <td class="text-right">{{ getAddress(item.contact.address) }}</td>
                              </tr>
                            </table>
                          </div>
                          <div class="col-xs-6">
                            <table class="table">
                              <tr>
                                <td class="text-muted">
                                  Verkaufertyp
                                </td>
                                <td class="text-right"></td>
                              </tr>
                              <tr>
                                <td class="text-muted">
                                  Mobile phone
                                </td>
                                <td class="text-right">{{ item.contact.mobilePhone }}</td>
                              </tr>
                              <tr>
                                <td class="text-muted">
                                  Phone
                                </td>
                                <td class="text-right">{{ item.contact.landlinePhone }}</td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-12 padding-b-20">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter">
                          <h3 class="block-title">Features</h3>
                        </div>
                        <div class="block-content">
                          <div class="col-md-6" >
                            <div class="form-group">
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Neubau
                                </label>
                              </div>
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Balkon / Terrase
                                </label>
                              </div>
                            </div>
                            <div class="form-group">
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Lift
                                </label>
                              </div>
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Washing machine
                                </label>
                              </div>
                            </div>
                            <div class="form-group">
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Parkplatz
                                </label>
                              </div>
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Tumbler
                                </label>
                              </div>
                            </div>
                            <div class="form-group">
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Karmin
                                </label>
                              </div>
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> ISDN
                                </label>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6" >
                            <div class="form-group">
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Kids friendly
                                </label>
                              </div>
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Haustiere erlaubt
                                </label>
                              </div>
                            </div>
                            <div class="form-group">
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Altersgerecht
                                </label>
                              </div>
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Rollstuhlgangig
                                </label>
                              </div>
                            </div>
                            <div class="form-group">
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Ruhig
                                </label>
                              </div>
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Okologisch
                                </label>
                              </div>
                            </div>
                            <div class="form-group">
                              <div class="col-sm-6 padding-lr-0">
                                <label class="css-input css-checkbox css-checkbox-primary font-s-12">
                                  <input type="checkbox" checked><span></span> Zentral
                                </label>
                              </div>
                              <div class="col-sm-6 padding-lr-0">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter">
                          <h3 class="block-title">Description</h3>
                        </div>
                        <div class="block-content">
                          <p class="text-left">
                            Ihr neues Zuhause der Extraklasse bietet traumhafte Aussichten in die romantische Bergkulisse. Die direkte Seelage wertet das Objekt zusätzlich auf. Verwirklichen Sie Ihren persönlichen Geschmack im Innenausbau! Das Entrée erschliesst die Ruhezone mit den drei Schlafzimmern und der Nasszelle. Der Masterbedroom bietet enormen Stauraum dank dem Ankleidebereich. Im Dachgeschoss befindet sich der grosszügige Wohn- und Essbereich, welcher durch die 62 m2 grosse Terrasse im Sommer erweitert wird. Bitte verlangen Sie unverbindlich unsere ausführliche Dokumentation…
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="col-xs-12">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter margin-b-10">
                          <h3 class="block-title pull-left">POI</h3>
                        </div>
                        <div class="block-content">
                          <div class="col-xs-6">
                            <table class="table">
                              <tr>
                                <th class="text-muted">
                                  Bus
                                </th>
                                <td class="text-right">200m</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Autobahn
                                </th>
                                <td class="text-right">1400m</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Einkauf
                                </th>
                                <td class="text-right">300m</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Kindergarten
                                </th>
                                <td class="text-right">20m</td>
                              </tr>
                              <tr class="border-none">
                                <th class="text-muted">
                                </th>
                                <td class="text-right"></td>
                              </tr>
                              <tr class="border-none">
                                <th class="text-muted">
                                </th>
                                <td class="text-right"></td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                </th>
                                <td class="text-right"></td>
                              </tr>

                            </table>
                          </div>
                          <div class="col-xs-6">
                            <table class="table">
                              <tr>
                                <th class="text-muted">
                                  Primar
                                </th>
                                <td class="text-right">100m</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Sekundar
                                </th>
                                <td class="text-right">300m</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Hochschule
                                </th>
                                <td class="text-right">50m</td>
                              </tr>
                              <tr class="border-none">
                                <th class="text-muted">
                                </th>
                                <td class="text-right"></td>
                              </tr>
                              <tr class="border-none">
                                <th class="text-muted">
                                </th>
                                <td class="text-right"></td>
                              </tr>
                              <tr class="border-none">
                                <th class="text-muted">
                                </th>
                                <td class="text-right"></td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                </th>
                                <td class="text-right"></td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab-pane" :class="{ 'active' : showHistory}">
                  <div class="row">
                    <div class="col-xs-12">
                      <div class="block block-themed">
                        <div class="block-content">
                          <div class="block">

                            <div class="col-md-12">

                              <table class="table">
                                <tr class="border-none">
                                  <td class="font-w600 padding-0 padding-b-10">
                                    Preisänderungen
                                  </td>
                                  <td>

                                  </td>
                                </tr>
                                <tr class="border-none">

                                  <td class="text-right">
                                    <area-chart :data="chart_data" :colors="['#ebebeb']"></area-chart>
                                  </td>
                                </tr>

                              </table>
                            </div>

                          </div>
                          <div class="block">
                            <div class="col-md-12">
                            </div>
                          </div>

                          <div class="block">
                            <div class="col-md-12">
                              <hr/>
                            </div>
                          </div>

                          <div class="block">
                            <div class="col-md-6" >

                              <table class="table">
                                <tr>
                                  <td class="font-w600 padding-0">
                                    Immobilienportale
                                  </td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <th>
                                    Homegate
                                  </th>
                                  <td class="text-right">
                                    <span class="green">51 Tage</span>
                                  </td>
                                </tr>

                                <tr>
                                  <th>
                                    Immoscout
                                  </th>
                                  <td class="text-right">
                                    <span class="green">61 Tage</span>
                                  </td>
                                </tr>

                                <tr>
                                  <th>
                                    Newhome
                                  </th>
                                  <td class="text-right">
                                    <span class="green">115 Tage</span>
                                  </td>
                                </tr>

                                <tr>
                                  <th>
                                    Immostreet
                                  </th>
                                  <td class="text-right">
                                    <span class="green">90 Tage</span>
                                  </td>
                                </tr>
                                <tr>
                                  <th>
                                    homestreet
                                  </th>
                                  <td class="text-right">
                                    <span class="green">na</span>
                                  </td>
                                </tr>

                                <tr>
                                  <th>
                                    Homegate empfohlen
                                  </th>
                                  <td class="text-right">
                                    <span class="green"></span>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <div class="block">
                              <div class="col-md-6" >

                                <table class="table">
                                  <tr>
                                    <td class="blue font-w600 padding-0">
                                      Inserate Historie
                                    </td>
                                    <td></td>
                                  </tr>

                                  <tr>
                                    <td class="padding-0">
                                      Aktuell
                                    </td>
                                    <td class="text-right"><span class="green">55</span></td>
                                  </tr>

                                  <tr>
                                    <td class="padding-0">
                                      Letze 24 Monate
                                    </td>
                                    <td class="text-right"><span class="green">183</span></td>
                                  </tr>

                                  <tr>
                                    <td class="padding-0">
                                      Letzte 60 Monate
                                    </td>
                                    <td class="text-right"><span class="green">255</span></td>
                                  </tr>
                                </table>
                              </div>
                            </div>
                          </div>

                          <div class="block">
                            <div class="col-md-12">
                              <hr/>
                            </div>
                          </div>

                          <div class="block">
                            <div class="col-md-12">

                              <table class="table">
                                <tr class="border-none">
                                  <td class="font-w600 padding-0 padding-b-10">
                                    <span class="green">Plattformänderung</span>
                                  </td>
                                  <td>

                                  </td>
                                </tr>
                                <tr class="border-none">

                                  <td class="text-right">
                                    <column-chart :data="chart_data" :colors="['#ebebeb']"></column-chart>
                                  </td>
                                </tr>

                              </table>
                            </div>
                          </div>

                          <div class="block">
                            <div class="col-md-12">

                              <table class="table">

                                <tr>
                                  <th class="blue">
                                    Laufdauer Inserat
                                  </th>
                                </tr>
                              </table>
                            </div>
                            <div class="col-md-6 g">
                              <radial-progress-bar :diameter="100" :startColor="'#ace182'" :stopColor="'#ace182'"
                                                   :strokeWidth="5" :innerStrokeColor="'#ebebeb'"
                                                   :completed-steps="completedSteps0"
                                                   :total-steps="totalSteps">
                                <span>80%</span>

                              </radial-progress-bar>
                              <h2>Preis</h2>
                            </div>
                            <div class="col-md-6 g">
                              <radial-progress-bar :diameter="100" :startColor="'#ace182'" :stopColor="'#ace182'"
                                                   :strokeWidth="5" :innerStrokeColor="'#ebebeb'"
                                                   :completed-steps="completedSteps0"
                                                   :total-steps="totalSteps">
                                <span>80%</span>

                              </radial-progress-bar>
                              <h2>Gemeinde</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
<style lang="scss" scoped>

  .sidebar-fixed {
    background-color: #fff;
    width: 650px !important;
    right: 0px !important;
    position: fixed;
    top: 0px;
    z-index: 4999;
    -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    overflow-y: auto !important;
    height: 100%;

  }

  .VueCarousel-slide {
    height: 370px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }

  .green {
    color: #269a45;
    font-weight: 600;
  }

  .blue {
    color: #34c0dd;
    font-weight: 600;
  }

  .grey {
    color: #918f8f;
    font-weight: 600;
  }

  tr {
    border-bottom: 1px solid #ebebeb;
    td {
      padding: 5px;
    }
  }

  tr:last-child {
    border: none;
  }

  .g .col-md-3 {
    padding: 0;

    h2 {
      text-align: center;
      font-size: 18px;
    }
  }
  .g{
    h2 {
      text-align: center;
      font-size: 18px;
    }
  }

  h2 {
    margin-bottom: 30px;
    margin-top: 10px;
  }
  th{
    font-weight: normal;
  }
  .pullRight {
    margin-left: 85px !important;
  }
  .headerIcons {
    font-size: 32px;
    cursor: pointer;
  }
  .imageCount {
    position: relative;
    float: left;
    top: 152px;
    left: 7px;
    color: white;
    font-size: 20px;
  }
</style>
<style lang="scss">
  .vue-slider-component .vue-slider {
    border-radius: 0px !important;
    background: #fff;
    background-color: #fff !important;
    border: 1px solid #ebebeb;
  }

  .vue-slider-process {
    border-radius: 0px !important;
  }

  .vue-slider-component .vue-slider {
    border-radius: 0;
  }

  .radial-progress-container {
    margin: 0 auto;
  }
  .image{
    cursor: pointer;
    i{
      float: right;
      margin-top: 8px;
      margin-right: 8px;
      color: #fff;
      cursor: pointer;
    }
    i:hover{
      color: orange;
    }
  }
  .nav-tabs li{
    cursor: pointer;
  }
  .item_title{
    font-size: 15px; margin-top: 10px;
  }
</style>
