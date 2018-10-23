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
              <img class="img-avatar img-avatar32" src="/static/img/icons/house.png"
                   v-bind:alt="marketRadarSearchedAddress.name">
              <span class="font-w600 push-10-l">{{ marketRadarSearchedAddress.name }} </span>
            </div>
          </div>
          <div class="side-header side-content padding-t-0">
            <div class="block pull-r-l border-t margin-b-0">
              <ul class="nav nav-tabs nav-tabs-alt nav-justified">
                <li>
                  <a type="button" class="headerIcons has-tooltip">
                    <i aria-hidden="true" tabindex="1"
                       v-bind:class="{'fa fa-star': isAddressBookmarked(marketRadarSearchedAddress),  'fa fa-star-o': !isAddressBookmarked(marketRadarSearchedAddress)}"
                       v-on:click="bookmark(marketRadarSearchedAddress)"></i>
                  </a>
                </li>
                <li>
                  <a type="button" class="headerIcons has-tooltip">
                    <i aria-hidden="true" tabindex="1" class="fa fa-print"
                       v-on:click="print_(marketRadarSearchedAddress)"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="side-content remove-padding-t">
            <div class="block pull-r-l">
              <ul class="nav nav-tabs nav-tabs-alt nav-justified">
                <li v-on:click="toggle('overview')" v-bind:class="{active: tabs['overview']}">
                  <a>Overview</a>
                </li>
                <li v-on:click="toggle('similar')" v-bind:class="{active: tabs['similar']}">
                  <a>Similar objects</a>
                </li>
                <li v-on:click="toggle('analytics')" v-bind:class="{active: tabs['analytics']}">
                  <a>Analytics</a>
                </li>
              </ul>
              <div class="block-content ">
                <div>
                  <div class="tab-content">
                    <div class="tab-pane" v-bind:class="{active: tabs['overview']}">
                      <div class="row">
                        <div class="nice-copy col-md-12">
                          <div class="block block-themed">
                            <div class="block-content">
                              <div class="block margin-b-0">
                                <vue-gallery :images="galleryImages" :index="galleryIndex"
                                             @close="galleryIndex = null"></vue-gallery>

                                <carousel ref="cur" :per-page="1" :mouse-drag="false" :spacePadding="0"
                                          :paginationColor="'#ccc'" :navigationEnabled="true"
                                          v-on:pageChange="pageChanged">
                                  <slide v-for="(image, imageIndex) in galleryImages" v-bind:key="imageIndex">
                                    <div class="image" @click="index = imageIndex" v-bind:key="imageIndex"
                                         :style="{ backgroundImage: 'url(http://axresources.azurewebsites.net/image/get/' + image + '/?mw=500&mh=500&q=90)', width: '100%', height: '100%', 'background-size': '100%', 'background-repeat': 'no-repeat' }">
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
                                      <td class="text-right">1</td>
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
                                      <td class="text-right">1944</td>
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
                                <div class="col-xs-12">
                                  <vue-slider ref="slider" v-bind="sliderProps" :max="100" :min="0"
                                              :interval="1"></vue-slider>
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
                                      <th class="text-muted">POI</th>
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
                        </div>
                      </div>
                    </div>
                    <div class="tab-pane" v-bind:class="{active: tabs['similar']}">
                      similar objects
                    </div>
                    <div class="tab-pane" v-bind:class="{active: tabs['analytics']}">

                      <div class="col-xs-12">
                        <div class="block pull-r-l">

                          <div class="block-content">

                            <div class="col-md-3 g">
                              <radial-progress-bar :diameter="100" :startColor="'#ace182'" :stopColor="'#ace182'" :strokeWidth="5" :innerStrokeColor="'#ebebeb'" :completed-steps="completedSteps0" :total-steps="totalSteps">
                                <span>{{completedSteps0}}%</span>

                              </radial-progress-bar>
                              <h2>Situation & Transport</h2>
                            </div>
                            <div class="col-md-3 g">
                              <radial-progress-bar :diameter="100" :startColor="'#f8b187'" :stopColor="'#f8b187'" :strokeWidth="5" :innerStrokeColor="'#ebebeb'" :completed-steps="completedSteps1" :total-steps="totalSteps">
                                <span>{{completedSteps1}}%</span>

                              </radial-progress-bar>
                              <h2>Leisure & Education</h2>
                            </div>
                            <div class="col-md-3 g">
                              <radial-progress-bar :diameter="100" :startColor="'#f8b187'" :stopColor="'#f8b187'" :strokeWidth="5" :innerStrokeColor="'#ebebeb'" :completed-steps="completedSteps2" :total-steps="totalSteps">
                                <span>{{completedSteps2}}%</span>

                              </radial-progress-bar>
                              <h2>Shopping</h2>
                            </div>
                            <div class="col-md-3 g">
                              <radial-progress-bar :diameter="100" :startColor="'#f8b187'" :stopColor="'#f8b187'" :strokeWidth="5" :innerStrokeColor="'#ebebeb'" :completed-steps="completedSteps3" :total-steps="totalSteps">
                                <span>{{completedSteps3}}%</span>

                              </radial-progress-bar>
                              <h2>Immissionen</h2>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                      <div class="col-xs-12">
                        <div class="block pull-r-l">
                          <div class="block-header bg-gray-lighter margin-b-10">
                            <h3 class="block-title pull-left">Situation & Transport</h3>
                          </div>
                          <div class="block-content">
                            <div class="table-responsive">
                              <table class="table table-borderless">
                                <tr>
                                  <td class="width10percent"><i class="fa fa-sun-o" style="color: yellow; font-size: 40px"></i></td>
                                  <td class="width20percent">
                                    14h <i class="fa fa-info-circle"></i> <br />
                                    Sonnenscheindauer im Sommer
                                  </td>
                                  <td>
                                    <span style="font-size: 11px">Sonnenscheindauer im Sommer</span><br />
                                    <img src="/static/img/graph1.png" width="200">
                                  </td>
                                  <td>
                                    <h4 class="margin-b-17">Nachstgelegene Anschlusse</h4>
                                    <div style="border-left: 3px solid #ebebeb; padding-left: 10px">29m <br />
                                    Offentlicher Verkehr
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>

                      <div class="row">
                        <div class="col-xs-12">
                          <div class="block pull-r-l">
                            <div class="block-header bg-gray-lighter margin-b-10">
                              <h3 class="block-title pull-left">Leisure & Education</h3>
                            </div>
                            <div class="block-content">
                              <div class="table-responsive">
                                <table class="table table-borderless">
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-book"></i> Library 100m</td>
                                    <td><i class="fa fa-group"></i> Playground 100m</td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-graduation-cap"></i> Kindergarten 100m</td>
                                    <td><i class="fa fa-group"></i> Playground 100m</td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-group"></i> Playground 100m</td>
                                    <td><i class="fa fa-graduation-cap"></i> Primary 100m</td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-graduation-cap"></i> Secondary 100m</td>
                                    <td><i class="fa fa-group"></i> Playground 100m</td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-graduation-cap"></i> University 100m</td>
                                    <td><i class="fa fa-group"></i> Playground 100m</td>
                                  </tr>
                                </table>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-xs-12">
                          <div class="block pull-r-l">
                            <div class="block-header bg-gray-lighter margin-b-10">
                              <h3 class="block-title pull-left">Shopping</h3>
                            </div>
                            <div class="block-content">
                              <div class="table-responsive">
                                <table class="table table-borderless">
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-shopping-cart"></i> Schuhe 100m</td>
                                    <td><i class="fa fa-shopping-cart"></i> Elektro 100m</td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-shopping-cart"></i> Kleider 100m</td>
                                    <td><i class="fa fa-shopping-cart"></i> Schuhe 100m</td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-shopping-cart"></i> Volg 100m</td>
                                    <td><i class="fa fa-shopping-cart"></i> Coop 100m</td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-shopping-cart"></i> Migros 100m</td>
                                    <td><i class="fa fa-shopping-cart"></i> Coop 100m</td>
                                  </tr>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xs-12">
                          <div class="block pull-r-l">
                            <div class="block-header bg-gray-lighter margin-b-10">
                              <h3 class="block-title pull-left">Immissionen</h3>
                            </div>
                            <div class="block-content">
                              <div class="table-responsive">
                                <table class="table table-borderless">
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-bus"></i> Eisenbahn Tag</td>
                                    <td><i class="fa fa-sun-o"></i></td>
                                    <td><i class="fa fa-soundcloud"></i> 29db</td>
                                    <td>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star-o"></i>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-bus"></i> Eisenbahn Tag</td>
                                    <td><i class="fa fa-sun-o"></i></td>
                                    <td><i class="fa fa-soundcloud"></i> 25db</td>
                                    <td>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-car"></i> Strassenlärm Nacht</td>
                                    <td><i class="fa fa-sun-o"></i></td>
                                    <td><i class="fa fa-soundcloud"></i> 40db</td>
                                    <td>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star-o"></i>
                                      <i class="fa fa-star-o"></i>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="width50percent"><i class="fa fa-car"></i> Strassenlärm Nacht</td>
                                    <td><i class="fa fa-sun-o"></i></td>
                                    <td><i class="fa fa-soundcloud"></i> 38db</td>
                                    <td>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star"></i>
                                      <i class="fa fa-star-o"></i>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xs-12">
                          <div class="block pull-r-l">
                            <div class="block-header bg-gray-lighter margin-b-10">
                              <h3 class="block-title pull-left">Other</h3>
                            </div>
                            <div class="block-content">
                              <div class="table-responsive">
                                <table class="table table-borderless">
                                  <tr>
                                    <td class="width60percent"><i class="fa fa-bomb"></i> Kernkraftwerk Leibstadt - Kernkraftwerk</td>
                                    <td class="text-right"> <i class="fa fa-map-marker"></i> 33.8 km</td>
                                  </tr>
                                  <tr>
                                    <td class="width60percent"><i class="fa fa-bomb"></i> Kernkraftwerk Gosgen - Kernkraftwerk</td>
                                    <td class="text-right"> <i class="fa fa-map-marker"></i> 41.8 km</td>
                                  </tr>

                                  <tr>
                                    <td class="width60percent"><i class="fa fa-bomb"></i> Kernkraftwerk Muhleberg - Kernkraftwerk</td>
                                    <td class="text-right"> <i class="fa fa-map-marker"></i> 105.8 km</td>
                                  </tr>
                                  <tr>
                                    <td class="width60percent"><i class="fa fa-mobile"></i> Mobilfunkmast</td>
                                    <td class="text-right"> <i class="fa fa-map-marker"></i> 105.8 km</td>
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
  /*.vb-content {
    height: calc(100vh - 250px) !important;
  }*/

</style>
