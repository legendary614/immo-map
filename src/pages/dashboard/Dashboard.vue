<template>
  <main id="main-container">
    <div class="bg-image overflow-hidden bg-custom">
      <div class="bg-black-op">
        <div class="content content-narrow">
          <div class="block block-transparent">
            <div class="block-content block-content-full">
              <h1 class="h1 font-w300 text-white animated fadeInDown push-50-t push-5">Dashboard</h1>
              <h2 class="h4 font-w300 text-white-op animated fadeInUp">Welcome {{ userName }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-bar>
      <div>
        <div class="content content-narrow border-b push-30-t ">
          <div class="row items-push text-uppercase">
            <div class="col-xs-6 col-sm-4 animated fadeIn">
              <div class="block  bg-white" >
                <div class="block-header">
                  <ul class="block-options">
                    <li>
                      <button type="button" data-toggle="block-option" data-action="refresh_toggle"
                              data-action-mode="demo"><i class="si si-refresh"></i></button>
                    </li>
                  </ul>
                  <h3 class="block-title">ANZAHL INSERATE TOTAL</h3>
                </div>
                <div class="block-content block-content-full text-center bg-gray-lighter">
                  <div >

                    <pie-chart :data="chartData" :colors="['#f9da83', '#77b1e9', '#ace182']"></pie-chart>

                  </div>
                </div>
                <div class="block-content text-center">
                  <div class="row items-push text-center">
                    <div class="col-xs-6 col-lg-4">
                      <div class="h5 font-w300 text-muted">{{format_money(125231)}}<br/>FIRMENKUNDEN</div>
                    </div>
                    <div class="col-xs-6 col-lg-4">
                      <div class="h5 font-w300 text-muted">{{format_money(125231)}}<br/>UNKNOWN</div>
                    </div>
                    <div class="col-xs-6 col-lg-4">
                      <div class="h5 font-w300 text-muted">{{format_money(4503)}}<br/>VATKUNDEN</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xs-6 col-sm-4 animated fadeIn">
              <div class="block  bg-white">
                <div class="block-header">
                  <ul class="block-options">
                    <li>
                      <button type="button" data-toggle="block-option" data-action="refresh_toggle"
                              data-action-mode="demo"><i class="si si-refresh"></i></button>
                    </li>
                  </ul>
                  <h3 class="block-title">ANZAHL NEUE INSERATE PRO TAG</h3>
                </div>
                <div class="block-content block-content-full text-center bg-gray-lighter">
                  <div>

                    <area-chart :data="chartData0" :colors="['#ace182', '#ebebeb', '#f4f4f4']"></area-chart>

                  </div>
                </div>
                <div class="block-content text-center">
                  <div class="row items-push text-center">
                    <div class="col-xs-6 col-lg-6">
                      <div class="h5 font-w300 text-muted">{{format_money(125231)}}<br/>RENT</div>
                    </div>
                    <div class="col-xs-6 col-lg-6">
                      <div class="h5 font-w300 text-muted">{{format_money(125231)}}<br/>BUY</div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div class="col-xs-6 col-sm-4 animated fadeIn">
              <div class="block  bg-white">
                <div class="block-header">
                  <ul class="block-options">
                    <li>
                      <button type="button" data-toggle="block-option" data-action="refresh_toggle"
                              data-action-mode="demo"><i class="si si-refresh"></i></button>
                    </li>
                  </ul>
                  <h3 class="block-title">DURCHSCHNITTSPREIS</h3>
                </div>
                <div class="block-content block-content-full text-center bg-gray-lighter">
                  <div >

                    <column-chart :data="chart_data1" :colors="['#ace182', '#ebebeb']"></column-chart>

                  </div>
                </div>
                <div class="block-content text-center">
                  <div class="row items-push text-center">
                    <div class="col-xs-6 col-lg-6">
                      <div class="h5 font-w300 text-muted">CHF {{format_money(14231)}}/m<sup>2</sup><br/>HAUS</div>
                    </div>
                    <div class="col-xs-6 col-lg-6">
                      <div class="h5 font-w300 text-muted">CHF {{format_money(13162)}}/m<sup>2</sup><br/>WOHNUNG</div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </main>
</template>
<style scoped>
  .vb-content {
    height: calc(100vh - 160px) !important;
  }
  .bg-custom{
    background-image: url('/static/img/photos/photo_bg.jpg');
  }
</style>
