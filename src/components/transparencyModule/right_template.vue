<template>
  <div>
    <aside id="sidebar-fixed" class="active">
      <button @click="toggleSideBar()" class="btn btn-default side-overlay--button" type="button">
        <i class="fa fa-arrow-right"></i>
      </button>
      <div v-bar>
        <div id="side-overlay-scroll" class="widthAuto">
          <div class="side-header side-content ">
            <div class="col-md-11">
              <img class="img-avatar img-avatar32" src="/static/img/icons/house.png" v-bind:alt="transparency_address.name">
              <span class="font-w600 push-10-l">{{ transparency_address.name }} </span>
            </div>
          </div>
          <div class="side-header side-content padding-t-0">
            <div class="block pull-r-l border-t margin-b-0">
              <ul class="nav nav-tabs nav-tabs-alt nav-justified">
                <li>
                  <a type="button" class="headerIcons has-tooltip">
                    <i aria-hidden="true" tabindex="1" v-bind:class="{'fa fa-star': isAddressBookmarked(transparency_address),  'fa fa-star-o': !isAddressBookmarked(transparency_address)}" v-on:click="bookmark(transparency_address)"></i>
                  </a>
                </li>
                <li>
                  <a type="button" class="headerIcons has-tooltip">
                    <i aria-hidden="true" tabindex="1" class="fa fa-print" v-on:click="print_(transparency_address)"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="side-content remove-padding-t">
            <div class="block pull-r-l">
              <ul class="nav nav-tabs nav-tabs-alt nav-justified" data-toggle="tabs">
                <li :class="{ 'active' : showZero}">
                  <a type="button" @click="show(0)">Overview</a>
                </li>
                <li :class="{ 'active' : showOne}">
                  <a type="button" @click="show(1)">Analytics</a>
                </li>
              </ul>
              <div class="block-content tab-content">
                <div class="tab-pane" :class="{ 'active' : showZero}">
                  <div class="row">
                    <div class="nice-copy col-md-12">
                      <div class="block block-themed">
                        <div class="block-content">
                          <div class="block margin-b-0">
                            <vue-gallery :images="galleryImages" :index="index" @close="index = null"></vue-gallery>

                            <carousel ref="cur" :per-page="1" :mouse-drag="false" :spacePadding="0" :paginationColor="'#ccc'" :navigationEnabled="true" v-on:pageChange="pageChanged">
                              <slide v-for="(image, imageIndex) in galleryImages" v-bind:key="imageIndex">
                                <div class="image" @click="index = imageIndex" v-bind:key="imageIndex" :style="{ backgroundImage: 'url(http://axresources.azurewebsites.net/image/get/' + image + '/?mw=500&mh=500&q=90)', width: '100%', height: '100%', 'background-size': '100%', 'background-repeat': 'no-repeat' }">
                                  <i class="fa fa-expand"></i>
                                </div>
                              </slide>
                            </carousel>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="print">
                    <div class="col-xs-12">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter">
                          <h3 class="block-title">Gebäude</h3>
                        </div>
                        <div class="block-content">
                          <div class="col-md-6">

                            <table class="table">

                              <tr>
                                <th class="text-muted">
                                  Objektkategorie
                                </th>
                                <td class="text-right">Wohnung</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Objekttyp
                                </th>
                                <td class="text-right">Loft</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Zimmer
                                </th>
                                <td class="text-right">5</td>
                              </tr>

                              <tr>
                                <th class="text-muted">
                                  Floors
                                </th>
                                <td class="text-right">{{object.floors}}</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Wohnfläche
                                </th>
                                <td class="text-right">110m2</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Grundstückfläche
                                </th>
                                <td class="text-right">324m2</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Baujahr
                                </th>
                                <td class="text-right" v-if="object.buildingPhase">{{object.buildingPhase.from.getFullYear()}}</td>
                              </tr>

                            </table>
                          </div>

                          <div class="col-md-6">

                            <table class="table">
                              <tr>
                                <td class="font-w600 padding-0 padding-b-30">

                                </td>
                                <td></td>
                              </tr>
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

                    <div class="col-xs-12">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter">
                          <h3 class="block-title">Ausgewogen</h3>
                        </div>
                        <div class="block-content">
                          <div class="col-xs-12" >
                            <vue-slider ref="slider" v-bind="slider_props" :max="100" :min="0" :interval="1"></vue-slider>
                          </div>

                          <div class="col-xs-12 margin-b-20">
                            <span class="pull-left blue">Nachfragemarkt</span>
                            <span class="pull-right  green">Angebotsmarkt</span>
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

                          <div class="col-md-6">

                            <table class="table">
                              <tr>
                                <th class="text-muted">
                                  Preiserwartung
                                </th>
                                <td></td>
                              </tr>
                              <tr>
                                <th class="green text-muted">
                                  Marktpreis
                                </th>
                                <td class="green text-right">1’234’567</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Preis / m2
                                </th>
                                <td class="text-right">14’398</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Mindestwert
                                </th>
                                <td class="text-right">1’198’213</td>
                              </tr>
                              <tr>
                                <th class="text-muted">
                                  Maximalwert
                                </th>
                                <td class="text-right">1’249’231</td>
                              </tr>

                            </table>
                          </div>

                          <div class="col-md-6">

                            <table class="table">
                              <tr>
                                <th class="text-muted" >POI</th>
                                <td></td>
                              </tr>
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

                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xs-12">
                      <div class="block pull-r-l">
                        <div class="block-header bg-gray-lighter margin-b-10">
                          <h3 class="block-title pull-left">Vendor</h3>
                        </div>
                        <div class="block-content">
                          <div class="col-xs-12">

                            <table class="table">

                              <tr>
                                <th class="blue text-muted">
                                  Preisvergleich
                                </th>
                              </tr>
                            </table>
                          </div>
                          <div class="col-md-6 g">
                            <radial-progress-bar :diameter="100" :startColor="'#ace182'" :stopColor="'#ace182'" :strokeWidth="5" :innerStrokeColor="'#ebebeb'" :completed-steps="completedSteps0" :total-steps="totalSteps">
                              <span>80%</span>

                            </radial-progress-bar>
                            <h2>Bezirk</h2>
                          </div>
                          <div class="col-md-6 g">
                            <radial-progress-bar :diameter="100" :startColor="'#f8b187'" :stopColor="'#f8b187'" :strokeWidth="5" :innerStrokeColor="'#ebebeb'" :completed-steps="completedSteps3" :total-steps="totalSteps">
                              <span>25%</span>

                            </radial-progress-bar>
                            <h2>Gemeinde</h2>
                          </div>
                        </div>
                      </div>
                    </div>

                    </div>
                  </div>
                </div>
                <div class="tab-pane" :class="{ 'active' : showOne}">
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
                            <div class="col-md-6">

                              <table class="table">
                                <tr>
                                  <td>
                                    Immobilienportale
                                  </td>
                                  <td></td>
                                </tr>
                                <tr>
                                  <th class="text-muted">
                                    Homegate
                                  </th>
                                  <td class="text-right">
                                    <span class="green">51 Tage</span>
                                  </td>
                                </tr>

                                <tr>
                                  <th class="text-muted">
                                    Immoscout
                                  </th>
                                  <td class="text-right">
                                    <span class="green">61 Tage</span>
                                  </td>
                                </tr>

                                <tr>
                                  <th class="text-muted">
                                    Newhome
                                  </th>
                                  <td class="text-right">
                                    <span class="green">115 Tage</span>
                                  </td>
                                </tr>

                                <tr>
                                  <th class="text-muted">
                                    Immostreet
                                  </th>
                                  <td class="text-right">
                                    <span class="green">90 Tage</span>
                                  </td>
                                </tr>
                                <tr>
                                  <th class="text-muted">
                                    homestreet
                                  </th>
                                  <td class="text-right">
                                    <span class="green">na</span>
                                  </td>
                                </tr>

                                <tr>
                                  <th class="text-muted">
                                    Homegate empfohlen
                                  </th>
                                  <td class="text-right">
                                    <span class="green"></span>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <div class="block">
                              <div class="col-md-6">

                                <table class="table">
                                  <tr>
                                    <td class="blue">
                                      Inserate Historie
                                    </td>
                                    <td></td>
                                  </tr>

                                  <tr>
                                    <td class="text-muted">
                                      Aktuell
                                    </td>
                                    <td class="text-right">
                                      <span class="green">55</span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td class="text-muted">
                                      Letze 24 Monate
                                    </td>
                                    <td class="text-right">
                                      <span class="green">183</span>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td class="text-muted">
                                      Letzte 60 Monate
                                    </td>
                                    <td class="text-right">
                                      <span class="green">255</span>
                                    </td>
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
                                    <span class="green">Gesamtanzahl Angebote</span>
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
#sidebar-fixed {
  background-color: #fff;
  border-left: 1px solid #e1e1e1;
  width: 650px !important;
  right: 0px !important;
  position: fixed;
  top: 0px;
  z-index: 2000;
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
.g {
  h2 {
    text-align: center;
    font-size: 18px;
  }
}

h2 {
  margin-bottom: 30px;
  margin-top: 10px;
}
th {
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
<style lang="scss" scoped>
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
.image {
  cursor: pointer;
  i {
    float: right;
    margin-top: 8px;
    margin-right: 8px;
    color: #fff;
    cursor: pointer;
  }
  i:hover {
    color: orange;
  }
}
.nav-tabs li {
  cursor: pointer;
}
.side-overlay--button {
  height: 80px;
  position: absolute;
  // top: calc(56% - 64px);
  border: 1px solid #e1e1e1;
  left: -76px;
  transform: translateX(100%);
  top: 60px;
  i {
    position: relative;
    transition: all 0.22s ease;
    transform: rotate(180deg);
  }
}
</style>
